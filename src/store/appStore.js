import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  subscribeCollection,
  addItem, setItem, updateItem, deleteItem,
  saveChecklist as fsSaveChecklist,
  fetchChecklist as fsFetchChecklist,
  saveWorkFile as fsSaveWorkFile,
  batchImportToFirestore,
} from '../lib/firestoreService';

// ── AUTO-RECOVERY: restore from backup if primary key is missing ─────────────
(function recoverStorageIfNeeded() {
  try {
    const raw = localStorage.getItem('panda-manager-storage');
    if (!raw) {
      const backup = localStorage.getItem('panda-manager-backup');
      if (backup) {
        console.log('[PandaStore] Restoring from backup...');
        localStorage.setItem('panda-manager-storage', backup);
      }
    }
  } catch {}
})();

// ── Custom storage: writes a rolling backup on every save ────────────────────
function createBackupStorage() {
  return {
    getItem: (name) => {
      try { const r = localStorage.getItem(name); return r ? JSON.parse(r) : null; }
      catch { return null; }
    },
    setItem: (name, value) => {
      try {
        const s = JSON.stringify(value);
        localStorage.setItem(name, s);
        localStorage.setItem('panda-manager-backup', s);
      } catch (e) { console.warn('[PandaStore] Storage quota exceeded.', e); }
    },
    removeItem: (name) => { try { localStorage.removeItem(name); } catch {} },
  };
}

// ── Default data ─────────────────────────────────────────────────────────────
const defaultContacts = [
  { id: 'contact_1', name: 'District Manager',   role: 'District Manager',   phone: '', email: '', description: 'Add your DM contact info',         icon: 'building'  },
  { id: 'contact_2', name: 'Health Department',   role: 'Health Department',  phone: '', email: '', description: 'Local health inspection contact',    icon: 'hospital'  },
  { id: 'contact_3', name: 'Panda Corporate HR',  role: 'HR',                 phone: '1-800-877-8988', email: 'hr@pandaexpress.com', description: 'Corporate HR line', icon: 'hr' },
  { id: 'contact_4', name: 'IT Support',           role: 'IT Support',        phone: '', email: '', description: 'Add IT support contact info',        icon: 'computer'  },
];

const openingChecklist = [
  'Unlock & secure building, check exterior',
  'Check alarm and security system',
  'Turn on all equipment (woks, fryers, steam tables)',
  'Complete food safety temperature log',
  'Prep all required menu items per par levels',
  'Set up front line with hot & cold food',
  'Stock serving utensils, trays, napkins, chopsticks',
  'Set up drinks station (fountain, cups, lids, straws)',
  'Sanitize prep surfaces, line, and register area',
  'Count and verify cash drawer',
  'Check online order tablets & kiosk operational',
  'Verify team assignments and positions',
  'Confirm uniform compliance for all associates',
  "Brief team on daily specials and 86'd items",
  'Confirm manager on duty contact info posted',
];
const midChecklist = [
  'Check all food temperatures (hot & cold)',
  'Restock front line items as needed',
  'Verify drink station supplies (cups, lids, straws)',
  'Review and enforce break schedule',
  'Check dining room cleanliness',
  'Restock napkins, utensils, chopsticks',
  'Monitor online order queue and tablets',
  'Check restroom cleanliness and supplies',
  'Review labor and sales performance',
  'Conduct mid-shift food safety check',
  'Confirm all equipment functioning properly',
  'Address any customer complaints or issues',
];
const closingChecklist = [
  'Count and verify cash drawer & safe',
  'Complete end-of-day sales report',
  'Shut down all cooking equipment safely',
  'Cool and properly store all food items',
  'Complete thorough kitchen cleaning',
  'Mop all floor areas',
  'Empty and clean all trash cans',
  'Sanitize all prep surfaces and equipment',
  'Secure all doors and windows',
  'Set alarm system',
  'Complete closing manager log',
  'Verify all team members have clocked out',
  'Submit daily report to district manager',
];

// ── Firestore real-time listeners (unsubscribe handles) ──────────────────────
const _unsubs = {};
function unsub(key) { if (_unsubs[key]) { _unsubs[key](); delete _unsubs[key]; } }

// ── Main Store ───────────────────────────────────────────────────────────────
export const useAppStore = create(
  persist(
    (set, get) => ({

      // ── Auth / Meta ──────────────────────────────────────────────────────
      user:      null,
      storeId:   'store_1687',
      storeName: 'PANDA EXPRESS 1687',
      isOnline:  true,
      dbReady:   false,   // true once Firestore listeners are attached

      setUser:    (user)    => set({ user }),
      setStoreId: (id)      => set({ storeId: id }),
      setOnline:  (online)  => set({ isOnline: online }),

      // ── Firestore: attach real-time listeners for all collections ────────
      initFirestore: () => {
        const existingUnsubs = Object.keys(_unsubs).length;
        if (existingUnsubs > 0) return; // already listening

        console.log('[PandaStore] Attaching Firestore listeners...');

        const listen = (collName, stateKey) => {
          unsub(collName);
          _unsubs[collName] = subscribeCollection(collName, (items) => {
            set({ [stateKey]: items });
          });
        };

        listen('associates',    'associates');
        listen('callIns',       'callIns');
        listen('teamEvents',    'teamEvents');
        listen('myEvents',      'myEvents');
        listen('teamNotes',     'teamNotes');
        listen('myNotes',       'myNotes');
        listen('reviews',       'reviews');
        listen('tasks',         'tasks');
        listen('contacts',      'contacts');
        listen('announcements', 'announcements');

        set({ dbReady: true });
        console.log('[PandaStore] ✅ Firestore live sync active.');
      },

      // ── Migrate localStorage → Firestore (run once on first connect) ─────
      migrateLocalToFirestore: async () => {
        const MIGRATED_KEY = 'panda-fs-migrated-v1';
        if (localStorage.getItem(MIGRATED_KEY)) return;

        try {
          const raw = localStorage.getItem('panda-manager-storage');
          if (!raw) return;
          const parsed  = JSON.parse(raw);
          const data    = parsed?.state || parsed;

          const hasData = [
            data.associates, data.callIns, data.teamNotes, data.myNotes,
            data.reviews, data.tasks, data.teamEvents, data.myEvents,
            data.contacts, data.announcements,
          ].some(arr => Array.isArray(arr) && arr.length > 0);

          if (!hasData) return;

          console.log('[PandaStore] Migrating localStorage → Firestore...');
          const count = await batchImportToFirestore(data);
          localStorage.setItem(MIGRATED_KEY, '1');
          console.log(`[PandaStore] ✅ Migrated ${count} records to Firestore.`);
        } catch (e) {
          console.error('[PandaStore] Migration error:', e);
        }
      },

      // ── Associates ───────────────────────────────────────────────────────
      associates: [],
      addAssociate: async (assoc) => {
        const id  = `assoc_${Date.now()}`;
        const doc = { ...assoc, id, createdAt: new Date().toISOString() };
        set(s => ({ associates: [...s.associates, doc] }));          // optimistic
        await setItem('associates', id, doc);
      },
      updateAssociate: async (id, data) => {
        set(s => ({ associates: s.associates.map(a => a.id === id ? { ...a, ...data } : a) }));
        await updateItem('associates', id, data);
      },
      deleteAssociate: async (id) => {
        set(s => ({ associates: s.associates.filter(a => a.id !== id) }));
        await deleteItem('associates', id);
      },

      // ── Work Files ───────────────────────────────────────────────────────
      workFiles: {},
      saveWorkFile: async (associateId, fileData) => {
        set(s => ({ workFiles: { ...s.workFiles, [associateId]: fileData } }));
        await fsSaveWorkFile(associateId, fileData);
      },

      // ── Call-Ins ─────────────────────────────────────────────────────────
      callIns: [],
      addCallIn: async (callIn) => {
        const id  = `callin_${Date.now()}`;
        const doc = { ...callIn, id, createdAt: new Date().toISOString() };
        set(s => ({ callIns: [doc, ...s.callIns] }));
        await setItem('callIns', id, doc);
      },
      deleteCallIn: async (id) => {
        set(s => ({ callIns: s.callIns.filter(c => c.id !== id) }));
        await deleteItem('callIns', id);
      },

      // ── Calendar Events ──────────────────────────────────────────────────
      teamEvents: [],
      myEvents:   [],
      addTeamEvent: async (event) => {
        const id  = `event_${Date.now()}`;
        const doc = { ...event, id, createdAt: new Date().toISOString() };
        set(s => ({ teamEvents: [...s.teamEvents, doc] }));
        await setItem('teamEvents', id, doc);
      },
      updateTeamEvent: async (id, data) => {
        set(s => ({ teamEvents: s.teamEvents.map(e => e.id === id ? { ...e, ...data } : e) }));
        await updateItem('teamEvents', id, data);
      },
      deleteTeamEvent: async (id) => {
        set(s => ({ teamEvents: s.teamEvents.filter(e => e.id !== id) }));
        await deleteItem('teamEvents', id);
      },
      addMyEvent: async (event) => {
        const id  = `myevent_${Date.now()}`;
        const doc = { ...event, id, createdAt: new Date().toISOString() };
        set(s => ({ myEvents: [...s.myEvents, doc] }));
        await setItem('myEvents', id, doc);
      },
      deleteMyEvent: async (id) => {
        set(s => ({ myEvents: s.myEvents.filter(e => e.id !== id) }));
        await deleteItem('myEvents', id);
      },

      // ── Checklists ───────────────────────────────────────────────────────
      checklists: {},
      checklistDefaults: { opening: openingChecklist, mid: midChecklist, closing: closingChecklist },
      getChecklist: (date, shift) => {
        const state = get();
        const key   = `${date}_${shift}`;
        if (state.checklists[key]) return state.checklists[key];
        const defaults = shift === 'opening' ? openingChecklist
                       : shift === 'mid'     ? midChecklist
                       :                       closingChecklist;
        return defaults.map((text, i) => ({ id: i, text, checked: false }));
      },
      saveChecklist: async (date, shift, items) => {
        const key = `${date}_${shift}`;
        set(s => ({ checklists: { ...s.checklists, [key]: items } }));
        await fsSaveChecklist(date, shift, items);
      },

      // ── Notes ────────────────────────────────────────────────────────────
      teamNotes: [],
      myNotes:   [],
      addTeamNote: async (note) => {
        const id  = `note_${Date.now()}`;
        const doc = { ...note, id, createdAt: new Date().toISOString(), pinned: false, attachments: note.attachments || [] };
        set(s => ({ teamNotes: [doc, ...s.teamNotes] }));
        await setItem('teamNotes', id, doc);
      },
      updateTeamNote: async (id, data) => {
        set(s => ({ teamNotes: s.teamNotes.map(n => n.id === id ? { ...n, ...data } : n) }));
        await updateItem('teamNotes', id, data);
      },
      deleteTeamNote: async (id) => {
        set(s => ({ teamNotes: s.teamNotes.filter(n => n.id !== id) }));
        await deleteItem('teamNotes', id);
      },
      addMyNote: async (note) => {
        const id  = `mynote_${Date.now()}`;
        const doc = { ...note, id, createdAt: new Date().toISOString(), pinned: false, attachments: note.attachments || [] };
        set(s => ({ myNotes: [doc, ...s.myNotes] }));
        await setItem('myNotes', id, doc);
      },
      updateMyNote: async (id, data) => {
        set(s => ({ myNotes: s.myNotes.map(n => n.id === id ? { ...n, ...data } : n) }));
        await updateItem('myNotes', id, data);
      },
      deleteMyNote: async (id) => {
        set(s => ({ myNotes: s.myNotes.filter(n => n.id !== id) }));
        await deleteItem('myNotes', id);
      },

      // ── Performance Reviews ──────────────────────────────────────────────
      reviews: [],
      addReview: async (review) => {
        const id  = `review_${Date.now()}`;
        const doc = { ...review, id, createdAt: new Date().toISOString() };
        set(s => ({ reviews: [doc, ...s.reviews] }));
        await setItem('reviews', id, doc);
      },
      updateReview: async (id, data) => {
        set(s => ({ reviews: s.reviews.map(r => r.id === id ? { ...r, ...data } : r) }));
        await updateItem('reviews', id, data);
      },
      deleteReview: async (id) => {
        set(s => ({ reviews: s.reviews.filter(r => r.id !== id) }));
        await deleteItem('reviews', id);
      },

      // ── Tasks ────────────────────────────────────────────────────────────
      tasks: [],
      addTask: async (task) => {
        const id  = `task_${Date.now()}`;
        const doc = { ...task, id, createdAt: new Date().toISOString() };
        set(s => ({ tasks: [doc, ...s.tasks] }));
        await setItem('tasks', id, doc);
      },
      updateTask: async (id, data) => {
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t) }));
        await updateItem('tasks', id, data);
      },
      deleteTask: async (id) => {
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
        await deleteItem('tasks', id);
      },

      // ── Contacts ─────────────────────────────────────────────────────────
      contacts: defaultContacts,
      addContact: async (contact) => {
        const id  = `contact_${Date.now()}`;
        const doc = { ...contact, id };
        set(s => ({ contacts: [...s.contacts, doc] }));
        await setItem('contacts', id, doc);
      },
      updateContact: async (id, data) => {
        set(s => ({ contacts: s.contacts.map(c => c.id === id ? { ...c, ...data } : c) }));
        await updateItem('contacts', id, data);
      },
      deleteContact: async (id) => {
        set(s => ({ contacts: s.contacts.filter(c => c.id !== id) }));
        await deleteItem('contacts', id);
      },

      // ── Announcements ────────────────────────────────────────────────────
      announcements: [],
      addAnnouncement: async (ann) => {
        const id  = `ann_${Date.now()}`;
        const doc = { ...ann, id, createdAt: new Date().toISOString() };
        set(s => ({ announcements: [doc, ...s.announcements] }));
        await setItem('announcements', id, doc);
      },
      deleteAnnouncement: async (id) => {
        set(s => ({ announcements: s.announcements.filter(a => a.id !== id) }));
        await deleteItem('announcements', id);
      },
    }),

    // ── Persist config (localStorage cache) ─────────────────────────────────
    {
      name:    'panda-manager-storage',
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
          const addAtt = (notes) => Array.isArray(notes) ? notes.map(n => ({ attachments: [], ...n })) : notes ?? [];
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
        user: state.user, storeId: state.storeId, storeName: state.storeName,
        associates: state.associates, workFiles: state.workFiles,
        callIns: state.callIns, teamEvents: state.teamEvents, myEvents: state.myEvents,
        checklists: state.checklists, teamNotes: state.teamNotes, myNotes: state.myNotes,
        reviews: state.reviews, tasks: state.tasks, contacts: state.contacts,
        announcements: state.announcements,
      }),
    }
  )
);
