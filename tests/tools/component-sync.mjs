#!/usr/bin/env node
/**
 * Component Sync — deteksi drift antara kontrak interaksi UI di `tests/ui-components.md`
 * dan source aplikasi yang sebenarnya di `olshoperp-frontend`.
 *
 * Masalah yang dipecahkan: katalog komponen ditulis dari observasi. Kalau frontend
 * meng-upgrade library atau mengubah file komponen, katalog + helper jadi stale
 * DIAM-DIAM — test baru ketahuan pecah saat run (mahal), bukan saat review.
 *
 * Cara kerja: tiap komponen di `tests/component-anchors.json` menyimpan versi library
 * dan fingerprint file source. Script membandingkannya dengan kondisi repo frontend
 * saat ini, lalu melaporkan apa yang perlu ditinjau ulang.
 *
 * REPO APP HANYA DIBACA. Script ini tidak pernah menulis ke luar `olshoperp-docs`
 * (lihat rule 15 § Kontrak read-only repo app).
 *
 * Pakai:
 *   npm run component:sync              # laporkan drift (exit 1 kalau ada)
 *   npm run component:sync -- --update  # setujui kondisi sekarang jadi baseline baru
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const anchorsPath = path.join(root, 'tests', 'component-anchors.json');
const anchors = JSON.parse(fs.readFileSync(anchorsPath, 'utf-8'));
const feRoot = path.resolve(root, anchors.frontend_repo);
const shouldUpdate = process.argv.includes('--update');

if (!fs.existsSync(feRoot)) {
  console.error(
    `❌ Repo frontend tidak ditemukan di ${feRoot}.\n` +
      `   Rule 15 § Repo & path: ketiga repo harus sibling. Jangan tebak lokasi — lapor ke user.`,
  );
  process.exit(1);
}

function fingerprint(absPath) {
  const content = fs.readFileSync(absPath, 'utf-8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
}

const fePkgPath = path.join(feRoot, 'package.json');
const fePkg = JSON.parse(fs.readFileSync(fePkgPath, 'utf-8'));
const feDeps = { ...(fePkg.dependencies ?? {}), ...(fePkg.devDependencies ?? {}) };

const drifts = [];
const ok = [];

for (const comp of anchors.components) {
  // 1. Versi library
  if (comp.library) {
    const actual = feDeps[comp.library];
    if (!actual) {
      drifts.push({
        comp,
        kind: 'library-hilang',
        msg: `library \`${comp.library}\` tidak ada lagi di package.json frontend — komponen kemungkinan diganti`,
      });
    } else if (actual !== comp.version) {
      drifts.push({
        comp,
        kind: 'library-versi',
        msg: `\`${comp.library}\` ${comp.version} → **${actual}** — tinjau apakah perilaku interaksinya berubah`,
        newVersion: actual,
      });
    }
  }

  // 2. Fingerprint file source
  for (const rel of comp.sources ?? []) {
    const abs = path.join(feRoot, rel);
    if (!fs.existsSync(abs)) {
      drifts.push({
        comp,
        kind: 'file-hilang',
        source: rel,
        msg: `source \`${rel}\` tidak ada lagi — komponen dipindah/dihapus`,
      });
      continue;
    }
    const now = fingerprint(abs);
    const before = comp.fingerprints?.[rel];
    if (!before) {
      drifts.push({
        comp,
        kind: 'baseline-baru',
        source: rel,
        msg: `belum ada baseline untuk \`${rel}\` — jalankan \`--update\` setelah meninjau`,
        newFingerprint: now,
      });
    } else if (before !== now) {
      drifts.push({
        comp,
        kind: 'file-berubah',
        source: rel,
        msg: `\`${rel}\` BERUBAH (${before} → ${now}) — tinjau apakah kontrak interaksi masih berlaku`,
        newFingerprint: now,
      });
    } else {
      ok.push(`${comp.id}: ${rel}`);
    }
  }
}

console.log(`Component Sync — ${anchors.components.length} komponen, frontend: ${anchors.frontend_repo}`);
if (ok.length) console.log(`  ✅ ${ok.length} source cocok dengan baseline`);

if (shouldUpdate) {
  for (const comp of anchors.components) {
    comp.fingerprints ??= {};
    for (const rel of comp.sources ?? []) {
      const abs = path.join(feRoot, rel);
      if (fs.existsSync(abs)) comp.fingerprints[rel] = fingerprint(abs);
    }
    if (comp.library && feDeps[comp.library]) comp.version = feDeps[comp.library];
  }
  fs.writeFileSync(anchorsPath, `${JSON.stringify(anchors, null, 2)}\n`, 'utf-8');
  console.log(`\n✅ Baseline diperbarui di tests/component-anchors.json (${drifts.length} perubahan disetujui).`);
  console.log(`   Pastikan tests/ui-components.md + helper sudah disesuaikan kalau perilakunya berubah.`);
  process.exit(0);
}

if (drifts.length === 0) {
  console.log(`\n✅ Tidak ada drift — katalog komponen sinkron dengan source frontend.`);
  process.exit(0);
}

console.log(`\n⚠️  ${drifts.length} drift terdeteksi:\n`);
for (const d of drifts) {
  console.log(`  [${d.kind}] ${d.comp.id} — ${d.msg}`);
  console.log(`      dok: ${d.comp.doc_section} · helper: ${d.comp.helper}`);
  if (d.comp.note) console.log(`      catatan: ${d.comp.note}`);
}
console.log(
  `\nLangkah: baca perubahan di repo frontend (READ-ONLY), sesuaikan helper +` +
    ` tests/ui-components.md kalau perilaku berubah, lalu setujui baseline baru:` +
    `\n  npm run component:sync -- --update`,
);
process.exit(1);
