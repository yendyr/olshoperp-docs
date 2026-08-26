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

console.log(`TC Selftest — ${CASES.length} gate diuji\n`);
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
if (failed) {
  console.log(`\n${failed} gate TIDAK bekerja — aturannya cuma imbauan sampai ini hijau.`);
  process.exit(1);
}
console.log(`\nSemua gate bekerja. Aturan yang diuji di sini ditegakkan mesin, bukan kepercayaan.`);
