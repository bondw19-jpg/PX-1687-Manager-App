import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, Boxes, CheckCircle2, ClipboardCheck, Edit3, Filter,
  PackagePlus, Printer, Search, Shirt, Trash2, UserRound, Warehouse, X
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { badgeHtml, infoGridHtml, openPrintWindow, statsRowHtml } from '../lib/printReport';

const UNIFORM_ITEMS = [
  'Hat / Cap', 'Shirt', 'Apron', 'Name Tag', 'Full Uniform', 'Other'
];

const ISSUE_TYPES = [
  { value: 'compliant', label: 'Compliant' },
  { value: 'incomplete', label: 'Incomplete Uniform' },
  { value: 'missing_item', label: 'Missing Item' },
  { value: 'wrong_item', label: 'Wrong Item / Color' },
  { value: 'damaged', label: 'Damaged / Worn Out' },
  { value: 'hygiene', label: 'Hygiene Standard' },
  { value: 'replacement_needed', label: 'Replacement Needed' },
];

const STATUS_META = {
  compliant: { label: 'Compliant', color: 'green', icon: CheckCircle2, className: 'bg-green-100 text-green-700 border-green-200' },
  open: { label: 'Open Issue', color: 'red', icon: AlertTriangle, className: 'bg-red-100 text-red-700 border-red-200' },
  needs_follow_up: { label: 'Follow Up', color: 'yellow', icon: ClipboardCheck, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  resolved: { label: 'Resolved', color: 'blue', icon: CheckCircle2, className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const STOCK_STATUS = {
  ok: { label: 'In Stock', color: 'green', className: 'bg-green-100 text-green-700 border-green-200' },
  low: { label: 'Low Stock', color: 'yellow', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  out: { label: 'Out of Stock', color: 'red', className: 'bg-red-100 text-red-700 border-red-200' },
};

const ASSOCIATE_ITEM_STATUS = {
  active: { label: 'Active / Issued', color: 'green', className: 'bg-green-100 text-green-700 border-green-200' },
  returned: { label: 'Returned', color: 'blue', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  needs_replacement: { label: 'Needs Replacement', color: 'yellow', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  lost: { label: 'Lost / Not Returned', color: 'red', className: 'bg-red-100 text-red-700 border-red-200' },
};

const ISSUED_ASSOCIATE_STATUSES = ['active', 'needs_replacement', 'lost'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function associateName(associates, id) {
  return associates.find(a => a.id === id)?.name || 'Unassigned';
}

function issueLabel(value) {
  return ISSUE_TYPES.find(i => i.value === value)?.label || value || 'Uniform Check';
}

function associateItemStatusLabel(value) {
  return ASSOCIATE_ITEM_STATUS[value]?.label || value || 'Active / Issued';
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stockStatus(item) {
  const onHand = num(item.onHandQty);
  const reorder = num(item.reorderPoint);
  if (onHand <= 0) return 'out';
  if (reorder > 0 && onHand <= reorder) return 'low';
  return 'ok';
}

function managerNameList(associates, user) {
  const managers = associates
    .filter(a => {
      const haystack = `${a.name || ''} ${a.position || ''} ${a.role || ''} ${a.title || ''}`.toLowerCase();
      return a.status !== 'inactive' && (haystack.includes('manager') || haystack.includes('shift lead') || haystack.includes('pic'));
    })
    .map(a => a.name)
    .filter(Boolean);
  const currentUserName = user?.name || user?.displayName || user?.email?.split('@')[0];
  return Array.from(new Set([currentUserName, ...managers].filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function UniformModal({ record, associates, onClose }) {
  const { addUniformCheck, updateUniformCheck } = useAppStore();
  const [form, setForm] = useState(() => ({
    associateId: record?.associateId || '',
    date: record?.date || todayIso(),
    item: record?.item || 'Full Uniform',
    issueType: record?.issueType || 'compliant',
    status: record?.status || 'compliant',
    sizeRequest: record?.sizeRequest || '',
    actionTaken: record?.actionTaken || '',
    notes: record?.notes || '',
  }));

  const setField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'issueType' && value === 'compliant') next.status = 'compliant';
      if (field === 'issueType' && value !== 'compliant' && prev.status === 'compliant') next.status = 'open';
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.associateId) return alert('Please choose an associate.');
    if (!form.date) return alert('Please choose a check date.');
    const payload = {
      ...form,
      associateName: associateName(associates, form.associateId),
      updatedAt: new Date().toISOString(),
    };
    if (record?.id) updateUniformCheck(record.id, payload);
    else addUniformCheck(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-t-2xl w-full animate-slide-up lg:rounded-2xl lg:max-w-2xl lg:shadow-2xl">
        <ModalHeader icon={<Shirt size={20} />} title={record ? 'Edit Uniform Check' : 'New Uniform Check'} subtitle="Track compliance, replacements, and follow-up." onClose={onClose} />
        <div className="modal-body p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Associate"><select value={form.associateId} onChange={e => setField('associateId', e.target.value)} className="form-select"><option value="">Select associate...</option>{associates.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
            <Field label="Check Date"><input type="date" value={form.date} onChange={e => setField('date', e.target.value)} className="form-input" /></Field>
            <Field label="Uniform Item"><select value={form.item} onChange={e => setField('item', e.target.value)} className="form-select">{UNIFORM_ITEMS.map(item => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Issue Type"><select value={form.issueType} onChange={e => setField('issueType', e.target.value)} className="form-select">{ISSUE_TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
            <Field label="Status"><select value={form.status} onChange={e => setField('status', e.target.value)} className="form-select">{Object.entries(STATUS_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></Field>
            <Field label="Size / Replacement Request"><input value={form.sizeRequest} onChange={e => setField('sizeRequest', e.target.value)} placeholder="Example: Medium shirt, apron, or name tag" className="form-input" /></Field>
          </div>
          <Field label="Action Taken"><input value={form.actionTaken} onChange={e => setField('actionTaken', e.target.value)} placeholder="Example: coached associate, ordered replacement, resolved same day" className="form-input" /></Field>
          <Field label="Notes"><textarea rows={3} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Add manager notes or follow-up details..." className="form-textarea" /></Field>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Uniform Check" />
      </form>
    </div>
  );
}

function InventoryModal({ record, onClose }) {
  const { addUniformInventoryItem, updateUniformInventoryItem } = useAppStore();
  const [form, setForm] = useState(() => ({
    item: record?.item || 'Shirt',
    size: record?.size || '',
    color: record?.color || 'Black',
    onHandQty: record?.onHandQty ?? '',
    reorderPoint: record?.reorderPoint ?? '2',
    location: record?.location || '',
    notes: record?.notes || '',
  }));
  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.item) return alert('Please choose an item.');
    const payload = {
      ...form,
      onHandQty: num(form.onHandQty),
      reorderPoint: num(form.reorderPoint),
      updatedAt: new Date().toISOString(),
    };
    if (record?.id) updateUniformInventoryItem(record.id, payload);
    else addUniformInventoryItem(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-t-2xl w-full animate-slide-up lg:rounded-2xl lg:max-w-xl lg:shadow-2xl">
        <ModalHeader icon={<Boxes size={20} />} title={record ? 'Edit Inventory Item' : 'Add Inventory Item'} subtitle="Track store stock by item, size, and location." onClose={onClose} />
        <div className="modal-body p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Uniform Item"><select value={form.item} onChange={e => setField('item', e.target.value)} className="form-select">{UNIFORM_ITEMS.filter(i => i !== 'Full Uniform').map(item => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Size"><input value={form.size} onChange={e => setField('size', e.target.value)} placeholder="Small, Medium, Large, One Size" className="form-input" /></Field>
            <Field label="Color"><input value={form.color} onChange={e => setField('color', e.target.value)} placeholder="Black, Red, White" className="form-input" /></Field>
            <Field label="On-Hand Qty"><input type="number" min="0" value={form.onHandQty} onChange={e => setField('onHandQty', e.target.value)} className="form-input" /></Field>
            <Field label="Reorder Point"><input type="number" min="0" value={form.reorderPoint} onChange={e => setField('reorderPoint', e.target.value)} className="form-input" /></Field>
            <Field label="Storage Location"><input value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Office cabinet, back room bin" className="form-input" /></Field>
          </div>
          <Field label="Notes"><textarea rows={3} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Vendor, order notes, or manager instructions..." className="form-textarea" /></Field>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Inventory Item" />
      </form>
    </div>
  );
}

function ManagerStockModal({ record, inventory, managers, onClose }) {
  const { addManagerUniformStock, updateManagerUniformStock } = useAppStore();
  const inventoryOptions = inventory.map(item => `${item.item}${item.size ? ' · ' + item.size : ''}${item.color ? ' · ' + item.color : ''}`);
  const [form, setForm] = useState(() => ({
    managerName: record?.managerName || managers[0] || '',
    inventoryItemId: record?.inventoryItemId || '',
    item: record?.item || 'Shirt',
    size: record?.size || '',
    color: record?.color || 'Black',
    qty: record?.qty ?? '',
    location: record?.location || '',
    notes: record?.notes || '',
  }));
  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleInventoryChoice = (id) => {
    const inv = inventory.find(i => i.id === id);
    setForm(prev => ({
      ...prev,
      inventoryItemId: id,
      item: inv?.item || prev.item,
      size: inv?.size || prev.size,
      color: inv?.color || prev.color,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.managerName.trim()) return alert('Please enter or choose a manager.');
    const payload = {
      ...form,
      managerName: form.managerName.trim(),
      qty: num(form.qty),
      updatedAt: new Date().toISOString(),
    };
    if (record?.id) updateManagerUniformStock(record.id, payload);
    else addManagerUniformStock(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-t-2xl w-full animate-slide-up lg:rounded-2xl lg:max-w-xl lg:shadow-2xl">
        <ModalHeader icon={<Warehouse size={20} />} title={record ? 'Edit Manager On-Hand Stock' : 'Assign Manager On-Hand Stock'} subtitle="Show which manager is holding uniform inventory." onClose={onClose} />
        <div className="modal-body p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Manager"><input list="manager-options" value={form.managerName} onChange={e => setField('managerName', e.target.value)} placeholder="Manager name" className="form-input" /><datalist id="manager-options">{managers.map(name => <option key={name} value={name} />)}</datalist></Field>
            <Field label="Link Inventory Item"><select value={form.inventoryItemId} onChange={e => handleInventoryChoice(e.target.value)} className="form-select"><option value="">Manual item...</option>{inventory.map((item, idx) => <option key={item.id} value={item.id}>{inventoryOptions[idx]}</option>)}</select></Field>
            <Field label="Uniform Item"><select value={form.item} onChange={e => setField('item', e.target.value)} className="form-select">{UNIFORM_ITEMS.filter(i => i !== 'Full Uniform').map(item => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Size"><input value={form.size} onChange={e => setField('size', e.target.value)} placeholder="Medium, Large, One Size" className="form-input" /></Field>
            <Field label="Color"><input value={form.color} onChange={e => setField('color', e.target.value)} placeholder="Black, Red, White" className="form-input" /></Field>
            <Field label="Qty On Hand"><input type="number" min="0" value={form.qty} onChange={e => setField('qty', e.target.value)} className="form-input" /></Field>
            <Field label="Where Manager Keeps It"><input value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Locker, office, car kit" className="form-input" /></Field>
          </div>
          <Field label="Notes"><textarea rows={3} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Example: reserved for new hires, received from ACO, needs recount..." className="form-textarea" /></Field>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Manager Stock" />
      </form>
    </div>
  );
}

function AssociateItemModal({ record, associates, inventory, onClose }) {
  const { addAssociateUniformItem, updateAssociateUniformItem } = useAppStore();
  const inventoryOptions = inventory.map(item => `${item.item}${item.size ? ' · ' + item.size : ''}${item.color ? ' · ' + item.color : ''}`);
  const [form, setForm] = useState(() => ({
    associateId: record?.associateId || '',
    issueDate: record?.issueDate || todayIso(),
    inventoryItemId: record?.inventoryItemId || '',
    item: record?.item || 'Shirt',
    size: record?.size || '',
    color: record?.color || 'Black',
    qty: record?.qty ?? '1',
    status: record?.status || 'active',
    returnedDate: record?.returnedDate || '',
    notes: record?.notes || '',
  }));
  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleInventoryChoice = (id) => {
    const inv = inventory.find(i => i.id === id);
    setForm(prev => ({
      ...prev,
      inventoryItemId: id,
      item: inv?.item || prev.item,
      size: inv?.size || prev.size,
      color: inv?.color || prev.color,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.associateId) return alert('Please choose an associate.');
    if (!form.item) return alert('Please choose an item.');
    const payload = {
      ...form,
      associateName: associateName(associates, form.associateId),
      qty: num(form.qty),
      updatedAt: new Date().toISOString(),
    };
    if (record?.id) updateAssociateUniformItem(record.id, payload);
    else addAssociateUniformItem(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-t-2xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-slide-up sm:rounded-2xl sm:max-w-lg lg:max-w-xl lg:shadow-2xl">
        <ModalHeader icon={<UserRound size={20} />} title={record ? 'Edit Associate Uniform Item' : 'Issue Associate Item'} subtitle="Track items an associate currently has." onClose={onClose} compact />
        <div className="modal-body flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Field label="Associate"><select value={form.associateId} onChange={e => setField('associateId', e.target.value)} className="form-select"><option value="">Select associate...</option>{associates.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
            <Field label="Issued Date"><input type="date" value={form.issueDate} onChange={e => setField('issueDate', e.target.value)} className="form-input" /></Field>
            <Field label="Link Inventory Item"><select value={form.inventoryItemId} onChange={e => handleInventoryChoice(e.target.value)} className="form-select"><option value="">Manual item...</option>{inventory.map((item, idx) => <option key={item.id} value={item.id}>{inventoryOptions[idx]}</option>)}</select></Field>
            <Field label="Uniform Item"><select value={form.item} onChange={e => setField('item', e.target.value)} className="form-select">{UNIFORM_ITEMS.filter(i => i !== 'Full Uniform').map(item => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Size"><input value={form.size} onChange={e => setField('size', e.target.value)} placeholder="Small, Medium, Large, One Size" className="form-input" /></Field>
            <Field label="Color"><input value={form.color} onChange={e => setField('color', e.target.value)} placeholder="Black, Red, White" className="form-input" /></Field>
            <Field label="Qty With Associate"><input type="number" min="0" value={form.qty} onChange={e => setField('qty', e.target.value)} className="form-input" /></Field>
            <Field label="Status"><select value={form.status} onChange={e => setField('status', e.target.value)} className="form-select">{Object.entries(ASSOCIATE_ITEM_STATUS).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></Field>
            <Field label="Returned Date"><input type="date" value={form.returnedDate} onChange={e => setField('returnedDate', e.target.value)} className="form-input" /></Field>
          </div>
          <Field label="Notes"><textarea rows={2} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Example: issued at orientation, needs larger shirt, returned after transfer..." className="form-textarea" /></Field>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Associate Item" compact />
      </form>
    </div>
  );
}

function ModalHeader({ icon, title, subtitle, onClose, compact = false }) {
  return (
    <div className={`flex items-center justify-between border-b border-gray-100 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} shrink-0 rounded-xl bg-red-50 text-primary flex items-center justify-center`}>{icon}</div>
        <div className="min-w-0"><h2 className="font-bold text-gray-900 truncate">{title}</h2><p className="text-xs text-gray-500 truncate">{subtitle}</p></div>
      </div>
      <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X size={20} /></button>
    </div>
  );
}

function ModalFooter({ onClose, submitLabel, compact = false }) {
  return <div className={`flex gap-2 border-t border-gray-100 bg-white ${compact ? 'p-3' : 'p-4'}`}><button type="button" onClick={onClose} className={`${compact ? 'py-2.5' : 'py-3'} flex-1 px-4 rounded-xl border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50`}>Cancel</button><button type="submit" className={`${compact ? 'py-2.5' : 'py-3'} flex-1 px-4 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark`}>{submitLabel}</button></div>;
}

function Field({ label, children }) {
  return <label className="text-sm font-semibold text-gray-700 block">{label}<div className="mt-1">{children}</div></label>;
}

function StatCard({ label, value, tone = 'gray' }) {
  const tones = {
    gray: 'bg-white border-gray-200 text-gray-900', green: 'bg-green-50 border-green-100 text-green-800',
    red: 'bg-red-50 border-red-100 text-red-800', yellow: 'bg-yellow-50 border-yellow-100 text-yellow-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800', purple: 'bg-purple-50 border-purple-100 text-purple-800',
  };
  return <div className={`rounded-2xl border p-4 shadow-sm ${tones[tone]}`}><div className="text-2xl font-bold">{value}</div><div className="text-xs font-semibold uppercase tracking-wide opacity-70 mt-1">{label}</div></div>;
}

function TabButton({ active, onClick, children }) {
  return <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{children}</button>;
}

function UniformCard({ record, associates, onEdit }) {
  const { deleteUniformCheck } = useAppStore();
  const meta = STATUS_META[record.status] || STATUS_META.open;
  const Icon = meta.icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3 min-w-0"><div className="w-10 h-10 rounded-xl bg-red-50 text-primary flex items-center justify-center flex-shrink-0"><Shirt size={20} /></div><div className="min-w-0"><h3 className="font-bold text-gray-900 truncate">{record.associateName || associateName(associates, record.associateId)}</h3><p className="text-xs text-gray-500">{record.date || 'No date'} · {record.item || 'Uniform'}</p></div></div><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold ${meta.className}`}><Icon size={12} /> {meta.label}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Issue</div><div className="font-semibold text-gray-800">{issueLabel(record.issueType)}</div></div><div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Request</div><div className="font-semibold text-gray-800">{record.sizeRequest || '—'}</div></div></div>
      {(record.actionTaken || record.notes) && <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm text-gray-700">{record.actionTaken && <p><span className="font-semibold">Action:</span> {record.actionTaken}</p>}{record.notes && <p className="mt-1"><span className="font-semibold">Notes:</span> {record.notes}</p>}</div>}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400"><span>{record.createdBy?.name ? `Logged by ${record.createdBy.name}` : 'Uniform check'}</span><div className="flex items-center gap-2"><button onClick={() => onEdit(record)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-red-50"><Edit3 size={16} /></button><button onClick={() => window.confirm('Delete this uniform check?') && deleteUniformCheck(record.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div>
    </div>
  );
}

function InventoryCard({ item, managerQty, associateQty, onEdit }) {
  const { deleteUniformInventoryItem } = useAppStore();
  const status = stockStatus(item);
  const meta = STOCK_STATUS[status];
  const available = Math.max(0, num(item.onHandQty) - num(managerQty) - num(associateQty));
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center"><Boxes size={20} /></div><div><h3 className="font-bold text-gray-900">{item.item}</h3><p className="text-xs text-gray-500">{[item.size, item.color, item.location].filter(Boolean).join(' · ') || 'No size/location'}</p></div></div><span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${meta.className}`}>{meta.label}</span></div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center"><div className="rounded-xl bg-gray-50 border border-gray-100 p-2"><div className="text-lg font-bold text-gray-900">{num(item.onHandQty)}</div><div className="text-[10px] uppercase font-bold text-gray-400">Store Qty</div></div><div className="rounded-xl bg-purple-50 border border-purple-100 p-2"><div className="text-lg font-bold text-purple-800">{num(managerQty)}</div><div className="text-[10px] uppercase font-bold text-purple-500">With Mgrs</div></div><div className="rounded-xl bg-red-50 border border-red-100 p-2"><div className="text-lg font-bold text-red-800">{num(associateQty)}</div><div className="text-[10px] uppercase font-bold text-red-500">Issued</div></div><div className="rounded-xl bg-green-50 border border-green-100 p-2"><div className="text-lg font-bold text-green-800">{available}</div><div className="text-[10px] uppercase font-bold text-green-500">Available</div></div></div>
      {item.notes && <p className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm text-gray-700">{item.notes}</p>}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400"><span>Reorder at {num(item.reorderPoint)}</span><div className="flex gap-2"><button onClick={() => onEdit(item)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-red-50"><Edit3 size={16} /></button><button onClick={() => window.confirm('Delete this inventory item?') && deleteUniformInventoryItem(item.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div>
    </div>
  );
}

function ManagerStockCard({ record, onEdit }) {
  const { deleteManagerUniformStock } = useAppStore();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center"><Warehouse size={20} /></div><div><h3 className="font-bold text-gray-900">{record.managerName}</h3><p className="text-xs text-gray-500">{[record.item, record.size, record.color].filter(Boolean).join(' · ')}</p></div></div><span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-1 text-[11px] font-bold text-purple-700">Qty {num(record.qty)}</span></div>
      <div className="mt-3 text-sm text-gray-700"><p><span className="font-semibold">Location:</span> {record.location || 'Not specified'}</p>{record.notes && <p className="mt-1"><span className="font-semibold">Notes:</span> {record.notes}</p>}</div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400"><span>{record.updatedAt ? `Updated ${new Date(record.updatedAt).toLocaleDateString()}` : 'Manager on-hand stock'}</span><div className="flex gap-2"><button onClick={() => onEdit(record)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-red-50"><Edit3 size={16} /></button><button onClick={() => window.confirm('Delete this manager stock record?') && deleteManagerUniformStock(record.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div>
    </div>
  );
}

function AssociateItemCard({ record, associates, onEdit }) {
  const { deleteAssociateUniformItem } = useAppStore();
  const meta = ASSOCIATE_ITEM_STATUS[record.status] || ASSOCIATE_ITEM_STATUS.active;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3 min-w-0"><div className="w-10 h-10 rounded-xl bg-red-50 text-primary flex items-center justify-center flex-shrink-0"><UserRound size={20} /></div><div className="min-w-0"><h3 className="font-bold text-gray-900 truncate">{record.associateName || associateName(associates, record.associateId)}</h3><p className="text-xs text-gray-500">{[record.item, record.size, record.color].filter(Boolean).join(' · ')}</p></div></div><span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${meta.className}`}>{meta.label}</span></div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-gray-50 border border-gray-100 p-2"><div className="text-lg font-bold text-gray-900">{num(record.qty)}</div><div className="text-[10px] uppercase font-bold text-gray-400">Qty</div></div><div className="rounded-xl bg-green-50 border border-green-100 p-2"><div className="text-sm font-bold text-green-800">{record.issueDate || '—'}</div><div className="text-[10px] uppercase font-bold text-green-500">Issued</div></div><div className="rounded-xl bg-blue-50 border border-blue-100 p-2"><div className="text-sm font-bold text-blue-800">{record.returnedDate || '—'}</div><div className="text-[10px] uppercase font-bold text-blue-500">Returned</div></div></div>
      {record.notes && <p className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm text-gray-700">{record.notes}</p>}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400"><span>{record.updatedAt ? `Updated ${new Date(record.updatedAt).toLocaleDateString()}` : 'Associate uniform item'}</span><div className="flex gap-2"><button onClick={() => onEdit(record)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-red-50"><Edit3 size={16} /></button><button onClick={() => window.confirm('Delete this associate uniform item?') && deleteAssociateUniformItem(record.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div>
    </div>
  );
}

export default function Uniforms() {
  const { uniforms = [], uniformInventory = [], managerUniformStock = [], associateUniformItems = [], associates = [], storeName, user } = useAppStore();
  const [modalRecord, setModalRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inventoryRecord, setInventoryRecord] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [managerRecord, setManagerRecord] = useState(null);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [associateItemRecord, setAssociateItemRecord] = useState(null);
  const [showAssociateItemModal, setShowAssociateItemModal] = useState(false);
  const [activeTab, setActiveTab] = useState('checks');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [issueFilter, setIssueFilter] = useState('all');

  const activeAssociates = useMemo(() => associates.filter(a => a.status !== 'inactive'), [associates]);
  const managers = useMemo(() => managerNameList(associates, user), [associates, user]);
  const enriched = useMemo(() => uniforms.map(r => ({ ...r, associateName: r.associateName || associateName(associates, r.associateId) })).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)), [uniforms, associates]);
  const associateItemsEnriched = useMemo(() => associateUniformItems.map(r => ({ ...r, associateName: r.associateName || associateName(associates, r.associateId) })).sort((a, b) => String(a.associateName).localeCompare(String(b.associateName)) || String(a.item).localeCompare(String(b.item))), [associateUniformItems, associates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(r => {
      const matchesQuery = !q || [r.associateName, r.item, issueLabel(r.issueType), r.notes, r.actionTaken, r.sizeRequest].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesIssue = issueFilter === 'all' || r.issueType === issueFilter;
      return matchesQuery && matchesStatus && matchesIssue;
    });
  }, [enriched, query, statusFilter, issueFilter]);

  const inventoryFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return uniformInventory.filter(item => !q || [item.item, item.size, item.color, item.location, item.notes].filter(Boolean).some(v => String(v).toLowerCase().includes(q))).sort((a, b) => String(a.item).localeCompare(String(b.item)) || String(a.size).localeCompare(String(b.size)));
  }, [uniformInventory, query]);

  const managerFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return managerUniformStock.filter(r => !q || [r.managerName, r.item, r.size, r.color, r.location, r.notes].filter(Boolean).some(v => String(v).toLowerCase().includes(q))).sort((a, b) => String(a.managerName).localeCompare(String(b.managerName)) || String(a.item).localeCompare(String(b.item)));
  }, [managerUniformStock, query]);

  const associateItemsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return associateItemsEnriched.filter(r => !q || [r.associateName, r.item, r.size, r.color, associateItemStatusLabel(r.status), r.notes].filter(Boolean).some(v => String(v).toLowerCase().includes(q)));
  }, [associateItemsEnriched, query]);

  const managerQtyByInventoryId = useMemo(() => managerUniformStock.reduce((acc, r) => {
    if (r.inventoryItemId) acc[r.inventoryItemId] = (acc[r.inventoryItemId] || 0) + num(r.qty);
    return acc;
  }, {}), [managerUniformStock]);

  const associateQtyByInventoryId = useMemo(() => associateUniformItems.reduce((acc, r) => {
    if (r.inventoryItemId && ISSUED_ASSOCIATE_STATUSES.includes(r.status || 'active')) acc[r.inventoryItemId] = (acc[r.inventoryItemId] || 0) + num(r.qty);
    return acc;
  }, {}), [associateUniformItems]);

  const stats = useMemo(() => {
    const storeOnHand = uniformInventory.reduce((sum, item) => sum + num(item.onHandQty), 0);
    const managerOnHand = managerUniformStock.reduce((sum, item) => sum + num(item.qty), 0);
    const associateOnHand = associateUniformItems.filter(item => ISSUED_ASSOCIATE_STATUSES.includes(item.status || 'active')).reduce((sum, item) => sum + num(item.qty), 0);
    return {
      total: uniforms.length,
      open: uniforms.filter(r => r.status === 'open').length,
      followUp: uniforms.filter(r => r.status === 'needs_follow_up').length,
      inventoryItems: uniformInventory.length,
      storeOnHand,
      managerOnHand,
      associateOnHand,
      lowStock: uniformInventory.filter(item => ['low', 'out'].includes(stockStatus(item))).length,
    };
  }, [uniforms, uniformInventory, managerUniformStock, associateUniformItems]);

  const openAdd = () => { setModalRecord(null); setShowModal(true); };
  const openEdit = (record) => { setModalRecord(record); setShowModal(true); };
  const openInventoryAdd = () => { setInventoryRecord(null); setShowInventoryModal(true); };
  const openInventoryEdit = (record) => { setInventoryRecord(record); setShowInventoryModal(true); };
  const openManagerAdd = () => { setManagerRecord(null); setShowManagerModal(true); };
  const openManagerEdit = (record) => { setManagerRecord(record); setShowManagerModal(true); };
  const openAssociateItemAdd = () => { setAssociateItemRecord(null); setShowAssociateItemModal(true); };
  const openAssociateItemEdit = (record) => { setAssociateItemRecord(record); setShowAssociateItemModal(true); };

  const primaryAdd = activeTab === 'inventory' ? openInventoryAdd : activeTab === 'managers' ? openManagerAdd : activeTab === 'associateItems' ? openAssociateItemAdd : openAdd;
  const addLabel = activeTab === 'inventory' ? 'Add Item' : activeTab === 'managers' ? 'Assign Stock' : activeTab === 'associateItems' ? 'Issue Item' : 'Add Check';

  const handlePrint = () => {
    const checkRows = filtered.map(r => `<tr><td>${r.date || ''}</td><td>${r.associateName || ''}</td><td>${r.item || ''}</td><td>${issueLabel(r.issueType)}</td><td>${badgeHtml(STATUS_META[r.status]?.label || r.status || 'Open', STATUS_META[r.status]?.color || 'gray')}</td><td>${r.sizeRequest || ''}</td><td>${r.actionTaken || r.notes || ''}</td></tr>`).join('');
    const inventoryRows = inventoryFiltered.map(item => `<tr><td>${item.item || ''}</td><td>${item.size || ''}</td><td>${item.color || ''}</td><td>${num(item.onHandQty)}</td><td>${num(managerQtyByInventoryId[item.id])}</td><td>${num(associateQtyByInventoryId[item.id])}</td><td>${Math.max(0, num(item.onHandQty) - num(managerQtyByInventoryId[item.id]) - num(associateQtyByInventoryId[item.id]))}</td><td>${badgeHtml(STOCK_STATUS[stockStatus(item)].label, STOCK_STATUS[stockStatus(item)].color)}</td><td>${item.location || ''}</td></tr>`).join('');
    const managerRows = managerFiltered.map(r => `<tr><td>${r.managerName || ''}</td><td>${r.item || ''}</td><td>${r.size || ''}</td><td>${r.color || ''}</td><td>${num(r.qty)}</td><td>${r.location || ''}</td><td>${r.notes || ''}</td></tr>`).join('');
    const associateRows = associateItemsFiltered.map(r => `<tr><td>${r.associateName || ''}</td><td>${r.item || ''}</td><td>${r.size || ''}</td><td>${r.color || ''}</td><td>${num(r.qty)}</td><td>${r.issueDate || ''}</td><td>${r.returnedDate || ''}</td><td>${badgeHtml(ASSOCIATE_ITEM_STATUS[r.status]?.label || r.status || 'Active / Issued', ASSOCIATE_ITEM_STATUS[r.status]?.color || 'green')}</td><td>${r.notes || ''}</td></tr>`).join('');
    openPrintWindow({
      title: 'Uniform Tracker & Inventory Report',
      subtitle: storeName,
      html: `${infoGridHtml([['Report View', activeTab === 'checks' ? 'Uniform Checks' : activeTab === 'inventory' ? 'Inventory' : activeTab === 'managers' ? 'Manager On-Hand' : 'Associate Items'], ['Generated', new Date().toLocaleString()], ['Store', storeName]])}${statsRowHtml([{ value: stats.total, label: 'Checks' }, { value: stats.open, label: 'Open Issues' }, { value: stats.storeOnHand, label: 'Store On-Hand' }, { value: stats.managerOnHand, label: 'Manager On-Hand' }, { value: stats.associateOnHand, label: 'With Associates' }, { value: stats.lowStock, label: 'Low/Out Items' }])}<h2 class="section-title">Inventory</h2><table><thead><tr><th>Item</th><th>Size</th><th>Color</th><th>Store Qty</th><th>With Managers</th><th>With Associates</th><th>Available</th><th>Status</th><th>Location</th></tr></thead><tbody>${inventoryRows || '<tr><td colspan="9">No inventory records found.</td></tr>'}</tbody></table><h2 class="section-title">Manager On-Hand</h2><table><thead><tr><th>Manager</th><th>Item</th><th>Size</th><th>Color</th><th>Qty</th><th>Location</th><th>Notes</th></tr></thead><tbody>${managerRows || '<tr><td colspan="7">No manager stock records found.</td></tr>'}</tbody></table><h2 class="section-title">Associate Items</h2><table><thead><tr><th>Associate</th><th>Item</th><th>Size</th><th>Color</th><th>Qty</th><th>Issued</th><th>Returned</th><th>Status</th><th>Notes</th></tr></thead><tbody>${associateRows || '<tr><td colspan="9">No associate uniform item records found.</td></tr>'}</tbody></table><h2 class="section-title">Uniform Checks</h2><table><thead><tr><th>Date</th><th>Associate</th><th>Item</th><th>Issue</th><th>Status</th><th>Request</th><th>Action / Notes</th></tr></thead><tbody>${checkRows || '<tr><td colspan="7">No uniform check records found.</td></tr>'}</tbody></table>`,
    });
  };

  return (
    <div className="page-container">
      <style>{`.form-input,.form-select,.form-textarea{width:100%;border-radius:0.75rem;border:1px solid #e5e7eb;padding:0.55rem 0.7rem;font-size:0.875rem;line-height:1.2}.form-input:focus,.form-select:focus,.form-textarea:focus{outline:none;border-color:#c8102e;box-shadow:0 0 0 2px rgba(200,16,46,.15)}.form-textarea{resize:none}`}</style>
      <Header title="Uniform Tracker" onAdd={primaryAdd} rightIcon={<Printer size={20} />} onRightClick={handlePrint} />
      <DesktopPageHeader title="Uniform Tracker" onAdd={primaryAdd} addLabel={addLabel} onPrint={handlePrint} />

      <main className="desktop-page-content p-4 lg:p-8 space-y-5">
        <section className="grid grid-cols-2 lg:grid-cols-7 gap-3">
          <StatCard label="Total Checks" value={stats.total} />
          <StatCard label="Open Issues" value={stats.open} tone="red" />
          <StatCard label="Follow Up" value={stats.followUp} tone="yellow" />
          <StatCard label="Inventory SKUs" value={stats.inventoryItems} tone="blue" />
          <StatCard label="Store On-Hand" value={stats.storeOnHand} tone="green" />
          <StatCard label="With Managers" value={stats.managerOnHand} tone="purple" />
          <StatCard label="With Associates" value={stats.associateOnHand} tone="red" />
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 lg:p-4 space-y-3">
          <div className="flex flex-wrap gap-2"><TabButton active={activeTab === 'checks'} onClick={() => setActiveTab('checks')}>Uniform Checks</TabButton><TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</TabButton><TabButton active={activeTab === 'managers'} onClick={() => setActiveTab('managers')}>Manager On-Hand</TabButton><TabButton active={activeTab === 'associateItems'} onClick={() => setActiveTab('associateItems')}>Associate Items</TabButton></div>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={activeTab === 'checks' ? 'Search associate, item, issue, notes...' : activeTab === 'inventory' ? 'Search item, size, location...' : activeTab === 'managers' ? 'Search manager, item, location...' : 'Search associate, item, size, status...'} className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
            {activeTab === 'checks' && <div className="flex gap-2"><label className="relative flex-1 lg:flex-none"><Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full lg:w-44 rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"><option value="all">All Statuses</option>{Object.entries(STATUS_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></label><select value={issueFilter} onChange={e => setIssueFilter(e.target.value)} className="flex-1 lg:w-52 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"><option value="all">All Issues</option>{ISSUE_TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>}
          </div>
          <div className="flex flex-wrap gap-2"><button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-red-50 text-primary border border-red-100 px-3 py-2 text-sm font-bold hover:bg-red-100"><Shirt size={16} /> Add Check</button><button onClick={openInventoryAdd} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 px-3 py-2 text-sm font-bold hover:bg-blue-100"><PackagePlus size={16} /> Add Inventory</button><button onClick={openManagerAdd} className="inline-flex items-center gap-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 px-3 py-2 text-sm font-bold hover:bg-purple-100"><Warehouse size={16} /> Manager On-Hand</button><button onClick={openAssociateItemAdd} className="inline-flex items-center gap-2 rounded-xl bg-red-50 text-primary border border-red-100 px-3 py-2 text-sm font-bold hover:bg-red-100"><UserRound size={16} /> Associate Items</button></div>
        </section>

        {activeTab === 'checks' && (filtered.length > 0 ? <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">{filtered.map(record => <UniformCard key={record.id} record={record} associates={associates} onEdit={openEdit} />)}</section> : <EmptyState icon={<Shirt size={28} />} title="No uniform checks yet" text="Add the first uniform check to track compliance, replacement needs, and follow-up. Non-compliant records automatically create a key C Work File entry." action="Add Uniform Check" onClick={openAdd} />)}
        {activeTab === 'inventory' && (inventoryFiltered.length > 0 ? <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">{inventoryFiltered.map(item => <InventoryCard key={item.id} item={item} managerQty={managerQtyByInventoryId[item.id] || 0} associateQty={associateQtyByInventoryId[item.id] || 0} onEdit={openInventoryEdit} />)}</section> : <EmptyState icon={<Boxes size={28} />} title="No uniform inventory yet" text="Add store inventory by item, size, color, and location so managers can see what is available before ordering or replacing uniforms." action="Add Inventory Item" onClick={openInventoryAdd} />)}
        {activeTab === 'managers' && (managerFiltered.length > 0 ? <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">{managerFiltered.map(record => <ManagerStockCard key={record.id} record={record} onEdit={openManagerEdit} />)}</section> : <EmptyState icon={<Warehouse size={28} />} title="No manager on-hand stock yet" text="Assign uniform items to a manager to show who currently has extra shirts, hats, aprons, name tags, or other uniform supplies on hand." action="Assign Manager Stock" onClick={openManagerAdd} />)}
        {activeTab === 'associateItems' && (associateItemsFiltered.length > 0 ? <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">{associateItemsFiltered.map(record => <AssociateItemCard key={record.id} record={record} associates={associates} onEdit={openAssociateItemEdit} />)}</section> : <EmptyState icon={<UserRound size={28} />} title="No associate uniform items yet" text="Issue uniform items to associates to track what each person currently has, what was returned, and what may need replacement." action="Issue Associate Item" onClick={openAssociateItemAdd} />)}

        {activeAssociates.length === 0 && <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 flex gap-2"><UserRound size={18} className="flex-shrink-0 mt-0.5" />Add active associates first so uniform checks and issued items can be assigned to team members.</section>}
      </main>

      {showModal && <UniformModal record={modalRecord} associates={activeAssociates} onClose={() => setShowModal(false)} />}
      {showInventoryModal && <InventoryModal record={inventoryRecord} onClose={() => setShowInventoryModal(false)} />}
      {showManagerModal && <ManagerStockModal record={managerRecord} inventory={uniformInventory} managers={managers} onClose={() => setShowManagerModal(false)} />}
      {showAssociateItemModal && <AssociateItemModal record={associateItemRecord} associates={activeAssociates} inventory={uniformInventory} onClose={() => setShowAssociateItemModal(false)} />}
    </div>
  );
}

function EmptyState({ icon, title, text, action, onClick }) {
  return <section className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center"><div className="w-14 h-14 rounded-2xl bg-red-50 text-primary mx-auto flex items-center justify-center">{icon}</div><h3 className="mt-4 font-bold text-gray-900">{title}</h3><p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">{text}</p><button onClick={onClick} className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">{action}</button></section>;
}
