import React from 'react';
import { Plus, Printer } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useNotifications, BellButton, NotificationPanel } from './NotificationPanel';

export default function DesktopPageHeader({ title, onAdd, addLabel = 'Add New', onPrint, extra }) {
  const { storeName } = useAppStore();
  const { alerts, unread, open: notifOpen, setOpen: setNotifOpen, markAllRead, markRead, readIds } = useNotifications();

  return (
    <>
      <div className="desktop-page-header hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div>
          <p className="text-xs text-gray-400 font-medium">{storeName}</p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <BellButton
            variant="desktop"
            unread={unread}
            onClick={() => setNotifOpen(true)}
          />

          {/* Optional extra slot (e.g. print button) */}
          {extra}

          {onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <Printer size={16} />
              Print / PDF
            </button>
          )}

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

      <NotificationPanel
        alerts={alerts}
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onMarkAllRead={markAllRead}
        markRead={markRead}
        readIds={readIds}
      />
    </>
  );
}
