import React from 'react';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';
import NoteUploadProgress from './NoteUploadProgress';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar — visible lg+ via CSS (#desktop-sidebar display:flex) */}
      <DesktopSidebar />

      {/* Main content */}
      {/* Mobile: padded top (header) + bottom (nav) | Desktop: padded left (sidebar) */}
      <main className="layout-main pt-[72px] pb-[72px] min-h-screen lg:pt-0 lg:pb-0 lg:ml-[260px]">
        {children}
      </main>

      {/* Bottom nav — hidden on desktop via CSS (.bottom-nav display:none) */}
      <div className="bottom-nav">
        <BottomNav />
      </div>

      {/* Attachment upload progress bar — floats above bottom nav */}
      <NoteUploadProgress />
    </div>
  );
}
