// firebase.js — lazy-initialised so it never blocks app startup
// getFirebaseModules() returns a promise; call it only after the UI renders.

let _app     = null;
let _auth    = null;
let _db      = null;
let _storage = null;
let _initPromise = null;

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'AIzaSyCK_DyOK-Ho-g-K1JL0h1oUiPkZzZcnoTM',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'px-1687-manager-app.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'px-1687-manager-app',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'px-1687-manager-app.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '309142080118',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:309142080118:web:3e7d618f6853c38e52ad57',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || 'G-QD7ZEQ8BQ8',
};

export async function getFirebaseModules() {
  if (_db) return { app: _app, auth: _auth, db: _db, storage: _storage };
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      const { getAuth }      = await import('firebase/auth');
      const { getFirestore } = await import('firebase/firestore');
      const { getStorage }   = await import('firebase/storage');

      _app     = getApps().length ? getApp() : initializeApp(firebaseConfig);
      _auth    = getAuth(_app);
      _db      = getFirestore(_app);
      _storage = getStorage(_app);

      console.log('[Firebase] ✅ Initialized — project:', firebaseConfig.projectId);
      return { app: _app, auth: _auth, db: _db, storage: _storage };
    } catch (e) {
      console.error('[Firebase] ❌ Init failed:', e.message);
      _initPromise = null; // allow retry
      throw e;
    }
  })();

  return _initPromise;
}

// Synchronous accessors — only valid AFTER getFirebaseModules() resolves
export const getDb       = () => _db;
export const getAuth_    = () => _auth;
export const getStorage_ = () => _storage;
