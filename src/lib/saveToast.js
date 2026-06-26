// saveToast.js
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, framework-agnostic "couldn't save" toast.
//
// WHY VANILLA (not React / not src/components/ui):
//   The Firestore sync helpers in firestoreSync.js run OUTSIDE the React tree
//   (they're called from the Zustand store). A plain DOM toast can be triggered
//   from anywhere without a React context. It mirrors the existing inline update
//   toast in main.jsx so the visual style stays consistent.
//
// BEHAVIOUR:
//   • notifySaveError()   — a cloud save failed. Shows one coalesced toast; if it
//                           is already showing, just bumps the count and resets the
//                           auto-dismiss timer (so a flood of failures = one toast).
//   • notifySaveSuccess() — a cloud save succeeded. If an error toast is showing,
//                           saving may be recovering, so it starts a short debounced
//                           timer that dismisses the toast — UNLESS a new failure
//                           arrives first (which cancels it). This prevents flicker
//                           when one collection keeps failing while another succeeds.
//                           No-op when nothing is wrong (cheap to call on every write).
//
//   The toast also auto-dismisses after a longer quiet period with no new failures
//   AND no successes, in case the failure was a one-off blip.
// ─────────────────────────────────────────────────────────────────────────────

const TOAST_ID = 'save-error-toast';
const STYLE_ID = 'save-error-toast-style';
// Dismiss if failures go completely quiet (no errors AND no successes) for this long.
const AUTO_DISMISS_MS = 8000;
// After a save succeeds, wait this long before clearing the toast. A new failure
// inside this window cancels the dismissal, so an ongoing problem on one collection
// is NOT hidden just because an unrelated write happened to succeed (avoids flicker).
const RECOVERY_MS = 3000;

let failCount = 0;
let dismissTimer = null;   // long quiet-period timer
let recoveryTimer = null;  // short post-success timer

function hasDom() {
  return typeof document !== 'undefined' && !!document.body;
}

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes saveToastIn {
      from { opacity:0; transform:translate(-50%, 20px) scale(.95); }
      to   { opacity:1; transform:translate(-50%, 0)    scale(1);   }
    }
  `;
  document.head.appendChild(style);
}

function message() {
  if (failCount > 1) {
    return {
      title: `Couldn't save ${failCount} changes`,
      body: 'We\u2019ll keep trying \u2014 check your connection.',
    };
  }
  return {
    title: 'Couldn\u2019t save your change',
    body: 'We\u2019ll keep trying \u2014 check your connection.',
  };
}

function paint(el) {
  const { title, body } = message();
  el.innerHTML = `
    <div style="
      background:#1f2937;
      color:#fff;
      padding:14px 16px;
      border-radius:16px;
      border-left:4px solid #F59E0B;
      font-size:13px;
      font-weight:600;
      display:flex;
      align-items:center;
      gap:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.35);
      animation:saveToastIn .35s cubic-bezier(.175,.885,.32,1.1) both;
    ">
      <span style="font-size:18px;flex-shrink:0">\u26A0\uFE0F</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:13px">${title}</div>
        <div style="font-size:11px;opacity:.75;margin-top:2px">${body}</div>
      </div>
      <button id="save-error-dismiss" aria-label="Dismiss" style="
        background:transparent;
        color:rgba(255,255,255,.55);
        border:none;
        padding:4px 6px;
        border-radius:8px;
        font-size:16px;
        cursor:pointer;
        flex-shrink:0;
        line-height:1;
      ">\u00D7</button>
    </div>
  `;
  const btn = el.querySelector('#save-error-dismiss');
  if (btn) btn.addEventListener('click', dismiss);
}

function clearTimers() {
  if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; }
  if (recoveryTimer) { clearTimeout(recoveryTimer); recoveryTimer = null; }
}

export function dismiss() {
  clearTimers();
  failCount = 0;
  if (!hasDom()) return;
  document.getElementById(TOAST_ID)?.remove();
}

export function notifySaveError() {
  if (!hasDom()) return;
  failCount += 1;
  ensureStyle();
  // A fresh failure cancels any pending post-success dismissal — the problem
  // isn't actually resolved, so keep the toast up.
  clearTimers();

  let el = document.getElementById(TOAST_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = TOAST_ID;
    el.setAttribute('role', 'alert');
    // Sits above the app-update toast (bottom:88px) so the two never overlap.
    el.style.cssText = `
      position:fixed;
      bottom:152px;
      left:50%;
      transform:translateX(-50%);
      z-index:99998;
      width:calc(100% - 32px);
      max-width:420px;
    `;
    document.body.appendChild(el);
  }
  paint(el);
  // Fully quiet (no errors and no successes) for a while → assume it was a blip.
  dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS);
}

export function notifySaveSuccess() {
  // Cheap no-op when nothing is wrong (called on every successful write).
  if (failCount === 0) return;
  // Debounce the clear: only dismiss after saves have been succeeding for a
  // short window. If a new failure arrives first, notifySaveError cancels this.
  if (recoveryTimer) return;
  recoveryTimer = setTimeout(dismiss, RECOVERY_MS);
}
