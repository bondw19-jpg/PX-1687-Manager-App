import React, { useState } from 'react';
import { Plus, X, Search, Pin, PinOff, Pencil, Trash2, StickyNote } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';

const CATEGORIES = ['All Categories', 'General', 'Operations', 'HR', 'Food Safety', 'Reminder', 'Other'];
const CAT_COLORS = {
  General: 'bg-blue-100 text-blue-700',
  Operations: 'bg-green-100 text-green-700',
  HR: 'bg-purple-100 text-purple-700',
  'Food Safety': 'bg-red-100 text-red-700',
  Reminder: 'bg-yellow-100 text-yellow-700',
  Other: 'bg-gray-100 text-gray-600',
};

function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState(note || {
    title: '', category: 'General', body: '', pinned: false
  });

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title is required');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">{note ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Note title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(1).map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    form.category === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Body</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={8}
              placeholder="Note content..."
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm({ ...form, pinned: !form.pinned })}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                form.pinned ? 'bg-accent text-white border-accent' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {form.pinned ? <Pin size={14} /> : <PinOff size={14} />}
              {form.pinned ? 'Pinned' : 'Pin Note'}
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            {note ? 'Save Changes' : '+ New Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NoteCard({ note, onPin, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const preview = note.body?.substring(0, 120);
  const hasMore = note.body?.length > 120;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
      note.pinned ? 'border-accent' : 'border-transparent'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {note.pinned && <Pin size={13} className="text-accent flex-shrink-0" />}
            <h3 className="font-semibold text-sm text-gray-800 truncate">{note.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[note.category] || CAT_COLORS.Other}`}>
              {note.category}
            </span>
            <span className="text-xs text-gray-400">
              {note.createdAt ? format(new Date(note.createdAt), 'MMM d') : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onPin(note)} className="p-1.5 text-gray-400 hover:text-accent rounded-lg">
            {note.pinned ? <Pin size={15} className="text-accent" /> : <PinOff size={15} />}
          </button>
          <button onClick={() => onEdit(note)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg">
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {note.body && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {expanded ? note.body : preview}
            {!expanded && hasMore && '...'}
          </p>
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mt-1 font-medium"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  const {
    teamNotes, myNotes,
    addTeamNote, updateTeamNote, deleteTeamNote,
    addMyNote, updateMyNote, deleteMyNote
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('team');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const notes = activeTab === 'team' ? teamNotes : myNotes;
  const addNote = activeTab === 'team' ? addTeamNote : addMyNote;
  const updateNote = activeTab === 'team' ? updateTeamNote : updateMyNote;
  const deleteNote = activeTab === 'team' ? deleteTeamNote : deleteMyNote;

  const filtered = notes
    .filter(n => {
      const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.body?.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All Categories' || n.category === catFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handlePin = (note) => {
    updateNote(note.id, { pinned: !note.pinned });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) deleteNote(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Notes" onAdd={() => setShowAddModal(true)} />

      <div className="p-4 space-y-3">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'team' ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            👥 Team Notes
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'my' ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            👤 My Notes
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-blue-700">
          <span>👥</span>
          <span>
            <strong>{activeTab === 'team' ? 'Team Notes' : 'My Notes'}</strong>
            {' — '}
            {activeTab === 'team' ? 'shared with all team members' : 'private to you'}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Notes */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-gray-400">
            <div className="text-5xl mb-3">📝</div>
            <p className="font-medium text-gray-500">No Notes Yet</p>
            <p className="text-xs mt-1 mb-4">Click "+ New Note" to create your first note</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Plus size={16} /> New Note
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={handlePin}
                onEdit={setEditNote}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <div className="h-4" />
      </div>

      {showAddModal && (
        <NoteModal
          onClose={() => setShowAddModal(false)}
          onSave={addNote}
        />
      )}
      {editNote && (
        <NoteModal
          note={editNote}
          onClose={() => setEditNote(null)}
          onSave={(data) => updateNote(editNote.id, data)}
        />
      )}
    </div>
  );
}
