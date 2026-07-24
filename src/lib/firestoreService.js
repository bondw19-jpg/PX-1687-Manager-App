// firestoreService.js
// All Firestore operations. Uses lazy Firebase init — safe before DB is ready.

import { getFirebaseModules } from './firebase';

const STORE_ID = 'store_1687';

// ── Lazy helpers: get Firestore refs after init ───────────────────────────────
async function getDb() {
  const { db } = await getFirebaseModules();
  return db;
}

async function storeDoc() {
  const { doc, collection: _c } = await import('firebase/firestore');
  const db = await getDb();
  return doc(db, 'stores', STORE_ID);
}

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

// ── Error logger ──────────────────────────────────────────────────────────────
function warnFS(op, err) {
  const code = err?.code || '';
  if (['permission-denied','unavailable','unimplemented'].includes(code)) {
    console.info(`[Firestore] ${op} — DB not enabled yet (${code}). Running in local mode.`);
  } else {
    console.warn(`[Firestore] ${op} error:`, err?.message || err);
  }
}

// ── Generic CRUD ──────────────────────────────────────────────────────────────

export async function setItem(collName, id, data) {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await setDoc(ref, { ...data, _updatedAt: serverTimestamp() });
  } catch (e) { warnFS(`setItem(${collName}/${id})`, e); }
}

export async function updateItem(collName, id, data) {
  try {
    const { updateDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    try {
      await updateDoc(ref, { ...data, _updatedAt: serverTimestamp() });
    } catch (e2) {
      if (e2?.code === 'not-found') await setDoc(ref, { ...data, _updatedAt: serverTimestamp() });
      else throw e2;
    }
  } catch (e) { warnFS(`updateItem(${collName}/${id})`, e); }
}

export async function deleteItem(collName, id) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const ref = await storeItem(collName, id);
    await deleteDoc(ref);
  } catch (e) { warnFS(`deleteItem(${collName}/${id})`, e); }
}

// ── Real-time listener ────────────────────────────────────────────────────────
export function subscribeCollection(collName, callback) {
  let unsubscribe = () => {};

  // Async setup — errors never propagate to React render tree
  (async () => {
    try {
      const { onSnapshot } = await import('firebase/firestore');
      const coll = await storeColl(collName);
      unsubscribe = onSnapshot(
        coll,
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err)  => warnFS(`subscribeCollection(${collName})`, err)
      );
    } catch (e) {
      warnFS(`subscribeCollection(${collName}) setup`, e);
    }
  })();

  // Return a function that calls unsubscribe when it's eventually set
  return () => unsubscribe();
}

// ── Store metadata ────────────────────────────────────────────────────────────

export async function saveStoreMeta(data) {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeDoc();
    await setDoc(ref, { ...data, _updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) { warnFS('saveStoreMeta', e); }
}

// ── Checklists ────────────────────────────────────────────────────────────────

export async function saveChecklist(date, shift, items) {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem('checklists', `${date}_${shift}`);
    await setDoc(ref, { date, shift, items, _updatedAt: serverTimestamp() });
  } catch (e) { warnFS('saveChecklist', e); }
}

// ── Work Files ────────────────────────────────────────────────────────────────

export async function saveWorkFile(associateId, fileData) {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await storeItem('workFiles', associateId);
    await setDoc(ref, { ...fileData, associateId, _updatedAt: serverTimestamp() });
  } catch (e) { warnFS('saveWorkFile', e); }
}

// ── Batch import: localStorage → Firestore ────────────────────────────────────

export async function batchImportToFirestore(localData) {
  let totalWritten = 0;
  try {
    const { writeBatch, doc, serverTimestamp } = await import('firebase/firestore');
    const db = await getDb();

    const COLLECTIONS = [
      'associates','callIns','teamEvents','myEvents',
      'teamNotes','myNotes','reviews','tasks','lendBorrow','changeOrders','contacts','announcements',
    ];

    for (const collName of COLLECTIONS) {
      const items = localData[collName];
      if (!Array.isArray(items) || items.length === 0) continue;
      const chunks = [];
      for (let i = 0; i < items.length; i += 400) chunks.push(items.slice(i, i + 400));
      for (const chunk of chunks) {
        const batch = writeBatch(db);
        for (const item of chunk) {
          const { id, ...rest } = item;
          const ref = id
            ? doc(db, 'stores', STORE_ID, collName, id)
            : doc(db, 'stores', STORE_ID, collName);          // auto-ID
          batch.set(ref, { ...rest, _updatedAt: serverTimestamp() }, { merge: true });
        }
        await batch.commit();
        totalWritten += chunk.length;
      }
    }

    await saveStoreMeta({
      storeId:   localData.storeId   || 'store_1687',
      storeName: localData.storeName || 'PANDA EXPRESS 1687',
    });
  } catch (e) {
    warnFS('batchImportToFirestore', e);
    return 0;
  }
  return totalWritten;
}
