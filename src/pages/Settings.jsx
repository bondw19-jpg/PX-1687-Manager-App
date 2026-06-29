import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Store, Info, LogOut, ChevronRight,
  Check, X, Eye, EyeOff, Pencil, Shield, Wifi, WifiOff,
  RefreshCw, AlertTriangle, Trash2
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { getRoleShortLabel, isAdminUser } from '../lib/roles';
import { confirmDialog } from '../lib/uiDialog';
const APP_VERSION = '2.1.0';

// ── Inline section card ──────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ label }) {
  return (
    <p className="text-xs font-bold text-gray-400 tracking-widest uppercase px-1 mb-2 mt-5">
      {label}
    </p>
  );
}

function Row({ icon: Icon, iconColor = 'text-gray-400', label, value, onClick, danger, last }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors
        ${danger ? 'hover:bg-red-50 active:bg-red-100' : 'hover:bg-gray-50 active:bg-gray-100'}
        ${!last ? 'border-b border-gray-100' : ''}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
        ${danger ? 'bg-red-50' : 'bg-gray-50'}`}>
        <Icon size={16} className={danger ? 'text-red-500' : iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-red-600' : 'text-gray-800'}`}>{label}</p>
        {value && <p className="text-xs text-gray-400 truncate mt-0.5">{value}</p>}
      </div>
      <ChevronRight size={15} className={danger ? 'text-red-300' : 'text-gray-300'} />
    </button>
  );
}

// ── Edit display name modal ──────────────────────────────────────────────────
function EditNameModal({ currentName, onSave, onClose }) {
  const [val, setVal] = useState(currentName || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = val.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const { getFirebaseModules } = await import('../lib/firebase');
      const { auth } = await getFirebaseModules();
      const { updateProfile } = await import('firebase/auth');
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      }
      onSave(trimmed);
    } catch (e) {
      // If Firebase update fails, still update locally
      onSave(trimmed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-800">Edit Display Name</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Full Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Your full name"
              value={val}
              onChange={e => setVal(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1.5">Only the first name is shown on shared records.</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !val.trim()}
              className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Name'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Change password modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [current, setCurrent]   = useState('');
  const [next, setNext]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showCur, setShowCur]   = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSave = async () => {
    setError('');
    if (!current || !next || !confirm) { setError('Please fill in all fields.'); return; }
    if (next.length < 6)               { setError('New password must be at least 6 characters.'); return; }
    if (next !== confirm)              { setError('New passwords do not match.'); return; }

    setSaving(true);
    try {
      const { getFirebaseModules } = await import('../lib/firebase');
      const { auth } = await getFirebaseModules();
      const {
        EmailAuthProvider,
        reauthenticateWithCredential,
        updatePassword,
      } = await import('firebase/auth');

      const credential = EmailAuthProvider.credential(auth.currentUser.email, current);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, next);
      setSuccess(true);
    } catch (e) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else {
        setError(e.message || 'Failed to update password.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-800">Change Password</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body p-5 space-y-3">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={28} className="text-green-600" />
              </div>
              <p className="font-semibold text-gray-800">Password Updated!</p>
              <p className="text-sm text-gray-500">Your password has been changed successfully.</p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Current password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showCur ? 'text' : 'password'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm pr-11 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="••••••••"
                    value={current}
                    onChange={e => setCurrent(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCur(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCur ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {/* New password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm pr-11 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Min. 6 characters"
                    value={next}
                    onChange={e => setNext(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {/* Confirm */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit store name modal (admin only) ───────────────────────────────────────
function EditStoreNameModal({ currentName, onSave, onClose }) {
  const [val, setVal] = useState(currentName || '');
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-800">Edit Store Name</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Store Name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="e.g. PANDA EXPRESS 1687"
              value={val}
              onChange={e => setVal(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">Cancel</button>
            <button
              onClick={() => val.trim() && onSave(val.trim())}
              disabled={!val.trim()}
              className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings page ───────────────────────────────────────────────────────
export default function Settings() {
  const navigate = useNavigate();
  const { user, setUser, storeName, setStoreName, dbMode, dbReady, dbConnecting } = useAppStore();

  const isAdmin  = isAdminUser(user);
  const roleLabel = user?.roleLabel || getRoleShortLabel(user?.role, user?.email);
  const isReal   = user && user.uid && user.uid !== 'demo_user';
  const initial  = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  const [modal, setModal] = useState(null); // 'name' | 'password' | 'storeName'
  const [toast, setToast] = useState('');
  const [clearingPrivate, setClearingPrivate] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSaveName = (newName) => {
    setUser({ ...user, name: newName });
    setModal(null);
    showToast('Display name updated ✓');
  };

  const handleSaveStoreName = (name) => {
    setStoreName(name);
    setModal(null);
    showToast('Store name updated ✓');
  };

  const handleClearPrivateData = async () => {
    if (!user?.uid || user.uid === 'demo_user') return;
    const ok = await confirmDialog({
      title: 'This will permanently delete ALL of your private notes and calendar events from the cloud — including any that may have been accidentally imported from another account.',
      message: 'This cannot be undone. Continue?',
      confirmText: 'Clear',
      danger: true,
    });
    if (!ok) return;
    setClearingPrivate(true);
    try {
      const { clearAllPrivateData } = await import('../lib/firestoreSync');
      const deleted = await clearAllPrivateData(user.uid);
      useAppStore.setState({ myNotes: [], myEvents: [] });
      showToast(`✓ Cleared ${deleted} private item${deleted !== 1 ? 's' : ''} from cloud`);
    } catch (e) {
      showToast('Failed to clear — try again');
      console.warn('[Settings] clearPrivateData error:', e?.message);
    } finally {
      setClearingPrivate(false);
    }
  };

  const handleSignOut = async () => {
    const ok = await confirmDialog({ title: 'Sign out of Panda Manager Hub?', confirmText: 'Sign Out', danger: false });
    if (!ok) return;
    try {
      const { getFirebaseModules, resetAuthReadyPromise } = await import('../lib/firebase');
      const { auth } = await getFirebaseModules();
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      resetAuthReadyPromise?.();
    } catch {}
    setUser(null);
    navigate('/login');
  };

  // Sync status label
  const syncLabel = dbReady
    ? `☁️ Synced — ${dbMode}`
    : dbConnecting
      ? '⏳ Connecting…'
      : '📴 Local only';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" />
      <DesktopPageHeader title="Settings" subtitle="Account, store & app preferences" />

      <div className="desktop-page-content p-4 lg:p-0 pb-24 max-w-lg lg:max-w-2xl mx-auto">

        {/* Profile card */}
        <div className="bg-primary rounded-2xl p-5 flex items-center gap-4 shadow-md mt-2">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base truncate">{user?.name || '—'}</p>
            <p className="text-white/70 text-xs truncate">{user?.email || ''}</p>
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full
              ${isAdmin ? 'bg-amber-300 text-amber-900' : 'bg-white/20 text-white'}`}>
              {roleLabel}
            </span>
          </div>
        </div>

        {/* ACCOUNT */}
        <SectionTitle label="Account" />
        <Card>
          <Row
            icon={Pencil}
            iconColor="text-primary"
            label="Display Name"
            value={user?.name || 'Not set'}
            onClick={() => setModal('name')}
          />
          {isReal && (
            <Row
              icon={Lock}
              iconColor="text-primary"
              label="Change Password"
              value="Update your login password"
              onClick={() => setModal('password')}
              last
            />
          )}
        </Card>

        {/* STORE — admin only */}
        {isAdmin && (
          <>
            <SectionTitle label="Store" />
            <Card>
              <Row
                icon={Store}
                iconColor="text-primary"
                label="Store Name"
                value={storeName}
                onClick={() => setModal('storeName')}
                last
              />
            </Card>
          </>
        )}

        {/* APP INFO */}
        <SectionTitle label="App Info" />
        <Card>
          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Info size={16} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">App Version</p>
              <p className="text-xs text-gray-400">v{APP_VERSION}</p>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              {dbReady ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-gray-400" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Cloud Sync</p>
              <p className="text-xs text-gray-400">{syncLabel}</p>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Store size={16} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Store</p>
              <p className="text-xs text-gray-400">{storeName}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Role</p>
                <p className="text-xs text-amber-600 font-semibold">Administrator</p>
              </div>
            </div>
          )}
          <Row
            icon={RefreshCw}
            iconColor="text-gray-400"
            label="Backup & Restore"
            value="Export or import your data"
            onClick={() => navigate('/backup')}
            last
          />
        </Card>

        {/* DANGER ZONE */}
        <SectionTitle label="Account Actions" />
        <Card>
          {isReal && (
            <Row
              icon={clearingPrivate ? RefreshCw : Trash2}
              label={clearingPrivate ? 'Clearing…' : 'Reset Private Notes & Calendar'}
              value="Remove all My Notes & My Calendar events from cloud"
              onClick={clearingPrivate ? undefined : handleClearPrivateData}
              danger
            />
          )}
          <Row
            icon={LogOut}
            label="Sign Out"
            onClick={handleSignOut}
            danger
            last
          />
        </Card>

        <p className="text-center text-xs text-gray-300 mt-8 mb-4">
          Panda Manager Hub v{APP_VERSION} · PX {storeName.replace(/\D/g, '')}
        </p>
      </div>

      {/* Modals */}
      {modal === 'name'      && <EditNameModal      currentName={user?.name}  onSave={handleSaveName}      onClose={() => setModal(null)} />}
      {modal === 'password'  && <ChangePasswordModal                           onClose={() => setModal(null)} />}
      {modal === 'storeName' && <EditStoreNameModal  currentName={storeName}   onSave={handleSaveStoreName} onClose={() => setModal(null)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
