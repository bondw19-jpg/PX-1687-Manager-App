// firestoreSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Loaded dynamically the first time the user connects Firebase.
//
// STORAGE PATHS:
//   SHARED  (all team members):
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
//   PRIVATE (per-user, only the owner can read/write):
//     users/{uid}/myNotes/{id}
//     users/{uid}/myEvents/{id}
// ─────────────────────────────────────────────────────────────────────────────

const STORE_ID = 'store_1687';

let _db            = null;
let _uid           = null;   // current user's UID — updated every connect()
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

// ── Public accessor for _uid (lets appStore helpers read it synchronously) ────
export function getCurrentUid() { return _uid; }

// ── Shared collection path helpers ───────────────────────────────────────────
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

// ── Private user path helpers (users/{uid}/…) ─────────────────────────────────
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

// ── SHARED write helpers ──────────────────────────────────────────────────────

export async function fsSetItem(collName, id, data) {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn(`[FS] set(${collName}/${id}):`, e?.code || e?.message);
  }
}

export async function fsUpdateItem(collName, id, data) {
  try {
    const { updateDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await updateDoc(ref, { ...data, _updatedAt: serverTimestamp() });
  } catch {
    // Doc may not exist yet — fall back to setDoc (merge)
    try {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      const ref = await storeItem(collName, id);
      await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
    } catch (e2) {
      console.warn(`[FS] update(${collName}/${id}):`, e2?.code || e2?.message);
    }
  }
}

export async function fsDeleteItem(collName, id) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await deleteDoc(ref);
  } catch (e) {
    console.warn(`[FS] delete(${collName}/${id}):`, e?.code || e?.message);
  }
}

// ── PRIVATE write helpers (users/{uid}/…) ─────────────────────────────────────
// NOTE: uid is read at call-time from the module-level _uid variable.
// If sync hasn't started yet (uid null), we fall back to reading from the
// store-level getter passed during connect. A getter is NOT available here,
// so we accept an optional explicit uid override instead.

export async function fsSetPrivateItem(collName, id, data, uidOverride) {
  const uid = uidOverride || _uid;
  if (!uid) {
    console.warn(`[FS] setPrivate(${collName}/${id}): no uid — skipping`);
    return;
  }
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn(`[FS] setPrivate(${collName}/${id}):`, e?.code || e?.message);
  }
}

export async function fsUpdatePrivateItem(collName, id, data, uidOverride) {
  const uid = uidOverride || _uid;
  if (!uid) return;
  try {
    const { updateDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    await updateDoc(ref, { ...data, _updatedAt: serverTimestamp() });
  } catch {
    try {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      const ref = await userItem(uid, collName, id);
      await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
    } catch (e2) {
      console.warn(`[FS] updatePrivate(${collName}/${id}):`, e2?.code || e2?.message);
    }
  }
}

export async function fsDeletePrivateItem(collName, id, uidOverride) {
  const uid = uidOverride || _uid;
  if (!uid) return;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    await deleteDoc(ref);
  } catch (e) {
    console.warn(`[FS] deletePrivate(${collName}/${id}):`, e?.code || e?.message);
  }
}

// ── Checklist & WorkFile (special-shape shared docs) ─────────────────────────

export async function fsSaveChecklist(date, shift, items) {
  try {
    const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
    const db = await getDb();
    const ref = doc(db, 'stores', STORE_ID, 'checklists', `${date}_${shift}`);
    await setDoc(ref, { date, shift, items, _updatedAt: serverTimestamp() });
  } catch (e) {
    console.warn(`[FS] saveChecklist(${date}/${shift}):`, e?.code || e?.message);
  }
}

export async function fsSaveWorkFile(associateId, fileData) {
  try {
    const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
    const db = await getDb();
    const ref = doc(db, 'stores', STORE_ID, 'workFiles', associateId);
    await setDoc(ref, { associateId, ...fileData, _updatedAt: serverTimestamp() });
  } catch (e) {
    console.warn(`[FS] saveWorkFile(${associateId}):`, e?.code || e?.message);
  }
}

// ── Batch import (first-time migration) ───────────────────────────────────────
export async function batchImportToFirestore(data, uid) {
  const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
  const db = await getDb();
  let count = 0;

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

// ── Snapshot helpers ──────────────────────────────────────────────────────────
function subscribeCollection(collName, callback) {
  let unsub = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await storeColl(collName);
      unsub = onSnapshot(
        coll,
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err)  => console.warn(`[FS] snapshot(${collName}):`, err?.code || err?.message)
      );
    } catch (e) {
      console.warn(`[FS] subscribe(${collName}):`, e?.message);
    }
  })();
  return () => unsub();
}

function subscribeUserCollection(uid, collName, callback) {
  let unsub = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await userColl(uid, collName);
      unsub = onSnapshot(
        coll,
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err)  => console.warn(`[FS] snapshot(users/${uid}/${collName}):`, err?.code || err?.message)
      );
    } catch (e) {
      console.warn(`[FS] subscribe(users/${uid}/${collName}):`, e?.message);
    }
  })();
  return () => unsub();
}

function subscribeWorkFiles(callback) {
  let unsub = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await storeColl('workFiles');
      unsub = onSnapshot(
        coll,
        (snap) => {
          const map = {};
          snap.docs.forEach(d => { map[d.id] = d.data(); });
          callback(map);
        },
        (err) => console.warn(`[FS] snapshot(workFiles):`, err?.code || err?.message)
      );
    } catch (e) {
      console.warn(`[FS] subscribe(workFiles):`, e?.message);
    }
  })();
  return () => unsub();
}

// ── Main: init Firestore sync ─────────────────────────────────────────────────
export async function initFirestoreSync(set, get) {
  // Allow re-connect after logout: tear down old listeners first
  if (_syncActive) {
    disconnectFirestore(set);
  }

  try {
    console.log('[FS] Connecting…');
    await getDb();

    // Capture UID — MUST happen before any private write helpers can fire
    const uid = get().user?.uid || null;
    _uid = uid;
    console.log('[FS] uid =', uid || '(none — shared data only)');

    // ── Shared collections ────────────────────────────────────────────────────
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

    // Track how many snapshots have fired so we know when to signal "ready"
    const collNames      = Object.keys(COLL_MAP);
    let   snapshotsFired = 0;
    const TOTAL          = collNames.length;
    const MIGRATED_KEY   = 'panda-fs-migrated-v4';
    const alreadyMigrated = !!localStorage.getItem(MIGRATED_KEY);

    for (const [stateKey, collName] of Object.entries(COLL_MAP)) {
      const unsub = subscribeCollection(collName, (items) => {
        // Only update state if Firestore has items, OR migration already ran
        // (so we trust Firestore as source of truth after first sync).
        if (items.length > 0 || alreadyMigrated) {
          set({ [stateKey]: items });
        }

        snapshotsFired++;
        if (snapshotsFired === 1) {
          set({ dbReady: true, dbMode: 'firestore' });
          console.log('[FS] ✅ Connected — live sync active.');
        }
        if (snapshotsFired === TOTAL) {
          console.log('[FS] All shared collections loaded.');
        }
      });
      _unsubscribers.push(unsub);
    }

    // workFiles (shared, map shape)
    _unsubscribers.push(
      subscribeWorkFiles((map) => set({ workFiles: map }))
    );

    // ── Private collections ───────────────────────────────────────────────────
    if (uid) {
      const MIGRATED_KEY = 'panda-fs-migrated-v4';
      const alreadyMigrated = !!localStorage.getItem(MIGRATED_KEY);

      _unsubscribers.push(
        subscribeUserCollection(uid, 'myNotes', (items) => {
          // If Firestore has data → always use it (authoritative).
          // If Firestore is empty AND migration hasn't run yet → keep local data
          // (the migration will push it to Firestore momentarily).
          if (items.length > 0 || alreadyMigrated) {
            set({ myNotes: items });
          }
        })
      );
      _unsubscribers.push(
        subscribeUserCollection(uid, 'myEvents', (items) => {
          if (items.length > 0 || alreadyMigrated) {
            set({ myEvents: items });
          }
        })
      );
      console.log(`[FS] 🔒 Private collections syncing for uid: ${uid}`);
    }

    _syncActive = true;

    // ── One-time migration: push existing localStorage data to Firestore ───────
    if (!alreadyMigrated) {
      try {
        const raw  = localStorage.getItem('panda-manager-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          const data   = parsed?.state ?? parsed;
          const hasData = [
            'associates', 'callIns', 'teamNotes', 'myNotes', 'myEvents',
            'reviews', 'tasks', 'contacts', 'announcements',
          ].some(k => Array.isArray(data[k]) && data[k].length > 0);

          if (hasData) {
            console.log('[FS] Migrating existing data to Firestore…');
            const count = await batchImportToFirestore(data, uid);
            console.log(`[FS] ✅ Migrated ${count} records.`);
          }
        }
        localStorage.setItem(MIGRATED_KEY, '1');
      } catch (me) {
        console.warn('[FS] Migration error (non-fatal):', me?.message);
      }
    }

  } catch (e) {
    console.warn('[FS] Connection failed:', e?.code || e?.message);
    set({ dbReady: false, dbMode: 'local' });
    _syncActive = false;
    throw e;
  }
}

// ── Disconnect ────────────────────────────────────────────────────────────────
export function disconnectFirestore(set) {
  _unsubscribers.forEach(fn => { try { fn(); } catch {} });
  _unsubscribers = [];
  _syncActive    = false;
  _db            = null;
  _uid           = null;
  if (set) set({ dbReady: false, dbMode: 'local' });
  console.log('[FS] Disconnected.');
}
