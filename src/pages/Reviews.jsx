import React, { useState } from 'react';
import { Star, Plus, X, Search, Pencil, Trash2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { openPrintWindow, statsRowHtml, starsHtml } from '../lib/printReport';

const REVIEW_CATS = ['Attendance', 'Attitude', 'Performance', 'Teamwork', 'Food Safety'];

function StarPicker({ value, onChange, size = 24 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} className="focus:outline-none">
          <Star
            size={size}
            className={i <= value ? 'text-accent fill-accent' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ review, associates, onClose, onSave }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState(review || {
    associateId: associates[0]?.id || '',
    associateName: associates[0]?.name || '',
    date: today,
    overallRating: 3,
    categories: { Attendance: 3, Attitude: 3, Performance: 3, Teamwork: 3, 'Food Safety': 3 },
    comments: '',
  });

  const handleAssociateChange = (id) => {
    const a = associates.find(x => x.id === id);
    setForm({ ...form, associateId: id, associateName: a?.name || '' });
  };

  const setCatRating = (cat, val) => {
    setForm({ ...form, categories: { ...form.categories, [cat]: val } });
  };

  const handleSave = () => {
    if (!form.associateName) return alert('Select an associate');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">{review ? 'Edit Review' : 'New Review'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Associate */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Associate *</label>
            {associates.length > 0 ? (
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                value={form.associateId}
                onChange={e => handleAssociateChange(e.target.value)}
              >
                {[...associates].sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            ) : (
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Associate name"
                value={form.associateName}
                onChange={e => setForm({ ...form, associateName: e.target.value })}
              />
            )}
          </div>

          {/* Date & Overall */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Review Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Overall Rating</label>
              <StarPicker value={form.overallRating} onChange={v => setForm({ ...form, overallRating: v })} size={20} />
            </div>
          </div>

          {/* Per Category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Category Ratings</label>
            <div className="space-y-3">
              {REVIEW_CATS.map(cat => (
                <div key={cat} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-sm font-medium text-gray-700">{cat}</span>
                  <StarPicker
                    value={form.categories[cat] || 3}
                    onChange={v => setCatRating(cat, v)}
                    size={18}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Comments / Narrative</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={5}
              placeholder="Overall performance summary..."
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            {review ? 'Save Changes' : 'Save Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { reviews, addReview, updateReview, deleteReview, associates } = useAppStore();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editReview, setEditReview] = useState(null);

  const filtered = reviews
    .filter(r => r.associateName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDelete = (id) => {
    if (window.confirm('Delete this review?')) deleteReview(id);
  };

  const handlePrint = () => {
    const list = filtered;
    const avgRating = list.length
      ? (list.reduce((s, r) => s + (r.overallRating || 0), 0) / list.length).toFixed(1)
      : 0;
    const html = `
      ${statsRowHtml([
        { value: list.length, label: 'Total Reviews' },
        { value: avgRating + ' / 5', label: 'Average Rating' },
        { value: list.filter(r => (r.overallRating || 0) >= 4).length, label: '4-5 Star' },
        { value: list.filter(r => (r.overallRating || 0) <= 2).length, label: '1-2 Star' },
      ])}
      <h2 class="section-title">Performance Reviews</h2>
      <table>
        <thead><tr>
          <th>Associate</th><th>Date</th><th>Overall</th>
          <th>Attendance</th><th>Attitude</th><th>Performance</th><th>Teamwork</th><th>Food Safety</th>
          <th>Comments</th>
        </tr></thead>
        <tbody>
          ${list.map(r => '<tr>' +
            '<td><strong>' + (r.associateName || '') + '</strong></td>' +
            '<td>' + (r.date || '') + '</td>' +
            '<td>' + starsHtml(r.overallRating || 0) + '</td>' +
            (r.categories ? Object.values(r.categories).map(v => '<td style="text-align:center">' + starsHtml(v, 5) + '</td>').join('') : '<td colspan="5">\u2014</td>') +
            '<td style="font-size:10px;color:#555">' + (r.comments || '') + '</td>' +
          '</tr>').join('')}
        </tbody>
      </table>`;
    openPrintWindow({ title: 'Performance Reviews Report', subtitle: list.length + ' reviews', html });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Performance Reviews" onAdd={() => setShowAdd(true)} />
      <DesktopPageHeader title="Performance Reviews" onAdd={() => setShowAdd(true)} addLabel="+ New Review" onPrint={handlePrint} />

      <div className="desktop-page-content p-4 lg:p-0 space-y-3">
        {/* Search + Print */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
              placeholder="Search associate..."
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

        {/* Reviews */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-10 flex flex-col items-center text-gray-400">
            <div className="text-5xl mb-3">⭐</div>
            <p className="font-medium text-gray-500">No Performance Reviews Yet</p>
            <p className="text-xs mt-1 mb-4">Click "+ New Review" to add an evaluation</p>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Star size={16} /> New Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map(review => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.associateName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800">{review.associateName}</h3>
                    <p className="text-xs text-gray-500">{review.date}</p>
                    <div className="mt-1">
                      <StarPicker value={review.overallRating || 0} onChange={() => {}} size={16} />
                    </div>
                    {review.comments && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{review.comments}</p>
                    )}

                    {/* Category scores */}
                    {review.categories && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(review.categories).map(([cat, score]) => (
                          <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {cat}: {score}/5
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditReview(review)}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2 bg-primary text-white rounded-xl text-xs font-medium"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-4" />
      </div>

      {showAdd && (
        <ReviewModal
          associates={associates}
          onClose={() => setShowAdd(false)}
          onSave={addReview}
        />
      )}
      {editReview && (
        <ReviewModal
          review={editReview}
          associates={associates}
          onClose={() => setEditReview(null)}
          onSave={(data) => updateReview(editReview.id, data)}
        />
      )}
    </div>
  );
}
