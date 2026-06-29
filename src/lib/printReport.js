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

import { toast } from './uiDialog';

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
    toast('Popup blocked — please allow popups for this site to print reports.', { type: 'warning' });
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

/**
 * printAssociateAttendanceReport(associate, callIns)
 *
 * Generates and opens a per-associate attendance summary sheet.
 * Intended to be handed to / reviewed WITH the associate so they
 * understand exactly where they stand under the PX Attendance Point System.
 *
 * Includes:
 *  - Associate info header
 *  - Current standing card (effective points, discipline level)
 *  - Clean-streak & recovery status
 *  - Full incident log (6-month window, sorted newest first)
 *  - Complete discipline scale explanation
 *  - Acknowledgment / signature block
 *
 * @param {object} associate   - associate record from store
 * @param {Array}  allCallIns  - full callIns array from store (will be filtered)
 */
export function printAssociateAttendanceReport(associate, allCallIns) {
  // ── helpers ────────────────────────────────────────────────────────────────
  const today   = new Date();
  const cutoff  = new Date(today); cutoff.setDate(cutoff.getDate() - 180);

  function safeDate(str) {
    try { const d = new Date(str); return isNaN(d) ? null : d; } catch { return null; }
  }

  function getPoints(c) {
    if (c.points !== undefined) return Number(c.points);
    const SUBTYPE_PTS = {
      tardy_minor: 0.5, tardy_moderate: 1, tardy_severe: 1.5,
      early_partial: 1, early_walkout: 2,
      absence_excused: 1, absence_unexcused: 2, absence_noshow: 3,
    };
    if (c.subtypeId && SUBTYPE_PTS[c.subtypeId] !== undefined) return SUBTYPE_PTS[c.subtypeId];
    const LEGACY = { 'No-Show': 3, 'Unexcused': 2, 'Late/Tardy': 1, 'Excused': 0 };
    return LEGACY[c.type] ?? 0;
  }

  function getCategoryLabel(c) {
    const CAT = {
      tardiness: '⏰ Tardiness', early_departure: '🚪 Early Departure',
      absence: '🚫 Absence', protected: '🛡️ Protected (0 pts)',
      emergency: '🏥 Emergency (0 pts)',
    };
    if (c.categoryId && CAT[c.categoryId]) return CAT[c.categoryId];
    return c.type || 'Unknown';
  }

  function getSubtypeLabel(c) {
    const MAP = {
      tardy_minor: 'Minor (1–30 min late)', tardy_moderate: 'Moderate (31–60 min late)',
      tardy_severe: 'Severe (60+ min late)', early_partial: 'Left early (with notice)',
      early_walkout: 'Left early (without notice)', absence_excused: 'Excused absence',
      absence_unexcused: 'Unexcused absence', absence_noshow: 'No-Show (no contact)',
      protected_fmla: 'FMLA / Medical Leave', protected_jury: 'Jury Duty',
      protected_military: 'Military Service', protected_bereavement: 'Bereavement',
      protected_healthcode: 'Health Code Related', protected_other: 'Other Protected',
      emergency_medical: 'Medical Emergency', emergency_accident: 'Accident / Police Report',
      emergency_family: 'Family Emergency', emergency_discretion: 'Manager Discretion Waiver',
    };
    return (c.subtypeId && MAP[c.subtypeId]) ? MAP[c.subtypeId] : (c.type || '—');
  }

  function disciplineColorCss(pts) {
    if (pts < 2) return { bg: '#f0fff4', border: '#86efac', text: '#15803d', label: '✅ Good Standing' };
    if (pts < 4) return { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', label: '💬 Coaching' };
    if (pts < 6) return { bg: '#fefce8', border: '#fde047', text: '#854d0e', label: '📋 First Written Warning' };
    if (pts < 8) return { bg: '#fff7ed', border: '#fdba74', text: '#c2410c', label: '⚠️ Final Written Warning' };
    return       { bg: '#fff1f2', border: '#fca5a5', text: '#b91c1c', label: '🔴 Termination Eligible' };
  }

  // ── filter & compute ──────────────────────────────────────────────────────
  const incidents = allCallIns
    .filter(c => c.associateId === associate.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const recent90 = incidents.filter(c => {
    const d = safeDate(c.date);
    return d && d >= cutoff;
  });

  const rawPts = recent90.reduce((s, c) => s + getPoints(c), 0);

  // Clean-streak recovery
  let recovery = 0, cleanDays = 0, streakLabel = '';
  if (recent90.length > 0) {
    const lastDate = recent90
      .map(c => safeDate(c.date))
      .filter(Boolean)
      .reduce((latest, d) => (d > latest ? d : latest), new Date(0));
    cleanDays = Math.floor((today - lastDate) / 86400000);
    if (cleanDays >= 120)     { recovery = 1.0; streakLabel = `${cleanDays}-day clean streak → −1.0 pt recovery applied ✅`; }
    else if (cleanDays >= 60) { recovery = 0.5; streakLabel = `${cleanDays}-day clean streak → −0.5 pt recovery applied ✅`; }
    else {
      const next = cleanDays < 60 ? 60 - cleanDays : 120 - cleanDays;
      streakLabel = `${cleanDays}-day clean streak · ${next} more day${next !== 1 ? 's' : ''} until next recovery bonus`;
    }
  } else {
    cleanDays = 180; streakLabel = '180+ days incident-free ✅';
  }
  const effectivePts = Math.max(0, Math.round((rawPts - recovery) * 10) / 10);
  const dc = disciplineColorCss(effectivePts);

  // ── build HTML ─────────────────────────────────────────────────────────────
  const printDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const incidentRows = recent90.length === 0
    ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:16px">No incidents in the past 6 months ✅</td></tr>'
    : recent90.map(c => {
        const pts = getPoints(c);
        const isZero = pts === 0;
        const ptColor = isZero ? '#15803d' : pts >= 3 ? '#b91c1c' : pts >= 2 ? '#c2410c' : pts >= 1 ? '#854d0e' : '#1d4ed8';
        const ptBg    = isZero ? '#f0fff4' : pts >= 3 ? '#fee2e2' : pts >= 2 ? '#ffedd5' : pts >= 1 ? '#fefce8' : '#eff6ff';
        return `<tr>
          <td>${c.date || ''}${c.time ? '<br/><span style="font-size:10px;color:#888">' + c.time + '</span>' : ''}</td>
          <td>${getCategoryLabel(c)}</td>
          <td>${getSubtypeLabel(c)}</td>
          <td>${c.reason || '—'}</td>
          <td style="text-align:center">
            <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-weight:bold;font-size:11px;background:${ptBg};color:${ptColor}">
              ${isZero ? '0 pts' : '+' + pts + ' pt' + (pts !== 1 ? 's' : '')}
            </span>
          </td>
        </tr>`;
      }).join('');

  const allRows = incidents.filter(c => {
    const d = safeDate(c.date);
    return d && d < cutoff;
  });
  const expiredSection = allRows.length > 0 ? `
    <h2 class="section-title" style="color:#999;border-color:#ddd">Expired Records (older than 6 months — 0 pts)</h2>
    <table>
      <thead><tr>
        <th>Date</th><th>Category</th><th>Type</th><th style="width:60px">Original Pts</th>
      </tr></thead>
      <tbody>
        ${allRows.map(c => `<tr style="color:#aaa">
          <td>${c.date || ''}</td>
          <td>${getCategoryLabel(c)}</td>
          <td>${getSubtypeLabel(c)}</td>
          <td style="text-align:center"><span style="text-decoration:line-through">${getPoints(c)} pts</span></td>
        </tr>`).join('')}
      </tbody>
    </table>` : '';

  const html = `
    <!-- Associate info -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;padding:12px 16px;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px">
      <div style="width:52px;height:52px;background:${BRAND_COLOR};border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:bold;flex-shrink:0">
        ${(associate.name || '?')[0].toUpperCase()}
      </div>
      <div>
        <div style="font-size:16px;font-weight:bold;color:#111">${associate.name || 'Unknown'}</div>
        <div style="font-size:11px;color:#666;margin-top:2px">
          ${associate.position || 'Team Member'} &nbsp;·&nbsp;
          Emp ID: ${associate.employeeId || '—'} &nbsp;·&nbsp;
          Hire Date: ${associate.hireDate || '—'}
        </div>
        <div style="font-size:11px;color:#666;margin-top:1px">
          Status: <strong>${(associate.status || 'active').charAt(0).toUpperCase() + (associate.status || 'active').slice(1)}</strong>
        </div>
      </div>
    </div>

    <!-- Current standing card -->
    <div style="border:2px solid ${dc.border};background:${dc.bg};border-radius:10px;padding:14px 18px;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:11px;font-weight:bold;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Current Standing — 6-Month Rolling Window</div>
          <div style="font-size:22px;font-weight:bold;color:${dc.text}">${dc.label}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:28px;font-weight:bold;color:${dc.text}">${effectivePts} <span style="font-size:14px">pts</span></div>
          ${recovery > 0 ? `<div style="font-size:11px;color:#15803d;font-weight:bold">Raw ${rawPts} pts − ${recovery} recovery = ${effectivePts} pts</div>` : ''}
        </div>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid ${dc.border};font-size:11px;color:${dc.text}">
        🕐 <strong>Clean streak:</strong> ${streakLabel}
      </div>
    </div>

    <!-- Required action box (only if discipline > Good Standing) -->
    ${effectivePts >= 2 ? `
    <div style="border:1.5px solid #fca5a5;background:#fff7f7;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:11px">
      <div style="font-weight:bold;color:#b91c1c;margin-bottom:4px">⚠️ Required Action</div>
      <div style="color:#374151">
        ${effectivePts >= 8 ? 'Associate is <strong>eligible for termination</strong> per PX attendance policy. Contact HR immediately.' :
          effectivePts >= 6 ? 'A <strong>Final Written Warning</strong> must be issued and documented.' :
          effectivePts >= 4 ? 'A <strong>First Written Warning</strong> must be issued and documented.' :
          'Schedule a <strong>coaching conversation</strong> and document it in the work file.'}
      </div>
    </div>` : ''}

    <!-- 6-month incident log -->
    <h2 class="section-title">Attendance Incidents — Past 6 Months (${recent90.length} record${recent90.length !== 1 ? 's' : ''})</h2>
    <table>
      <thead><tr>
        <th style="width:90px">Date</th>
        <th style="width:140px">Category</th>
        <th>Specific Type</th>
        <th>Reason</th>
        <th style="width:70px;text-align:center">Points</th>
      </tr></thead>
      <tbody>${incidentRows}</tbody>
    </table>

    ${expiredSection}

    <!-- Discipline scale -->
    <h2 class="section-title">PX Attendance Point System — How It Works</h2>
    <table>
      <thead><tr><th>Points</th><th>Standing</th><th>Action Required</th></tr></thead>
      <tbody>
        <tr><td>0 – 1.9</td><td>✅ Good Standing</td><td>No action required</td></tr>
        <tr><td>2 – 3.9</td><td>💬 Coaching</td><td>Verbal coaching conversation with manager</td></tr>
        <tr><td>4 – 5.9</td><td>📋 First Written Warning</td><td>Written warning issued and signed</td></tr>
        <tr><td>6 – 7.9</td><td>⚠️ Final Written Warning</td><td>Final written warning issued and signed</td></tr>
        <tr><td>8+</td><td>🔴 Termination Eligible</td><td>Eligible for termination per PX policy</td></tr>
      </tbody>
    </table>

    <div class="legend">
      <div class="legend-title">Point Values by Incident Type</div>
      <div class="legend-grid">
        <div class="legend-item">⏰ Tardiness Minor (1–30 min): <strong>0.5 pt</strong></div>
        <div class="legend-item">⏰ Tardiness Moderate (31–60 min): <strong>1.0 pt</strong></div>
        <div class="legend-item">⏰ Tardiness Severe (60+ min): <strong>1.5 pts</strong></div>
        <div class="legend-item">🚪 Early Departure (with notice): <strong>1.0 pt</strong></div>
        <div class="legend-item">🚪 Early Departure (no notice): <strong>2.0 pts</strong></div>
        <div class="legend-item">🚫 Excused Absence: <strong>1.0 pt</strong></div>
        <div class="legend-item">🚫 Unexcused Absence: <strong>2.0 pts</strong></div>
        <div class="legend-item">🚫 No-Show (no contact): <strong>3.0 pts</strong></div>
        <div class="legend-item">🛡️ FMLA / Jury / Military / Bereavement: <strong>0 pts</strong></div>
        <div class="legend-item">🏥 Emergency (with documentation): <strong>0 pts</strong></div>
        <div class="legend-item">♻️ 60-day clean streak: <strong>−0.5 pt recovery</strong></div>
        <div class="legend-item">♻️ 120-day clean streak: <strong>−1.0 pt recovery</strong></div>
        <div class="legend-item" style="grid-column:1/-1;color:#888">All points expire after 6 months on a rolling basis.</div>
      </div>
    </div>

    <!-- Signature / acknowledgment block -->
    <div style="margin-top:28px;border:1.5px solid #e0e0e0;border-radius:8px;padding:16px 20px">
      <div style="font-weight:bold;font-size:12px;color:#555;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.4px">
        Associate Acknowledgment
      </div>
      <p style="font-size:11px;color:#555;margin-bottom:18px">
        I acknowledge that I have reviewed my attendance record for the past 6 months and understand my current standing
        under the Panda Express Attendance Point System. I understand the point values, the progressive discipline scale,
        and the recovery bonus for incident-free periods.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div>
          <div style="border-bottom:1px solid #333;margin-bottom:4px;height:28px"></div>
          <div style="font-size:10px;color:#888">Associate Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: _______________</div>
        </div>
        <div>
          <div style="border-bottom:1px solid #333;margin-bottom:4px;height:28px"></div>
          <div style="font-size:10px;color:#888">Manager Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: _______________</div>
        </div>
      </div>
      <div style="margin-top:14px">
        <div style="border-bottom:1px solid #333;margin-bottom:4px;height:24px"></div>
        <div style="font-size:10px;color:#888">Manager Printed Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Title: _______________</div>
      </div>
    </div>
  `;

  openPrintWindow({
    title: `Attendance Review — ${associate.name || 'Associate'}`,
    subtitle: `Printed ${printDate} · 6-Month Rolling Window`,
    html,
  });
}

/**
 * printInterviewSheet(interview, candidate)
 *
 * Generates and opens a completed candidate-interview sheet that mirrors the
 * official Panda Express paper interview form: candidate header, availability,
 * the 7 competencies with their recommended questions + STAR notes, the 1–5
 * ratings, the "also consider" soft factors, and the final evaluation total /
 * average with the Move Forward / Does Not Recommend decision.
 *
 * Imports the fixed interview content + scoring rule from interviewContent.js
 * so the printed sheet always matches the on-screen form.
 *
 * @param {object} interview - interview record from the store
 * @param {object} [candidate] - the candidate record (for header fallback fields)
 */
export async function printInterviewSheet(interview, candidate = {}) {
  const {
    COMPETENCIES, ALSO_CONSIDER, AVAILABILITY_DAYS, INTERVIEW_STEPS,
    IMPERMISSIBLE_WARNING, ratingLabel, scoreInterview,
  } = await import('./interviewContent');

  const ratings = interview.ratings || {};
  const starNotes = interview.starNotes || {};
  const score = scoreInterview(ratings);

  const candidateName = interview.candidateName || candidate.name || 'Candidate';
  const position = interview.position || candidate.position || '—';
  const region = interview.region || candidate.region || '—';
  const interviewer = interview.interviewerName || (interview.createdBy && interview.createdBy.name) || '—';
  const date = interview.date || '—';

  const availability = candidate.availability || {};
  const availRows = AVAILABILITY_DAYS
    .map(d => `<div class="info-row"><span class="info-label">${d.label}:</span><span class="info-value">${availability[d.key] || '—'}</span></div>`)
    .join('');
  const openSchedule = availability.openSchedule ? 'Yes' : 'No';

  const competencyRows = COMPETENCIES.map(c => {
    const r = Number(ratings[c.key]) || 0;
    const ratingText = r > 0 ? `${r}/5 — ${ratingLabel(r)}` : '—';
    const questions = c.questions.map(q => `<li style="margin-bottom:3px">${q}</li>`).join('');
    const notes = (starNotes[c.key] || '').trim();
    return `<tr>
      <td style="width:150px;font-weight:bold;vertical-align:top">${c.label}<div style="margin-top:6px;font-weight:bold;color:#b91c1c">${ratingText}</div></td>
      <td style="width:300px;vertical-align:top"><ul style="margin-left:14px;font-size:10px;color:#444">${questions}</ul></td>
      <td style="vertical-align:top;white-space:pre-wrap">${notes ? notes.replace(/</g, '&lt;') : '<span style="color:#aaa">—</span>'}</td>
    </tr>`;
  }).join('');

  const decisionColor = score.recommend ? 'green' : 'red';
  const decisionLabel = score.count === 0 ? 'Not Scored' : score.recommendation;

  const stepsHtml = INTERVIEW_STEPS.map((s, i) => {
    const points = s.points.length
      ? `<ul style="margin:2px 0 0 16px;font-size:10px;color:#555">${s.points.map(p => `<li>${p.replace(/</g, '&lt;')}</li>`).join('')}</ul>`
      : '';
    return `<li style="margin-bottom:4px"><strong>Step ${i + 1}: ${s.title}</strong>${points}</li>`;
  }).join('');

  const html = `
    ${infoGridHtml([
      ['Candidate Name', candidateName],
      ['Position Applying For', position],
      ['Region', region],
      ['Interviewer Name', interviewer],
      ['Interview Date', date],
      ['Open Schedule', openSchedule],
    ])}

    <h2 class="section-title">Interview Process — 6 Steps</h2>
    <ol style="margin-left:16px;font-size:11px;color:#333">${stepsHtml}</ol>

    <div class="discipline-box red">
      <strong>Reminder:</strong> ${IMPERMISSIBLE_WARNING}
    </div>

    <h2 class="section-title">Availability</h2>
    <div class="info-grid">${availRows}</div>

    ${statsRowHtml([
      { value: score.total, label: 'Evaluation Total' },
      { value: score.averageText, label: 'Average (of ' + (score.count || 0) + ')' },
      { value: decisionLabel, label: 'Decision' },
    ])}

    <div class="discipline-box ${decisionColor}">
      <strong>Decision Rule:</strong> Average ≥ 3 → <strong>Move Forward</strong>; below 3 → <strong>Does Not Recommend</strong>.
      &nbsp; Result: ${badgeHtml(decisionLabel, decisionColor)}
    </div>

    <h2 class="section-title">Behavioral Competencies — Recommended Questions &amp; STAR Notes</h2>
    <table>
      <thead><tr>
        <th style="width:150px">Competency / Rating</th>
        <th style="width:300px">Recommended Questions</th>
        <th>STAR Method (Situation, Task, Action, Result)</th>
      </tr></thead>
      <tbody>${competencyRows}</tbody>
    </table>

    <div class="legend">
      <div class="legend-title">Rating Scale</div>
      <div class="legend-grid">
        <div class="legend-item"><span class="legend-key">1</span> Limited</div>
        <div class="legend-item"><span class="legend-key">2</span> Fair</div>
        <div class="legend-item"><span class="legend-key">3</span> Good</div>
        <div class="legend-item"><span class="legend-key">4</span> Very Good</div>
        <div class="legend-item"><span class="legend-key">5</span> Exceptional</div>
      </div>
    </div>

    <h2 class="section-title">Also Consider</h2>
    <div style="font-size:11px;color:#555;margin-bottom:10px">${ALSO_CONSIDER.join(' · ')}</div>
    <div class="info-grid" style="grid-template-columns:1fr">
      <div class="info-row"><span class="info-label">Soft-Factor Notes:</span><span class="info-value" style="white-space:pre-wrap">${(interview.alsoConsiderNotes || '—').replace(/</g, '&lt;')}</span></div>
    </div>

    <h2 class="section-title">Additional Notes</h2>
    <div class="info-grid" style="grid-template-columns:1fr">
      <div class="info-row"><span class="info-value" style="white-space:pre-wrap">${(interview.additionalNotes || '—').replace(/</g, '&lt;')}</span></div>
    </div>
  `;

  openPrintWindow({
    title: `Candidate Interview — ${candidateName}`,
    subtitle: `${position} · ${date}`,
    html,
  });
}
