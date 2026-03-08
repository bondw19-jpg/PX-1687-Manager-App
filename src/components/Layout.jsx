import React from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main content - padded for header (top) and bottom nav */}
      <main className="pt-[72px] pb-[72px] min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
