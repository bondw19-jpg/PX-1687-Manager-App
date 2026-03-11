// firestoreService.js
// All Firestore read/write operations for PX-1687 Manager App
// Store ID is used as the top-level document so multiple stores can share one project.

import {
  collection, doc, getDocs, getDoc,
  addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, writeBatch,
  query, orderBy, where,
} from 'firebase/firestore';
import { db } from './firebase';

const STORE_ID = 'store_1687';

// ── Collection helpers ────────────────────────────────────────────────────────
const storeDoc  = ()         => doc(db, 'stores', STORE_ID);
const storeColl = (name)     => collection(db, 'stores', STORE_ID, name);
const storeItem = (name, id) => doc(db, 'stores', STORE_ID, name, id);

// ── Generic CRUD ──────────────────────────────────────────────────────────────

/** Fetch all docs in a sub-collection, returns array with id included */
export async function fetchAll(collName) {
  const snap = await getDocs(storeColl(collName));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Add a new doc (auto-ID) */
export async function addItem(collName, data) {
  const ref = await addDoc(storeColl(collName), {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
    _updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Set a doc with a known ID (creates or overwrites) */
export async function setItem(collName, id, data) {
  await setDoc(storeItem(collName, id), {
    ...data,
    _updatedAt: serverTimestamp(),
  });
}

/** Update specific fields on an existing doc */
export async function updateItem(collName, id, data) {
  await updateDoc(storeItem(collName, id), {
    ...data,
    _updatedAt: serverTimestamp(),
  });
}

/** Delete a doc */
export async function deleteItem(collName, id) {
  await deleteDoc(storeItem(collName, id));
}

// ── Real-time listeners ───────────────────────────────────────────────────────

/** Subscribe to a collection. callback(items[]) is called on every change. */
export function subscribeCollection(collName, callback) {
  return onSnapshot(storeColl(collName), snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// ── Store metadata ────────────────────────────────────────────────────────────

export async function getStoreMeta() {
  const snap = await getDoc(storeDoc());
  return snap.exists() ? snap.data() : null;
}

export async function saveStoreMeta(data) {
  await setDoc(storeDoc(), { ...data, _updatedAt: serverTimestamp() }, { merge: true });
}

// ── Checklists (stored as a single doc per date+shift) ────────────────────────

export async function saveChecklist(date, shift, items) {
  const id = `${date}_${shift}`;
  await setDoc(storeItem('checklists', id), {
    date, shift, items,
    _updatedAt: serverTimestamp(),
  });
}

export async function fetchChecklist(date, shift) {
  const id = `${date}_${shift}`;
  const snap = await getDoc(storeItem('checklists', id));
  return snap.exists() ? snap.data().items : null;
}

// ── Work Files (stored as sub-doc per associate) ──────────────────────────────

export async function saveWorkFile(associateId, fileData) {
  await setDoc(storeItem('workFiles', associateId), {
    ...fileData,
    associateId,
    _updatedAt: serverTimestamp(),
  });
}

export async function fetchWorkFile(associateId) {
  const snap = await getDoc(storeItem('workFiles', associateId));
  return snap.exists() ? snap.data() : null;
}

// ── Batch import: push all localStorage data into Firestore ──────────────────

export async function batchImportToFirestore(localData) {
  const COLLECTIONS = [
    'associates', 'callIns', 'teamEvents', 'myEvents',
    'teamNotes', 'myNotes', 'reviews', 'tasks',
    'contacts', 'announcements',
  ];

  let totalWritten = 0;

  for (const collName of COLLECTIONS) {
    const items = localData[collName];
    if (!Array.isArray(items) || items.length === 0) continue;

    // Write in batches of 500 (Firestore limit)
    const chunks = [];
    for (let i = 0; i < items.length; i += 400) {
      chunks.push(items.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const item of chunk) {
        const { id, ...rest } = item;
        const ref = id ? storeItem(collName, id) : doc(storeColl(collName));
        batch.set(ref, { ...rest, _updatedAt: serverTimestamp() }, { merge: true });
      }
      await batch.commit();
      totalWritten += chunk.length;
    }
  }

  // Checklists (object keyed by date_shift)
  if (localData.checklists && typeof localData.checklists === 'object') {
    const batch = writeBatch(db);
    let count = 0;
    for (const [key, items] of Object.entries(localData.checklists)) {
      const [date, shift] = key.split('_');
      const ref = storeItem('checklists', key);
      batch.set(ref, { date, shift, items, _updatedAt: serverTimestamp() }, { merge: true });
      count++;
      if (count >= 400) { await batch.commit(); count = 0; }
    }
    if (count > 0) await batch.commit();
    totalWritten += Object.keys(localData.checklists).length;
  }

  // Work files
  if (localData.workFiles && typeof localData.workFiles === 'object') {
    const batch = writeBatch(db);
    let count = 0;
    for (const [assocId, fileData] of Object.entries(localData.workFiles)) {
      const ref = storeItem('workFiles', assocId);
      batch.set(ref, { ...fileData, associateId: assocId, _updatedAt: serverTimestamp() }, { merge: true });
      count++;
    }
    if (count > 0) await batch.commit();
  }

  // Store metadata
  await saveStoreMeta({
    storeId:   localData.storeId   || 'store_1687',
    storeName: localData.storeName || 'PANDA EXPRESS 1687',
  });

  return totalWritten;
}
