import React, { useState } from 'react';
import {
  X, Sparkles, GitBranch, Eye, ExternalLink,
  CheckCircle2, Clock, ArrowRight, ChevronDown, ChevronUp,
  Star, Zap, Shield, Bug
} from 'lucide-react';

// ─── Changelog Data ───────────────────────────────────────────────────────────
export const UPDATES = [
  {
    version: '2.1.2',
    date: 'Apr 12, 2026',
    label: 'Latest',
    labelColor: 'bg-green-500',
    summary: 'Team Activity Feed on Dashboard, alphabetical associate lists, and bell icon removed in favour of the new feed.',
    changes: [
      { type: 'new',     text: 'Team Updates feed on Dashboard — see every call-in, task, announcement, note, review & calendar event in real time' },
      { type: 'new',     text: 'Tap any feed card to view full details and navigate directly to the module' },
      { type: 'new',     text: 'Per-user read tracking — cards disappear after you tap them; other managers still see unread cards until they tap' },
      { type: 'new',     text: 'Work File deep-link — tapping a Work File feed card opens that associate\'s Work File modal directly' },
      { type: 'improve', text: 'All associate lists and dropdowns now sorted A → Z across Associates, Call-Ins, Tasks & Reviews' },
      { type: 'improve', text: 'Notification bell removed from header — Team Updates feed replaces it on the Dashboard' },
      { type: 'fix',     text: 'Fixed work file "Go to" button staying on Dashboard (route was /associates, corrected to /team)' },
      { type: 'fix',     text: 'Fixed read state not clearing when user uid resolved after login' },
    ],
  },
  {
    version: '2.1.1',
    date: 'Apr 1, 2026',
    label: 'Previous',
    labelColor: 'bg-gray-400',
    summary: 'Full PX Attendance Point System, auto point recovery, per-associate print reports, and Print/PDF across all modules.',
    changes: [
      { type: 'new',     text: 'PX Attendance Point System — Tardiness 0.5/1/1.5 pts, Early Dep 1/2 pts, Absence 1/2/3 pts, Protected 0 pts' },
      { type: 'new',     text: 'Automatic 30/60-day clean-streak point recovery (−0.5 after 30 days, −1.0 after 60 days)' },
      { type: 'new',     text: 'Progressive discipline: Coaching → First Written → Final Written → Termination Eligible' },
      { type: 'new',     text: 'Per-associate printable attendance report with 90-day incident table, expired records & signature block' },
      { type: 'new',     text: 'Print report entry points: associate picker, leaderboard row printer icon & call-in detail modal' },
      { type: 'new',     text: 'Live Notification Bell (mobile + desktop) with slide-in panel and per-user read state' },
      { type: 'new',     text: 'Print / PDF button added to all modules (Associates, Call-Ins, Notes, Tasks, Reviews, Contacts, Announcements, Checklist, Calendar)' },
      { type: 'new',     text: 'Notes file & image attachments with upload progress bar' },
      { type: 'improve', text: 'Call-Ins leaderboard shows effective (post-recovery) points with green recovery chip' },
      { type: 'improve', text: 'Auto work-file entry created when discipline milestone is reached' },
    ],
  },
  {
    version: '2.1.0',
    date: 'Mar 9, 2026',
    label: 'Older',
    labelColor: 'bg-gray-300',
    summary: 'Manager Hub fully launched with all core modules.',
    changes: [
      { type: 'new',  text: 'Dashboard with live stats, events & call-in feed' },
      { type: 'new',  text: 'Associates roster with Work File modal & print PDF' },
      { type: 'new',  text: 'Call-In Tracker with bar chart frequency analysis' },
      { type: 'new',  text: 'Team + My Calendar with month grid view' },
      { type: 'new',  text: 'Opening / Mid / Closing shift checklists with history' },
      { type: 'new',  text: 'Team + My Notes with categories & pin toggle' },
      { type: 'new',  text: 'Performance Reviews with per-category star ratings' },
      { type: 'new',  text: 'Tasks & To-Do with Kanban-style sections' },
      { type: 'new',  text: 'Quick Contacts with pre-seeded DM, HR, IT & Health Dept' },
      { type: 'new',  text: 'Announcements board with priority levels' },
      { type: 'new',  text: 'Demo Login — no Firebase account needed' },
      { type: 'new',  text: 'PWA manifest — installable on iOS & Android' },
    ],
  },
  {
    version: '2.0.0',
    date: 'Mar 8, 2026',
    label: 'Older',
    labelColor: 'bg-gray-300',
    summary: 'Initial project scaffold and base configuration.',
    changes: [
      { type: 'new',  text: 'React 18 + Vite 5 project setup' },
      { type: 'new',  text: 'Tailwind CSS with Panda brand tokens' },
      { type: 'new',  text: 'Zustand state with localStorage persistence' },
      { type: 'new',  text: 'Firebase config wired and ready' },
      { type: 'new',  text: 'React Router v6 navigation shell' },
    ],
  },
];

const TYPE_META = {
  new:     { icon: <Sparkles size={13} />,     bg: 'bg-green-100',  text: 'text-green-700',  label: 'NEW'  },
  improve: { icon: <Zap size={13} />,          bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'IMPROVED' },
  fix:     { icon: <Bug size={13} />,          bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'FIX'  },
  security:{ icon: <Shield size={13} />,       bg: 'bg-purple-100', text: 'text-purple-700', label: 'SECURITY' },
};

// ─── Update Modal ──────────────────────────────────────────────────────────────
function UpdateModal({ onClose, previewUrl }) {
  const [expandedVersion, setExpandedVersion] = useState(UPDATES[0].version);

  const handlePreview = () => {
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-primary to-primary-dark rounded-t-2xl p-5 text-white overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles size={22} className="text-accent" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">What's New</p>
              <h2 className="font-bold text-lg leading-tight">App Update Available</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <GitBranch size={13} />
              v{UPDATES[0].version}
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <Clock size={13} />
              {UPDATES[0].date}
            </div>
            <div className="flex-1" />
            <span className="bg-green-400 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Live
            </span>
          </div>
        </div>

        {/* Scrollable Changelog */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {UPDATES.map((update) => {
            const isExpanded = expandedVersion === update.version;
            return (
              <div key={update.version} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Version header */}
                <button
                  onClick={() => setExpandedVersion(isExpanded ? null : update.version)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                >
                  <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${update.labelColor}`}>
                    {update.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800">v{update.version}</p>
                    <p className="text-xs text-gray-400">{update.date}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 font-medium">
                    {update.changes.length} changes
                  </span>
                  {isExpanded
                    ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  }
                </button>

                {/* Change list */}
                {isExpanded && (
                  <div className="divide-y divide-gray-50">
                    <p className="px-4 py-2 text-xs text-gray-500 italic">{update.summary}</p>
                    {update.changes.map((change, i) => {
                      const meta = TYPE_META[change.type] || TYPE_META.new;
                      return (
                        <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                          <span className={`flex items-center gap-1 ${meta.bg} ${meta.text} text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0`}>
                            {meta.icon}
                            {meta.label}
                          </span>
                          <p className="text-sm text-gray-700 leading-snug">{change.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handlePreview}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-primary-dark shadow-md shadow-red-100 transition-all"
          >
            <Eye size={18} />
            Preview Latest Update
            <ExternalLink size={15} className="opacity-70" />
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Preview Update Banner ─────────────────────────────────────────────────────
export default function PreviewUpdateBanner({ previewUrl }) {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {/* Floating Banner */}
      <div className="mx-4 mt-2 mb-1">
        <div className="relative bg-gradient-to-r from-primary to-primary-dark rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-red-200 overflow-hidden">
          {/* Decorative shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Pulsing dot */}
          <div className="relative flex-shrink-0">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-60" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-white font-bold text-xs leading-tight">
              ✨ v2.1.2 — Team Updates Feed + Alphabetical Lists
            </p>
            <p className="text-white/70 text-[11px] leading-tight mt-0.5">
              Real-time team activity feed, deep-links & per-user read tracking
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="relative z-10 flex items-center gap-1.5 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 active:bg-gray-100 transition-all shadow-sm"
          >
            <Eye size={13} />
            Preview
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="relative z-10 p-1 text-white/60 hover:text-white flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {showModal && (
        <UpdateModal
          onClose={() => setShowModal(false)}
          previewUrl={previewUrl}
        />
      )}
    </>
  );
}

// ─── Standalone Preview Button (for Header) ────────────────────────────────────
export function PreviewButton({ previewUrl }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
      >
        <Eye size={14} />
        Preview
        {/* Green live dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-primary" />
      </button>

      {showModal && (
        <UpdateModal
          onClose={() => setShowModal(false)}
          previewUrl={previewUrl}
        />
      )}
    </>
  );
}
