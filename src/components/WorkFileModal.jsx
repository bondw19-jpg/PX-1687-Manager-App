import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, RefreshCw, Printer, User, Check } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { openPrintWindow, infoGridHtml, statsRowHtml } from '../lib/printReport';
import { toast, confirmDialog } from '../lib/uiDialog';

const KEY_LEGEND = [
  { key: 'A', desc: 'No call, no show' },
  { key: 'B', desc: 'Call less than 2 hours before shift' },
  { key: 'C', desc: 'Incomplete uniform' },
  { key: 'D', desc: 'Personal hygiene standard' },
  { key: 'E', desc: 'Policy violation' },
  { key: 'F', desc: 'Recurring tardiness' },
  { key: 'G', desc: 'Counseling session' },
  { key: 'H', desc: 'Cash handling issue' },
  { key: 'I', desc: 'Workplace injury' },
  { key: 'J', desc: 'Break violation' },
];

function emptyRow(user) {
  return {
    id: Date.now() + Math.random(),
    date: '',
    key: '',
    details: '',
    addedBy: user ? { uid: user.uid, name: user.name || user.email?.split('@')[0] || 'Unknown' } : null,
  };
}

function fmtDate(d) {
  if (!d) return '';
  const parts = d.split('-');
  if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0].slice(2)}`;
  return d;
}

// Auto-expanding textarea — grows with content, never shows scrollbar
function AutoTextarea({ value, onChange, placeholder, className }) {
  const ref = useRef(null);

  // Resize whenever value changes
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ overflow: 'hidden', minHeight: '28px' }}
    />
  );
}

export default function WorkFileModal({ associate, onClose }) {
  const { workFiles, saveWorkFile, user } = useAppStore();
  const existing = workFiles[associate.id];

  const [rows, setRows] = useState(
    existing?.rows || [emptyRow(user), emptyRow(user), emptyRow(user)]
  );

  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const addRow = () => setRows(prev => [...prev, emptyRow(user)]);

  const clearRows = async () => {
    const ok = await confirmDialog({ title: 'Clear all rows?', confirmText: 'Clear', danger: true });
    if (ok) {
      setRows([emptyRow(user), emptyRow(user), emptyRow(user)]);
    }
  };

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = async (id) => {
    const ok = await confirmDialog({ title: 'Remove this work file row?', message: 'This cannot be undone.', confirmText: 'Remove', danger: true });
    if (ok) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSave = () => {
    saveWorkFile(associate.id, { rows, savedAt: new Date().toISOString() });
    toast('Work file saved!', { type: 'success' });
  };

  // All rows that actually contain an incident (date, key, or details).
  const filledRows = rows.filter(r => r.date || r.key || r.details);
  const allSelected = filledRows.length > 0 && filledRows.every(r => selectedIds.has(r.id));

  const openPrintOptions = () => {
    if (filledRows.length === 0) {
      toast('Add at least one incident before printing.', { type: 'error' });
      return;
    }
    // Default to every incident selected (i.e. "print all").
    setSelectedIds(new Set(filledRows.map(r => r.id)));
    setShowPrintOptions(true);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(filledRows.map(r => r.id)));
  };

  const handleConfirmPrint = () => {
    const toPrint = filledRows.filter(r => selectedIds.has(r.id));
    if (toPrint.length === 0) {
      toast('Select at least one incident to print.', { type: 'error' });
      return;
    }
    setShowPrintOptions(false);
    printRows(toPrint);
  };

  const printRows = (rowsToPrint) => {
    const printedRows = rowsToPrint.filter(r => r.date || r.key || r.details);
    const partial = printedRows.length < filledRows.length;
    // Escape HTML so user text can't break the layout, and preserve line breaks typed into Details.
    const esc = (s) => String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const multiline = (s) => esc(s).replace(/\r?\n/g, '<br>');
    const html = `
      ${infoGridHtml([
        ['Associate Name',  associate.name],
        ['Employee ID',     associate.employeeId || '—'],
        ['Position / Title',associate.position || '—'],
        ['Telephone',       associate.telephone || '—'],
        ['Birthday',        associate.birthday || '—'],
        ['Hire Date',       associate.hireDate || '—'],
        ['Status',          associate.status ? associate.status.charAt(0).toUpperCase() + associate.status.slice(1) : '—'],
        ['Last Saved By',   existing?.savedBy?.name || '—'],
      ])}

      ${statsRowHtml([
        { value: printedRows.length, label: 'Total Entries' },
        { value: printedRows.filter(r => r.key === 'A').length, label: 'No Call No Show' },
        { value: printedRows.filter(r => r.key === 'F').length, label: 'Tardiness' },
        { value: printedRows.filter(r => r.key === 'G').length, label: 'Counseling' },
      ])}

      <h2 class="section-title">Work Log${partial ? ` <span style="font-size:11px;font-weight:normal;color:#888;">(selected incidents — ${printedRows.length} of ${filledRows.length})</span>` : ''}</h2>
      <table>
        <thead>
          <tr>
            <th style="width:90px">DATE</th>
            <th style="width:45px">KEY</th>
            <th>TOPICS &amp; DETAILS</th>
            <th style="width:110px">ADDED BY</th>
          </tr>
        </thead>
        <tbody>
          ${printedRows.map(r => `
            <tr>
              <td>${esc(fmtDate(r.date))}</td>
              <td><strong>${esc(r.key || '')}</strong></td>
              <td style="line-height:1.5; word-break:break-word">${multiline(r.details || '')}</td>
              <td class="sub-label">${esc(r.addedBy?.name || '')}</td>
            </tr>`).join('')}
        </tbody>
      </table>

      <div class="legend">
        <div class="legend-title">Key Note Legend</div>
        <div class="legend-grid">
          ${KEY_LEGEND.map(k => `
            <div class="legend-item">
              <span class="legend-key">${k.key}:</span> ${k.desc}
            </div>`).join('')}
        </div>
      </div>

      <p style="margin-top:14px; font-size:10px; color:#888;">
        Associate signature: _____________________________________________ &nbsp;&nbsp;
        Manager signature: _____________________________________________
      </p>
    `;

    openPrintWindow({
      title:    'Associate Work File',
      subtitle: `${associate.name} — ${associate.position || 'Associate'}`,
      html,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="font-bold text-gray-800">Associate Work File</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Info Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="text-center font-bold text-sm text-gray-800 mb-3 uppercase tracking-wide">
              ASSOCIATE WORK FILE
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Associate's Name:</span>
                <span className="font-medium text-gray-800">{associate.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Employee ID #:</span>
                <span className="font-medium text-gray-800">{associate.employeeId || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Position / Title:</span>
                <span className="font-medium text-gray-800">{associate.position || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Telephone:</span>
                <span className="font-medium text-gray-800">{associate.telephone || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Birthday:</span>
                <span className="font-medium text-gray-800">{associate.birthday || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Hire Date:</span>
                <span className="font-medium text-gray-800">{associate.hireDate || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-xs w-28 flex-shrink-0">Status:</span>
                <span className="font-medium text-gray-800 capitalize">{associate.status || '—'}</span>
              </div>
              {/* Last saved by */}
              {existing?.savedBy?.name && (
                <div className="col-span-2 flex items-center gap-1.5 mt-1 pt-2 border-t border-gray-200">
                  <User size={11} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500">
                    Last saved by <span className="font-semibold text-gray-700">{existing.savedBy.name}</span>
                    {existing.savedAt && (
                      <span className="text-gray-400 ml-1">
                        · {new Date(existing.savedAt).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Key Legend */}
          <div className="p-3 bg-yellow-50 border-b border-yellow-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Key Note and Record:</p>
            <div className="grid grid-cols-2 gap-1">
              {KEY_LEGEND.map(k => (
                <div key={k.key} className="text-xs text-gray-600">
                  <span className="font-bold text-gray-800">{k.key}:</span> {k.desc}
                </div>
              ))}
            </div>
          </div>

          {/* Work Log Table */}
          <div className="p-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[90px_50px_1fr] bg-gray-800 text-white text-xs font-bold">
                <div className="px-2 py-2 border-r border-gray-600">DATE</div>
                <div className="px-2 py-2 border-r border-gray-600">KEY</div>
                <div className="px-2 py-2">TOPICS & DETAILS</div>
              </div>

              {/* Rows */}
              {rows.map((row, idx) => (
                <div key={row.id} className={`grid grid-cols-[90px_50px_1fr] border-t border-gray-100 group items-start ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  {/* DATE */}
                  <div className="border-r border-gray-100 self-stretch relative">
                    <input
                      type="date"
                      className={`w-full px-2 py-1.5 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary ${!row.date ? '[color-scheme:light] text-transparent' : ''}`}
                      value={row.date}
                      onChange={e => updateRow(row.id, 'date', e.target.value)}
                    />
                    {!row.date && (
                      <span className="absolute top-0 left-0 right-0 flex items-center px-2 py-1.5 text-xs text-gray-400 pointer-events-none select-none">
                        MM/DD/YY
                      </span>
                    )}
                  </div>
                  {/* KEY */}
                  <div className="border-r border-gray-100 self-stretch">
                    <input
                      className="w-full px-2 py-1.5 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary uppercase"
                      placeholder="A-J"
                      maxLength={2}
                      value={row.key}
                      onChange={e => updateRow(row.id, 'key', e.target.value.toUpperCase())}
                    />
                  </div>
                  {/* TOPICS & DETAILS */}
                  <div className="flex flex-col min-h-[32px]">
                    <div className="flex items-start flex-1">
                      <AutoTextarea
                        className="flex-1 px-2 py-1.5 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary resize-none leading-relaxed"
                        placeholder="Details..."
                        value={row.details}
                        onChange={e => updateRow(row.id, 'details', e.target.value)}
                      />
                      <button
                        onClick={() => removeRow(row.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 mt-1 text-red-400 hover:text-red-600 transition-opacity mr-1 flex-shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {/* Added by chip */}
                    {row.addedBy?.name && (
                      <div className="flex items-center gap-1 px-2 pb-1">
                        <User size={9} className="text-gray-300 flex-shrink-0" />
                        <span className="text-[10px] text-gray-400 leading-none">{row.addedBy.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Table Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={addRow}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus size={14} /> Add Row
              </button>
              <button
                onClick={clearRows}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw size={14} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold"
            >
              💾 Save
            </button>
          </div>
          <button
            onClick={openPrintOptions}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Print options — choose all incidents or specific dates */}
      {showPrintOptions && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          onClick={e => e.target === e.currentTarget && setShowPrintOptions(false)}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[80dvh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-primary" />
                <h3 className="font-bold text-gray-800">Print Work File</h3>
              </div>
              <button onClick={() => setShowPrintOptions(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Select all toggle */}
            <div className="px-4 pt-3 pb-2 flex-shrink-0">
              <p className="text-xs text-gray-500 mb-2">Choose which incidents to include:</p>
              <button
                onClick={toggleSelectAll}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-semibold ${
                  allSelected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                  allSelected ? 'bg-primary text-white' : 'border-2 border-gray-300'
                }`}>
                  {allSelected && <Check size={14} strokeWidth={3} />}
                </span>
                All incidents ({filledRows.length})
              </button>
            </div>

            {/* Incident list */}
            <div className="px-4 pb-2 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                {filledRows.map(r => {
                  const checked = selectedIds.has(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleSelect(r.id)}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-left ${
                        checked ? 'border-primary/40 bg-primary/5' : 'border-gray-200'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        checked ? 'bg-primary text-white' : 'border-2 border-gray-300'
                      }`}>
                        {checked && <Check size={14} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">
                            {r.date ? fmtDate(r.date) : 'No date'}
                          </span>
                          {r.key && (
                            <span className="text-[10px] font-bold bg-gray-800 text-white rounded px-1.5 py-0.5">
                              {r.key}
                            </span>
                          )}
                        </span>
                        {r.details && (
                          <span className="block text-xs text-gray-500 truncate mt-0.5">{r.details}</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0 flex gap-2">
              <button
                onClick={() => setShowPrintOptions(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPrint}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={selectedIds.size === 0}
              >
                <Printer size={16} /> Print ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
