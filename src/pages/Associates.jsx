import React, { useState } from 'react';
import { Eye, FileText, Pencil, Trash2, Search, Star, X, Plus, Phone, Calendar, User, Users, UserPlus } from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import WorkFileModal from '../components/WorkFileModal';

const POSITIONS = ['All Positions', 'FOH', 'BOH', 'Cook', 'Shift Lead', 'Manager'];
const POSITION_COLORS = {
  'FOH':        'bg-blue-50 text-blue-700 border-blue-200',
  'BOH':        'bg-orange-50 text-orange-700 border-orange-200',
  'Cook':       'bg-amber-50 text-amber-700 border-amber-200',
  'Shift Lead': 'bg-purple-50 text-purple-700 border-purple-200',
  'Manager':    'bg-red-50 text-primary border-red-200',
};
const STATUSES = ['All Status', 'Active', 'Inactive', 'On Leave'];
const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

function getColor(name) {
  const idx = (name?.charCodeAt(0) || 0) % COLORS.length;
  return COLORS[idx];
}

function StarRating({ rating, onRate }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onRate && onRate(i)} className="focus:outline-none">
          <Star
            size={14}
            className={i <= rating ? 'text-accent fill-accent' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}

function AssociateModal({ associate, onClose, onSave }) {
  const [form, setForm] = useState(associate || {
    name: '', employeeId: '', position: 'FOH',
    telephone: '', birthday: '', hireDate: '',
    status: 'active', cleanStatus: 'clean', starRating: 0
  });

  const handleSave = () => {
    if (!form.name.trim()) return alert('Name is required');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">
            {associate ? 'Edit Associate' : 'Add Associate'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Employee ID</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="ID#"
                value={form.employeeId}
                onChange={e => setForm({...form, employeeId: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Position</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                value={form.position}
                onChange={e => setForm({...form, position: e.target.value})}
              >
                {POSITIONS.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Telephone</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Phone"
                value={form.telephone}
                onChange={e => setForm({...form, telephone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Birthday</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="MM/DD"
                value={form.birthday}
                onChange={e => setForm({...form, birthday: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Hire Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.hireDate}
                onChange={e => setForm({...form, hireDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Clean Status</label>
            <div className="flex gap-2">
              {['clean','warning','terminated'].map(s => (
                <button
                  key={s}
                  onClick={() => setForm({...form, cleanStatus: s})}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.cleanStatus === s
                      ? s === 'clean' ? 'bg-green-500 text-white border-green-500'
                        : s === 'warning' ? 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {s === 'clean' ? '✅ Clean' : s === 'warning' ? '⚠️ Warning' : '🚫 Term.'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm active:bg-primary-dark"
          >
            {associate ? 'Save Changes' : 'Add Associate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewAssociateModal({ associate, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">Associate Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${getColor(associate.name)} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
              {associate.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">{associate.name}</h3>
              <p className="text-sm text-gray-500">{associate.position}</p>
              <div className="mt-1">
                <StarRating rating={associate.starRating || 0} />
              </div>
              {associate.createdBy?.name && (
                <p className="flex items-center gap-1 text-xs text-blue-500 mt-1">
                  <User size={11} /> Added by {associate.createdBy.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Employee ID', value: associate.employeeId, icon: User },
              { label: 'Phone', value: associate.telephone, icon: Phone },
              { label: 'Birthday', value: associate.birthday, icon: Calendar },
              { label: 'Hire Date', value: associate.hireDate, icon: Calendar },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              associate.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {associate.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              associate.cleanStatus === 'clean' ? 'bg-green-100 text-green-700' :
              associate.cleanStatus === 'warning' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {associate.cleanStatus === 'clean' ? '✅ Clean' :
               associate.cleanStatus === 'warning' ? '⚠️ Warning' : '🚫 Terminated'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Associates() {
  const { associates, addAssociate, updateAssociate, deleteAssociate } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [positionFilter, setPositionFilter] = useState('All Positions');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAssociate, setEditAssociate] = useState(null);
  const [viewAssociate, setViewAssociate] = useState(null);
  const [workFileAssociate, setWorkFileAssociate] = useState(null);

  const filtered = associates.filter(a => {
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' ||
      (statusFilter === 'Active' && a.status === 'active') ||
      (statusFilter === 'Inactive' && a.status === 'inactive') ||
      (statusFilter === 'On Leave' && a.status === 'on_leave');
    const matchPos = positionFilter === 'All Positions' || a.position === positionFilter;
    return matchSearch && matchStatus && matchPos;
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this associate?')) deleteAssociate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Associates" onAdd={() => setShowAddModal(true)} />
      <DesktopPageHeader title="Associates" onAdd={() => setShowAddModal(true)} addLabel="+ Add Associate" />

      <div className="p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
            placeholder="Search associates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={positionFilter}
            onChange={e => setPositionFilter(e.target.value)}
          >
            {POSITIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Associate Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Users size={36} className="text-gray-300" />
            </div>
            {associates.length === 0 ? (
              <>
                <h3 className="text-base font-semibold text-gray-700 mb-1">No Associates Yet</h3>
                <p className="text-sm text-gray-400 mb-5">Add your first associate to start building your team roster.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm active:bg-primary-dark"
                >
                  <UserPlus size={16} />
                  Add First Associate
                </button>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-700 mb-1">No Results Found</h3>
                <p className="text-sm text-gray-400 mb-5">Try adjusting your search or filter to find associates.</p>
                <button
                  onClick={() => { setSearch(''); setStatusFilter('All Status'); setPositionFilter('All Positions'); }}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          filtered.map(assoc => (
            <div key={assoc.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 ${getColor(assoc.name)} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {assoc.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-800">{assoc.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      assoc.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {assoc.status === 'active' ? 'Active' : assoc.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${POSITION_COLORS[assoc.position] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {assoc.position}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      assoc.cleanStatus === 'clean' ? 'bg-green-50 text-green-700 border-green-200' :
                      assoc.cleanStatus === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {assoc.cleanStatus === 'clean' ? '✅ Clean' :
                       assoc.cleanStatus === 'warning' ? '⚠️ Warning' : '🚫 Term.'}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <StarRating rating={assoc.starRating || 0} onRate={(r) => updateAssociate(assoc.id, { starRating: r })} />
                  </div>
                  {assoc.createdBy?.name && (
                    <p className="flex items-center gap-1 text-[10px] text-blue-500 mt-1">
                      <User size={9} /> Added by {assoc.createdBy.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setViewAssociate(assoc)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex-1 justify-center"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => setWorkFileAssociate(assoc)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex-1 justify-center"
                >
                  <FileText size={14} /> Work File
                </button>
                <button
                  onClick={() => setEditAssociate(assoc)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex-1 justify-center"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(assoc.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-medium justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}

        <div className="h-4" />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AssociateModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => addAssociate(data)}
        />
      )}
      {editAssociate && (
        <AssociateModal
          associate={editAssociate}
          onClose={() => setEditAssociate(null)}
          onSave={(data) => updateAssociate(editAssociate.id, data)}
        />
      )}
      {viewAssociate && (
        <ViewAssociateModal
          associate={viewAssociate}
          onClose={() => setViewAssociate(null)}
        />
      )}
      {workFileAssociate && (
        <WorkFileModal
          associate={workFileAssociate}
          onClose={() => setWorkFileAssociate(null)}
        />
      )}
    </div>
  );
}
