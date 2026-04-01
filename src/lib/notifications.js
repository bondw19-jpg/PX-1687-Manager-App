/**
 * notifications.js
 * Live notification generator for Panda Manager Hub — PX Store #1687
 *
 * Derives alerts purely from existing store data — no extra Firestore writes needed.
 * Called by useNotifications() hook; result is memoized so it's cheap to call on
 * every render from the bell icon.
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

function get90DayPoints(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns
    .filter(c => c.associateId === associateId && isAfter(new Date(c.date), cutoff))
    .reduce((sum, c) => sum + getCallInPoints(c), 0);
}

function get90DayCount(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns.filter(c => c.associateId === associateId && isAfter(new Date(c.date), cutoff)).length;
}

function disciplineLabel(pts) {
  if (pts >= 8) return 'Termination Eligible 🔴';
  if (pts >= 6) return 'Final Written Warning ⚠️';
  if (pts >= 4) return 'First Written Warning 📋';
  if (pts >= 2) return 'Coaching 💬';
  return 'Good Standing ✅';
}

// ─── main generator ───────────────────────────────────────────────────────────

/**
 * generateNotifications(state) → Alert[]
 * Pure function — takes a snapshot of store state and returns all current alerts.
 * Always re-runs on each call; callers should useMemo() over relevant slices.
 */
export function generateNotifications({
  associates = [],
  callIns = [],
  tasks = [],
  teamEvents = [],
  myEvents = [],
  announcements = [],
  workFiles = {},
  reviews = [],
  teamNotes = [],
} = {}) {
  const alerts = [];
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // ── 1. ATTENDANCE: per-associate 90-day point thresholds ──────────────────
  associates.forEach(a => {
    const pts   = get90DayPoints(callIns, a.id);
    const count = get90DayCount(callIns, a.id);
    if (pts <= 0) return;

    if (pts >= 8) {
      alerts.push({
        id: `att-crit-${a.id}`,
        type: 'attendance', level: 'critical',
        icon: '🔴',
        title: `${a.name} — Termination Eligible`,
        body:  `${pts} attendance pts in 90 days (${count} incident${count !== 1 ? 's' : ''}). Immediate action required.`,
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

  // ── 2. TASKS: overdue + due today + urgent ────────────────────────────────
  tasks.forEach(t => {
    if (t.status === 'Done') return;
    const due = safeDate(t.dueDate);
    if (!due) {
      // Urgent tasks with no due date
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

  // ── 3. CALENDAR EVENTS: upcoming within 48 hours ─────────────────────────
  const allEvents = [...teamEvents, ...myEvents];
  allEvents.forEach(e => {
    const eventDate = safeDate(e.date);
    if (!eventDate) return;
    const daysUntil = differenceInDays(eventDate, today);
    if (daysUntil < 0 || daysUntil > 2) return;

    const label = daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;
    const source = teamEvents.some(ev => ev.id === e.id) ? 'Team' : 'My';
    alerts.push({
      id: `event-${e.id}`,
      type: 'event', level: daysUntil === 0 ? 'warning' : 'info',
      icon: e.type === 'Inspection' ? '🔍' : e.type === 'Meeting' ? '📅' : e.type === 'Training' ? '📚' : '📆',
      title: `${label}: ${e.title}`,
      body:  `${source} Calendar · ${e.type}${e.time ? ' at ' + e.time : ''}.`,
      link: '/calendar',
      ts: eventDate.getTime(),
    });
  });

  // ── 4. ANNOUNCEMENTS: latest urgent/important (last 3 days) ──────────────
  announcements.forEach(ann => {
    const created = safeDate(ann.createdAt);
    if (!created) return;
    const age = differenceInDays(today, created);
    if (age > 3) return; // only show recent ones

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

    // Find auto-generated rows (from PX policy) created recently
    const recentAutoRows = (wf.rows || []).filter(r => {
      if (!r.details?.startsWith('Auto')) return false;
      // Try to parse date from row
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
        link: '/associates',
        ts: safeDate(latest.date)?.getTime() || Date.now(),
      });
    }
  });

  // ── 6. PERFORMANCE REVIEWS: associates with no review in 90+ days ─────────
  associates
    .filter(a => a.status === 'active')
    .forEach(a => {
      const latestReview = reviews
        .filter(r => r.associateId === a.id)
        .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))[0];

      if (!latestReview) {
        // Only flag if the associate was hired 90+ days ago (or no hire date)
        const hired = safeDate(a.hireDate);
        const daysSinceHire = hired ? differenceInDays(today, hired) : 999;
        if (daysSinceHire >= 90) {
          alerts.push({
            id: `review-missing-${a.id}`,
            type: 'review', level: 'info',
            icon: '⭐',
            title: `No Review on File: ${a.name}`,
            body:  `No performance review recorded. Consider scheduling one.`,
            link: '/reviews',
            ts: Date.now() - 1000, // slightly older so attendance alerts sort first
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

  // ── Sort: critical first, then warning, then info/success, then by ts desc ─
  const ORDER = { critical: 0, warning: 1, info: 2, success: 3 };
  alerts.sort((a, b) => {
    const lvlDiff = (ORDER[a.level] ?? 9) - (ORDER[b.level] ?? 9);
    if (lvlDiff !== 0) return lvlDiff;
    return b.ts - a.ts;
  });

  return alerts;
}
