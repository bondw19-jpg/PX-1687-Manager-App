/**
 * notifications.js
 * Live notification generator for Panda Manager Hub — PX Store #1687
 *
 * Derives alerts purely from SHARED store data — no extra Firestore writes needed.
 * Called by useNotifications() hook; result is memoized so it's cheap to call on
 * every render from the bell icon.
 *
 * ─── PRIVACY RULES ────────────────────────────────────────────────────────────
 * ✅ SHARED  (all managers on the store see these):
 *    associates, callIns, tasks, teamEvents, announcements, workFiles, reviews
 *
 * 🔒 PRIVATE (never appears in shared notifications):
 *    myEvents   — personal calendar, stored at users/{uid}/myEvents
 *    myNotes    — personal notes,   stored at users/{uid}/myNotes
 *    Any other data under users/{uid}/…
 *
 * Alert schema:
 *   { id, type, level, title, body, link, ts, icon }
 *
 *   level: 'critical' | 'warning' | 'info' | 'success'
 *   type:  'attendance' | 'task' | 'event' | 'announcement' | 'workfile' | 'review'
 *   link:  route path the user should navigate to (e.g. '/callins')
 */

import { subDays, isAfter, differenceInDays, parseISO, isValid } from 'date-fns';

// ─── helpers ─────────────────────────────────────────────────────────────────

function safeDate(str) {
  if (!str) return null;
  try {
    const d = typeof str === 'string' ? parseISO(str) : new Date(str);
    return isValid(d) ? d : null;
  } catch { return null; }
}

function getCallInPoints(c) {
  if (c.points !== undefined) return Number(c.points);
  const LEGACY = { 'No-Show': 3, 'Unexcused': 2, 'Late/Tardy': 1, 'Excused': 0 };
  return LEGACY[c.type] ?? 0;
}

function get90DayCallIns(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns.filter(
    c => c.associateId === associateId && isAfter(new Date(c.date), cutoff)
  );
}

/**
 * getEffectivePoints — mirrors the logic in CallIns.jsx.
 * Applies 30/60-day clean-streak recovery automatically:
 *   60+ days clean → −1.0 pt
 *   30–59 days clean → −0.5 pt
 *   < 30 days clean → no deduction
 */
function getEffectivePoints(callIns, associateId) {
  const recent = get90DayCallIns(callIns, associateId);
  if (recent.length === 0) return 0;

  const rawPts = recent.reduce((sum, c) => sum + getCallInPoints(c), 0);
  if (rawPts <= 0) return 0;

  const lastDate = recent
    .map(c => new Date(c.date))
    .reduce((latest, d) => (d > latest ? d : latest), new Date(0));

  const cleanDays = differenceInDays(new Date(), lastDate);
  let recovery = 0;
  if (cleanDays >= 60) recovery = 1.0;
  else if (cleanDays >= 30) recovery = 0.5;

  return Math.max(0, Math.round((rawPts - recovery) * 10) / 10);
}

function get90DayCount(callIns, associateId) {
  return get90DayCallIns(callIns, associateId).length;
}

// ─── main generator ───────────────────────────────────────────────────────────

/**
 * generateNotifications(state) → Alert[]
 *
 * Pure function — takes a snapshot of SHARED store state only.
 * myEvents and myNotes are intentionally NOT accepted as parameters
 * so personal data can never accidentally leak into shared notifications.
 *
 * Callers should useMemo() over the relevant shared slices.
 */
export function generateNotifications({
  associates    = [],
  callIns       = [],
  tasks         = [],
  teamEvents    = [],   // ✅ SHARED — team calendar
  // myEvents intentionally excluded — personal, never shared
  announcements = [],
  workFiles     = {},
  reviews       = [],
  // myNotes intentionally excluded — personal, never shared
  // teamNotes not used for notifications (content is internal)
} = {}) {
  const alerts = [];
  const today  = new Date();

  // ── 1. ATTENDANCE: per-associate 90-day point thresholds ──────────────────
  associates.forEach(a => {
    const pts   = getEffectivePoints(callIns, a.id);
    const count = get90DayCount(callIns, a.id);
    if (pts <= 0) return;

    if (pts >= 8) {
      alerts.push({
        id: `att-crit-${a.id}`,
        type: 'attendance', level: 'critical',
        icon: '🔴',
        title: `${a.name} — Termination Eligible`,
        body:  `${pts} pts in 90 days (${count} incident${count !== 1 ? 's' : ''}). Immediate action required.`,
        link: '/callins',
        ts: Date.now(),
      });
    } else if (pts >= 6) {
      alerts.push({
        id: `att-final-${a.id}`,
        type: 'attendance', level: 'critical',
        icon: '⚠️',
        title: `${a.name} — Final Written Warning`,
        body:  `${pts} pts in 90 days. Issue Final Written Warning per PX policy.`,
        link: '/callins',
        ts: Date.now(),
      });
    } else if (pts >= 4) {
      alerts.push({
        id: `att-first-${a.id}`,
        type: 'attendance', level: 'warning',
        icon: '📋',
        title: `${a.name} — First Written Warning`,
        body:  `${pts} pts in 90 days. Issue First Written Warning.`,
        link: '/callins',
        ts: Date.now(),
      });
    } else if (pts >= 2) {
      alerts.push({
        id: `att-coach-${a.id}`,
        type: 'attendance', level: 'info',
        icon: '💬',
        title: `${a.name} — Coaching Needed`,
        body:  `${pts} pts in 90 days. Schedule a coaching conversation.`,
        link: '/callins',
        ts: Date.now(),
      });
    }
  });

  // ── 2. TASKS: overdue + due today + due soon + urgent ─────────────────────
  tasks.forEach(t => {
    if (t.status === 'Done') return;
    const due = safeDate(t.dueDate);

    if (!due) {
      if (t.priority === 'Urgent') {
        alerts.push({
          id: `task-urgent-${t.id}`,
          type: 'task', level: 'warning',
          icon: '🔴',
          title: `Urgent Task: ${t.title}`,
          body:  `${t.assignee ? 'Assigned to ' + t.assignee + '. ' : ''}No due date set.`,
          link: '/tasks',
          ts: safeDate(t.createdAt)?.getTime() || Date.now(),
        });
      }
      return;
    }

    const daysUntil = differenceInDays(due, today);

    if (daysUntil < 0) {
      alerts.push({
        id: `task-overdue-${t.id}`,
        type: 'task', level: 'critical',
        icon: '⏰',
        title: `Overdue Task: ${t.title}`,
        body:  `Was due ${t.dueDate}${t.assignee ? ' · ' + t.assignee : ''}. Status: ${t.status}.`,
        link: '/tasks',
        ts: due.getTime(),
      });
    } else if (daysUntil === 0) {
      alerts.push({
        id: `task-today-${t.id}`,
        type: 'task', level: 'warning',
        icon: '📌',
        title: `Due Today: ${t.title}`,
        body:  `${t.assignee ? 'Assigned to ' + t.assignee + '. ' : ''}Priority: ${t.priority}.`,
        link: '/tasks',
        ts: due.getTime(),
      });
    } else if (daysUntil <= 2 || t.priority === 'Urgent') {
      alerts.push({
        id: `task-soon-${t.id}`,
        type: 'task', level: 'info',
        icon: '📅',
        title: `Due Soon: ${t.title}`,
        body:  `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} (${t.dueDate})${t.assignee ? ' · ' + t.assignee : ''}.`,
        link: '/tasks',
        ts: due.getTime(),
      });
    }
  });

  // ── 3. TEAM CALENDAR EVENTS: upcoming within 48 hours ────────────────────
  // NOTE: Only teamEvents (shared) are included here.
  //       myEvents (personal) are intentionally excluded — they are private
  //       to the individual account and must never appear in shared notifications.
  teamEvents.forEach(e => {
    const eventDate = safeDate(e.date);
    if (!eventDate) return;
    const daysUntil = differenceInDays(eventDate, today);
    if (daysUntil < 0 || daysUntil > 2) return;

    const label = daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;
    alerts.push({
      id: `event-${e.id}`,
      type: 'event', level: daysUntil === 0 ? 'warning' : 'info',
      icon: e.type === 'Inspection' ? '🔍' : e.type === 'Meeting' ? '📅' : e.type === 'Training' ? '📚' : '📆',
      title: `${label}: ${e.title}`,
      body:  `Team Calendar · ${e.type}${e.time ? ' at ' + e.time : ''}.`,
      link: '/calendar',
      ts: eventDate.getTime(),
    });
  });

  // ── 4. ANNOUNCEMENTS: urgent (3 days) / important (1 day) / normal (today)
  announcements.forEach(ann => {
    const created = safeDate(ann.createdAt);
    if (!created) return;
    const age = differenceInDays(today, created);
    if (age > 3) return;

    if (ann.priority === 'Urgent') {
      alerts.push({
        id: `ann-${ann.id}`,
        type: 'announcement', level: 'critical',
        icon: '📢',
        title: `Urgent: ${ann.title}`,
        body:  ann.body ? ann.body.slice(0, 100) + (ann.body.length > 100 ? '…' : '') : '',
        link: '/announcements',
        ts: created.getTime(),
      });
    } else if (ann.priority === 'Important' && age <= 1) {
      alerts.push({
        id: `ann-${ann.id}`,
        type: 'announcement', level: 'warning',
        icon: '📣',
        title: `Important: ${ann.title}`,
        body:  ann.body ? ann.body.slice(0, 100) + (ann.body.length > 100 ? '…' : '') : '',
        link: '/announcements',
        ts: created.getTime(),
      });
    } else if (age === 0) {
      alerts.push({
        id: `ann-${ann.id}`,
        type: 'announcement', level: 'info',
        icon: '💬',
        title: `New Announcement: ${ann.title}`,
        body:  ann.body ? ann.body.slice(0, 80) + (ann.body.length > 80 ? '…' : '') : '',
        link: '/announcements',
        ts: created.getTime(),
      });
    }
  });

  // ── 5. WORK FILES: auto-entries added in last 7 days ─────────────────────
  Object.entries(workFiles).forEach(([assocId, wf]) => {
    if (!wf?.rows?.length) return;
    const assoc = associates.find(a => a.id === assocId);
    if (!assoc) return;

    const recentAutoRows = (wf.rows || []).filter(r => {
      if (!r.details?.startsWith('Auto')) return false;
      const d = safeDate(r.date);
      if (!d) return false;
      return differenceInDays(today, d) <= 7;
    });

    if (recentAutoRows.length > 0) {
      const latest = recentAutoRows[recentAutoRows.length - 1];
      alerts.push({
        id: `wf-${assocId}-${latest.id || latest.date}`,
        type: 'workfile', level: 'warning',
        icon: '📁',
        title: `Work File Updated: ${assoc.name}`,
        body:  latest.details?.replace(/^Auto \[PX Policy\]: /, '') || 'New auto entry added.',
        link: '/team',
        ts: safeDate(latest.date)?.getTime() || Date.now(),
      });
    }
  });

  // ── 6. PERFORMANCE REVIEWS: no review or review due (90+ days) ───────────
  associates
    .filter(a => a.status === 'active')
    .forEach(a => {
      const latestReview = reviews
        .filter(r => r.associateId === a.id)
        .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))[0];

      if (!latestReview) {
        const hired = safeDate(a.hireDate);
        const daysSinceHire = hired ? differenceInDays(today, hired) : 999;
        if (daysSinceHire >= 90) {
          alerts.push({
            id: `review-missing-${a.id}`,
            type: 'review', level: 'info',
            icon: '⭐',
            title: `No Review on File: ${a.name}`,
            body:  'No performance review recorded. Consider scheduling one.',
            link: '/reviews',
            ts: Date.now() - 1000,
          });
        }
      } else {
        const daysSince = differenceInDays(today, safeDate(latestReview.createdAt) || today);
        if (daysSince >= 90) {
          alerts.push({
            id: `review-due-${a.id}`,
            type: 'review', level: 'info',
            icon: '⭐',
            title: `Review Due: ${a.name}`,
            body:  `Last reviewed ${daysSince} days ago. Consider a new performance review.`,
            link: '/reviews',
            ts: safeDate(latestReview.createdAt)?.getTime() || Date.now(),
          });
        }
      }
    });

  // ── Sort: critical → warning → info → success, then by ts desc ───────────
  const ORDER = { critical: 0, warning: 1, info: 2, success: 3 };
  alerts.sort((a, b) => {
    const lvlDiff = (ORDER[a.level] ?? 9) - (ORDER[b.level] ?? 9);
    if (lvlDiff !== 0) return lvlDiff;
    return b.ts - a.ts;
  });

  return alerts;
}
