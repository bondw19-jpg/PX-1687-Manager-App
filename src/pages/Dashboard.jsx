import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PhoneMissed, Calendar, Pin, UserCheck, ChevronRight, Phone, Cloud, CloudOff } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import PreviewUpdateBanner from '../components/PreviewUpdateBanner';

const PREVIEW_URL = 'https://4173-il9welzg75eglof37wb6r-ea026bf9.sandbox.novita.ai';

function StatCard({ icon, count, label, color, bgColor }) {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { associates, callIns, teamEvents, teamNotes, myEvents, dbReady, dbMode, user } = useAppStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const currentMonth = format(new Date(), 'yyyy-MM');

  const activeAssociates = associates.filter(a => a.status === 'active').length;
  const callInsThisMonth = callIns.filter(c => c.date?.startsWith(currentMonth)).length;

  const allEvents = [...teamEvents, ...myEvents];
  const todayEvents = allEvents.filter(e => e.date === today);
  const pinnedNotes = teamNotes.filter(n => n.pinned).length;
  const totalAssociates = associates.length;

  const recentCallIns = [...callIns].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  const upcomingEvents = allEvents
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

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

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users size={22} className="text-red-500" />}
            count={activeAssociates}
            label="Active Associates"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={<PhoneMissed size={22} className="text-orange-500" />}
            count={callInsThisMonth}
            label="Call-Ins This Month"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Calendar size={22} className="text-green-500" />}
            count={todayEvents.length}
            label="Today's Events"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Pin size={22} className="text-blue-500" />}
            count={pinnedNotes}
            label="Pinned Notes"
            bgColor="bg-blue-50"
          />
        </div>

        {/* Total Associates */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<UserCheck size={22} className="text-purple-500" />}
            count={totalAssociates}
            label="Total Associates"
            bgColor="bg-purple-50"
          />
        </div>

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
                {todayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      event.type === 'Meeting' ? 'bg-blue-500' :
                      event.type === 'Inspection' ? 'bg-red-500' :
                      event.type === 'Training' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                      {event.time && <p className="text-xs text-gray-500">{event.time}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {event.type || 'Event'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Call-Ins */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <PhoneMissed size={18} className="text-primary" />
              Recent Call-Ins
            </div>
            <button
              onClick={() => navigate('/callins')}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      callIn.type === 'Excused' ? 'bg-green-100 text-green-700' :
                      callIn.type === 'No-Show' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {callIn.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
