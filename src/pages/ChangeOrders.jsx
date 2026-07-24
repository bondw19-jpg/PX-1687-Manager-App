/**
 * ChangeOrders.jsx
 * Loomis change order tracker — PX Store #1687
 *
 * Logs change funds ordered from Loomis: who placed the order, the expected
 * delivery date, the total amount, and the denomination breakdown (bills and
 * coin rolls) that must tally exactly against the total.
 *
 * Orders stay UPCOMING until the drop-off is confirmed as received —
 * confirming stamps who received it and when. Unreceived orders feed the
 * prepare-fund reminders (day before + day of delivery) in the bell.
 */

import React, { useState, useMemo } from 'react';
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import {
  Truck, Banknote, Coins, PackageCheck, Undo2, CalendarDays,
  Plus, X, Trash2, Search,
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { toast, confirmDialog } from '../lib/uiDialog';

// ─── denominations ────────────────────────────────────────────────────────────
// Standard change-order denominations. unitCents keeps all money math in
// integer cents so breakdown totals never drift from float rounding.

const DENOMS = [
  { key: 'twenties',     label: '$20 bills',     group: 'bills', unitCents: 2000 },
  { key: 'tens',         label: '$10 bills',     group: 'bills', unitCents: 1000 },
  { key: 'fives',        label: '$5 bills',      group: 'bills', unitCents: 500  },
  { key: 'ones',         label: '$1 bills',      group: 'bills', unitCents: 100  },
  { key: 'quarterRolls', label: 'Quarter rolls', group: 'coins', unitCents: 1000, sub: '$10 / roll'   },
  { key: 'dimeRolls',    label: 'Dime rolls',    group: 'coins', unitCents: 500,  sub: '$5 / roll'    },
  { key: 'nickelRolls',  label: 'Nickel rolls',  group: 'coins', unitCents: 200,  sub: '$2 / roll'    },
  { key: 'pennyRolls',   label: 'Penny rolls',   group: 'coins', unitCents: 50,   sub: '$0.50 / roll' },
];

export function fmtCents(c) {
  return '$' + ((c || 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: (c || 0) % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function fmtDeliveryDate(d, pattern = 'EEE, MMM d') {
  try { return format(parseISO(d), pattern); } catch { return d || ''; }
}

function fmtDateTime(iso) {
  try { return format(new Date(iso), 'MMM d, h:mm a'); } catch { return ''; }
}

function daysUntilDelivery(o) {
  try { return differenceInCalendarDays(parseISO(o.deliveryDate), new Date()); }
  catch { return null; }
}

// ─── delivery countdown chip ──────────────────────────────────────────────────

function DeliveryChip({ o }) {
  if (o.status === 'received') {
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700 flex items-center gap-1">
        <PackageCheck size={12} /> Received
      </span>
    );
  }
  const days = daysUntilDelivery(o);
  let text = '', cls = 'bg-gray-100 text-gray-600';
  if (days === null)   { text = 'Upcoming'; }
  else if (days < 0)   { text = 'Overdue';  cls = 'bg-red-100 text-red-700'; }
  else if (days === 0) { text = 'Today';    cls = 'bg-amber-100 text-amber-700'; }
  else if (days === 1) { text = 'Tomorrow'; cls = 'bg-amber-100 text-amber-700'; }
  else                 { text = `In ${days} days`; }
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${cls}`}>
      <Truck size={12} /> {text}
    </span>
  );
}

// ─── order card ───────────────────────────────────────────────────────────────

function OrderCard({ o, onReceive, onUndo, onDelete }) {
  const isUpcoming = o.status !== 'received';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <DeliveryChip o={o} />
          <button
            onClick={() => onDelete(o)}
            title="Delete order"
            className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg flex-shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="text-2xl font-bold text-gray-900">{fmtCents(o.amountCents)}</div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
          <CalendarDays size={13} className="text-gray-400 flex-shrink-0" />
          Delivery {fmtDeliveryDate(o.deliveryDate, 'EEE, MMM d, yyyy')}
        </div>

        <div className="mt-2.5 space-y-1">
          {(o.denominations || []).map((d, i) => (
            <div key={i} className="flex items-center justify-between text-sm gap-2">
              <span className="text-gray-700 flex items-center gap-1.5 min-w-0">
                {d.group === 'coins'
                  ? <Coins size={13} className="text-gray-300 flex-shrink-0" />
                  : <Banknote size={13} className="text-gray-300 flex-shrink-0" />}
                <span className="truncate">{d.qty} × {d.label}</span>
              </span>
              <span className="font-semibold text-gray-800 flex-shrink-0">
                {fmtCents(d.qty * d.unitCents)}
              </span>
            </div>
          ))}
        </div>

        {o.notes && (
          <p className="text-xs text-gray-400 mt-2 leading-snug">{o.notes}</p>
        )}

        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 flex-wrap">
          {o.createdBy?.name && <span>Ordered by {o.createdBy.name}</span>}
          {o.createdAt && <span>· {fmtDateTime(o.createdAt)}</span>}
          {!isUpcoming && o.receivedAt && (
            <span className="text-green-600 font-medium">
              · Received {fmtDateTime(o.receivedAt)}
              {o.receivedBy?.name ? ` by ${o.receivedBy.name}` : ''}
            </span>
          )}
        </div>
      </div>

      {isUpcoming ? (
        <div className="px-4 pb-4">
          <button
            onClick={() => onReceive(o)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 active:bg-green-100 hover:bg-green-100 transition-colors"
          >
            <PackageCheck size={14} /> Mark Received
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <button
            onClick={() => onUndo(o)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Undo2 size={13} /> Undo received
          </button>
        </div>
      )}
    </div>
  );
}

// ─── new-order bottom sheet ───────────────────────────────────────────────────

// Strict string-based cents parser — avoids float rounding entirely.
// Accepts up to 7 integer digits and max 2 decimals; returns null if invalid.
function parseCents(str) {
  const s = String(str ?? '').trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(s)) return null;
  const [d, c = ''] = s.split('.');
  return parseInt(d, 10) * 100 + (c ? parseInt(c.padEnd(2, '0'), 10) : 0);
}

function AddOrderModal({ onClose, onSave }) {
  const [amount,       setAmount]       = useState('');
  const [deliveryDate, setDeliveryDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [qtys,         setQtys]         = useState({});
  const [notes,        setNotes]        = useState('');

  const parsedCents = parseCents(amount);
  const totalCents  = parsedCents ?? 0;
  const rows = DENOMS.map(d => ({ ...d, qty: Math.max(0, Math.floor(Number(qtys[d.key]) || 0)) }));
  const breakdownCents = rows.reduce((s, d) => s + d.qty * d.unitCents, 0);
  const matches = totalCents > 0 && breakdownCents === totalCents;
  const diff = breakdownCents - totalCents;

  const setQty = (key, val) => setQtys(q => ({ ...q, [key]: val }));

  const handleSave = () => {
    const filled = rows.filter(d => d.qty > 0);
    if (totalCents <= 0)   { toast('Enter the total order amount', { type: 'error' }); return; }
    if (!deliveryDate)     { toast('Pick the expected delivery date', { type: 'error' }); return; }
    if (filled.length === 0) { toast('Enter the denomination breakdown', { type: 'error' }); return; }
    if (breakdownCents !== totalCents) {
      toast(`Breakdown adds up to ${fmtCents(breakdownCents)} but the total is ${fmtCents(totalCents)} — they must match`, { type: 'error' });
      return;
    }
    onSave({
      amountCents: totalCents,
      denominations: filled.map(({ key, label, group, unitCents, qty }) => ({ key, label, group, unitCents, qty })),
      deliveryDate,
      notes: notes.trim(),
    });
  };

  const renderDenomRows = (group) => rows.filter(d => d.group === group).map(d => (
    <div key={d.key} className="flex items-center gap-2 mb-2">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-700">{d.label}</div>
        {d.sub && <div className="text-[10px] text-gray-400">{d.sub}</div>}
      </div>
      <input
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center"
        placeholder="0"
        value={qtys[d.key] ?? ''}
        onChange={e => setQty(d.key, e.target.value)}
      />
      <div className="w-16 text-right text-xs font-semibold text-gray-500 flex-shrink-0">
        {d.qty > 0 ? fmtCents(d.qty * d.unitCents) : '—'}
      </div>
    </div>
  ));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Truck size={18} className="text-primary" /> New Loomis Change Order
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body p-4 space-y-4">
          {/* Total + delivery date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">TOTAL AMOUNT ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="e.g. 250"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">DELIVERY DATE</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Denominations */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">BILLS</label>
            {renderDenomRows('bills')}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">COIN ROLLS</label>
            {renderDenomRows('coins')}
          </div>

          {/* Live tally */}
          <div className={`rounded-xl px-3 py-2.5 text-xs font-semibold border flex items-center justify-between gap-2 ${
            totalCents <= 0
              ? 'bg-gray-50 border-gray-200 text-gray-500'
              : matches
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <span>Breakdown: {fmtCents(breakdownCents)}</span>
            <span>
              {totalCents <= 0
                ? 'Enter total above'
                : matches
                  ? '✓ Matches total'
                  : `${diff > 0 ? 'Over' : 'Short'} by ${fmtCents(Math.abs(diff))}`}
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">NOTES (OPTIONAL)</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              placeholder="e.g. Extra quarters for weekend rush"
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
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ChangeOrders() {
  const { changeOrders, addChangeOrder, receiveChangeOrder, unreceiveChangeOrder, deleteChangeOrder } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [view,      setView]      = useState('upcoming'); // 'upcoming' | 'past'
  const [search,    setSearch]    = useState('');

  const upcoming = useMemo(() =>
    [...changeOrders.filter(o => o.status !== 'received')]
      .sort((a, b) => (a.deliveryDate || '').localeCompare(b.deliveryDate || '')),
    [changeOrders]);
  const past = useMemo(() =>
    [...changeOrders.filter(o => o.status === 'received')]
      .sort((a, b) => new Date(b.receivedAt || 0) - new Date(a.receivedAt || 0)),
    [changeOrders]);

  const onOrderCents = upcoming.reduce((s, o) => s + (o.amountCents || 0), 0);
  const next = upcoming[0];
  const nextDays = next ? daysUntilDelivery(next) : null;

  const list = useMemo(() => {
    const base = view === 'upcoming' ? upcoming : past;
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(o =>
      (o.notes || '').toLowerCase().includes(q) ||
      (o.createdBy?.name || '').toLowerCase().includes(q) ||
      fmtCents(o.amountCents).toLowerCase().includes(q) ||
      String((o.amountCents || 0) / 100).includes(q) ||
      (o.denominations || []).some(d => (d.label || '').toLowerCase().includes(q)));
  }, [view, upcoming, past, search]);

  const handleReceive = async (o) => {
    const ok = await confirmDialog({
      title: 'Confirm delivery received?',
      message: `${fmtCents(o.amountCents)} change order (delivery ${fmtDeliveryDate(o.deliveryDate, 'MMM d')}). Your name and the time will be saved as confirmation.`,
      confirmText: 'Received',
    });
    if (!ok) return;
    receiveChangeOrder(o.id);
    toast('Delivery confirmed', { type: 'success' });
  };

  const handleUndo = async (o) => {
    const ok = await confirmDialog({
      title: 'Undo received?',
      message: 'The order moves back to Upcoming and the prepare-fund reminders apply again.',
      confirmText: 'Undo',
    });
    if (!ok) return;
    unreceiveChangeOrder(o.id);
    toast('Moved back to upcoming', { type: 'info' });
  };

  const handleDelete = async (o) => {
    const ok = await confirmDialog({
      title: 'Delete this order?',
      message: 'This permanently removes the change order for the whole team and cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;
    deleteChangeOrder(o.id);
    toast('Order deleted', { type: 'success' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Change Orders" onAdd={() => setShowModal(true)} />
      <DesktopPageHeader
        title="Loomis Change Orders"
        onAdd={() => setShowModal(true)}
        addLabel="+ New Order"
      />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">

        {/* Prepare-fund banner */}
        {next && nextDays !== null && nextDays <= 1 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <span className="text-xl leading-none">🚚</span>
            <div className="text-xs text-amber-800 leading-snug">
              <span className="font-bold">
                {nextDays < 0
                  ? 'Delivery date passed — confirm the drop-off below.'
                  : `Loomis arrives ${nextDays === 0 ? 'today' : 'tomorrow'}.`}
              </span>{' '}
              Have the {fmtCents(next.amountCents)} payment fund counted and ready.
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Upcoming',      value: upcoming.length,                                  icon: '🚚', bg: 'bg-amber-50' },
            { label: 'Next Delivery', value: next ? fmtDeliveryDate(next.deliveryDate, 'MMM d') : '—', icon: '📅', bg: 'bg-blue-50'  },
            { label: 'On Order',      value: fmtCents(onOrderCents),                           icon: '💵', bg: 'bg-green-50' },
          ].map(({ label, value, icon, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-2.5`}>
              <div className="text-2xl">{icon}</div>
              <div className="min-w-0">
                <div className="text-xl font-bold text-gray-800 truncate">{value}</div>
                <div className="text-xs text-gray-500 truncate">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1 flex-shrink-0 self-start">
            {['upcoming', 'past'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {v === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
              placeholder="Search amount, notes, denomination…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
            <Truck size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">
              {search
                ? 'No orders match your search'
                : view === 'upcoming' ? 'No upcoming change orders' : 'No past orders yet'}
            </p>
            <p className="text-xs mt-1">
              {view === 'upcoming'
                ? 'Tap + to log a change order placed with Loomis.'
                : 'Orders confirmed as received show up here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {list.map(o => (
              <OrderCard
                key={o.id}
                o={o}
                onReceive={handleReceive}
                onUndo={handleUndo}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddOrderModal
          onClose={() => setShowModal(false)}
          onSave={(order) => {
            addChangeOrder(order);
            setShowModal(false);
            toast('Change order placed', { type: 'success' });
          }}
        />
      )}
    </div>
  );
}
