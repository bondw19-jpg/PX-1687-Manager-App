import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Save, RotateCcw, History, ClipboardCheck } from 'lucide-react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';

const SHIFTS = ['opening', 'mid', 'closing'];
const SHIFT_LABELS = { opening: 'Opening', mid: 'Mid', closing: 'Closing' };
const SHIFT_ICONS = { opening: '🌅', mid: '☀️', closing: '🌙' };

export default function Checklist() {
  const { getChecklist, saveChecklist, checklistDefaults, checklists } = useAppStore();
  const [activeTab, setActiveTab] = useState('opening');
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLabel = format(new Date(), 'MMM d, yyyy');

  const [items, setItems] = useState(() => getChecklist(today, 'opening'));

  const loadShift = (shift) => {
    setActiveTab(shift);
    setItems(getChecklist(today, shift));
  };

  const toggle = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSave = () => {
    saveChecklist(today, activeTab, items);
    alert('Checklist saved!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all items for this shift?')) {
      const defaultItems = checklistDefaults[activeTab] || [];
      const fresh = defaultItems.map((text, i) => ({ id: i, text, checked: false }));
      setItems(fresh);
      saveChecklist(today, activeTab, fresh);
    }
  };

  const checked = items.filter(i => i.checked).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  // History: get saved checklists
  const historyEntries = Object.entries(checklists)
    .map(([key, items]) => {
      const [date, shift] = key.split('_');
      const checkedCount = items.filter(i => i.checked).length;
      const totalCount = items.length;
      return { key, date, shift, checkedCount, totalCount, pct: totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0 };
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Shift Checklist" />

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm overflow-hidden">
          {[...SHIFTS, 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => tab === 'history' ? setActiveTab('history') : loadShift(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-primary text-primary bg-red-50'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab === 'history' ? '📚 History' : `${SHIFT_ICONS[tab]} ${SHIFT_LABELS[tab]}`}
            </button>
          ))}
        </div>

        {activeTab === 'history' ? (
          <div className="space-y-2">
            {historyEntries.length === 0 ? (
              <div className="bg-white rounded-xl p-8 flex flex-col items-center text-gray-400">
                <History size={36} className="mb-3 text-gray-200" />
                <p className="text-sm">No checklist history yet</p>
              </div>
            ) : (
              historyEntries.map(entry => (
                <div key={entry.key} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <div className="text-xl">{SHIFT_ICONS[entry.shift] || '📋'}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">
                      {SHIFT_LABELS[entry.shift] || entry.shift} Shift
                    </p>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-800">{entry.pct}%</p>
                    <p className="text-xs text-gray-500">{entry.checkedCount}/{entry.totalCount}</p>
                  </div>
                  <div className={`w-2 h-8 rounded-full ${
                    entry.pct === 100 ? 'bg-green-500' :
                    entry.pct >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                  }`} />
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Shift Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={18} className="text-primary" />
                    <h2 className="font-bold text-gray-800">
                      {SHIFT_ICONS[activeTab]} {SHIFT_LABELS[activeTab]} Shift — {todayLabel}
                    </h2>
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${
                    pct === 100 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-primary'
                  }`}>
                    {checked}/{total} ({pct}%)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-primary'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all active:bg-gray-50 ${
                      item.checked ? 'bg-green-50/50' : ''
                    }`}
                  >
                    {item.checked ? (
                      <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle size={22} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm leading-snug ${
                      item.checked ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Save */}
            <button
              onClick={handleSave}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Checklist
            </button>

            <div className="h-4" />
          </>
        )}
      </div>
    </div>
  );
}
