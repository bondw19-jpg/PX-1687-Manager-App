import React, { Suspense, lazy, Component, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Associates    = lazy(() => import('./pages/Associates'));
const CallIns       = lazy(() => import('./pages/CallIns'));
const CalendarPage  = lazy(() => import('./pages/CalendarPage'));
const Checklist     = lazy(() => import('./pages/Checklist'));
const Notes         = lazy(() => import('./pages/Notes'));
const Reviews       = lazy(() => import('./pages/Reviews'));
const Tasks         = lazy(() => import('./pages/Tasks'));
const Contacts      = lazy(() => import('./pages/Contacts'));
const Announcements = lazy(() => import('./pages/Announcements'));
const BackupManager = lazy(() => import('./pages/BackupManager'));
const Login         = lazy(() => import('./pages/Login'));

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

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AutoConnectFirestore />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login"         element={<Login />} />
            <Route path="/"              element={<Layout><Dashboard /></Layout>} />
            <Route path="/team"          element={<Layout><Associates /></Layout>} />
            <Route path="/callins"       element={<Layout><CallIns /></Layout>} />
            <Route path="/calendar"      element={<Layout><CalendarPage /></Layout>} />
            <Route path="/checklist"     element={<Layout><Checklist /></Layout>} />
            <Route path="/notes"         element={<Layout><Notes /></Layout>} />
            <Route path="/reviews"       element={<Layout><Reviews /></Layout>} />
            <Route path="/tasks"         element={<Layout><Tasks /></Layout>} />
            <Route path="/contacts"      element={<Layout><Contacts /></Layout>} />
            <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
            <Route path="/backup"        element={<Layout><BackupManager /></Layout>} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
