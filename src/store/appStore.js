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

      // ── Notes ─────────────────────────────────────────────────────────────
      // teamNotes = SHARED (synced to stores/{storeId}/teamNotes)
      // myNotes   = PRIVATE (synced to users/{uid}/myNotes — per-account cloud backup)
      teamNotes: [], myNotes: [],
      addTeamNote: (n) => {
        const u   = get().user;
        const doc = { ...n, id: `note_${Date.now()}`, createdAt: new Date().toISOString(), pinned: false, attachments: n.attachments || [],
          createdBy: u ? { uid: u.uid, name: firstName(u.name || u.email?.split('@')[0]) } : null };
        set(s => ({ teamNotes: [doc, ...s.teamNotes] }));
        fsWrite('teamNotes', doc.id, doc);
      },
      updateTeamNote: (id, d) => {
        set(s => ({ teamNotes: s.teamNotes.map(n => n.id === id ? { ...n, ...d } : n) }));
        fsUpdate('teamNotes', id, d);
      },
      deleteTeamNote: (id) => {
        set(s => ({ teamNotes: s.teamNotes.filter(n => n.id !== id) }));
        fsDel('teamNotes', id);
      },
      // myNotes — PRIVATE cloud backup (users/{uid}/myNotes)
      addMyNote: (n) => {
        const doc = { ...n, id: `mynote_${Date.now()}`, createdAt: new Date().toISOString(), pinned: false, attachments: n.attachments || [] };
        set(s => ({ myNotes: [doc, ...s.myNotes] }));
        fsWritePrivate('myNotes', doc.id, doc);
      },
      updateMyNote: (id, d) => {
        set(s => ({ myNotes: s.myNotes.map(n => n.id === id ? { ...n, ...d } : n) }));
        fsUpdatePrivate('myNotes', id, d);
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
        checklists:    (persisted?.checklists && typeof persisted.checklists === 'object') ? persisted.checklists : current.checklists,
        workFiles:     (persisted?.workFiles  && typeof persisted.workFiles  === 'object') ? persisted.workFiles  : current.workFiles,
      }),
      partialize: (state) => ({
        user:          state.user,
        storeId:       state.storeId,
        storeName:     state.storeName,
        associates:    state.associates,
        workFiles:     state.workFiles,
        callIns:       state.callIns,
        teamEvents:    state.teamEvents,
        myEvents:      state.myEvents,
        checklists:    state.checklists,
        teamNotes:     state.teamNotes,
        myNotes:       state.myNotes,
        reviews:       state.reviews,
        tasks:         state.tasks,
        contacts:      state.contacts,
        announcements: state.announcements,
      }),
    }
  )
);
