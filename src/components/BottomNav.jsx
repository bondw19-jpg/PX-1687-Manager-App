import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Users, PhoneMissed, Calendar, ClipboardCheck,
  StickyNote, Star, ListChecks, BookUser, Menu, Plus, Bell
} from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'team', label: 'Team', icon: Users, path: '/team' },
  { id: 'callins', label: 'Call-Ins', icon: PhoneMissed, path: '/callins' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
  { id: 'checklist', label: 'Checklist', icon: ClipboardCheck, path: '/checklist' },
  { id: 'notes', label: 'Notes', icon: StickyNote, path: '/notes' },
  { id: 'reviews', label: 'Reviews', icon: Star, path: '/reviews' },
  { id: 'tasks', label: 'Tasks', icon: ListChecks, path: '/tasks' },
  { id: 'contacts', label: 'Contacts', icon: BookUser, path: '/contacts' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-40 safe-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path ||
            (tab.path !== '/' && location.pathname.startsWith(tab.path));
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-1 py-1 min-w-0 flex-1 rounded-lg transition-all ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-medium leading-tight truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
