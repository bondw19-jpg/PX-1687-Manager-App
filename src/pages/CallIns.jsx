import React, { useState, useMemo } from 'react';
import { format, subDays, isAfter, differenceInDays } from 'date-fns';
import {
  PhoneMissed, Plus, X, Search, BarChart2, User,
  Shield, Clock, AlertTriangle, CheckCircle2, ChevronDown,
  FileText, Info, Award, TrendingDown, ChevronRight, Printer, Download
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { openPrintWindow, statsRowHtml, badgeHtml, disciplineColor, printAssociateAttendanceReport } from '../lib/printReport';

// ─────────────────────────────────────────────────────────────────────────────
// PANDA EXPRESS ATTENDANCE POINT SYSTEM
// Effective for Panda Express Store #1687 — Aligned with corporate policy
// Points roll off after 90 days; recovery bonuses at 30 and 60 day streaks
// ─────────────────────────────────────────────────────────────────────────────

// Main category definitions with subcategories and point values
export const PX_ATTENDANCE_POLICY = {
  categories: [
    {
      id: 'tardiness',
      label: 'Tardiness / Late Arrival',
      icon: '⏰',
      color: 'bg-orange-500 text-white',
      badge: 'bg-orange-100 text-orange-700',
      subtypes: [
        { id: 'tardy_minor',    label: 'Minor (1–30 min late)',    points: 0.5 },
        { id: 'tardy_moderate', label: 'Moderate (31–60 min late)', points: 1   },
        { id: 'tardy_severe',   label: 'Severe (60+ min late)',     points: 1.5 },
      ],
    },
    {
      id: 'early_departure',
      label: 'Early Departure',
      icon: '🚪',
      color: 'bg-yellow-500 text-white',
      badge: 'bg-yellow-100 text-yellow-700',
      subtypes: [
        { id: 'early_partial',  label: 'Left early (with notice)',    points: 1 },
        { id: 'early_walkout',  label: 'Left early (without notice)', points: 2 },
      ],
    },
    {
      id: 'absence',
      label: 'Absence / No-Show',
      icon: '🚫',
      color: 'bg-red-600 text-white',
      badge: 'bg-red-100 text-red-700',
      subtypes: [
        { id: 'absence_excused',   label: 'Excused absence (called in)',        points: 1 },
        { id: 'absence_unexcused', label: 'Unexcused absence (no call/no show)',points: 2 },
        { id: 'absence_noshow',    label: 'No-Show (missed, no contact)',        points: 3 },
      ],
    },
    {
      id: 'protected',
      label: 'Protected / Zero-Point',
      icon: '🛡️',
      color: 'bg-green-600 text-white',
      badge: 'bg-green-100 text-green-700',
      subtypes: [
        { id: 'protected_fmla',      label: 'FMLA / Medical Leave',      points: 0 },
        { id: 'protected_jury',      label: 'Jury Duty / Civic Duty',    points: 0 },
        { id: 'protected_military',  label: 'Military Service',           points: 0 },
        { id: 'protected_bereavement', label: 'Bereavement Leave',        points: 0 },
        { id: 'protected_healthcode', label: 'Health Code Related',       points: 0 },
        { id: 'protected_other',     label: 'Other Protected (manager approved)', points: 0 },
      ],
    },
    {
      id: 'emergency',
      label: 'Emergency (With Documentation)',
      icon: '🏥',
      color: 'bg-blue-600 text-white',
      badge: 'bg-blue-100 text-blue-700',
      subtypes: [
        { id: 'emergency_medical',   label: 'Medical Emergency (w/ records)',   points: 0 },
        { id: 'emergency_accident',  label: 'Accident / Police Report',         points: 0 },
        { id: 'emergency_family',    label: 'Family Emergency (documented)',     points: 0 },
        { id: 'emergency_discretion', label: 'Manager Discretion Waiver',       points: 0 },
      ],
    },
  ],
};

// Flat map: subtypeId → { points, label, categoryId, category }
export const SUBTYPE_MAP = {};
PX_ATTENDANCE_POLICY.categories.forEach(cat => {
  cat.subtypes.forEach(sub => {
    SUBTYPE_MAP[sub.id] = { ...sub, categoryId: cat.id, categoryLabel: cat.label, category: cat };
  });
});

// Legacy CALL_IN_TYPES kept for backward compat with existing records
export const CALL_IN_TYPES = [
  { label: 'No-Show',    points: 3, color: 'bg-red-600 text-white',     badge: 'bg-red-100 text-red-700'    },
  { label: 'Unexcused',  points: 2, color: 'bg-primary text-white',     badge: 'bg-yellow-100 text-yellow-700' },
  { label: 'Late/Tardy', points: 1, color: 'bg-orange-500 text-white',  badge: 'bg-orange-100 text-orange-700' },
  { label: 'Excused',    points: 0, color: 'bg-green-500 text-white',   badge: 'bg-green-100 text-green-700'  },
];
export const POINTS_BY_TYPE = Object.fromEntries(CALL_IN_TYPES.map(t => [t.label, t.points]));

const MONTHS = ['All Months','January','February','March','April','May','June',
  'July','August','September','October','November','December'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// Get point value from a call-in record (supports new subtype system + legacy)
export function getCallInPoints(callIn) {
  if (callIn.points !== undefined) return callIn.points;
  if (callIn.subtypeId && SUBTYPE_MAP[callIn.subtypeId]) return SUBTYPE_MAP[callIn.subtypeId].points;
  return POINTS_BY_TYPE[callIn.type] ?? 0;
}

// Get category info for a call-in record
export function getCallInCategory(callIn) {
  if (callIn.categoryId) {
    return PX_ATTENDANCE_POLICY.categories.find(c => c.id === callIn.categoryId);
  }
  // Legacy mapping
  const legacyMap = {
    'No-Show': 'absence', 'Unexcused': 'absence',
    'Late/Tardy': 'tardiness', 'Excused': 'protected',
  };
  return PX_ATTENDANCE_POLICY.categories.find(c => c.id === legacyMap[callIn.type]) || CALL_IN_TYPES[1];
}

// 90-day rolling window — raw sum, no recovery applied
export function get90DayPoints(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns
    .filter(c => c.associateId === associateId && isAfter(new Date(c.date), cutoff))
    .reduce((sum, c) => sum + getCallInPoints(c), 0);
}

export function get90DayCallIns(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns.filter(
    c => c.associateId === associateId && isAfter(new Date(c.date), cutoff)
  );
}

/**
 * getEffectivePoints(callIns, associateId) → number
 *
 * PX Attendance Point Recovery — fully automatic:
 *   - Start with raw 90-day rolling points
 *   - Find the most recent call-in date for this associate
 *   - Count days since that incident (the "clean streak")
 *   - Apply deduction:
 *       60+ days clean → −1.0 pt  (capped at 0)
 *       30–59 days clean → −0.5 pt (capped at 0)
 *       < 30 days clean  → no deduction
 *   - Associates with zero incidents always show 0
 *
 * This function is used everywhere discipline levels, leaderboard,
 * notifications, and work-file triggers are evaluated.
 */
export function getEffectivePoints(callIns, associateId) {
  const recent = get90DayCallIns(callIns, associateId);
  if (recent.length === 0) return 0;

  const rawPts = recent.reduce((sum, c) => sum + getCallInPoints(c), 0);
  if (rawPts <= 0) return 0;

  // Find the most recent incident date
  const lastDate = recent
    .map(c => new Date(c.date))
    .reduce((latest, d) => (d > latest ? d : latest), new Date(0));

  const cleanDays = differenceInDays(new Date(), lastDate);

  let recovery = 0;
  if (cleanDays >= 60) recovery = 1.0;
  else if (cleanDays >= 30) recovery = 0.5;

  return Math.max(0, Math.round((rawPts - recovery) * 10) / 10);
}

/**
 * getCleanStreak(callIns, associateId) → { days, recovery, label }
 * Returns clean-streak info for display in the UI.
 */
export function getCleanStreak(callIns, associateId) {
  const recent = get90DayCallIns(callIns, associateId);
  if (recent.length === 0) return { days: 90, recovery: 0, label: '90+ days clean ✅' };

  const lastDate = recent
    .map(c => new Date(c.date))
    .reduce((latest, d) => (d > latest ? d : latest), new Date(0));

  const days = differenceInDays(new Date(), lastDate);
  let recovery = 0;
  let label = '';

  if (days >= 60) {
    recovery = 1.0;
    label = `${days}-day clean streak → −1.0 pt applied ✅`;
  } else if (days >= 30) {
    recovery = 0.5;
    label = `${days}-day clean streak → −0.5 pt applied ✅`;
  } else if (days > 0) {
    const next = 30 - days;
    label = `${days}-day clean streak · ${next} day${next !== 1 ? 's' : ''} until −0.5 pt recovery`;
  } else {
    label = 'Incident today — recovery streak reset';
  }

  return { days, recovery, label };
}

// Progressive discipline thresholds
export const DISCIPLINE_LEVELS = [
  { min: 0,   max: 1.9, label: 'Good Standing',      color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200', emoji: '✅', action: 'No action required' },
  { min: 2,   max: 3.9, label: 'Coaching',            color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',  emoji: '💬', action: 'Verbal coaching conversation' },
  { min: 4,   max: 5.9, label: 'First Written Warning', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '📋', action: 'Issue First Written Warning' },
  { min: 6,   max: 7.9, label: 'Final Written Warning', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '⚠️', action: 'Issue Final Written Warning' },
  { min: 8,   max: Infinity, label: 'Termination Eligible', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', emoji: '🔴', action: 'Eligible for termination per policy' },
];

export function getDisciplineLevel(pts) {
  return DISCIPLINE_LEVELS.find(d => pts >= d.min && pts <= d.max) || DISCIPLINE_LEVELS[0];
}

// Color/emoji helpers updated for new thresholds
export function pointsColor(pts) {
  const d = getDisciplineLevel(pts);
  return `${d.color} ${d.bg} ${d.border}`;
}

export function pointsEmoji(pts) {
  if (pts < 2)  return '✅';
  if (pts < 4)  return '💬';
  if (pts < 6)  return '📋';
  if (pts < 8)  return '⚠️';
  return '🔴';
}

// ─────────────────────────────────────────────────────────────────────────────
// LOG CALL-IN MODAL — Full PX Policy
// ─────────────────────────────────────────────────────────────────────────────
function LogCallInModal({ onClose, onSave, associates }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const now   = format(new Date(), 'HH:mm');

  const firstCat = PX_ATTENDANCE_POLICY.categories[0];
  const firstSub = firstCat.subtypes[0];

  const [form, setForm] = useState({
    associateId:   associates[0]?.id   || '',
    associateName: associates[0]?.name || '',
    date:    today,
    time:    now,
    categoryId: firstCat.id,
    subtypeId:  firstSub.id,
    reason:  '',
    documentation: '',   // medical record, police report, etc.
    covered:    '',
    coveredBy:  '',
    managerNote: '',
  });

  const category   = PX_ATTENDANCE_POLICY.categories.find(c => c.id === form.categoryId) || firstCat;
  const subtype    = category.subtypes.find(s => s.id === form.subtypeId) || category.subtypes[0];
  const pointValue = subtype.points;
  const discipline = getDisciplineLevel(pointValue);
  const isProtected = category.id === 'protected' || category.id === 'emergency';

  const handleCatChange = (catId) => {
    const cat = PX_ATTENDANCE_POLICY.categories.find(c => c.id === catId);
    setForm(f => ({ ...f, categoryId: catId, subtypeId: cat?.subtypes[0]?.id || '' }));
  };

  const handleAssocChange = (id) => {
    const a = associates.find(x => x.id === id);
    setForm(f => ({ ...f, associateId: id, associateName: a?.name || '' }));
  };

  const handleSave = () => {
    if (!form.associateName) return alert('Select an associate');
    if (!form.categoryId)    return alert('Select an attendance category');
    if (!form.subtypeId)     return alert('Select a specific type');
    onSave({
      ...form,
      points: pointValue,
      // Legacy compat fields
      type: category.id === 'tardiness' ? 'Late/Tardy'
          : category.id === 'protected' || category.id === 'emergency' ? 'Excused'
          : subtype.points >= 3 ? 'No-Show'
          : subtype.points >= 2 ? 'Unexcused'
          : 'Excused',
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[520px] animate-slide-up max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-lg text-gray-800">Log Attendance Event</h2>
            <p className="text-xs text-gray-400">PX Attendance Point System</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4">

          {/* Associate */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Associate *</label>
            {associates.length > 0 ? (
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                value={form.associateId}
                onChange={e => handleAssocChange(e.target.value)}
              >
                {[...associates].sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            ) : (
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Associate name"
                value={form.associateName}
                onChange={e => setForm(f => ({ ...f, associateName: e.target.value }))}
              />
            )}
          </div>

          {/* Date / Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Date</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Time</label>
              <input type="time" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>

          {/* ── STEP 1: Category ── */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Step 1 — Attendance Category *
            </label>
            <div className="grid grid-cols-1 gap-2">
              {PX_ATTENDANCE_POLICY.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCatChange(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm font-medium ${
                    form.categoryId === cat.id
                      ? cat.color + ' border-transparent shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="flex-1">{cat.label}</span>
                  {form.categoryId === cat.id && <ChevronRight size={14} className="opacity-70" />}
                </button>
              ))}
            </div>
          </div>

          {/* ── STEP 2: Subtype ── */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Step 2 — Specific Type *
            </label>
            <div className="space-y-1.5">
              {category.subtypes.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setForm(f => ({ ...f, subtypeId: sub.id }))}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                    form.subtypeId === sub.id
                      ? 'bg-gray-800 text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm">{sub.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-3 flex-shrink-0 ${
                    form.subtypeId === sub.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {sub.points === 0 ? '0 pts' : `+${sub.points} pt${sub.points !== 1 ? 's' : ''}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Point impact callout */}
          <div className={`rounded-xl px-3 py-2.5 text-xs font-medium flex items-start gap-2 border ${
            isProtected ? 'text-green-700 bg-green-50 border-green-200' : `${discipline.color} ${discipline.bg} ${discipline.border}`
          }`}>
            <Shield size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              {isProtected ? (
                <p><strong>0 points</strong> — Protected/emergency category. No points assessed.</p>
              ) : (
                <>
                  <p><strong>+{pointValue} point{pointValue !== 1 ? 's' : ''}</strong> added to 90-day rolling total</p>
                  <p className="mt-0.5 opacity-80">{discipline.emoji} Discipline level: {discipline.label} — {discipline.action}</p>
                </>
              )}
            </div>
          </div>

          {/* Protected/Emergency: documentation required */}
          {isProtected && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <FileText size={13} /> Documentation Required
              </p>
              <p className="text-xs text-blue-600">
                Protected absences require supporting documentation (medical records, court papers, military orders, police report, etc.).
              </p>
              <textarea
                className="w-full border border-blue-200 rounded-xl px-3 py-2 text-sm resize-none bg-white"
                rows={2}
                placeholder="Document type & reference (e.g. 'ER discharge note, dated 2026-03-15')..."
                value={form.documentation}
                onChange={e => setForm(f => ({ ...f, documentation: e.target.value }))}
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Reason / Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={2}
              placeholder="Reason for absence or tardiness..."
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
            />
          </div>

          {/* Manager Note (optional — appears in work file) */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Manager Note (optional)</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={2}
              placeholder="Internal manager notes — context for the record..."
              value={form.managerNote}
              onChange={e => setForm(f => ({ ...f, managerNote: e.target.value }))}
            />
          </div>

          {/* Coverage */}
          <div className="bg-blue-50 rounded-xl p-3 space-y-3 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Shift Coverage
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Was shift covered?</label>
              <div className="flex gap-2">
                {['Yes','No','Partial'].map(v => (
                  <button key={v} onClick={() => setForm(f => ({ ...f, covered: v }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                      form.covered === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'
                    }`}>{v}</button>
                ))}
              </div>
            </div>
            {(form.covered === 'Yes' || form.covered === 'Partial') && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Covered by</label>
                {associates.length > 0 ? (
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                    value={form.coveredBy}
                    onChange={e => setForm(f => ({ ...f, coveredBy: e.target.value }))}
                  >
                    <option value="">— Select associate —</option>
                    {associates
                      .filter(a => a.id !== form.associateId)
                      .map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                ) : (
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    placeholder="Who covered the shift?"
                    value={form.coveredBy}
                    onChange={e => setForm(f => ({ ...f, coveredBy: e.target.value }))}
                  />
                )}
              </div>
            )}
          </div>

          {/* PX Policy Info box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Info size={12} /> PX Attendance Point Recovery
            </p>
            <ul className="text-xs text-gray-500 space-y-0.5">
              <li>• Points expire after <strong>90 days</strong> (rolling window)</li>
              <li>• 30-day incident-free: <strong>−0.5 pt recovery</strong></li>
              <li>• 60-day incident-free: <strong>−1 pt recovery</strong></li>
              <li>• Protected absences (FMLA, jury duty, etc.) = <strong>0 points</strong></li>
            </ul>
          </div>

          <button onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm">
            Log Attendance Event
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALL-IN DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CallInDetailModal({ callIn, onClose, onDelete, associates, allCallIns }) {
  const category = getCallInCategory(callIn);
  const subtype  = callIn.subtypeId ? SUBTYPE_MAP[callIn.subtypeId] : null;
  const pts      = getCallInPoints(callIn);
  const discipline = getDisciplineLevel(pts);
  const isProtected = category?.id === 'protected' || category?.id === 'emergency';

  // Badge props — fall back to legacy type display
  const badgeBg   = category?.badge || 'bg-gray-100 text-gray-700';
  const typeLabel = subtype?.label || callIn.type || 'Unknown';

  const handleDelete = () => {
    if (window.confirm(`Remove this attendance record for ${callIn.associateName}? This cannot be undone.`)) {
      onDelete(callIn.id);
      onClose();
    }
  };

  const handlePrintAssociate = () => {
    const assoc = associates?.find(a => a.id === callIn.associateId)
      || { id: callIn.associateId, name: callIn.associateName, position: '', employeeId: '', hireDate: '', status: 'active' };
    printAssociateAttendanceReport(assoc, allCallIns || []);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[520px] animate-slide-up max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-base text-gray-800">Attendance Record</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintAssociate}
              title="Print associate attendance summary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Printer size={13} /> Associate Report
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">

          {/* Associate + category badges */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {callIn.associateName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-gray-800">{callIn.associateName}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {category && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeBg}`}>
                    {category.icon} {category.label}
                  </span>
                )}
                {pts > 0 ? (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${pointsColor(pts)}`}>
                    +{pts} pt{pts !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-100 text-green-700 border border-green-200">
                    0 pts — Protected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">

            <div className="flex items-start gap-2">
              <Clock size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Date &amp; Time</p>
                <p className="text-sm text-gray-800 font-semibold">
                  {callIn.date}{callIn.time ? ` · ${callIn.time}` : ''}
                </p>
              </div>
            </div>

            {typeLabel && (
              <div className="flex items-start gap-2">
                <Info size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Specific Type</p>
                  <p className="text-sm text-gray-800">{typeLabel}</p>
                </div>
              </div>
            )}

            {callIn.reason && (
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Reason</p>
                  <p className="text-sm text-gray-800">{callIn.reason}</p>
                </div>
              </div>
            )}

            {callIn.documentation && (
              <div className="flex items-start gap-2">
                <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Documentation</p>
                  <p className="text-sm text-gray-800">{callIn.documentation}</p>
                </div>
              </div>
            )}

            {callIn.managerNote && (
              <div className="flex items-start gap-2">
                <Award size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Manager Note</p>
                  <p className="text-sm text-gray-800 italic">{callIn.managerNote}</p>
                </div>
              </div>
            )}

            {callIn.covered && (
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Shift Covered?</p>
                  <p className="text-sm text-gray-800 font-semibold">
                    {callIn.covered}
                    {callIn.coveredBy && <span className="font-normal text-gray-600"> · by {callIn.coveredBy}</span>}
                  </p>
                </div>
              </div>
            )}

            {callIn.createdBy?.name && (
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Logged by</p>
                  <p className="text-sm text-blue-600 font-medium">{callIn.createdBy.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Discipline level callout */}
          <div className={`rounded-xl px-3 py-2.5 text-xs font-medium flex items-start gap-2 border ${
            isProtected ? 'text-green-700 bg-green-50 border-green-200' : `${discipline.color} ${discipline.bg} ${discipline.border}`
          }`}>
            <Shield size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              {isProtected ? (
                <p>Protected absence — <strong>0 points</strong> assessed. Documentation on file.</p>
              ) : (
                <>
                  <p>+{pts} point{pts !== 1 ? 's' : ''} counted toward 90-day rolling total</p>
                  <p className="mt-0.5 opacity-80">
                    {discipline.emoji} <strong>{discipline.label}</strong> — {discipline.action}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Policy callout: point recovery */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5">
              <TrendingDown size={12} /> Point Recovery Reminders
            </p>
            <ul className="text-xs text-gray-400 space-y-0.5">
              <li>• Points expire automatically after 90 days</li>
              <li>• 30-day clean streak → −0.5 pt recovery</li>
              <li>• 60-day clean streak → −1 pt recovery</li>
            </ul>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <X size={16} /> Remove This Record
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALL-IN CARD (tappable)
// ─────────────────────────────────────────────────────────────────────────────
function CallInCard({ callIn, onDelete, associates, allCallIns }) {
  const [showDetail, setShowDetail] = useState(false);
  const category  = getCallInCategory(callIn);
  const subtype   = callIn.subtypeId ? SUBTYPE_MAP[callIn.subtypeId] : null;
  const pts       = getCallInPoints(callIn);
  const discipline = getDisciplineLevel(pts);
  const isProtected = category?.id === 'protected' || category?.id === 'emergency';

  const badgeBg  = category?.badge || 'bg-gray-100 text-gray-700';
  const typeShort = subtype?.label
    ? (subtype.label.length > 28 ? subtype.label.slice(0, 26) + '…' : subtype.label)
    : callIn.type;

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        className="w-full bg-white rounded-xl shadow-sm overflow-hidden text-left active:scale-[0.99] transition-transform hover:shadow-md"
      >
        <div className="flex items-center gap-3 p-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
            {callIn.associateName?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800">{callIn.associateName}</p>
            <p className="text-xs text-gray-500">
              {callIn.date}{callIn.time ? ` · ${callIn.time}` : ''}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{typeShort}</p>
            {callIn.createdBy?.name && (
              <p className="flex items-center gap-1 text-[11px] text-blue-600 mt-0.5 font-medium">
                <User size={10} /> {callIn.createdBy.name}
              </p>
            )}
          </div>

          {/* Right badges */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeBg}`}>
              {category?.icon} {category?.label?.split('/')[0]?.trim() || callIn.type}
            </span>
            {isProtected ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold border bg-green-50 text-green-700 border-green-200">
                0 pts
              </span>
            ) : (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${pointsColor(pts)}`}>
                +{pts}pt{pts !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <ChevronDown size={16} className="text-gray-300 ml-1 flex-shrink-0" />
        </div>
      </button>

      {showDetail && (
        <CallInDetailModal
          callIn={callIn}
          onClose={() => setShowDetail(false)}
          onDelete={onDelete}
          associates={associates}
          allCallIns={allCallIns}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCIPLINE LEGEND PANEL
// ─────────────────────────────────────────────────────────────────────────────
function DisciplineLegend() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Award size={18} className="text-primary" />
          PX Progressive Discipline Scale
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
          {DISCIPLINE_LEVELS.map(d => (
            <div key={d.label} className={`flex items-start gap-3 rounded-xl p-2.5 border ${d.bg} ${d.border}`}>
              <span className="text-lg flex-shrink-0">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${d.color}`}>{d.label}</p>
                <p className="text-xs text-gray-500">{d.min}–{d.max === Infinity ? '8+' : d.max} pts — {d.action}</p>
              </div>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
              <TrendingDown size={12} /> Point Recovery
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                30-day clean streak → <strong>−0.5 pt</strong> recovery bonus
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                60-day clean streak → <strong>−1 pt</strong> recovery bonus
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                All points expire after <strong>90 days</strong> (rolling)
              </li>
            </ul>
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
              <Shield size={12} /> Zero-Point Categories
            </p>
            <p className="text-xs text-gray-500">
              FMLA · Jury Duty · Military · Bereavement · Health Code · Emergency (with documentation) · Manager Discretion Waiver
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSOCIATE ATTENDANCE REPORT PICKER
// Quick-print widget: select an associate → print their personal report
// ─────────────────────────────────────────────────────────────────────────────
function AssociateReportPicker({ associates, callIns, onPrint }) {
  const [selectedId, setSelectedId] = useState('');

  const assoc = associates.find(a => a.id === selectedId);
  const pts   = assoc ? getEffectivePoints(callIns, assoc.id) : null;
  const streak = assoc ? getCleanStreak(callIns, assoc.id) : null;
  const d     = pts !== null ? getDisciplineLevel(pts) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
      <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Download size={16} className="text-primary" />
        Print Associate Attendance Report
      </p>
      <p className="text-xs text-gray-400 mb-3">
        Select an associate to generate a personalized attendance summary they can review and sign.
        Includes their 90-day incidents, current standing, clean streak, and the full discipline scale.
      </p>

      <div className="flex gap-2 items-start">
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
        >
          <option value="">— Select associate —</option>
          {[...associates].sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <button
          onClick={() => assoc && onPrint(assoc)}
          disabled={!assoc}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors flex-shrink-0"
        >
          <Printer size={15} /> Print
        </button>
      </div>

      {/* Preview strip when associate is selected */}
      {assoc && d && (
        <div className={`mt-3 rounded-xl p-3 border flex items-center justify-between gap-3 ${d.bg} ${d.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {assoc.name[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{assoc.name}</p>
              <p className="text-xs text-gray-500">{assoc.position || 'Team Member'}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className={`text-sm font-bold ${d.color}`}>{d.emoji} {pts} pts</span>
            <p className={`text-xs font-medium ${d.color}`}>{d.label}</p>
            {streak && (
              <p className="text-[10px] text-gray-400 mt-0.5">{streak.label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POINTS LEADERBOARD
// ─────────────────────────────────────────────────────────────────────────────
function PointsLeaderboard({ callIns, associates, onPrintAssociate }) {
  const rows = useMemo(() => {
    return associates
      .map(a => {
        const pts   = getEffectivePoints(callIns, a.id);
        const count = get90DayCallIns(callIns, a.id).length;
        return { name: a.name, pts, count, rawPts: get90DayPoints(callIns, a.id), streak: getCleanStreak(callIns, a.id) };
      })
      .filter(r => r.count > 0)
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 10);
  }, [callIns, associates]);

  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
        <Shield size={18} className="text-primary" />
        90-Day Attendance Points
        <span className="ml-auto text-xs text-gray-400 font-normal">Rolling window</span>
      </div>
      <div className="space-y-2.5">
        {rows.map(r => {
          const d = getDisciplineLevel(r.pts);
          const assoc = associates.find(a => a.name === r.name);
          return (
            <div key={r.name} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {r.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-gray-800 truncate">{r.name}</span>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    {onPrintAssociate && assoc && (
                      <button
                        onClick={() => onPrintAssociate(assoc)}
                        title={`Print ${r.name}'s attendance report`}
                        className="p-1 text-gray-400 hover:text-primary hover:bg-red-50 rounded transition-colors"
                      >
                        <Printer size={12} />
                      </button>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${d.color} ${d.bg} ${d.border}`}>
                      {pointsEmoji(r.pts)} {r.pts} pt{r.pts !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {/* Progress bar — 8 pts = critical */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      r.pts < 2 ? 'bg-green-500'
                      : r.pts < 4 ? 'bg-blue-500'
                      : r.pts < 6 ? 'bg-yellow-400'
                      : r.pts < 8 ? 'bg-orange-500'
                      : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(100, (r.pts / 8) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`text-[10px] ${d.color} font-medium`}>{d.emoji} {d.label}</p>
                  {/* Recovery streak indicator */}
                  {r.streak.recovery > 0 ? (
                    <span className="text-[10px] text-green-600 font-semibold">
                      🌿 −{r.streak.recovery} recovery ({r.streak.days}d clean)
                    </span>
                  ) : r.streak.days >= 0 && r.count > 0 ? (
                    <span className="text-[10px] text-gray-400">
                      {r.streak.days}d clean
                    </span>
                  ) : null}
                </div>
                {/* Show raw vs effective when recovery is active */}
                {r.streak.recovery > 0 && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Raw: {r.rawPts} pts → Effective: <strong>{r.pts} pts</strong> after recovery
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Recovery rule reminder */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-1.5 text-[10px] text-gray-400">
        <TrendingDown size={11} className="mt-0.5 text-green-500 shrink-0" />
        <span>
          Recovery: <strong className="text-green-600">−0.5 pt</strong> after 30 clean days ·{' '}
          <strong className="text-green-600">−1.0 pt</strong> after 60 clean days · Applied automatically
        </span>
      </div>
      {/* Legend */}
      <div className="flex gap-2 flex-wrap mt-2 pt-2 border-t border-gray-100">
        {DISCIPLINE_LEVELS.map(d => (
          <span key={d.label} className="text-[10px] text-gray-500 flex items-center gap-1">
            {d.emoji} {d.min}–{d.max === Infinity ? '8+' : d.max}pts: {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CallIns() {
  const { callIns, addCallIn, deleteCallIn, associates } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState('');
  const [monthFilter, setMonthFilter] = useState('All Months');
  const [typeFilter,  setTypeFilter]  = useState('All Types');

  const handlePrint = () => {
    const list = callIns.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalPts = list.reduce((s, c) => s + getCallInPoints(c), 0);
    const noShows  = list.filter(c => c.categoryId === 'absence' || c.type === 'No-Show').length;
    const tardies  = list.filter(c => c.categoryId === 'tardiness' || c.type === 'Late/Tardy').length;
    const protected_ = list.filter(c => c.categoryId === 'protected' || c.categoryId === 'emergency').length;
    const html = `
      ${statsRowHtml([
        { value: list.length,  label: 'Total Records' },
        { value: noShows,      label: 'Absences' },
        { value: tardies,      label: 'Tardiness' },
        { value: protected_,   label: 'Protected (0 pts)' },
        { value: totalPts,     label: 'Total Points' },
      ])}
      <h2 class="section-title">Attendance Log</h2>
      <table>
        <thead><tr>
          <th style="width:90px">Date</th>
          <th>Associate</th>
          <th>Category</th>
          <th>Type / Subtype</th>
          <th style="width:55px">Points</th>
          <th>Reason</th>
          <th style="width:80px">Logged By</th>
        </tr></thead>
        <tbody>
          ${list.map(c => {
            const pts = getCallInPoints(c);
            const cat = getCallInCategory(c);
            const sub = c.subtypeId ? SUBTYPE_MAP[c.subtypeId] : null;
            const dc  = disciplineColor(pts);
            return '<tr>' +
              '<td>' + (c.date || '') + (c.time ? '<br/><span style="font-size:10px;color:#888">' + c.time + '</span>' : '') + '</td>' +
              '<td><strong>' + (c.associateName || '') + '</strong></td>' +
              '<td>' + (cat ? cat.icon + ' ' + cat.label : c.type || '') + '</td>' +
              '<td>' + (sub ? sub.label : c.type || '') + '</td>' +
              '<td>' + badgeHtml((pts === 0 ? '0' : '+' + pts) + ' pts', dc) + '</td>' +
              '<td>' + (c.reason || '') + '</td>' +
              '<td class="sub-label">' + (c.createdBy?.name || '') + '</td>' +
            '</tr>';
          }).join('')}
        </tbody>
      </table>

      <h2 class="section-title">90-Day Points by Associate</h2>
      <table>
        <thead><tr><th>Associate</th><th>90-Day Points</th><th>Incidents</th><th>Discipline Level</th></tr></thead>
        <tbody>
          ${[...associates].sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(a => {
            const pts = getEffectivePoints(callIns, a.id);
            const cnt = get90DayCallIns(callIns, a.id).length;
            if (cnt === 0) return '';
            const d   = getDisciplineLevel(pts);
            return '<tr>' +
              '<td><strong>' + a.name + '</strong></td>' +
              '<td>' + badgeHtml(pts + ' pts', disciplineColor(pts)) + '</td>' +
              '<td>' + cnt + '</td>' +
              '<td>' + d.emoji + ' ' + d.label + '</td>' +
            '</tr>';
          }).join('')}
        </tbody>
      </table>

      <div class="legend">
        <div class="legend-title">Progressive Discipline Scale</div>
        <div class="legend-grid">
          <div class="legend-item">✅ 0–1.9 pts: Good Standing</div>
          <div class="legend-item">💬 2–3.9 pts: Coaching</div>
          <div class="legend-item">📋 4–5.9 pts: First Written Warning</div>
          <div class="legend-item">⚠️ 6–7.9 pts: Final Written Warning</div>
          <div class="legend-item">🔴 8+ pts: Termination Eligible</div>
          <div class="legend-item">🛡️ Protected absences = 0 points</div>
        </div>
      </div>`;
    openPrintWindow({ title: 'Call-In & Attendance Report', subtitle: format(new Date(), 'MMMM yyyy'), html });
  };

  // Per-associate attendance report
  const handlePrintAssociate = (assoc) => {
    printAssociateAttendanceReport(assoc, callIns);
  };

  const currentMonth = format(new Date(), 'yyyy-MM');
  const totalCallIns = callIns.length;
  const thisMonth    = callIns.filter(c => c.date?.startsWith(currentMonth)).length;

  // Points totals (current month)
  const totalPtsThisMonth = callIns
    .filter(c => c.date?.startsWith(currentMonth))
    .reduce((s, c) => s + getCallInPoints(c), 0);

  // Count by broad categories
  const noShows  = callIns.filter(c => c.categoryId === 'absence' || c.type === 'No-Show').length;
  const tardies  = callIns.filter(c => c.categoryId === 'tardiness' || c.type === 'Late/Tardy').length;

  // Day-of-week analysis
  const dayMap = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };
  callIns.forEach(c => {
    if (c.date) {
      const d = new Date(c.date + 'T12:00:00');
      const key = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      dayMap[key]++;
    }
  });
  const worstDay = Object.entries(dayMap).sort((a,b) => b[1]-a[1])[0];

  // All category ids for filter dropdown
  const allCategoryOptions = ['All Types', ...PX_ATTENDANCE_POLICY.categories.map(c => c.id)];

  const filtered = callIns.filter(c => {
    const matchSearch = c.associateName?.toLowerCase().includes(search.toLowerCase()) || c.date?.includes(search);
    const matchMonth  = monthFilter === 'All Months' ||
      c.date?.includes(`-${String(MONTHS.indexOf(monthFilter)).padStart(2, '0')}-`);
    const matchType   = typeFilter === 'All Types'
      || c.categoryId === typeFilter
      || c.type === typeFilter;
    return matchSearch && matchMonth && matchType;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Frequency chart
  const frequencyMap = {};
  callIns.forEach(c => { if (c.associateName) frequencyMap[c.associateName] = (frequencyMap[c.associateName] || 0) + 1; });
  const chartData = Object.entries(frequencyMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Call-Ins" onAdd={() => setShowModal(true)} />
      <DesktopPageHeader title="Call-In & Attendance" onAdd={() => setShowModal(true)} addLabel="+ Log Attendance" onPrint={handlePrint} />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">

        {/* Stats — 2-col mobile, 4-col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Logged',  count: totalCallIns,     icon: '📵', bg: 'bg-red-50'     },
            { label: 'This Month',    count: thisMonth,         icon: '📅', bg: 'bg-orange-50'  },
            { label: 'Absences',      count: noShows,           icon: '🚫', bg: 'bg-red-50'     },
            { label: 'Tardiness',     count: tardies,           icon: '⏰', bg: 'bg-yellow-50'  },
          ].map(({ label, count, icon, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
              <div className="text-2xl">{icon}</div>
              <div>
                <div className="text-xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Insight strip */}
        {callIns.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-3 shadow-sm border text-center ${getDisciplineLevel(totalPtsThisMonth).bg} ${getDisciplineLevel(totalPtsThisMonth).border}`}>
              <p className="text-xs text-gray-400 mb-0.5">Pts this month</p>
              <p className={`text-xl font-bold ${getDisciplineLevel(totalPtsThisMonth).color}`}>
                {totalPtsThisMonth}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Peak absence day</p>
              <p className="text-xl font-bold text-gray-700">
                {worstDay?.[1] > 0 ? worstDay[0] : '—'}
              </p>
            </div>
          </div>
        )}

        {/* Per-associate attendance report picker */}
        <AssociateReportPicker associates={associates} callIns={callIns} onPrint={handlePrintAssociate} />

        {/* 90-day points leaderboard */}
        <PointsLeaderboard callIns={callIns} associates={associates} onPrintAssociate={handlePrintAssociate} />

        {/* Discipline scale (collapsible) */}
        <DisciplineLegend />

        {/* Desktop: left=search+list, right=chart (sticky) */}
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6 space-y-4 lg:space-y-0">
          <div className="space-y-4">

            {/* Search & Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
                  placeholder="Search by name or date..."
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex-shrink-0"
              >
                <Printer size={14} /> Print
              </button>
            </div>
            <div className="flex gap-2">
              <select className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
                value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
              <select className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
                value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All Types">All Types</option>
                {PX_ATTENDANCE_POLICY.categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>

            {/* Call-In list */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center text-gray-400">
                <PhoneMissed size={40} className="mb-3 text-gray-200" />
                <p className="font-medium text-gray-500">No Records Found</p>
                <p className="text-xs mt-1 mb-4">Tap "+ Log Attendance" to record an attendance event</p>
                <button onClick={() => setShowModal(true)}
                  className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <PhoneMissed size={16} /> Log Attendance
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(c => (
                  <CallInCard key={c.id} callIn={c} onDelete={deleteCallIn} associates={associates} allCallIns={callIns} />
                ))}
              </div>
            )}

          </div>{/* end left col */}

          {/* Right col: chart sticky */}
          <div className="space-y-4 lg:sticky lg:top-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                <BarChart2 size={18} className="text-primary" /> Call-In Frequency
              </div>
              {chartData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No call-in data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4,4,0,0]}>
                      {chartData.map((_, i) => <Cell key={i} fill="#C8102E" />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category breakdown chart */}
            {callIns.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-primary" /> Category Breakdown
                </p>
                <div className="space-y-2">
                  {PX_ATTENDANCE_POLICY.categories.map(cat => {
                    const cnt = callIns.filter(c => c.categoryId === cat.id || (
                      !c.categoryId && (
                        (cat.id === 'absence' && (c.type === 'No-Show' || c.type === 'Unexcused')) ||
                        (cat.id === 'tardiness' && c.type === 'Late/Tardy') ||
                        (cat.id === 'protected' && c.type === 'Excused')
                      )
                    )).length;
                    if (cnt === 0) return null;
                    return (
                      <div key={cat.id} className="flex items-center gap-2">
                        <span className="text-sm w-5">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs text-gray-600 truncate">{cat.label}</span>
                            <span className="text-xs font-bold text-gray-800 ml-2">{cnt}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-primary"
                              style={{ width: `${Math.min(100, (cnt / callIns.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>{/* end right col */}
        </div>{/* end desktop grid */}

        <div className="h-4" />
      </div>

      {showModal && (
        <LogCallInModal
          onClose={() => setShowModal(false)}
          onSave={addCallIn}
          associates={associates}
        />
      )}
    </div>
  );
}
