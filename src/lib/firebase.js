// firebase.js — lazy-initialised so it never blocks app startup
// getFirebaseModules() returns a promise; call it only after the UI renders.
//
// IMPORTANT: Firebase Auth restoration is ASYNC.
// When the app starts (especially as a PWA), Firebase needs time to restore
// the previously-signed-in session from IndexedDB. Until that restoration
// completes, auth.currentUser is null — even if the user was signed in.
// If Firestore listeners start before auth is ready, they hit PERMISSION DENIED
// because the security rules require request.auth != null.
//
// FIX: waitForAuthReady() resolves only after onAuthStateChanged fires once,
// confirming Firebase has finished restoring (or confirmed no) auth session.
// Always call this before starting any Firestore listener.

let _app     = null;
let _auth    = null;
let _db      = null;
let _storage = null;
let _initPromise      = null;
let _authReadyPromise = null; // resolves after first onAuthStateChanged fires

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

/**
 * waitForAuthReady() — resolves once Firebase Auth has finished restoring
 * the persisted session (or confirmed no user is signed in).
 *
 * In a PWA or after a page reload, Firebase Auth persists the session in
 * IndexedDB. Restoring that session takes a short but non-zero amount of time.
 * onAuthStateChanged fires exactly once when that restoration is complete.
 * Until it fires, auth.currentUser is null → Firestore security rules deny reads.
 *
 * Returns: the restored Firebase User, or null if no session.
 * Timeout: 8 seconds — if auth takes longer, we proceed anyway so the app
 * doesn't hang. Firestore listeners will get PERMISSION DENIED and show the
 * amber "not synced" banner, allowing the user to tap "Sync to Cloud" to retry.
 */
export async function waitForAuthReady() {
  // Ensure Firebase is initialised first
  await getFirebaseModules();

  // Return cached promise if already in flight or resolved
  if (_authReadyPromise) return _authReadyPromise;

  _authReadyPromise = new Promise((resolve) => {
    (async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');

        // 8-second safety timeout — prevents the app hanging if auth stalls
        const timer = setTimeout(() => {
          console.warn('[Firebase] waitForAuthReady: timed out after 8s — proceeding');
          resolve(null);
        }, 8000);

        // onAuthStateChanged fires once immediately with the restored user (or null)
        const unsub = onAuthStateChanged(_auth, (firebaseUser) => {
          clearTimeout(timer);
          unsub(); // unsubscribe after first event — we only need the initial state
          if (firebaseUser) {
            console.log('[Firebase] ✅ Auth ready — signed in as:', firebaseUser.email, '| uid:', firebaseUser.uid);
          } else {
            console.log('[Firebase] Auth ready — no user signed in (PWA may need re-login)');
          }
          resolve(firebaseUser);
        });
      } catch (e) {
        console.warn('[Firebase] waitForAuthReady error:', e.message);
        resolve(null);
      }
    })();
  });

  return _authReadyPromise;
}

/**
 * resetAuthReadyPromise() — call on sign-out so the next sign-in
 * gets a fresh auth-ready check.
 */
export function resetAuthReadyPromise() {
  _authReadyPromise = null;
}

// Synchronous accessors — only valid AFTER getFirebaseModules() resolves
export const getDb       = () => _db;
export const getAuth_    = () => _auth;
export const getStorage_ = () => _storage;
