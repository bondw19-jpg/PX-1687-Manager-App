/**
 * printReport.js
 * Reusable print/PDF utility for Panda Manager Hub — PX Store #1687
 *
 * Usage:
 *   import { openPrintWindow } from '../lib/printReport';
 *   openPrintWindow({ title: 'My Report', html: '<table>...</table>' });
 *
 * All reports get:
 *  - Panda Express branded header (red bar + store name)
 *  - Print date/time footer
 *  - @media print CSS (hides browser chrome)
 *  - "Close Tab" button visible only after print dialog fires (afterprint event)
 *  - PDF-safe fonts (Arial/Helvetica)
 */

const STORE_NAME  = 'PANDA EXPRESS #1687';
const BRAND_COLOR = '#C8102E';  // PX red

/** Base CSS injected into every print window */
const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: #111;
    background: #fff;
    padding: 0;
  }

  /* ── Page wrapper ── */
  .report-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px 32px;
  }

  /* ── Branded header ── */
  .report-header {
    background: ${BRAND_COLOR};
    color: #fff;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 -24px 20px;
  }
  .report-header-store { font-size: 11px; opacity: 0.85; }
  .report-header-title { font-size: 17px; font-weight: bold; letter-spacing: 0.5px; }
  .report-header-date  { font-size: 10px; opacity: 0.8; text-align: right; }

  /* ── Section headings ── */
  h2.section-title {
    font-size: 13px;
    font-weight: bold;
    color: ${BRAND_COLOR};
    border-bottom: 1.5px solid ${BRAND_COLOR};
    padding-bottom: 4px;
    margin: 20px 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ── Info grid (key:value pairs) ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 20px;
    margin-bottom: 14px;
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 10px 14px;
  }
  .info-row { display: flex; gap: 6px; align-items: baseline; }
  .info-label { font-weight: bold; color: #555; min-width: 130px; font-size: 11px; flex-shrink: 0; }
  .info-value { color: #111; font-size: 12px; }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 16px;
    font-size: 11px;
  }
  thead th {
    background: #222;
    color: #fff;
    padding: 6px 8px;
    text-align: left;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 0.3px;
  }
  tbody tr:nth-child(even) { background: #f5f5f5; }
  tbody tr:nth-child(odd)  { background: #fff; }
  td {
    padding: 5px 8px;
    border-bottom: 1px solid #e8e8e8;
    vertical-align: top;
  }
  .badge {
    display: inline-block;
    padding: 1px 7px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: bold;
    border: 1px solid currentColor;
  }
  .badge-red    { color: #b91c1c; background: #fee2e2; }
  .badge-orange { color: #c2410c; background: #ffedd5; }
  .badge-yellow { color: #854d0e; background: #fef9c3; }
  .badge-green  { color: #15803d; background: #dcfce7; }
  .badge-blue   { color: #1d4ed8; background: #dbeafe; }
  .badge-gray   { color: #374151; background: #f3f4f6; }

  /* ── Summary stats row ── */
  .stats-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .stat-box {
    flex: 1;
    min-width: 100px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
    background: #f9f9f9;
  }
  .stat-value { font-size: 20px; font-weight: bold; color: #111; }
  .stat-label { font-size: 10px; color: #666; margin-top: 2px; }

  /* ── Legend ── */
  .legend {
    background: #fffde7;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 8px 12px;
    margin-top: 12px;
  }
  .legend-title { font-weight: bold; font-size: 11px; color: #555; margin-bottom: 5px; }
  .legend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px 16px;
  }
  .legend-item { font-size: 10px; color: #555; }
  .legend-key  { font-weight: bold; color: #111; }

  /* ── Sub-label (added by, logged by) ── */
  .sub-label { font-size: 10px; color: #888; font-style: italic; margin-top: 2px; }

  /* ── Stars ── */
  .stars { color: #f59e0b; letter-spacing: 1px; }

  /* ── Discipline callout ── */
  .discipline-box {
    border: 1.5px solid #fca5a5;
    background: #fff7f7;
    border-radius: 6px;
    padding: 8px 12px;
    margin: 10px 0;
    font-size: 11px;
  }
  .discipline-box.green  { border-color: #86efac; background: #f0fff4; }
  .discipline-box.yellow { border-color: #fde68a; background: #fffde7; }
  .discipline-box.orange { border-color: #fdba74; background: #fff7ed; }

  /* ── Footer ── */
  .report-footer {
    margin-top: 28px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
    font-size: 10px;
    color: #888;
    display: flex;
    justify-content: space-between;
  }

  /* ── Close-tab button (screen only, hidden when printing) ── */
  .close-tab-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #1f2937;
    color: #fff;
    padding: 12px 20px;
    display: none;          /* hidden until afterprint fires */
    align-items: center;
    justify-content: space-between;
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 14px;
  }
  .close-tab-bar.visible { display: flex; }
  .close-tab-btn {
    background: ${BRAND_COLOR};
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }
  .close-tab-btn:hover { background: #a50d27; }

  /* ── Print media ── */
  @media print {
    .close-tab-bar { display: none !important; }
    .no-print { display: none !important; }
    body { padding: 0; }
    .report-header { margin: 0 0 16px; }
    @page { margin: 14mm 12mm; }
  }
`;

/** Shared JS injected into every print window */
const AFTER_PRINT_JS = `
  function showCloseBar() {
    var bar = document.getElementById('close-tab-bar');
    if (bar) bar.classList.add('visible');
  }
  window.addEventListener('afterprint', showCloseBar);
  // Fallback: show after 3 s in case afterprint never fires (some browsers)
  setTimeout(showCloseBar, 3000);
  document.getElementById('close-tab-btn')
    .addEventListener('click', function() { window.close(); });
`;

/**
 * Opens a new browser tab with styled report HTML, auto-triggers print dialog.
 *
 * @param {object} options
 * @param {string}  options.title      - Report title shown in header
 * @param {string}  options.subtitle   - Optional subtitle below title
 * @param {string}  options.html       - Inner HTML body (tables, stat boxes, etc.)
 * @param {boolean} [options.autoPrint=true] - auto-open print dialog
 */
export function openPrintWindow({ title, subtitle = '', html, autoPrint = true }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${STORE_NAME} — ${title}</title>
  <style>${BASE_CSS}</style>
</head>
<body>

<!-- Close-tab bar (shown after print) -->
<div class="close-tab-bar" id="close-tab-bar">
  <span>✅ Report ready. You can close this tab to return to the app.</span>
  <button class="close-tab-btn" id="close-tab-btn">← Close Tab</button>
</div>

<div class="report-page">

  <!-- Branded header -->
  <div class="report-header">
    <div>
      <div class="report-header-store">${STORE_NAME}</div>
      <div class="report-header-title">${title}</div>
      ${subtitle ? `<div class="report-header-store" style="margin-top:2px">${subtitle}</div>` : ''}
    </div>
    <div class="report-header-date">
      ${dateStr}<br/>${timeStr}<br/>Panda Manager Hub
    </div>
  </div>

  <!-- Report content -->
  ${html}

  <!-- Footer -->
  <div class="report-footer">
    <span>${STORE_NAME} — Panda Manager Hub</span>
    <span>Printed: ${dateStr} ${timeStr}</span>
  </div>

</div>

<script>
  ${AFTER_PRINT_JS}
  ${autoPrint ? 'window.addEventListener("load", function(){ window.print(); });' : ''}
<\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Popup blocked — please allow popups for this site to print reports.');
    return;
  }
  win.document.write(doc);
  win.document.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-SPECIFIC REPORT BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

/** Build stats row HTML */
export function statsRowHtml(stats) {
  return `<div class="stats-row">${stats.map(s => `
    <div class="stat-box">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('')}</div>`;
}

/** Build a simple key:value info grid */
export function infoGridHtml(rows) {
  return `<div class="info-grid">${rows.map(([label, value]) => `
    <div class="info-row">
      <span class="info-label">${label}:</span>
      <span class="info-value">${value || '—'}</span>
    </div>`).join('')}</div>`;
}

/** Stars string for a numeric rating */
export function starsHtml(rating, max = 5) {
  const filled = '★'.repeat(Math.round(rating));
  const empty  = '☆'.repeat(max - Math.round(rating));
  return `<span class="stars">${filled}${empty}</span> ${rating}/${max}`;
}

/** Badge HTML */
export function badgeHtml(text, color = 'gray') {
  return `<span class="badge badge-${color}">${text}</span>`;
}

/** Discipline badge color from points */
export function disciplineColor(pts) {
  if (pts < 2) return 'green';
  if (pts < 4) return 'blue';
  if (pts < 6) return 'yellow';
  if (pts < 8) return 'orange';
  return 'red';
}

/** Discipline label from points */
export function disciplineLabel(pts) {
  if (pts < 2) return 'Good Standing';
  if (pts < 4) return 'Coaching';
  if (pts < 6) return 'First Written Warning';
  if (pts < 8) return 'Final Written Warning';
  return 'Termination Eligible';
}
