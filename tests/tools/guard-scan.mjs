#!/usr/bin/env node
/**
 * Guard Scan — memetakan **guard/validasi backend** menjadi kandidat negative test case.
 *
 * Masalah yang dipecahkan: negative TC selama ini dikarang dari asumsi, sehingga jarang
 * ditulis dan sering meleset. Padahal backend sudah memuat daftar kondisi-yang-harus-
 * ditolak secara eksplisit, lengkap dengan pesan errornya — itulah expected result yang
 * paling akurat. Contoh nyata: "The selected destination warehouse must be level of 20
 * or below and smallest warehouse" baru kita temukan lewat test yang gagal, padahal
 * sudah tertulis di controller sejak awal.
 *
 * Pemetaan controller → menu memakai `code_globs.backend` di qa-docs/_meta/manifest.yaml.
 *
 * REPO BACKEND HANYA DIBACA (rule 15 § Kontrak read-only repo app).
 *
 * Pakai:
 *   npm run guard:scan                    # ringkasan + menu dengan gap terbesar
 *   npm run guard:scan -- --menu {slug}   # daftar kandidat negative TC untuk satu menu
 *   npm run guard:scan -- --all           # semua menu
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const backendRoot = path.resolve(root, '../olshoperp');
const qaDocs = path.join(root, 'qa-docs');
const args = process.argv.slice(2);
const showAll = args.includes('--all');
const menuFilter = args.includes('--menu') ? args[args.indexOf('--menu') + 1] : null;

if (!fs.existsSync(backendRoot)) {
  console.error(
    `❌ Repo backend tidak ditemukan di ${backendRoot}.\n` +
      `   Rule 15 § Repo & path: ketiga repo harus sibling. Jangan tebak lokasi — lapor ke user.`,
  );
  process.exit(1);
}

// ── manifest: menu → daftar glob backend ────────────────────────────────────
const manifest = fs.readFileSync(path.join(qaDocs, '_meta', 'manifest.yaml'), 'utf-8');
const menuBlocks = [...manifest.matchAll(/^ {2}([a-z0-9-]+):\n([\s\S]*?)(?=^ {2}[a-z0-9-]+:\n|\Z)/gm)];
const menuGlobs = new Map();
for (const [, slug, body] of menuBlocks) {
  const be = body.match(/backend:\s*\n((?:\s+- .*\n)+)/)?.[1];
  if (!be) continue;
  const globs = be
    .split('\n')
    .map((l) => l.match(/-\s+(\S+)/)?.[1])
    .filter(Boolean);
  if (globs.length) menuGlobs.set(slug, globs);
}

// ── resolve glob sederhana (* di nama file) ────────────────────────────────
function resolveGlob(glob) {
  const abs = path.join(backendRoot, glob);
  if (!glob.includes('*')) return fs.existsSync(abs) ? [abs] : [];
  const dir = path.dirname(abs);
  if (!fs.existsSync(dir)) return [];
  const pattern = new RegExp(`^${path.basename(abs).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
  return fs
    .readdirSync(dir)
    .filter((f) => pattern.test(f))
    .map((f) => path.join(dir, f));
}

/**
 * Guard "kuat" = merumuskan ATURAN BISNIS yang bisa dipicu sengaja dari UI
 * (batas, syarat, larangan). Guard lain umumnya kondisi internal/race
 * ("parent not found") yang sulit dipicu lewat UI — tetap ditampilkan, tapi
 * tanpa tanda, supaya penulis TC bisa memprioritaskan.
 */
const STRONG =
  /(cannot|can't|can not|must|exceeds?|already|not allowed|tidak boleh|tidak dapat|harus|max(imum)?|min(imum)?|required|at least|greater than|earlier than|not valid|invalid|limit|duplicate|still|before you)/i;

// Pesan terlalu generik untuk jadi TC — tidak menggambarkan kondisi bisnis.
const NOISE =
  /^(data not found|not found|something went wrong|error|failed|unauthorized|forbidden|invalid request|server error)\.?$/i;

function extractGuards(file) {
  const src = fs.readFileSync(file, 'utf-8');
  const out = new Set();
  for (const m of src.matchAll(/\$this->error\(\s*"([^"]{15,300})"/g)) out.add(m[1]);
  for (const m of src.matchAll(/\$this->error\(\s*'([^']{15,300})'/g)) out.add(m[1]);
  for (const m of src.matchAll(/throw new \\?\w*Exception\(\s*"([^"]{15,300})"/g)) out.add(m[1]);
  return [...out]
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => !NOISE.test(s));
}

// ── TC negative yang sudah ada per menu ────────────────────────────────────
function negativeTcCount(menu) {
  const dir = path.join(qaDocs, menu, 'test-cases');
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!/^TC-.*\.md$/.test(f)) continue;
    const fm = fs.readFileSync(path.join(dir, f), 'utf-8').replace(/^﻿/, '');
    if (/^test_type:\s*negative\s*$/m.test(fm)) n++;
  }
  return n;
}

const rows = [];
for (const [menu, globs] of menuGlobs) {
  const guards = new Set();
  const files = new Set();
  for (const g of globs) {
    for (const f of resolveGlob(g)) {
      files.add(path.relative(backendRoot, f));
      for (const msg of extractGuards(f)) guards.add(msg);
    }
  }
  if (guards.size === 0) continue;
  rows.push({
    menu,
    guards: [...guards].sort(),
    files: [...files],
    negativeTc: negativeTcCount(menu),
  });
}

// Urutkan berdasarkan guard "kuat" — itu yang benar-benar layak jadi TC.
rows.sort(
  (a, b) =>
    b.guards.filter((g) => STRONG.test(g)).length - a.guards.filter((g) => STRONG.test(g)).length,
);

if (menuFilter) {
  const r = rows.find((x) => x.menu === menuFilter);
  if (!r) {
    console.error(
      `Menu '${menuFilter}' tidak punya guard backend terdeteksi ` +
        `(cek code_globs.backend di manifest, atau memang tidak ada validasi eksplisit).`,
    );
    process.exit(1);
  }
  console.log(`Guard Scan — ${r.menu}\n`);
  console.log(`Sumber (READ-ONLY): ${r.files.join(', ')}`);
  console.log(`Guard terdeteksi: ${r.guards.length} · TC negative existing: ${r.negativeTc}\n`);
  console.log(`Kandidat negative test case — tiap baris = satu kondisi yang HARUS ditolak sistem.`);
  console.log(`Pesan di bawah adalah expected result-nya (verifikasi dulu apakah muncul di UI):\n`);
  const strong = r.guards.filter((g) => STRONG.test(g));
  const weak = r.guards.filter((g) => !STRONG.test(g));
  console.log(`  ★ PRIORITAS — merumuskan aturan bisnis, umumnya bisa dipicu dari UI (${strong.length}):`);
  strong.forEach((g, i) => console.log(`  ${String(i + 1).padStart(3)}. ${g}`));
  if (weak.length) {
    console.log(`\n  · Lainnya — sering kondisi internal/race, cek dulu apakah bisa dipicu (${weak.length}):`);
    weak.forEach((g, i) => console.log(`  ${String(i + 1).padStart(3)}. ${g}`));
  }
  console.log(
    `\nLangkah: pilih yang benar-benar dapat dipicu dari UI, tulis TC dengan` +
      ` \`test_type: negative\` (rule 13 §3A), expected result mengacu pesan di atas` +
      ` DAN requirement.md. Guard yang tak bisa dipicu dari UI (race/internal) dilewati —` +
      ` catat alasannya di TC terkait bila perlu.`,
  );
  process.exit(0);
}

const totalGuards = rows.reduce((a, r) => a + r.guards.length, 0);
console.log(`Guard Scan — validasi backend sebagai sumber negative test case\n`);
console.log(`Backend  : ${path.relative(root, backendRoot)} (READ-ONLY)`);
console.log(`Terpetakan: ${rows.length} menu · ${totalGuards} guard unik\n`);

const shown = showAll ? rows : rows.slice(0, 20);
console.log(`  ${'MENU'.padEnd(42)} ${'GUARD'.padStart(5)} ${'★'.padStart(4)} ${'NEG-TC'.padStart(6)}  GAP`);
for (const r of shown) {
  const strong = r.guards.filter((g) => STRONG.test(g)).length;
  const flag = r.negativeTc === 0 ? '⚠️  belum ada TC negative' : `${strong - r.negativeTc} belum tercover`;
  console.log(
    `  ${r.menu.padEnd(42)} ${String(r.guards.length).padStart(5)} ${String(strong).padStart(4)} ${String(r.negativeTc).padStart(6)}  ${flag}`,
  );
}
if (!showAll && rows.length > 20) console.log(`  … ${rows.length - 20} menu lagi (pakai --all)`);

console.log(
  `\nDetail kandidat per menu: npm run guard:scan -- --menu {slug}` +
    `\nCatatan: angka GUARD adalah pesan unik di controller/entity milik menu tsb — bukan` +
    ` target TC 1:1. Sebagian tidak dapat dipicu dari UI; pilih yang relevan.`,
);
