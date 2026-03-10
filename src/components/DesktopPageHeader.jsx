import React from 'react';
import { Bell, Plus } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function DesktopPageHeader({ title, onAdd, addLabel = 'Add New' }) {
  const { storeName } = useAppStore();

  return (
    <div className="desktop-page-header hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-20">
      <div>
        <p className="text-xs text-gray-400 font-medium">{storeName}</p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
        </button>

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus size={16} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
