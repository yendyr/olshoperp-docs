#!/usr/bin/env node
/**
 * TC Lint — jaga qa-docs bebas test case duplikat / rujukan putus.
 *
 * Cek (ERROR = exit 1):
 *  1. tc_code duplikat antar file mana pun (single-menu maupun flow)
 *  2. `recalls:` di TC flow menunjuk tc_code yang tidak ada
 *  3. `recalls:` di TC flow menunjuk kode PENDING-* (belum di-renumber → flow belum sah)
 *  4. Judul (title) identik dalam menu yang sama
 * Cek (WARNING saja):
 *  5. `automated_spec` menunjuk file yang tidak ada
 *  6. File TC dengan tc_code PENDING-* (menunggu #renumber-tc)
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

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
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
  const fm = parseFrontmatter(fs.readFileSync(file, 'utf-8'));
  if (!fm.tc_code) continue;
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
    if (!fs.existsSync(path.join(root, fm.automated_spec))) {
      warnings.push(`automated_spec tidak ditemukan: ${fm.automated_spec} (di ${rel})`);
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
