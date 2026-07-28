/**
 * ActivityFeed.jsx
 * Team activity feed for Panda Manager Hub Dashboard
 *
 * Shows recent updates across ALL shared modules so the whole team
 * stays in sync at a glance.
 *
 * ── Read-tracking ─────────────────────────────────────────────────────────
 * Read state is stored in localStorage under key:
 *   px_feed_read_{uid}   →  JSON array of activity IDs the user has tapped
 *
 * Each user has their own read list — tapping an item marks it read
 * for THAT user only. Other users still see it as unread until they tap it.
 *
 * ── Activity schema ───────────────────────────────────────────────────────
 *   { id, type, icon, title, body, detail, ts, author, level }
 *
 *   type:   'callin' | 'associate' | 'task' | 'announcement' | 'note' |
 *            'workfile' | 'review' | 'event' | 'lendborrow'
 *   level:  'critical' | 'warning' | 'info' | 'success'
 *   detail: object with all fields for the detail modal
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import {
  Bell, X, ChevronRight, Check, CheckCheck,
  PhoneMissed, Users, ClipboardList, Megaphone,
  FileText, Star, Calendar, Shield, Clock, User,
  Info, AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

// ─── helpers ──────────────────────────────────────────────────────────────────

function safeDate(str) {
  if (!str) return null;
  try {
    const d = typeof str === 'string' ? parseISO(str) : new Date(str);
    return isValid(d) ? d : null;
  } catch { return null; }
}

function timeAgo(str) {
  const d = safeDate(str);
  if (!d) return '';
  try {
    return formatDistanceToNow(d, { addSuffix: true });
  } catch { return ''; }
}

function fmtDate(str) {
  const d = safeDate(str);
  if (!d) return str || '';
  try { return format(d, 'MMM d, yyyy'); } catch { return str; }
}

// ─── activity generator ───────────────────────────────────────────────────────

const CALLIN_SUBTYPE_LABELS = {
  tardy_minor: 'Minor Tardiness (1–30 min)',
  tardy_moderate: 'Moderate Tardiness (31–60 min)',
  tardy_severe: 'Severe Tardiness (60+ min)',
  early_partial: 'Early Departure (with notice)',
  early_walkout: 'Early Departure (no notice)',
  absence_excused: 'Excused Absence',
  absence_unexcused: 'Unexcused Absence',
  absence_noshow: 'No-Show (no contact)',
  protected_fmla: 'FMLA / Medical Leave',
  protected_jury: 'Jury Duty',
  protected_military: 'Military Service',
  protected_bereavement: 'Bereavement Leave',
  protected_healthcode: 'Health Code Related',
  protected_other: 'Other Protected Absence',
  emergency_medical: 'Medical Emergency',
  emergency_accident: 'Accident / Police Report',
  emergency_family: 'Family Emergency',
  emergency_discretion: 'Manager Discretion Waiver',
};

const CAT_ICONS = {
  tardiness: '⏰', early_departure: '🚪', absence: '🚫',
  protected: '🛡️', emergency: '🏥',
};

function generateActivities({
  callIns = [], associates = [], tasks = [],
  announcements = [], teamNotes = [], reviews = [],
  teamEvents = [], workFiles = {}, lendBorrow = [], changeOrders = [],
} = {}) {
  const items = [];
  const LIMIT_DAYS = 14; // show activity from last 14 days
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - LIMIT_DAYS);

  // ── 1. Call-ins (attendance events) ────────────────────────────────────────
  callIns.forEach(c => {
    const d = safeDate(c.createdAt || c.date);
    if (!d || d < cutoff) return;
    const pts = c.points !== undefined ? c.points
      : (c.subtypeId && CALLIN_SUBTYPE_LABELS[c.subtypeId] ? undefined
      : ({ 'No-Show': 3, 'Unexcused': 2, 'Late/Tardy': 1 }[c.type] ?? 0));
    const subtypeLabel = c.subtypeId ? (CALLIN_SUBTYPE_LABELS[c.subtypeId] || c.subtypeId) : c.type;
    const catIcon = CAT_ICONS[c.categoryId] || '📋';
    const isZero = (c.points === 0) || c.categoryId === 'protected' || c.categoryId === 'emergency';
    items.push({
      id: `callin-${c.id}`,
      type: 'callin',
      icon: catIcon,
      level: isZero ? 'info' : (pts >= 3 ? 'critical' : pts >= 2 ? 'warning' : 'info'),
      title: `${c.associateName || 'Associate'} — ${subtypeLabel}`,
      body: `${c.date}${c.time ? ' · ' + c.time : ''}${pts > 0 ? ' · +' + pts + ' pt' + (pts !== 1 ? 's' : '') : ' · 0 pts (protected)'}`,
      author: c.createdBy?.name || 'Manager',
      ts: d.getTime(),
      detail: {
        headline: `Attendance: ${c.associateName}`,
        rows: [
          ['Associate', c.associateName || '—'],
          ['Date', c.date || '—'],
          ['Time', c.time || '—'],
          ['Category', catIcon + ' ' + (c.categoryId || c.type || '—')],
          ['Type', subtypeLabel || '—'],
          ['Points', isZero ? '0 pts (protected/emergency)' : `+${pts} pts`],
          ['Reason', c.reason || '—'],
          ['Documentation', c.documentation || '—'],
          ['Shift Covered', c.covered || '—'],
          ['Covered By', c.coveredBy || '—'],
          ['Manager Note', c.managerNote || '—'],
          ['Logged By', c.createdBy?.name || '—'],
        ].filter(([, v]) => v && v !== '—'),
        link: '/callins',
      },
    });
  });

  // ── 2. Announcements ────────────────────────────────────────────────────────
  announcements.forEach(ann => {
    const d = safeDate(ann.createdAt);
    if (!d || d < cutoff) return;
    const LEVEL = { Urgent: 'critical', Important: 'warning', Normal: 'info' };
    const ICON  = { Urgent: '📢', Important: '📣', Normal: '💬' };
    items.push({
      id: `ann-${ann.id}`,
      type: 'announcement',
      icon: ICON[ann.priority] || '💬',
      level: LEVEL[ann.priority] || 'info',
      title: ann.title,
      body: ann.body ? ann.body.slice(0, 80) + (ann.body.length > 80 ? '…' : '') : '',
      author: ann.createdBy?.name || 'Manager',
      ts: d.getTime(),
      detail: {
        headline: ann.title,
        rows: [
          ['Priority', ann.priority || 'Normal'],
          ['Posted', fmtDate(ann.createdAt)],
          ['Posted By', ann.createdBy?.name || '—'],
          ['Message', ann.body || '—'],
        ].filter(([, v]) => v && v !== '—'),
        link: '/announcements',
        fullBody: ann.body,
      },
    });
  });

  // ── 3. Tasks created / updated ──────────────────────────────────────────────
  tasks.forEach(t => {
    const d = safeDate(t.createdAt || t.updatedAt);
    if (!d || d < cutoff) return;
    const isDone = t.status === 'Done';
    const isUrgent = t.priority === 'Urgent';
    items.push({
      id: `task-${t.id}`,
      type: 'task',
      icon: isDone ? '✅' : isUrgent ? '🔴' : '📌',
      level: isDone ? 'success' : isUrgent ? 'critical' : 'info',
      title: `Task: ${t.title}`,
      body: `${t.status}${t.assignee ? ' · ' + t.assignee : ''}${t.dueDate ? ' · Due ' + t.dueDate : ''}`,
      author: t.createdBy?.name || t.assignee || 'Manager',
      ts: d.getTime(),
      detail: {
        headline: t.title,
        rows: [
          ['Status', t.status || '—'],
          ['Priority', t.priority || '—'],
          ['Assigned To', t.assignee || '—'],
          ['Due Date', t.dueDate || '—'],
          ['Section', t.section || '—'],
          ['Notes', t.notes || '—'],
          ['Created By', t.createdBy?.name || '—'],
        ].filter(([, v]) => v && v !== '—'),
        link: '/tasks',
      },
    });
  });

  // ── 4. Team notes created ───────────────────────────────────────────────────
  teamNotes.forEach(n => {
    const d = safeDate(n.createdAt);
    if (!d || d < cutoff) return;
    items.push({
      id: `note-${n.id}`,
      type: 'note',
      icon: n.pinned ? '📌' : '🗒️',
      level: 'info',
      title: `Note: ${n.title || 'Untitled'}`,
      body: n.content ? n.content.slice(0, 80) + (n.content.length > 80 ? '…' : '') : '',
      author: n.createdBy?.name || 'Manager',
      ts: d.getTime(),
      detail: {
        headline: n.title || 'Note',
        rows: [
          ['Category', n.category || '—'],
          ['Pinned', n.pinned ? 'Yes' : 'No'],
          ['Created By', n.createdBy?.name || '—'],
          ['Date', fmtDate(n.createdAt)],
          ['Content', n.content || '—'],
        ].filter(([, v]) => v && v !== '—'),
        link: '/notes',
        fullBody: n.content,
      },
    });
  });

  // ── 5. Reviews posted ───────────────────────────────────────────────────────
  reviews.forEach(r => {
    const d = safeDate(r.createdAt);
    if (!d || d < cutoff) return;
    const assoc = associates.find(a => a.id === r.associateId);
    const name = assoc?.name || r.associateName || 'Associate';
    const avg = r.categories?.length
      ? (r.categories.reduce((s, c) => s + (c.rating || 0), 0) / r.categories.length).toFixed(1)
      : r.rating || '—';
    items.push({
      id: `review-${r.id}`,
      type: 'review',
      icon: '⭐',
      level: 'success',
      title: `Review: ${name}`,
      body: `Overall ${avg}/5${r.reviewer ? ' · by ' + r.reviewer : ''}`,
      author: r.reviewer || r.createdBy?.name || 'Manager',
      ts: d.getTime(),
      detail: {
        headline: `Performance Review — ${name}`,
        rows: [
          ['Associate', name],
          ['Overall Rating', avg + '/5'],
          ['Reviewed By', r.reviewer || r.createdBy?.name || '—'],
          ['Date', fmtDate(r.createdAt)],
          ...(r.categories || []).map(c => [c.name || c.label || 'Category', (c.rating || 0) + '/5']),
          ['Comments', r.notes || r.comments || '—'],
        ].filter(([, v]) => v && v !== '—'),
        link: '/reviews',
      },
    });
  });

  // ── 6. Team calendar events added ──────────────────────────────────────────
  teamEvents.forEach(e => {
    const d = safeDate(e.createdAt || e.date);
    if (!d || d < cutoff) return;
    items.push({
      id: `event-${e.id}`,
      type: 'event',
      icon: e.type === 'Inspection' ? '🔍' : e.type === 'Training' ? '📚' : '📅',
      level: 'info',
      title: `Event: ${e.title}`,
      body: `${e.date}${e.time ? ' · ' + e.time : ''} · ${e.type || 'Event'}`,
      author: e.createdBy?.name || 'Manager',
      ts: d.getTime(),
      detail: {
        headline: e.title,
        rows: [
          ['Type', e.type || '—'],
          ['Date', e.date || '—'],
          ['Time', e.time || '—'],
          ['Notes', e.notes || '—'],
          ['Added By', e.createdBy?.name || '—'],
        ].filter(([, v]) => v && v !== '—'),
        link: '/calendar',
      },
    });
  });

  // ── 7. Work file entries (all manual + auto rows, plus save-level activity) ──
  Object.entries(workFiles).forEach(([assocId, wf]) => {
    const assoc = associates.find(a => a.id === assocId);
    const assocName = assoc?.name || 'Associate';

    // 7a. One "file updated" card based on savedAt — always fires when the file
    //     is saved, even if the row's incident date is old.
    const savedD = safeDate(wf.savedAt);
    if (savedD && savedD >= cutoff) {
      const filledRows = (wf.rows || []).filter(r => r.date || r.key || r.details);
      items.push({
        id: `wf-save-${assocId}-${wf.savedAt}`,
        type: 'workfile',
        icon: '📁',
        level: 'warning',
        title: `Work File Updated: ${assocName}`,
        body: `${filledRows.length} entr${filledRows.length === 1 ? 'y' : 'ies'} on file`,
        author: wf.savedBy?.name || 'Manager',
        ts: savedD.getTime(),
        detail: {
          headline: `Work File — ${assocName}`,
          rows: [
            ['Associate', assocName],
            ['Saved By', wf.savedBy?.name || '—'],
            ['Saved At', savedD.toLocaleString()],
            ['Total Entries', String(filledRows.length)],
          ].filter(([, v]) => v && v !== '—'),
          link: `/team?workfile=${assocId}`,
        },
      });
    }

    // 7b. Individual row cards for rows whose incident date falls in the last 14 days
    (wf.rows || []).forEach(row => {
      const d = safeDate(row.date);
      if (!d || d < cutoff) return;
      // Skip rows with no meaningful content
      if (!row.details && !row.key) return;
      const cleanDetails = row.details?.replace(/^Auto \[PX Policy\]: /, '') || '';
      items.push({
        id: `wf-row-${assocId}-${row.id || row.date}`,
        type: 'workfile',
        icon: '📁',
        level: 'warning',
        title: `Work File: ${assocName}`,
        body: (cleanDetails || `Key ${row.key}`).slice(0, 80),
        author: row.addedBy?.name || wf.savedBy?.name || 'Manager',
        ts: d.getTime(),
        detail: {
          headline: `Work File — ${assocName}`,
          rows: [
            ['Associate', assocName],
            ['Date', row.date || '—'],
            ['Key', row.key || '—'],
            ['Details', cleanDetails || '—'],
            ['Added By', row.addedBy?.name || wf.savedBy?.name || '—'],
          ].filter(([, v]) => v && v !== '—'),
          link: `/team?workfile=${assocId}`,
        },
      });
    });
  });

  // ── 8. Lend / Borrow records ───────────────────────────────────────────────
  lendBorrow.forEach(r => {
    const dirLabel  = r.direction === 'lent' ? 'Lent to' : 'Borrowed from';
    const itemsText = (r.items || []).map(i => `${i.qty}× ${i.name}`).join(', ');
    const baseRows = [
      ['Direction', r.direction === 'lent' ? '📤 Lent out' : '📥 Borrowed'],
      ['Other Store', r.otherStore || '—'],
      ['Items', itemsText || '—'],
      ['Date', r.date || '—'],
      ['Notes', r.notes || '—'],
      ['Logged By', r.createdBy?.name || '—'],
    ];

    // 8a. New record logged
    const created = safeDate(r.createdAt || r.date);
    if (created && created >= cutoff) {
      items.push({
        id: `lb-${r.id}`,
        type: 'lendborrow',
        icon: r.direction === 'lent' ? '📤' : '📥',
        level: 'info',
        title: `${dirLabel} ${r.otherStore || 'another store'}`,
        body: itemsText ? itemsText.slice(0, 80) : 'Products recorded',
        author: r.createdBy?.name || 'Manager',
        ts: created.getTime(),
        detail: {
          headline: `${dirLabel} ${r.otherStore || 'another store'}`,
          rows: baseRows.filter(([, v]) => v && v !== '—'),
          link: '/lend-borrow',
        },
      });
    }

    // 8b. Record settled (paid back / transferred)
    if (r.status === 'settled') {
      const settledD = safeDate(r.settledAt);
      if (settledD && settledD >= cutoff) {
        const method =
          r.settleMethod === 'transferred' ? 'Transferred'
          : r.settleMethod === 'mixed'     ? 'Mixed (paid back + transferred)'
          : 'Paid back';
        items.push({
          id: `lb-settled-${r.id}`,
          type: 'lendborrow',
          icon: '🤝',
          level: 'success',
          title: `Settled — ${method}: ${r.otherStore || 'other store'}`,
          body: itemsText ? itemsText.slice(0, 80) : '',
          author: r.settledBy?.name || 'Manager',
          ts: settledD.getTime(),
          detail: {
            headline: `Settled (${method}) — ${r.otherStore || 'other store'}`,
            rows: [
              ...baseRows,
              ['Settled Via', method],
              ['Settled By', r.settledBy?.name || '—'],
              ['Settled On', fmtDate(r.settledAt)],
            ].filter(([, v]) => v && v !== '—'),
            link: '/lend-borrow',
          },
        });
      }
    }
  });

  // ── 9. Loomis change orders ────────────────────────────────────────────────
  const fmtCents = (c) => '$' + ((c || 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: (c || 0) % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  changeOrders.forEach(o => {
    const amt = fmtCents(o.amountCents);
    const denomText = (o.denominations || []).map(d => `${d.qty}× ${d.label}`).join(', ');
    const baseRows = [
      ['Amount', amt],
      ['Delivery Date', o.deliveryDate || '—'],
      ['Denominations', denomText || '—'],
      ['Notes', o.notes || '—'],
      ['Ordered By', o.createdBy?.name || '—'],
      ['Ordered On', fmtDate(o.createdAt)],
    ];

    // 9a. Order placed
    const created = safeDate(o.createdAt);
    if (created && created >= cutoff) {
      items.push({
        id: `co-${o.id}`,
        type: 'changeorder',
        icon: '💵',
        level: 'info',
        title: `Change order placed — ${amt}`,
        body: `Loomis delivery ${o.deliveryDate}${denomText ? ' · ' + denomText : ''}`.slice(0, 80),
        author: o.createdBy?.name || 'Manager',
        ts: created.getTime(),
        detail: {
          headline: `Loomis Change Order — ${amt}`,
          rows: baseRows.filter(([, v]) => v && v !== '—'),
          link: '/change-orders',
        },
      });
    }

    // 9b. Delivery received
    if (o.status === 'received') {
      const recvD = safeDate(o.receivedAt);
      if (recvD && recvD >= cutoff) {
        items.push({
          id: `co-recv-${o.id}`,
          type: 'changeorder',
          icon: '🚚',
          level: 'success',
          title: `Change order received — ${amt}`,
          body: denomText ? denomText.slice(0, 80) : 'Delivery confirmed',
          author: o.receivedBy?.name || 'Manager',
          ts: recvD.getTime(),
          detail: {
            headline: `Received — Loomis Change Order ${amt}`,
            rows: [
              ...baseRows,
              ['Received By', o.receivedBy?.name || '—'],
              ['Received On', fmtDate(o.receivedAt)],
            ].filter(([, v]) => v && v !== '—'),
            link: '/change-orders',
          },
        });
      }
    }
  });

  // Sort newest first
  items.sort((a, b) => b.ts - a.ts);

  return items;
}

// ─── per-user read tracking ───────────────────────────────────────────────────

function getReadKey(uid) {
  return `px_feed_read_${uid || 'guest'}`;
}

function loadReadIds(uid) {
  try { return new Set(JSON.parse(localStorage.getItem(getReadKey(uid)) || '[]')); }
  catch { return new Set(); }
}

function saveReadIds(uid, set) {
  try { localStorage.setItem(getReadKey(uid), JSON.stringify([...set])); } catch {}
}

// ─── level styles ─────────────────────────────────────────────────────────────

const LEVEL_LEFT = {
  critical: 'bg-red-500',
  warning:  'bg-amber-400',
  info:     'bg-blue-400',
  success:  'bg-green-400',
};

const LEVEL_ICON_COLOR = {
  critical: 'text-red-500',
  warning:  'text-amber-500',
  info:     'text-blue-400',
  success:  'text-green-500',
};

const TYPE_LABELS = {
  callin:       'Attendance',
  announcement: 'Announcement',
  task:         'Task',
  note:         'Note',
  review:       'Review',
  event:        'Calendar',
  workfile:     'Work File',
  lendborrow:   'Lend/Borrow',
  changeorder:  'Change Order',
};

const TYPE_BADGE_COLORS = {
  callin:       'bg-orange-100 text-orange-700',
  announcement: 'bg-red-100 text-red-700',
  task:         'bg-blue-100 text-blue-700',
  note:         'bg-purple-100 text-purple-700',
  review:       'bg-yellow-100 text-yellow-700',
  event:        'bg-green-100 text-green-700',
  workfile:     'bg-gray-100 text-gray-700',
  lendborrow:   'bg-teal-100 text-teal-700',
  changeorder:  'bg-emerald-100 text-emerald-700',
};

// ─── detail modal ─────────────────────────────────────────────────────────────

function ActivityDetailModal({ activity, onClose, onMarkRead }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    onClose();
    if (activity.detail?.link) navigate(activity.detail.link);
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        {/* Colored top strip */}
        <div className={`h-1.5 w-full rounded-t-2xl ${LEVEL_LEFT[activity.level] || LEVEL_LEFT.info} flex-shrink-0`} />

        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl leading-none flex-shrink-0">{activity.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_BADGE_COLORS[activity.type] || 'bg-gray-100 text-gray-700'}`}>
                  {TYPE_LABELS[activity.type] || activity.type}
                </span>
                <span className="text-xs text-gray-400">{timeAgo(new Date(activity.ts).toISOString())}</span>
              </div>
              <h2 className="font-bold text-gray-900 text-sm leading-snug">{activity.detail?.headline || activity.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body p-4 space-y-3">
          {/* Full body text (announcements, notes) */}
          {activity.detail?.fullBody && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {activity.detail.fullBody}
            </div>
          )}

          {/* Key-value detail rows */}
          {activity.detail?.rows?.length > 0 && (
            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden">
              {activity.detail.rows.map(([label, value]) => (
                <div key={label} className="flex items-start gap-3 px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-400 min-w-[100px] pt-0.5 flex-shrink-0">{label}</span>
                  <span className="text-sm text-gray-800 flex-1 leading-snug">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Author + timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User size={12} />
            <span>By <strong className="text-gray-600">{activity.author}</strong></span>
            <span className="text-gray-300">·</span>
            <Clock size={12} />
            <span>{timeAgo(new Date(activity.ts).toISOString())}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="modal-footer flex gap-2">
          {activity.detail?.link && (
            <button
              onClick={handleNavigate}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold"
            >
              Go to {TYPE_LABELS[activity.type] || 'Page'} <ChevronRight size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── feed item row ────────────────────────────────────────────────────────────

function FeedItem({ activity, onTap }) {
  const leftBar = LEVEL_LEFT[activity.level] || LEVEL_LEFT.info;

  return (
    <button
      onClick={() => onTap(activity)}
      className="w-full text-left flex gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors relative"
    >
      {/* Level color bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${leftBar}`} />

      {/* Unread dot */}
      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />

      {/* Icon */}
      <span className="text-xl leading-none mt-0.5 flex-shrink-0">{activity.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug flex-1 min-w-0 text-gray-900">
            {activity.title}
          </p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${TYPE_BADGE_COLORS[activity.type] || 'bg-gray-100 text-gray-600'}`}>
            {TYPE_LABELS[activity.type]}
          </span>
        </div>
        {activity.body && (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{activity.body}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-400">{activity.author}</span>
          <span className="text-gray-300 text-[10px]">·</span>
          <span className="text-[10px] text-gray-400">{timeAgo(new Date(activity.ts).toISOString())}</span>
        </div>
      </div>
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: 'all',          label: 'All' },
  { key: 'announcement', label: '📢 Posts' },
  { key: 'callin',       label: '⏰ Attendance' },
  { key: 'task',         label: '✅ Tasks' },
  { key: 'note',         label: '🗒️ Notes' },
];

export default function ActivityFeed({ maxItems = 30, compact = false }) {
  const {
    callIns, associates, tasks, announcements,
    teamNotes, reviews, teamEvents, workFiles, lendBorrow, changeOrders, user,
  } = useAppStore();
  const navigate = useNavigate();

  const uid = user?.uid || 'guest';
  const prevUidRef = useRef(uid);

  // Read state — per-user, persisted in localStorage
  const [readIds, setReadIds] = useState(() => loadReadIds(uid));
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState(null);

  // When uid resolves (e.g. null → real uid after login), reload read state
  // so marks saved under the real uid are respected immediately
  useEffect(() => {
    if (uid !== prevUidRef.current) {
      prevUidRef.current = uid;
      setReadIds(loadReadIds(uid));
    }
  }, [uid]);

  // Generate all activities
  const allActivities = useMemo(() => generateActivities({
    callIns, associates, tasks, announcements,
    teamNotes, reviews, teamEvents, workFiles, lendBorrow, changeOrders,
  }), [callIns, associates, tasks, announcements, teamNotes, reviews, teamEvents, workFiles, lendBorrow, changeOrders]);

  // Only show unread items (read ones disappear after tap)
  const unreadActivities = useMemo(
    () => allActivities.filter(a => !readIds.has(a.id)),
    [allActivities, readIds]
  );

  // Filter by tab
  const filtered = useMemo(() => {
    const base = activeTab === 'all' ? unreadActivities : unreadActivities.filter(a => a.type === activeTab);
    return base.slice(0, maxItems);
  }, [unreadActivities, activeTab, maxItems]);

  const unreadCount = useMemo(
    () => allActivities.filter(a => !readIds.has(a.id)).length,
    [allActivities, readIds]
  );

  const handleTap = useCallback((activity) => {
    // Mark this item read for this user
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(activity.id);
      saveReadIds(uid, next);
      return next;
    });
    setSelected(activity);
  }, [uid]);

  const markAllRead = useCallback(() => {
    const next = new Set(allActivities.map(a => a.id));
    setReadIds(next);
    saveReadIds(uid, next);
  }, [allActivities, uid]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Bell size={18} className="text-primary" />
            Team Updates
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={13} /> All read
              </button>
            )}
            {!compact && (
              <button
                onClick={() => navigate('/announcements')}
                className="text-xs text-primary font-medium flex items-center gap-1"
              >
                Announcements <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        {!compact && (
          <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
            {FILTER_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === t.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t.label}
                {t.key !== 'all' && (() => {
                  const cnt = unreadActivities.filter(a => a.type === t.key).length;
                  return cnt > 0 ? <span className={`ml-1 ${activeTab === t.key ? 'text-white/70' : 'text-gray-400'}`}>({cnt})</span> : null;
                })()}
              </button>
            ))}
          </div>
        )}

        {/* Feed list */}
        <div className={compact ? 'max-h-[280px] overflow-y-auto' : 'max-h-[420px] overflow-y-auto'}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Bell size={32} className="opacity-20" />
              <p className="text-sm font-medium">No recent activity</p>
              <p className="text-xs text-center px-8">
                All caught up! New updates will appear here
              </p>
            </div>
          ) : (
            filtered.map(a => (
              <FeedItem
                key={a.id}
                activity={a}
                onTap={handleTap}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 text-center">
            Tap any item to view details · It will clear for you after reading
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ActivityDetailModal
          activity={selected}
          onClose={() => setSelected(null)}
          onMarkRead={() => {}}
        />
      )}
    </>
  );
}
