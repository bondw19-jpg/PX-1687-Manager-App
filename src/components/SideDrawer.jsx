import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, PhoneMissed, Star, Calendar,
  ClipboardCheck, StickyNote, ListChecks, Megaphone, BookUser,
  Settings, LogOut, X, HardDrive, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

const ADMIN_EMAIL = 'bondw19@gmail.com';

const sections = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard',        icon: LayoutDashboard, path: '/' },
    ]
  },
  {
    title: 'TEAM',
    items: [
      { label: 'Associates',       icon: Users,           path: '/team' },
      { label: 'Call-In Tracker',  icon: PhoneMissed,     path: '/callins' },
      { label: 'Performance',      icon: Star,            path: '/reviews' },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Calendar',         icon: Calendar,        path: '/calendar' },
      { label: 'Shift Checklist',  icon: ClipboardCheck,  path: '/checklist' },
      { label: 'Notes',            icon: StickyNote,      path: '/notes' },
      { label: 'Tasks & To-Do',    icon: ListChecks,      path: '/tasks' },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Announcements',    icon: Megaphone,       path: '/announcements' },
      { label: 'Quick Contacts',   icon: BookUser,        path: '/contacts' },
      { label: 'Backup & Restore', icon: HardDrive,       path: '/backup' },
      { label: 'Settings',         icon: Settings,        path: '/settings' },
      { label: 'Admin Panel',      icon: ShieldCheck,     path: '/admin', adminOnly: true },
    ]
  }
];

export default function SideDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, storeName } = useAppStore();

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'B';
  const userName    = user?.name || 'Bond';
  const userRole    = user?.role || 'Panda Express';

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

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
        className={`fixed top-0 h-full w-[75%] max-w-[280px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ left: 0 }}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center gap-3 pt-12 flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/panda-icon-192.png" alt="Panda Express" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 text-white min-w-0">
            <div className="font-bold text-sm truncate">{storeName}</div>
            <div className="text-xs opacity-80">Manager Hub</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {sections.map(section => (
            <div key={section.title} className="mb-2">
              <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                {section.title}
              </div>
              {section.items.map(item => {
                // Hide admin-only items for non-admin users
                if (item.adminOnly && !isAdmin) return null;
                const Icon     = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all relative ${
                      isActive
                        ? 'bg-red-50 text-primary border-r-2 border-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={item.adminOnly ? 'text-amber-500' : isActive ? 'text-primary' : 'text-gray-400'}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.adminOnly && !isActive && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                        ADMIN
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer — user info + sign out */}
        <div className="border-t border-gray-100 p-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-800 truncate">{userName}</div>
            <div className="text-xs text-accent truncate">{userRole}</div>
          </div>
          <button
            onClick={() => handleNav('/login')}
            title="Sign out"
            className="p-1.5 text-gray-400 hover:text-primary rounded-lg"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
