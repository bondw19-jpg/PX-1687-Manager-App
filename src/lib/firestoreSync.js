// firestoreSync.js
// ─────────────────────────────────────────────────────────────────────────────
// This module is ONLY imported dynamically when the user explicitly connects
// Firebase from the Backup & Restore page. It is NEVER loaded at app startup.
//
// STORAGE PATHS:
//   SHARED  (all team members, read/write by any authenticated user):
//     stores/store_1687/associates/{id}
//     stores/store_1687/callIns/{id}
//     stores/store_1687/teamEvents/{id}
//     stores/store_1687/teamNotes/{id}
//     stores/store_1687/reviews/{id}
//     stores/store_1687/tasks/{id}
//     stores/store_1687/contacts/{id}
//     stores/store_1687/announcements/{id}
//     stores/store_1687/workFiles/{associateId}
//     stores/store_1687/checklists/{date_shift}
//
//   PRIVATE (per-user cloud backup, only the owner can read/write):
//     users/{uid}/myNotes/{id}    — Personal Notes
//     users/{uid}/myEvents/{id}   — Personal Calendar
// ─────────────────────────────────────────────────────────────────────────────

const STORE_ID = 'store_1687';

let _db   = null;
let _uid  = null;          // current user's UID, set on connect
let _syncActive    = false;
let _unsubscribers = [];

// ── Lazy Firebase init ────────────────────────────────────────────────────────
async function getDb() {
  if (_db) return _db;
  const { getFirebaseModules } = await import('./firebase');
  const { db } = await getFirebaseModules();
  _db = db;
  return _db;
}

// ── Shared collection helpers (stores/store_1687/…) ──────────────────────────
async function storeColl(name) {
  const { collection } = await import('firebase/firestore');
  const db = await getDb();
  return collection(db, 'stores', STORE_ID, name);
}

async function storeItem(name, id) {
  const { doc } = await import('firebase/firestore');
  const db = await getDb();
  return doc(db, 'stores', STORE_ID, name, id);
}

// ── Private user collection helpers (users/{uid}/…) ──────────────────────────
async function userColl(uid, name) {
  const { collection } = await import('firebase/firestore');
  const db = await getDb();
  return collection(db, 'users', uid, name);
}

async function userItem(uid, name, id) {
  const { doc } = await import('firebase/firestore');
  const db = await getDb();
  return doc(db, 'users', uid, name, id);
}

// ── Generic write helpers for SHARED collections ─────────────────────────────
export async function fsSetItem(collName, id, data) {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn(`[Firestore] setItem(${collName}/${id}):`, e?.code || e?.message);
  }
}

export async function fsUpdateItem(collName, id, data) {
  try {
    const { updateDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await updateDoc(ref, { ...data, _updatedAt: serverTimestamp() });
  } catch (e) {
    // Doc may not exist yet — fall back to setDoc
    try {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      const ref = await storeItem(collName, id);
      await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
    } catch {}
  }
}

export async function fsDeleteItem(collName, id) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await deleteDoc(ref);
  } catch (e) {
    console.warn(`[Firestore] deleteItem(${collName}/${id}):`, e?.code || e?.message);
  }
}

// ── Private write helpers (users/{uid}/…) ────────────────────────────────────
export async function fsSetPrivateItem(collName, id, data) {
  const uid = _uid;
  if (!uid) return; // not signed in — silently skip
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn(`[Firestore] setPrivate(${collName}/${id}):`, e?.code || e?.message);
  }
}

export async function fsUpdatePrivateItem(collName, id, data) {
  const uid = _uid;
  if (!uid) return;
  try {
    const { updateDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    await updateDoc(ref, { ...data, _updatedAt: serverTimestamp() });
  } catch (e) {
    // Fall back to setDoc if doc doesn't exist yet
    try {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      const ref = await userItem(uid, collName, id);
      await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
    } catch {}
  }
}

export async function fsDeletePrivateItem(collName, id) {
  const uid = _uid;
  if (!uid) return;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    await deleteDoc(ref);
  } catch (e) {
    console.warn(`[Firestore] deletePrivate(${collName}/${id}):`, e?.code || e?.message);
  }
}

// ── Checklist & WorkFile helpers (shared) ────────────────────────────────────
export async function fsSaveChecklist(date, shift, items) {
  try {
    const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
    const db = await getDb();
    const ref = doc(db, 'stores', STORE_ID, 'checklists', `${date}_${shift}`);
    await setDoc(ref, { date, shift, items, _updatedAt: serverTimestamp() });
  } catch (e) {
    console.warn(`[Firestore] saveChecklist(${date}/${shift}):`, e?.code || e?.message);
  }
}

export async function fsSaveWorkFile(associateId, fileData) {
  try {
    const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
    const db = await getDb();
    const ref = doc(db, 'stores', STORE_ID, 'workFiles', associateId);
    await setDoc(ref, { associateId, ...fileData, _updatedAt: serverTimestamp() });
  } catch (e) {
    console.warn(`[Firestore] saveWorkFile(${associateId}):`, e?.code || e?.message);
  }
}

// ── Batch import on first connect ─────────────────────────────────────────────
// Shared data → stores/store_1687/…
// Private data → users/{uid}/… (only if uid available)
export async function batchImportToFirestore(data, uid) {
  const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
  const db = await getDb();
  let count = 0;

  // Shared collections
  const SHARED_COLLS = [
    'associates', 'callIns', 'teamEvents',
    'teamNotes', 'reviews', 'tasks', 'contacts', 'announcements',
  ];
  for (const coll of SHARED_COLLS) {
    const items = data[coll];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item?.id) continue;
      try {
        const ref = doc(db, 'stores', STORE_ID, coll, item.id);
        await setDoc(ref, { ...item, _updatedAt: serverTimestamp() }, { merge: true });
        count++;
      } catch {}
    }
  }

  // Shared workFiles map
  if (data.workFiles && typeof data.workFiles === 'object') {
    for (const [associateId, fileData] of Object.entries(data.workFiles)) {
      if (!associateId || !fileData) continue;
      try {
        const ref = doc(db, 'stores', STORE_ID, 'workFiles', associateId);
        await setDoc(ref, { associateId, ...fileData, _updatedAt: serverTimestamp() }, { merge: true });
        count++;
      } catch {}
    }
  }

  // Private collections — only migrate if we have a uid
  if (uid) {
    for (const coll of ['myNotes', 'myEvents']) {
      const items = data[coll];
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        if (!item?.id) continue;
        try {
          const ref = doc(db, 'users', uid, coll, item.id);
          await setDoc(ref, { ...item, _updatedAt: serverTimestamp() }, { merge: true });
          count++;
        } catch {}
      }
    }
  }

  return count;
}

// ── Real-time listener helpers ────────────────────────────────────────────────
function subscribeCollection(collName, callback) {
  let unsubscribe = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await storeColl(collName);
      unsubscribe = onSnapshot(
        coll,
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err) => console.warn(`[Firestore] snapshot(${collName}):`, err?.code || err?.message)
      );
    } catch (e) {
      console.warn(`[Firestore] subscribe(${collName}):`, e?.message);
    }
  })();
  return () => unsubscribe();
}

function subscribeUserCollection(uid, collName, callback) {
  let unsubscribe = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await userColl(uid, collName);
      unsubscribe = onSnapshot(
        coll,
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err) => console.warn(`[Firestore] snapshot(users/${uid}/${collName}):`, err?.code || err?.message)
      );
    } catch (e) {
      console.warn(`[Firestore] subscribe(users/${uid}/${collName}):`, e?.message);
    }
  })();
  return () => unsubscribe();
}

function subscribeWorkFiles(callback) {
  let unsubscribe = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await storeColl('workFiles');
      unsubscribe = onSnapshot(
        coll,
        (snap) => {
          const map = {};
          snap.docs.forEach(d => { map[d.id] = d.data(); });
          callback(map);
        },
        (err) => console.warn(`[Firestore] snapshot(workFiles):`, err?.code || err?.message)
      );
    } catch (e) {
      console.warn(`[Firestore] subscribe(workFiles):`, e?.message);
    }
  })();
  return () => unsubscribe();
}

// ── Main: init Firestore sync ─────────────────────────────────────────────────
export async function initFirestoreSync(set, get) {
  if (_syncActive) return;

  try {
    console.log('[Firestore] Connecting...');
    await getDb();

    // Store the current user's UID for private path writes
    const uid = get().user?.uid || null;
    _uid = uid;

    // ── Shared collections ──────────────────────────────────────────────────
    const COLL_MAP = {
      associates:    'associates',
      callIns:       'callIns',
      teamEvents:    'teamEvents',
      teamNotes:     'teamNotes',
      reviews:       'reviews',
      tasks:         'tasks',
      contacts:      'contacts',
      announcements: 'announcements',
    };

    let firstSnapshot = true;

    for (const [stateKey, collName] of Object.entries(COLL_MAP)) {
      const unsub = subscribeCollection(collName, (items) => {
        if (items.length > 0 || !firstSnapshot) {
          set({ [stateKey]: items });
        }
        if (firstSnapshot) {
          firstSnapshot = false;
          set({ dbReady: true, dbMode: 'firestore' });
          console.log('[Firestore] ✅ Connected — live sync active.');
        }
      });
      _unsubscribers.push(unsub);
    }

    // Subscribe workFiles (shared)
    _unsubscribers.push(subscribeWorkFiles((map) => set({ workFiles: map })));

    // ── Private collections (users/{uid}/…) ─────────────────────────────────
    if (uid) {
      _unsubscribers.push(
        subscribeUserCollection(uid, 'myNotes', (items) => {
          if (items.length > 0) set({ myNotes: items });
        })
      );
      _unsubscribers.push(
        subscribeUserCollection(uid, 'myEvents', (items) => {
          if (items.length > 0) set({ myEvents: items });
        })
      );
      console.log(`[Firestore] 🔒 Private collections syncing for uid: ${uid}`);
    }

    _syncActive = true;

    // ── First-time migration (run once per device) ───────────────────────────
    const MIGRATED_KEY = 'panda-fs-migrated-v3'; // v3 = private collections added
    if (!localStorage.getItem(MIGRATED_KEY)) {
      const raw = localStorage.getItem('panda-manager-storage');
      if (raw) {
        const data = JSON.parse(raw)?.state || JSON.parse(raw);
        const hasData = ['associates', 'callIns', 'teamNotes', 'myNotes', 'myEvents', 'reviews', 'tasks']
          .some(k => Array.isArray(data[k]) && data[k].length > 0);
        if (hasData) {
          console.log('[Firestore] Migrating localStorage → Firestore (including private collections)...');
          const count = await batchImportToFirestore(data, uid);
          localStorage.setItem(MIGRATED_KEY, '1');
          console.log(`[Firestore] ✅ Migrated ${count} records (shared + private).`);
        }
      }
    }
  } catch (e) {
    console.warn('[Firestore] Connection failed:', e?.code || e?.message);
    set({ dbReady: false, dbMode: 'local' });
    throw e;
  }
}

// ── Disconnect ────────────────────────────────────────────────────────────────
export function disconnectFirestore(set) {
  _unsubscribers.forEach(fn => { try { fn(); } catch {} });
  _unsubscribers = [];
  _syncActive = false;
  _db  = null;
  _uid = null;
  set({ dbReady: false, dbMode: 'local' });
  console.log('[Firestore] Disconnected.');
}
