// firestoreSync.js
// ─────────────────────────────────────────────────────────────────────────────
// This module is ONLY imported dynamically when the user explicitly connects
// Firebase from the Backup & Restore page. It is NEVER loaded at app startup.
//
// SHARING RULES:
//   SHARED  (synced across all team devices via Firestore):
//     associates, workFiles, callIns, teamEvents, teamNotes,
//     reviews, tasks, contacts, announcements
//   PRIVATE (local-only, never synced to Firestore):
//     myEvents  — Personal Calendar
//     myNotes   — Personal Notes
// ─────────────────────────────────────────────────────────────────────────────

const STORE_ID = 'store_1687';

let _db = null;
let _syncActive = false;
let _unsubscribers = [];

// ── Lazy Firebase init ────────────────────────────────────────────────────────
async function getDb() {
  if (_db) return _db;
  const { getFirebaseModules } = await import('./firebase');
  const { db } = await getFirebaseModules();
  _db = db;
  return _db;
}

// ── Collection helpers ────────────────────────────────────────────────────────
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

// ── Generic write helpers (for array-based shared collections) ────────────────
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

// ── Work File sync (SHARED — associate work files are team-accessible) ─────────
// workFiles is stored as a Firestore collection: workFiles/{associateId}
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

// ── Batch import: push shared localStorage data to Firestore ──────────────────
// NOTE: myEvents and myNotes are intentionally excluded (private/local-only)
export async function batchImportToFirestore(data) {
  const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
  const db = await getDb();

  // Shared array collections (NOT myEvents, NOT myNotes)
  const SHARED_COLLS = [
    'associates', 'callIns', 'teamEvents',
    'teamNotes', 'reviews', 'tasks', 'contacts', 'announcements',
  ];
  let count = 0;

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

  // Shared workFiles map: { associateId: fileData, ... }
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

  return count;
}

// ── Real-time listener for array-based collections ────────────────────────────
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

// ── Real-time listener for workFiles (map: { associateId: fileData }) ──────────
function subscribeWorkFiles(callback) {
  let unsubscribe = () => {};
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await storeColl('workFiles');
      unsubscribe = onSnapshot(
        coll,
        (snap) => {
          // Convert array of docs → map keyed by associateId
          const map = {};
          snap.docs.forEach(d => {
            const data = d.data();
            map[d.id] = data;
          });
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

// ── Main: init Firestore sync (called only when user connects) ────────────────
export async function initFirestoreSync(set, get) {
  if (_syncActive) return;

  try {
    console.log('[Firestore] Connecting...');
    await getDb(); // throws if credentials are wrong / DB not provisioned

    // SHARED collections — synced across all team devices
    // myEvents and myNotes are intentionally NOT listed here (private/local)
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

    // Subscribe all shared array collections
    for (const [stateKey, collName] of Object.entries(COLL_MAP)) {
      const unsub = subscribeCollection(collName, (items) => {
        // Only override local data if Firestore actually has docs
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

    // Subscribe workFiles map (shared — associate work files are team data)
    const unsubWorkFiles = subscribeWorkFiles((workFilesMap) => {
      set({ workFiles: workFilesMap });
    });
    _unsubscribers.push(unsubWorkFiles);

    _syncActive = true;

    // First-time migration: push shared localStorage data to Firestore
    // myEvents and myNotes stay local — they are private per-device
    const MIGRATED_KEY = 'panda-fs-migrated-v2'; // v2 = new sharing rules
    if (!localStorage.getItem(MIGRATED_KEY)) {
      const raw = localStorage.getItem('panda-manager-storage');
      if (raw) {
        const data = JSON.parse(raw)?.state || JSON.parse(raw);
        const hasData = ['associates', 'callIns', 'teamNotes', 'reviews', 'tasks']
          .some(k => Array.isArray(data[k]) && data[k].length > 0);
        if (hasData) {
          console.log('[Firestore] Migrating shared localStorage → Firestore (myEvents & myNotes stay local)...');
          const count = await batchImportToFirestore(data);
          localStorage.setItem(MIGRATED_KEY, '1');
          console.log(`[Firestore] ✅ Migrated ${count} shared records.`);
        }
      }
    }
  } catch (e) {
    console.warn('[Firestore] Connection failed:', e?.code || e?.message);
    set({ dbReady: false, dbMode: 'local' });
    throw e; // re-throw so BackupManager can show error message
  }
}

// ── Disconnect ────────────────────────────────────────────────────────────────
export function disconnectFirestore(set) {
  _unsubscribers.forEach(fn => { try { fn(); } catch {} });
  _unsubscribers = [];
  _syncActive = false;
  _db = null;
  set({ dbReady: false, dbMode: 'local' });
  console.log('[Firestore] Disconnected.');
}
