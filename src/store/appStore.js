import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── AUTO-RECOVERY: Before the store loads, attempt to recover data
// if the primary storage key is missing or corrupted.
function recoverStorageIfNeeded() {
  try {
    const PRIMARY_KEY = 'panda-manager-storage';
    const BACKUP_KEY  = 'panda-manager-backup';

    const primary = localStorage.getItem(PRIMARY_KEY);
    if (!primary) {
      // Primary is missing — try to restore from backup
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        console.log('[PandaStore] Primary storage missing — restoring from backup...');
        localStorage.setItem(PRIMARY_KEY, backup);
      }
    }
  } catch {}
}

recoverStorageIfNeeded();

// ── BACKUP WRITER: Keep a rolling backup of store data every save ──
function createBackupStorage() {
  return {
    getItem: (name) => {
      try {
        const raw = localStorage.getItem(name);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        const str = JSON.stringify(value);
        localStorage.setItem(name, str);
        // Also write a backup copy so we can recover if primary is lost
        localStorage.setItem('panda-manager-backup', str);
      } catch (e) {
        console.warn('[PandaStore] Storage quota exceeded.', e);
      }
    },
    removeItem: (name) => {
      try { localStorage.removeItem(name); } catch {}
    },
  };
}

// Demo data for offline/demo mode
const demoAssociates = [
  {
    id: 'assoc_1',
    name: 'Bond',
    employeeId: '447A736F',
    position: 'FOH',
    telephone: '',
    birthday: '',
    hireDate: '',
    status: 'active',
    cleanStatus: 'clean',
    starRating: 0,
    notes: '',
    createdAt: new Date().toISOString(),
  }
];

const demoContacts = [
  {
    id: 'contact_1',
    name: 'District Manager',
    role: 'District Manager',
    phone: '',
    email: '',
    description: 'Add your DM contact info',
    icon: 'building',
  },
  {
    id: 'contact_2',
    name: 'Health Department',
    role: 'Health Department',
    phone: '',
    email: '',
    description: 'Local health inspection contact',
    icon: 'hospital',
  },
  {
    id: 'contact_3',
    name: 'Panda Corporate HR',
    role: 'HR',
    phone: '1-800-877-8988',
    email: 'hr@pandaexpress.com',
    description: 'Corporate HR line',
    icon: 'hr',
  },
  {
    id: 'contact_4',
    name: 'IT Support',
    role: 'IT Support',
    phone: '',
    email: '',
    description: 'Add IT support contact info',
    icon: 'computer',
  },
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
  'Brief team on daily specials and 86\'d items',
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

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      storeId: 'store_1687',
      storeName: 'PANDA EXPRESS 1687',
      isOnline: true,

      setUser: (user) => set({ user }),
      setStoreId: (id) => set({ storeId: id }),

      // Associates
      associates: demoAssociates,
      addAssociate: (assoc) => set(state => ({
        associates: [...state.associates, { ...assoc, id: `assoc_${Date.now()}`, createdAt: new Date().toISOString() }]
      })),
      updateAssociate: (id, data) => set(state => ({
        associates: state.associates.map(a => a.id === id ? { ...a, ...data } : a)
      })),
      deleteAssociate: (id) => set(state => ({
        associates: state.associates.filter(a => a.id !== id)
      })),

      // Work Files
      workFiles: {},
      saveWorkFile: (associateId, fileData) => set(state => ({
        workFiles: { ...state.workFiles, [associateId]: fileData }
      })),

      // Call-Ins
      callIns: [],
      addCallIn: (callIn) => set(state => ({
        callIns: [{ ...callIn, id: `callin_${Date.now()}`, createdAt: new Date().toISOString() }, ...state.callIns]
      })),
      deleteCallIn: (id) => set(state => ({
        callIns: state.callIns.filter(c => c.id !== id)
      })),

      // Calendar Events
      teamEvents: [],
      myEvents: [],
      addTeamEvent: (event) => set(state => ({
        teamEvents: [...state.teamEvents, { ...event, id: `event_${Date.now()}`, createdAt: new Date().toISOString() }]
      })),
      updateTeamEvent: (id, data) => set(state => ({
        teamEvents: state.teamEvents.map(e => e.id === id ? { ...e, ...data } : e)
      })),
      deleteTeamEvent: (id) => set(state => ({
        teamEvents: state.teamEvents.filter(e => e.id !== id)
      })),
      addMyEvent: (event) => set(state => ({
        myEvents: [...state.myEvents, { ...event, id: `myevent_${Date.now()}`, createdAt: new Date().toISOString() }]
      })),
      deleteMyEvent: (id) => set(state => ({
        myEvents: state.myEvents.filter(e => e.id !== id)
      })),

      // Checklists
      checklists: {},
      getChecklist: (date, shift) => {
        const state = get();
        const key = `${date}_${shift}`;
        if (state.checklists[key]) return state.checklists[key];
        const defaultItems = shift === 'opening' ? openingChecklist :
                             shift === 'mid' ? midChecklist : closingChecklist;
        return defaultItems.map((text, i) => ({ id: i, text, checked: false }));
      },
      saveChecklist: (date, shift, items) => set(state => ({
        checklists: { ...state.checklists, [`${date}_${shift}`]: items }
      })),
      checklistDefaults: { opening: openingChecklist, mid: midChecklist, closing: closingChecklist },

      // Notes
      teamNotes: [],
      myNotes: [],
      addTeamNote: (note) => set(state => ({
        teamNotes: [{ ...note, id: `note_${Date.now()}`, createdAt: new Date().toISOString(), pinned: false }, ...state.teamNotes]
      })),
      updateTeamNote: (id, data) => set(state => ({
        teamNotes: state.teamNotes.map(n => n.id === id ? { ...n, ...data } : n)
      })),
      deleteTeamNote: (id) => set(state => ({
        teamNotes: state.teamNotes.filter(n => n.id !== id)
      })),
      addMyNote: (note) => set(state => ({
        myNotes: [{ ...note, id: `mynote_${Date.now()}`, createdAt: new Date().toISOString(), pinned: false }, ...state.myNotes]
      })),
      updateMyNote: (id, data) => set(state => ({
        myNotes: state.myNotes.map(n => n.id === id ? { ...n, ...data } : n)
      })),
      deleteMyNote: (id) => set(state => ({
        myNotes: state.myNotes.filter(n => n.id !== id)
      })),

      // Performance Reviews
      reviews: [],
      addReview: (review) => set(state => ({
        reviews: [{ ...review, id: `review_${Date.now()}`, createdAt: new Date().toISOString() }, ...state.reviews]
      })),
      updateReview: (id, data) => set(state => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, ...data } : r)
      })),
      deleteReview: (id) => set(state => ({
        reviews: state.reviews.filter(r => r.id !== id)
      })),

      // Tasks
      tasks: [],
      addTask: (task) => set(state => ({
        tasks: [{ ...task, id: `task_${Date.now()}`, createdAt: new Date().toISOString() }, ...state.tasks]
      })),
      updateTask: (id, data) => set(state => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...data } : t)
      })),
      deleteTask: (id) => set(state => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      // Contacts
      contacts: demoContacts,
      addContact: (contact) => set(state => ({
        contacts: [...state.contacts, { ...contact, id: `contact_${Date.now()}` }]
      })),
      updateContact: (id, data) => set(state => ({
        contacts: state.contacts.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteContact: (id) => set(state => ({
        contacts: state.contacts.filter(c => c.id !== id)
      })),

      // Announcements
      announcements: [],
      addAnnouncement: (ann) => set(state => ({
        announcements: [{ ...ann, id: `ann_${Date.now()}`, createdAt: new Date().toISOString() }, ...state.announcements]
      })),
      deleteAnnouncement: (id) => set(state => ({
        announcements: state.announcements.filter(a => a.id !== id)
      })),
    }),
    {
      name: 'panda-manager-storage',
      // ── SAFE STORAGE: custom wrapper that NEVER wipes existing data ──
      // Instead of using the default storage which can lose data on version
      // mismatches, we manually merge persisted data with defaults.
      storage: createBackupStorage(),
      // ── Version: bump this number whenever the state shape changes ──
      // IMPORTANT: migrate() must ALWAYS return a valid state object.
      version: 3,
      migrate: (persistedState, fromVersion) => {
        // Safety net: if persistedState is null/undefined, return empty object
        // so Zustand merges with initial state (never wipes).
        const state = { ...(persistedState || {}) };

        // v0 → v1: positions renamed (Team Member/Crew/Other → FOH/BOH/Cook/…)
        if ((fromVersion ?? -1) < 1) {
          const posMap = {
            'Team Member': 'FOH',
            'Crew':        'BOH',
            'Other':       'FOH',
          };
          if (Array.isArray(state.associates)) {
            state.associates = state.associates.map(a => ({
              ...a,
              position: posMap[a.position] || a.position,
            }));
          }
        }

        // v1 → v2: notes gain attachments array (back-fill missing field)
        if ((fromVersion ?? -1) < 2) {
          const addAttachments = (notes) =>
            Array.isArray(notes)
              ? notes.map(n => ({ attachments: [], ...n }))
              : notes ?? [];
          state.teamNotes = addAttachments(state.teamNotes);
          state.myNotes   = addAttachments(state.myNotes);
        }

        // v2 → v3: ensure all arrays are initialized (back-fill missing arrays)
        if ((fromVersion ?? -1) < 3) {
          if (!Array.isArray(state.associates))   state.associates   = [];
          if (!Array.isArray(state.callIns))       state.callIns       = [];
          if (!Array.isArray(state.teamEvents))    state.teamEvents    = [];
          if (!Array.isArray(state.myEvents))      state.myEvents      = [];
          if (!Array.isArray(state.teamNotes))     state.teamNotes     = [];
          if (!Array.isArray(state.myNotes))       state.myNotes       = [];
          if (!Array.isArray(state.reviews))       state.reviews       = [];
          if (!Array.isArray(state.tasks))         state.tasks         = [];
          if (!Array.isArray(state.contacts))      state.contacts      = [];
          if (!Array.isArray(state.announcements)) state.announcements = [];
          if (!state.checklists || typeof state.checklists !== 'object') state.checklists = {};
          if (!state.workFiles  || typeof state.workFiles  !== 'object') state.workFiles  = {};
        }

        return state;
      },
      // merge: instead of replacing state, MERGE persisted data with defaults
      // This is the key fix — even if migration fails, existing data is kept
      merge: (persistedState, currentState) => {
        // Deep merge: persisted values override defaults, but missing keys
        // fall back to currentState (initial values) rather than being lost
        return {
          ...currentState,
          ...persistedState,
          // Always ensure arrays are arrays (never undefined/null)
          associates:   Array.isArray(persistedState?.associates)   ? persistedState.associates   : currentState.associates,
          callIns:      Array.isArray(persistedState?.callIns)       ? persistedState.callIns       : currentState.callIns,
          teamEvents:   Array.isArray(persistedState?.teamEvents)    ? persistedState.teamEvents    : currentState.teamEvents,
          myEvents:     Array.isArray(persistedState?.myEvents)      ? persistedState.myEvents      : currentState.myEvents,
          teamNotes:    Array.isArray(persistedState?.teamNotes)     ? persistedState.teamNotes     : currentState.teamNotes,
          myNotes:      Array.isArray(persistedState?.myNotes)       ? persistedState.myNotes       : currentState.myNotes,
          reviews:      Array.isArray(persistedState?.reviews)       ? persistedState.reviews       : currentState.reviews,
          tasks:        Array.isArray(persistedState?.tasks)         ? persistedState.tasks         : currentState.tasks,
          contacts:     Array.isArray(persistedState?.contacts)      ? persistedState.contacts      : currentState.contacts,
          announcements:Array.isArray(persistedState?.announcements) ? persistedState.announcements : currentState.announcements,
          checklists:   (persistedState?.checklists && typeof persistedState.checklists === 'object') ? persistedState.checklists : currentState.checklists,
          workFiles:    (persistedState?.workFiles  && typeof persistedState.workFiles  === 'object') ? persistedState.workFiles  : currentState.workFiles,
        };
      },
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
