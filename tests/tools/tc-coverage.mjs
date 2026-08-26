#!/usr/bin/env node
/**
 * TC Coverage — laporan cakupan test case per menu × jenis pengujian.
 *
 * Masalah yang dipecahkan: "sudah punya TC" itu biner dan menyesatkan. Sebuah menu
 * bisa punya 8 TC dan tetap rapuh kalau semuanya happy path. Tool ini membuat gap
 * terlihat sebagai angka, sehingga prioritas penulisan TC berbasis data — bukan tebakan.
 *
 * Jenis pengujian dibaca dari frontmatter `test_type` (rule 13). TC lama yang belum
 * punya field itu dihitung sebagai `unclassified`; kolom "kandidat negatif" adalah
 * BANTUAN heuristik dari kata kunci judul untuk mempercepat backfill — bukan klasifikasi.
 *
 * Pakai:
 *   npm run tc:coverage                 # ringkasan + prioritas gap
 *   npm run tc:coverage -- --all        # semua menu, bukan hanya prioritas
 *   npm run tc:coverage -- --menu {slug}
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');
const args = process.argv.slice(2);
const showAll = args.includes('--all');
const menuFilter = args[args.indexOf('--menu') + 1];

const TYPES = ['happy', 'negative', 'edge', 'permission', 'regression', 'cross-menu'];
const NEGATIVE_HINT =
  /(gagal|invalid|tanpa|kosong|reject|ditolak|tolak|error|melebihi|duplicate|guard|tidak boleh|tidak bisa|tidak dapat|harus|wajib|larangan|blocked|prevent)/i;

function readFm(file) {
  const text = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const get = (k) => fm.match(new RegExp(`^${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim();
  return { tc_code: get('tc_code'), title: get('title') ?? '', test_type: get('test_type') };
}

// Menu yang terlibat flow = prioritas tertinggi (dampaknya lintas menu: stok, GL).
const flowMenus = new Set();
const flowsDir = path.join(qaDocs, 'flows');
const tcToMenu = new Map();

const menus = fs
  .readdirSync(qaDocs, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
  .map((d) => d.name)
  .filter((m) => m !== 'flows');

/**
 * Kumpulkan file TC milik sebuah menu — termasuk yang ditaruh di sub-folder per card
 * (`{menu}/ETM-xxxxx/test-cases/`), pola yang dipakai tim untuk mengelompokkan TC,
 * card.md, dan hasil run dalam satu tempat.
 */
function tcFilesOfMenu(menu) {
  const out = [];
  const walk = (dir, depth) => {
    if (!fs.existsSync(dir) || depth > 3) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, depth + 1);
      else if (/^TC-.*\.md$/.test(e.name) && /[\\/]test-cases[\\/]/.test(full)) out.push(full);
    }
  };
  walk(path.join(qaDocs, menu), 0);
  return out;
}

const stats = new Map();
for (const menu of menus) {
  const row = { menu, total: 0, unclassified: 0, negHint: 0 };
  for (const t of TYPES) row[t] = 0;

  for (const file of tcFilesOfMenu(menu)) {
    const fm = readFm(file);
    if (!fm.tc_code) continue;
    tcToMenu.set(fm.tc_code, menu);
    row.total++;
    if (fm.test_type && TYPES.includes(fm.test_type)) row[fm.test_type]++;
    else {
      row.unclassified++;
      if (NEGATIVE_HINT.test(fm.title)) row.negHint++;
    }
  }
  stats.set(menu, row);
}

if (fs.existsSync(flowsDir)) {
  for (const flow of fs.readdirSync(flowsDir)) {
    const doc = path.join(flowsDir, flow, 'testcase.md');
    if (!fs.existsSync(doc)) continue;
    const fm = fs.readFileSync(doc, 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const block = fm.match(/^recalls:\n((?:\s+-\s+.+\n?)+)/m)?.[1] ?? '';
    for (const line of block.split('\n')) {
      const code = line.match(/-\s+(\S+)/)?.[1];
      const menu = code && tcToMenu.get(code);
      if (menu) flowMenus.add(menu);
    }
  }
}

function fmtRow(r) {
  const cells = TYPES.map((t) => String(r[t]).padStart(3));
  const unc = r.unclassified ? String(r.unclassified).padStart(3) : '  -';
  const hint = r.negHint ? ` (~${r.negHint} kandidat negatif)` : '';
  return `  ${r.menu.padEnd(42)} ${String(r.total).padStart(4)} |${cells.join(' ')} | ${unc}${hint}`;
}

const header =
  `  ${'MENU'.padEnd(42)} ${'TOT'.padStart(4)} |` +
  TYPES.map((t) => t.slice(0, 3).toUpperCase().padStart(3)).join(' ') +
  ' | UNC';

if (menuFilter) {
  const r = stats.get(menuFilter);
  if (!r) {
    console.error(`Menu '${menuFilter}' tidak ada di qa-docs/`);
    process.exit(1);
  }
  console.log(`TC Coverage — ${menuFilter}\n`);
  console.log(header);
  console.log(fmtRow(r));
  process.exit(0);
}

const withTc = [...stats.values()].filter((r) => r.total > 0);
const withoutTc = [...stats.values()].filter((r) => r.total === 0);
const sum = (key) => withTc.reduce((a, r) => a + r[key], 0);

console.log('TC Coverage — OlshopERP\n');
console.log(`Menu           : ${menus.length} total · ${withTc.length} punya TC · ${withoutTc.length} kosong`);
console.log(`Test case      : ${sum('total')} total`);
console.log(
  `Klasifikasi    : ` +
    TYPES.map((t) => `${t} ${sum(t)}`).join(' · ') +
    ` · unclassified ${sum('unclassified')}`,
);

// ── Prioritas 1: menu yang dipakai flow tapi minim pengujian negatif ──
console.log(`\n── Prioritas 1 — menu dalam flow E2E (dampak lintas menu: stok/GL) ──`);
console.log(header);
for (const r of [...flowMenus].map((m) => stats.get(m)).filter(Boolean).sort((a, b) => a.menu.localeCompare(b.menu))) {
  console.log(fmtRow(r));
}

// ── Prioritas 2: punya TC tapi 0 negatif & 0 edge ──
const shallow = withTc
  .filter((r) => r.negative === 0 && r.edge === 0 && !flowMenus.has(r.menu))
  .sort((a, b) => b.total - a.total);
console.log(`\n── Prioritas 2 — punya TC tapi 0 negative & 0 edge (${shallow.length} menu) ──`);
console.log(header);
for (const r of (showAll ? shallow : shallow.slice(0, 12))) console.log(fmtRow(r));
if (!showAll && shallow.length > 12) console.log(`  … ${shallow.length - 12} menu lagi (pakai --all)`);

// ── Prioritas 3: belum punya TC sama sekali ──
console.log(`\n── Prioritas 3 — belum punya TC sama sekali (${withoutTc.length} menu) ──`);
const names = withoutTc.map((r) => r.menu).sort();
for (const n of (showAll ? names : names.slice(0, 15))) console.log(`  ${n}`);
if (!showAll && names.length > 15) console.log(`  … ${names.length - 15} menu lagi (pakai --all)`);

console.log(
  `\nCatatan: kolom UNC = TC tanpa \`test_type\` (rule 13). "(~n kandidat negatif)" hanya` +
    ` bantuan heuristik dari judul untuk mempercepat backfill — bukan klasifikasi resmi.`,
);
