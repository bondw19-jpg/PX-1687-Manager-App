import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { registerConfirmHost } from '../lib/uiDialog';

export default function ConfirmHost() {
  const [state, setState] = useState(null); // { opts, resolve } | null

  useEffect(() => {
    return registerConfirmHost((opts) => {
      return new Promise((resolve) => {
        setState({ opts, resolve });
      });
    });
  }, []);

  if (!state) return null;

  const { opts, resolve } = state;
  const {
    title = 'Are you sure?',
    message = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
  } = opts;

  const finish = (val) => {
    resolve(val);
    setState(null);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10001] bg-black/50 flex items-end lg:items-center justify-center animate-fade-in"
      onClick={e => e.target === e.currentTarget && finish(false)}
    >
      <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full lg:max-w-sm animate-slide-up overflow-hidden pb-[env(safe-area-inset-bottom,0px)] lg:pb-0">
        <div className="p-5 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
            <AlertTriangle size={24} className={danger ? 'text-red-600' : 'text-amber-500'} />
          </div>
          <h2 className="font-bold text-lg text-gray-900 mb-1">{title}</h2>
          {message && <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{message}</p>}
        </div>
        <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => finish(false)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={() => finish(true)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-semibold ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
