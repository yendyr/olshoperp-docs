#!/usr/bin/env node
/**
 * TC Lint — jaga qa-docs bebas test case duplikat / rujukan putus.
 *
 * Cek (ERROR = exit 1):
 *  1. tc_code duplikat antar file mana pun (single-menu maupun flow)
 *  2. `recalls:` di TC flow menunjuk tc_code yang tidak ada
 *  3. (dipindah ke WARNING) `recalls:` menunjuk kode PENDING — TC-nya ada dan boleh
 *     dieksekusi; renumber yang wajib memperbarui rujukannya
 *  4. Judul (title) identik dalam menu yang sama
 *  5. File TC tanpa `tc_code` (skema non-rule-13, mis. hasil crawling MCP yang
 *     memakai `id:`/`menu_slug:`) — invisible bagi lint & tidak bisa di-recall flow
 * Cek (WARNING saja):
 *  6. `automated_spec` menunjuk file yang tidak ada
 *  7. File TC dengan tc_code PENDING-* (menunggu #renumber-tc)
 *  8. Penamaan file di luar pola rule 13 (TC-{PREFIX}-{NNN}.md / TC-{PREFIX}-DRAFT-{ts}.md)
 *
 * Pakai: node tests/tools/tc-lint.mjs   (atau: npm run tc:lint)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');

function* walkTcFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '_legacy'].includes(entry.name)) continue;
      yield* walkTcFiles(full);
    } else if (
      /(^TC-.*\.md|^testcase\.md)$/.test(entry.name) &&
      /(test-cases|flows)/.test(full)
    ) {
      yield full;
    }
  }
}

function parseFrontmatter(rawText) {
  const text = rawText.replace(/^﻿/, ''); // sebagian file punya BOM
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = match[1];
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim();
  const recalls = [];
  const recallsBlock = fm.match(/^recalls:\n((?:\s+-\s+.+\n?)+)/m)?.[1];
  if (recallsBlock) {
    for (const line of recallsBlock.split('\n')) {
      const code = line.match(/-\s+(\S+)/)?.[1];
      if (code) recalls.push(code);
    }
  }
  return {
    tc_code: get('tc_code'),
    title: get('title'),
    test_type: get('test_type'),
    menu: get('menu'),
    automated_spec: get('automated_spec'),
    duplicate_candidate: get('duplicate_candidate'),
    recalls,
  };
}

/** Kata signifikan judul untuk deteksi duplikat semantik (buang kata umum). */
const STOPWORDS = new Set([
  'dan','atau','dari','ke','di','pada','untuk','dengan','yang','via','the','a','an',
  'create','update','delete','verify','memastikan','membuat','lalu','then','status',
  'test','case','new','baru','—','-','+','&',
]);
function titleTokens(title) {
  return new Set(
    (title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}
function similarity(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / Math.min(a.size, b.size);
}

const errors = [];
const warnings = [];
const untyped = [];
const byCode = new Map();
const byMenuTitle = new Map();
const allDocs = [];

for (const file of walkTcFiles(qaDocs)) {
  const rel = path.relative(root, file);
  const raw = fs.readFileSync(file, 'utf-8');
  const fm = parseFrontmatter(raw);

  if (!fm.tc_code) {
    // Skema non-rule-13 (mis. hasil crawling MCP: `id:` + `menu_slug:` + author
    // "Playwright Web Crawler"). Tidak punya tc_code → tak bisa di-recall flow,
    // tak terdeteksi duplikat, dan status "passed"-nya tidak reproducible.
    const legacyId = raw.match(/^id:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
    errors.push(
      `Skema TC tidak sesuai rule 13 (tanpa \`tc_code\`): ${rel}` +
        (legacyId ? ` — memakai \`id: ${legacyId}\`` : '') +
        ` → konversi ke frontmatter rule 13 (tc_code/menu/steps/expected_result) + nama TC-{PREFIX}-DRAFT-{timestamp}.md`,
    );
    continue;
  }

  const base = path.basename(file);
  // Pola sah: TC-{PREFIX}[-{SEGMEN}...]-{NNN}.md atau TC-{PREFIX}-DRAFT-{timestamp}.md
  if (
    base !== 'testcase.md' &&
    !/^TC-[A-Z0-9]+(?:-[A-Z0-9]+)*-(?:\d{3}|DRAFT-\d{14})\.md$/.test(base)
  ) {
    warnings.push(`Nama file di luar pola rule 13 §2: ${rel}`);
  }

  allDocs.push({ rel, ...fm });

  if (byCode.has(fm.tc_code)) {
    errors.push(`tc_code DUPLIKAT: ${fm.tc_code} — ${byCode.get(fm.tc_code)} vs ${rel}`);
  } else {
    byCode.set(fm.tc_code, rel);
  }

  if (fm.menu && fm.title) {
    const key = `${fm.menu}::${fm.title.toLowerCase()}`;
    if (byMenuTitle.has(key)) {
      errors.push(`Judul DUPLIKAT di menu ${fm.menu}: "${fm.title}" — ${byMenuTitle.get(key)} vs ${rel}`);
    } else {
      byMenuTitle.set(key, rel);
    }
  }

  if (/^PENDING-/.test(fm.tc_code)) {
    warnings.push(`DRAFT menunggu #renumber-tc: ${rel} (${fm.tc_code})`);
  }

  // Klasifikasi jenis pengujian (rule 13 §3A). Wajib untuk TC baru; TC lama
  // di-backfill bertahap (lihat `npm run tc:coverage`).
  const VALID_TEST_TYPES = ['happy', 'negative', 'edge', 'permission', 'regression', 'cross-menu'];
  if (fm.test_type && !VALID_TEST_TYPES.includes(fm.test_type)) {
    errors.push(
      `test_type tidak sah "${fm.test_type}": ${rel} → pilih salah satu: ${VALID_TEST_TYPES.join(', ')}`,
    );
  } else if (!fm.test_type) {
    if (/^PENDING-/.test(fm.tc_code)) {
      errors.push(
        `TC baru tanpa \`test_type\`: ${rel} → wajib diisi (rule 13 §3A): ${VALID_TEST_TYPES.join(', ')}`,
      );
    } else {
      untyped.push(rel);
    }
  }

  // Gate anti-duplikat: TC yang ditandai kandidat duplikat TIDAK BOLEH lolos ke
  // #renumber-tc — begitu dapat nomor final, duplikat jadi "resmi" dan sulit dicabut.
  if (fm.duplicate_candidate) {
    errors.push(
      `TC ditandai kandidat duplikat dari ${fm.duplicate_candidate}: ${rel}` +
        ` → putuskan SEBELUM #renumber-tc: hapus file ini, ATAU hapus field` +
        ` \`duplicate_candidate\` kalau sudah dipastikan unik (jelaskan bedanya di summary)`,
    );
  }

  if (fm.automated_spec && fm.automated_spec !== 'null') {
    const specPath = path.join(root, fm.automated_spec);
    if (!fs.existsSync(specPath)) {
      warnings.push(`automated_spec tidak ditemukan: ${fm.automated_spec} (di ${rel})`);
    } else if (!/@(TC|FLOW)-/.test(fs.readFileSync(specPath, 'utf-8'))) {
      // `npm test` hanya menjalankan spec bertag — spec tanpa tag tidak akan
      // pernah jalan di suite walau TC-nya mengklaim automated.
      errors.push(
        `Spec dirujuk TC tapi TIDAK bertag @TC-*/@FLOW-*: ${fm.automated_spec} (dirujuk ${rel})` +
          ` → tambahkan tag di judul test, kalau tidak spec ini tidak ikut \`npm test\``,
      );
    }
  }
}

// Jaring pengaman pasca-renumber: konstanta di tests/scenarios/ yang menunjuk kode TC
// yang tidak ada lagi = rujukan putus (biasanya karena renumber lupa memperbaruinya,
// rule 13 §9 langkah 8). Dicek terpisah dari `recalls:` karena letaknya di kode.
const scenarioDir = path.join(root, 'tests', 'scenarios');
if (fs.existsSync(scenarioDir)) {
  for (const f of fs.readdirSync(scenarioDir)) {
    if (!f.endsWith('.ts')) continue;
    const rel = `tests/scenarios/${f}`;
    const text = fs.readFileSync(path.join(scenarioDir, f), 'utf-8');
    for (const m of text.matchAll(/'((?:TC|PENDING)-[A-Z0-9-]+)'/g)) {
      const code = m[1];
      // Nilai konstanta bisa gabungan ("TC-A + TC-B") — pecah dan cek satu per satu.
      for (const part of code.split(/\s*\+\s*/)) {
        if (!part || byCode.has(part)) continue;
        errors.push(
          `${rel} menunjuk TC yang tidak ada: ${part}` +
            ` → rujukan putus. Cek \`npm run tc:refs\` dan perbarui (rule 13 §9 langkah 8)`,
        );
      }
    }
  }
}

// Catatan: deteksi duplikat via kemiripan judul sengaja TIDAK dipakai — TC ERP
// memang berpola (mis. "X CREATE — …" vs "X IMPORT — …" adalah varian sah), sehingga
// noise-nya tinggi, sementara duplikat nyata sering berjudul beda bahasa (ID vs EN)
// dan lolos. Anti-duplikat ditegakkan lewat: (a) proses "cek TC existing sebelum buat
// baru" (rule 13), (b) gate `duplicate_candidate` di atas yang memblokir #renumber-tc.

for (const doc of allDocs) {
  for (const recalled of doc.recalls) {
    if (/^PENDING-/.test(recalled)) {
      // Bukan error: TC-nya ADA dan boleh dieksekusi. Yang perlu diingat hanya
      // bahwa #renumber-tc wajib memperbarui rujukan ini (rule 13 §9 langkah 8).
      warnings.push(
        `${doc.rel} me-recall TC yang belum bernomor (${recalled}) —` +
          ` pastikan #renumber-tc ikut memperbarui rujukan ini`,
      );
    } else if (!byCode.has(recalled)) {
      errors.push(`${doc.rel} me-recall TC yang tidak ada: ${recalled}`);
    }
  }
}

console.log(`TC Lint — ${allDocs.length} dokumen TC dipindai`);
if (untyped.length) {
  console.log(
    `  ℹ️  ${untyped.length} TC lama belum punya \`test_type\` (rule 13 §3A) —` +
      ` backfill bertahap, cek prioritas: npm run tc:coverage`,
  );
}
for (const w of warnings) console.log(`  ⚠️  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);
if (errors.length) {
  console.log(`\n${errors.length} error — perbaiki sebelum menambah/mengeksekusi TC terkait.`);
  process.exit(1);
}
console.log(`Bersih${warnings.length ? ` (${warnings.length} warning)` : ''} — tidak ada duplikat/rujukan putus.`);
