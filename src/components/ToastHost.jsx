import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { registerToastHost } from '../lib/uiDialog';

const STYLES = {
  success: { icon: CheckCircle2, ring: 'border-green-200',  bg: 'bg-white',  iconColor: 'text-green-600' },
  error:   { icon: XCircle,      ring: 'border-red-200',    bg: 'bg-white',  iconColor: 'text-red-600' },
  warning: { icon: AlertTriangle, ring: 'border-amber-200', bg: 'bg-white',  iconColor: 'text-amber-500' },
  info:    { icon: Info,         ring: 'border-gray-200',   bg: 'bg-white',  iconColor: 'text-gray-500' },
};

let counter = 0;

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(list => list.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    return registerToastHost(({ message, type = 'info', duration }) => {
      const id = ++counter;
      const ms = duration || (type === 'error' ? 4500 : 3000);
      setToasts(list => [...list, { id, message, type }]);
      setTimeout(() => remove(id), ms);
    });
  }, [remove]);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[10000] px-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] lg:pt-4 pointer-events-none flex flex-col items-center gap-2">
      {toasts.map(t => {
        const s = STYLES[t.type] || STYLES.info;
        const Icon = s.icon;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto w-full ${s.bg} border ${s.ring} rounded-xl shadow-lg px-3.5 py-3 flex items-start gap-2.5 animate-slide-down`}
            role="status"
          >
            <Icon size={18} className={`${s.iconColor} flex-shrink-0 mt-0.5`} />
            <p className="flex-1 text-sm text-gray-800 font-medium leading-snug">{t.message}</p>
            <button onClick={() => remove(t.id)} className="p-0.5 text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
