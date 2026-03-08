import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus, Bell } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import SideDrawer from './SideDrawer';

export default function Header({ title, subtitle, showAdd = false, onAdd, rightIcon, onRightClick }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { storeName } = useAppStore();

  return (
    <>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-primary z-30 shadow-md"
        style={{ left: '50%', transform: 'translateX(-50%)' }}>
        <div className="flex items-center justify-between px-4 py-3 pt-10">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-white rounded-lg active:bg-white/20"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 mx-3 text-white">
            <div className="text-[10px] font-medium opacity-80 flex items-center gap-1">
              <img src="/panda-icon.svg" alt="" className="w-4 h-4" />
              {storeName}
            </div>
            <div className="font-bold text-base leading-tight">{title || subtitle}</div>
          </div>

          <div className="flex items-center gap-2">
            {rightIcon ? (
              <button
                onClick={onRightClick}
                className="w-8 h-8 flex items-center justify-center text-white rounded-lg active:bg-white/20"
              >
                {rightIcon}
              </button>
            ) : (
              <button className="w-8 h-8 flex items-center justify-center text-white rounded-lg active:bg-white/20 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
            )}
            <button
              onClick={onAdd}
              className="w-8 h-8 flex items-center justify-center bg-accent text-white rounded-lg active:bg-yellow-600 shadow-sm"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
