import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, PhoneMissed, Star, Calendar,
  ClipboardCheck, StickyNote, ListChecks, Megaphone, BookUser, Shirt,
  Settings, LogOut, ChevronRight, HardDrive, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

const ADMIN_EMAIL = 'bondw19@gmail.com';

const sections = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard',       icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    title: 'TEAM',
    items: [
      { label: 'Associates',      icon: Users,           path: '/team' },
      { label: 'Call-In Tracker', icon: PhoneMissed,     path: '/callins' },
      { label: 'Performance',     icon: Star,            path: '/reviews' },
      { label: 'Uniform Tracker', icon: Shirt,           path: '/uniforms' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Calendar',        icon: Calendar,        path: '/calendar' },
      { label: 'Shift Checklist', icon: ClipboardCheck,  path: '/checklist' },
      { label: 'Notes',           icon: StickyNote,      path: '/notes' },
      { label: 'Tasks & To-Do',   icon: ListChecks,      path: '/tasks' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Announcements',   icon: Megaphone,       path: '/announcements' },
      { label: 'Quick Contacts',  icon: BookUser,        path: '/contacts' },
      { label: 'Backup & Restore', icon: HardDrive,      path: '/backup' },
      { label: 'Settings',         icon: Settings,       path: '/settings' },
      { label: 'Admin Panel',      icon: ShieldCheck,    path: '/admin',  adminOnly: true },
    ],
  },
];

export default function DesktopSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, storeName } = useAppStore();

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const userInitial = user?.name?.[0]?.toUpperCase() || 'B';
  const userName    = user?.name  || 'Bond';
  const userRole    = user?.role  || 'Store Manager';

  return (
    <div
      id="desktop-sidebar"
      className="fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200 z-40 flex flex-col shadow-sm"
    >
      {/* Brand header */}
      <div className="bg-primary px-5 py-5 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <img src="/panda-icon-192.png" alt="Panda Express" className="w-8 h-8 object-contain" />
        </div>
        <div className="text-white min-w-0">
          <div className="font-bold text-sm leading-tight truncate">{storeName}</div>
          <div className="text-xs opacity-70 mt-0.5">Manager Hub</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map(section => (
          <div key={section.title} className="mb-3">
            <div className="px-5 py-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
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
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-red-50 text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r-full" />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={item.adminOnly ? 'text-amber-500' : isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.adminOnly && !isActive && (
                    <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>
                  )}
                  {isActive && <ChevronRight size={14} className="text-primary opacity-60" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-800 truncate">{userName}</div>
            <div className="text-xs text-accent truncate">{userRole}</div>
          </div>
          <button
            onClick={() => navigate('/login')}
            title="Sign out"
            className="p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
