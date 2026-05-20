import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Sparkles, GitBranch, Eye, ExternalLink,
  CheckCircle2, Clock, ArrowRight, ChevronDown, ChevronUp,
  Star, Zap, Shield, Bug
} from 'lucide-react';

// ─── Changelog Data ───────────────────────────────────────────────────────────
export const UPDATES = [
  {
    version: '2.2.1',
    date: 'May 14, 2026',
    label: 'Latest',
    labelColor: 'bg-green-500',
    summary: '5P7A Daily Plan page with role-gated FOH/BOH checklists, 30-day history, and Uniform Tracker improvements including Back Brace, Item Locator, and simplified dropdowns.',
    changes: [
      { type: 'new',     text: '5P7A Daily Plan — Full daily checklist with 5 Points and day-specific FOH/BOH 7 Action tasks' },
      { type: 'new',     text: 'Role-gated checkoff — Only managers and shift leads can check off tasks; associates see read-only view' },
      { type: 'new',     text: 'Verified by tracking — Each checked item records who verified it and at what time' },
      { type: 'new',     text: 'History tab — View past 30 days of daily checklists with completion percentages' },
      { type: 'new',     text: 'Item Locator — Find which manager has a specific uniform item on hand using dropdown filters' },
      { type: 'new',     text: 'Back Brace added to uniform item list across all Uniform Tracker forms' },
      { type: 'improve', text: 'Size and color fields in Uniform Tracker now use dropdowns (XS–XXXL, standard PX colors)' },
      { type: 'improve', text: 'Manager On-Hand form simplified — clean dropdowns, no mandatory inventory linking' },
      { type: 'fix',     text: 'Fixed Item Locator showing duplicate manager entries — same item/size/color now grouped and quantities added together' },
    ],
  },
  {
    version: '2.2.0',
    date: 'May 8, 2026',
    label: 'Previous',
    labelColor: 'bg-gray-400',
    summary: 'Uniform Tracker restructured with automated inventory system, Associate Items tracking, and improved inventory calculations.',
    changes: [
      { type: 'new',     text: 'Associate Items tracking — Track which uniform items each associate currently has (Active, Returned, Needs Replacement, Lost)' },
      { type: 'new',     text: 'Inventory summary dashboard — Clear breakdown of Store Stock, Manager On-Hand, Issued to Associates, and Available quantities' },
      { type: 'new',     text: 'Automated inventory calculations — Available quantities now automatically update across all tabs' },
      { type: 'improve', text: 'Inventory dropdowns now show current available quantities for each item' },
      { type: 'improve', text: 'Required inventory linking — All Manager Stock and Associate Items must now link to a master inventory item for proper tracking' },
      { type: 'fix',     text: 'Fixed inventory counts not updating when items were added to Manager or Associate tabs' },
      { type: 'fix',     text: 'Removed Pants, Shoes, and Hair Restraint from uniform item dropdown' },
    ],
  },
  {
    version: '2.1.2',
    date: 'Apr 12, 2026',
    label: 'Previous',
    labelColor: 'bg-gray-400',
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
function UpdateModal({ onClose, onDismiss, previewUrl }) {
  const [expandedVersion, setExpandedVersion] = useState(UPDATES[0].version);

  const handlePreview = () => {
    // Open in a mobile-sized popup (iPhone 14 Pro dimensions: 393×852)
    const w = 393;
    const h = 852;
    const left = Math.max(0, Math.round(window.screen.width  / 2 - w / 2));
    const top  = Math.max(0, Math.round(window.screen.height / 2 - h / 2));
    window.open(
      previewUrl,
      'px_preview',
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,noopener,noreferrer`
    );
  };

  // ── Render into document.body via portal so the Header's CSS transform
  //    stacking context cannot clip or mis-position the fixed overlay.
  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slide-up"
        style={{
          background: '#fff',
          borderRadius: '1.25rem 1.25rem 0 0',
          width: '100%',
          maxWidth: '480px',
          height: '82dvh',
          maxHeight: '82dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-br from-primary to-primary-dark p-5 text-white overflow-hidden flex-shrink-0 rounded-t-2xl">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all z-10"
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

        {/* ── Scrollable Changelog ── */}
        <div className="modal-body p-4 space-y-3">
          {UPDATES.map((update) => {
            const isExpanded = expandedVersion === update.version;
            return (
              <div key={update.version} className="border border-gray-100 rounded-xl overflow-hidden">
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

        {/* ── Footer — always pinned at bottom ── */}
        <div className="modal-footer space-y-2">
          <button
            onClick={handlePreview}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-primary-dark shadow-md shadow-red-100 transition-all"
          >
            <Eye size={18} />
            Preview Latest Update
            <ExternalLink size={15} className="opacity-70" />
          </button>
          <button
            onClick={() => { onClose(); onDismiss?.(); }}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

const BANNER_DISMISS_KEY = 'px_banner_dismissed_v';

// ─── Preview Update Banner ─────────────────────────────────────────────────────
export default function PreviewUpdateBanner({ previewUrl }) {
  const latestVersion = UPDATES[0].version;
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(BANNER_DISMISS_KEY) === latestVersion
  );
  const [showModal, setShowModal] = useState(false);

  const dismiss = () => {
    localStorage.setItem(BANNER_DISMISS_KEY, latestVersion);
    setDismissed(true);
  };

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
              ✨ v2.2.1 — New Version Live · 5P7A Daily Plan
            </p>
            <p className="text-white/70 text-[11px] leading-tight mt-0.5">
              FOH/BOH daily checklist, role-gated checkoff, and history tracking are now available
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
            onClick={dismiss}
            className="relative z-10 p-1 text-white/60 hover:text-white flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {showModal && (
        <UpdateModal
          onClose={() => setShowModal(false)}
          onDismiss={dismiss}
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
