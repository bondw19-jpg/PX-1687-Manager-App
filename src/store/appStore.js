import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Returns only the first name (first word) from a full name string
function firstName(str) {
  if (!str) return 'Unknown';
  return str.trim().split(/\s+/)[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-RECOVERY: if primary storage is missing, restore from rolling backup
// ─────────────────────────────────────────────────────────────────────────────
(function recoverStorageIfNeeded() {
  try {
    if (!localStorage.getItem('panda-manager-storage')) {
      const backup = localStorage.getItem('panda-manager-backup');
      if (backup) {
        console.log('[PandaStore] 🔄 Restoring from backup...');
        localStorage.setItem('panda-manager-storage', backup);
      }
    }
  } catch {}
})();

// ─────────────────────────────────────────────────────────────────────────────
// SAFE STORAGE: writes to both primary key and a rolling backup key
// ─────────────────────────────────────────────────────────────────────────────
function createBackupStorage() {
  return {
    getItem: (name) => {
      try {
        const raw = localStorage.getItem(name);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    },
    setItem: (name, value) => {
      try {
        const s = JSON.stringify(value);
        localStorage.setItem(name, s);
        localStorage.setItem('panda-manager-backup', s); // rolling backup
      } catch (e) {
        console.warn('[PandaStore] Storage quota warning:', e?.message);
      }
    },
    removeItem: (name) => {
      try { localStorage.removeItem(name); } catch {}
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const defaultContacts = [
  { id: 'contact_1', name: 'District Manager',  role: 'District Manager',  phone: '', email: '', description: 'Add your DM contact info',        icon: 'building' },
  { id: 'contact_2', name: 'Health Department',  role: 'Health Department', phone: '', email: '', description: 'Local health inspection contact',   icon: 'hospital' },
  { id: 'contact_3', name: 'Panda Corporate HR', role: 'HR',               phone: '1-800-877-8988', email: 'hr@pandaexpress.com', description: 'Corporate HR line', icon: 'hr' },
  { id: 'contact_4', name: 'IT Support',         role: 'IT Support',       phone: '', email: '', description: 'Add IT support contact info',       icon: 'computer' },
];

const openingChecklist = [
  'Unlock & secure building, check exterior', 'Check alarm and security system',
  'Turn on all equipment (woks, fryers, steam tables)', 'Complete food safety temperature log',
  'Prep all required menu items per par levels', 'Set up front line with hot & cold food',
  'Stock serving utensils, trays, napkins, chopsticks', 'Set up drinks station (fountain, cups, lids, straws)',
  'Sanitize prep surfaces, line, and register area', 'Count and verify cash drawer',
  'Check online order tablets & kiosk operational', 'Verify team assignments and positions',
  'Confirm uniform compliance for all associates', "Brief team on daily specials and 86'd items",
  'Confirm manager on duty contact info posted',
];
const midChecklist = [
  'Check all food temperatures (hot & cold)', 'Restock front line items as needed',
  'Verify drink station supplies (cups, lids, straws)', 'Review and enforce break schedule',
  'Check dining room cleanliness', 'Restock napkins, utensils, chopsticks',
  'Monitor online order queue and tablets', 'Check restroom cleanliness and supplies',
  'Review labor and sales performance', 'Conduct mid-shift food safety check',
  'Confirm all equipment functioning properly', 'Address any customer complaints or issues',
];
const closingChecklist = [
  'Count and verify cash drawer & safe', 'Complete end-of-day sales report',
  'Shut down all cooking equipment safely', 'Cool and properly store all food items',
  'Complete thorough kitchen cleaning', 'Mop all floor areas',
  'Empty and clean all trash cans', 'Sanitize all prep surfaces and equipment',
  'Secure all doors and windows', 'Set alarm system',
  'Complete closing manager log', 'Verify all team members have clocked out',
  'Submit daily report to district manager',
];

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────
export const useAppStore = create(
  persist(
    (set, get) => {

      // ── Firestore write helpers ─────────────────────────────────────────────
      // Each helper checks dbMode first — if not 'firestore', it's a no-op.
      // The dynamic import is cached by the browser after the first call.
      // Shared collection helpers (stores/store_1687/…)
      const fsWrite = (coll, id, data) => {
        if (get().dbMode !== 'firestore') return;
        import('../lib/firestoreSync')
          .then(({ fsSetItem }) => fsSetItem(coll, id, data))
          .catch(() => {});
      };
      const fsUpdate = (coll, id, data) => {
        if (get().dbMode !== 'firestore') return;
        import('../lib/firestoreSync')
          .then(({ fsUpdateItem }) => fsUpdateItem(coll, id, data))
          .catch(() => {});
      };
      const fsDel = (coll, id) => {
        if (get().dbMode !== 'firestore') return;
        import('../lib/firestoreSync')
          .then(({ fsDeleteItem }) => fsDeleteItem(coll, id))
          .catch(() => {});
      };
      // Private user collection helpers (users/{uid}/…)
      // IMPORTANT: Private writes go to Firestore whenever the user is a real
      // signed-in account — regardless of dbMode. This ensures:
      // 1. PWA context (which starts in 'local' mode until auto-connect fires)
      //    still writes private notes to Firestore immediately.
      // 2. Writes that happen before the 800ms auto-connect delay still persist.
      // The firestoreSync module is lazy-loaded and has its own connection logic.
      const isRealUser = () => {
        const uid = get().user?.uid;
        return uid && uid !== 'demo_user';
      };
      const fsWritePrivate = (coll, id, data) => {
        if (!isRealUser()) return;
        const uid = get().user.uid;
        import('../lib/firestoreSync')
          .then(({ fsSetPrivateItem }) => fsSetPrivateItem(coll, id, data, uid))
          .catch(() => {});
      };
      const fsUpdatePrivate = (coll, id, data) => {
        if (!isRealUser()) return;
        const uid = get().user.uid;
        import('../lib/firestoreSync')
          .then(({ fsUpdatePrivateItem }) => fsUpdatePrivateItem(coll, id, data, uid))
          .catch(() => {});
      };
      const fsDelPrivate = (coll, id) => {
        if (!isRealUser()) return;
        const uid = get().user.uid;
        import('../lib/firestoreSync')
          .then(({ fsDeletePrivateItem }) => fsDeletePrivateItem(coll, id, uid))
          .catch(() => {});
      };

      return {
      // ── Auth / Store Info ─────────────────────────────────────────────────
      user: null,
      storeId: 'store_1687',
      storeName: 'PANDA EXPRESS 1687',
      isOnline: true,
      setUser:      (user) => set({ user }),
      setStoreId:   (id)   => set({ storeId: id }),
      setStoreName: (name) => set({ storeName: name }),
      setOnline:  (v)    => set({ isOnline: v }),

      // ── Note attachment upload tracking ───────────────────────────────────
      // noteUploads: { [noteId]: { noteTitle, files: [{name, pct, done, error}], allDone } }
      noteUploads: {},
      _startNoteUpload: (noteId, noteTitle, fileNames) => {
        set(s => ({
          noteUploads: {
            ...s.noteUploads,
            [noteId]: {
              noteTitle,
              files: fileNames.map(name => ({ name, pct: 0, done: false, error: false })),
              allDone: false,
            },
          },
        }));
      },
      _updateNoteUploadFile: (noteId, fileName, pct, done = false, error = false, errorMsg = '') => {
        set(s => {
          const entry = s.noteUploads[noteId];
          if (!entry) return {};
          const files = entry.files.map(f =>
            f.name === fileName ? { ...f, pct: done ? 100 : pct, done, error, errorMsg } : f
          );
          const allDone = files.every(f => f.done || f.error);
          return { noteUploads: { ...s.noteUploads, [noteId]: { ...entry, files, allDone } } };
        });
      },
      _clearNoteUpload: (noteId) => {
        set(s => {
          const uploads = { ...s.noteUploads };
          delete uploads[noteId];
          return { noteUploads: uploads };
        });
      },

      // ── Associates ────────────────────────────────────────────────────────
      associates: [],
      addAssociate: (a) => {
        const u   = get().user;
        const doc = { ...a, id: `assoc_${Date.now()}`, createdAt: new Date().toISOString(),
          createdBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null };
        set(s => ({ associates: [...s.associates, doc] }));
        fsWrite('associates', doc.id, doc);
      },
      updateAssociate: (id, d) => {
        set(s => ({ associates: s.associates.map(a => a.id === id ? { ...a, ...d } : a) }));
        fsUpdate('associates', id, d);
      },
      deleteAssociate: (id) => {
        set(s => ({ associates: s.associates.filter(a => a.id !== id) }));
        fsDel('associates', id);
      },

      // ── Work Files (SHARED — synced to Firestore when connected) ─────────
      workFiles: {},
      saveWorkFile: (associateId, fileData) => {
        const u = get().user;
        const enriched = {
          ...fileData,
          savedBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null,
        };
        set(s => ({ workFiles: { ...s.workFiles, [associateId]: enriched } }));
        if (get().dbMode === 'firestore') {
          import('../lib/firestoreSync')
            .then(({ fsSaveWorkFile }) => fsSaveWorkFile(associateId, enriched))
            .catch(() => {});
        }
      },

      // ── Call-Ins ──────────────────────────────────────────────────────────
      callIns: [],
      addCallIn: (c) => {
        const u   = get().user;
        const doc = { ...c, id: `callin_${Date.now()}`, createdAt: new Date().toISOString(),
          createdBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null };
        set(s => ({ callIns: [doc, ...s.callIns] }));
        fsWrite('callIns', doc.id, doc);

        // ── Auto Work File entry: log EVERY non-protected attendance event ──
        // Every call-in/attendance record (with points > 0) is automatically
        // written to the associate's Work File so managers always have a paper
        // trail — regardless of whether a discipline threshold has been crossed.
        // Protected / emergency categories (0 pts) are skipped.
        if (doc.associateId) {
          const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);

          // Resolve point value — supports new subtype system and legacy types
          const getDocPoints = (x) => {
            if (x.points !== undefined) return x.points;
            const LEGACY_MAP = { 'No-Show': 3, 'Unexcused': 2, 'Late/Tardy': 1, 'Excused': 0 };
            return LEGACY_MAP[x.type] ?? 0;
          };

          // Category → Work File key mapping
          const getCatKey = (x) => {
            if (x.categoryId === 'absence') return 'A';
            if (x.categoryId === 'tardiness') return 'F';
            if (x.categoryId === 'early_departure') return 'E';
            if (x.categoryId === 'protected' || x.categoryId === 'emergency') return '';
            // Legacy
            const LEGACY_KEY = { 'No-Show': 'A', 'Unexcused': 'B', 'Late/Tardy': 'F', 'Excused': '' };
            return LEGACY_KEY[x.type] || 'G';
          };

          const catKey = getCatKey(doc);
          // Skip protected / emergency (0 pts, no catKey)
          if (catKey) {
            // Build the full 90-day window for this associate (include the new doc)
            // Note: set() already ran above so get().callIns may already contain doc;
            // de-duplicate by id to avoid double-counting.
            const allRecent = get().callIns.filter(x =>
              x.associateId === doc.associateId && new Date(x.date) >= cutoff
            );
            // Ensure the new doc is included exactly once
            const recentMap = new Map(allRecent.map(x => [x.id, x]));
            recentMap.set(doc.id, doc);
            const recent = Array.from(recentMap.values());

            const rawPts = recent.reduce((s, x) => s + getDocPoints(x), 0);
            const count  = recent.length;

            // Point Recovery: streak resets when a new incident is logged,
            // so recovery is effectively 0 right now — but compute for the note.
            const lastDate = recent
              .map(x => new Date(x.date))
              .reduce((latest, d) => (d > latest ? d : latest), new Date(0));
            const cleanDays = Math.floor((new Date() - lastDate) / 86400000);
            const recovery  = cleanDays >= 60 ? 1.0 : cleanDays >= 30 ? 0.5 : 0;
            const pts       = Math.max(0, Math.round((rawPts - recovery) * 10) / 10);

            // Discipline label for context in the work-file entry
            const getDisciplineLabel = (p) => {
              if (p >= 8) return 'Termination Eligible';
              if (p >= 6) return 'Final Written Warning';
              if (p >= 4) return 'First Written Warning';
              if (p >= 2) return 'Coaching';
              return 'Below threshold';
            };

            const subtypeLabel = doc.subtypeId
              ? doc.subtypeId.replace(/_/g, ' ')
              : doc.type;
            const recoveryNote = recovery > 0 ? ` (−${recovery} pt recovery applied)` : '';
            const disciplineNote = pts > 0 ? ` — ${getDisciplineLabel(pts)}` : '';

            const newRow = {
              id:      Date.now() + Math.random(),
              date:    doc.date,
              key:     catKey,
              details: `Auto [PX Policy]: ${subtypeLabel} — incident #${count} / ${pts} pts in 90 days${recoveryNote}${disciplineNote}.${doc.reason ? ' Reason: ' + doc.reason : ''}${doc.managerNote ? ' Note: ' + doc.managerNote : ''}`,
              addedBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null,
            };
            const existing    = get().workFiles[doc.associateId] || { rows: [] };
            const updatedFile = { ...existing, rows: [...(existing.rows || []), newRow], savedAt: new Date().toISOString() };
            set(s => ({ workFiles: { ...s.workFiles, [doc.associateId]: updatedFile } }));
            if (get().dbMode === 'firestore') {
              import('../lib/firestoreSync')
                .then(({ fsSaveWorkFile }) => fsSaveWorkFile(doc.associateId, updatedFile))
                .catch(() => {});
            }
          }
        }
      },
      deleteCallIn: (id) => {
        set(s => ({ callIns: s.callIns.filter(c => c.id !== id) }));
        fsDel('callIns', id);
      },

      // ── Calendar ──────────────────────────────────────────────────────────
      // teamEvents = SHARED (synced to stores/{storeId}/teamEvents)
      // myEvents   = PRIVATE (synced to users/{uid}/myEvents — per-account cloud backup)
      teamEvents: [], myEvents: [],
      addTeamEvent: (e) => {
        const u   = get().user;
        const doc = { ...e, id: `event_${Date.now()}`, createdAt: new Date().toISOString(),
          createdBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null };
        set(s => ({ teamEvents: [...s.teamEvents, doc] }));
        fsWrite('teamEvents', doc.id, doc);
      },
      updateTeamEvent: (id, d) => {
        set(s => ({ teamEvents: s.teamEvents.map(e => e.id === id ? { ...e, ...d } : e) }));
        fsUpdate('teamEvents', id, d);
      },
      deleteTeamEvent: (id) => {
        set(s => ({ teamEvents: s.teamEvents.filter(e => e.id !== id) }));
        fsDel('teamEvents', id);
      },
      // myEvents — PRIVATE cloud backup (users/{uid}/myEvents)
      addMyEvent: (e) => {
        const doc = { ...e, id: `myevent_${Date.now()}`, createdAt: new Date().toISOString() };
        set(s => ({ myEvents: [...s.myEvents, doc] }));
        fsWritePrivate('myEvents', doc.id, doc);
      },
      deleteMyEvent: (id) => {
        set(s => ({ myEvents: s.myEvents.filter(e => e.id !== id) }));
        fsDelPrivate('myEvents', id);
      },

      // ── Checklists (SHARED) ───────────────────────────────────────────────
      checklists: {},
      customChecklists: [],          // user-created checklists
      checklistDefaults: { opening: openingChecklist, mid: midChecklist, closing: closingChecklist },
      getChecklist: (date, shift) => {
        const key = `${date}_${shift}`;
        if (get().checklists[key]) return get().checklists[key];
        const defaults = shift === 'opening' ? openingChecklist : shift === 'mid' ? midChecklist : closingChecklist;
        return defaults.map((text, i) => ({ id: i, text, checked: false }));
      },
      saveChecklist: (date, shift, items) => {
        set(s => ({ checklists: { ...s.checklists, [`${date}_${shift}`]: items } }));
        if (get().dbMode === 'firestore') {
          import('../lib/firestoreSync')
            .then(({ fsSaveChecklist }) => fsSaveChecklist(date, shift, items))
            .catch(() => {});
        }
      },

      // Custom checklists CRUD
      saveCustomChecklist: (cl) => {
        // cl = { id, name, items: [{id, text, checked}], createdAt, updatedAt }
        const enriched = { ...cl, updatedAt: new Date().toISOString() };
        set(s => ({
          customChecklists: s.customChecklists.some(c => c.id === enriched.id)
            ? s.customChecklists.map(c => c.id === enriched.id ? enriched : c)
            : [...s.customChecklists, enriched],
        }));
        if (get().dbMode === 'firestore') {
          import('../lib/firestoreSync')
            .then(({ fsSaveCustomChecklist }) => fsSaveCustomChecklist(enriched))
            .catch(() => {});
        }
      },
      deleteCustomChecklist: (id) => {
        set(s => ({ customChecklists: s.customChecklists.filter(c => c.id !== id) }));
        if (get().dbMode === 'firestore') {
          import('../lib/firestoreSync')
            .then(({ fsDeleteCustomChecklist }) => fsDeleteCustomChecklist(id))
            .catch(() => {});
        }
      },

      // ── Notes ─────────────────────────────────────────────────────────────
      // teamNotes = SHARED (synced to stores/{storeId}/teamNotes)
      // myNotes   = PRIVATE (synced to users/{uid}/myNotes — per-account cloud backup)
      //
      // Attachment strategy:
      //  1. Note added to Zustand state immediately WITH dataUrl → instant preview
      //  2. Note written to Firestore immediately WITHOUT dataUrl (stripped) → note
      //     always exists after reload even before Storage upload finishes
      //  3. Storage upload runs in background; when done, Firestore doc is patched
      //     with storageUrl on each attachment → previews survive reload permanently
      teamNotes: [], myNotes: [],
      addTeamNote: (n) => {
        const u   = get().user;
        const doc = { ...n, id: `note_${Date.now()}`, createdAt: new Date().toISOString(), pinned: false, attachments: n.attachments || [],
          createdBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null };
        // Step 1: add to state immediately (with dataUrl for instant preview)
        set(s => ({ teamNotes: [doc, ...s.teamNotes] }));
        // Step 2: write to Firestore immediately (strips dataUrl — note persists even if Storage fails)
        fsWrite('teamNotes', doc.id, doc);
        // Step 3: upload attachments to Storage in background, then patch Firestore with storageUrls
        if (get().dbMode === 'firestore' && doc.attachments.some(a => a.dataUrl)) {
          const fileNames = doc.attachments.filter(a => a.dataUrl).map(a => a.name);
          get()._startNoteUpload(doc.id, doc.title, fileNames);
          import('../lib/firestoreSync').then(async ({ uploadNoteAttachments, fsUpdateItem }) => {
            const enriched = await uploadNoteAttachments(doc, 'team', (name, pct, done, error, errorMsg) => {
              get()._updateNoteUploadFile(doc.id, name, pct, done, error, errorMsg);
            });
            set(s => ({ teamNotes: s.teamNotes.map(n => n.id === doc.id ? { ...n, attachments: enriched.attachments } : n) }));
            fsUpdateItem('teamNotes', doc.id, { attachments: enriched.attachments });
            setTimeout(() => get()._clearNoteUpload(doc.id), 2500);
          }).catch(() => { get()._clearNoteUpload(doc.id); });
        }
      },
      updateTeamNote: (id, d) => {
        set(s => ({ teamNotes: s.teamNotes.map(n => n.id === id ? { ...n, ...d } : n) }));
        // Write to Firestore immediately (strips dataUrl)
        fsUpdate('teamNotes', id, d);
        // Upload any new attachments that have dataUrl but no storageUrl yet
        if (get().dbMode === 'firestore' && Array.isArray(d.attachments) && d.attachments.some(a => a.dataUrl && !a.storageUrl)) {
          const noteTitle = get().teamNotes.find(n => n.id === id)?.title || 'Note';
          const fileNames = d.attachments.filter(a => a.dataUrl && !a.storageUrl).map(a => a.name);
          get()._startNoteUpload(id, noteTitle, fileNames);
          import('../lib/firestoreSync').then(async ({ uploadNoteAttachments, fsUpdateItem }) => {
            const enriched = await uploadNoteAttachments({ id, attachments: d.attachments }, 'team', (name, pct, done, error, errorMsg) => {
              get()._updateNoteUploadFile(id, name, pct, done, error, errorMsg);
            });
            set(s => ({ teamNotes: s.teamNotes.map(n => n.id === id ? { ...n, attachments: enriched.attachments } : n) }));
            fsUpdateItem('teamNotes', id, { attachments: enriched.attachments });
            setTimeout(() => get()._clearNoteUpload(id), 2500);
          }).catch(() => { get()._clearNoteUpload(id); });
        }
      },
      deleteTeamNote: (id) => {
        set(s => ({ teamNotes: s.teamNotes.filter(n => n.id !== id) }));
        fsDel('teamNotes', id);
      },
      // myNotes — PRIVATE cloud backup (users/{uid}/myNotes)
      addMyNote: (n) => {
        const doc = { ...n, id: `mynote_${Date.now()}`, createdAt: new Date().toISOString(), pinned: false, attachments: n.attachments || [] };
        // Step 1 & 2: state update + immediate Firestore write (no dataUrl)
        set(s => ({ myNotes: [doc, ...s.myNotes] }));
        fsWritePrivate('myNotes', doc.id, doc);
        // Step 3: background Storage upload → patch storageUrls
        if (isRealUser() && doc.attachments.some(a => a.dataUrl)) {
          const uid = get().user.uid;
          const fileNames = doc.attachments.filter(a => a.dataUrl).map(a => a.name);
          get()._startNoteUpload(doc.id, doc.title, fileNames);
          import('../lib/firestoreSync').then(async ({ uploadNoteAttachments, fsUpdatePrivateItem }) => {
            const enriched = await uploadNoteAttachments(doc, 'my', (name, pct, done, error, errorMsg) => {
              get()._updateNoteUploadFile(doc.id, name, pct, done, error, errorMsg);
            });
            set(s => ({ myNotes: s.myNotes.map(n => n.id === doc.id ? { ...n, attachments: enriched.attachments } : n) }));
            fsUpdatePrivateItem('myNotes', doc.id, { attachments: enriched.attachments }, uid);
            setTimeout(() => get()._clearNoteUpload(doc.id), 2500);
          }).catch(() => { get()._clearNoteUpload(doc.id); });
        }
      },
      updateMyNote: (id, d) => {
        set(s => ({ myNotes: s.myNotes.map(n => n.id === id ? { ...n, ...d } : n) }));
        fsUpdatePrivate('myNotes', id, d);
        if (isRealUser() && Array.isArray(d.attachments) && d.attachments.some(a => a.dataUrl && !a.storageUrl)) {
          const uid = get().user.uid;
          const noteTitle = get().myNotes.find(n => n.id === id)?.title || 'Note';
          const fileNames = d.attachments.filter(a => a.dataUrl && !a.storageUrl).map(a => a.name);
          get()._startNoteUpload(id, noteTitle, fileNames);
          import('../lib/firestoreSync').then(async ({ uploadNoteAttachments, fsUpdatePrivateItem }) => {
            const enriched = await uploadNoteAttachments({ id, attachments: d.attachments }, 'my', (name, pct, done, error, errorMsg) => {
              get()._updateNoteUploadFile(id, name, pct, done, error, errorMsg);
            });
            set(s => ({ myNotes: s.myNotes.map(n => n.id === id ? { ...n, attachments: enriched.attachments } : n) }));
            fsUpdatePrivateItem('myNotes', id, { attachments: enriched.attachments }, uid);
            setTimeout(() => get()._clearNoteUpload(id), 2500);
          }).catch(() => { get()._clearNoteUpload(id); });
        }
      },
      deleteMyNote: (id) => {
        set(s => ({ myNotes: s.myNotes.filter(n => n.id !== id) }));
        fsDelPrivate('myNotes', id);
      },

      // ── Reviews ───────────────────────────────────────────────────────────
      reviews: [],
      addReview: (r) => {
        const doc = { ...r, id: `review_${Date.now()}`, createdAt: new Date().toISOString() };
        set(s => ({ reviews: [doc, ...s.reviews] }));
        fsWrite('reviews', doc.id, doc);
      },
      updateReview: (id, d) => {
        set(s => ({ reviews: s.reviews.map(r => r.id === id ? { ...r, ...d } : r) }));
        fsUpdate('reviews', id, d);
      },
      deleteReview: (id) => {
        set(s => ({ reviews: s.reviews.filter(r => r.id !== id) }));
        fsDel('reviews', id);
      },

      // ── Tasks ─────────────────────────────────────────────────────────────
      tasks: [],
      addTask: (t) => {
        const doc = { ...t, id: `task_${Date.now()}`, createdAt: new Date().toISOString() };
        set(s => ({ tasks: [doc, ...s.tasks] }));
        fsWrite('tasks', doc.id, doc);
      },
      updateTask: (id, d) => {
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...d } : t) }));
        fsUpdate('tasks', id, d);
      },
      deleteTask: (id) => {
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
        fsDel('tasks', id);
      },

      // ── Contacts ──────────────────────────────────────────────────────────
      contacts: defaultContacts,
      addContact: (c) => {
        const doc = { ...c, id: `contact_${Date.now()}` };
        set(s => ({ contacts: [...s.contacts, doc] }));
        fsWrite('contacts', doc.id, doc);
      },
      updateContact: (id, d) => {
        set(s => ({ contacts: s.contacts.map(c => c.id === id ? { ...c, ...d } : c) }));
        fsUpdate('contacts', id, d);
      },
      deleteContact: (id) => {
        set(s => ({ contacts: s.contacts.filter(c => c.id !== id) }));
        fsDel('contacts', id);
      },

      // ── Announcements ─────────────────────────────────────────────────────
      announcements: [],
      addAnnouncement: (a) => {
        const doc = { ...a, id: `ann_${Date.now()}`, createdAt: new Date().toISOString() };
        set(s => ({ announcements: [doc, ...s.announcements] }));
        fsWrite('announcements', doc.id, doc);
      },
      deleteAnnouncement: (id) => {
        set(s => ({ announcements: s.announcements.filter(a => a.id !== id) }));
        fsDel('announcements', id);
      },

      // ── Firebase sync status ──────────────────────────────────────────────
      dbReady: false,
      dbMode: 'local',      // 'local' | 'firestore'
      dbConnecting: false,  // true while the initial Firestore handshake is in progress
      needsRelogin: false,  // true if Firebase session expired (PWA needs re-login)

      connectFirestore: async () => {
        // Guard: don't start a second connection attempt while one is running
        if (get().dbConnecting) return;
        set({ dbConnecting: true, needsRelogin: false });
        try {
          const { initFirestoreSync } = await import('../lib/firestoreSync');
          await initFirestoreSync(set, get);
        } catch (e) {
          console.warn('[PandaStore] Firestore connect failed:', e?.message);
          // If the error is auth-related, set needsRelogin flag
          const code = e?.code || e?.message || '';
          if (code.includes('permission') || code.includes('auth') || code.includes('unauthenticated')) {
            set({ needsRelogin: true });
          }
        } finally {
          set({ dbConnecting: false });
        }
      },
    };
    },
    {
      name: 'panda-manager-storage',
      storage: createBackupStorage(),
      version: 4,
      migrate: (persistedState, fromVersion) => {
        const state = { ...(persistedState || {}) };
        if ((fromVersion ?? -1) < 1) {
          const posMap = { 'Team Member': 'FOH', 'Crew': 'BOH', 'Other': 'FOH' };
          if (Array.isArray(state.associates))
            state.associates = state.associates.map(a => ({ ...a, position: posMap[a.position] || a.position }));
        }
        if ((fromVersion ?? -1) < 2) {
          const addAtt = (notes) => Array.isArray(notes) ? notes.map(n => ({ attachments: [], ...n })) : [];
          state.teamNotes = addAtt(state.teamNotes);
          state.myNotes   = addAtt(state.myNotes);
        }
        if ((fromVersion ?? -1) < 3) {
          ['associates','callIns','teamEvents','myEvents','teamNotes','myNotes','reviews','tasks','contacts','announcements']
            .forEach(k => { if (!Array.isArray(state[k])) state[k] = []; });
          if (!state.checklists || typeof state.checklists !== 'object') state.checklists = {};
          if (!state.workFiles  || typeof state.workFiles  !== 'object') state.workFiles  = {};
          if (!Array.isArray(state.customChecklists)) state.customChecklists = [];
        }
        return state;
      },
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        associates:    Array.isArray(persisted?.associates)    ? persisted.associates    : current.associates,
        callIns:       Array.isArray(persisted?.callIns)       ? persisted.callIns       : current.callIns,
        teamEvents:    Array.isArray(persisted?.teamEvents)    ? persisted.teamEvents    : current.teamEvents,
        myEvents:      Array.isArray(persisted?.myEvents)      ? persisted.myEvents      : current.myEvents,
        teamNotes:     Array.isArray(persisted?.teamNotes)     ? persisted.teamNotes     : current.teamNotes,
        myNotes:       Array.isArray(persisted?.myNotes)       ? persisted.myNotes       : current.myNotes,
        reviews:       Array.isArray(persisted?.reviews)       ? persisted.reviews       : current.reviews,
        tasks:         Array.isArray(persisted?.tasks)         ? persisted.tasks         : current.tasks,
        contacts:      Array.isArray(persisted?.contacts)      ? persisted.contacts      : current.contacts,
        announcements: Array.isArray(persisted?.announcements) ? persisted.announcements : current.announcements,
        checklists:       (persisted?.checklists && typeof persisted.checklists === 'object') ? persisted.checklists : current.checklists,
        workFiles:        (persisted?.workFiles  && typeof persisted.workFiles  === 'object') ? persisted.workFiles  : current.workFiles,
        customChecklists: Array.isArray(persisted?.customChecklists) ? persisted.customChecklists : current.customChecklists,
      }),
      partialize: (state) => {
        // Strip base64 dataUrl from note attachments before writing to
        // localStorage — dataUrls can be several MB each and will quickly
        // exhaust the 5 MB localStorage quota, causing a QuotaExceededError
        // that silently corrupts the persisted store and makes notes disappear.
        // We keep all other attachment metadata (id, name, type, size) so the
        // UI can still display a placeholder for stored attachments.
        const stripDataUrls = (notes) =>
          Array.isArray(notes)
            ? notes.map(n => ({
                ...n,
                attachments: Array.isArray(n.attachments)
                  ? n.attachments.map(({ dataUrl: _dropped, ...rest }) => rest)
                  : [],
              }))
            : [];

        return {
          user:          state.user,
          storeId:       state.storeId,
          storeName:     state.storeName,
          associates:    state.associates,
          workFiles:     state.workFiles,
          callIns:       state.callIns,
          teamEvents:    state.teamEvents,
          myEvents:      state.myEvents,
          checklists:       state.checklists,
          customChecklists: state.customChecklists,
          teamNotes:     stripDataUrls(state.teamNotes),
          myNotes:       stripDataUrls(state.myNotes),
          reviews:       state.reviews,
          tasks:         state.tasks,
          contacts:      state.contacts,
          announcements: state.announcements,
        };
      },
    }
  )
);
