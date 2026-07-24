/**
 * LendBorrow.jsx
 * Store-to-store lend & borrow tracker — PX Store #1687
 *
 * Tracks products lent to or borrowed from other Panda Express stores.
 * Records stay OPEN until settled one of two ways:
 *   💵 Paid Back   — the same product was returned / repaid
 *   🚚 Transferred — resolved through an official store transfer
 *
 * Settling stamps who confirmed it and when. Open records feed the
 * Saturday 8:30 PM inventory reminder in the notification bell.
 */

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  ArrowLeftRight, ArrowUpRight, ArrowDownLeft, Plus, X, Trash2,
  Banknote, Truck, Undo2, Package, Search, Store,
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { toast, confirmDialog } from '../lib/uiDialog';

// ─── meta ─────────────────────────────────────────────────────────────────────

const DIR_META = {
  lent: {
    label: 'Lent Out',
    phrase: 'Lent to',
    badge: 'bg-orange-100 text-orange-700',
    Icon: ArrowUpRight,
  },
  borrowed: {
    label: 'Borrowed',
    phrase: 'Borrowed from',
    badge: 'bg-blue-100 text-blue-700',
    Icon: ArrowDownLeft,
  },
};

const METHOD_META = {
  paid_back:   { label: 'Paid Back',   badge: 'bg-green-100 text-green-700'   },
  transferred: { label: 'Transferred', badge: 'bg-purple-100 text-purple-700' },
};

const itemsSummary = (r) => (r.items || []).map(i => `${i.qty}× ${i.name}`).join(', ');

function fmtDateTime(iso) {
  try { return format(new Date(iso), 'MMM d, h:mm a'); } catch { return ''; }
}

// ─── record card ──────────────────────────────────────────────────────────────

function RecordCard({ r, onSettle, onReopen, onDelete }) {
  const dir    = DIR_META[r.direction] || DIR_META.lent;
  const isOpen = r.status !== 'settled';
  const method = METHOD_META[r.settleMethod];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${dir.badge}`}>
              <dir.Icon size={12} /> {dir.label}
            </span>
            {!isOpen && method && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${method.badge}`}>
                {method.label}
              </span>
            )}
          </div>
          <button
            onClick={() => onDelete(r)}
            title="Delete record"
            className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg flex-shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-gray-900">
          <Store size={15} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{r.otherStore || 'Unknown store'}</span>
        </div>

        <div className="mt-2 space-y-1">
          {(r.items || []).map((it, i) => (
            <div key={i} className="flex items-center justify-between text-sm gap-2">
              <span className="text-gray-700 flex items-center gap-1.5 min-w-0">
                <Package size={13} className="text-gray-300 flex-shrink-0" />
                <span className="truncate">{it.name}</span>
              </span>
              <span className="font-semibold text-gray-800 flex-shrink-0">× {it.qty}</span>
            </div>
          ))}
        </div>

        {r.notes && (
          <p className="text-xs text-gray-400 mt-2 leading-snug">{r.notes}</p>
        )}

        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 flex-wrap">
          <span>{r.date || ''}</span>
          {r.createdBy?.name && <span>· by {r.createdBy.name}</span>}
          {!isOpen && r.settledAt && (
            <span className="text-green-600 font-medium">
              · {method?.label || 'Settled'} {fmtDateTime(r.settledAt)}
              {r.settledBy?.name ? ` by ${r.settledBy.name}` : ''}
            </span>
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <button
            onClick={() => onSettle(r, 'paid_back')}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 active:bg-green-100 hover:bg-green-100 transition-colors"
          >
            <Banknote size={14} /> Paid Back
          </button>
          <button
            onClick={() => onSettle(r, 'transferred')}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 active:bg-purple-100 hover:bg-purple-100 transition-colors"
          >
            <Truck size={14} /> Transferred
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <button
            onClick={() => onReopen(r)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Undo2 size={13} /> Reopen
          </button>
        </div>
      )}
    </div>
  );
}

// ─── add-record bottom sheet ──────────────────────────────────────────────────

function AddRecordModal({ onClose, onSave }) {
  const [direction,  setDirection]  = useState('lent');
  const [otherStore, setOtherStore] = useState('');
  const [date,       setDate]       = useState(format(new Date(), 'yyyy-MM-dd'));
  const [items,      setItems]      = useState([{ name: '', qty: 1 }]);
  const [notes,      setNotes]      = useState('');

  const setItem   = (i, patch) => setItems(arr => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const addRow    = () => setItems(arr => [...arr, { name: '', qty: 1 }]);
  const removeRow = (i) => setItems(arr => (arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr));

  const handleSave = () => {
    const store = otherStore.trim();
    const cleanItems = items
      .map(it => ({ name: (it.name || '').trim(), qty: Number(it.qty) || 0 }))
      .filter(it => it.name);
    if (!store) { toast('Enter the other store (e.g. PX 2301)', { type: 'error' }); return; }
    if (!date)  { toast('Pick a date', { type: 'error' }); return; }
    if (cleanItems.length === 0) { toast('Add at least one product', { type: 'error' }); return; }
    if (cleanItems.some(it => it.qty <= 0)) { toast('Every product needs a quantity', { type: 'error' }); return; }
    onSave({ direction, otherStore: store, date, items: cleanItems, notes: notes.trim() });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <ArrowLeftRight size={18} className="text-primary" /> New Lend / Borrow Record
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body p-4 space-y-4">
          {/* Direction */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">DIRECTION</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('lent')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  direction === 'lent'
                    ? 'bg-orange-50 border-orange-300 text-orange-700'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                <ArrowUpRight size={16} /> We lent out
              </button>
              <button
                type="button"
                onClick={() => setDirection('borrowed')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  direction === 'borrowed'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                <ArrowDownLeft size={16} /> We borrowed
              </button>
            </div>
          </div>

          {/* Other store */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              {direction === 'lent' ? 'LENT TO (STORE)' : 'BORROWED FROM (STORE)'}
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="e.g. PX 2301 — Katy Fwy"
              value={otherStore}
              onChange={e => setOtherStore(e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">DATE</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* Products */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">PRODUCTS</label>
            {items.map((it, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Product (e.g. Orange sauce — case)"
                  value={it.name}
                  onChange={e => setItem(i, { name: e.target.value })}
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center"
                  placeholder="Qty"
                  value={it.qty}
                  onChange={e => setItem(i, { qty: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  disabled={items.length === 1}
                  className="p-2.5 text-gray-300 hover:text-red-500 disabled:opacity-30 rounded-xl flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-primary font-semibold flex items-center gap-1 mt-1"
            >
              <Plus size={14} /> Add another product
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">NOTES (OPTIONAL)</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              placeholder="e.g. They ran out before Saturday rush"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-semibold"
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LendBorrow() {
  const { lendBorrow, addLendBorrow, settleLendBorrow, reopenLendBorrow, deleteLendBorrow } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [view,      setView]      = useState('open'); // 'open' | 'settled'
  const [search,    setSearch]    = useState('');

  const open    = useMemo(() => lendBorrow.filter(r => r.status !== 'settled'), [lendBorrow]);
  const settled = useMemo(() => lendBorrow.filter(r => r.status === 'settled'), [lendBorrow]);

  const openLent     = open.filter(r => r.direction === 'lent').length;
  const openBorrowed = open.filter(r => r.direction === 'borrowed').length;

  const list = useMemo(() => {
    const base = view === 'open' ? open : settled;
    const q = search.trim().toLowerCase();
    const filtered = q
      ? base.filter(r =>
          (r.otherStore || '').toLowerCase().includes(q) ||
          (r.items || []).some(i => (i.name || '').toLowerCase().includes(q)) ||
          (r.notes || '').toLowerCase().includes(q))
      : base;
    return [...filtered].sort((a, b) => {
      const ta = new Date((view === 'settled' ? a.settledAt : a.date) || a.createdAt || 0);
      const tb = new Date((view === 'settled' ? b.settledAt : b.date) || b.createdAt || 0);
      return tb - ta;
    });
  }, [view, open, settled, search]);

  const isSaturday = new Date().getDay() === 6;

  const handleSettle = async (r, method) => {
    const meta = METHOD_META[method];
    const ok = await confirmDialog({
      title: `Mark as ${meta.label}?`,
      message: `${DIR_META[r.direction]?.phrase || ''} ${r.otherStore}: ${itemsSummary(r)}. This settles the record — your name and today's date will be saved.`,
      confirmText: meta.label,
    });
    if (!ok) return;
    settleLendBorrow(r.id, method);
    toast(`Settled — ${meta.label.toLowerCase()}`, { type: 'success' });
  };

  const handleReopen = async (r) => {
    const ok = await confirmDialog({
      title: 'Reopen this record?',
      message: 'It moves back to Open and counts toward the Saturday inventory reminder again.',
      confirmText: 'Reopen',
    });
    if (!ok) return;
    reopenLendBorrow(r.id);
    toast('Record reopened', { type: 'info' });
  };

  const handleDelete = async (r) => {
    const ok = await confirmDialog({
      title: 'Delete this record?',
      message: 'This permanently removes the record for the whole team and cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;
    deleteLendBorrow(r.id);
    toast('Record deleted', { type: 'success' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Lend / Borrow" onAdd={() => setShowModal(true)} />
      <DesktopPageHeader
        title="Lend & Borrow Tracker"
        onAdd={() => setShowModal(true)}
        addLabel="+ New Record"
      />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">

        {/* Saturday inventory banner */}
        {isSaturday && open.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <span className="text-xl leading-none">📦</span>
            <div className="text-xs text-amber-800 leading-snug">
              <span className="font-bold">Inventory tonight at 8:30 PM.</span>{' '}
              {open.length} open record{open.length !== 1 ? 's' : ''} below to account for in the count.
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Lent Out',  count: openLent,       icon: '📤', bg: 'bg-orange-50' },
            { label: 'Borrowed',  count: openBorrowed,   icon: '📥', bg: 'bg-blue-50'   },
            { label: 'Settled',   count: settled.length, icon: '🤝', bg: 'bg-green-50'  },
          ].map(({ label, count, icon, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-2.5`}>
              <div className="text-2xl">{icon}</div>
              <div className="min-w-0">
                <div className="text-xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500 truncate">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1 flex-shrink-0 self-start">
            {['open', 'settled'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {v === 'open' ? `Open (${open.length})` : `Settled (${settled.length})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
              placeholder="Search store or product…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
            <ArrowLeftRight size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">
              {search
                ? 'No records match your search'
                : view === 'open' ? 'No open records' : 'No settled records yet'}
            </p>
            <p className="text-xs mt-1">
              {view === 'open'
                ? 'Tap + to log products lent to or borrowed from another store.'
                : 'Records you settle as paid back or transferred show up here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {list.map(r => (
              <RecordCard
                key={r.id}
                r={r}
                onSettle={handleSettle}
                onReopen={handleReopen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddRecordModal
          onClose={() => setShowModal(false)}
          onSave={(rec) => {
            addLendBorrow(rec);
            setShowModal(false);
            toast('Record added', { type: 'success' });
          }}
        />
      )}
    </div>
  );
}
