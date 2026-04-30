import React, { useState } from 'react';
import { Plus, X, Pencil, Trash2, Search, Phone, Mail, Printer } from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { openPrintWindow, statsRowHtml } from '../lib/printReport';

const CONTACT_ICONS = {
  building: '🏢',
  hospital: '🏥',
  hr: '👔',
  computer: '💻',
  default: '📞',
};

const ROLE_COLORS = {
  'District Manager': 'text-orange-500',
  'Health Department': 'text-red-500',
  'HR': 'text-purple-500',
  'IT Support': 'text-blue-500',
};

function ContactModal({ contact, onClose, onSave }) {
  const [form, setForm] = useState(contact || {
    name: '', role: '', phone: '', email: '', description: '', icon: 'default'
  });

  const handleSave = () => {
    if (!form.name.trim()) return alert('Name is required');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-lg text-gray-800">{contact ? 'Edit Contact' : 'New Contact'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="modal-body p-4 space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Name *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Contact name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Role / Title</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="e.g., District Manager"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Phone number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description / Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={2}
              placeholder="Additional notes..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Icon</label>
            <div className="flex gap-2">
              {Object.entries(CONTACT_ICONS).map(([key, emoji]) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, icon: key })}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                    form.icon === key ? 'border-primary bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            {contact ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useAppStore();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')) deleteContact(id);
  };

  const handlePrint = () => {
    const html = `
      ${statsRowHtml([{ value: contacts.length, label: 'Total Contacts' }])}
      <h2 class="section-title">Quick Contacts Directory</h2>
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Phone</th><th>Email</th><th>Notes</th></tr></thead>
        <tbody>
          ${contacts.map(c => '<tr>' +
            '<td><strong>' + (c.name || '') + '</strong></td>' +
            '<td>' + (c.role || '\u2014') + '</td>' +
            '<td>' + (c.phone || '\u2014') + '</td>' +
            '<td>' + (c.email || '\u2014') + '</td>' +
            '<td style="font-size:10px;color:#555">' + (c.description || '') + '</td>' +
          '</tr>').join('')}
        </tbody>
      </table>`;
    openPrintWindow({ title: 'Quick Contacts Directory', html });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Quick Contacts" onAdd={() => setShowAdd(true)} />
      <DesktopPageHeader title="Quick Contacts" onAdd={() => setShowAdd(true)} addLabel="+ Add Contact" onPrint={handlePrint} />

      <div className="desktop-page-content p-4 lg:p-0 space-y-3">
        {/* Search + Print */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
              placeholder="Search contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex-shrink-0"
          >
            <Printer size={14} /> Print
          </button>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(contact => (
          <div key={contact.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {CONTACT_ICONS[contact.icon] || CONTACT_ICONS.default}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm">{contact.name}</h3>
                <p className={`text-xs font-medium ${ROLE_COLORS[contact.role] || 'text-orange-500'}`}>
                  {contact.role}
                </p>
              </div>
            </div>

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 py-1.5 text-sm text-blue-600 hover:text-blue-800"
              >
                <Phone size={14} className="flex-shrink-0" />
                <span>{contact.phone}</span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 py-1.5 text-sm text-blue-600 hover:text-blue-800"
              >
                <Mail size={14} className="flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}
            {contact.description && !contact.phone && !contact.email && (
              <p className="text-xs text-gray-400 italic py-1.5">{contact.description}</p>
            )}
            {contact.description && (contact.phone || contact.email) && (
              <p className="text-xs text-gray-400 mt-1">{contact.description}</p>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditContact(contact)}
                className="flex items-center gap-1.5 flex-1 justify-center py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                className="w-10 h-9 flex items-center justify-center bg-primary text-white rounded-xl"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-gray-400">
            <div className="text-4xl mb-3">📞</div>
            <p className="text-sm font-medium text-gray-500">No Contacts Found</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-3 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              + Add Contact
            </button>
          </div>
        )}

        <div className="h-4" />
      </div>

      {showAdd && (
        <ContactModal
          onClose={() => setShowAdd(false)}
          onSave={addContact}
        />
      )}
      {editContact && (
        <ContactModal
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSave={(data) => updateContact(editContact.id, data)}
        />
      )}
    </div>
  );
}
