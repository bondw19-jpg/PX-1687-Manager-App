// firebase.js — lazy-initialised so it never blocks app startup
// getFirebaseModules() returns a promise; call it only after the UI renders.

let _app     = null;
let _auth    = null;
let _db      = null;
let _storage = null;
let _initPromise = null;

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export async function getFirebaseModules() {
  if (_db) return { app: _app, auth: _auth, db: _db, storage: _storage };
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth }    = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');
    const { getStorage } = await import('firebase/storage');

    _app     = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    _auth    = getAuth(_app);
    _db      = getFirestore(_app);
    _storage = getStorage(_app);

    console.log('[Firebase] ✅ Initialized.');
    return { app: _app, auth: _auth, db: _db, storage: _storage };
  })();

  return _initPromise;
}

// Synchronous accessors — only valid AFTER getFirebaseModules() resolves
export const getDb      = () => _db;
export const getAuth_   = () => _auth;
export const getStorage_ = () => _storage;
