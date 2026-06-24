import React, { useState, useRef, useEffect } from 'react';
import {
  Download, Upload, RotateCcw, Trash2, CheckCircle2, AlertCircle,
  Clock, Database, Shield, ChevronDown, ChevronUp, X, HardDrive,
  FileArchive, RefreshCw, Info, Cloud, CloudOff, Wifi, WifiOff, Zap, LogIn
} from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';

const APP_VERSION  = '2.1.2';
const STORAGE_KEY  = 'panda-manager-storage';
const BACKUPS_KEY  = 'panda-manager-backups';
const EMERGENCY_KEY = 'panda-manager-backup'; // auto-written by appStore on every save

// ── helpers ──────────────────────────────────────────────────────────────────
function getStorageSize(key) {
  try {
    const raw = localStorage.getItem(key) || '';
    const bytes = new Blob([raw]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } catch { return 'N/A'; }
}

function loadBackupList() {
  try { return JSON.parse(localStorage.getItem(BACKUPS_KEY) || '[]'); }
  catch { return []; }
}

function saveBackupList(list) {
  localStorage.setItem(BACKUPS_KEY, JSON.stringify(list));
}

function getAppData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function sanitizeRestoredAppData(data) {
  const state = data?.state ?? data ?? {};
  const sanitizedState = {
    ...state,
    // Legacy backups may contain My Notes/My Calendar from a previous account.
    // Personal data now lives only in each user's Firestore path, so restore/import
    // must never copy these arrays into shared local storage or another UID.
    myNotes: [],
    myEvents: [],
  };

  return data?.state ? { ...data, state: sanitizedState } : sanitizedState;
}

function countRecords(data) {
  const s = data?.state || data || {};
  return {
    associates:    s.associates?.length    || 0,
    callIns:       s.callIns?.length       || 0,
    teamNotes:     s.teamNotes?.length     || 0,
        myNotes:       0,
    tasks:         s.tasks?.length         || 0,
    uniforms:      s.uniforms?.length      || 0,
    uniformInventory: s.uniformInventory?.length || 0,
    managerUniformStock: s.managerUniformStock?.length || 0,
    associateUniformItems: s.associateUniformItems?.length || 0,
    reviews:       s.reviews?.length       || 0,
    teamEvents:    s.teamEvents?.length    || 0,
    announcements: s.announcements?.length || 0,
    contacts:      s.contacts?.length      || 0,
  };
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 lg:bottom-6 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold animate-slide-up ${
      type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800'
    }`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" style={{alignItems:'center'}}>
      <div className="bg-white rounded-2xl w-full max-w-[360px] mx-4 p-6 shadow-xl animate-fade-scale-in" style={{height:'auto',maxHeight:'90vh',display:'block'}}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
          {danger ? <AlertCircle size={24} className="text-red-600" /> : <Info size={24} className="text-blue-600" />}
        </div>
        <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Backup Card ───────────────────────────────────────────────────────────────
function BackupCard({ backup, onRestore, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const counts = countRecords(backup.data);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileArchive size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-gray-800 truncate">{backup.label}</p>
                {backup.auto && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">auto</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock size={10} />
                {format(new Date(backup.createdAt), 'MMM d, yyyy · h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Summary counts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { label: 'Associates', val: counts.associates },
            { label: 'Call-Ins',   val: counts.callIns },
            { label: 'Notes',      val: counts.teamNotes + counts.myNotes },
            { label: 'Tasks',      val: counts.tasks },
            { label: 'Uniforms',   val: counts.uniforms },
            { label: 'Uniform Inv.', val: counts.uniformInventory },
            { label: 'Mgr Stock',  val: counts.managerUniformStock },
            { label: 'Assoc. Items', val: counts.associateUniformItems },
            { label: 'Reviews',    val: counts.reviews },
          ].map(({ label, val }) => (
            <span key={label} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-1 rounded-lg">
              {val} {label}
            </span>
          ))}
          <span className="text-xs bg-gray-50 border border-gray-100 text-gray-400 px-2 py-1 rounded-lg">
            {backup.size}
          </span>
        </div>
      </div>

      {/* Expanded version info */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-50 pt-3 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
            <div><span className="font-medium">Version:</span> {backup.appVersion || 'N/A'}</div>
            <div><span className="font-medium">Events:</span> {counts.teamEvents}</div>
            <div><span className="font-medium">Contacts:</span> {counts.contacts}</div>
            <div><span className="font-medium">Announcements:</span> {counts.announcements}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={() => onRestore(backup)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-primary hover:bg-red-50 transition-colors"
        >
          <RotateCcw size={14} /> Restore
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => onDelete(backup.id)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Firebase Sync Card ───────────────────────────────────────────────────────
function FirebaseSyncCard({ dbReady, dbMode, user, onConnect, onSignIn, connecting }) {
  const isCloud = dbReady && dbMode === 'firestore';
  const hasAccount = user && user.uid && user.uid !== 'demo_user';
  // Auto-connecting = signed-in real user but not yet live (startup connecting in background)
  const isAutoConnecting = hasAccount && !isCloud && !connecting;

  return (
    <div className={`rounded-xl shadow-sm p-4 border ${
      isCloud ? 'bg-green-50 border-green-200'
      : isAutoConnecting ? 'bg-blue-50 border-blue-200'
      : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isCloud ? 'bg-green-100'
          : isAutoConnecting ? 'bg-blue-100'
          : 'bg-gray-100'
        }`}>
          {isCloud
            ? <Cloud size={20} className="text-green-600" />
            : isAutoConnecting
              ? <RefreshCw size={20} className="text-blue-500 animate-spin" />
              : <CloudOff size={20} className="text-gray-400" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-800 text-sm">Cloud Sync</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              isCloud ? 'bg-green-100 text-green-700'
              : isAutoConnecting ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500'
            }`}>
              {isCloud ? '● Live' : isAutoConnecting ? '◌ Connecting…' : '○ Local Only'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCloud
              ? `Syncing to Firebase · ${user?.email || ''}`
              : isAutoConnecting
                ? `Connecting as ${user?.email || user?.name || ''}…`
                : 'Data stored on this device only'}
          </p>
        </div>
      </div>

      {isCloud ? (
        <div className="bg-green-100 rounded-xl p-3 flex items-center gap-2 text-xs text-green-800">
          <CheckCircle2 size={14} className="flex-shrink-0" />
          <span><strong>Connected!</strong> All data syncs in real-time across devices. Team members can access the app by signing in at the same URL.</span>
        </div>
      ) : isAutoConnecting ? (
        <div className="bg-blue-100 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-800">
          <RefreshCw size={14} className="flex-shrink-0 animate-spin" />
          <span><strong>Auto-connecting to cloud…</strong> This happens automatically every time you open the app.</span>
        </div>
      ) : connecting ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-700">
          <RefreshCw size={14} className="flex-shrink-0 animate-spin" />
          <span>Connecting to Firebase…</span>
        </div>
      ) : !hasAccount ? (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            <strong>Sign in to enable cloud sync.</strong> Create an account or sign in with your Firebase credentials to sync data across all team devices.
          </div>
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <LogIn size={16} /> Sign In / Create Account
          </button>
        </div>
      ) : (
        // Fallback: signed in but auto-connect failed — show manual button
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            <strong>Auto-connect failed.</strong> Tap below to retry connecting to Firebase.
          </div>
          <button
            onClick={onConnect}
            disabled={connecting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <><Zap size={16} /> Retry Cloud Sync</>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BackupManager() {
  const store = useAppStore();
  const { dbReady, dbMode, user, connectFirestore } = useAppStore();
  const fileInputRef = useRef(null);

  const [backups, setBackups]       = useState(loadBackupList);
  const [toast, setToast]           = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [creating, setCreating]     = useState(false);
  const [restoring, setRestoring]   = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false); // true while pushing to Firestore after import/restore
  const [syncProgress, setSyncProgress] = useState('');    // progress message shown to user

  // ── Cloud snapshots (automatic daily + manual point-in-time backups) ──────
  const [cloudSnaps, setCloudSnaps]     = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudBusy, setCloudBusy]       = useState(false); // true while creating a manual snapshot

  const isCloudConnected = dbReady && dbMode === 'firestore';

  const loadCloudSnapshots = async () => {
    if (!isCloudConnected) return;
    setLoadingCloud(true);
    try {
      const { listCloudSnapshots } = await import('../lib/firestoreSync');
      setCloudSnaps(await listCloudSnapshots());
    } catch {
      // Non-fatal — the section simply shows empty. Local backups still work.
    } finally {
      setLoadingCloud(false);
    }
  };

  useEffect(() => {
    if (isCloudConnected) loadCloudSnapshots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCloudConnected]);

  // Create a manual cloud snapshot of the current data right now.
  const handleCloudBackupNow = async () => {
    if (!isCloudConnected || cloudBusy) return;
    setCloudBusy(true);
    try {
      const { writeCloudSnapshot } = await import('../lib/firestoreSync');
      await writeCloudSnapshot(useAppStore.getState(), {
        auto: false,
        appVersion: APP_VERSION,
        createdBy: user ? { uid: user.uid, name: user.name || user.email || '' } : null,
      });
      showToast('Cloud snapshot saved!');
      await loadCloudSnapshots();
    } catch {
      showToast('Cloud snapshot failed.', 'error');
    } finally {
      setCloudBusy(false);
    }
  };

  // Restore a cloud snapshot — auto-saves current data locally first, then
  // writes the snapshot to local storage and force-syncs it to Firestore.
  const handleRestoreCloudSnapshot = (snap) => {
    setConfirm({
      title:        'Restore this cloud snapshot?',
      message:      `Restores all ${snap.recordTotal || 0} records from ${format(new Date(snap.createdAt), 'MMM d, yyyy h:mm a')} back into your data. Records are merged in — matching items are overwritten with the snapshot version and nothing is deleted. Your current data is auto-saved first.`,
      confirmLabel: 'Restore Now',
      danger:       true,
      onConfirm: async () => {
        setConfirm(null);
        setRestoring(true);
        try {
          const { getCloudSnapshot } = await import('../lib/firestoreSync');
          const full = await getCloudSnapshot(snap.id);
          if (!full?.data) throw new Error('snapshot-not-found');
          createAutoBackup(); // local safety copy before overwriting
          const existing = getAppData();
          const version  = existing?.version ?? 6;
          const appData  = sanitizeRestoredAppData({ state: full.data, version });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
          await pushToCloudAndReload(appData, 'Snapshot restored!');
        } catch {
          showToast('Restore failed.', 'error');
          setRestoring(false);
        }
      },
      onCancel: () => setConfirm(null),
    });
  };

  // ── Helper: push imported/restored data to Firestore then reload ──────────
  const pushToCloudAndReload = async (data, successMsg) => {
    const uid = user?.uid;
    const isRealUser = uid && uid !== 'demo_user';
    const isConnected = dbReady && dbMode === 'firestore';

    if (isRealUser && isConnected) {
      // Push imported data to Firestore (overwrite — this is an intentional import)
      setSyncingCloud(true);
      setSyncProgress('Uploading to cloud…');
      try {
        const { batchForceToFirestore } = await import('../lib/firestoreSync');
        const sanitizedData = sanitizeRestoredAppData(data);
        const state = sanitizedData?.state ?? sanitizedData;
        const count = await batchForceToFirestore(state, uid);
        setSyncProgress(`Synced ${count} records to cloud ✅`);
        showToast(`${successMsg} Synced ${count} records to cloud.`);
        // Clear migration key so on next load Firestore data re-populates cleanly
        if (uid) localStorage.removeItem(`panda-fs-migrated-v4-${uid}`);
        await new Promise(r => setTimeout(r, 1500));
      } catch (e) {
        setSyncProgress('Cloud sync failed — data saved locally.');
        showToast(`${successMsg} (cloud sync failed — data saved locally)`, 'error');
        await new Promise(r => setTimeout(r, 1500));
      } finally {
        setSyncingCloud(false);
      }
    } else {
      // No cloud connection — just reload. Clear migration key so it re-migrates.
      if (uid) localStorage.removeItem(`panda-fs-migrated-v4-${uid}`);
      showToast(successMsg + (isRealUser ? ' Connect cloud sync to back up to Firestore.' : ''));
      await new Promise(r => setTimeout(r, 1500));
    }
    window.location.reload();
  };

  // ── Emergency recovery from auto-backup ──────────────────────────────────
  const emergencyData = (() => {
    try {
      const raw = localStorage.getItem(EMERGENCY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const counts = countRecords(parsed);
      const total  = Object.values(counts).reduce((s, v) => s + v, 0);
      return total > 0 ? { parsed, counts, total } : null;
    } catch { return null; }
  })();

  const handleEmergencyRecover = () => {
    if (!emergencyData) return;
    setConfirm({
      title:        'Recover lost data?',
      message:      `An emergency backup with ${emergencyData.total} records was found. This will restore it immediately. Current data will be replaced.`,
      confirmLabel: 'Recover Now',
      danger:       false,
      onConfirm: () => {
        setConfirm(null);
        setRestoring(true);
        setTimeout(() => {
          try {
            const str = localStorage.getItem(EMERGENCY_KEY);
            const parsed = JSON.parse(str || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeRestoredAppData(parsed)));
            showToast('Data recovered! Reloading…');
            setTimeout(() => window.location.reload(), 1500);
          } catch {
            showToast('Recovery failed.', 'error');
            setRestoring(false);
          }
        }, 300);
      },
      onCancel: () => setConfirm(null),
    });
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── Connect to Firebase Firestore ─────────────────────────────────────────
  const handleConnectFirestore = async () => {
    setConnecting(true);
    try {
      await connectFirestore();
      showToast('✅ Cloud sync connected!');
    } catch (e) {
      showToast('Connection failed. Check Firebase setup.', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  // ── Create manual backup ──────────────────────────────────────────────────
  const handleCreateBackup = () => {
    setCreating(true);
    setTimeout(() => {
      try {
        const raw  = localStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(raw || '{}');
        const backup = {
          id:         `backup_${Date.now()}`,
          label:      `Manual Backup — ${format(new Date(), 'MMM d, yyyy h:mm a')}`,
          createdAt:  new Date().toISOString(),
          appVersion: APP_VERSION,
          auto:       false,
          size:       getStorageSize(STORAGE_KEY),
          data,
        };
        const updated = [backup, ...backups].slice(0, 20); // keep max 20
        setBackups(updated);
        saveBackupList(updated);
        showToast('Backup created successfully!');
      } catch {
        showToast('Failed to create backup.', 'error');
      } finally {
        setCreating(false);
      }
    }, 300);
  };

  // ── Auto-backup (called internally before restore) ────────────────────────
  const createAutoBackup = () => {
    try {
      const raw  = localStorage.getItem(STORAGE_KEY);
      const data = JSON.parse(raw || '{}');
      const backup = {
        id:         `backup_auto_${Date.now()}`,
        label:      `Auto Backup — Before Restore ${format(new Date(), 'MMM d h:mm a')}`,
        createdAt:  new Date().toISOString(),
        appVersion: APP_VERSION,
        auto:       true,
        size:       getStorageSize(STORAGE_KEY),
        data,
      };
      const updated = [backup, ...backups].slice(0, 20);
      setBackups(updated);
      saveBackupList(updated);
      return backup;
    } catch { return null; }
  };

  // ── Restore a backup ──────────────────────────────────────────────────────
  const handleRestore = (backup) => {
    setConfirm({
      title:        'Restore this backup?',
      message:      `This will replace ALL current data with the backup from ${format(new Date(backup.createdAt), 'MMM d, yyyy h:mm a')}. Your current data will be auto-saved first.`,
      confirmLabel: 'Restore Now',
      danger:       true,
      onConfirm: async () => {
        setConfirm(null);
        setRestoring(true);
        try {
          createAutoBackup();
          const data = sanitizeRestoredAppData(backup.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          await pushToCloudAndReload(data, 'Restored!');
        } catch {
          showToast('Restore failed.', 'error');
          setRestoring(false);
        }
      },
      onCancel: () => setConfirm(null),
    });
  };

  // ── Delete a backup ───────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setConfirm({
      title:        'Delete this backup?',
      message:      'This cannot be undone. The backup will be permanently removed.',
      confirmLabel: 'Delete',
      danger:       true,
      onConfirm: () => {
        setConfirm(null);
        const updated = backups.filter(b => b.id !== id);
        setBackups(updated);
        saveBackupList(updated);
        showToast('Backup deleted.');
      },
      onCancel: () => setConfirm(null),
    });
  };

  // ── Export to file ────────────────────────────────────────────────────────
  const handleExport = () => {
    try {
      const raw  = localStorage.getItem(STORAGE_KEY);
      const data = JSON.parse(raw || '{}');
      const exportObj = {
        exportedAt:  new Date().toISOString(),
        appVersion:  APP_VERSION,
        storeName:   data?.state?.storeName || 'PANDA EXPRESS',
        data,
      };
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `panda-manager-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported to file!');
    } catch {
      showToast('Export failed.', 'error');
    }
  };

  // ── Import from file ──────────────────────────────────────────────────────
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const appData = parsed.data || parsed;
        const state   = appData?.state ?? appData;
        const counts  = countRecords(appData);
        const total   = Object.values(counts).reduce((s, v) => s + v, 0);
        setConfirm({
          title:        'Import this backup file?',
          message:      `Exported: ${parsed.exportedAt ? format(new Date(parsed.exportedAt), 'MMM d, yyyy h:mm a') : 'Unknown date'}. Store: ${parsed.storeName || '?'}. Contains ${total} records. This will replace all current data and sync to cloud.`,
          confirmLabel: 'Import & Sync to Cloud',
          danger:       true,
          onConfirm: async () => {
            setConfirm(null);
            setRestoring(true);
            createAutoBackup();
            const sanitizedData = sanitizeRestoredAppData(appData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedData));
            await pushToCloudAndReload(sanitizedData, 'Imported!');
          },
          onCancel: () => setConfirm(null),
        });
      } catch {
        showToast('Invalid backup file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Clear all backups ─────────────────────────────────────────────────────
  const handleClearAll = () => {
    setConfirm({
      title:        'Delete all backups?',
      message:      'All saved backups will be permanently removed. Your current app data is not affected.',
      confirmLabel: 'Delete All',
      danger:       true,
      onConfirm: () => {
        setConfirm(null);
        setBackups([]);
        saveBackupList([]);
        showToast('All backups cleared.');
      },
      onCancel: () => setConfirm(null),
    });
  };

  const currentCounts = countRecords(getAppData());
  const storageSize   = getStorageSize(STORAGE_KEY);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Backup & Restore" />
      <DesktopPageHeader title="Backup & Restore" />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4 max-w-2xl lg:max-w-3xl mx-auto">

        {/* Firebase Sync Card */}
        <FirebaseSyncCard
          dbReady={dbReady}
          dbMode={dbMode}
          user={user}
          onConnect={handleConnectFirestore}
          onSignIn={handleSignIn}
          connecting={connecting}
        />

        {/* Current Data Card */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Current App Data</h2>
              <p className="text-xs text-gray-400">Stored locally · {storageSize}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Associates',  val: currentCounts.associates  },
              { label: 'Call-Ins',    val: currentCounts.callIns     },
              { label: 'Team Notes',  val: currentCounts.teamNotes   },
              { label: 'My Notes',    val: currentCounts.myNotes     },
              { label: 'Tasks',       val: currentCounts.tasks       },
              { label: 'Reviews',     val: currentCounts.reviews     },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-gray-800">{val}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Emergency Recovery Banner ──────────────────────────────── */}
        {emergencyData && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle size={18} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-amber-800 text-sm">Emergency Backup Found!</p>
              <p className="text-xs text-amber-700 mt-0.5">
                The app found an auto-saved emergency backup with{' '}
                <strong>{emergencyData.total} records</strong>{' '}
                ({emergencyData.counts.associates} associates, {emergencyData.counts.callIns} call-ins, {emergencyData.counts.teamNotes + emergencyData.counts.myNotes} notes, {emergencyData.counts.associateUniformItems || 0} associate uniform items).
                Tap below to restore your lost data.
              </p>
              <button
                onClick={handleEmergencyRecover}
                className="mt-2 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw size={13} /> Recover Lost Data Now
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-dark disabled:opacity-60 transition-all"
          >
            {creating ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
            {creating ? 'Saving…' : 'Save Backup'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all"
          >
            <Download size={16} /> Export to File
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-50 transition-all"
          >
            <Upload size={16} /> Import File
          </button>
          {backups.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center justify-center gap-2 bg-white border border-red-100 text-red-500 py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-red-50 transition-all"
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2.5 text-xs text-blue-700">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>How backups work:</strong> Backups are saved in your browser. Use{' '}
            <strong>Export to File</strong> to save a <code>.json</code> file to your device —
            this is the safest option and works even if you clear browser data. Use{' '}
            <strong>Import File</strong> to restore from a saved file.
          </div>
        </div>

        {/* ── Cloud Snapshots ─────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Cloud size={16} className="text-gray-400" />
              Cloud Snapshots
              {cloudSnaps.length > 0 && (
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
                  {cloudSnaps.length}
                </span>
              )}
            </h2>
            {isCloudConnected && (
              <button
                onClick={loadCloudSnapshots}
                disabled={loadingCloud}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={15} className={loadingCloud ? 'animate-spin' : ''} />
              </button>
            )}
          </div>

          {!isCloudConnected ? (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-2.5 text-xs text-gray-500">
              <CloudOff size={16} className="flex-shrink-0 mt-0.5 text-gray-400" />
              <span>Cloud snapshots back up all team data to Firebase automatically once a day while you're signed in with cloud sync. Connect cloud sync above to enable them.</span>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex gap-2.5 text-xs text-green-800 mb-3">
                <Shield size={14} className="flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Automatic protection on.</strong> A full snapshot of all team data is saved to the cloud once a day. Snapshots are kept and never auto-deleted, so you can recover data from any day.
                </div>
              </div>

              <button
                onClick={handleCloudBackupNow}
                disabled={cloudBusy}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-green-700 disabled:opacity-60 transition-all mb-3"
              >
                {cloudBusy ? <RefreshCw size={16} className="animate-spin" /> : <Cloud size={16} />}
                {cloudBusy ? 'Saving snapshot…' : 'Back Up to Cloud Now'}
              </button>

              {loadingCloud && cloudSnaps.length === 0 ? (
                <div className="bg-white rounded-xl p-6 flex items-center justify-center gap-2 text-sm text-gray-400 shadow-sm">
                  <RefreshCw size={16} className="animate-spin" /> Loading snapshots…
                </div>
              ) : cloudSnaps.length === 0 ? (
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
                    <Cloud size={22} className="text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-400">
                    No cloud snapshots yet. One is created automatically each day,<br />
                    or tap "Back Up to Cloud Now" to create one immediately.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cloudSnaps.map(snap => (
                    <div key={snap.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Cloud size={20} className="text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-gray-800">
                                {format(new Date(snap.createdAt), 'MMM d, yyyy · h:mm a')}
                              </p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                snap.auto ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {snap.auto ? 'auto · daily' : 'manual'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {snap.recordTotal || 0} records
                              {snap.createdBy?.name ? ` · by ${snap.createdBy.name}` : ''}
                            </p>
                          </div>
                        </div>
                        {snap.counts && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {[
                              { label: 'Associates', val: snap.counts.associates },
                              { label: 'Call-Ins',   val: snap.counts.callIns },
                              { label: 'Team Notes', val: snap.counts.teamNotes },
                              { label: 'Tasks',      val: snap.counts.tasks },
                              { label: 'Uniforms',   val: snap.counts.uniforms },
                              { label: 'Reviews',    val: snap.counts.reviews },
                              { label: 'Work Files', val: snap.counts.workFiles },
                            ].filter(c => typeof c.val === 'number').map(({ label, val }) => (
                              <span key={label} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                {val} {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex border-t border-gray-100">
                        <button
                          onClick={() => handleRestoreCloudSnapshot(snap)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-primary hover:bg-red-50 transition-colors"
                        >
                          <RotateCcw size={14} /> Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Saved Backups List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <HardDrive size={16} className="text-gray-400" />
              Saved Backups
              {backups.length > 0 && (
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
                  {backups.length}
                </span>
              )}
            </h2>
          </div>

          {backups.length === 0 ? (
            <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <HardDrive size={26} className="text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-600 text-sm mb-1">No Backups Yet</h3>
              <p className="text-xs text-gray-400 mb-4">
                Tap "Save Backup" to create your first snapshot.<br />
                A backup is also created automatically before every restore.
              </p>
              <button
                onClick={handleCreateBackup}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >
                <Shield size={14} /> Save First Backup
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map(backup => (
                <BackupCard
                  key={backup.id}
                  backup={backup}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>

      {/* Confirm Dialog */}
      {confirm && <ConfirmDialog {...confirm} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}

      {/* Restoring / importing overlay */}
      {restoring && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[150] flex flex-col items-center justify-center gap-4 px-6">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          {syncingCloud ? (
            <>
              <p className="font-bold text-gray-800 text-center">Syncing to cloud…</p>
              <p className="text-sm text-gray-500 text-center">{syncProgress || 'Uploading records to Firestore…'}</p>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-xs text-blue-700">
                <span className="animate-pulse">☁️</span>
                <span>Your private notes & calendar are being backed up to your account</span>
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-700">Restoring data…</p>
              {syncProgress && <p className="text-sm text-gray-500 text-center">{syncProgress}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
