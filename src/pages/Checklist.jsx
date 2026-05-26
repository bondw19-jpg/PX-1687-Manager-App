import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import {
  CheckCircle2, Circle, Save, RotateCcw, History, ClipboardCheck,
  Printer, Plus, Trash2, X, Edit3, ChevronRight, ListChecks, User,
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { openPrintWindow, statsRowHtml } from '../lib/printReport';

// ─── Shift Checklist (existing Opening / Mid / Closing) ───────────────────────
const SHIFTS      = ['opening', 'mid', 'closing'];
const SHIFT_LABELS = { opening: 'Opening', mid: 'Mid', closing: 'Closing' };
const SHIFT_ICONS  = { opening: '🌅', mid: '☀️', closing: '🌙' };

function ShiftTab() {
  const { getChecklist, saveChecklist, checklistDefaults, checklists } = useAppStore();
  const [activeShift, setActiveShift] = useState('opening');
  const [view, setView]               = useState('checklist'); // 'checklist' | 'history'
  const today      = format(new Date(), 'yyyy-MM-dd');
  const todayLabel = format(new Date(), 'MMM d, yyyy');
  const [items, setItems] = useState(() => getChecklist(today, 'opening'));

  const loadShift = (shift) => {
    setActiveShift(shift);
    setItems(getChecklist(today, shift));
    setView('checklist');
  };

  const toggle = (id) =>
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));

  const handleSave = () => {
    saveChecklist(today, activeShift, items);
    alert('Checklist saved!');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all items for this shift?')) return;
    const fresh = (checklistDefaults[activeShift] || []).map((text, i) => ({ id: i, text, checked: false }));
    setItems(fresh);
    saveChecklist(today, activeShift, fresh);
  };

  const checked = items.filter(i => i.checked).length;
  const total   = items.length;
  const pct     = total > 0 ? Math.round((checked / total) * 100) : 0;

  const handlePrint = () => {
    const shiftLabel = SHIFT_LABELS[activeShift] || activeShift;
    const html = `
      ${statsRowHtml([
        { value: checked + '/' + total, label: shiftLabel + ' Completed' },
        { value: pct + '%',             label: 'Completion Rate' },
        { value: todayLabel,            label: 'Date' },
      ])}
      <h2 class="section-title">${SHIFT_ICONS[activeShift] || ''} ${shiftLabel} Shift Checklist — ${todayLabel}</h2>
      <table>
        <thead><tr><th style="width:40px">#</th><th>Task</th><th style="width:80px">Status</th></tr></thead>
        <tbody>
          ${items.map((item, i) => '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td style="' + (item.checked ? 'text-decoration:line-through;color:#888' : '') + '">' + item.text + '</td>' +
            '<td>' + (item.checked ? '✅ Done' : '☐ Pending') + '</td>' +
          '</tr>').join('')}
        </tbody>
      </table>
      <p style="margin-top:10px;font-size:11px;color:#888">Manager sign-off: ___________________________________  Date: _________________</p>`;
    openPrintWindow({ title: shiftLabel + ' Shift Checklist', subtitle: todayLabel, html });
  };

  // History
  const historyEntries = Object.entries(checklists)
    .map(([key, its]) => {
      const [date, shift] = key.split('_');
      const cc = its.filter(i => i.checked).length;
      const tc = its.length;
      return { key, date, shift, cc, tc, pct: tc > 0 ? Math.round((cc / tc) * 100) : 0 };
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20);

  return (
    <div className="space-y-4">
      {/* Shift selector */}
      <div className="flex bg-white rounded-xl shadow-sm overflow-hidden">
        {SHIFTS.map(s => (
          <button key={s} onClick={() => loadShift(s)}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeShift === s && view === 'checklist'
                ? 'border-primary text-primary bg-red-50'
                : 'border-transparent text-gray-500'
            }`}>
            {SHIFT_ICONS[s]} {SHIFT_LABELS[s]}
          </button>
        ))}
        <button onClick={() => setView('history')}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            view === 'history' ? 'border-primary text-primary bg-red-50' : 'border-transparent text-gray-500'
          }`}>
          📚 History
        </button>
      </div>

      {view === 'history' ? (
        <div className="space-y-2">
          {historyEntries.length === 0 ? (
            <div className="bg-white rounded-xl p-8 flex flex-col items-center text-gray-400">
              <History size={36} className="mb-3 text-gray-200" />
              <p className="text-sm">No checklist history yet</p>
            </div>
          ) : historyEntries.map(e => (
            <div key={e.key} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="text-xl">{SHIFT_ICONS[e.shift] || '📋'}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{SHIFT_LABELS[e.shift] || e.shift} Shift</p>
                <p className="text-xs text-gray-500">{e.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-gray-800">{e.pct}%</p>
                <p className="text-xs text-gray-500">{e.cc}/{e.tc}</p>
              </div>
              <div className={`w-2 h-8 rounded-full ${e.pct === 100 ? 'bg-green-500' : e.pct >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Shift header card */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={18} className="text-primary" />
                  <h2 className="font-bold text-gray-800">
                    {SHIFT_ICONS[activeShift]} {SHIFT_LABELS[activeShift]} — {todayLabel}
                  </h2>
                </div>
                <p className={`text-sm font-semibold mt-1 ${pct === 100 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-primary'}`}>
                  {checked}/{total} ({pct}%)
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold">
                  <Save size={14} /> Save
                </button>
                <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600">
                  <RotateCcw size={14} /> Reset
                </button>
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600">
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {items.map(item => (
                <button key={item.id} onClick={() => toggle(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all active:bg-gray-50 ${item.checked ? 'bg-green-50/50' : ''}`}>
                  {item.checked
                    ? <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                    : <Circle size={22} className="text-gray-300 flex-shrink-0" />}
                  <span className={`text-sm leading-snug ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <Save size={16} /> Save Checklist
          </button>
          <div className="h-4" />
        </>
      )}
    </div>
  );
}

// ─── Custom Checklist Editor Modal ────────────────────────────────────────────
function CustomChecklistModal({ checklist, onSave, onClose }) {
  const { associates } = useAppStore();
  const isNew = !checklist;
  const [name, setName]       = useState(checklist?.name || '');
  const [items, setItems]     = useState(checklist?.items || []);
  const [assignees, setAssignees] = useState(checklist?.assignees || []);
  const [assignLevel, setAssignLevel] = useState(() => {
    if (!checklist?.assignees?.length) return '';
    if (checklist.assignees.length > 1) return 'All Team';
    return checklist.assignees[0]?.name || '';
  });
  const [newText, setNewText] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const inputRef = useRef(null);

  const assocNames = [...(associates || [])]
    .map(a => a.name || `${a.firstName || ''} ${a.lastName || ''}`.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const handleAssignLevelChange = (val) => {
    setAssignLevel(val);
    if (val === 'All Team') {
      setAssignees(assocNames.map(n => ({ name: n, completed: false })));
    } else if (val) {
      setAssignees([{ name: val, completed: false }]);
    } else {
      setAssignees([]);
    }
  };

  const removeAssignee = (name) =>
    setAssignees(prev => prev.filter(a => a.name !== name));

  const addItem = () => {
    const text = newText.trim();
    if (!text) return;
    setItems(prev => [...prev, {
      id:       `item_${Date.now()}`,
      text,
      checked:  false,
      assignee: newAssignee || '',
    }]);
    setNewText('');
    setNewAssignee('');
    inputRef.current?.focus();
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const updateAssignee = (id, assignee) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, assignee } : i));

  const handleSave = () => {
    if (!name.trim()) return alert('Please enter a checklist name.');
    onSave({
      id:        checklist?.id || `cl_${Date.now()}`,
      name:      name.trim(),
      items,
      assignees,
      createdAt: checklist?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up flex flex-col" style={{ height:'90dvh', maxHeight:'90dvh', overflow:'hidden' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-lg text-gray-800">{isNew ? 'New Checklist' : 'Edit Checklist'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="modal-body p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Checklist Name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="e.g. Weekly Deep Clean, Opening Prep…"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Checklist-level Assign To */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Assign Checklist To</label>
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400 flex-shrink-0" />
              <select
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
                value={assignLevel}
                onChange={e => handleAssignLevelChange(e.target.value)}>
                <option value="">No assignment</option>
                <option value="All Team">⭐ All Team</option>
                {assocNames.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Assignee chips */}
            {assignees.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {assignees.map(a => (
                  <div key={a.name} className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-full">
                    <User size={11} />
                    {a.name}
                    <button
                      onClick={() => removeAssignee(a.name)}
                      className="ml-0.5 text-red-400 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add task row */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tasks <span className="font-normal text-gray-400">(optional)</span></label>
            <div className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Type a task…"
                value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
              />
              <button onClick={addItem}
                className="flex items-center gap-1 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0">
                <Plus size={15} /> Add
              </button>
            </div>
            {/* Per-task assign */}
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400 flex-shrink-0" />
              <select
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
                value={newAssignee}
                onChange={e => setNewAssignee(e.target.value)}>
                <option value="">Assign task to (optional)</option>
                <option value="All Team">⭐ All Team</option>
                {assocNames.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Items list */}
          {items.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">{items.length} task{items.length !== 1 ? 's' : ''}</p>
              {items.map((item, idx) => (
                <div key={item.id} className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-5 text-right flex-shrink-0">{idx + 1}.</span>
                    <span className="flex-1 text-sm text-gray-700">{item.text}</span>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 p-1 flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pl-7">
                    <User size={12} className="text-gray-400 flex-shrink-0" />
                    <select
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 bg-white"
                      value={item.assignee || ''}
                      onChange={e => updateAssignee(item.id, e.target.value)}>
                      <option value="">Unassigned</option>
                      <option value="All Team">⭐ All Team</option>
                      {assocNames.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    {item.assignee && (
                      <span className="text-xs font-semibold text-primary bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        {item.assignee}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm">
            {isNew ? 'Create Checklist' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Checklist Detail (use / check off) ────────────────────────────────
function CustomChecklistDetail({ checklist, onUpdate, onBack }) {
  const [items, setItems]       = useState(checklist.items || []);
  const [assignees, setAssignees] = useState(checklist.assignees || []);
  const checkedItems       = items.filter(i => i.checked).length;
  const completedAssignees = assignees.filter(a => a.completed).length;
  const checked = checkedItems + completedAssignees;
  const total   = items.length + assignees.length;
  const pct     = total > 0 ? Math.round((checked / total) * 100) : 0;

  const toggle = (id) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));

  const toggleAssignee = (name) =>
    setAssignees(prev => prev.map(a => a.name === name ? { ...a, completed: !a.completed } : a));

  const removeAssignee = (name) =>
    setAssignees(prev => prev.filter(a => a.name !== name));

  const resetAll = () => {
    if (!window.confirm('Reset all items?')) return;
    setItems(prev => prev.map(i => ({ ...i, checked: false })));
    setAssignees(prev => prev.map(a => ({ ...a, completed: false })));
  };

  const handleSave = () => {
    onUpdate({ ...checklist, items, assignees });
  };

  const handlePrint = () => {
    const todayLabel = format(new Date(), 'MMM d, yyyy');
    const hasAssignees = items.some(i => i.assignee);
    const html = `
      ${statsRowHtml([
        { value: checked + '/' + total, label: 'Completed' },
        { value: pct + '%',             label: 'Completion Rate' },
        { value: todayLabel,            label: 'Date' },
      ])}
      <h2 class="section-title">📋 ${checklist.name} — ${todayLabel}</h2>
      <table>
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>Task</th>
            ${hasAssignees ? '<th style="width:120px">Assigned To</th>' : ''}
            <th style="width:80px">Status</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, i) => '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td style="' + (item.checked ? 'text-decoration:line-through;color:#888' : '') + '">' + item.text + '</td>' +
            (hasAssignees ? '<td style="font-size:11px;color:#666">' + (item.assignee || '—') + '</td>' : '') +
            '<td>' + (item.checked ? '✅ Done' : '☐ Pending') + '</td>' +
          '</tr>').join('')}
        </tbody>
      </table>
      <p style="margin-top:10px;font-size:11px;color:#888">Manager sign-off: ___________________________________  Date: _________________</p>`;
    openPrintWindow({ title: checklist.name, subtitle: todayLabel, html });
  };

  return (
    <div className="space-y-4">
      {/* Back + title card */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-primary font-semibold mb-3">
          ← Back to Team Checklists
        </button>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks size={18} className="text-primary" />
              <h2 className="font-bold text-gray-800">{checklist.name}</h2>
            </div>
            <p className={`text-sm font-semibold mt-1 ${pct === 100 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-primary'}`}>
              {checked}/{total} ({pct}%)
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold">
              <Save size={14} /> Save
            </button>
            <button onClick={resetAll} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600">
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-primary'}`}
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Assignees completion tracker */}
      {assignees.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
              <User size={13} /> Assigned To
            </p>
            <span className="text-xs text-gray-400">
              {assignees.filter(a => a.completed).length}/{assignees.length} completed
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {assignees.map(a => (
              <div key={a.name} className={`flex items-center gap-3 px-4 py-3 transition-all ${a.completed ? 'bg-green-50/60' : ''}`}>
                <button onClick={() => toggleAssignee(a.name)} className="flex-shrink-0">
                  {a.completed
                    ? <CheckCircle2 size={22} className="text-green-500" />
                    : <Circle size={22} className="text-gray-300" />}
                </button>
                <span className={`flex-1 text-sm font-medium ${a.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {a.name}
                </span>
                {a.completed && (
                  <span className="text-[11px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">Done</span>
                )}
                <button
                  onClick={() => removeAssignee(a.name)}
                  className="p-1 text-gray-300 hover:text-red-500 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      {items.length > 0 && (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {items.map(item => (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all active:bg-gray-50 ${item.checked ? 'bg-green-50/50' : ''}`}>
              <div className="flex-shrink-0 mt-0.5">
                {item.checked
                  ? <CheckCircle2 size={22} className="text-green-500" />
                  : <Circle size={22} className="text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm leading-snug block ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {item.text}
                </span>
                {item.assignee && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary bg-red-50 px-2 py-0.5 rounded-full">
                    <User size={10} /> {item.assignee}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      )}

      <button onClick={handleSave}
        className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
        <Save size={16} /> Save Progress
      </button>
      <div className="h-4" />
    </div>
  );
}

// ─── Team Checklist Tab ────────────────────────────────────────────────────────
function MyChecklistsTab() {
  const { customChecklists, saveCustomChecklist, deleteCustomChecklist } = useAppStore();
  const [modal, setModal]   = useState(null);  // null | 'new' | checklist object (edit)
  const [detail, setDetail] = useState(null);  // checklist object being used

  const handleSave = (cl) => {
    saveCustomChecklist(cl);
    setModal(null);
  };

  const handleUpdate = (cl) => {
    saveCustomChecklist(cl);
    setDetail(cl);
    alert('Saved!');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this checklist?')) return;
    deleteCustomChecklist(id);
    setDetail(null);
  };

  if (detail) {
    return (
      <>
        <CustomChecklistDetail
          checklist={detail}
          onUpdate={handleUpdate}
          onBack={() => setDetail(null)}
        />
        {/* Delete button at bottom */}
        <button onClick={() => handleDelete(detail.id)}
          className="w-full mt-2 border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          <Trash2 size={15} /> Delete This Checklist
        </button>
        <div className="h-4" />
      </>
    );
  }

  return (
    <div className="space-y-3">
      {/* Create button */}
      <button onClick={() => setModal('new')}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold text-sm">
        <Plus size={18} /> Create New Checklist
      </button>

      {customChecklists.length === 0 ? (
        <div className="bg-white rounded-xl p-8 flex flex-col items-center text-gray-400">
          <ListChecks size={36} className="mb-3 text-gray-200" />
          <p className="text-sm font-medium">No team checklists yet</p>
          <p className="text-xs mt-1">Tap "Create New Checklist" to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...customChecklists].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).map(cl => {
            const done  = (cl.items || []).filter(i => i.checked).length;
            const total = (cl.items || []).length;
            const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
            // Collect unique assignees for display
            const assignees = [...new Set((cl.items || []).map(i => i.assignee).filter(Boolean))];
            return (
              <div key={cl.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button onClick={() => setDetail(cl)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ListChecks size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{cl.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-yellow-400' : 'bg-gray-200'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{done}/{total}</span>
                    </div>
                    {assignees.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {assignees.slice(0, 3).map(name => (
                          <span key={name} className="inline-flex items-center gap-0.5 text-xs text-primary bg-red-50 px-1.5 py-0.5 rounded-full">
                            <User size={9} /> {name}
                          </span>
                        ))}
                        {assignees.length > 3 && (
                          <span className="text-xs text-gray-400">+{assignees.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); setModal(cl); }}
                      className="p-1.5 text-gray-400 hover:text-primary rounded-lg">
                      <Edit3 size={15} />
                    </button>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <CustomChecklistModal
          checklist={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ─── Main Checklist Page ──────────────────────────────────────────────────────
export default function Checklist() {
  const [mainTab, setMainTab] = useState('shift'); // 'shift' | 'custom'

  return (
    <div className="min-h-screen bg-background">
      <Header title="Checklist" />
      <DesktopPageHeader title="Checklist" />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">
        {/* Main tabs */}
        <div className="flex bg-white rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => setMainTab('shift')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              mainTab === 'shift' ? 'border-primary text-primary bg-red-50' : 'border-transparent text-gray-500'
            }`}>
            <ClipboardCheck size={16} /> Shift Checklists
          </button>
          <button onClick={() => setMainTab('custom')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              mainTab === 'custom' ? 'border-primary text-primary bg-red-50' : 'border-transparent text-gray-500'
            }`}>
            <ListChecks size={16} /> Team Checklist
          </button>
        </div>

        {mainTab === 'shift' ? <ShiftTab /> : <MyChecklistsTab />}
      </div>
    </div>
  );
}
