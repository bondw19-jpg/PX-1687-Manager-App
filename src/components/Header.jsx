import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import SideDrawer from './SideDrawer';
import { PreviewButton } from './PreviewUpdateBanner';

const PREVIEW_URL = 'https://4173-il9welzg75eglof37wb6r-ea026bf9.sandbox.novita.ai';

export default function Header({ title, subtitle, showAdd = false, onAdd, rightIcon, onRightClick }) {
  const { storeName, mobileMenuOpen, setMobileMenuOpen } = useAppStore();

  return (
    <>
      {/* Mobile header — hidden on lg+ (desktop uses DesktopPageHeader + DesktopSidebar) */}
      <div
        className="mobile-header fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-primary z-30 shadow-md lg:hidden"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 pt-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-white rounded-lg active:bg-white/20"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 mx-3 text-white min-w-0">
            <div className="text-[10px] font-medium opacity-80 flex items-center gap-1 min-w-0">
              <img src="/panda-icon-192.png" alt="" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{storeName}</span>
            </div>
            <div className="font-bold text-base leading-tight truncate">{title || subtitle}</div>
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
              <PreviewButton previewUrl={PREVIEW_URL} />
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

      <SideDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
