const v="PANDA EXPRESS #1687",y="#C8102E",E=`
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
    background: ${y};
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
    color: ${y};
    border-bottom: 1.5px solid ${y};
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
    background: ${y};
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
`,P=`
  function showCloseBar() {
    var bar = document.getElementById('close-tab-bar');
    if (bar) bar.classList.add('visible');
  }
  window.addEventListener('afterprint', showCloseBar);
  // Fallback: show after 3 s in case afterprint never fires (some browsers)
  setTimeout(showCloseBar, 3000);
  document.getElementById('close-tab-btn')
    .addEventListener('click', function() { window.close(); });
`;function C({title:n,subtitle:r="",html:o,autoPrint:d=!0}){const c=new Date,g=c.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),b=c.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),m=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${v} — ${n}</title>
  <style>${E}</style>
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
      <div class="report-header-store">${v}</div>
      <div class="report-header-title">${n}</div>
      ${r?`<div class="report-header-store" style="margin-top:2px">${r}</div>`:""}
    </div>
    <div class="report-header-date">
      ${g}<br/>${b}<br/>Panda Manager Hub
    </div>
  </div>

  <!-- Report content -->
  ${o}

  <!-- Footer -->
  <div class="report-footer">
    <span>${v} — Panda Manager Hub</span>
    <span>Printed: ${g} ${b}</span>
  </div>

</div>

<script>
  ${P}
  ${d?'window.addEventListener("load", function(){ window.print(); });':""}
<\/script>
</body>
</html>`,f=window.open("","_blank");if(!f){alert("Popup blocked — please allow popups for this site to print reports.");return}f.document.write(m),f.document.close()}function T(n){return`<div class="stats-row">${n.map(r=>`
    <div class="stat-box">
      <div class="stat-value">${r.value}</div>
      <div class="stat-label">${r.label}</div>
    </div>`).join("")}</div>`}function R(n){return`<div class="info-grid">${n.map(([r,o])=>`
    <div class="info-row">
      <span class="info-label">${r}:</span>
      <span class="info-value">${o||"—"}</span>
    </div>`).join("")}</div>`}function M(n,r=5){const o="★".repeat(Math.round(n)),d="☆".repeat(r-Math.round(n));return`<span class="stars">${o}${d}</span> ${n}/${r}`}function I(n,r="gray"){return`<span class="badge badge-${r}">${n}</span>`}function W(n){return n<2?"green":n<4?"blue":n<6?"yellow":n<8?"orange":"red"}function L(n){return n<2?"Good Standing":n<4?"Coaching":n<6?"First Written Warning":n<8?"Final Written Warning":"Termination Eligible"}function F(n,r){const o=new Date,d=new Date(o);d.setDate(d.getDate()-90);function c(e){try{const t=new Date(e);return isNaN(t)?null:t}catch{return null}}function g(e){if(e.points!==void 0)return Number(e.points);const t={tardy_minor:.5,tardy_moderate:1,tardy_severe:1.5,early_partial:1,early_walkout:2,absence_excused:1,absence_unexcused:2,absence_noshow:3};return e.subtypeId&&t[e.subtypeId]!==void 0?t[e.subtypeId]:{"No-Show":3,Unexcused:2,"Late/Tardy":1,Excused:0}[e.type]??0}function b(e){const t={tardiness:"⏰ Tardiness",early_departure:"🚪 Early Departure",absence:"🚫 Absence",protected:"🛡️ Protected (0 pts)",emergency:"🏥 Emergency (0 pts)"};return e.categoryId&&t[e.categoryId]?t[e.categoryId]:e.type||"Unknown"}function m(e){const t={tardy_minor:"Minor (1–30 min late)",tardy_moderate:"Moderate (31–60 min late)",tardy_severe:"Severe (60+ min late)",early_partial:"Left early (with notice)",early_walkout:"Left early (without notice)",absence_excused:"Excused absence",absence_unexcused:"Unexcused absence",absence_noshow:"No-Show (no contact)",protected_fmla:"FMLA / Medical Leave",protected_jury:"Jury Duty",protected_military:"Military Service",protected_bereavement:"Bereavement",protected_healthcode:"Health Code Related",protected_other:"Other Protected",emergency_medical:"Medical Emergency",emergency_accident:"Accident / Police Report",emergency_family:"Family Emergency",emergency_discretion:"Manager Discretion Waiver"};return e.subtypeId&&t[e.subtypeId]?t[e.subtypeId]:e.type||"—"}function f(e){return e<2?{bg:"#f0fff4",border:"#86efac",text:"#15803d",label:"✅ Good Standing"}:e<4?{bg:"#eff6ff",border:"#93c5fd",text:"#1d4ed8",label:"💬 Coaching"}:e<6?{bg:"#fefce8",border:"#fde047",text:"#854d0e",label:"📋 First Written Warning"}:e<8?{bg:"#fff7ed",border:"#fdba74",text:"#c2410c",label:"⚠️ Final Written Warning"}:{bg:"#fff1f2",border:"#fca5a5",text:"#b91c1c",label:"🔴 Termination Eligible"}}const h=r.filter(e=>e.associateId===n.id).sort((e,t)=>new Date(t.date)-new Date(e.date)),a=h.filter(e=>{const t=c(e.date);return t&&t>=d}),w=a.reduce((e,t)=>e+g(t),0);let x=0,i=0,u="";if(a.length>0){const e=a.map(t=>c(t.date)).filter(Boolean).reduce((t,p)=>p>t?p:t,new Date(0));if(i=Math.floor((o-e)/864e5),i>=60)x=1,u=`${i}-day clean streak → −1.0 pt recovery applied ✅`;else if(i>=30)x=.5,u=`${i}-day clean streak → −0.5 pt recovery applied ✅`;else{const t=i<30?30-i:60-i;u=`${i}-day clean streak · ${t} more day${t!==1?"s":""} until next recovery bonus`}}else i=90,u="90+ days incident-free ✅";const s=Math.max(0,Math.round((w-x)*10)/10),l=f(s),$=o.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),k=a.length===0?'<tr><td colspan="5" style="text-align:center;color:#888;padding:16px">No incidents in the past 90 days ✅</td></tr>':a.map(e=>{const t=g(e),p=t===0,A=p?"#15803d":t>=3?"#b91c1c":t>=2?"#c2410c":t>=1?"#854d0e":"#1d4ed8",D=p?"#f0fff4":t>=3?"#fee2e2":t>=2?"#ffedd5":t>=1?"#fefce8":"#eff6ff";return`<tr>
          <td>${e.date||""}${e.time?'<br/><span style="font-size:10px;color:#888">'+e.time+"</span>":""}</td>
          <td>${b(e)}</td>
          <td>${m(e)}</td>
          <td>${e.reason||"—"}</td>
          <td style="text-align:center">
            <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-weight:bold;font-size:11px;background:${D};color:${A}">
              ${p?"0 pts":"+"+t+" pt"+(t!==1?"s":"")}
            </span>
          </td>
        </tr>`}).join(""),_=h.filter(e=>{const t=c(e.date);return t&&t<d}),S=_.length>0?`
    <h2 class="section-title" style="color:#999;border-color:#ddd">Expired Records (older than 90 days — 0 pts)</h2>
    <table>
      <thead><tr>
        <th>Date</th><th>Category</th><th>Type</th><th style="width:60px">Original Pts</th>
      </tr></thead>
      <tbody>
        ${_.map(e=>`<tr style="color:#aaa">
          <td>${e.date||""}</td>
          <td>${b(e)}</td>
          <td>${m(e)}</td>
          <td style="text-align:center"><span style="text-decoration:line-through">${g(e)} pts</span></td>
        </tr>`).join("")}
      </tbody>
    </table>`:"",z=`
    <!-- Associate info -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;padding:12px 16px;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px">
      <div style="width:52px;height:52px;background:${y};border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:bold;flex-shrink:0">
        ${(n.name||"?")[0].toUpperCase()}
      </div>
      <div>
        <div style="font-size:16px;font-weight:bold;color:#111">${n.name||"Unknown"}</div>
        <div style="font-size:11px;color:#666;margin-top:2px">
          ${n.position||"Team Member"} &nbsp;·&nbsp;
          Emp ID: ${n.employeeId||"—"} &nbsp;·&nbsp;
          Hire Date: ${n.hireDate||"—"}
        </div>
        <div style="font-size:11px;color:#666;margin-top:1px">
          Status: <strong>${(n.status||"active").charAt(0).toUpperCase()+(n.status||"active").slice(1)}</strong>
        </div>
      </div>
    </div>

    <!-- Current standing card -->
    <div style="border:2px solid ${l.border};background:${l.bg};border-radius:10px;padding:14px 18px;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:11px;font-weight:bold;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Current Standing — 90-Day Rolling Window</div>
          <div style="font-size:22px;font-weight:bold;color:${l.text}">${l.label}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:28px;font-weight:bold;color:${l.text}">${s} <span style="font-size:14px">pts</span></div>
          ${x>0?`<div style="font-size:11px;color:#15803d;font-weight:bold">Raw ${w} pts − ${x} recovery = ${s} pts</div>`:""}
        </div>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid ${l.border};font-size:11px;color:${l.text}">
        🕐 <strong>Clean streak:</strong> ${u}
      </div>
    </div>

    <!-- Required action box (only if discipline > Good Standing) -->
    ${s>=2?`
    <div style="border:1.5px solid #fca5a5;background:#fff7f7;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:11px">
      <div style="font-weight:bold;color:#b91c1c;margin-bottom:4px">⚠️ Required Action</div>
      <div style="color:#374151">
        ${s>=8?"Associate is <strong>eligible for termination</strong> per PX attendance policy. Contact HR immediately.":s>=6?"A <strong>Final Written Warning</strong> must be issued and documented.":s>=4?"A <strong>First Written Warning</strong> must be issued and documented.":"Schedule a <strong>coaching conversation</strong> and document it in the work file."}
      </div>
    </div>`:""}

    <!-- 90-day incident log -->
    <h2 class="section-title">Attendance Incidents — Past 90 Days (${a.length} record${a.length!==1?"s":""})</h2>
    <table>
      <thead><tr>
        <th style="width:90px">Date</th>
        <th style="width:140px">Category</th>
        <th>Specific Type</th>
        <th>Reason</th>
        <th style="width:70px;text-align:center">Points</th>
      </tr></thead>
      <tbody>${k}</tbody>
    </table>

    ${S}

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
        <div class="legend-item">♻️ 30-day clean streak: <strong>−0.5 pt recovery</strong></div>
        <div class="legend-item">♻️ 60-day clean streak: <strong>−1.0 pt recovery</strong></div>
        <div class="legend-item" style="grid-column:1/-1;color:#888">All points expire after 90 days on a rolling basis.</div>
      </div>
    </div>

    <!-- Signature / acknowledgment block -->
    <div style="margin-top:28px;border:1.5px solid #e0e0e0;border-radius:8px;padding:16px 20px">
      <div style="font-weight:bold;font-size:12px;color:#555;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.4px">
        Associate Acknowledgment
      </div>
      <p style="font-size:11px;color:#555;margin-bottom:18px">
        I acknowledge that I have reviewed my attendance record for the past 90 days and understand my current standing
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
  `;C({title:`Attendance Review — ${n.name||"Associate"}`,subtitle:`Printed ${$} · 90-Day Rolling Window`,html:z})}export{W as a,I as b,M as c,L as d,R as i,C as o,F as p,T as s};
