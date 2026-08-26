#!/usr/bin/env node
/**
 * TC Selftest — menguji GATE-nya, bukan dokumennya.
 *
 * Kenapa ada: aturan yang hanya ditulis di rules bergantung pada kepatuhan agent.
 * Yang bisa dipercaya hanya aturan yang **ditolak mesin**. Tool ini membangun repo
 * qa-docs tiruan berisi pelanggaran buatan, menjalankan `tc-lint` di atasnya, dan
 * memastikan tiap pelanggaran benar-benar ditangkap (dan yang sah tidak salah tangkap).
 *
 * Kalau sebuah aturan tidak punya case di sini, artinya aturan itu TIDAK dijaga
 * siapa pun — anggap saja imbauan.
 *
 * Pakai: node tests/tools/tc-selftest.mjs   (atau: npm run tc:selftest)
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const realRoot = path.resolve(here, '..', '..');

/** TC yang sah — dasar tiap case; tiap case menimpa sebagian field. */
const BASE = {
  doc_type: 'e2e-test-case',
  tc_code: 'TC-SELF-001',
  menu: 'selftest-menu',
  menu_name: '"Selftest Menu"',
  test_type: 'happy',
  title: '"Selftest — TC dasar yang sah"',
  status: 'draft',
  automated: 'false',
  automated_spec: 'null',
  related_menus: '[]',
  expected_result: '"Tersimpan."',
  last_execution: { at: 'null', jira: 'null', status: 'not_run', via: 'null' },
};

function render(overrides = {}) {
  const fm = { ...BASE, ...overrides };
  const le = fm.last_execution;
  delete fm.last_execution;
  const lines = Object.entries(fm)
    .filter(([, v]) => v !== undefined)
    // nilai blok (diawali newline) ditulis tanpa spasi setelah titik dua
    .map(([k, v]) => (String(v).startsWith('\n') ? `${k}:${v}` : `${k}: ${v}`));
  if (le !== undefined) {
    lines.push('last_execution:');
    for (const [k, v] of Object.entries(le)) lines.push(`  ${k}: ${v}`);
  }
  return `---\n${lines.join('\n')}\n---\n\n# ${String(fm.tc_code).replace(/"/g, '')}\n`;
}

/**
 * Tiap case: satu pelanggaran, satu potongan pesan yang WAJIB muncul.
 * `expect: null` = harus lolos bersih.
 */
const CASES = [
  { name: 'TC sah lolos bersih', files: { 'TC-SELF-001.md': render() }, expect: null },

  { name: 'status dokumen dipakai untuk hasil run (pass)',
    files: { 'TC-SELF-001.md': render({ status: 'pass' }) },
    expect: 'status dokumen tidak sah' },

  { name: 'hasil run diklaim passed tanpa via (aturan mutlak #2)',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null', status: 'passed', via: 'null' } }) },
    expect: 'passed tanpa `via`' },

  { name: 'passed via spec yang tidak ada',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null', status: 'passed', via: '"tests/specs/hantu/tidak-ada.spec.ts"' } }) },
    expect: 'menunjuk spec yang tidak ada' },

  { name: 'hasil run diklaim dari MCP (aturan mutlak #1)',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null', status: 'passed', via: '"Playwright MCP"' } }) },
    expect: 'menyebut MCP' },

  { name: 'blok last_execution hilang',
    files: { 'TC-SELF-001.md': render({ last_execution: undefined }) },
    expect: 'Tidak ada blok `last_execution`' },

  { name: 'last_execution kurang key',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: 'null', jira: 'null' } }) },
    expect: 'menyimpang' },

  { name: 'last_execution.status di luar enum',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: 'null', jira: 'null', status: 'sukses', via: 'null' } }) },
    expect: 'last_execution.status tidak sah' },

  { name: 'test_result.status di luar enum',
    files: { 'TC-SELF-001.md': render() + '\n' , 'TC-SELF-002.md':
      render({ tc_code: 'TC-SELF-002', title: '"Selftest — test_result liar"' })
        .replace('last_execution:', 'test_result:\n  status: pass\nlast_execution:') },
    expect: 'test_result.status tidak sah' },

  { name: 'run manual dengan nama + notes diterima',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null',
      status: 'passed', via: '"manual:QA - Jeiniffer"', notes: '"Semua field tersimpan; datalist sesuai."' } }) },
    expect: null },

  { name: 'run manual tanpa nama penguji ditolak',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null',
      status: 'passed', via: '"manual:"', notes: '"ok"' } }) },
    expect: 'manual tanpa nama' },

  { name: 'run manual tanpa notes (actual result) ditolak',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null',
      status: 'passed', via: '"manual:QA - Jeiniffer"' } }) },
    expect: 'tanpa `notes`' },

  { name: 'failed pun wajib menyebut asalnya',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: '"2026-08-26"', jira: 'null',
      status: 'failed', via: 'null' } }) },
    expect: 'tanpa `via`' },

  { name: 'notes tidak boleh dipakai di luar run manual',
    files: { 'TC-SELF-001.md': render({ last_execution: { at: 'null', jira: 'null',
      status: 'not_run', via: 'null', notes: '"nyelundup"' } }) },
    expect: 'menyimpang' },

  { name: 'tc_code duplikat',
    files: { 'TC-SELF-001.md': render(), 'TC-SELF-001b.md': render({ title: '"Selftest — kembaran"' }) },
    expect: 'tc_code DUPLIKAT' },

  { name: 'judul duplikat dalam satu menu',
    files: { 'TC-SELF-001.md': render(), 'TC-SELF-002.md': render({ tc_code: 'TC-SELF-002' }) },
    expect: 'Judul DUPLIKAT' },

  { name: 'skema non-rule-13 (hasil crawling, pakai id:)',
    files: { 'TC-SELF-003.md': '---\nid: crawl-001\nmenu_slug: selftest-menu\n---\n' },
    expect: 'Skema TC tidak sesuai rule 13' },

  { name: 'TC baru (PENDING) tanpa test_type',
    files: { 'TC-SELF-DRAFT-20260826120000.md': render({ tc_code: 'PENDING-20260826120000', test_type: undefined }) },
    expect: 'tanpa `test_type`' },

  { name: 'test_type di luar enum',
    files: { 'TC-SELF-001.md': render({ test_type: 'smoke' }) },
    expect: 'test_type tidak sah' },

  { name: 'duplicate_candidate memblokir renumber',
    files: { 'TC-SELF-001.md': render({ duplicate_candidate: 'TC-SELF-999' }) },
    expect: 'kandidat duplikat' },

  { name: 'related_menus menunjuk menu yang tidak ada',
    files: { 'TC-SELF-001.md': render({ related_menus: '\n  - menu-yang-tidak-ada' }) },
    expect: 'menunjuk menu yang tidak ada' },

  { name: 'recalls menunjuk TC yang tidak ada',
    files: { 'TC-SELF-001.md': render({ recalls: '\n  - TC-TIDAK-ADA-999' }) },
    expect: 'me-recall TC yang tidak ada' },
];

function runCase(c) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-selftest-'));
  try {
    const menuDir = path.join(tmp, 'qa-docs', 'selftest-menu', 'test-cases');
    fs.mkdirSync(menuDir, { recursive: true });
    // Menu kedua supaya `related_menus` yang sah punya sasaran nyata.
    fs.mkdirSync(path.join(tmp, 'qa-docs', 'selftest-lain', 'test-cases'), { recursive: true });
    for (const [name, body] of Object.entries(c.files)) {
      fs.writeFileSync(path.join(menuDir, name), body, 'utf-8');
    }
    const res = spawnSync(process.execPath, [path.join(realRoot, 'tests/tools/tc-lint.mjs')], {
      env: { ...process.env, TC_LINT_ROOT: tmp },
      encoding: 'utf-8',
    });
    const out = `${res.stdout}${res.stderr}`;
    if (c.expect === null) {
      return res.status === 0
        ? { ok: true }
        : { ok: false, why: `TC sah malah ditolak:\n${out.split('\n').filter((l) => l.includes('❌')).join('\n')}` };
    }
    if (res.status === 0) return { ok: false, why: `pelanggaran LOLOS (exit 0) — gate tidak ada` };
    if (!out.includes(c.expect)) {
      return { ok: false, why: `ditolak, tapi bukan karena alasan yang dimaksud (cari: "${c.expect}")\n${out.split('\n').filter((l) => l.includes('❌')).join('\n')}` };
    }
    return { ok: true };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * Gate arah sync (rule 15). Dua arah, dan arahnya TIDAK boleh tertukar:
 *   dokumen sistem  -> sumber repo developer
 *   artefak uji     -> sumber repo ini, wajib termirror ke developer (Help Center)
 */
function runDriftCases() {
  const out = [];
  const mk = () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-'));
    const dev = path.join(tmp, 'dev', 'docs', 'qa-docs', 'menu-x');
    const qa = path.join(tmp, 'qa', 'qa-docs', 'menu-x');
    fs.mkdirSync(path.join(dev, 'test-cases'), { recursive: true });
    fs.mkdirSync(path.join(qa, 'test-cases'), { recursive: true });
    return { tmp, dev, qa };
  };
  const run = (tmp, args = []) =>
    spawnSync(process.execPath, [path.join(realRoot, 'tests/tools/docs-drift.mjs'), ...args], {
      env: { ...process.env, DOCS_DRIFT_ROOT: path.join(tmp, 'qa'), OLSHOP_DEV_REPO: path.join(tmp, 'dev') },
      encoding: 'utf-8',
    });
  const check = (name, ok, why) => out.push({ name, ok, why });

  // Arah 1: dokumen sistem — developer menang
  {
    const { tmp, dev, qa } = mk();
    fs.writeFileSync(path.join(dev, 'requirement.md'), 'version: 2.4\n');
    fs.writeFileSync(path.join(qa, 'requirement.md'), 'version: 2.3\n');
    const r = run(tmp);
    check('requirement tertinggal dari developer terdeteksi',
      r.status === 1 && r.stdout.includes('dokumen sistem tidak sinkron'), r.stdout);
    run(tmp, ['--fix']);
    check('sync menarik requirement versi developer',
      fs.readFileSync(path.join(qa, 'requirement.md'), 'utf-8').includes('2.4'),
      'versi developer tidak ditarik — arah dokumen sistem terbalik');
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // Arah 2: test case — repo ini menang, dan WAJIB termirror
  {
    const { tmp, dev, qa } = mk();
    fs.writeFileSync(path.join(qa, 'test-cases', 'TC-X-001.md'), 'versi QA terbaru\n');
    const r = run(tmp);
    check('TC yang belum termirror ke developer terdeteksi',
      r.status === 1 && r.stdout.includes('belum termirror'), r.stdout);
    run(tmp, ['--fix']);
    check('sync mendorong TC ke developer (Help Center)',
      fs.existsSync(path.join(dev, 'test-cases', 'TC-X-001.md')), 'TC tidak ikut didorong');
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // Arah tidak boleh tertukar: TC lama di developer TIDAK boleh menimpa versi di sini
  {
    const { tmp, dev, qa } = mk();
    fs.writeFileSync(path.join(dev, 'test-cases', 'TC-X-001.md'), 'versi developer LAMA\n');
    fs.writeFileSync(path.join(qa, 'test-cases', 'TC-X-001.md'), 'versi QA BARU\n');
    run(tmp, ['--fix']);
    check('TC developer yang lama tidak menimpa versi QA',
      fs.readFileSync(path.join(qa, 'test-cases', 'TC-X-001.md'), 'utf-8').includes('BARU'),
      'versi QA tertimpa — arah artefak uji terbalik');
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return out;
}

console.log(`TC Selftest — ${CASES.length + 5} gate diuji\n`);
let failed = 0;
for (const c of CASES) {
  const r = runCase(c);
  if (r.ok) {
    console.log(`  ✅ ${c.name}`);
  } else {
    failed++;
    console.log(`  ❌ ${c.name}\n       ${r.why.replace(/\n/g, '\n       ')}`);
  }
}
for (const r of runDriftCases()) {
  if (r.ok) console.log(`  ✅ ${r.name}`);
  else { failed++; console.log(`  ❌ ${r.name}\n       ${r.why}`); }
}

if (failed) {
  console.log(`\n${failed} gate TIDAK bekerja — aturannya cuma imbauan sampai ini hijau.`);
  process.exit(1);
}
console.log(`\nSemua gate bekerja. Aturan yang diuji di sini ditegakkan mesin, bukan kepercayaan.`);
