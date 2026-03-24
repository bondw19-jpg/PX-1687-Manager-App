import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Calendar, RefreshCw, Clock, FileText, Trash2, User } from 'lucide-react';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';

const EVENT_TYPES = ['Meeting', 'Inspection', 'Training', 'Other'];
const EVENT_COLORS = {
  Meeting: 'bg-blue-500',
  Inspection: 'bg-red-500',
  Training: 'bg-green-500',
  Other: 'bg-gray-400',
};

// ── Event Detail Modal ───────────────────────────────────────────────────────
function EventDetailModal({ event, onClose, onDelete }) {
  if (!event) return null;

  const colorClass = EVENT_COLORS[event.type] || 'bg-gray-400';

  const handleDelete = () => {
    if (window.confirm('Delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up">
        {/* Header stripe */}
        <div className={`h-2 w-full rounded-t-2xl ${colorClass}`} />
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${colorClass}`}>
            {event.type}
          </span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="desktop-page-content p-4 lg:p-0 space-y-4">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-800 leading-snug">{event.title}</h2>

          {/* Date & Time */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={15} className="text-primary shrink-0" />
              <span>{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={15} className="text-primary shrink-0" />
                <span>{event.time}</span>
              </div>
            )}
          </div>

          {/* Creator */}
          {event.createdBy?.name && (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 rounded-xl px-3 py-2">
              <User size={13} className="shrink-0" />
              Added by <strong>{event.createdBy.name}</strong>
            </div>
          )}

          {/* Notes / Description */}
          {event.notes ? (
            <div className="bg-gray-50 rounded-xl px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5">
                <FileText size={13} />
                Notes
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{event.notes}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl px-3 py-3 text-xs text-gray-400 italic">
              No notes added for this event.
            </div>
          )}

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Trash2 size={15} />
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}

function AddEventModal({ selectedDate, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: 'Meeting',
    notes: '',
  });

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title is required');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">New Event</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Event title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Time</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Type</label>
            <div className="flex gap-2">
              {EVENT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.type === t ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={3}
              placeholder="Additional notes..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { teamEvents, myEvents, addTeamEvent, deleteTeamEvent, addMyEvent, deleteMyEvent, dbMode, dbReady, dbConnecting, needsRelogin, connectFirestore, user } = useAppStore();
  const isCloudSync = dbReady && dbMode === 'firestore';
  const isRealUser  = user && user.uid && user.uid !== 'demo_user';
  const isSyncing   = isRealUser && !isCloudSync;
  const [activeTab, setActiveTab] = useState('team');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailEvent, setDetailEvent]   = useState(null); // event tapped in upcoming list

  const events = activeTab === 'team' ? teamEvents : myEvents;
  const addEvent = activeTab === 'team' ? addTeamEvent : addMyEvent;
  const deleteEvent = activeTab === 'team' ? deleteTeamEvent : deleteMyEvent;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart);

  const today = format(new Date(), 'yyyy-MM-dd');

  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  };

  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="min-h-screen bg-background">
      <Header title="Calendar" onAdd={() => setShowAddModal(true)} />
      <DesktopPageHeader title="Calendar" onAdd={() => setShowAddModal(true)} addLabel="+ Add Event" />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">

        {/* Desktop: left=tabs+calendar+sync, right=upcoming (sticky) */}
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 space-y-4 lg:space-y-0">
          <div className="space-y-4">
          {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'team' ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            👥 Team Calendar
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'my' ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            👤 My Calendar
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-blue-700">
          <span>👥</span>
          <span>
            <strong>{activeTab === 'team' ? 'Team Calendar' : 'My Calendar'}</strong>
            {' — '}
            {activeTab === 'team'
              ? (isCloudSync ? '☁️ synced across all devices' : 'events visible to all team members')
              : (isCloudSync ? '🔒 private · backed up to your account' : 'private to you only')
            }
          </span>
        </div>

        {/* ── Syncing banner (My Calendar tab, real user, not yet connected) ── */}
        {activeTab === 'my' && isRealUser && (
          <div className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 text-xs ${
            isCloudSync
              ? 'bg-green-50 border border-green-100 text-green-700'
              : needsRelogin
              ? 'bg-red-50 border border-red-100 text-red-700'
              : 'bg-amber-50 border border-amber-100 text-amber-700'
          }`}>
            <div className="flex items-center gap-2">
              {isCloudSync ? (
                <span>☁️ <strong>Cloud sync active</strong> — {myEvents?.length || 0} event{myEvents?.length !== 1 ? 's' : ''} backed up to your account</span>
              ) : needsRelogin ? (
                <span>🔐 <strong>Session expired</strong> — please sign out and sign in again to sync your calendar</span>
              ) : dbConnecting ? (
                <>
                  <RefreshCw size={13} className="animate-spin shrink-0" />
                  <span><strong>Connecting to cloud…</strong> Loading your private events</span>
                </>
              ) : (
                <span>⚠️ <strong>Not synced yet</strong> — tap to load {myEvents?.length || 0} event{myEvents?.length !== 1 ? 's' : ''} from cloud</span>
              )}
            </div>
            {!isCloudSync && !needsRelogin && (
              <button
                onClick={() => connectFirestore()}
                disabled={dbConnecting}
                className="shrink-0 flex items-center gap-1 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-800 px-2 py-1 rounded-lg font-semibold transition-colors"
              >
                <RefreshCw size={11} className={dbConnecting ? 'animate-spin' : ''} />
                {dbConnecting ? 'Syncing…' : 'Sync to Cloud'}
              </button>
            )}
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
              <ChevronLeft size={20} />
            </button>
            <h2 className="font-bold text-gray-800">{format(currentDate, 'MMMM yyyy')}</h2>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-medium text-gray-600"
            >
              Today
            </button>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-1">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Empty cells for start */}
            {Array.from({ length: startDow }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDate(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = selectedDate === dateStr;
              const isTodayDate = isToday(day);

              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setShowAddModal(true);
                  }}
                  className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isSelected ? 'bg-primary text-white' :
                    isTodayDate ? 'border-2 border-primary text-primary font-bold' :
                    'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-sm leading-none">{format(day, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' : EVENT_COLORS[e.type] || 'bg-gray-400'
                        }`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

          </div>{/* end left col */}

          {/* Right col — upcoming events sticky */}
          <div className="lg:sticky lg:top-4">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">
            <Calendar size={18} className="text-primary" />
            Upcoming Events
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-400">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                <Calendar size={28} className="text-gray-200" />
              </div>
              <p className="text-sm font-medium">No upcoming events</p>
              <p className="text-xs mt-1">Click a day on the calendar to add one!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => setDetailEvent(event)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <div className={`w-2 h-10 rounded-full flex-shrink-0 ${EVENT_COLORS[event.type] || 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.date}{event.time ? ` at ${event.time}` : ''}
                      {event.notes ? <span className="ml-2 text-gray-400">· has notes</span> : ''}
                      {event.createdBy?.name && activeTab === 'team' && (
                        <span className="ml-2 text-blue-500">· by {event.createdBy.name}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${EVENT_COLORS[event.type] || 'bg-gray-400'}`}>
                      {event.type}
                    </span>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
          </div>{/* end right col */}
        </div>{/* end desktop grid */}

        <div className="h-4" />
      </div>

      {showAddModal && (
        <AddEventModal
          selectedDate={selectedDate}
          onClose={() => { setShowAddModal(false); setSelectedDate(null); }}
          onSave={addEvent}
        />
      )}

      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onDelete={(id) => { deleteEvent(id); setDetailEvent(null); }}
        />
      )}
    </div>
  );
}
