import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PhoneCall, StickyNote, ClipboardList, Menu } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { canAccessPath } from '../lib/permissions';

// The most-used destinations live on the bar; everything else is one tap away
// under "More" (the side drawer). Keeps taps accurate on small phones.
const primaryTabs = [
  { id: 'home',    label: 'Home',    icon: Home,          path: '/' },
  { id: 'callin',  label: 'Call-In', icon: PhoneCall,     path: '/callins' },
  { id: 'note',    label: 'Note',    icon: StickyNote,    path: '/notes' },
  { id: 'fivepsa', label: '5P7A',    icon: ClipboardList, path: '/daily-plan' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, mobileMenuOpen, setMobileMenuOpen } = useAppStore();

  const visibleTabs = primaryTabs.filter(tab => canAccessPath(user, tab.path));

  const onPrimary = visibleTabs.some(tab =>
    location.pathname === tab.path ||
    (tab.path !== '/' && location.pathname.startsWith(tab.path))
  );
  const moreActive = mobileMenuOpen || !onPrimary;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-40 safe-bottom lg:hidden">
      <div className="flex items-center justify-around px-1 py-1">
        {visibleTabs.map(tab => {
          const Icon     = tab.icon;
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
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-tight truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-0.5 px-1 py-1 min-w-0 flex-1 rounded-lg transition-all ${
            moreActive ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <Menu size={22} strokeWidth={moreActive ? 2.5 : 2} />
          <span className="text-[10px] font-medium leading-tight truncate w-full text-center">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
