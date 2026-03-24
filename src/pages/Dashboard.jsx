import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PhoneMissed, Calendar, Pin, UserCheck, ChevronRight, Phone, Cloud, CloudOff, X, Clock, Tag, FileText, Lock, Shield, AlertTriangle } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import PreviewUpdateBanner from '../components/PreviewUpdateBanner';

const PREVIEW_URL = 'https://4173-il9welzg75eglof37wb6r-ea026bf9.sandbox.novita.ai';

// ── Color map matching CalendarPage ──────────────────────────────────────────
const TYPE_COLORS = {
  Meeting:    { dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-500' },
  Inspection: { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',     bar: 'bg-red-500'  },
  Training:   { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
  Other:      { dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-600',   bar: 'bg-gray-400' },
};
const typeColors = (type) => TYPE_COLORS[type] || TYPE_COLORS.Other;

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, count, label, bgColor }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{count}</div>
        <div className="text-xs text-gray-500 leading-tight">{label}</div>
      </div>
    </div>
  );
}

// ── Event Detail Modal ────────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }) {
  if (!event) return null;
  const colors = typeColors(event.type);

  // Format time display
  const formatTime = (t) => {
    if (!t) return null;
    try {
      const [h, m] = t.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour = h % 12 || 12;
      return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
    } catch {
      return t;
    }
  };

  // Format date display
  const formatDate = (d) => {
    if (!d) return '';
    try {
      return format(new Date(d + 'T00:00:00'), 'EEEE, MMMM d, yyyy');
    } catch {
      return d;
    }
  };

  const isPrivate = event.id?.startsWith('myevent_');

  return (
    <div
      className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up">
        {/* Colored top bar */}
        <div className={`h-1.5 w-full rounded-t-2xl ${colors.bar}`} />

        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors.badge}`}>
                {event.type || 'Event'}
              </span>
              {isPrivate && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium flex items-center gap-1">
                  <Lock size={10} /> My Event
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="px-4 pb-6 space-y-3">
          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar size={15} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Date</p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(event.date)}</p>
            </div>
          </div>

          {/* Time */}
          {event.time && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Time</p>
                <p className="text-sm font-semibold text-gray-800">{formatTime(event.time)}</p>
              </div>
            </div>
          )}

          {/* Type */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Tag size={15} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Type</p>
              <p className="text-sm font-semibold text-gray-800">{event.type || 'Event'}</p>
            </div>
          </div>

          {/* Notes / Description */}
          {event.notes && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText size={15} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{event.notes}</p>
              </div>
            </div>
          )}

          {/* No notes placeholder */}
          {!event.notes && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText size={15} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Description</p>
                <p className="text-sm text-gray-400 italic">No description added.</p>
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="px-4 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { associates, callIns, teamEvents, teamNotes, myEvents, dbReady, dbMode, user } = useAppStore();

  const [selectedEvent, setSelectedEvent] = useState(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const currentMonth = format(new Date(), 'yyyy-MM');

  const activeAssociates = associates.filter(a => a.status === 'active').length;
  const callInsThisMonth = callIns.filter(c => c.date?.startsWith(currentMonth)).length;

  const allEvents = [...teamEvents, ...myEvents];
  const todayEvents = allEvents
    .filter(e => e.date === today)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const pinnedNotes = teamNotes.filter(n => n.pinned).length;
  const totalAssociates = associates.length;

  const recentCallIns = [...callIns].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  // ── Attendance analytics ──────────────────────────────────────────────────
  const POINTS_MAP = { 'No-Show': 3, 'Unexcused': 2, 'Late/Tardy': 1, 'Excused': 0 };
  const cutoff90 = subDays(new Date(), 90);

  // Top 3 by incidents this month
  const topAbsent = (() => {
    const map = {};
    callIns.filter(c => c.date?.startsWith(currentMonth)).forEach(c => {
      if (!c.associateName) return;
      if (!map[c.associateName]) map[c.associateName] = { name: c.associateName, count: 0, pts: 0 };
      map[c.associateName].count++;
      map[c.associateName].pts += (c.points ?? POINTS_MAP[c.type] ?? 0);
    });
    return Object.values(map).sort((a, b) => b.pts - a.pts).slice(0, 3);
  })();

  // At-risk associates (5+ pts in 90 days)
  const atRisk = associates.filter(a => {
    const pts = callIns
      .filter(c => c.associateId === a.id && isAfter(new Date(c.date || 0), cutoff90))
      .reduce((s, c) => s + (c.points ?? POINTS_MAP[c.type] ?? 0), 0);
    return pts >= 5;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" />
      <DesktopPageHeader title="Dashboard" />

      <PreviewUpdateBanner previewUrl={PREVIEW_URL} />

      {/* Cloud Sync Status Banner */}
      {dbReady && dbMode === 'firestore' ? (
        <div className="mx-4 mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700">
          <Cloud size={13} className="flex-shrink-0" />
          <span><strong>Cloud Sync Active</strong> · Real-time sync with Firebase</span>
        </div>
      ) : user && user.uid !== 'demo_user' ? (
        <div className="mx-4 mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">
          <CloudOff size={13} className="flex-shrink-0" />
          <span>Local mode · <a href="/backup" className="underline font-semibold">Connect cloud sync</a> in Backup &amp; Restore</span>
        </div>
      ) : null}

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">
        {/* Stats Grid — 2 col mobile, 5 col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard icon={<Users size={22} className="text-red-500" />}     count={activeAssociates}    label="Active Associates"    bgColor="bg-red-50" />
          <StatCard icon={<UserCheck size={22} className="text-purple-500" />} count={totalAssociates}   label="Total Associates"     bgColor="bg-purple-50" />
          <StatCard icon={<PhoneMissed size={22} className="text-orange-500" />} count={callInsThisMonth} label="Call-Ins This Month" bgColor="bg-orange-50" />
          <StatCard icon={<Calendar size={22} className="text-green-500" />} count={todayEvents.length} label="Today's Events"       bgColor="bg-green-50" />
          <StatCard icon={<Pin size={22} className="text-blue-500" />}       count={pinnedNotes}        label="Pinned Notes"         bgColor="bg-blue-50" />
        </div>

        {/* Desktop 2-col layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">

        {/* Today's Events */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Calendar size={18} className="text-primary" />
              Today's Events
            </div>
            <button
              onClick={() => navigate('/calendar')}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="p-4">
            {todayEvents.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                  <Calendar size={28} className="text-red-300" />
                </div>
                <p className="text-sm">No events today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayEvents.map(event => {
                  const colors = typeColors(event.type);
                  const isPrivate = event.id?.startsWith('myevent_');
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
                    >
                      {/* Color dot */}
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`} />

                      {/* Title + time */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {event.time && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={10} className="text-gray-400" />
                              {event.time}
                            </span>
                          )}
                          {event.notes && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              {event.time && <span className="text-gray-300">·</span>}
                              <FileText size={10} />
                              Notes
                            </span>
                          )}
                          {isPrivate && (
                            <span className="text-xs text-purple-400 flex items-center gap-1">
                              {(event.time || event.notes) && <span className="text-gray-300">·</span>}
                              <Lock size={10} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Type badge + chevron */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                          {event.type || 'Event'}
                        </span>
                        <ChevronRight size={14} className="text-gray-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Call-Ins */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <PhoneMissed size={18} className="text-primary" />
              Recent Attendance Log
            </div>
            <button onClick={() => navigate('/callins')}
              className="text-xs text-primary font-medium flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {/* At-risk alert */}
          {atRisk.length > 0 && (
            <div className="mx-4 mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
              <AlertTriangle size={13} className="flex-shrink-0" />
              <span><strong>{atRisk.length} associate{atRisk.length > 1 ? 's' : ''}</strong> at critical attendance points (5+) — action required</span>
              <button onClick={() => navigate('/callins')} className="ml-auto underline font-semibold">Review</button>
            </div>
          )}

          {/* Top absentees this month */}
          {topAbsent.length > 0 && (
            <div className="px-4 pt-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Top Absences This Month</p>
              <div className="flex gap-2 flex-wrap">
                {topAbsent.map(r => (
                  <div key={r.name} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${
                    r.pts >= 5 ? 'bg-red-50 border-red-200 text-red-700' :
                    r.pts >= 3 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                    'bg-gray-50 border-gray-200 text-gray-700'
                  }`}>
                    <Shield size={11} />
                    {r.name} · {r.pts}pt{r.pts !== 1 ? 's' : ''}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            {recentCallIns.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Phone size={28} className="text-gray-300" />
                </div>
                <p className="text-sm">No recent call-ins</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCallIns.map(callIn => (
                  <div key={callIn.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {callIn.associateName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{callIn.associateName}</p>
                      <p className="text-xs text-gray-500">{callIn.date} • {callIn.time || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        callIn.type === 'Excused'    ? 'bg-green-100 text-green-700' :
                        callIn.type === 'No-Show'    ? 'bg-red-100 text-red-700' :
                        callIn.type === 'Late/Tardy' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{callIn.type}</span>
                      {(callIn.points ?? POINTS_MAP[callIn.type] ?? 0) > 0 && (
                        <span className="text-[10px] text-gray-400">+{callIn.points ?? POINTS_MAP[callIn.type]}pt</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        </div>{/* end desktop 2-col */}

        <div className="h-4" />
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
