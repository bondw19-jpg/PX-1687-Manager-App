import React, { useState, useMemo } from 'react';
import { format, subDays, isAfter } from 'date-fns';
import {
  PhoneMissed, Plus, X, Search, BarChart2, User,
  Shield, Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ── Point system ─────────────────────────────────────────────────────────────
export const CALL_IN_TYPES = [
  { label: 'No-Show',    points: 3, color: 'bg-red-600 text-white',     badge: 'bg-red-100 text-red-700'    },
  { label: 'Unexcused',  points: 2, color: 'bg-primary text-white',     badge: 'bg-yellow-100 text-yellow-700' },
  { label: 'Late/Tardy', points: 1, color: 'bg-orange-500 text-white',  badge: 'bg-orange-100 text-orange-700' },
  { label: 'Excused',    points: 0, color: 'bg-green-500 text-white',   badge: 'bg-green-100 text-green-700'  },
];

export const POINTS_BY_TYPE = Object.fromEntries(CALL_IN_TYPES.map(t => [t.label, t.points]));

const MONTHS = ['All Months','January','February','March','April','May','June',
  'July','August','September','October','November','December'];

// 90-day rolling window helper (exported so Associates page can use it)
export function get90DayPoints(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns
    .filter(c => c.associateId === associateId && isAfter(new Date(c.date), cutoff))
    .reduce((sum, c) => sum + (POINTS_BY_TYPE[c.type] ?? 0), 0);
}

export function get90DayCallIns(callIns, associateId) {
  const cutoff = subDays(new Date(), 90);
  return callIns.filter(
    c => c.associateId === associateId && isAfter(new Date(c.date), cutoff)
  );
}

// Color indicator for point total
export function pointsColor(pts) {
  if (pts === 0) return 'text-green-600 bg-green-50 border-green-200';
  if (pts <= 2)  return 'text-green-600 bg-green-50 border-green-200';
  if (pts <= 4)  return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return             'text-red-600 bg-red-50 border-red-200';
}

export function pointsEmoji(pts) {
  if (pts <= 2) return '🟢';
  if (pts <= 4) return '🟡';
  return '🔴';
}

// ── Log Call-In modal ─────────────────────────────────────────────────────────
function LogCallInModal({ onClose, onSave, associates }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const now   = format(new Date(), 'HH:mm');

  const [form, setForm] = useState({
    associateId:   associates[0]?.id   || '',
    associateName: associates[0]?.name || '',
    date:    today,
    time:    now,
    type:    'Unexcused',
    reason:  '',
    covered: '',        // was shift covered?
    coveredBy: '',      // who covered?
  });

  const typeInfo    = CALL_IN_TYPES.find(t => t.label === form.type);
  const pointValue  = typeInfo?.points ?? 0;

  const handleAssocChange = (id) => {
    const a = associates.find(x => x.id === id);
    setForm(f => ({ ...f, associateId: id, associateName: a?.name || '' }));
  };

  const handleSave = () => {
    if (!form.associateName) return alert('Select an associate');
    onSave({ ...form, points: pointValue });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-lg text-gray-800">Log Call-In / Attendance</h2>
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
                {associates.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
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

          {/* Type + point badge */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Attendance Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CALL_IN_TYPES.map(t => (
                <button key={t.label} onClick={() => setForm(f => ({ ...f, type: t.label }))}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    form.type === t.label ? t.color + ' border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200'
                  }`}>
                  {t.label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    form.type === t.label ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {t.points === 0 ? '0 pts' : `+${t.points} pt${t.points > 1 ? 's' : ''}`}
                  </span>
                </button>
              ))}
            </div>
            {/* Point value callout */}
            <div className={`mt-2 rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2 border ${pointsColor(pointValue)}`}>
              <Shield size={13} />
              {pointValue === 0
                ? 'No points — excused absence'
                : `+${pointValue} point${pointValue > 1 ? 's' : ''} added to 90-day total`}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Reason / Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={2} placeholder="Reason for absence or tardiness..."
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
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

          <button onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm">
            Log Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Call-in detail card ───────────────────────────────────────────────────────
function CallInCard({ callIn, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = CALL_IN_TYPES.find(t => t.label === callIn.type) || CALL_IN_TYPES[1];
  const pts = callIn.points ?? POINTS_BY_TYPE[callIn.type] ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
          {callIn.associateName?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-800">{callIn.associateName}</p>
          <p className="text-xs text-gray-500">
            {callIn.date}{callIn.time ? ` · ${callIn.time}` : ''}
          </p>
          {callIn.reason && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{callIn.reason}</p>
          )}
          {callIn.createdBy?.name && (
            <p className="flex items-center gap-1 text-[11px] text-blue-600 mt-0.5 font-medium">
              <User size={10} /> Logged by {callIn.createdBy.name}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.badge}`}>
            {callIn.type}
          </span>
          {pts > 0 && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${pointsColor(pts)}`}>
              +{pts}pt{pts > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 ml-1">
          <button onClick={() => setExpanded(v => !v)} className="text-gray-300 hover:text-gray-500 p-0.5">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onDelete(callIn.id)} className="text-gray-300 hover:text-red-500 p-0.5">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Expanded coverage info */}
      {expanded && (callIn.covered || callIn.coveredBy) && (
        <div className="px-3 pb-3">
          <div className="bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700 border border-blue-100 flex items-center gap-2">
            <CheckCircle2 size={12} />
            <span>
              Shift covered: <strong>{callIn.covered || '—'}</strong>
              {callIn.coveredBy && <> · By <strong>{callIn.coveredBy}</strong></>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Points leaderboard panel ──────────────────────────────────────────────────
function PointsLeaderboard({ callIns, associates }) {
  const rows = useMemo(() => {
    return associates
      .map(a => ({
        name: a.name,
        pts: get90DayPoints(callIns, a.id),
        count: get90DayCallIns(callIns, a.id).length,
      }))
      .filter(r => r.count > 0)
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 8);
  }, [callIns, associates]);

  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
        <Shield size={18} className="text-primary" />
        90-Day Attendance Points
        <span className="ml-auto text-xs text-gray-400 font-normal">Rolling window</span>
      </div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.name} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {r.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-medium text-gray-800 truncate">{r.name}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ml-2 ${pointsColor(r.pts)}`}>
                  {pointsEmoji(r.pts)} {r.pts} pt{r.pts !== 1 ? 's' : ''}
                </span>
              </div>
              {/* Progress bar — 8 pts = full red */}
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    r.pts <= 2 ? 'bg-green-500' : r.pts <= 4 ? 'bg-yellow-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (r.pts / 8) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
        {[['🟢','0–2 pts: OK'],['🟡','3–4 pts: Warning'],['🔴','5+ pts: Critical']].map(([e,l]) => (
          <span key={l} className="text-[10px] text-gray-400 flex items-center gap-1">{e} {l}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CallIns() {
  const { callIns, addCallIn, deleteCallIn, associates } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState('');
  const [monthFilter, setMonthFilter] = useState('All Months');
  const [typeFilter,  setTypeFilter]  = useState('All Types');

  const currentMonth = format(new Date(), 'yyyy-MM');
  const totalCallIns = callIns.length;
  const thisMonth    = callIns.filter(c => c.date?.startsWith(currentMonth)).length;

  // Points totals
  const totalPtsThisMonth = callIns
    .filter(c => c.date?.startsWith(currentMonth))
    .reduce((s, c) => s + (c.points ?? POINTS_BY_TYPE[c.type] ?? 0), 0);

  const noShows = callIns.filter(c => c.type === 'No-Show').length;
  const tardies = callIns.filter(c => c.type === 'Late/Tardy').length;

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

  const filtered = callIns.filter(c => {
    const matchSearch = c.associateName?.toLowerCase().includes(search.toLowerCase()) || c.date?.includes(search);
    const matchMonth  = monthFilter === 'All Months' ||
      c.date?.includes(`-${String(MONTHS.indexOf(monthFilter)).padStart(2, '0')}-`);
    const matchType   = typeFilter === 'All Types' || c.type === typeFilter;
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
      <DesktopPageHeader title="Call-In & Attendance" onAdd={() => setShowModal(true)} addLabel="+ Log Attendance" />

      <div className="p-4 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Logged',    count: totalCallIns,       icon: '📵', bg: 'bg-red-50',    color: 'text-red-500'    },
            { label: 'This Month',      count: thisMonth,           icon: '📅', bg: 'bg-orange-50', color: 'text-orange-500' },
            { label: 'No-Shows',        count: noShows,             icon: '🚫', bg: 'bg-red-50',    color: 'text-red-600'    },
            { label: 'Late / Tardy',    count: tardies,             icon: '⏰', bg: 'bg-yellow-50', color: 'text-yellow-600' },
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
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Points this month</p>
              <p className={`text-xl font-bold ${totalPtsThisMonth >= 5 ? 'text-red-600' : totalPtsThisMonth >= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                {totalPtsThisMonth}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Highest absence day</p>
              <p className="text-xl font-bold text-gray-700">
                {worstDay?.[1] > 0 ? worstDay[0] : '—'}
              </p>
            </div>
          </div>
        )}

        {/* 90-day points leaderboard */}
        <PointsLeaderboard callIns={callIns} associates={associates} />

        {/* Search & Filters */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
            placeholder="Search by name or date..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>All Types</option>
            {CALL_IN_TYPES.map(t => <option key={t.label}>{t.label}</option>)}
          </select>
        </div>

        {/* Call-In list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center text-gray-400">
            <PhoneMissed size={40} className="mb-3 text-gray-200" />
            <p className="font-medium text-gray-500">No Records Found</p>
            <p className="text-xs mt-1 mb-4">Tap "+ Log Attendance" to record a call-in or tardy</p>
            <button onClick={() => setShowModal(true)}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <PhoneMissed size={16} /> Log Attendance
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <CallInCard key={c.id} callIn={c} onDelete={deleteCallIn} />
            ))}
          </div>
        )}

        {/* Frequency chart */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
            <BarChart2 size={18} className="text-primary" /> Call-In Frequency
          </div>
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No call-in data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
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
