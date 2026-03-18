import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, RefreshCw, Printer } from 'lucide-react';
import { useAppStore } from '../store/appStore';

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

function emptyRow() {
  return { id: Date.now() + Math.random(), date: '', key: '', details: '' };
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
  const { workFiles, saveWorkFile } = useAppStore();
  const existing = workFiles[associate.id];

  const [rows, setRows] = useState(
    existing?.rows || [emptyRow(), emptyRow(), emptyRow()]
  );

  const addRow = () => setRows(prev => [...prev, emptyRow()]);

  const clearRows = () => {
    if (window.confirm('Clear all rows?')) {
      setRows([emptyRow(), emptyRow(), emptyRow()]);
    }
  };

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSave = () => {
    saveWorkFile(associate.id, { rows, savedAt: new Date().toISOString() });
    alert('Work file saved!');
  };

  const handlePrint = () => {
    // Simple print approach
    const printContent = `
      <html><head><title>Associate Work File</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
        h2 { text-align: center; font-size: 16px; border-bottom: 2px solid #000; padding-bottom: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .info-row { display: flex; gap: 8px; }
        .info-label { font-weight: bold; min-width: 120px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f0f0f0; font-weight: bold; }
        .legend { margin-top: 16px; font-size: 11px; }
        .legend h3 { font-size: 12px; margin-bottom: 4px; }
      </style>
      </head><body>
      <h2>ASSOCIATE WORK FILE</h2>
      <div class="info-grid">
        <div class="info-row"><span class="info-label">Associate's Name:</span><span>${associate.name}</span></div>
        <div class="info-row"><span class="info-label">Employee ID #:</span><span>${associate.employeeId || ''}</span></div>
        <div class="info-row"><span class="info-label">Position / Title:</span><span>${associate.position || ''}</span></div>
        <div class="info-row"><span class="info-label">Telephone:</span><span>${associate.telephone || ''}</span></div>
        <div class="info-row"><span class="info-label">Birthday:</span><span>${associate.birthday || ''}</span></div>
        <div class="info-row"><span class="info-label">Hire Date:</span><span>${associate.hireDate || ''}</span></div>
        <div class="info-row"><span class="info-label">Status:</span><span>${associate.status || ''}</span></div>
      </div>
      <table>
        <thead><tr><th style="width:80px">DATE</th><th style="width:40px">KEY</th><th>TOPICS & DETAILS</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr><td>${r.date}</td><td>${r.key}</td><td>${r.details}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="legend">
        <h3>Key Note Legend:</h3>
        ${KEY_LEGEND.map(k => `<span><b>${k.key}:</b> ${k.desc} &nbsp; </span>`).join('')}
      </div>
      </body></html>
    `;
    const win = window.open('', '_blank');
    win.document.write(printContent);
    win.document.close();
    win.print();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="font-bold text-gray-800">Associate Work File</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
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
                  <div className="border-r border-gray-100 self-stretch">
                    <input
                      className="w-full h-full px-2 py-1.5 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary"
                      placeholder="MM/DD/YY"
                      value={row.date}
                      onChange={e => updateRow(row.id, 'date', e.target.value)}
                    />
                  </div>
                  {/* KEY */}
                  <div className="border-r border-gray-100 self-stretch">
                    <input
                      className="w-full h-full px-2 py-1.5 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary uppercase"
                      placeholder="A-J"
                      maxLength={2}
                      value={row.key}
                      onChange={e => updateRow(row.id, 'key', e.target.value.toUpperCase())}
                    />
                  </div>
                  {/* TOPICS & DETAILS — auto-expanding textarea */}
                  <div className="flex items-start min-h-[32px]">
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
                </div>
              ))}
            </div>

            {/* Table Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={addRow}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus size={14} /> Add Rows
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
        <div className="p-4 border-t border-gray-100 space-y-2">
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
            onClick={handlePrint}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
