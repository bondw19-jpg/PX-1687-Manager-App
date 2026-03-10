import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { PhoneMissed, Plus, X, Search, BarChart2 } from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CALL_IN_TYPES = ['Excused', 'Unexcused', 'No-Show'];
const MONTHS = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function LogCallInModal({ onClose, onSave, associates }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const now = format(new Date(), 'HH:mm');
  const [form, setForm] = useState({
    associateId: associates[0]?.id || '',
    associateName: associates[0]?.name || '',
    date: today,
    time: now,
    type: 'Unexcused',
    reason: '',
  });

  const handleAssociateChange = (id) => {
    const assoc = associates.find(a => a.id === id);
    setForm({ ...form, associateId: id, associateName: assoc?.name || '' });
  };

  const handleSave = () => {
    if (!form.associateName) return alert('Select an associate');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">Log Call-In</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Associate *</label>
            {associates.length > 0 ? (
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                value={form.associateId}
                onChange={e => handleAssociateChange(e.target.value)}
              >
                {associates.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            ) : (
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Associate name"
                value={form.associateName}
                onChange={e => setForm({ ...form, associateName: e.target.value })}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Time</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Type</label>
            <div className="flex gap-2">
              {CALL_IN_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.type === t
                      ? t === 'Excused' ? 'bg-green-500 text-white border-green-500'
                        : t === 'No-Show' ? 'bg-red-600 text-white border-red-600'
                        : 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Reason / Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={3}
              placeholder="Reason for call-in..."
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            Log Call-In
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CallIns() {
  const { callIns, addCallIn, deleteCallIn, associates } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('All Months');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const currentMonth = format(new Date(), 'yyyy-MM');
  const totalCallIns = callIns.length;
  const thisMonth = callIns.filter(c => c.date?.startsWith(currentMonth)).length;
  const excusedTotal = callIns.filter(c => c.type === 'Excused').length;
  const unexcusedTotal = callIns.filter(c => c.type !== 'Excused').length;

  const filtered = callIns.filter(c => {
    const matchSearch = c.associateName?.toLowerCase().includes(search.toLowerCase()) ||
      c.date?.includes(search);
    const matchMonth = monthFilter === 'All Months' ||
      c.date?.includes(`-${String(MONTHS.indexOf(monthFilter)).padStart(2, '0')}-`);
    const matchType = typeFilter === 'All Types' || c.type === typeFilter;
    return matchSearch && matchMonth && matchType;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Frequency chart data
  const frequencyMap = {};
  callIns.forEach(c => {
    if (c.associateName) {
      frequencyMap[c.associateName] = (frequencyMap[c.associateName] || 0) + 1;
    }
  });
  const chartData = Object.entries(frequencyMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Call-Ins" onAdd={() => setShowModal(true)} />
      <DesktopPageHeader title="Call-In Tracker" onAdd={() => setShowModal(true)} addLabel="+ Log Call-In" />

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Call-Ins', count: totalCallIns, icon: '📵', bg: 'bg-red-50', color: 'text-red-500' },
            { label: 'This Month', count: thisMonth, icon: '📅', bg: 'bg-orange-50', color: 'text-orange-500' },
            { label: 'Excused Total', count: excusedTotal, icon: '✅', bg: 'bg-green-50', color: 'text-green-500' },
            { label: 'Unexcused Total', count: unexcusedTotal, icon: '❌', bg: 'bg-red-50', color: 'text-red-500' },
          ].map(({ label, count, icon, bg, color }) => (
            <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
              <div className="text-2xl">{icon}</div>
              <div>
                <div className="text-xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
            placeholder="Search by name or date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
          >
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <select
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option>All Types</option>
            {CALL_IN_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Call-In List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center text-gray-400">
            <PhoneMissed size={40} className="mb-3 text-gray-200" />
            <p className="font-medium text-gray-500">No Call-Ins Recorded</p>
            <p className="text-xs mt-1 mb-4">Click "+ Log Call-In" to record a call-in</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <PhoneMissed size={16} /> Log Call-In
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(callIn => (
              <div key={callIn.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {callIn.associateName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{callIn.associateName}</p>
                  <p className="text-xs text-gray-500">{callIn.date} {callIn.time ? `at ${callIn.time}` : ''}</p>
                  {callIn.reason && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{callIn.reason}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    callIn.type === 'Excused' ? 'bg-green-100 text-green-700' :
                    callIn.type === 'No-Show' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {callIn.type}
                  </span>
                  <button
                    onClick={() => deleteCallIn(callIn.id)}
                    className="text-gray-300 hover:text-red-500 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Frequency Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
            <BarChart2 size={18} className="text-primary" />
            Call-In Frequency
          </div>
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No call-in data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#C8102E" />
                  ))}
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
