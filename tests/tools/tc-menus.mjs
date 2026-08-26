#!/usr/bin/env node
/**
 * TC Menus — daftar slug menu yang SAH, plus tebakan terdekat kalau salah tulis.
 *
 * Kenapa perlu: slug menu ditebak dari nama menu itu sumber error yang sering.
 * Contoh nyata: `supplychain-system-product` (tidak ada) vs `system-product` (benar).
 * Kalau TC ditulis ke file, `tc:lint` menangkapnya. Tapi rancangan yang cuma
 * disajikan di chat — mis. saat requirement masih `draft` — TIDAK pernah lewat gate
 * mana pun. Tool ini menutup celah itu: cek slug sebelum menyebutnya.
 *
 * Pakai:
 *   node tests/tools/tc-menus.mjs                    # semua slug sah
 *   node tests/tools/tc-menus.mjs product            # cari yang mengandung "product"
 *   node tests/tools/tc-menus.mjs --check {slug}...  # validasi slug tertentu
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');
const slugs = fs
  .readdirSync(qaDocs, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'flows')
  .map((d) => d.name)
  .sort();

/** Kedekatan kasar: berapa banyak potongan kata yang sama. */
function near(bad) {
  const parts = new Set(bad.split('-'));
  // Skor = seberapa besar porsi slug kandidat yang cocok, bukan sekadar jumlah kata.
  // Tanpa ini `supplychain-product-ending-stock` menyalip `system-product` hanya
  // karena sama-sama kena 2 kata, padahal yang kedua cocok seluruhnya.
  return slugs
    .map((s) => {
      const p = s.split('-');
      const hit = p.filter((x) => parts.has(x)).length;
      return { s, score: hit === 0 ? 0 : hit / p.length + hit / parts.size };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.s);
}

const args = process.argv.slice(2);
if (args[0] === '--check') {
  const bad = [];
  for (const slug of args.slice(1)) {
    if (slugs.includes(slug)) console.log(`  ✅ ${slug}`);
    else {
      bad.push(slug);
      console.log(`  ❌ ${slug} — tidak ada. Maksudnya: ${near(slug).join(' / ') || '(tidak ada yang mirip)'}`);
    }
  }
  process.exit(bad.length ? 1 : 0);
}

const filter = args[0];
const shown = filter ? slugs.filter((s) => s.includes(filter)) : slugs;
console.log(`${shown.length} slug menu${filter ? ` mengandung "${filter}"` : ' sah'}:`);
for (const s of shown) console.log(`  ${s}`);
if (!filter) console.log(`\nValidasi cepat: npm run tc:menus -- --check {slug} {slug}`);
