#!/usr/bin/env node
/**
 * TC Refs — petakan SEMUA tempat yang merujuk sebuah kode TC.
 *
 * Dipakai saat `#renumber-tc` (rule 13 §9 langkah 8): sebelum mengganti nomor,
 * agent perlu tahu file mana saja yang menyebut kode lama, supaya rujukannya ikut
 * diperbarui dan tidak putus. Tanpa ini, langkah "update rujukan" mudah terlewat —
 * dan rujukan putus baru ketahuan saat flow gagal preflight.
 *
 * Pakai:
 *   npm run tc:refs                    # peta semua TC PENDING + rujukannya (mode renumber)
 *   npm run tc:refs -- PENDING-2026…   # rujukan satu kode tertentu
 *   npm run tc:refs -- TC-PI-CREATE-001
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const target = process.argv[2];

// Tempat rujukan bisa muncul. Definisi TC-nya sendiri (file TC di test-cases)
// ditandai terpisah supaya tidak tertukar dengan rujukan.
const SEARCH_DIRS = ['qa-docs', 'tests', '.cursor/rules'];
const SKIP_DIRS = new Set(['node_modules', '_legacy', 'test-results', 'playwright-report', '.git']);
const EXT = /\.(md|mdc|ts|json|yaml|yml)$/;

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.test(entry.name)) yield full;
  }
}

const files = [];
for (const d of SEARCH_DIRS) for (const f of walk(path.join(root, d))) files.push(f);

/** Semua tc_code yang ada, plus lokasi definisinya. */
const defined = new Map();
for (const file of files) {
  if (!/qa-docs\/.*\/(test-cases|flows)\/.*\.md$/.test(file.replace(/\\/g, '/'))) continue;
  const code = fs
    .readFileSync(file, 'utf-8')
    .replace(/^﻿/, '')
    .match(/^tc_code:\s*"?([^"\n]+)"?\s*$/m)?.[1]
    ?.trim();
  if (code) defined.set(code, path.relative(root, file));
}

function findRefs(code) {
  const pattern = new RegExp(code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const hits = [];
  for (const file of files) {
    const rel = path.relative(root, file);
    if (rel === defined.get(code)) continue; // lewati file definisinya sendiri
    const lines = fs.readFileSync(file, 'utf-8').split('\n');
    lines.forEach((line, i) => {
      if (pattern.test(line)) hits.push({ rel, line: i + 1, text: line.trim().slice(0, 110) });
      pattern.lastIndex = 0;
    });
  }
  return hits;
}

function kindOf(rel) {
  if (rel.startsWith('qa-docs/flows/')) return 'FLOW recalls';
  if (rel.startsWith('tests/scenarios/')) return 'SCENARIO const';
  if (rel.startsWith('tests/specs/')) return 'SPEC tag/komentar';
  if (rel.startsWith('.cursor/rules/')) return 'RULE (contoh)';
  if (rel.startsWith('qa-docs/')) return 'TC lain (catatan)';
  return 'lainnya';
}

function report(code) {
  const def = defined.get(code);
  const refs = findRefs(code);
  console.log(`\n■ ${code}`);
  console.log(`   definisi : ${def ?? '(tidak ditemukan — kode tidak terdaftar)'}`);
  if (refs.length === 0) {
    console.log(`   rujukan  : (tidak ada) — aman di-renumber tanpa update lain`);
    return refs.length;
  }
  console.log(`   rujukan  : ${refs.length} tempat — WAJIB ikut diperbarui saat renumber`);
  for (const r of refs) {
    console.log(`     [${kindOf(r.rel)}] ${r.rel}:${r.line}`);
    console.log(`        ${r.text}`);
  }
  return refs.length;
}

if (target) {
  report(target);
  process.exit(0);
}

// Mode renumber: semua TC yang belum bernomor final
const pendings = [...defined.keys()].filter((c) => /^PENDING-/.test(c)).sort();

console.log('TC Refs — peta rujukan untuk #renumber-tc');
console.log(`Dipindai: ${files.length} file di ${SEARCH_DIRS.join(', ')}`);

if (pendings.length === 0) {
  console.log('\n✅ Tidak ada TC PENDING — tidak ada yang perlu di-renumber.');
  process.exit(0);
}

console.log(`\n${pendings.length} TC menunggu penomoran final:`);
let total = 0;
for (const code of pendings) total += report(code);

console.log(
  `\n──\nTotal ${total} rujukan harus ikut diperbarui saat #renumber-tc (rule 13 §9 langkah 8).` +
    `\nSetelah renumber: jalankan \`npm run tc:lint\` — harus 0 error, memastikan tidak ada` +
    ` rujukan yang putus.`,
);
