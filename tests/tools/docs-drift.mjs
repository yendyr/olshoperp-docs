#!/usr/bin/env node
/**
 * Docs Drift — menjaga salinan dokumen sistem di `olshoperp-docs` tetap sama dengan
 * sumbernya di repo developer (`olshoperp/docs/qa-docs/`).
 *
 * Pembagian kepemilikan (rule 15):
 *   dokumen sistem (requirement/technical/knowledge-base/user-guide/feature-map/
 *   capabilities/README menu/_meta/sot)  -> milik repo DEVELOPER, di sini cuma salinan
 *   artefak pengujian (test-cases/, flows/, card.md, results/)  -> milik repo INI
 *
 * Kenapa perlu: `expected_result` sebuah TC hanya sah kalau requirement yang dirujuknya
 * mutakhir. Drift diam-diam pernah membuat 15 TC Purchase Inbound divalidasi terhadap
 * requirement v2.3 sementara developer sudah v2.4.
 *
 * Pakai:
 *   node tests/tools/docs-drift.mjs            # periksa saja (exit 1 kalau drift)
 *   node tests/tools/docs-drift.mjs --fix      # tarik versi developer ke sini
 *   OLSHOP_DEV_REPO=/path/ke/olshoperp node tests/tools/docs-drift.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// `DOCS_DRIFT_ROOT` dipakai `tc:selftest` untuk menguji tool ini di repo tiruan.
const root = process.env.DOCS_DRIFT_ROOT
  ? path.resolve(process.env.DOCS_DRIFT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const devRepo = process.env.OLSHOP_DEV_REPO ?? path.resolve(root, '..', 'olshoperp');
const here = path.join(root, 'qa-docs');
const there = path.join(devRepo, 'docs', 'qa-docs');
const FIX = process.argv.includes('--fix');

if (!fs.existsSync(there)) {
  console.log(`Repo developer tidak ditemukan di ${there}`);
  console.log(`Set OLSHOP_DEV_REPO kalau letaknya lain. Dilewati.`);
  process.exit(0);
}

/** Artefak milik repo ini — bukan urusan drift. */
const OWNED_HERE = (rel) =>
  rel.includes('/test-cases/') ||
  rel.startsWith('flows/') ||
  /(^|\/)card\.md$/.test(rel) ||
  rel.includes('/results/');

function* walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '_legacy'].includes(e.name)) continue;
      yield* walk(full, base);
    } else if (e.name.endsWith('.md')) {
      yield path.relative(base, full);
    }
  }
}

const drifted = [];
const missing = [];
for (const rel of walk(there)) {
  if (OWNED_HERE(rel)) continue;
  const mine = path.join(here, rel);
  const theirs = path.join(there, rel);
  if (!fs.existsSync(mine)) {
    missing.push(rel);
    continue;
  }
  if (!fs.readFileSync(mine).equals(fs.readFileSync(theirs))) drifted.push(rel);
}

if (FIX) {
  for (const rel of [...drifted, ...missing]) {
    const dest = path.join(here, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(there, rel), dest);
  }
  console.log(`Docs Drift — ${drifted.length + missing.length} file ditarik dari repo developer.`);
  process.exit(0);
}

console.log(`Docs Drift — membandingkan dokumen sistem dengan ${path.relative(root, there)}`);
for (const rel of missing) console.log(`  ❌ belum ada di sini: ${rel}`);
for (const rel of drifted) console.log(`  ❌ beda dari sumbernya: ${rel}`);

if (drifted.length || missing.length) {
  console.log(
    `\n${drifted.length + missing.length} dokumen tidak sinkron dengan repo developer.` +
      `\nTarik dulu: npm run docs:sync` +
      `\nJANGAN mengedit dokumen ini di sini — sumbernya ada di repo developer (rule 15).`,
  );
  process.exit(1);
}
console.log(`Sinkron — salinan dokumen sistem sama dengan repo developer.`);
