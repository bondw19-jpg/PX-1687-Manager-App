// firestoreSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Loaded dynamically the first time the user connects Firebase.
//
// KEY DESIGN DECISIONS:
// • Firestore is ALWAYS the source of truth once connected.
// • Private collections (myNotes, myEvents) are stored under users/{uid}/
//   so they are per-user and invisible to other team members.
// • Migration runs once PER UID (key includes uid) so each device/PWA
//   context only migrates its own localStorage data once. It never
//   overwrites existing Firestore docs (uses create-if-missing logic).
// • onSnapshot always applies Firestore data to state — no guards that
//   block updates when collections are empty. This ensures the PWA
//   (which has its own isolated localStorage) always loads from Firestore.
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

// Strip base64 dataUrls from attachment arrays before writing to Firestore.
// Firestore documents have a 1 MB size limit; a single base64-encoded image
// easily exceeds that and causes the write to fail silently, making the note
// disappear when onSnapshot overwrites state with the server's (broken) copy.
// We keep all other metadata (id, name, type, size) for display purposes.
function stripAttachmentDataUrls(data) {
  if (!data || typeof data !== 'object') return data;
  if (!Array.isArray(data.attachments) || data.attachments.length === 0) return data;
  return {
    ...data,
    attachments: data.attachments.map(({ dataUrl: _dropped, ...rest }) => rest),
  };
}

let _db            = null;
let _uid           = null;
let _syncActive    = false;
let _unsubscribers = [];
let _heartbeatTimer = null; // interval ID for presence heartbeat

// ── Lazy Firebase init ────────────────────────────────────────────────────────
async function getDb() {
  if (_db) return _db;
  const { getFirebaseModules } = await import('./firebase');
  const { db } = await getFirebaseModules();
  _db = db;
  return _db;
}

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
    const safe = stripAttachmentDataUrls(data);
    await setDoc(ref, { ...safe, _updatedAt: serverTimestamp() }, { merge: true });
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

export async function fsSetPrivateItem(collName, id, data, uidOverride) {
  const uid = uidOverride || _uid;
  if (!uid) {
    console.warn(`[FS] setPrivate(${collName}/${id}): no uid — skipping`);
    return;
  }
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await userItem(uid, collName, id);
    const safe = stripAttachmentDataUrls(data);
    await setDoc(ref, { ...safe, _updatedAt: serverTimestamp() }, { merge: true });
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

// ── Presence system ────────────────────────────────────────────────────────────
// Writes a presence doc to stores/store_1687/presence/{uid} whenever the user
// is connected. The Admin panel subscribes to this collection live to show
// who is online.
//
// Fields written:
//   uid, name, email, role, isOnline, lastSeen (serverTimestamp), storeId
//
// "Online" = lastSeen within the last 3 minutes (heartbeat every 60s)
// ─────────────────────────────────────────────────────────────────────────────

export async function writePresence(uid, profile, isOnline = true) {
  if (!uid) return;
  try {
    const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
    const db = await getDb();
    const ref = doc(db, 'stores', STORE_ID, 'presence', uid);
    await setDoc(ref, {
      uid,
      name:     (profile.name || profile.displayName || profile.email?.split('@')[0] || 'Unknown').trim().split(/\s+/)[0],
      email:    profile.email || '',
      role:     profile.role  || 'manager',
      storeId:  STORE_ID,
      isOnline,
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    // Non-fatal — presence is best-effort
    console.warn('[FS] writePresence failed:', e?.code || e?.message);
  }
}

export async function writePresenceOffline(uid) {
  if (!uid) return;
  try {
    const { updateDoc, serverTimestamp, doc } = await import('firebase/firestore');
    const db = await getDb();
    const ref = doc(db, 'stores', STORE_ID, 'presence', uid);
    await updateDoc(ref, { isOnline: false, lastSeen: serverTimestamp() });
  } catch {
    // Ignore — user may be offline anyway
  }
}

export function startPresenceHeartbeat(uid, profile) {
  stopPresenceHeartbeat(); // clear any existing timer
  if (!uid) return;
  // Write immediately, then every 60 seconds
  writePresence(uid, profile, true);
  _heartbeatTimer = setInterval(() => {
    writePresence(uid, profile, true);
  }, 60_000);
}

export function stopPresenceHeartbeat() {
  if (_heartbeatTimer) {
    clearInterval(_heartbeatTimer);
    _heartbeatTimer = null;
  }
}

// ── Batch import (first-time migration) ───────────────────────────────────────
// IMPORTANT: Uses { merge: false } equivalent — only sets docs that don't exist
// yet via getDoc check, so it never overwrites data already in Firestore.
// This is safe to run from any device (browser, PWA, new phone) without
// clobbering another device's more recent data.
export async function batchImportToFirestore(data, uid) {
  const { setDoc, getDoc, serverTimestamp, doc } = await import('firebase/firestore');
  const db = await getDb();
  let count = 0;

  // Helper: only write if doc doesn't exist yet in Firestore
  async function writeIfMissing(ref, payload) {
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { ...payload, _updatedAt: serverTimestamp() });
        count++;
      }
    } catch {}
  }

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
      const ref = doc(db, 'stores', STORE_ID, coll, item.id);
      await writeIfMissing(ref, item);
    }
  }

  // workFiles map
  if (data.workFiles && typeof data.workFiles === 'object') {
    for (const [associateId, fileData] of Object.entries(data.workFiles)) {
      if (!associateId || !fileData) continue;
      const ref = doc(db, 'stores', STORE_ID, 'workFiles', associateId);
      await writeIfMissing(ref, { associateId, ...fileData });
    }
  }

  // Private collections (only if uid available)
  if (uid) {
    for (const coll of ['myNotes', 'myEvents']) {
      const items = data[coll];
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        if (!item?.id) continue;
        const ref = doc(db, 'users', uid, coll, item.id);
        await writeIfMissing(ref, item);
      }
    }
  }

  return count;
}

// ── Batch FORCE import (used after restore/import) ────────────────────────────
// Same as batchImportToFirestore but ALWAYS overwrites — uses setDoc with merge:true
// so imported/restored data replaces whatever was in Firestore before.
// This is the correct behaviour after a manual import or restore from backup.
export async function batchForceToFirestore(data, uid) {
  const { setDoc, serverTimestamp, doc } = await import('firebase/firestore');
  const db = await getDb();
  let count = 0;

  async function forceWrite(ref, payload) {
    try {
      await setDoc(ref, { ...payload, _updatedAt: serverTimestamp() }, { merge: true });
      count++;
    } catch (e) {
      console.warn('[FS] forceWrite failed:', e?.code || e?.message);
    }
  }

  const SHARED_COLLS = [
    'associates', 'callIns', 'teamEvents',
    'teamNotes', 'reviews', 'tasks', 'contacts', 'announcements',
  ];
  for (const coll of SHARED_COLLS) {
    const items = data[coll];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item?.id) continue;
      const ref = doc(db, 'stores', STORE_ID, coll, item.id);
      await forceWrite(ref, item);
    }
  }

  if (data.workFiles && typeof data.workFiles === 'object') {
    for (const [associateId, fileData] of Object.entries(data.workFiles)) {
      if (!associateId || !fileData) continue;
      const ref = doc(db, 'stores', STORE_ID, 'workFiles', associateId);
      await forceWrite(ref, { associateId, ...fileData });
    }
  }

  if (uid) {
    for (const coll of ['myNotes', 'myEvents']) {
      const items = data[coll];
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        if (!item?.id) continue;
        const ref = doc(db, 'users', uid, coll, item.id);
        await forceWrite(ref, item);
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
  // Tear down any existing listeners (handles logout → login re-connect)
  if (_syncActive) {
    disconnectFirestore(set);
  }

  try {
    console.log('[FS] Connecting…');

    // ── CRITICAL: Wait for Firebase Auth to restore the persisted session ────
    // In a PWA (or after any page reload) Firebase Auth needs ~100–2000ms to
    // read the session from IndexedDB and restore auth.currentUser.
    // If we start Firestore listeners BEFORE this completes, every read against
    // users/{uid}/myNotes hits PERMISSION DENIED (request.auth is null) and
    // the onSnapshot error handler silently swallows it — leaving myNotes empty.
    //
    // waitForAuthReady() waits for onAuthStateChanged to fire once, which is
    // the definitive signal that auth restoration is complete.
    const { waitForAuthReady } = await import('./firebase');
    const firebaseUser = await waitForAuthReady();
    console.log('[FS] Auth confirmed:', firebaseUser?.uid || 'no firebase user');

    await getDb();

    // Use Firebase Auth uid as the authoritative source; fall back to Zustand
    // state uid (covers the case where user signed in earlier this session).
    const uid = firebaseUser?.uid || get().user?.uid || null;
    _uid = uid;
    console.log('[FS] uid =', uid || '(none — shared data only)');

    // If we have a uid from Firebase Auth but Zustand state has an older uid,
    // make sure Zustand user uid matches Firebase Auth uid.
    if (firebaseUser?.uid && get().user?.uid && firebaseUser.uid !== get().user?.uid) {
      console.warn('[FS] uid mismatch — Firebase:', firebaseUser.uid, '| Zustand:', get().user?.uid, '— using Firebase uid');
    }

    // Migration key is PER UID so each user/device migrates independently
    // and a fresh PWA context for the same user doesn't re-run migration.
    const MIGRATED_KEY = uid
      ? `panda-fs-migrated-v4-${uid}`
      : 'panda-fs-migrated-v4-anon';
    const alreadyMigrated = !!localStorage.getItem(MIGRATED_KEY);

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

    let snapshotsFired = 0;
    const TOTAL = Object.keys(COLL_MAP).length;

    for (const [stateKey, collName] of Object.entries(COLL_MAP)) {
      const unsub = subscribeCollection(collName, (items) => {
        // ALWAYS apply Firestore data — Firestore is the source of truth.
        // Before migration: keep local data if Firestore is empty (items=[])
        //   so existing local data isn't wiped before migration uploads it.
        // After migration: always apply even if empty (user deleted everything).
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

    // workFiles (shared)
    _unsubscribers.push(
      subscribeWorkFiles((map) => set({ workFiles: map }))
    );

    // ── Private collections (users/{uid}/…) ──────────────────────────────────
    // Auth is confirmed ready above — onSnapshot for private collections will
    // succeed because Firebase Auth has already restored the token.
    // Firestore is unconditionally authoritative for private data:
    //   - items non-empty → update state with cloud notes ✅
    //   - items empty     → user has no cloud notes (correct — show empty) ✅
    if (uid) {
      _unsubscribers.push(
        subscribeUserCollection(uid, 'myNotes', (items) => {
          set({ myNotes: items });
          console.log(`[FS] 🔒 myNotes loaded from cloud: ${items.length} note(s)`);
        })
      );
      _unsubscribers.push(
        subscribeUserCollection(uid, 'myEvents', (items) => {
          set({ myEvents: items });
          console.log(`[FS] 🔒 myEvents loaded from cloud: ${items.length} event(s)`);
        })
      );
      console.log(`[FS] 🔒 Subscribed to private collections for uid: ${uid}`);
    } else {
      console.log('[FS] No uid — private collections (myNotes/myEvents) not subscribed.');
    }

    _syncActive = true;

    // ── Presence heartbeat ────────────────────────────────────────────────────
    // Write the user's presence immediately and refresh every 60 seconds.
    // This powers the "Who is online" list in the Admin panel.
    if (uid) {
      const userProfile = get().user || {};
      startPresenceHeartbeat(uid, userProfile);

      // Mark offline when the tab/PWA is closed or navigated away
      const handleOffline = () => writePresenceOffline(uid).catch(() => {});
      window.addEventListener('beforeunload', handleOffline);
      window.addEventListener('pagehide',     handleOffline);
      // Store cleanup ref so disconnectFirestore can remove it
      _unsubscribers.push(() => {
        window.removeEventListener('beforeunload', handleOffline);
        window.removeEventListener('pagehide',     handleOffline);
      });
    }

    // ── One-time migration per uid: upload local data that isn't in Firestore ─
    // Runs once per uid per browser context (browser and PWA each have their
    // own localStorage, so each will migrate its own local data independently).
    // Uses writeIfMissing so it never overwrites newer Firestore data.
    if (!alreadyMigrated) {
      try {
        const raw = localStorage.getItem('panda-manager-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          const data   = parsed?.state ?? parsed;
          const hasData = [
            'associates', 'callIns', 'teamNotes', 'myNotes', 'myEvents',
            'reviews', 'tasks', 'contacts', 'announcements',
          ].some(k => Array.isArray(data[k]) && data[k].length > 0);

          if (hasData) {
            console.log('[FS] Migrating local data → Firestore (create-only, no overwrites)…');
            const count = await batchImportToFirestore(data, uid);
            console.log(`[FS] ✅ Migrated ${count} new records.`);
          }
        }
        // Mark migration done for this uid in this browser context
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
  // Stop heartbeat and mark user offline before tearing down listeners
  stopPresenceHeartbeat();
  if (_uid) writePresenceOffline(_uid).catch(() => {});

  _unsubscribers.forEach(fn => { try { fn(); } catch {} });
  _unsubscribers = [];
  _syncActive    = false;
  _db            = null;
  _uid           = null;
  if (set) set({ dbReady: false, dbMode: 'local' });
  // Reset auth-ready promise so the next sign-in gets a fresh auth check
  import('./firebase').then(({ resetAuthReadyPromise }) => resetAuthReadyPromise()).catch(() => {});
  console.log('[FS] Disconnected.');
}
