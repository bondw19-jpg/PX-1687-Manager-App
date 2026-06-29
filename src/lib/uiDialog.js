// App-styled replacements for window.alert / window.confirm.
// Singleton pub/sub so any module (even non-React, like printReport.js) can call
// toast() / confirmDialog() without prop drilling. Hosts mount once in App.jsx.

let toastHost = null;
let confirmHost = null;

export function registerToastHost(fn) {
  toastHost = fn;
  return () => { if (toastHost === fn) toastHost = null; };
}

export function registerConfirmHost(fn) {
  confirmHost = fn;
  return () => { if (confirmHost === fn) confirmHost = null; };
}

// toast(message, { type: 'info' | 'success' | 'error' | 'warning', duration })
export function toast(message, opts = {}) {
  if (toastHost) {
    toastHost({ message, type: opts.type || 'info', duration: opts.duration });
    return;
  }
  if (typeof window !== 'undefined') window.alert(message);
}

// confirmDialog('Are you sure?') OR
// confirmDialog({ title, message, confirmText, cancelText, danger }) -> Promise<boolean>
export function confirmDialog(opts) {
  const normalized = typeof opts === 'string' ? { message: opts } : (opts || {});
  if (confirmHost) return confirmHost(normalized);
  if (typeof window !== 'undefined') {
    const text = [normalized.title, normalized.message].filter(Boolean).join('\n\n');
    return Promise.resolve(window.confirm(text || 'Are you sure?'));
  }
  return Promise.resolve(false);
}
