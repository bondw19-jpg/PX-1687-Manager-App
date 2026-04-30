/**
 * NotificationPanel.jsx
 * Slide-down notification drawer for Panda Manager Hub
 * Wires into bell icons on both mobile (Header) and desktop (DesktopPageHeader).
 *
 * Usage:
 *   import { useNotifications, NotificationPanel } from './NotificationPanel';
 *
 *   const { alerts, unread, open, setOpen, markAllRead } = useNotifications();
 *   <button onClick={() => setOpen(true)}><Bell /> {unread > 0 && <Badge>{unread}</Badge>}</button>
 *   <NotificationPanel alerts={alerts} open={open} onClose={() => setOpen(false)} onMarkAllRead={markAllRead} />
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, BellOff, CheckCheck, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { generateNotifications } from '../lib/notifications';

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('px_notif_read') || '[]')); }
    catch { return new Set(); }
  });

  // Only pull SHARED data from the store.
  // myEvents and myNotes are intentionally excluded — they are private to
  // each individual account and must never appear in shared notifications.
  const {
    associates, callIns, tasks,
    teamEvents, announcements,
    workFiles, reviews,
  } = useAppStore();

  const alerts = useMemo(() => generateNotifications({
    associates, callIns, tasks,
    teamEvents, announcements,
    workFiles, reviews,
  }), [associates, callIns, tasks, teamEvents, announcements, workFiles, reviews]);

  const unread = useMemo(
    () => alerts.filter(a => !readIds.has(a.id)).length,
    [alerts, readIds]
  );

  const markAllRead = useCallback(() => {
    const newSet = new Set(alerts.map(a => a.id));
    setReadIds(newSet);
    try { localStorage.setItem('px_notif_read', JSON.stringify([...newSet])); } catch {}
  }, [alerts]);

  const markRead = useCallback((id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem('px_notif_read', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  return { alerts, unread, open, setOpen, markAllRead, markRead, readIds };
}

// ─── level helpers ────────────────────────────────────────────────────────────

const LEVEL_STYLES = {
  critical: {
    bar:   'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon:  <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />,
    label: 'Critical',
  },
  warning: {
    bar:   'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    icon:  <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />,
    label: 'Warning',
  },
  info: {
    bar:   'bg-blue-400',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon:  <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />,
    label: 'Info',
  },
  success: {
    bar:   'bg-green-400',
    badge: 'bg-green-100 text-green-700 border-green-200',
    icon:  <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />,
    label: 'Good',
  },
};

const TYPE_LABELS = {
  attendance:   'Attendance',
  task:         'Tasks',
  event:        'Calendar',
  announcement: 'Announcements',
  workfile:     'Work File',
  review:       'Reviews',
};

// ─── single notification card ─────────────────────────────────────────────────

function AlertCard({ alert, isUnread, onNavigate, onMarkRead }) {
  const styles = LEVEL_STYLES[alert.level] ?? LEVEL_STYLES.info;

  return (
    <button
      onClick={() => { onMarkRead(alert.id); onNavigate(alert.link); }}
      className={`w-full text-left flex gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${isUnread ? 'bg-red-50/40' : 'bg-white'}`}
    >
      {/* left color bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${styles.bar}`} />

      {/* icon */}
      <span className="text-xl leading-none mt-0.5 shrink-0">{alert.icon}</span>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug truncate ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
            {alert.title}
          </p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${styles.badge}`}>
            {TYPE_LABELS[alert.type] ?? alert.type}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{alert.body}</p>
      </div>

      {/* unread dot */}
      {isUnread && (
        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </button>
  );
}

// ─── filter tabs ──────────────────────────────────────────────────────────────

const TABS = [
  { key: 'all',        label: 'All' },
  { key: 'critical',   label: '🔴 Critical' },
  { key: 'attendance', label: '📋 Attendance' },
  { key: 'task',       label: '✅ Tasks' },
  { key: 'event',      label: '📅 Calendar' },
];

// ─── main panel ───────────────────────────────────────────────────────────────

export function NotificationPanel({ alerts, open, onClose, onMarkAllRead, markRead, readIds }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return alerts;
    if (tab === 'critical') return alerts.filter(a => a.level === 'critical');
    return alerts.filter(a => a.type === tab);
  }, [alerts, tab]);

  const unreadCount = useMemo(
    () => alerts.filter(a => !readIds.has(a.id)).length,
    [alerts, readIds]
  );

  function handleNavigate(link) {
    onClose();
    if (link) navigate(link);
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — full width on mobile, right-aligned sheet on desktop */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-primary text-white shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <span className="font-bold text-base">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 overflow-x-auto shrink-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {t.label}
              {t.key !== 'all' && (() => {
                const cnt = t.key === 'critical'
                  ? alerts.filter(a => a.level === 'critical').length
                  : alerts.filter(a => a.type === t.key).length;
                return cnt > 0 ? (
                  <span className={`ml-1 ${tab === t.key ? 'text-white/80' : 'text-gray-400'}`}>
                    ({cnt})
                  </span>
                ) : null;
              })()}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16 gap-3">
              <BellOff size={40} className="opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs text-center px-8">
                {tab === 'all'
                  ? 'Everything looks good! Alerts will appear here when action is needed.'
                  : `No ${tab} alerts right now.`}
              </p>
            </div>
          ) : (
            filtered.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isUnread={!readIds.has(alert.id)}
                onNavigate={handleNavigate}
                onMarkRead={markRead}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            Alerts are derived live from store data · PX Store #1687
          </p>
        </div>
      </div>
    </>
  );
}

// ─── bell button (reusable for both mobile and desktop headers) ───────────────

/**
 * BellButton — drop-in replacement for the static bell icons in Header / DesktopPageHeader.
 * Props:
 *   unread       number
 *   onClick      fn
 *   className    extra classes (optional)
 *   variant      'mobile' | 'desktop'   (controls sizing/color)
 */
export function BellButton({ unread = 0, onClick, className = '', variant = 'mobile' }) {
  const isMobile = variant === 'mobile';

  return (
    <button
      onClick={onClick}
      title={unread > 0 ? `${unread} new notification${unread !== 1 ? 's' : ''}` : 'Notifications'}
      className={`relative flex items-center justify-center rounded-lg transition-colors
        ${isMobile
          ? 'w-8 h-8 text-white active:bg-white/20'
          : 'w-9 h-9 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl'}
        ${className}`}
    >
      <Bell size={isMobile ? 20 : 20} />
      {unread > 0 ? (
        <span className={`absolute font-bold rounded-full flex items-center justify-center
          ${isMobile
            ? 'top-0.5 right-0.5 min-w-[14px] h-[14px] px-0.5 text-[9px] bg-accent text-white border border-primary'
            : 'top-1 right-1 min-w-[14px] h-[14px] px-0.5 text-[9px] bg-red-500 text-white border-2 border-white'
          }`}
        >
          {unread > 9 ? '9+' : unread}
        </span>
      ) : (
        <span className={`absolute w-2 h-2 rounded-full border-2
          ${isMobile
            ? 'top-1 right-1 bg-accent border-primary'
            : 'top-1.5 right-1.5 bg-accent border-white'
          }`}
        />
      )}
    </button>
  );
}
