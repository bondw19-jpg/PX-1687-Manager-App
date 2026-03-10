import React, { useState } from 'react';
import { Plus, X, Trash2, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';

function AnnouncementModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', body: '', priority: 'Normal' });

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title is required');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">New Announcement</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Announcement title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Priority</label>
            <div className="flex gap-2">
              {['Normal', 'Important', 'Urgent'].map(p => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.priority === p
                      ? p === 'Urgent' ? 'bg-red-600 text-white border-red-600'
                        : p === 'Important' ? 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Message</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={5}
              placeholder="Announcement message..."
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            Post Announcement
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Announcements() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);

  const PRIORITY_COLORS = {
    Normal: 'bg-blue-50 border-blue-200 text-blue-700',
    Important: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    Urgent: 'bg-red-50 border-red-200 text-red-700',
  };
  const PRIORITY_LEFT = {
    Normal: 'bg-blue-400',
    Important: 'bg-yellow-400',
    Urgent: 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Announcements" onAdd={() => setShowAdd(true)} />
      <DesktopPageHeader title="Announcements" onAdd={() => setShowAdd(true)} addLabel="+ New Announcement" />

      <div className="p-4 space-y-3">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-xl p-10 flex flex-col items-center text-gray-400">
            <Megaphone size={40} className="mb-3 text-gray-200" />
            <p className="font-medium text-gray-500">No Announcements</p>
            <p className="text-xs mt-1 mb-4">Post announcements for your team</p>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Plus size={16} /> New Announcement
            </button>
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${PRIORITY_LEFT[ann.priority] || PRIORITY_LEFT.Normal}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${PRIORITY_COLORS[ann.priority] || PRIORITY_COLORS.Normal}`}>
                      {ann.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {ann.createdAt ? format(new Date(ann.createdAt), 'MMM d, yyyy') : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{ann.title}</h3>
                  {ann.body && (
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{ann.body}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
        <div className="h-4" />
      </div>

      {showAdd && (
        <AnnouncementModal
          onClose={() => setShowAdd(false)}
          onSave={addAnnouncement}
        />
      )}
    </div>
  );
}
