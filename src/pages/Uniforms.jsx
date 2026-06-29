import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, Boxes, CheckCircle2, ClipboardCheck, Edit3, Filter,
  PackagePlus, Printer, Search, Shirt, Trash2, UserRound, Warehouse, X, TrendingDown
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { badgeHtml, infoGridHtml, openPrintWindow, statsRowHtml } from '../lib/printReport';
import { colorOptionsFor, uniformSkuKey } from '../lib/uniformSku';
import { toast } from '../lib/uiDialog';
import {
  ModalHeader,
  ModalFooter,
  Field,
  TabButton,
  UniformCard,
  InventoryCard,
  ManagerStockCard,
  AssociateItemCard,
} from '../components/UniformComponents';

// StatCard component for displaying stats
function StatCard({ label, value, tone = 'default' }) {
  const toneClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  };
  return (
    <div className={`border rounded-lg p-4 ${toneClasses[tone]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

const UNIFORM_ITEMS = [
  'Hat / Cap', 'Shirt', 'Apron', 'Name Tag', 'Back Brace', 'Full Uniform', 'Other'
];

const SIZE_OPTIONS = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'N/A'
];

const ALL_COLORS = ['Black', 'Red', 'White', 'Gray', 'Khaki', 'Navy', 'Other'];

// Identity of an existing row: prefer the stored stable SKU key, falling back to a
// freshly computed one for rows saved before the key existed. Matching on the stored
// key (instead of comparing live text fields) is what keeps the same uniform as one row.
const rowSku = (o) => o?.skuKey || uniformSkuKey(o);

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
    if (!form.associateId) return toast('Please choose an associate.', { type: 'error' });
    if (!form.date) return toast('Please choose a check date.', { type: 'error' });
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
            <Field label="Associate"><select value={form.associateId} onChange={e => setField('associateId', e.target.value)} className="form-select"><option value="">Select associate...</option>{[...associates].sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
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
  const { addUniformInventoryItem, updateUniformInventoryItem, uniformInventory = [] } = useAppStore();
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
    if (!form.item) return toast('Please choose an item.', { type: 'error' });
    const payload = {
      ...form,
      onHandQty: num(form.onHandQty),
      reorderPoint: num(form.reorderPoint),
      updatedAt: new Date().toISOString(),
    };
    if (record?.id) {
      updateUniformInventoryItem(record.id, payload);
    } else {
      // Reuse an existing row for the same SKU instead of creating a duplicate.
      const payloadSku = uniformSkuKey(payload);
      const existing = uniformInventory.find(i => rowSku(i) === payloadSku);
      if (existing) updateUniformInventoryItem(existing.id, payload);
      else addUniformInventoryItem(payload);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-t-2xl w-full animate-slide-up lg:rounded-2xl lg:max-w-xl lg:shadow-2xl">
        <ModalHeader icon={<Boxes size={20} />} title={record ? 'Edit Inventory Item' : 'Add Inventory Item'} subtitle="Track store stock by item, size, and location." onClose={onClose} />
        <div className="modal-body p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Uniform Item"><select value={form.item} onChange={e => setField('item', e.target.value)} className="form-select">{UNIFORM_ITEMS.filter(i => i !== 'Full Uniform').map(item => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Size"><select value={form.size} onChange={e => setField('size', e.target.value)} className="form-select"><option value="">Select size...</option>{SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
            {colorOptionsFor(form.item).length > 0 && (
              <Field label="Color"><select value={form.color} onChange={e => setField('color', e.target.value)} className="form-select"><option value="">Select color...</option>{colorOptionsFor(form.item).map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
            )}
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

function ManagerStockModal({ record, inventory, managerQtyByInventoryId, associateQtyByInventoryId, managers, onClose }) {
  const { addManagerUniformStock, updateManagerUniformStock, addUniformInventoryItem } = useAppStore();
  const [form, setForm] = useState(() => ({
    managerName: record?.managerName || '',
    inventoryItemId: record?.inventoryItemId || '',
    item: record?.item || '',
    size: record?.size || '',
    color: record?.color || '',
    qty: record?.qty ?? '1',
    notes: record?.notes || '',
  }));

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // Auto-link inventory item when the SKU matches a stored row.
  const syncInventoryLink = (nextForm) => {
    const nextSku = uniformSkuKey(nextForm);
    const match = inventory.find(i => rowSku(i) === nextSku);
    return { ...nextForm, inventoryItemId: match?.id || '' };
  };

  const handleField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'item' && !colorOptionsFor(value).includes(prev.color)) next.color = '';
      return syncInventoryLink(next);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.managerName) return toast('Please choose a manager.', { type: 'error' });
    if (!form.item) return toast('Please choose a uniform item.', { type: 'error' });

    let inventoryItemId = form.inventoryItemId;

    // Auto-create an inventory item if this SKU has no record yet
    if (!inventoryItemId && form.item) {
      const formSku = uniformSkuKey(form);
      const existing = inventory.find(i => rowSku(i) === formSku);
      if (existing) {
        inventoryItemId = existing.id;
      } else {
        const newId = `uniform_inventory_${Date.now()}`;
        addUniformInventoryItem({
          id: newId,
          item: form.item,
          size: form.size || '',
          color: form.color || '',
          onHandQty: 0,
          reorderPoint: 2,
          location: '',
          notes: 'Auto-created from Manager On-Hand entry',
          updatedAt: new Date().toISOString(),
        });
        inventoryItemId = newId;
      }
    }

    const payload = {
      ...form,
      inventoryItemId,
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
        <ModalHeader icon={<Warehouse size={20} />} title={record ? 'Edit Manager Stock' : 'Assign Manager Stock'} subtitle="Track uniforms held by managers." onClose={onClose} />
        <div className="modal-body p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Manager">
              <select value={form.managerName} onChange={e => handleField('managerName', e.target.value)} className="form-select">
                <option value="">Select manager...</option>
                {managers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Quantity">
              <input type="number" min="1" value={form.qty} onChange={e => handleField('qty', e.target.value)} className="form-input" />
            </Field>
            <Field label="Uniform Item">
              <select value={form.item} onChange={e => handleField('item', e.target.value)} className="form-select">
                <option value="">Select item...</option>
                {UNIFORM_ITEMS.filter(i => i !== 'Full Uniform').map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Size">
              <select value={form.size} onChange={e => handleField('size', e.target.value)} className="form-select">
                <option value="">Select size...</option>
                {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            {colorOptionsFor(form.item).length > 0 && (
              <Field label="Color">
                <select value={form.color} onChange={e => handleField('color', e.target.value)} className="form-select">
                  <option value="">Select color...</option>
                  {colorOptionsFor(form.item).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            )}
          </div>
          <Field label="Notes"><textarea rows={2} value={form.notes} onChange={e => handleField('notes', e.target.value)} placeholder="Condition, storage location, or instructions..." className="form-textarea" /></Field>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Manager Stock" />
      </form>
    </div>
  );
}

function AssociateItemModal({ record, associates, inventory, managerStock = [], issuedQtyByManagerStockId = {}, managerQtyByInventoryId, associateQtyByInventoryId, onClose }) {
  const { addAssociateUniformItem, updateAssociateUniformItem } = useAppStore();
  const [form, setForm] = useState(() => ({
    associateId: record?.associateId || '',
    sourceManagerStockId: record?.sourceManagerStockId || '',
    inventoryItemId: record?.inventoryItemId || '',
    item: record?.item || '',
    size: record?.size || '',
    color: record?.color || '',
    qty: record?.qty ?? '1',
    status: record?.status || 'active',
    issuedDate: record?.issuedDate || todayIso(),
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

  // Net on-hand a manager currently holds for one of their stock records, adding back this record's own
  // issued qty (when editing) so the option doesn't appear smaller than it really is.
  const managerNetOnHand = (ms) => {
    const issued = issuedQtyByManagerStockId[ms.id] || 0;
    const ownBack = record?.id && record?.sourceManagerStockId === ms.id ? num(record.qty) : 0;
    return num(ms.qty) - issued + ownBack;
  };

  const handleManagerSourceChoice = (id) => {
    const ms = managerStock.find(m => m.id === id);
    if (!ms) { setField('sourceManagerStockId', ''); return; }
    setForm(prev => ({
      ...prev,
      sourceManagerStockId: id,
      inventoryItemId: ms.inventoryItemId || prev.inventoryItemId,
      item: ms.item || prev.item,
      size: ms.size || prev.size,
      color: ms.color || prev.color,
    }));
  };

  const managerSourceOptions = [...managerStock]
    .filter(ms => ms.id === form.sourceManagerStockId || managerNetOnHand(ms) > 0)
    .sort((a, b) => (a.managerName || '').localeCompare(b.managerName || '') || (a.item || '').localeCompare(b.item || ''));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.associateId) return toast('Please choose an associate.', { type: 'error' });
    if (!form.item) return toast('Please choose an item.', { type: 'error' });
    if (!form.sourceManagerStockId && managerSourceOptions.length > 0) {
      return toast("Select which manager these items come from so their on-hand count updates. If they come straight from store stock, leave it blank — but a manager's count won't change.", { type: 'error' });
    }
    if (form.sourceManagerStockId) {
      const ms = managerStock.find(m => m.id === form.sourceManagerStockId);
      if (ms && num(form.qty) > managerNetOnHand(ms)) {
        return toast(`${ms.managerName} only has ${managerNetOnHand(ms)} on hand. Lower the quantity or pick a different source.`, { type: 'error' });
      }
    }
    const payload = {
      ...form,
      associateName: associateName(associates, form.associateId),
      sourceManagerName: form.sourceManagerStockId ? (managerStock.find(m => m.id === form.sourceManagerStockId)?.managerName || '') : '',
      qty: num(form.qty),
      updatedAt: new Date().toISOString(),
    };
    if (record?.id) updateAssociateUniformItem(record.id, payload);
    else addAssociateUniformItem(payload);
    onClose();
  };

  // Calculate available quantity for each inventory item
  const getAvailableQty = (invId) => {
    const inv = inventory.find(i => i.id === invId);
    if (!inv) return 0;
    const storeQty = num(inv.onHandQty);
    const withManagers = managerQtyByInventoryId[invId] || 0;
    const withAssociates = associateQtyByInventoryId[invId] || 0;
    return storeQty + withManagers - withAssociates;
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-t-2xl w-full animate-slide-up lg:rounded-2xl lg:max-w-2xl lg:shadow-2xl max-h-[90vh] overflow-y-auto">
        <ModalHeader icon={<UserRound size={20} />} title={record ? 'Edit Associate Item' : 'Issue Associate Item'} subtitle="Track uniforms issued to associates." onClose={onClose} />
        <div className="modal-body p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Associate"><select value={form.associateId} onChange={e => setField('associateId', e.target.value)} className="form-select"><option value="">Select associate...</option>{[...associates].sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
            <Field label="Quantity"><input type="number" min="1" value={form.qty} onChange={e => setField('qty', e.target.value)} className="form-input" /></Field>
            <Field label="Issued Date"><input type="date" value={form.issuedDate} onChange={e => setField('issuedDate', e.target.value)} className="form-input" /></Field>
            <Field label="Status"><select value={form.status} onChange={e => setField('status', e.target.value)} className="form-select">{Object.entries(ASSOCIATE_ITEM_STATUS).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></Field>
          </div>
          <Field label="Issue From Manager">
            <select value={form.sourceManagerStockId} onChange={e => handleManagerSourceChoice(e.target.value)} className="form-select">
              <option value="">— Straight from store stock (no manager deduction) —</option>
              {managerSourceOptions.map(ms => <option key={ms.id} value={ms.id}>{ms.managerName} · {ms.item} · {ms.size || 'One Size'}{ms.color ? ` · ${ms.color}` : ''} ({managerNetOnHand(ms)} on hand)</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Picking a manager deducts this quantity from their on-hand count.</p>
          </Field>
          <Field label="Link Inventory Item (Optional)">
            <select value={form.inventoryItemId} onChange={e => handleInventoryChoice(e.target.value)} className="form-select">
              <option value="">— No link —</option>
              {inventory.map(item => <option key={item.id} value={item.id}>{item.item} · {item.size || 'One Size'} · {item.color} (Available: {getAvailableQty(item.id)})</option>)}
            </select>
            {inventory.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No inventory items yet — add items under the <span className="font-semibold">Inventory</span> tab to enable stock tracking.</p>
            )}
          </Field>
          {form.status === 'returned' && <Field label="Returned Date"><input type="date" value={form.returnedDate} onChange={e => setField('returnedDate', e.target.value)} className="form-input" /></Field>}
          <Field label="Notes"><textarea rows={2} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Condition, replacement reason, follow-up notes..." className="form-textarea" /></Field>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Associate Item" />
      </form>
    </div>
  );
}

function Uniforms() {
  const { uniforms = [], uniformInventory = [], managerUniformStock = [], associateUniformItems = [], associates = [], storeName, user, addUniformInventoryItem, updateUniformInventoryItem, deleteUniformInventoryItem, updateManagerUniformStock, deleteManagerUniformStock, updateAssociateUniformItem } = useAppStore();

  // Self-healing inventory maintenance. Runs in two idempotent phases (one per render pass)
  // so each pass makes only one kind of change and the data converges, then stays quiet:
  //   1. Dedupe — merge inventory items that share the same item+size+color (keep the most
  //      recently updated on-hand qty, plus the richest location/notes), re-point manager +
  //      associate records to the survivor.
  //   2. Backfill — link any Manager On-Hand record that has no inventory item to one, creating it if needed.
  useEffect(() => {
    const norm = (v) => String(v || '').trim().toLowerCase();
    // Identity key: use each row's stored stable SKU key (falling back to a computed
    // one for rows saved before the key existed). This keeps merging based on a single
    // stored identity rather than re-deriving it from live text fields every time.
    const keyOf = (o) => o.skuKey || uniformSkuKey(o);
    // Recency of a row, used to pick which duplicate's quantity to trust when merging.
    const tsOf = (o) => { const t = Date.parse(o?.updatedAt || ''); return Number.isNaN(t) ? 0 : t; };
    const AUTO_NOTE = 'Auto-created from Manager On-Hand entry';

    // ── Phase 1: dedupe ──────────────────────────────────────────────────────
    const groups = {};
    uniformInventory.forEach(inv => { (groups[keyOf(inv)] ||= []).push(inv); });

    const remap = {};        // duplicate inventoryId -> survivor inventoryId
    const invPatches = [];   // { id, patch }
    const invDeletes = [];   // id

    Object.values(groups).forEach(group => {
      if (group.length <= 1) return;
      const ordered = [...group].sort((a, b) => tsOf(b) - tsOf(a));
      const survivor = ordered[0];
      if (!norm(survivor.item)) return; // never merge rows with no item — could be unrelated/malformed data
      // Duplicate rows are the same physical stock recorded twice (usually a cross-device sync echo),
      // so keep the most recently updated quantity rather than adding them together (which inflates counts).
      const onHandQty = Number(survivor.onHandQty) || 0;
      const reorder = Math.max(2, ...group.map(i => Number(i.reorderPoint) || 0));
      const location = ordered.map(i => i.location).find(Boolean) || '';
      const notes = ordered.map(i => i.notes).find(n => n && n !== AUTO_NOTE) || survivor.notes || '';
      const color = colorOptionsFor(survivor.item).length > 0 ? survivor.color : '';
      invPatches.push({ id: survivor.id, patch: { onHandQty, reorderPoint: reorder, location, notes, color } });
      ordered.slice(1).forEach(dup => { remap[dup.id] = survivor.id; invDeletes.push(dup.id); });
    });

    if (invDeletes.length > 0) {
      invPatches.forEach(p => updateUniformInventoryItem(p.id, p.patch));
      managerUniformStock.forEach(r => { if (remap[r.inventoryItemId]) updateManagerUniformStock(r.id, { inventoryItemId: remap[r.inventoryItemId] }); });
      associateUniformItems.forEach(r => { if (remap[r.inventoryItemId]) updateAssociateUniformItem(r.id, { inventoryItemId: remap[r.inventoryItemId] }); });
      invDeletes.forEach(id => deleteUniformInventoryItem(id));
      return; // let the dedupe settle before running the backfill
    }

    // ── Phase 1b: dedupe manager stock ───────────────────────────────────────
    // Merge manager records that are the exact same manager + item + size (+ color for color items):
    // keep the most recently updated qty, the richest link/location/notes, and re-point any issued associate items.
    const mgrKeyOf = (o) => `${norm(o.managerName)}||${o.skuKey || uniformSkuKey(o)}`;
    const mgrGroups = {};
    managerUniformStock.forEach(r => { (mgrGroups[mgrKeyOf(r)] ||= []).push(r); });

    const mgrRemap = {};     // duplicate managerStockId -> survivor id
    const mgrPatches = [];   // { id, patch }
    const mgrDeletes = [];   // id

    Object.values(mgrGroups).forEach(group => {
      if (group.length <= 1) return;
      const ordered = [...group].sort((a, b) => tsOf(b) - tsOf(a));
      const survivor = ordered[0];
      if (!norm(survivor.managerName) || !norm(survivor.item)) return; // never merge blank rows
      // Same as inventory: keep the latest quantity instead of summing duplicate rows together.
      const qty = Number(survivor.qty) || 0;
      const location = ordered.map(r => r.location).find(Boolean) || '';
      const notes = ordered.map(r => r.notes).find(Boolean) || '';
      const inventoryItemId = ordered.map(r => r.inventoryItemId).find(Boolean) || '';
      const color = colorOptionsFor(survivor.item).length > 0 ? survivor.color : '';
      mgrPatches.push({ id: survivor.id, patch: { qty, location, notes, inventoryItemId, color } });
      ordered.slice(1).forEach(dup => { mgrRemap[dup.id] = survivor.id; mgrDeletes.push(dup.id); });
    });

    if (mgrDeletes.length > 0) {
      mgrPatches.forEach(p => updateManagerUniformStock(p.id, p.patch));
      associateUniformItems.forEach(r => { if (mgrRemap[r.sourceManagerStockId]) updateAssociateUniformItem(r.id, { sourceManagerStockId: mgrRemap[r.sourceManagerStockId] }); });
      mgrDeletes.forEach(id => deleteManagerUniformStock(id));
      return; // let the merge settle before running the backfill
    }

    // ── Phase 2: backfill ────────────────────────────────────────────────────
    const validInvIds = new Set(uniformInventory.map(i => i.id));
    const keyToInvId = {};
    uniformInventory.forEach(i => { keyToInvId[keyOf(i)] = i.id; });

    const newInvItems = [];
    const stockUpdates = [];

    managerUniformStock.forEach(rec => {
      if (!rec.item) return;
      if (rec.inventoryItemId && validInvIds.has(rec.inventoryItemId)) return;
      const key = keyOf(rec);
      let invId = keyToInvId[key];
      if (!invId) {
        invId = `uniform_inventory_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        keyToInvId[key] = invId;
        newInvItems.push({
          id: invId,
          item: rec.item,
          size: rec.size || '',
          color: rec.color || '',
          onHandQty: 0,
          reorderPoint: 2,
          location: '',
          notes: AUTO_NOTE,
          updatedAt: new Date().toISOString(),
        });
      }
      stockUpdates.push({ id: rec.id, inventoryItemId: invId });
    });

    if (newInvItems.length === 0 && stockUpdates.length === 0) return;
    newInvItems.forEach(addUniformInventoryItem);
    stockUpdates.forEach(u => updateManagerUniformStock(u.id, { inventoryItemId: u.inventoryItemId }));
  }, [managerUniformStock, uniformInventory, associateUniformItems, addUniformInventoryItem, updateUniformInventoryItem, deleteUniformInventoryItem, updateManagerUniformStock, deleteManagerUniformStock, updateAssociateUniformItem]);

  const [activeTab, setActiveTab] = useState('inventory');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [issueFilter, setIssueFilter] = useState('all');
  const [locatorItem, setLocatorItem] = useState('');
  const [locatorSize, setLocatorSize] = useState('');
  const [locatorColor, setLocatorColor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showAssociateItemModal, setShowAssociateItemModal] = useState(false);
  const [modalRecord, setModalRecord] = useState(null);
  const [inventoryRecord, setInventoryRecord] = useState(null);
  const [managerRecord, setManagerRecord] = useState(null);
  const [associateItemRecord, setAssociateItemRecord] = useState(null);

  const activeAssociates = associates.filter(a => a.status !== 'inactive');
  const managers = managerNameList(associates, user);

  const enriched = uniforms.map(r => ({ ...r, associateName: associateName(associates, r.associateId) }));

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
    return uniformInventory
      .filter(item => !q || [item.item, item.size, item.color, item.location, item.notes].filter(Boolean).some(v => String(v).toLowerCase().includes(q)))
      .sort((a, b) =>
        String(a.item).localeCompare(String(b.item)) ||
        String(a.size).localeCompare(String(b.size)) ||
        String(a.color).localeCompare(String(b.color))
      );
  }, [uniformInventory, query]);

  const inventoryGroups = useMemo(() => {
    const order = [...UNIFORM_ITEMS, 'Other'];
    const byItem = {};
    inventoryFiltered.forEach(item => {
      const name = item.item || 'Other';
      (byItem[name] ||= []).push(item);
    });
    return Object.keys(byItem)
      .sort((a, b) => {
        const ia = order.indexOf(a), ib = order.indexOf(b);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
      })
      .map(name => ({ name, items: byItem[name] }));
  }, [inventoryFiltered]);

  const managerFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return managerUniformStock.filter(r => !q || [r.managerName, r.item, r.size, r.color, r.location, r.notes].filter(Boolean).some(v => String(v).toLowerCase().includes(q))).sort((a, b) => String(a.managerName).localeCompare(String(b.managerName)) || String(a.item).localeCompare(String(b.item)));
  }, [managerUniformStock, query]);

  const locatorResults = useMemo(() => {
    if (!locatorItem) return [];
    const matching = managerUniformStock.filter(r => {
      if (r.item !== locatorItem) return false;
      if (locatorSize && r.size !== locatorSize) return false;
      if (locatorColor && r.color !== locatorColor) return false;
      return true;
    });
    // Group by manager + item + size + color, summing qty
    const grouped = {};
    matching.forEach(r => {
      const key = `${r.managerName}||${r.item}||${r.size || ''}||${r.color || ''}`;
      if (!grouped[key]) {
        grouped[key] = { ...r, qty: 0, _ids: [] };
      }
      grouped[key].qty += num(r.qty);
      grouped[key]._ids.push(r.id);
    });
    return Object.values(grouped).sort((a, b) => String(a.managerName).localeCompare(String(b.managerName)));
  }, [managerUniformStock, locatorItem, locatorSize, locatorColor]);

  const associateItemsEnriched = associateUniformItems.map(r => ({ ...r, associateName: associateName(associates, r.associateId) }));

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

  // Qty currently issued to associates that was sourced FROM a specific manager's on-hand stock.
  // Used to derive each manager's net on-hand (original qty minus what they've handed out) without mutating data,
  // so returns/edits/deletes reconcile automatically.
  const issuedQtyByManagerStockId = useMemo(() => associateUniformItems.reduce((acc, r) => {
    if (r.sourceManagerStockId && ISSUED_ASSOCIATE_STATUSES.includes(r.status || 'active')) acc[r.sourceManagerStockId] = (acc[r.sourceManagerStockId] || 0) + num(r.qty);
    return acc;
  }, {}), [associateUniformItems]);

  // Enhanced stats with inventory flow
  const stats = useMemo(() => {
    const storeOnHand = uniformInventory.reduce((sum, item) => sum + num(item.onHandQty), 0);
    const managerOnHand = managerUniformStock.reduce((sum, item) => sum + num(item.qty), 0);
    const associateOnHand = associateUniformItems.filter(item => ISSUED_ASSOCIATE_STATUSES.includes(item.status || 'active')).reduce((sum, item) => sum + num(item.qty), 0);
    const totalInventory = storeOnHand + managerOnHand;
    const available = totalInventory - associateOnHand;
    return {
      total: uniforms.length,
      open: uniforms.filter(r => r.status === 'open').length,
      followUp: uniforms.filter(r => r.status === 'needs_follow_up').length,
      inventoryItems: uniformInventory.length,
      storeOnHand,
      managerOnHand,
      associateOnHand,
      totalInventory,
      available: Math.max(0, available),
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

  const primaryAdd = activeTab === 'checks' ? openAdd : activeTab === 'inventory' ? openInventoryAdd : activeTab === 'managers' ? openManagerAdd : openAssociateItemAdd;
  const addLabel = activeTab === 'checks' ? 'Uniform Check' : activeTab === 'inventory' ? 'Inventory' : activeTab === 'managers' ? 'Manager Stock' : 'Associate Item';

  const handlePrint = () => {
    const rows = [];
    if (activeTab === 'checks') rows.push(...filtered.map(r => [r.associateName, r.date, r.item, issueLabel(r.issueType), r.status, r.sizeRequest, r.actionTaken, r.notes]));
    else if (activeTab === 'inventory') rows.push(...inventoryFiltered.map(r => [r.item, r.size, r.color, r.onHandQty, r.reorderPoint, r.location, r.notes]));
    else if (activeTab === 'managers') rows.push(...managerFiltered.map(r => [r.managerName, r.item, r.size, r.color, r.qty, r.location, r.notes]));
    else rows.push(...associateItemsFiltered.map(r => [r.associateName, r.item, r.size, r.color, r.qty, associateItemStatusLabel(r.status), r.issuedDate, r.returnedDate, r.notes]));

    const headers = activeTab === 'checks' ? ['Associate', 'Date', 'Item', 'Issue', 'Status', 'Size/Request', 'Action', 'Notes']
      : activeTab === 'inventory' ? ['Item', 'Size', 'Color', 'On-Hand', 'Reorder', 'Location', 'Notes']
      : activeTab === 'managers' ? ['Manager', 'Item', 'Size', 'Color', 'Qty', 'Location', 'Notes']
      : ['Associate', 'Item', 'Size', 'Color', 'Qty', 'Status', 'Issued', 'Returned', 'Notes'];

    const html = `<h2>${storeName} - Uniform Tracker (${activeTab})</h2><table border="1" cellpadding="8"><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(v => `<td>${v || ''}</td>`).join('')}</tr>`).join('')}</table>`;
    openPrintWindow(html);
  };

  return (
    <div className="page-container">
      <style>{`.form-input,.form-select,.form-textarea{width:100%;border-radius:0.75rem;border:1px solid #e5e7eb;padding:0.55rem 0.7rem;font-size:0.875rem;line-height:1.2}.form-input:focus,.form-select:focus,.form-textarea:focus{outline:none;border-color:#c8102e;box-shadow:0 0 0 2px rgba(200,16,46,.15)}.form-textarea{resize:none}`}</style>
      <Header title="Uniform Tracker" onAdd={primaryAdd} rightIcon={<Printer size={20} />} onRightClick={handlePrint} />
      <DesktopPageHeader title="Uniform Tracker" onAdd={primaryAdd} addLabel={addLabel} onPrint={handlePrint} />

      <main className="desktop-page-content p-4 lg:p-8 space-y-5">
        {/* Enhanced Summary Dashboard */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Inventory Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <div className="text-xs text-blue-600 font-semibold">Total Inventory</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">{stats.totalInventory}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <div className="text-xs text-purple-600 font-semibold">Manager Inventory</div>
              <div className="text-2xl font-bold text-purple-700 mt-1">{stats.managerOnHand}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 border border-red-100">
              <div className="text-xs text-red-600 font-semibold">Issued to Associates</div>
              <div className="text-2xl font-bold text-red-700 mt-1">{stats.associateOnHand}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 border border-green-100">
              <div className="text-xs text-green-600 font-semibold">Available Inventory</div>
              <div className="text-2xl font-bold text-green-700 mt-1">{stats.available}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
              <div className="text-xs text-yellow-600 font-semibold">Low Stock Items</div>
              <div className="text-2xl font-bold text-yellow-700 mt-1">{stats.lowStock}</div>
            </div>
          </div>
        </section>

        {/* Checks Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Checks" value={stats.total} />
          <StatCard label="Open Issues" value={stats.open} tone="red" />
          <StatCard label="Follow Up" value={stats.followUp} tone="yellow" />
          <StatCard label="Inventory SKUs" value={stats.inventoryItems} tone="blue" />
        </section>

        {/* Tabs and Content */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 lg:p-4 space-y-3">
          <div className="flex flex-wrap gap-2"><TabButton active={activeTab === 'checks'} onClick={() => setActiveTab('checks')}>Uniform Checks</TabButton><TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</TabButton><TabButton active={activeTab === 'managers'} onClick={() => setActiveTab('managers')}>Manager On-Hand</TabButton><TabButton active={activeTab === 'associateItems'} onClick={() => setActiveTab('associateItems')}>Associate Items</TabButton></div>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={activeTab === 'checks' ? 'Search associate, item, issue, notes...' : activeTab === 'inventory' ? 'Search item, size, location...' : activeTab === 'managers' ? 'Search manager, item, location...' : 'Search associate, item, size, status...'} className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
            {activeTab === 'checks' && <div className="flex gap-2"><label className="relative flex-1 lg:flex-none"><Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full lg:w-44 rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"><option value="all">All Statuses</option>{Object.entries(STATUS_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></label><select value={issueFilter} onChange={e => setIssueFilter(e.target.value)} className="flex-1 lg:w-52 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"><option value="all">All Issues</option>{ISSUE_TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>}
          </div>
          <div className="flex flex-wrap gap-2"><button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-red-50 text-primary border border-red-100 px-3 py-2 text-sm font-bold hover:bg-red-100"><Shirt size={16} /> Add Check</button><button onClick={openInventoryAdd} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 px-3 py-2 text-sm font-bold hover:bg-blue-100"><PackagePlus size={16} /> Add Inventory</button><button onClick={openManagerAdd} className="inline-flex items-center gap-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 px-3 py-2 text-sm font-bold hover:bg-purple-100"><Warehouse size={16} /> Manager On-Hand</button><button onClick={openAssociateItemAdd} className="inline-flex items-center gap-2 rounded-xl bg-red-50 text-primary border border-red-100 px-3 py-2 text-sm font-bold hover:bg-red-100"><UserRound size={16} /> Associate Items</button></div>
        </section>

        {activeTab === 'checks' && (filtered.length > 0 ? <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">{filtered.map(record => <UniformCard key={record.id} record={record} associates={associates} onEdit={openEdit} />)}</section> : <EmptyState icon={<Shirt size={28} />} title="No uniform checks yet" text="Add the first uniform check to track compliance, replacement needs, and follow-up. Non-compliant records automatically create a key C Work File entry." action="Add Uniform Check" onClick={openAdd} />)}
        {activeTab === 'inventory' && (inventoryFiltered.length > 0 ? (
          <div className="space-y-6">
            {inventoryGroups.map(group => (
              <section key={group.name}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{group.name}</h3>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{group.items.length}</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {group.items.map(item => <InventoryCard key={item.id} item={item} managerQty={managerQtyByInventoryId[item.id] || 0} associateQty={associateQtyByInventoryId[item.id] || 0} onEdit={openInventoryEdit} />)}
                </div>
              </section>
            ))}
          </div>
        ) : <EmptyState icon={<Boxes size={28} />} title="No uniform inventory yet" text="Add store inventory by item, size, color, and location so managers can see what is available before ordering or replacing uniforms." action="Add Inventory Item" onClick={openInventoryAdd} />)}
        {activeTab === 'managers' && (
          managerUniformStock.length === 0
            ? <EmptyState icon={<Warehouse size={28} />} title="No manager on-hand stock yet" text="Assign uniform items to a manager to show who currently has extra shirts, hats, aprons, name tags, or other uniform supplies on hand." action="Assign Manager Stock" onClick={openManagerAdd} />
            : <section className="space-y-4">
                {/* Item Locator */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Search size={16} className="text-primary" />
                    <h3 className="font-bold text-gray-800 text-sm">Item Locator — Find who has it on hand</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Uniform Item <span className="text-primary">*</span></label>
                      <select value={locatorItem} onChange={e => setLocatorItem(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <option value="">Select item...</option>
                        {UNIFORM_ITEMS.filter(i => i !== 'Full Uniform').map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Size <span className="text-gray-400 font-normal">(optional)</span></label>
                      <select value={locatorSize} onChange={e => setLocatorSize(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <option value="">Any size</option>
                        {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Color <span className="text-gray-400 font-normal">(optional)</span></label>
                      <select value={locatorColor} onChange={e => setLocatorColor(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <option value="">Any color</option>
                        {ALL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {locatorItem && locatorResults.length === 0 && (
                  <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 text-center">
                    <p className="font-semibold text-yellow-800">No manager has <span className="font-bold">{locatorItem}{locatorSize ? ` · ${locatorSize}` : ''}{locatorColor ? ` · ${locatorColor}` : ''}</span> on hand</p>
                    <p className="mt-1 text-sm text-yellow-600">Try a different size or color, or assign stock to a manager.</p>
                    <button onClick={openManagerAdd} className="mt-3 inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark"><Warehouse size={15} /> Assign Manager Stock</button>
                  </div>
                )}

                {locatorItem && locatorResults.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">{locatorResults.length} manager{locatorResults.length !== 1 ? 's' : ''} with this item</p>
                    {locatorResults.map(record => (
                      <div key={record.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-purple-600">{num(record.qty)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{record.managerName}</p>
                          <p className="text-sm text-gray-500">{record.item}{record.size ? ` · ${record.size}` : ''}{record.color ? ` · ${record.color}` : ''}</p>
                          {record.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{record.notes}</p>}
                        </div>
                        <button onClick={() => openManagerEdit(record)} className="flex-shrink-0 p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                          <Edit3 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* All Manager Stock Cards with inventory counts */}
                {managerFiltered.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                      All Manager Stock ({managerFiltered.length})
                    </p>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {managerFiltered.map(record => (
                        <ManagerStockCard
                          key={record.id}
                          record={record}
                          inventory={uniformInventory}
                          managerQtyByInventoryId={managerQtyByInventoryId}
                          associateQtyByInventoryId={associateQtyByInventoryId}
                          issuedFromThisManager={issuedQtyByManagerStockId[record.id] || 0}
                          onEdit={openManagerEdit}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
        )}
        {activeTab === 'associateItems' && (associateItemsFiltered.length > 0 ? <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">{associateItemsFiltered.map(record => <AssociateItemCard key={record.id} record={record} associates={associates} onEdit={openAssociateItemEdit} />)}</section> : <EmptyState icon={<UserRound size={28} />} title="No associate uniform items yet" text="Issue uniform items to associates to track what each person currently has, what was returned, and what may need replacement." action="Issue Associate Item" onClick={openAssociateItemAdd} />)}

        {activeAssociates.length === 0 && <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 flex gap-2"><UserRound size={18} className="flex-shrink-0 mt-0.5" />Add active associates first so uniform checks and issued items can be assigned to team members.</section>}
      </main>

      {showModal && <UniformModal record={modalRecord} associates={activeAssociates} onClose={() => setShowModal(false)} />}
      {showInventoryModal && <InventoryModal record={inventoryRecord} onClose={() => setShowInventoryModal(false)} />}
      {showManagerModal && <ManagerStockModal record={managerRecord} inventory={uniformInventory} managerQtyByInventoryId={managerQtyByInventoryId} associateQtyByInventoryId={associateQtyByInventoryId} managers={managers} onClose={() => setShowManagerModal(false)} />}
      {showAssociateItemModal && <AssociateItemModal record={associateItemRecord} associates={activeAssociates} inventory={uniformInventory} managerStock={managerUniformStock} issuedQtyByManagerStockId={issuedQtyByManagerStockId} managerQtyByInventoryId={managerQtyByInventoryId} associateQtyByInventoryId={associateQtyByInventoryId} onClose={() => setShowAssociateItemModal(false)} />}
    </div>
  );
}

function EmptyState({ icon, title, text, action, onClick }) {
  return <section className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center"><div className="w-14 h-14 rounded-2xl bg-red-50 text-primary mx-auto flex items-center justify-center">{icon}</div><h3 className="mt-4 font-bold text-gray-900">{title}</h3><p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">{text}</p><button onClick={onClick} className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">{action}</button></section>;
}

export default Uniforms;
