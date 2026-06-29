import React, { Suspense, lazy, Component, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import Layout from './components/Layout';
import { getFirebaseModules } from './lib/firebase';
import { loadOrCreateMemberProfile } from './lib/memberRoles';
import { canAccessPath, SHIFT_LEAD_FIRST_PATH } from './lib/permissions';
import { isShiftLeadUser } from './lib/roles';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import ToastHost from './components/ToastHost';
import ConfirmHost from './components/ConfirmHost';

// Lazy load pages
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const ShiftLeadDashboard = lazy(() => import('./pages/ShiftLeadDashboard'));
const Associates    = lazy(() => import('./pages/Associates'));
const CallIns       = lazy(() => import('./pages/CallIns'));
const CalendarPage  = lazy(() => import('./pages/CalendarPage'));
const Checklist     = lazy(() => import('./pages/Checklist'));
const Notes         = lazy(() => import('./pages/Notes'));
const Reviews       = lazy(() => import('./pages/Reviews'));
const Interviews    = lazy(() => import('./pages/Interviews'));
const Uniforms      = lazy(() => import('./pages/Uniforms'));
const Tasks         = lazy(() => import('./pages/Tasks'));
const Contacts      = lazy(() => import('./pages/Contacts'));
const Announcements = lazy(() => import('./pages/Announcements'));
const BackupManager = lazy(() => import('./pages/BackupManager'));
const DailyPlan     = lazy(() => import('./pages/DailyPlan'));
const Login         = lazy(() => import('./pages/Login'));
const AdminPage     = lazy(() => import('./pages/AdminPage'));
const Settings      = lazy(() => import('./pages/Settings'));

// ── Loading spinner ───────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}

// ── Global Error Boundary ─────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary]', error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-1">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Your data is safe. Tap below to reload the app.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
}

// ── Auto-connect Firestore whenever a real user is present ───────────────────
// Fires immediately on mount / when uid changes.
// Uses a single microtask tick (setTimeout 0) so React finishes rendering
// the initial frame before network calls start — keeps the UI snappy.
function AutoConnectFirestore() {
  const { user, dbReady, dbMode, connectFirestore } = useAppStore();

  useEffect(() => {
    const isRealUser = user && user.uid && user.uid !== 'demo_user';
    if (isRealUser && !(dbReady && dbMode === 'firestore')) {
      // Use setTimeout(0) — one tick so React flushes the first render,
      // then immediately start Firestore connection in the background.
      const t = setTimeout(() => {
        connectFirestore().catch((e) => {
          console.warn('[AutoConnect] Firestore connect failed:', e?.message);
        });
      }, 0);
      return () => clearTimeout(t);
    }
  }, [user?.uid]); // re-run only when uid actually changes

  return null;
}

// ── Automatic daily cloud snapshot ────────────────────────────────────────────
// Once a real user is signed in AND live Firestore sync is active, write one
// full-state snapshot per calendar day (guarded in localStorage). We wait a few
// seconds after connecting so Firestore listeners hydrate the store first —
// the snapshot then captures live cloud data, not the initial empty state.
function AutoCloudSnapshot() {
  const { user, dbReady, dbMode } = useAppStore();
  const connected = dbReady && dbMode === 'firestore';
  const isRealUser = user && user.uid && user.uid !== 'demo_user';

  useEffect(() => {
    if (!connected || !isRealUser) return;
    const t = setTimeout(async () => {
      try {
        const { maybeWriteDailySnapshot } = await import('./lib/firestoreSync');
        await maybeWriteDailySnapshot(useAppStore.getState(), {
          appVersion: '2.1.2',
          createdBy: { uid: user.uid, name: user.name || user.email || '' },
        });
      } catch (e) {
        console.warn('[AutoCloudSnapshot] failed:', e?.message);
      }
    }, 12000);
    return () => clearTimeout(t);
  }, [connected, isRealUser, user?.uid]);

  return null;
}

function AuthSessionGate({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const setUser = useAppStore(s => s.setUser);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    (async () => {
      try {
        const { auth } = await getFirebaseModules();
        const { onAuthStateChanged } = await import('firebase/auth');
        unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          if (!active) return;

          if (!authUser) {
            // Do not allow a previously persisted app profile to unlock private
            // pages when Firebase says nobody is signed in on this device.
            const currentUser = useAppStore.getState().user;
            if (currentUser?.uid !== 'demo_user') {
              setUser(null);
            }
            setAuthReady(true);
            return;
          }

          try {
            const currentUser = useAppStore.getState().user || {};
            const fallback = {
              uid: authUser.uid,
              email: authUser.email || '',
              name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
              role: currentUser.uid === authUser.uid ? currentUser.role : 'manager',
              storeId: 'store_1687',
            };
            const memberProfile = await loadOrCreateMemberProfile(authUser, fallback);
            if (!active) return;
            setUser(memberProfile);
          } catch (profileErr) {
            console.warn('[AuthSession] Profile load failed:', profileErr?.code || profileErr?.message);
            if (!active) return;
            setUser({
              uid: authUser.uid,
              email: authUser.email || '',
              name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
              role: authUser.email === 'bondw19@gmail.com' ? 'admin' : 'manager',
              storeId: 'store_1687',
            });
          } finally {
            if (active) setAuthReady(true);
          }
        });
      } catch (err) {
        console.warn('[AuthSession] Firebase auth listener failed:', err?.message);
        if (active) setAuthReady(true);
      }
    })();

    return () => {
      active = false;
      try { unsubscribe(); } catch {}
    };
  }, [setUser]);

  return children(authReady);
}

function ProtectedRoute({ authReady, children }) {
  const user = useAppStore(s => s.user);
  const location = useLocation();

  if (!authReady) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function RequireRole({ user, path, children }) {
  if (!canAccessPath(user, path)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-5">
            You don't have permission to view this page. Please contact your manager if you think this is a mistake.
          </p>
          <Link
            to={SHIFT_LEAD_FIRST_PATH}
            className="block w-full bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm text-center"
          >
            Go to Checklist
          </Link>
        </div>
      </div>
    );
  }
  return children;
}

function PrivatePage({ authReady, path, children }) {
  const user = useAppStore(s => s.user);
  return (
    <ProtectedRoute authReady={authReady}>
      <Layout>
        <RequireRole user={user} path={path}>
          {children}
        </RequireRole>
      </Layout>
    </ProtectedRoute>
  );
}

// ── Home route — shows shift lead dashboard or manager dashboard by role ──────
function HomeDashboard() {
  const user = useAppStore(s => s.user);
  return isShiftLeadUser(user) ? <ShiftLeadDashboard /> : <Dashboard />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthSessionGate>
          {(authReady) => (
            <>
              <AutoConnectFirestore />
              <AutoCloudSnapshot />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/login"         element={<Login />} />
                  <Route path="/"              element={<PrivatePage authReady={authReady} path="/"><HomeDashboard /></PrivatePage>} />
                  <Route path="/team"          element={<PrivatePage authReady={authReady} path="/team"><Associates /></PrivatePage>} />
                  <Route path="/callins"       element={<PrivatePage authReady={authReady} path="/callins"><CallIns /></PrivatePage>} />
                  <Route path="/calendar"      element={<PrivatePage authReady={authReady} path="/calendar"><CalendarPage /></PrivatePage>} />
                  <Route path="/checklist"     element={<PrivatePage authReady={authReady} path="/checklist"><Checklist /></PrivatePage>} />
                  <Route path="/daily-plan"    element={<PrivatePage authReady={authReady} path="/daily-plan"><DailyPlan /></PrivatePage>} />
                  <Route path="/notes"         element={<PrivatePage authReady={authReady} path="/notes"><Notes /></PrivatePage>} />
                  <Route path="/reviews"       element={<PrivatePage authReady={authReady} path="/reviews"><Reviews /></PrivatePage>} />
                  <Route path="/interviews"    element={<PrivatePage authReady={authReady} path="/interviews"><Interviews /></PrivatePage>} />
                  <Route path="/uniforms"      element={<PrivatePage authReady={authReady} path="/uniforms"><Uniforms /></PrivatePage>} />
                  <Route path="/tasks"         element={<PrivatePage authReady={authReady} path="/tasks"><Tasks /></PrivatePage>} />
                  <Route path="/contacts"      element={<PrivatePage authReady={authReady} path="/contacts"><Contacts /></PrivatePage>} />
                  <Route path="/announcements" element={<PrivatePage authReady={authReady} path="/announcements"><Announcements /></PrivatePage>} />
                  <Route path="/backup"        element={<PrivatePage authReady={authReady} path="/backup"><BackupManager /></PrivatePage>} />
                  <Route path="/admin"         element={<PrivatePage authReady={authReady} path="/admin"><AdminPage /></PrivatePage>} />
                  <Route path="/settings"      element={<PrivatePage authReady={authReady} path="/settings"><Settings /></PrivatePage>} />
                  <Route path="*"             element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </>
          )}
        </AuthSessionGate>
      </BrowserRouter>
      <PWAUpdatePrompt />
      <ToastHost />
      <ConfirmHost />
    </ErrorBoundary>
  );
}
