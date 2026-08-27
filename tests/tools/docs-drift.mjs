#!/usr/bin/env node
/**
 * Sync Check — menjaga `olshoperp-docs` dan `olshoperp/docs/qa-docs` konsisten,
 * masing-masing pada arah yang benar (rule 15).
 *
 *   dokumen sistem  (requirement/technical/knowledge-base/user-guide/feature-map/
 *                    capabilities/README menu/_meta)
 *        sumber = REPO DEVELOPER   ->  ditarik ke sini
 *
 *   artefak pengujian (test-cases/, flows/, card.md, results/)
 *        sumber = REPO INI         ->  didorong ke developer
 *
 * Kenapa dua-duanya wajib:
 *  - Requirement usang di sini bikin `expected_result` divalidasi ke perilaku lama.
 *  - TC yang tidak termirror tidak muncul di Help Center Documentation, yang menampilkan
 *    test case berdampingan dengan requirement-nya. TC yang tak termirror = tak terlihat.
 *
 * Pakai:
 *   node tests/tools/docs-drift.mjs           # periksa (exit 1 kalau tidak sinkron)
 *   node tests/tools/docs-drift.mjs --fix     # jalankan sync dua arah
 *   OLSHOP_DEV_REPO=/path/ke/olshoperp ...
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = process.env.DOCS_DRIFT_ROOT
  ? path.resolve(process.env.DOCS_DRIFT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const devRepo = process.env.OLSHOP_DEV_REPO ?? path.resolve(root, '..', 'olshoperp');
const here = path.join(root, 'qa-docs');
const there = path.join(devRepo, 'docs', 'qa-docs');
const FIX = process.argv.includes('--fix');

if (!fs.existsSync(there)) {
  console.log(`Repo developer tidak ditemukan di ${there} — set OLSHOP_DEV_REPO. Dilewati.`);
  process.exit(0);
}

/**
 * Dokumen sistem = DAFTAR TERTUTUP. Sisanya milik repo ini.
 *
 * Sengaja dibalik: kalau dokumen sistem yang jadi daftar terbuka, file jenis baru
 * (README folder card, matriks analisis, dsb) diam-diam jatuh ke klasifikasi "milik
 * developer" lalu tidak pernah didorong DAN tidak pernah dilaporkan. Dengan daftar
 * tertutup, file tak dikenal default-nya milik QA — ikut termirror, tidak hilang.
 */
const SYSTEM_DOC = new Set([
  'requirement.md',
  'technical.md',
  'knowledge-base.md',
  'user-guide.md',
  'feature-map.md',
  'README.md', // hanya di level menu — dicek di bawah
]);
const isSystemDoc = (rel) => {
  const parts = rel.split('/');
  if (parts[0] === '_meta') return true;
  if (parts.includes('capabilities')) return true;
  // Dokumen sistem hidup langsung di bawah folder menu: `{menu}/{nama}.md`
  return parts.length === 2 && SYSTEM_DOC.has(parts[1]);
};
const isTestArtifact = (rel) => !isSystemDoc(rel);

function* walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '_legacy'].includes(e.name)) continue;
      yield* walk(full, base);
    } else if (e.name.endsWith('.md')) yield path.relative(base, full);
  }
}

const same = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b));
const pull = []; // developer -> sini
const push = []; // sini -> developer

for (const rel of walk(there)) {
  if (isTestArtifact(rel)) continue;
  if (!same(path.join(here, rel), path.join(there, rel))) pull.push(rel);
}
const orphan = []; // dokumen sistem yang hanya ada di sini — tidak punya sumber
for (const rel of walk(here)) {
  if (isTestArtifact(rel)) {
    if (!same(path.join(here, rel), path.join(there, rel))) push.push(rel);
  } else if (!fs.existsSync(path.join(there, rel))) {
    orphan.push(rel);
  }
}

if (FIX) {
  const copy = (from, to, rel) => {
    const dest = path.join(to, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(from, rel), dest);
  };
  for (const rel of pull) copy(there, here, rel);
  for (const rel of push) copy(here, there, rel);
  console.log(`Sync — ${pull.length} dokumen ditarik dari developer, ${push.length} artefak uji didorong ke developer.`);
  if (push.length) {
    console.log(`Verifikasi sekarang: git -C ${path.relative(root, devRepo)} status --short docs/qa-docs/`);
  }
  process.exit(0);
}

console.log(`Sync Check — ${path.relative(root, there)}`);
for (const rel of pull) console.log(`  ❌ dokumen sistem tidak sinkron (sumber: developer): ${rel}`);
for (const rel of push) console.log(`  ❌ artefak uji belum termirror ke developer: ${rel}`);
for (const rel of orphan)
  console.log(
    `  ⚠️  dokumen sistem hanya ada di sini, tidak ada di developer: ${rel}` +
      ` — sumbernya di repo developer, jadi ini yatim: pindahkan ke sana atau hapus`,
  );

if (pull.length || push.length) {
  console.log(
    `\n${pull.length} dokumen perlu ditarik, ${push.length} artefak uji perlu didorong.` +
      `\nJalankan: npm run docs:sync` +
      `\nIngat arahnya: dokumen sistem TIDAK BOLEH diedit di sini; TC WAJIB termirror ke` +
      ` developer supaya muncul di Help Center Documentation bersama requirement-nya.`,
  );
  process.exit(1);
}
console.log(`Sinkron dua arah — dokumen sistem sama dengan developer, artefak uji sudah termirror.`);
