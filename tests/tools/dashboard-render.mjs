#!/usr/bin/env node
/**
 * Render dashboard/dashboard-data.json (hasil dashboard-build.mjs) jadi halaman statis
 * self-contained dashboard/index.html. Data di-bake langsung ke markup (bukan fetch
 * client-side) karena ini snapshot manual, bukan halaman yang live-refresh.
 *
 * Pakai: npm run dashboard:build && npm run dashboard:render
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dataPath = path.join(root, 'dashboard', 'dashboard-data.json');
const outPath = path.join(root, 'dashboard', 'index.html');

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function fmtDate(iso, withTime = false) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const date = `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
  if (!withTime) return date;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${date}, ${hh}:${mm}`;
}

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function statusPill(status) {
  if (status === 'passed') return '<span class="pill good">Passed</span>';
  if (status === 'failed' || status === 'error') return '<span class="pill bad">Failed</span>';
  return '<span class="pill warn">Belum run</span>';
}

function main() {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const { summary, modules, recent_failures, recent_runs, generated_at } = data;

  const topFailure = recent_failures[0];
  const execBreakdown = `${summary.executed_automated_tc ?? 0} otomasi · ${summary.executed_manual_tc ?? 0} manual`;
  const banner = topFailure
    ? `<div class="banner">
        <span class="dot"></span>
        <div class="banner-body">
          <div class="headline">${summary.failed} dari ${summary.executed_tc} TC berstatus gagal di eksekusi terakhirnya</div>
          <div class="sub">${esc(topFailure.menu_name)} — ${esc(topFailure.title)}</div>
        </div>
        <a class="cta" href="#needs-attention">Lihat detail ↓</a>
      </div>`
    : `<div class="banner good-banner">
        <span class="dot good-dot"></span>
        <div class="banner-body">
          <div class="headline">Semua TC lulus di eksekusi terakhirnya</div>
          <div class="sub">${summary.executed_tc} dari ${summary.total_tc} TC sudah pernah dijalankan (${execBreakdown}).</div>
        </div>
      </div>`;

  const moduleCards = modules
    .map((m) => {
      const ratioBase = m.executed || 1;
      const pct = Math.round((m.passed / ratioBase) * 100);
      const barClass = m.failed > 0 ? 'bad' : 'good';
      const dotClass = m.failed > 0 ? 'bad' : 'good';
      return `<div class="module-card">
        <div class="row1">
          <span class="status-dot ${dotClass}"></span>
          <span class="name">${esc(m.module)}</span>
          <span class="ratio">${m.passed} / ${m.executed}</span>
        </div>
        <div class="bar"><span class="${barClass}" style="width:${pct}%"></span></div>
        <div class="foot"><span>${m.total} TC</span><span>${m.last_run ? fmtDate(m.last_run) : 'belum ada run'}</span></div>
      </div>`;
    })
    .join('\n');

  const failureCards = recent_failures
    .map(
      (f) => `<div class="failure" id="fail-${esc(f.tc_code)}">
        <div class="top">
          <span class="tc-id">${esc(f.tc_code)}</span>
          <span class="pill bad">Failed</span>
          <span class="when">${fmtDate(f.finished_at, true)}</span>
        </div>
        <p class="title">${esc(f.menu_name)} — ${esc(f.title)}</p>
        ${f.log_summary ? `<div class="err">${esc(f.log_summary)}</div>` : ''}
        <div class="spec mono">${esc(f.automated_spec || f.execution_via || '—')}</div>
      </div>`
    )
    .join('\n');

  const runRows = recent_runs
    .slice(0, 60)
    .map(
      (r) => `<div class="detail-row">
        <span class="status-dot ${r.status === 'passed' ? 'good' : 'bad'}"></span>
        <span class="tc">${esc(r.tc_code)}</span>
        <span class="t">${esc(r.title)}</span>
        <span class="when">${fmtDate(r.finished_at)}</span>
      </div>`
    )
    .join('\n');

  const html = `<!doctype html>
<title>OlshopERP Test Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: #eef0f2; --surface: #ffffff; --surface-2: #f6f7f9;
    --ink: #161a21; --ink-soft: #5a6270; --ink-faint: #8890a0;
    --border: #dde1e7; --border-strong: #c7cdd6;
    --accent: #3c4a8c; --accent-soft: #eceefa; --accent-ink: #2c3868;
    --good: #1c8a5c; --good-soft: #e5f5ee;
    --warn: #a9750a; --warn-soft: #fbf1de;
    --bad: #c23d3d; --bad-soft: #fbe9e8;
    --shadow: 0 1px 2px rgba(20, 24, 33, 0.04), 0 8px 24px -12px rgba(20, 24, 33, 0.12);
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --paper: #0e1116; --surface: #161a22; --surface-2: #1c212b;
      --ink: #e8eaef; --ink-soft: #a0a7b5; --ink-faint: #6c7484;
      --border: #262c38; --border-strong: #333a48;
      --accent: #8b96d9; --accent-soft: #232a48; --accent-ink: #c2c9ee;
      --good: #3fbf88; --good-soft: #14261f;
      --warn: #dba13f; --warn-soft: #2b2415;
      --bad: #e2726c; --bad-soft: #2c1a1a;
      --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5);
      color-scheme: dark;
    }
  }
  :root[data-theme="dark"] {
    --paper: #0e1116; --surface: #161a22; --surface-2: #1c212b;
    --ink: #e8eaef; --ink-soft: #a0a7b5; --ink-faint: #6c7484;
    --border: #262c38; --border-strong: #333a48;
    --accent: #8b96d9; --accent-soft: #232a48; --accent-ink: #c2c9ee;
    --good: #3fbf88; --good-soft: #14261f;
    --warn: #dba13f; --warn-soft: #2b2415;
    --bad: #e2726c; --bad-soft: #2c1a1a;
    --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5);
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: "Public Sans", system-ui, -apple-system, sans-serif; font-size: 15px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
  .mono { font-family: "IBM Plex Mono", ui-monospace, monospace; font-variant-numeric: tabular-nums; }
  .wrap { max-width: 960px; margin: 0 auto; padding: 2.25rem 1.5rem 5rem; }
  .sample-tag { display: inline-flex; align-items: center; gap: 0.4rem; font-family: "IBM Plex Mono", monospace; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); border: 1px solid var(--border-strong); border-radius: 999px; padding: 0.25rem 0.65rem; margin-bottom: 1.1rem; }
  .sample-tag::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
  header h1 { font-size: 1.7rem; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 0.3rem; text-wrap: balance; }
  header p { margin: 0; color: var(--ink-soft); font-size: 0.92rem; max-width: 52ch; }
  .meta { text-align: right; font-size: 0.82rem; color: var(--ink-faint); }
  .meta strong { display: block; color: var(--ink-soft); font-weight: 600; font-size: 0.82rem; }
  .switch { display: inline-flex; background: var(--surface-2); border: 1px solid var(--border); border-radius: 9px; padding: 3px; margin-bottom: 1.5rem; }
  .switch button { font: inherit; font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); background: transparent; border: none; border-radius: 7px; padding: 0.4rem 0.9rem; cursor: pointer; }
  .switch button.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }
  .switch button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
  .banner { display: flex; align-items: center; gap: 0.9rem; padding: 1rem 1.15rem; border-radius: 12px; border: 1px solid var(--bad); background: var(--bad-soft); margin-bottom: 1.5rem; }
  .banner.good-banner { border-color: var(--good); background: var(--good-soft); }
  .banner .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--bad); flex: none; box-shadow: 0 0 0 4px color-mix(in srgb, var(--bad) 18%, transparent); }
  .banner .dot.good-dot { background: var(--good); box-shadow: 0 0 0 4px color-mix(in srgb, var(--good) 18%, transparent); }
  .banner-body { flex: 1; min-width: 0; }
  .banner-body .headline { font-weight: 700; font-size: 0.98rem; color: var(--ink); }
  .banner-body .sub { font-size: 0.85rem; color: var(--ink-soft); margin-top: 0.15rem; }
  .banner a.cta { flex: none; font-size: 0.82rem; font-weight: 600; color: var(--bad); text-decoration: none; border: 1px solid color-mix(in srgb, var(--bad) 45%, transparent); border-radius: 8px; padding: 0.45rem 0.8rem; white-space: nowrap; }
  .banner a.cta:hover { background: color-mix(in srgb, var(--bad) 10%, transparent); }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem; margin-bottom: 1.75rem; }
  .stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0.95rem 1.05rem; box-shadow: var(--shadow); }
  .stat .label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-faint); font-weight: 600; }
  .stat .value { font-family: "IBM Plex Mono", monospace; font-size: 1.65rem; font-weight: 600; margin-top: 0.3rem; letter-spacing: -0.01em; }
  .stat .value.good { color: var(--good); }
  .stat .value.bad { color: var(--bad); }
  .stat .sub { font-size: 0.76rem; color: var(--ink-faint); margin-top: 0.15rem; }
  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 0.8rem; }
  .section-head h2 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; color: var(--ink-soft); margin: 0; }
  .section-head .count { font-size: 0.78rem; color: var(--ink-faint); font-family: "IBM Plex Mono", monospace; }
  .modules { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 2rem; }
  .module-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0.85rem 1rem; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 0.5rem; }
  .module-card .row1 { display: flex; align-items: center; gap: 0.55rem; }
  .status-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
  .status-dot.good { background: var(--good); }
  .status-dot.bad { background: var(--bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--bad) 20%, transparent); }
  .module-card .name { font-weight: 600; font-size: 0.92rem; }
  .module-card .ratio { margin-left: auto; font-family: "IBM Plex Mono", monospace; font-size: 0.82rem; color: var(--ink-soft); }
  .module-card .foot { font-size: 0.76rem; color: var(--ink-faint); display: flex; justify-content: space-between; }
  .bar { height: 5px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .bar > span { display: block; height: 100%; border-radius: 999px; }
  .bar > span.good { background: var(--good); }
  .bar > span.bad { background: var(--bad); }
  .failure { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--bad); border-radius: 10px; padding: 0.9rem 1.05rem; margin-bottom: 0.7rem; box-shadow: var(--shadow); }
  .failure .top { display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap; }
  .tc-id { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 0.85rem; }
  .pill { display: inline-block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 0.18rem 0.5rem; border-radius: 999px; }
  .pill.bad { background: var(--bad-soft); color: var(--bad); }
  .pill.good { background: var(--good-soft); color: var(--good); }
  .pill.warn { background: var(--warn-soft); color: var(--warn); }
  .failure .when { margin-left: auto; font-size: 0.78rem; color: var(--ink-faint); font-family: "IBM Plex Mono", monospace; }
  .failure .title { font-size: 0.9rem; margin: 0.4rem 0 0; }
  .failure .err { margin-top: 0.5rem; background: var(--surface-2); border-radius: 7px; padding: 0.5rem 0.7rem; font-family: "IBM Plex Mono", monospace; font-size: 0.76rem; color: var(--bad); overflow-x: auto; white-space: pre-wrap; }
  .failure .spec { margin-top: 0.5rem; font-size: 0.74rem; color: var(--ink-faint); overflow-x: auto; }
  .detail-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .detail-row { display: grid; grid-template-columns: 16px 108px 1fr 90px; align-items: center; gap: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 0.6rem 0.85rem; font-size: 0.85rem; }
  .detail-row .tc { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 0.8rem; }
  .detail-row .t { color: var(--ink-soft); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .detail-row .when { color: var(--ink-faint); font-size: 0.78rem; text-align: right; }
  .hidden { display: none !important; }
  footer.note { margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border); font-size: 0.8rem; color: var(--ink-faint); }
  @media (max-width: 620px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
    .modules { grid-template-columns: 1fr; }
    .detail-row { grid-template-columns: 12px 80px 1fr; }
    .detail-row .when { display: none; }
    header .meta { text-align: left; }
  }
</style>

<div class="wrap">
  <span class="sample-tag">Snapshot manual — belum ada scheduler otomatis</span>

  <header>
    <div>
      <h1>OlshopERP Test Dashboard</h1>
      <p>Rekap hasil eksekusi tim (Playwright CLI &amp; manual QA) — ${esc(summary.executed_tc)} dari ${esc(summary.total_tc)} TC terdaftar (${execBreakdown}).</p>
    </div>
    <div class="meta">
      <strong>Snapshot ${fmtDate(generated_at, true)}</strong>
      bukan live — jalankan ulang <span class="mono">dashboard:build</span> untuk refresh
    </div>
  </header>

  <div class="switch" role="tablist" aria-label="Dashboard view">
    <button type="button" class="active" id="btn-exec" role="tab" aria-selected="true">Executive</button>
    <button type="button" id="btn-eng" role="tab" aria-selected="false">Engineering</button>
  </div>

  ${banner}

  <div class="stats">
    <div class="stat">
      <div class="label">Pass rate</div>
      <div class="value ${summary.pass_rate >= 90 ? 'good' : 'bad'}">${summary.pass_rate ?? '—'}%</div>
      <div class="sub">${summary.passed} dari ${summary.executed_tc} eksekusi</div>
    </div>
    <div class="stat">
      <div class="label">Gagal</div>
      <div class="value ${summary.failed > 0 ? 'bad' : 'good'}">${summary.failed}</div>
      <div class="sub">di eksekusi terakhirnya</div>
    </div>
    <div class="stat">
      <div class="label">Sudah dieksekusi</div>
      <div class="value">${summary.executed_tc}</div>
      <div class="sub">${execBreakdown} · ${summary.automated_tc} punya spec otomasi</div>
    </div>
    <div class="stat">
      <div class="label">Belum pernah run</div>
      <div class="value">${summary.never_run_tc}</div>
      <div class="sub">dari katalog TC</div>
    </div>
  </div>

  <div class="section-head">
    <h2>Per module</h2>
    <span class="count mono">${modules.length} module</span>
  </div>
  <div class="modules">
${moduleCards}
  </div>

  <div class="section-head" id="needs-attention">
    <h2>Perlu perhatian</h2>
    <span class="count mono">${recent_failures.length} gagal</span>
  </div>
  ${recent_failures.length > 0 ? failureCards : '<p style="color:var(--ink-faint);font-size:0.88rem;">Tidak ada kegagalan di histori eksekusi terakhir.</p>'}

  <div id="eng-view" class="hidden">
    <div class="section-head" style="margin-top:2rem;">
      <h2>Semua eksekusi terakhir per TC</h2>
      <span class="count mono">${Math.min(recent_runs.length, 60)} dari ${recent_runs.length}</span>
    </div>
    <div class="detail-list">
${runRows}
    </div>
  </div>

  <footer class="note">
    Sumber: <span class="mono">last_execution</span> (utama) + <span class="mono">test_result</span> (fallback) di TC-*.md — bukan menjalankan test baru. Mencakup run Playwright CLI dan manual QA. Refresh manual: <span class="mono">npm run dashboard:build</span>. TC belum pernah run (${summary.never_run_tc}) tidak ikut pass rate.
  </footer>
</div>

<script>
  var btnExec = document.getElementById('btn-exec');
  var btnEng = document.getElementById('btn-eng');
  var engView = document.getElementById('eng-view');
  function setView(showEng) {
    engView.classList.toggle('hidden', !showEng);
    btnExec.classList.toggle('active', !showEng);
    btnEng.classList.toggle('active', showEng);
    btnExec.setAttribute('aria-selected', String(!showEng));
    btnEng.setAttribute('aria-selected', String(showEng));
  }
  btnExec.addEventListener('click', function () { setView(false); });
  btnEng.addEventListener('click', function () { setView(true); });
</script>
`;

  fs.writeFileSync(outPath, html);
  console.log(`Ditulis ke ${path.relative(root, outPath)}`);
}

main();
