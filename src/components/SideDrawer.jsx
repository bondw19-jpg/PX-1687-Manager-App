import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, PhoneMissed, Star, Calendar,
  ClipboardCheck, StickyNote, ListChecks, Megaphone, BookUser,
  Settings, LogOut, X
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

const sections = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ]
  },
  {
    title: 'TEAM',
    items: [
      { label: 'Associates', icon: Users, path: '/team' },
      { label: 'Call-In Tracker', icon: PhoneMissed, path: '/callins' },
      { label: 'Performance', icon: Star, path: '/reviews' },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Calendar', icon: Calendar, path: '/calendar' },
      { label: 'Shift Checklist', icon: ClipboardCheck, path: '/checklist' },
      { label: 'Notes', icon: StickyNote, path: '/notes' },
      { label: 'Tasks & To-Do', icon: ListChecks, path: '/tasks' },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Announcements', icon: Megaphone, path: '/announcements' },
      { label: 'Quick Contacts', icon: BookUser, path: '/contacts' },
    ]
  }
];

export default function SideDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, storeName } = useAppStore();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'B';
  const userName = user?.name || 'Bond';
  const userRole = user?.role || 'Panda Express';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 h-full w-[75%] max-w-[360px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-[-50%]' : 'translate-x-[-200%]'
        }`}
        style={{
          left: isOpen ? '0' : '-100%',
          transform: 'none',
          maxWidth: '280px',
        }}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center gap-3 pt-12">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img src="/panda-icon.svg" alt="Panda" className="w-8 h-8" />
          </div>
          <div className="flex-1 text-white">
            <div className="font-bold text-sm">{storeName}</div>
            <div className="text-xs opacity-80">Manager Hub</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {sections.map(section => (
            <div key={section.title} className="mb-2">
              <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 tracking-wider">
                {section.title}
              </div>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-red-50 text-primary border-r-2 border-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-800 truncate">{userName}</div>
            <div className="text-xs text-accent truncate">{userRole}</div>
          </div>
          <button
            onClick={() => handleNav('/settings')}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => handleNav('/login')}
            className="p-1.5 text-gray-400 hover:text-primary rounded-lg"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
