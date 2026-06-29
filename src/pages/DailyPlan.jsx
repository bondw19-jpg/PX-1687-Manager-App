import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronDown, ChevronRight, Lock, Printer, ChevronLeft,
  CheckCircle2, Circle, ClipboardList, AlertCircle, History
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { FIVE_POINTS, getActionsForDate, toDateString, fromDateString } from '../lib/dailyPlanData';
import { openPrintWindow } from '../lib/printReport';
import { SkeletonList } from '../components/Skeleton';

const STORE_ID = 'store_1687';

// ── Role gate ─────────────────────────────────────────────────────────────────
function canCheck(user) {
  const role = user?.role;
  return role === 'admin' || role === 'manager' || role === 'shift_lead';
}

// ── Firestore helpers (lazy-loaded) ──────────────────────────────────────────

/**
 * Subscribe to a daily plan document in real time.
 * Returns an unsubscribe function.
 * onData is called with the raw Firestore data (or null if doc doesn't exist).
 */
async function subscribeDailyPlan(date, onData) {
  try {
    const { getFirebaseModules } = await import('../lib/firebase');
    const { db } = await getFirebaseModules();
    const { doc, onSnapshot } = await import('firebase/firestore');
    const ref = doc(db, 'stores', STORE_ID, 'dailyPlan', date);
    const unsub = onSnapshot(ref, (snap) => {
      onData(snap.exists() ? snap.data() : null);
    }, (err) => {
      console.warn('[DailyPlan] onSnapshot error:', err?.message);
      onData(null);
    });
    return unsub;
  } catch (e) {
    console.warn('[DailyPlan] subscribe failed:', e?.message);
    onData(null);
    return () => {};
  }
}

/**
 * Convert a dot-notation path string into a properly nested plain object.
 * e.g. "points.outside.subItems.outside_0" + value → { points: { outside: { subItems: { outside_0: value } } } }
 * This is required for setDoc (first-write) which doesn't interpret dotted keys as nested paths.
 */
function buildNestedObject(path, value) {
  return path.split('.').reduceRight((acc, key) => ({ [key]: acc }), value);
}

async function saveDailyPlanField(date, fieldPath, value) {
  try {
    const { getFirebaseModules } = await import('../lib/firebase');
    const { db } = await getFirebaseModules();
    const { doc, updateDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = doc(db, 'stores', STORE_ID, 'dailyPlan', date);
    // updateDoc handles dot-notation as nested field paths without overwriting siblings.
    // Falls back to setDoc with a properly nested object when the document doesn't exist yet.
    try {
      await updateDoc(ref, { [fieldPath]: value, _updatedAt: serverTimestamp() });
    } catch (err) {
      if (err?.code === 'not-found') {
        const nested = buildNestedObject(fieldPath, value);
        await setDoc(ref, { ...nested, _updatedAt: serverTimestamp() }, { merge: true });
      } else {
        throw err;
      }
    }
  } catch (e) {
    console.warn('[DailyPlan] save failed:', e?.message);
  }
}

// ── Format time ───────────────────────────────────────────────────────────────
function fmtTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

// ── Role-gated checkbox component ─────────────────────────────────────────────
function GatedCheckbox({ checked, verifiedBy, verifiedAt, onChange, readOnly, label, detail }) {
  return (
    <div
      className={`flex items-start gap-3 py-2.5 px-3 rounded-xl transition-colors ${
        readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
      } ${checked ? 'bg-green-50' : ''}`}
      onClick={readOnly ? undefined : onChange}
    >
      <div className="mt-0.5 flex-shrink-0">
        {readOnly ? (
          checked
            ? <CheckCircle2 size={20} className="text-green-500" />
            : <Circle size={20} className="text-gray-300" />
        ) : (
          checked
            ? <CheckCircle2 size={20} className="text-green-500" />
            : <Circle size={20} className="text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium leading-snug ${checked ? 'text-green-800 line-through decoration-green-400' : 'text-gray-800'}`}>
          {label}
        </span>
        {detail && (
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{detail}</p>
        )}
        {checked && verifiedBy && (
          <p className="text-[11px] text-green-600 mt-0.5 font-medium">
            ✓ Verified by {verifiedBy}{verifiedAt ? ` at ${fmtTime(verifiedAt)}` : ''}
          </p>
        )}
      </div>
      {readOnly && !checked && (
        <Lock size={12} className="text-gray-300 flex-shrink-0 mt-1" />
      )}
    </div>
  );
}

// ── Collapsible section card ───────────────────────────────────────────────────
function SectionCard({ title, badge, color = 'red', children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap = {
    red:    'bg-red-600',
    blue:   'bg-blue-600',
    green:  'bg-green-600',
    orange: 'bg-orange-500',
    purple: 'bg-purple-600',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className={`${colorMap[color]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>
          {badge}
        </span>
        <span className="flex-1 font-bold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && <div className="border-t border-gray-100 divide-y divide-gray-50">{children}</div>}
    </div>
  );
}

// ── Progress pill ──────────────────────────────────────────────────────────────
function ProgressPill({ done, total, label }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
        <div
          className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span>{done}/{total} {label}</span>
    </div>
  );
}

// ── Date navigator ────────────────────────────────────────────────────────────
function DateNav({ dateStr, onChange }) {
  const d = fromDateString(dateStr);
  const today = toDateString(new Date());

  const prev = () => {
    const nd = new Date(d); nd.setDate(nd.getDate() - 1);
    onChange(toDateString(nd));
  };
  const next = () => {
    const nd = new Date(d); nd.setDate(nd.getDate() + 1);
    if (toDateString(nd) <= today) onChange(toDateString(nd));
  };
  const isToday = dateStr === today;

  const displayLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2 mb-4">
      <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <ChevronLeft size={16} className="text-gray-600" />
      </button>
      <div className="flex-1 text-center">
        <input
          type="date"
          value={dateStr}
          max={today}
          onChange={e => { if (e.target.value) onChange(e.target.value); }}
          className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none text-center cursor-pointer w-full"
        />
        <p className="text-[10px] text-gray-400 mt-0.5">{displayLabel}</p>
      </div>
      <button
        onClick={next}
        disabled={isToday}
        className={`p-1.5 rounded-lg transition-colors ${isToday ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
      >
        <ChevronRight size={16} className="text-gray-600" />
      </button>
      {!isToday && (
        <button
          onClick={() => onChange(today)}
          className="text-[10px] font-bold text-primary bg-red-50 px-2 py-1 rounded-lg"
        >
          Today
        </button>
      )}
    </div>
  );
}

// ── Print helper ──────────────────────────────────────────────────────────────
function buildPrintHtml(dateStr, dayData, pointsState, actionsState) {
  const d = fromDateString(dateStr);
  const dayLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const actions = getActionsForDate(d);

  function itemRow(label, detail, state) {
    const checked = state?.checked;
    const by = state?.checkedBy || '';
    const at = state?.checkedAt ? fmtTime(state.checkedAt) : '';
    const checkCell = checked
      ? `<span style="color:#15803d;font-weight:bold">✓</span>`
      : `<span style="color:#ccc">○</span>`;
    const verifier = checked && by ? `<div style="font-size:10px;color:#15803d;margin-top:2px">Verified by ${by}${at ? ' at ' + at : ''}</div>` : '';
    return `<tr>
      <td style="width:28px;text-align:center;padding:6px 4px">${checkCell}</td>
      <td style="padding:6px 8px">
        <div style="font-weight:${checked ? 'normal' : '600'};color:${checked ? '#666' : '#111'};text-decoration:${checked ? 'line-through' : 'none'}">${label}</div>
        ${detail ? `<div style="font-size:10px;color:#888;margin-top:2px">${detail}</div>` : ''}
        ${verifier}
      </td>
    </tr>`;
  }

  function sectionTable(title, rows) {
    return `
      <h2 class="section-title">${title}</h2>
      <table>
        <tbody>
          ${rows}
        </tbody>
      </table>`;
  }

  let html = `<div style="margin-bottom:12px"><strong>Date:</strong> ${dayLabel}</div>`;

  // FOH
  if (actions?.foh?.length) {
    let fohRows = '';
    actions.foh.forEach(item => {
      const state = actionsState?.foh?.[item.id] || {};
      fohRows += itemRow(item.task, item.detail, state);
    });
    html += sectionTable(`7 ACTIONS — FOH (${actions.dayLabel})`, fohRows);
  }

  // BOH
  if (actions?.boh?.length) {
    let bohRows = '';
    actions.boh.forEach(item => {
      const state = actionsState?.boh?.[item.id] || {};
      bohRows += itemRow(item.task, item.detail, state);
    });
    html += sectionTable(`7 ACTIONS — BOH (${actions.dayLabel})`, bohRows);
  }

  return html;
}

// ── Compute completion for a single day from Firestore snapshot data ──────────
function computeDayCompletion(dateStr, firestoreData) {
  const d = fromDateString(dateStr);
  const actions = getActionsForDate(d);
  const points = firestoreData?.points || {};
  const actionsData = firestoreData?.actions || {};

  let total = 0;
  let done = 0;

  FIVE_POINTS.forEach(pt => {
    pt.subItems.forEach((_, i) => {
      total++;
      if (points[pt.key]?.subItems?.[`${pt.key}_${i}`]?.checked) done++;
    });
  });

  (actions?.foh || []).forEach(item => {
    total++;
    if (actionsData?.foh?.[item.id]?.checked) done++;
  });

  (actions?.boh || []).forEach(item => {
    total++;
    if (actionsData?.boh?.[item.id]?.checked) done++;
  });

  return { done, total };
}

// ── Fetch past N days of history from Firestore ───────────────────────────────
async function fetchHistoryRange(days = 30) {
  const today = toDateString(new Date());
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(toDateString(d));
  }

  try {
    const { getFirebaseModules } = await import('../lib/firebase');
    const { db } = await getFirebaseModules();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const oldest = dates[dates.length - 1];
    const q = query(
      collection(db, 'stores', STORE_ID, 'dailyPlan'),
      where('__name__', '>=', oldest),
      where('__name__', '<=', today),
    );
    const snap = await getDocs(q);
    const byDate = {};
    snap.forEach(doc => { byDate[doc.id] = doc.data(); });
    return { dates, byDate };
  } catch (e) {
    console.warn('[DailyPlan] history fetch failed:', e?.message);
    return { dates, byDate: {} };
  }
}

// ── History row color ─────────────────────────────────────────────────────────
function rowColor(pct) {
  if (pct >= 90) return 'green';
  if (pct >= 60) return 'yellow';
  return 'red';
}

// ── History View component ────────────────────────────────────────────────────
function HistoryView({ onSelectDate }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHistoryRange(30).then(({ dates, byDate }) => {
      if (cancelled) return;
      const computed = dates.map(dateStr => {
        const data = byDate[dateStr] || null;
        const { done, total } = computeDayCompletion(dateStr, data);
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        return { dateStr, done, total, pct, hasData: !!data };
      });
      setRows(computed);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="py-2"><SkeletonList count={6} /></div>;
  }

  const colorClasses = {
    green:  { row: 'border-green-100 hover:bg-green-50',  badge: 'bg-green-100 text-green-700',  bar: 'bg-green-500',  label: 'text-green-700' },
    yellow: { row: 'border-yellow-100 hover:bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-400', label: 'text-yellow-700' },
    red:    { row: 'border-red-100 hover:bg-red-50',       badge: 'bg-red-100 text-red-600',       bar: 'bg-red-400',    label: 'text-red-600'   },
  };

  const today = toDateString(new Date());

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 text-center">Past 30 days — click a row to view that day's checklist</p>
      <div className="space-y-2">
        {rows.map(({ dateStr, done, total, pct, hasData }) => {
          const d = fromDateString(dateStr);
          const color = rowColor(pct);
          const c = colorClasses[color];
          const isToday = dateStr === today;
          const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-sm transition-colors text-left ${c.row}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800 truncate">{dayLabel}</span>
                  {isToday && (
                    <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">Today</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                    <div
                      className={`h-full rounded-full transition-all ${c.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${c.label}`}>
                    {`${done}/${total} — ${pct}%`}
                  </span>
                </div>
              </div>
              <div className={`text-[11px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${c.badge}`}>
                {pct}%
              </div>
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: ClipboardList },
    { id: 'history',   label: 'History',   icon: History },
  ];
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
            active === id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DailyPlan() {
  const { user, dbMode } = useAppStore();
  const isManager = canCheck(user);

  const [activeTab, setActiveTab] = useState('checklist');
  const [dateStr, setDateStr] = useState(() => toDateString(new Date()));
  const [loading, setLoading] = useState(false);
  const [pointsState, setPointsState] = useState({});
  const [actionsState, setActionsState] = useState({});

  const handleSelectHistoryDate = (date) => {
    setDateStr(date);
    setActiveTab('checklist');
  };

  const dayData = getActionsForDate(fromDateString(dateStr));

  // ── Real-time subscription via onSnapshot ──
  useEffect(() => {
    let cancelled = false;
    let unsubFn = null;
    setLoading(true);
    setPointsState({});
    setActionsState({});

    subscribeDailyPlan(dateStr, (data) => {
      if (cancelled) return;
      if (data) {
        setPointsState(data.points || {});
        setActionsState(data.actions || {});
      } else {
        setPointsState({});
        setActionsState({});
      }
      setLoading(false);
    }).then(unsub => {
      if (cancelled) {
        // Date changed or component unmounted before promise resolved — detach immediately
        unsub();
      } else {
        unsubFn = unsub;
      }
    });

    return () => {
      cancelled = true;
      if (unsubFn) unsubFn();
    };
  }, [dateStr]);

  // ── Toggle a 5-Point sub-item ──
  const togglePointSubItem = useCallback(async (pointKey, subIndex) => {
    if (!isManager) return;
    const subKey = `${pointKey}_${subIndex}`;
    const prev = pointsState[pointKey]?.subItems?.[subKey] || {};
    const nowChecked = !prev.checked;
    const verifier = nowChecked
      ? { checked: true, checkedBy: user?.name || user?.email || 'Manager', checkedByUid: user?.uid || null, checkedAt: new Date().toISOString() }
      : { checked: false, checkedBy: null, checkedByUid: null, checkedAt: null };

    setPointsState(s => ({
      ...s,
      [pointKey]: {
        ...s[pointKey],
        subItems: {
          ...(s[pointKey]?.subItems || {}),
          [subKey]: verifier,
        },
      },
    }));

    // Write to Firestore — use dot-notation path for merge
    await saveDailyPlanField(
      dateStr,
      `points.${pointKey}.subItems.${subKey}`,
      verifier,
    );
  }, [isManager, pointsState, dateStr, user]);

  // ── Toggle an action item (FOH or BOH) ──
  const toggleAction = useCallback(async (section, itemId) => {
    if (!isManager) return;
    const prev = actionsState?.[section]?.[itemId] || {};
    const nowChecked = !prev.checked;
    const verifier = nowChecked
      ? { checked: true, checkedBy: user?.name || user?.email || 'Manager', checkedByUid: user?.uid || null, checkedAt: new Date().toISOString() }
      : { checked: false, checkedBy: null, checkedByUid: null, checkedAt: null };

    setActionsState(s => ({
      ...s,
      [section]: {
        ...(s[section] || {}),
        [itemId]: verifier,
      },
    }));

    await saveDailyPlanField(
      dateStr,
      `actions.${section}.${itemId}`,
      verifier,
    );
  }, [isManager, actionsState, dateStr, user]);

  // ── Progress counts (7 Actions only — 5 Points are daily reminders, not tracked) ──
  const fohTotal = dayData?.foh?.length || 0;
  const fohDone = dayData?.foh?.filter(item => actionsState?.foh?.[item.id]?.checked).length || 0;
  const bohTotal = dayData?.boh?.length || 0;
  const bohDone = dayData?.boh?.filter(item => actionsState?.boh?.[item.id]?.checked).length || 0;

  const grandTotal = fohTotal + bohTotal;
  const grandDone  = fohDone + bohDone;
  const allDone    = grandTotal > 0 && grandDone === grandTotal;

  // ── Print ──
  const handlePrint = () => {
    const html = buildPrintHtml(dateStr, dayData, pointsState, actionsState);
    openPrintWindow({
      title: '5P7A Daily Plan',
      subtitle: fromDateString(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      html,
    });
  };

  // ── Read-only notice ──
  const readOnlyBanner = !isManager && (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-amber-800">
      <Lock size={14} className="flex-shrink-0" />
      <span>You can view this checklist, but only managers and shift leads can check off tasks.</span>
    </div>
  );

  // ── Summary bar ──
  const summaryBar = (
    <div className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between ${allDone ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100 shadow-sm'}`}>
      <div>
        <p className={`text-sm font-bold ${allDone ? 'text-green-700' : 'text-gray-700'}`}>
          {allDone ? '✓ All tasks complete!' : `${grandDone} of ${grandTotal} tasks complete`}
        </p>
        <p className="text-xs text-gray-400">{dayData?.dayLabel} · 7 Actions</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${allDone ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600">
              {grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const printButton = (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
    >
      <Printer size={16} />
      Print
    </button>
  );

  return (
    <>
      {/* Mobile header */}
      <Header title="5P7A" subtitle="5P7A Checklist" rightIcon={<Printer size={20} />} onRightClick={handlePrint} />

      {/* Desktop header */}
      <DesktopPageHeader title="5P7A Daily Plan" onPrint={handlePrint} />

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Tab bar */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* History view */}
        {activeTab === 'history' && (
          <HistoryView onSelectDate={handleSelectHistoryDate} />
        )}

        {/* Checklist view */}
        {activeTab === 'checklist' && (
          <>
        {/* Date navigator */}
        <DateNav dateStr={dateStr} onChange={setDateStr} />

        {/* Read-only banner */}
        {readOnlyBanner}

        {/* Summary */}
        {summaryBar}

        {/* Loading state */}
        {loading && <SkeletonList count={5} />}

        {!loading && (
          <>
            {/* ── 5 POINTS — Daily Reminders (read-only) ── */}
            <div className="mb-2">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">5 Points — Daily Reminders</h2>

              {FIVE_POINTS.map((pt) => (
                <SectionCard
                  key={pt.key}
                  title={pt.label}
                  badge="5P"
                  color="red"
                  defaultOpen={false}
                >
                  <ul className="px-4 py-2 space-y-1.5">
                    {pt.subItems.map((sub, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {sub}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              ))}
            </div>

            {/* ── 7 ACTIONS ── */}
            {dayData && (
              <div>
                <div className="flex items-center justify-between mb-2 mt-4">
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    7 Actions — {dayData.dayLabel}
                  </h2>
                  <ProgressPill done={fohDone + bohDone} total={fohTotal + bohTotal} label="complete" />
                </div>

                {/* FOH */}
                <SectionCard
                  title="Front of House (FOH)"
                  badge={`${fohDone}/${fohTotal}`}
                  color={fohDone === fohTotal ? 'green' : 'blue'}
                  defaultOpen={true}
                >
                  {dayData.fohTitle && (
                    <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">{dayData.fohTitle}</p>
                    </div>
                  )}
                  {dayData.foh.map(item => {
                    const state = actionsState?.foh?.[item.id] || {};
                    return (
                      <GatedCheckbox
                        key={item.id}
                        checked={!!state.checked}
                        verifiedBy={state.checkedBy}
                        verifiedAt={state.checkedAt}
                        onChange={() => toggleAction('foh', item.id)}
                        readOnly={!isManager}
                        label={item.task}
                      />
                    );
                  })}
                </SectionCard>

                {/* BOH */}
                <SectionCard
                  title="Back of House (BOH)"
                  badge={`${bohDone}/${bohTotal}`}
                  color={bohDone === bohTotal ? 'green' : 'orange'}
                  defaultOpen={true}
                >
                  {dayData.bohTitle && (
                    <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">{dayData.bohTitle}</p>
                    </div>
                  )}
                  {dayData.boh.map(item => {
                    const state = actionsState?.boh?.[item.id] || {};
                    return (
                      <GatedCheckbox
                        key={item.id}
                        checked={!!state.checked}
                        verifiedBy={state.checkedBy}
                        verifiedAt={state.checkedAt}
                        onChange={() => toggleAction('boh', item.id)}
                        readOnly={!isManager}
                        label={item.task}
                      />
                    );
                  })}
                </SectionCard>
              </div>
            )}

            {/* Offline notice */}
            {dbMode !== 'firestore' && (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 mt-4 text-sm text-yellow-800">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>Not connected to cloud — changes won't be saved until you reconnect.</span>
              </div>
            )}
          </>
        )}
          </>
        )}
      </div>
    </>
  );
}
