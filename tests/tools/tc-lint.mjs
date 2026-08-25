#!/usr/bin/env node
/**
 * TC Lint — jaga qa-docs bebas test case duplikat / rujukan putus.
 *
 * Cek (ERROR = exit 1):
 *  1. tc_code duplikat antar file mana pun (single-menu maupun flow)
 *  2. `recalls:` di TC flow menunjuk tc_code yang tidak ada
 *  3. `recalls:` di TC flow menunjuk kode PENDING-* (belum di-renumber → flow belum sah)
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
    menu: get('menu'),
    automated_spec: get('automated_spec'),
    recalls,
  };
}

const errors = [];
const warnings = [];
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

for (const doc of allDocs) {
  for (const recalled of doc.recalls) {
    if (/^PENDING-/.test(recalled)) {
      errors.push(`${doc.rel} me-recall kode PENDING (${recalled}) — jalankan #renumber-tc dulu`);
    } else if (!byCode.has(recalled)) {
      errors.push(`${doc.rel} me-recall TC yang tidak ada: ${recalled}`);
    }
  }
}

console.log(`TC Lint — ${allDocs.length} dokumen TC dipindai`);
for (const w of warnings) console.log(`  ⚠️  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);
if (errors.length) {
  console.log(`\n${errors.length} error — perbaiki sebelum menambah/mengeksekusi TC terkait.`);
  process.exit(1);
}
console.log(`Bersih${warnings.length ? ` (${warnings.length} warning)` : ''} — tidak ada duplikat/rujukan putus.`);
