import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// ── Service Worker registration with auto-update ──────────────────────────────
// autoUpdate: new SW installs & activates silently in background.
// When the next page load happens the user automatically gets the new version.
// We show a simple toast so they know an update was applied.
registerSW({
  onRegistered(r) {
    // Check for updates every 60 minutes while the app is open
    r && setInterval(() => r.update(), 60 * 60 * 1000);
  },
  onNeedRefresh() {
    // New version downloaded & waiting — show a non-blocking toast
    showUpdateToast();
  },
  onOfflineReady() {
    console.log('[SW] App ready to work offline');
  },
});

function showUpdateToast() {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:#1f2937;color:#fff;
      padding:12px 20px;border-radius:14px;
      font-size:13px;font-weight:600;
      display:flex;align-items:center;gap:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.3);
      z-index:9999;white-space:nowrap;
      animation:fadeIn .3s ease;
    ">
      <span>✨ App updated to v2.1.2</span>
      <button onclick="window.location.reload()" style="
        background:#C8102E;color:#fff;border:none;
        padding:5px 12px;border-radius:8px;
        font-size:12px;font-weight:700;cursor:pointer;
      ">Reload</button>
    </div>
  `;
  document.body.appendChild(toast);
  // Auto-dismiss after 8 seconds
  setTimeout(() => toast.remove(), 8000);
}

// ── Global error guards — prevent blank screen from silent crashes ─────────────
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[App] Unhandled promise rejection (suppressed):', event?.reason?.message || event?.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.warn('[App] Uncaught error (suppressed):', event?.message);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
