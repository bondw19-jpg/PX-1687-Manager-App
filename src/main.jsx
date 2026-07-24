import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// PWA service worker registration is disabled in the Replit preview environment.
// vite-plugin-pwa / virtual:pwa-register is not available here; the real PWA
// build on Firebase Hosting handles registration via the production Vite config.
const updateSW = () => {}

const APP_VERSION = '2.2.1'

// ── Update toast ──────────────────────────────────────────────────────────────
function showUpdateToast() {
  // Remove any existing toast first
  document.getElementById('sw-update-toast')?.remove()

  const wrapper = document.createElement('div')
  wrapper.id = 'sw-update-toast'
  wrapper.style.cssText = `
    position:fixed;
    bottom:88px;
    left:50%;
    transform:translateX(-50%);
    z-index:99999;
    width:calc(100% - 32px);
    max-width:420px;
  `
  wrapper.innerHTML = `
    <div style="
      background:#1f2937;
      color:#fff;
      padding:14px 16px;
      border-radius:16px;
      font-size:13px;
      font-weight:600;
      display:flex;
      align-items:center;
      gap:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.35);
      animation:swToastIn .35s cubic-bezier(.175,.885,.32,1.1) both;
    ">
      <span style="font-size:18px;flex-shrink:0">✨</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:13px">Update available — v${APP_VERSION}</div>
        <div style="font-size:11px;opacity:.7;margin-top:2px">Tap Update to get the latest features</div>
      </div>
      <button id="sw-update-btn" style="
        background:#C8102E;
        color:#fff;
        border:none;
        padding:7px 14px;
        border-radius:10px;
        font-size:12px;
        font-weight:700;
        cursor:pointer;
        flex-shrink:0;
        white-space:nowrap;
      ">Update</button>
      <button id="sw-dismiss-btn" style="
        background:transparent;
        color:rgba(255,255,255,.5);
        border:none;
        padding:4px 6px;
        border-radius:8px;
        font-size:16px;
        cursor:pointer;
        flex-shrink:0;
        line-height:1;
      ">×</button>
    </div>
  `

  // Inject keyframe if not already present
  if (!document.getElementById('sw-toast-style')) {
    const style = document.createElement('style')
    style.id = 'sw-toast-style'
    style.textContent = `
      @keyframes swToastIn {
        from { opacity:0; transform:translateY(20px) scale(.95); }
        to   { opacity:1; transform:translateY(0)    scale(1);   }
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(wrapper)

  // Update button → activate waiting SW and reload
  document.getElementById('sw-update-btn').addEventListener('click', () => {
    wrapper.remove()
    updateSW(true)   // true = skipWaiting on the waiting SW, then reloads
  })

  // Dismiss button → hide toast, SW stays waiting for next natural reload
  document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
    wrapper.remove()
  })
}

// ── Global error guards — prevent blank screen from silent crashes ─────────────
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[App] Unhandled promise rejection (suppressed):', event?.reason?.message || event?.reason)
  event.preventDefault()
})

window.addEventListener('error', (event) => {
  console.warn('[App] Uncaught error (suppressed):', event?.message)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
