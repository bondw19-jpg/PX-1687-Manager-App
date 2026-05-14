import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(() => r.update(), 60 * 60 * 1000);
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <RefreshCw size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">New version available</p>
          <p className="text-xs text-white/60 leading-tight mt-0.5">Tap update to get the latest features</p>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 active:opacity-80"
        >
          Update
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-white/40 hover:text-white flex-shrink-0 p-1"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
