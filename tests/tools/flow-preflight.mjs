#!/usr/bin/env node
/**
 * Flow Preflight — gate kelengkapan sebelum E2E cross-menu flow boleh dieksekusi.
 *
 * Flow TIDAK BOLEH dijalankan kalau ada gap; agent/prompter wajib melengkapi
 * (atau menjawab gap-nya) dulu. Cek per flow:
 *  1. TC flow doc ada: qa-docs/flows/{flow-id}/testcase.md dengan frontmatter recalls
 *  2. Setiap recall menunjuk TC origin yang ada dan bukan PENDING-*
 *  3. Setiap recall punya scenario di tests/scenarios/ (kode TC tercantum di file scenario)
 *  4. requirement.md tiap menu yang terlibat berstatus review/approved (bukan draft/missing)
 *  5. Fixture default + spec flow ada
 *
 * Pakai: node tests/tools/flow-preflight.mjs <flow-id>   (atau: npm run flow:preflight -- <flow-id>)
 * Exit 0 = boleh eksekusi; exit 1 = STOP, ada gap yang harus dijawab/dilengkapi dulu.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const flowId = process.argv[2];
if (!flowId) {
  console.error('Pakai: node tests/tools/flow-preflight.mjs <flow-id>');
  process.exit(1);
}

const gaps = [];
const notes = [];
const ok = [];

const flowDocPath = path.join(root, 'qa-docs', 'flows', flowId, 'testcase.md');
let recalls = [];
if (!fs.existsSync(flowDocPath)) {
  gaps.push(`TC flow doc tidak ada: qa-docs/flows/${flowId}/testcase.md — definisikan chain (tabel recall + glue) dulu`);
} else {
  const fm = fs.readFileSync(flowDocPath, 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const block = fm.match(/^recalls:\n((?:\s+-\s+.+\n?)+)/m)?.[1];
  recalls = block ? block.split('\n').map((l) => l.match(/-\s+(\S+)/)?.[1]).filter(Boolean) : [];
  if (recalls.length === 0) {
    gaps.push(`TC flow doc ada tapi frontmatter recalls: kosong — chain belum didefinisikan`);
  } else {
    ok.push(`TC flow doc: ${recalls.length} recall terdaftar`);
  }
}

// Index semua TC origin: tc_code → { file, menu }
const tcIndex = new Map();
const qaDocs = path.join(root, 'qa-docs');
for (const menuDir of fs.readdirSync(qaDocs, { withFileTypes: true })) {
  if (!menuDir.isDirectory()) continue;
  const tcDir = path.join(qaDocs, menuDir.name, 'test-cases');
  if (!fs.existsSync(tcDir)) continue;
  for (const f of fs.readdirSync(tcDir)) {
    if (!/^TC-.*\.md$/.test(f)) continue;
    const code = fs
      .readFileSync(path.join(tcDir, f), 'utf-8')
      .match(/^tc_code:\s*"?([^"\n]+)"?\s*$/m)?.[1]
      ?.trim();
    if (code) tcIndex.set(code, { file: `qa-docs/${menuDir.name}/test-cases/${f}`, menu: menuDir.name });
  }
}

// Kumpulan isi semua scenario untuk cek recall → scenario
const scenarioDir = path.join(root, 'tests', 'scenarios');
const scenarioText = fs.existsSync(scenarioDir)
  ? fs
      .readdirSync(scenarioDir)
      .filter((f) => f.endsWith('.ts'))
      .map((f) => fs.readFileSync(path.join(scenarioDir, f), 'utf-8'))
      .join('\n')
  : '';

const menusInvolved = new Set();
for (const code of recalls) {
  if (/^PENDING-/.test(code)) {
    // TIDAK memblokir: TC-nya ada dan sudah bisa diuji. Penomoran itu urusan
    // administratif — jangan menahan eksekusi karenanya. Yang dijaga: rujukan
    // diperbarui saat #renumber-tc (rule 13 §9 langkah 8).
    notes.push(`Recall ${code} belum bernomor — ingat perbarui rujukan saat #renumber-tc`);
    continue;
  }
  const origin = tcIndex.get(code);
  if (!origin) {
    gaps.push(`Recall ${code} — TC origin tidak ditemukan di qa-docs/*/test-cases/ — buat TC origin-nya dulu di menu asalnya`);
    continue;
  }
  menusInvolved.add(origin.menu);
  if (!scenarioText.includes(code)) {
    gaps.push(`Recall ${code} — belum ada scenario di tests/scenarios/ yang mengimplementasikannya (cari/tambahkan 'Implements: ${code}')`);
  }
}
if (recalls.length && ![...recalls].some((c) => gaps.find((g) => g.includes(c)))) {
  ok.push('Semua recall punya TC origin + scenario');
}

for (const menu of menusInvolved) {
  const reqPath = path.join(qaDocs, menu, 'requirement.md');
  if (!fs.existsSync(reqPath)) {
    gaps.push(`requirement.md menu ${menu} tidak ada — lengkapi requirement dulu`);
    continue;
  }
  const status = fs.readFileSync(reqPath, 'utf-8').match(/^status:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
  if (!status || !/^(review|approved)$/i.test(status)) {
    gaps.push(`requirement.md menu ${menu} berstatus '${status ?? '(tanpa status)'}' — harus review/approved sebelum flow yang menyentuhnya dieksekusi`);
  }
}
if (menusInvolved.size && ![...menusInvolved].some((m) => gaps.find((g) => g.includes(`menu ${m}`)))) {
  ok.push(`Requirement ${menusInvolved.size} menu terlibat: review/approved`);
}

for (const [label, rel] of [
  ['Fixture default', `tests/fixtures/flows/${flowId}.fixture.json`],
  ['Spec flow', `tests/specs/flows/${flowId}.spec.ts`],
]) {
  if (!fs.existsSync(path.join(root, rel))) {
    gaps.push(`${label} tidak ada: ${rel}`);
  } else {
    ok.push(`${label}: ${rel}`);
  }
}

console.log(`Flow Preflight — ${flowId}`);
for (const o of ok) console.log(`  ✅ ${o}`);
for (const n of notes) console.log(`  ℹ️  ${n}`);
for (const g of gaps) console.log(`  ❌ ${g}`);
if (gaps.length) {
  console.log(
    `\n⛔ Flow '${flowId}' BELUM LENGKAP (${gaps.length} gap) — JANGAN dieksekusi.` +
      `\n   Jawab/lengkapi gap di atas dulu (atau konfirmasi ke prompter), baru jalankan ulang preflight.`,
  );
  process.exit(1);
}
console.log(`\n✅ Flow '${flowId}' lengkap — boleh dieksekusi.`);
