import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Plus, X, Search, Pencil, Printer, ArrowLeft, UserPlus, ClipboardList,
  Archive, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Calendar, Trash2,
} from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { printInterviewSheet } from '../lib/printReport';
import {
  INTERVIEW_STEPS, IMPERMISSIBLE_WARNING, COMPETENCIES, ALSO_CONSIDER,
  RATING_SCALE, AVAILABILITY_DAYS, CANDIDATE_STATUSES, candidateStatusMeta,
  ratingLabel, scoreInterview,
} from '../lib/interviewContent';

const STATUS_CLASS = {
  gray:   'bg-gray-100 text-gray-700',
  blue:   'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
};

function StatusBadge({ status }) {
  const meta = candidateStatusMeta(status);
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CLASS[meta.color] || STATUS_CLASS.gray}`}>
      {meta.label}
    </span>
  );
}

// ─── Candidate add/edit modal ───────────────────────────────────────────────
function CandidateModal({ candidate, onClose, onSave }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState(candidate || {
    name: '',
    position: '',
    region: '',
    date: today,
    notes: '',
    status: 'new',
    availability: AVAILABILITY_DAYS.reduce((acc, d) => ({ ...acc, [d.key]: '' }), { openSchedule: false }),
  });

  const setAvail = (key, val) =>
    setForm(f => ({ ...f, availability: { ...(f.availability || {}), [key]: val } }));

  const handleSave = () => {
    if (!form.name.trim()) return alert('Enter a candidate name');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full lg:max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-lg text-gray-800">{candidate ? 'Edit Candidate' : 'New Candidate'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="modal-body p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Candidate Name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Position Applying For</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="e.g. Team Member"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Region</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="Region"
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Weekly Availability</label>
            <div className="space-y-2">
              {AVAILABILITY_DAYS.map(d => (
                <div key={d.key} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-24 flex-shrink-0">{d.label}</span>
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm"
                    placeholder="Hours available (e.g. 9am–5pm)"
                    value={form.availability?.[d.key] || ''}
                    onChange={e => setAvail(d.key, e.target.value)}
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={!!form.availability?.openSchedule}
                  onChange={e => setAvail('openSchedule', e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">Open Schedule (fully flexible)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Additional Notes</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Notes about this candidate"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100">Cancel</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Rating picker (1–5) ────────────────────────────────────────────────────
function RatingPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RATING_SCALE.map(r => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`flex-1 min-w-[90px] px-2 py-2 rounded-lg border text-xs font-semibold transition-all ${
            value === r.value
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
          }`}
        >
          <span className="block text-base font-bold">{r.value}</span>
          {r.label}
        </button>
      ))}
    </div>
  );
}

// ─── Interview form (full screen) ───────────────────────────────────────────
function InterviewForm({ candidate, interview, currentUserName, onBack, onSave }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState(interview || {
    candidateId: candidate.id,
    candidateName: candidate.name,
    position: candidate.position || '',
    region: candidate.region || '',
    interviewerName: currentUserName || '',
    date: today,
    ratings: {},
    starNotes: {},
    alsoConsiderNotes: '',
    additionalNotes: '',
  });

  const score = useMemo(() => scoreInterview(form.ratings), [form.ratings]);

  const setRating = (key, val) => setForm(f => ({ ...f, ratings: { ...f.ratings, [key]: val } }));
  const setNote = (key, val) => setForm(f => ({ ...f, starNotes: { ...f.starNotes, [key]: val } }));

  const handleSave = () => {
    onSave({ ...form });
    onBack();
  };

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-4xl mx-auto pb-32">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary mb-4">
        <ArrowLeft size={16} /> Back to candidate
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">
        {interview ? 'Edit Interview' : 'New Interview'} — {candidate.name}
      </h1>
      <p className="text-sm text-gray-500 mb-5">Follow the steps and score each competency 1–5.</p>

      {/* Header fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Interviewer Name</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={form.interviewerName} onChange={e => setForm({ ...form, interviewerName: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Interview Date</label>
          <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Position Applying For</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Region</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
        </div>
      </div>

      {/* Process steps */}
      <details className="bg-white rounded-xl border border-gray-200 p-4 mb-4" open>
        <summary className="font-bold text-gray-800 cursor-pointer">Interview Process — 6 Steps</summary>
        <ol className="mt-3 space-y-2">
          {INTERVIEW_STEPS.map((s, i) => (
            <li key={i} className="text-sm">
              <span className="font-semibold text-gray-800">Step {i + 1}: {s.title}</span>
              {s.points.length > 0 && (
                <ul className="list-disc ml-6 mt-1 text-gray-600 space-y-0.5">
                  {s.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </details>

      {/* Impermissible warning */}
      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
        <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 font-medium">{IMPERMISSIBLE_WARNING}</p>
      </div>

      {/* Competencies */}
      <div className="space-y-4">
        {COMPETENCIES.map(c => {
          const r = Number(form.ratings[c.key]) || 0;
          return (
            <div key={c.key} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{c.label}</h3>
                {r > 0 && <span className="text-xs font-semibold text-primary">{r}/5 · {ratingLabel(r)}</span>}
              </div>
              <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1 mb-3">
                {c.questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">STAR Notes (Situation, Task, Action, Result)</label>
              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
                placeholder="Document the candidate's example…"
                value={form.starNotes[c.key] || ''}
                onChange={e => setNote(c.key, e.target.value)}
              />
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Rating</label>
              <RatingPicker value={r} onChange={v => setRating(c.key, v)} />
            </div>
          );
        })}
      </div>

      {/* Also consider */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
        <h3 className="font-bold text-gray-900 mb-1">Also Consider</h3>
        <p className="text-xs text-gray-500 mb-2">{ALSO_CONSIDER.join(' · ')}</p>
        <textarea
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Notes on communication, listening, presentation, body language…"
          value={form.alsoConsiderNotes}
          onChange={e => setForm({ ...form, alsoConsiderNotes: e.target.value })}
        />
      </div>

      {/* Additional notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
        <h3 className="font-bold text-gray-900 mb-2">Additional Notes</h3>
        <textarea
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Anything else worth recording…"
          value={form.additionalNotes}
          onChange={e => setForm({ ...form, additionalNotes: e.target.value })}
        />
      </div>

      {/* Sticky score bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-white border-t border-gray-200 px-4 lg:px-8 py-3 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 leading-none">{score.total}</div>
              <div className="text-[10px] text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 leading-none">{score.averageText}</div>
              <div className="text-[10px] text-gray-400">Avg ({score.count})</div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              score.count === 0 ? 'bg-gray-100 text-gray-500'
                : score.recommend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {score.count === 0 ? null : score.recommend ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              <span className="truncate">{score.recommendation}</span>
            </div>
          </div>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark flex-shrink-0">
            Save Interview
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Candidate detail ───────────────────────────────────────────────────────
function CandidateDetail({ candidate, interviews, onBack, onEdit, onArchive, onRestore, onSetStatus, onNewInterview, onEditInterview }) {
  const list = interviews
    .filter(i => i.candidateId === candidate.id)
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
  const { deleteInterview } = useAppStore();

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary mb-4">
        <ArrowLeft size={16} /> All candidates
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{candidate.name}</h1>
              <StatusBadge status={candidate.status} />
              {candidate.archived && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Archived</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {candidate.position || 'No position'}{candidate.region ? ` · ${candidate.region}` : ''}
            </p>
          </div>
          <button onClick={() => onEdit(candidate)} className="p-2 text-gray-400 hover:text-primary rounded-lg" title="Edit candidate">
            <Pencil size={18} />
          </button>
        </div>

        {/* Availability */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Availability</p>
          {candidate.availability?.openSchedule ? (
            <span className="text-sm text-green-700 font-medium">Open Schedule (fully flexible)</span>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
              {AVAILABILITY_DAYS.map(d => (
                <div key={d.key} className="flex gap-1.5">
                  <span className="text-gray-400">{d.label.slice(0, 3)}:</span>
                  <span className="text-gray-700">{candidate.availability?.[d.key] || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {candidate.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{candidate.notes}</p>
          </div>
        )}

        {/* Pipeline status + archive */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Pipeline status:</span>
          <select
            value={candidate.status || 'new'}
            onChange={e => onSetStatus(candidate.id, e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-white"
          >
            {CANDIDATE_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <div className="flex-1" />
          {candidate.archived ? (
            <button onClick={() => onRestore(candidate.id)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
              <Archive size={15} /> Restore
            </button>
          ) : (
            <button onClick={() => onArchive(candidate.id)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600">
              <Archive size={15} /> Archive
            </button>
          )}
        </div>
      </div>

      {/* Interviews */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-gray-900">Interviews ({list.length})</h2>
        <button onClick={() => onNewInterview(candidate)} className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark">
          <Plus size={16} /> New Interview
        </button>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
          <ClipboardList size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No interviews yet. Start the first round.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(iv => {
            const score = scoreInterview(iv.ratings);
            return (
              <div key={iv.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} /> {iv.date || '—'}
                      {iv.interviewerName && <span>· {iv.interviewerName}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-semibold text-gray-800">Total {score.total} · Avg {score.averageText}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        score.count === 0 ? 'bg-gray-100 text-gray-500'
                          : score.recommend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{score.recommendation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => onEditInterview(iv)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold">
                    <Pencil size={15} /> Edit
                  </button>
                  <button onClick={() => printInterviewSheet(iv, candidate)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-semibold">
                    <Printer size={15} /> Print
                  </button>
                  <button onClick={() => { if (confirm('Remove this interview record? This cannot be undone.')) deleteInterview(iv.id); }} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold" title="Delete interview">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function Interviews() {
  const {
    user, candidates, interviews,
    addCandidate, updateCandidate, archiveCandidate, restoreCandidate,
    addInterview, updateInterview,
  } = useAppStore();

  const [view, setView] = useState('list'); // 'list' | 'detail' | 'form'
  const [selectedId, setSelectedId] = useState(null);
  const [editingInterview, setEditingInterview] = useState(null);
  const [candidateModal, setCandidateModal] = useState(null); // {candidate} | {} | null
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const currentUserName = user?.name || user?.email?.split('@')[0] || '';
  const selected = candidates.find(c => c.id === selectedId) || null;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (candidates || [])
      .filter(c => showArchived ? c.archived : !c.archived)
      .filter(c => !q || (c.name || '').toLowerCase().includes(q) || (c.position || '').toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [candidates, search, showArchived]);

  const latestRecommendation = (candidateId) => {
    const list = interviews
      .filter(i => i.candidateId === candidateId)
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    if (list.length === 0) return null;
    return scoreInterview(list[0].ratings);
  };

  const saveCandidate = (form) => {
    if (form.id) updateCandidate(form.id, form);
    else {
      const created = addCandidate(form);
      if (created) setSelectedId(created.id);
    }
  };

  const saveInterview = (form) => {
    if (form.id) updateInterview(form.id, form);
    else addInterview(form);
  };

  const goDetail = (id) => { setSelectedId(id); setView('detail'); };
  const startNewInterview = (candidate) => { setSelectedId(candidate.id); setEditingInterview(null); setView('form'); };
  const editInterview = (iv) => { setEditingInterview(iv); setView('form'); };

  // ── Form view ──
  if (view === 'form' && selected) {
    return (
      <>
        <Header title="Interview" />
        <div className="lg:pt-0">
          <InterviewForm
            candidate={selected}
            interview={editingInterview}
            currentUserName={currentUserName}
            onBack={() => { setEditingInterview(null); setView('detail'); }}
            onSave={saveInterview}
          />
        </div>
      </>
    );
  }

  // ── Detail view ──
  if (view === 'detail' && selected) {
    return (
      <>
        <Header title={selected.name} showAdd onAdd={() => startNewInterview(selected)} />
        <DesktopPageHeader title="Candidate" onAdd={() => startNewInterview(selected)} addLabel="New Interview" />
        <CandidateDetail
          candidate={selected}
          interviews={interviews}
          onBack={() => { setSelectedId(null); setView('list'); }}
          onEdit={(c) => setCandidateModal({ candidate: c })}
          onArchive={archiveCandidate}
          onRestore={restoreCandidate}
          onSetStatus={(id, status) => updateCandidate(id, { status })}
          onNewInterview={startNewInterview}
          onEditInterview={editInterview}
        />
        {candidateModal && (
          <CandidateModal
            candidate={candidateModal.candidate}
            onClose={() => setCandidateModal(null)}
            onSave={saveCandidate}
          />
        )}
      </>
    );
  }

  // ── List view ──
  return (
    <>
      <Header title="Interviews" showAdd onAdd={() => setCandidateModal({})} />
      <DesktopPageHeader title="Candidate Interviews" onAdd={() => setCandidateModal({})} addLabel="Add Candidate" />

      <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-3xl mx-auto">
        {/* Search + filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm"
              placeholder="Search candidates…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowArchived(s => !s)}
            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border ${
              showArchived ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {showArchived ? 'Archived' : 'Active'}
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
            <UserPlus size={36} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-3">{showArchived ? 'No archived candidates.' : 'No candidates yet.'}</p>
            {!showArchived && (
              <button onClick={() => setCandidateModal({})} className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold">
                <Plus size={16} /> Add your first candidate
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map(c => {
              const count = interviews.filter(i => i.candidateId === c.id).length;
              const rec = latestRecommendation(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => goDetail(c.id)}
                  className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-primary/40 hover:shadow-sm transition-all flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                    {(c.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 truncate">{c.name}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {c.position || 'No position'} · {count} interview{count !== 1 ? 's' : ''}
                      {rec && rec.count > 0 && (
                        <span className={rec.recommend ? 'text-green-600' : 'text-red-600'}> · {rec.recommendation}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {candidateModal && (
        <CandidateModal
          candidate={candidateModal.candidate}
          onClose={() => setCandidateModal(null)}
          onSave={saveCandidate}
        />
      )}
    </>
  );
}
