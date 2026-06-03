import React from 'react';
import { ChevronDown, Edit3, Trash2, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

// ─── ModalHeader ───────────────────────────────────────────────────────────
export function ModalHeader({ icon, title, subtitle, onClose }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-50 text-primary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
        <X size={20} />
      </button>
    </div>
  );
}

// ─── ModalFooter ───────────────────────────────────────────────────────────
export function ModalFooter({ onClose, submitLabel = 'Save' }) {
  return (
    <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all"
      >
        {submitLabel}
      </button>
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

// ─── TabButton ─────────────────────────────────────────────────────────────
export function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

// ─── UniformCard ───────────────────────────────────────────────────────────
export function UniformCard({ record, associates, onEdit }) {
  const { deleteUniformCheck } = useAppStore();
  const statusMeta = {
    compliant: { label: 'Compliant', color: 'green' },
    open: { label: 'Open Issue', color: 'red' },
    needs_follow_up: { label: 'Follow Up', color: 'yellow' },
    resolved: { label: 'Resolved', color: 'blue' },
  };
  const meta = statusMeta[record.status] || statusMeta.compliant;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-bold text-gray-900">{record.associateName}</p>
          <p className="text-xs text-gray-500">{record.date}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${meta.color}-100 text-${meta.color}-700`}>
          {meta.label}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <p><span className="text-gray-500">Item:</span> {record.item}</p>
        <p><span className="text-gray-500">Issue:</span> {record.issueType}</p>
        {record.sizeRequest && <p><span className="text-gray-500">Request:</span> {record.sizeRequest}</p>}
        {record.actionTaken && <p><span className="text-gray-500">Action:</span> {record.actionTaken}</p>}
        {record.notes && <p><span className="text-gray-500">Notes:</span> {record.notes}</p>}
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(record)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={() => deleteUniformCheck(record.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

// ─── InventoryCard ─────────────────────────────────────────────────────────
export function InventoryCard({ item, managerQty, associateQty, onEdit }) {
  const { deleteUniformInventoryItem } = useAppStore();
  const storeQty = Number(item.onHandQty) || 0;
  const totalInventory = storeQty + managerQty;
  const available = Math.max(0, totalInventory - associateQty);
  const status = available <= 0 ? 'out' : available <= (Number(item.reorderPoint) || 2) ? 'low' : 'ok';
  const statusColor = status === 'out' ? 'red' : status === 'low' ? 'yellow' : 'green';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-bold text-gray-900">{item.item}</p>
          <p className="text-xs text-gray-500">{item.size || 'One Size'} · {item.color}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700`}>
          {status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-xs text-blue-600 font-semibold">Store</p>
          <p className="text-lg font-bold text-blue-700">{storeQty}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <p className="text-xs text-purple-600 font-semibold">Manager</p>
          <p className="text-lg font-bold text-purple-700">{managerQty}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-green-600 font-semibold">Available</p>
          <p className="text-lg font-bold text-green-700">{available}</p>
        </div>
      </div>
      {item.location && <p className="text-xs text-gray-600"><span className="font-semibold">Location:</span> {item.location}</p>}
      {item.notes && <p className="text-xs text-gray-600"><span className="font-semibold">Notes:</span> {item.notes}</p>}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={() => deleteUniformInventoryItem(item.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

// ─── ManagerStockCard ──────────────────────────────────────────────────────
export function ManagerStockCard({ record, inventory = [], managerQtyByInventoryId = {}, associateQtyByInventoryId = {}, onEdit }) {
  const { deleteManagerUniformStock } = useAppStore();

  const invItem = record.inventoryItemId ? inventory.find(i => i.id === record.inventoryItemId) : null;
  const storeQty    = invItem ? (Number(invItem.onHandQty) || 0) : null;
  const managerTotal = invItem ? (managerQtyByInventoryId[invItem.id] || 0) : null;
  const assocTotal  = invItem ? (associateQtyByInventoryId[invItem.id] || 0) : null;
  const available   = invItem ? Math.max(0, storeQty + managerTotal - assocTotal) : null;
  const stockStatus = invItem
    ? (available <= 0 ? 'out' : available <= (Number(invItem.reorderPoint) || 2) ? 'low' : 'ok')
    : null;
  const stockColor  = stockStatus === 'out' ? 'red' : stockStatus === 'low' ? 'yellow' : 'green';
  const stockLabel  = stockStatus === 'out' ? 'Out of Stock' : stockStatus === 'low' ? 'Low Stock' : 'In Stock';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-bold text-gray-900">{record.managerName}</p>
          <p className="text-xs text-gray-500">{record.item} · {record.size || 'One Size'} · {record.color}</p>
        </div>
        <span className="text-lg font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
          {record.qty}
        </span>
      </div>

      {invItem && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inventory Counts</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${stockColor}-100 text-${stockColor}-700`}>
              {stockLabel}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-blue-600 font-semibold leading-none mb-0.5">Store</p>
              <p className="text-lg font-bold text-blue-700">{storeQty}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <p className="text-purple-600 font-semibold leading-none mb-0.5">Mgr Total</p>
              <p className="text-lg font-bold text-purple-700">{managerTotal}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <p className="text-red-500 font-semibold leading-none mb-0.5">Issued</p>
              <p className="text-lg font-bold text-red-600">{assocTotal}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-green-600 font-semibold leading-none mb-0.5">Available</p>
              <p className="text-lg font-bold text-green-700">{available}</p>
            </div>
          </div>
        </div>
      )}

      {!invItem && record.inventoryItemId && (
        <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-lg px-2.5 py-1.5">
          ⚠ Linked inventory item not found — it may have been deleted.
        </p>
      )}
      {!record.inventoryItemId && (
        <p className="text-xs text-gray-400 italic">Not linked to an inventory item</p>
      )}

      {record.location && <p className="text-xs text-gray-600"><span className="font-semibold">Location:</span> {record.location}</p>}
      {record.notes && <p className="text-xs text-gray-600"><span className="font-semibold">Notes:</span> {record.notes}</p>}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(record)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={() => deleteManagerUniformStock(record.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

// ─── AssociateItemCard ─────────────────────────────────────────────────────
export function AssociateItemCard({ record, associates, onEdit }) {
  const { deleteAssociateUniformItem } = useAppStore();
  const statusMeta = {
    active: { label: 'Active / Issued', color: 'green' },
    returned: { label: 'Returned', color: 'blue' },
    needs_replacement: { label: 'Needs Replacement', color: 'yellow' },
    lost: { label: 'Lost / Not Returned', color: 'red' },
  };
  const meta = statusMeta[record.status] || statusMeta.active;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-bold text-gray-900">{record.associateName}</p>
          <p className="text-xs text-gray-500">{record.item} · {record.size || 'One Size'} · {record.color}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${meta.color}-100 text-${meta.color}-700`}>
          {meta.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500 font-semibold">Issued</p>
          <p className="text-gray-900">{record.issuedDate}</p>
        </div>
        {record.returnedDate && (
          <div>
            <p className="text-gray-500 font-semibold">Returned</p>
            <p className="text-gray-900">{record.returnedDate}</p>
          </div>
        )}
      </div>
      {record.notes && <p className="text-xs text-gray-600"><span className="font-semibold">Notes:</span> {record.notes}</p>}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(record)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={() => deleteAssociateUniformItem(record.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
