import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Store, BarChart2, Users, ClipboardList, AlertTriangle,
  Activity, ChevronDown, ChevronUp, Save, Trash2, RefreshCw,
  CheckCircle2, XCircle, Plus, X, Edit3, Database, Wifi,
  WifiOff, Lock, Eye, EyeOff, LogOut, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';

// ── Admin guard ───────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'bondw19@gmail.com';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStorageSize(key) {
  try {
    const raw = localStorage.getItem(key) || '';
    const bytes = new Blob([raw]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } catch { return 'N/A'; }
}

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';
  const Icon = type === 'success' ? CheckCircle2 : XCircle;
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 lg:bottom-6 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold ${bg}`}>
      <Icon size={18} /> {message}
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[340px] p-6 shadow-xl">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, color = 'text-gray-700', children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={color} />
          <span className="font-bold text-gray-800 text-sm">{title}</span>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-50">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Store Settings
// ─────────────────────────────────────────────────────────────────────────────
function StoreSettings({ onToast }) {
  const { storeName, storeId, setStoreId, user } = useAppStore();
  const [name, setName]   = useState(storeName);
  const [id, setId]       = useState(storeId);

  // Keep local state in sync if store updates externally
  useEffect(() => { setName(storeName); }, [storeName]);
  useEffect(() => { setId(storeId); }, [storeId]);

  const handleSave = () => {
    // Update store name via direct zustand set (use internal setter)
    useAppStore.setState({ storeName: name.trim() || storeName });
    setStoreId(id.trim() || storeId);
    onToast('Store settings saved!', 'success');
  };

  return (
    <div className="pt-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Store Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          placeholder="PANDA EXPRESS 1687"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Store ID</label>
        <input
          value={id}
          onChange={e => setId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono"
          placeholder="store_1687"
        />
        <p className="text-xs text-amber-600 mt-1.5">⚠️ Changing Store ID will disconnect Firestore. Change carefully.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Account</label>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
          <Shield size={14} className="text-green-600 shrink-0" />
          <span className="text-sm text-green-800 font-medium">{user?.email}</span>
          <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm"
      >
        <Save size={16} /> Save Store Settings
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Data Overview
// ─────────────────────────────────────────────────────────────────────────────
function DataOverview() {
  const {
    associates, callIns, teamEvents, myEvents,
    teamNotes, myNotes, reviews, tasks,
    contacts, announcements, workFiles,
  } = useAppStore();

  const stats = [
    { label: 'Associates',    count: associates?.length    || 0, color: 'bg-blue-50   text-blue-700   border-blue-100',   emoji: '👥' },
    { label: 'Call-Ins',      count: callIns?.length       || 0, color: 'bg-orange-50 text-orange-700 border-orange-100', emoji: '📵' },
    { label: 'Team Events',   count: teamEvents?.length    || 0, color: 'bg-purple-50 text-purple-700 border-purple-100', emoji: '📅' },
    { label: 'My Events',     count: myEvents?.length      || 0, color: 'bg-indigo-50 text-indigo-700 border-indigo-100', emoji: '🔒' },
    { label: 'Team Notes',    count: teamNotes?.length     || 0, color: 'bg-yellow-50 text-yellow-700 border-yellow-100', emoji: '📋' },
    { label: 'My Notes',      count: myNotes?.length       || 0, color: 'bg-pink-50   text-pink-700   border-pink-100',   emoji: '🔒' },
    { label: 'Reviews',       count: reviews?.length       || 0, color: 'bg-amber-50  text-amber-700  border-amber-100',  emoji: '⭐' },
    { label: 'Tasks',         count: tasks?.length         || 0, color: 'bg-teal-50   text-teal-700   border-teal-100',   emoji: '✅' },
    { label: 'Contacts',      count: contacts?.length      || 0, color: 'bg-cyan-50   text-cyan-700   border-cyan-100',   emoji: '📞' },
    { label: 'Announcements', count: announcements?.length || 0, color: 'bg-rose-50   text-rose-700   border-rose-100',   emoji: '📣' },
    { label: 'Work Files',    count: Object.keys(workFiles || {}).length, color: 'bg-gray-50 text-gray-700 border-gray-100', emoji: '📁' },
  ];

  const total = stats.reduce((s, i) => s + i.count, 0);

  return (
    <div className="pt-4 space-y-3">
      <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-bold text-primary">Total Records</span>
        <span className="text-2xl font-black text-primary">{total}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map(s => (
          <div key={s.label} className={`flex items-center justify-between border rounded-xl px-3 py-2.5 ${s.color}`}>
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <span>{s.emoji}</span>{s.label}
            </span>
            <span className="text-lg font-black">{s.count}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center pt-1">
        Storage used: {getStorageSize('panda-manager-storage')}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Signed-in Users (from Firestore users/ collection)
// ─────────────────────────────────────────────────────────────────────────────
function SignedInUsers({ onToast }) {
  const { dbReady, dbMode } = useAppStore();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { getFirebaseModules } = await import('../lib/firebase');
      const { db } = await getFirebaseModules();
      const { collection, getDocs } = await import('firebase/firestore');
      const snap = await getDocs(collection(db, 'users'));
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setUsers(list);
    } catch (e) {
      onToast('Failed to load users: ' + (e?.message || 'unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    if (dbReady && dbMode === 'firestore') loadUsers();
  }, [dbReady, dbMode, loadUsers]);

  if (!dbReady || dbMode !== 'firestore') {
    return (
      <div className="pt-4">
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-700">
          <WifiOff size={16} />
          <span>Connect cloud sync to view signed-in users.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{users.length} user{users.length !== 1 ? 's' : ''} found</span>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-primary font-semibold"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <RefreshCw size={20} className="animate-spin text-gray-400" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No users found in Firestore.</p>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.uid} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                {(u.displayName || u.email || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">{u.displayName || u.email || 'Unknown'}</div>
                <div className="text-xs text-gray-400 truncate">{u.email || u.uid}</div>
              </div>
              {u.email === ADMIN_EMAIL && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold shrink-0">ADMIN</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Checklist Templates
// ─────────────────────────────────────────────────────────────────────────────
function ChecklistTemplates({ onToast }) {
  const { checklistDefaults } = useAppStore();

  const SHIFT_LABELS = {
    opening: { label: 'Opening Checklist', emoji: '🌅', color: 'bg-yellow-50 border-yellow-200' },
    mid:     { label: 'Mid-Shift Checklist', emoji: '☀️',  color: 'bg-orange-50 border-orange-200' },
    closing: { label: 'Closing Checklist',  emoji: '🌙', color: 'bg-indigo-50 border-indigo-200' },
  };

  const [active, setActive]     = useState('opening');
  const [items, setItems]       = useState(() => [...(checklistDefaults?.opening || [])]);
  const [editIdx, setEditIdx]   = useState(null);
  const [editVal, setEditVal]   = useState('');
  const [newItem, setNewItem]   = useState('');

  // Load items when switching shift tab
  useEffect(() => {
    const src = checklistDefaults?.[active] || [];
    // Also check localStorage for admin-saved templates
    try {
      const saved = localStorage.getItem(`panda-checklist-template-${active}`);
      setItems(saved ? JSON.parse(saved) : [...src]);
    } catch {
      setItems([...src]);
    }
  }, [active, checklistDefaults]);

  const saveTemplate = () => {
    localStorage.setItem(`panda-checklist-template-${active}`, JSON.stringify(items));
    onToast(`${SHIFT_LABELS[active].label} template saved!`, 'success');
  };

  const resetTemplate = () => {
    const src = checklistDefaults?.[active] || [];
    setItems([...src]);
    localStorage.removeItem(`panda-checklist-template-${active}`);
    onToast('Template reset to default.', 'success');
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const deleteItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const startEdit = (idx) => { setEditIdx(idx); setEditVal(items[idx]); };
  const saveEdit  = () => {
    if (editVal.trim()) setItems(prev => prev.map((it, i) => i === editIdx ? editVal.trim() : it));
    setEditIdx(null); setEditVal('');
  };

  const meta = SHIFT_LABELS[active];

  return (
    <div className="pt-4 space-y-3">
      {/* Shift tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {Object.entries(SHIFT_LABELS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => { setActive(key); setEditIdx(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              active === key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            {val.emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className={`border rounded-xl p-3 space-y-1.5 max-h-72 overflow-y-auto ${meta.color}`}>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {editIdx === idx ? (
              <>
                <input
                  autoFocus
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-xs"
                />
                <button onClick={saveEdit} className="text-green-600 p-1"><CheckCircle2 size={14} /></button>
                <button onClick={() => setEditIdx(null)} className="text-gray-400 p-1"><X size={14} /></button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-500 w-5 shrink-0 pt-0.5">{idx + 1}.</span>
                <span className="flex-1 text-xs text-gray-700 leading-relaxed">{item}</span>
                <button onClick={() => startEdit(idx)} className="text-gray-400 hover:text-blue-600 p-1 shrink-0"><Edit3 size={13} /></button>
                <button onClick={() => deleteItem(idx)} className="text-gray-400 hover:text-red-600 p-1 shrink-0"><Trash2 size={13} /></button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new item */}
      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add new checklist item…"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs"
        />
        <button
          onClick={addItem}
          className="bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={resetTemplate}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-semibold"
        >
          <RefreshCw size={13} /> Reset Default
        </button>
        <button
          onClick={saveTemplate}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-xl text-xs font-bold"
        >
          <Save size={13} /> Save Template
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center">Templates are applied when creating new checklists for that shift.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: Danger Zone
// ─────────────────────────────────────────────────────────────────────────────
function DangerZone({ onToast }) {
  const store = useAppStore();
  const [confirm, setConfirm] = useState(null); // { key, label, action }

  const dangerActions = [
    {
      key: 'callIns',
      label: 'Clear All Call-Ins',
      description: 'Delete every call-in record.',
      action: () => useAppStore.setState({ callIns: [] }),
    },
    {
      key: 'teamNotes',
      label: 'Clear All Team Notes',
      description: 'Delete all shared team notes.',
      action: () => useAppStore.setState({ teamNotes: [] }),
    },
    {
      key: 'teamEvents',
      label: 'Clear All Team Events',
      description: 'Delete all shared calendar events.',
      action: () => useAppStore.setState({ teamEvents: [] }),
    },
    {
      key: 'reviews',
      label: 'Clear All Reviews',
      description: 'Delete all performance reviews.',
      action: () => useAppStore.setState({ reviews: [] }),
    },
    {
      key: 'tasks',
      label: 'Clear All Tasks',
      description: 'Delete all tasks and to-dos.',
      action: () => useAppStore.setState({ tasks: [] }),
    },
    {
      key: 'announcements',
      label: 'Clear All Announcements',
      description: 'Delete all announcements.',
      action: () => useAppStore.setState({ announcements: [] }),
    },
    {
      key: 'associates',
      label: 'Clear All Associates',
      description: '⚠️ This also removes all work files.',
      action: () => useAppStore.setState({ associates: [], workFiles: {} }),
      extra: true,
    },
  ];

  const executeConfirm = () => {
    if (!confirm) return;
    confirm.action();
    onToast(`${confirm.label} — done.`, 'success');
    setConfirm(null);
  };

  return (
    <div className="pt-4 space-y-2">
      <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-700 flex items-center gap-2 mb-3">
        <AlertTriangle size={13} className="shrink-0" />
        These actions delete data from the local store. If Firestore sync is active, Firestore data is NOT deleted — re-sync will restore it.
      </div>
      {dangerActions.map(action => (
        <div
          key={action.key}
          className={`flex items-center justify-between gap-3 border rounded-xl px-3 py-3 ${action.extra ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800">{action.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{action.description}</div>
          </div>
          <button
            onClick={() => setConfirm(action)}
            className="shrink-0 flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      ))}
      {confirm && (
        <ConfirmDialog
          title={confirm.label}
          message={`${confirm.description} This cannot be undone from the local store.`}
          confirmLabel="Yes, Delete"
          onConfirm={executeConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: App Health
// ─────────────────────────────────────────────────────────────────────────────
function AppHealth() {
  const { dbReady, dbMode, dbConnecting, connectFirestore, user } = useAppStore();
  const [connecting, setConnecting]   = useState(false);
  const [testStatus, setTestStatus]   = useState(null); // null | 'running' | 'pass' | 'fail'
  const [testDetail, setTestDetail]   = useState('');

  const handleConnect = async () => {
    setConnecting(true);
    try { await connectFirestore(); } finally { setConnecting(false); }
  };

  // Live write-then-read test for private Firestore collections
  const runLiveTest = async () => {
    setTestStatus('running');
    setTestDetail('');
    try {
      const { getFirebaseModules } = await import('../lib/firebase');
      const { db, auth } = await getFirebaseModules();
      const { doc, setDoc, getDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore');

      const uid = user?.uid;
      if (!uid || uid === 'demo_user') {
        setTestStatus('fail');
        setTestDetail('No real user signed in.');
        return;
      }

      // Check Firebase Auth state
      if (!auth.currentUser) {
        setTestStatus('fail');
        setTestDetail('Firebase Auth: not authenticated. Sign out and sign back in.');
        return;
      }

      const testId  = `_admin_test_${Date.now()}`;
      const testRef = doc(db, 'users', uid, 'myNotes', testId);

      // 1. Write test doc
      setTestDetail('Writing test document…');
      await setDoc(testRef, { _test: true, createdAt: serverTimestamp() });

      // 2. Read it back
      setTestDetail('Reading test document…');
      const snap = await getDoc(testRef);
      if (!snap.exists()) throw new Error('Document not found after write');

      // 3. Delete it (clean up)
      setTestDetail('Cleaning up…');
      await deleteDoc(testRef);

      setTestStatus('pass');
      setTestDetail(`✅ Write → Read → Delete all succeeded for users/${uid}/myNotes`);
    } catch (e) {
      setTestStatus('fail');
      const msg = e?.code || e?.message || 'Unknown error';
      if (msg.includes('permission-denied')) {
        setTestDetail('❌ PERMISSION DENIED — Firestore security rules are blocking writes. Deploy firestore.rules to Firebase Console.');
      } else if (msg.includes('unauthenticated')) {
        setTestDetail('❌ NOT AUTHENTICATED — Sign out and sign back in.');
      } else {
        setTestDetail(`❌ ${msg}`);
      }
    }
  };

  const storageKeys = [
    { key: 'panda-manager-storage', label: 'Primary Storage' },
    { key: 'panda-manager-backup',  label: 'Rolling Backup' },
  ];

  const migratedKey = user?.uid ? `panda-fs-migrated-v4-${user.uid}` : null;
  const migrated    = migratedKey ? !!localStorage.getItem(migratedKey) : false;

  return (
    <div className="pt-4 space-y-3">
      {/* Sync status */}
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
        dbReady && dbMode === 'firestore'
          ? 'bg-green-50 border-green-100'
          : 'bg-amber-50 border-amber-100'
      }`}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {dbReady && dbMode === 'firestore'
            ? <><Wifi size={16} className="text-green-600" /><span className="text-green-800">Cloud Sync Active</span></>
            : <><WifiOff size={16} className="text-amber-600" /><span className="text-amber-800">Local Mode</span></>
          }
        </div>
        {!(dbReady && dbMode === 'firestore') && (
          <button
            onClick={handleConnect}
            disabled={connecting || dbConnecting}
            className="flex items-center gap-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg font-bold disabled:opacity-50"
          >
            <RefreshCw size={11} className={(connecting || dbConnecting) ? 'animate-spin' : ''} />
            {(connecting || dbConnecting) ? 'Connecting…' : 'Connect'}
          </button>
        )}
      </div>

      {/* ── Live Firestore write test ───────────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Private Cloud Write Test</p>
        <div className="bg-gray-50 rounded-xl px-3 py-3 space-y-2">
          <p className="text-xs text-gray-500">
            Writes a test document to <code className="bg-gray-200 px-1 rounded text-[10px]">users/{'{uid}'}/myNotes</code>, reads it back, then deletes it.
            Confirms your private notes actually save to Firestore.
          </p>
          <button
            onClick={runLiveTest}
            disabled={testStatus === 'running'}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              testStatus === 'pass'  ? 'bg-green-100 text-green-800' :
              testStatus === 'fail'  ? 'bg-red-100   text-red-800'   :
              'bg-primary text-white hover:bg-red-700'
            }`}
          >
            <RefreshCw size={13} className={testStatus === 'running' ? 'animate-spin' : ''} />
            {testStatus === 'running' ? 'Testing…' :
             testStatus === 'pass'    ? '✅ Test Passed — run again' :
             testStatus === 'fail'    ? '❌ Test Failed — retry' :
             '▶ Run Live Write Test'}
          </button>
          {testDetail && (
            <div className={`text-xs rounded-lg px-2 py-2 leading-relaxed break-all ${
              testStatus === 'pass' ? 'bg-green-50 text-green-700' :
              testStatus === 'fail' ? 'bg-red-50   text-red-700'   :
              'bg-gray-100 text-gray-600'
            }`}>
              {testDetail}
            </div>
          )}
        </div>
      </div>

      {/* Storage sizes */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Local Storage</p>
        {storageKeys.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600 font-medium">{label}</span>
            </div>
            <span className="text-xs font-mono font-bold text-gray-700">{getStorageSize(key)}</span>
          </div>
        ))}
      </div>

      {/* Migration status */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className={migrated ? 'text-green-500' : 'text-gray-300'} />
          <span className="text-xs text-gray-600 font-medium">Firestore Migration</span>
        </div>
        <span className={`text-xs font-bold ${migrated ? 'text-green-600' : 'text-gray-400'}`}>
          {migrated ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Firestore rules reminder — only shown when test fails with PERMISSION DENIED */}
      {testStatus === 'fail' && testDetail.includes('PERMISSION DENIED') && (
      <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-3 text-xs text-red-800 space-y-2">
        <p className="font-bold text-sm">🚨 PERMISSION DENIED — Action Required</p>
        <p>Firestore security rules have <strong>not been deployed</strong> yet. Until you deploy them, private notes &amp; calendar cannot be read or written from the cloud.</p>

        <p className="font-semibold mt-1">Option 1 — Firebase Console (easiest, no install needed):</p>
        <ol className="list-decimal list-inside space-y-1 text-red-700">
          <li>Open <a href="https://console.firebase.google.com/project/px-1687-manager-app/firestore/rules" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console → Firestore → Rules</a></li>
          <li>Replace ALL the text with the rules below</li>
          <li>Click <strong>Publish</strong></li>
        </ol>
        <code className="block bg-red-100 rounded px-2 py-2 text-[9px] font-mono whitespace-pre leading-relaxed select-all">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stores/{storeId}/{collection}/{docId} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId}/{collection}/{docId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
        </code>

        <p className="font-semibold mt-1">Option 2 — Terminal (if Firebase CLI installed):</p>
        <code className="block bg-red-100 rounded px-2 py-1 text-[10px] font-mono break-all">
          firebase deploy --only firestore:rules
        </code>
        <p className="text-red-600 text-[10px]">Run from the project root folder where <strong>firestore.rules</strong> lives.</p>
      </div>
      )}

      {/* Env info */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">App Info</p>
        {[
          { label: 'App Version',      value: '2.1.0' },
          { label: 'Firebase Project', value: 'px-1687-manager-app' },
          { label: 'Store ID',         value: useAppStore.getState().storeId },
          { label: 'User UID',         value: user?.uid ? user.uid.slice(0, 18) + '…' : '—' },
          { label: 'Auth State',       value: 'Email/Password' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-mono font-bold text-gray-700 truncate max-w-[160px]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user } = useAppStore();
  const navigate  = useNavigate();
  const [toast, setToast] = useState(null);

  const onToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Access guard — only bondw19@gmail.com
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-red-500" />
          </div>
          <h2 className="font-black text-gray-800 text-xl mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-6">This page is restricted to the app administrator.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Admin Panel" />
      <DesktopPageHeader title="Admin Panel" />

      <div className="p-4 max-w-2xl mx-auto space-y-3 pb-10">

        {/* Admin badge banner */}
        <div className="flex items-center gap-3 bg-primary text-white rounded-2xl px-5 py-4 shadow-md">
          <Shield size={28} className="shrink-0" />
          <div>
            <div className="font-black text-base">Admin Control Panel</div>
            <div className="text-xs opacity-80 mt-0.5">{user.email} · PANDA EXPRESS 1687</div>
          </div>
        </div>

        {/* Section 1: Store Settings */}
        <Section icon={Store} title="Store Settings" color="text-primary" defaultOpen>
          <StoreSettings onToast={onToast} />
        </Section>

        {/* Section 2: Data Overview */}
        <Section icon={BarChart2} title="Data Overview" color="text-blue-600" defaultOpen>
          <DataOverview />
        </Section>

        {/* Section 3: Signed-in Users */}
        <Section icon={Users} title="Signed-in Users" color="text-purple-600" defaultOpen={false}>
          <SignedInUsers onToast={onToast} />
        </Section>

        {/* Section 4: Checklist Templates */}
        <Section icon={ClipboardList} title="Checklist Templates" color="text-amber-600" defaultOpen={false}>
          <ChecklistTemplates onToast={onToast} />
        </Section>

        {/* Section 5: App Health */}
        <Section icon={Activity} title="App Health & Diagnostics" color="text-green-600" defaultOpen={false}>
          <AppHealth />
        </Section>

        {/* Section 6: Danger Zone */}
        <Section icon={AlertTriangle} title="Danger Zone" color="text-red-600" defaultOpen={false}>
          <DangerZone onToast={onToast} />
        </Section>

      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}
