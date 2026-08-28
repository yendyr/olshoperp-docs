#!/usr/bin/env node
/**
 * Backfill blok first_execution di TC-*.md:
 * 1. Tambah blok kosong jika belum ada
 * 2. Jika last_execution sudah pernah run tapi first_execution.at masih kosong,
 *    salin at/via/jira dari last_execution (aproksimasi historis sekali jalan)
 *
 * Pakai: npm run tc:backfill-first-execution
 *        npm run tc:backfill-first-execution -- --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');
const dryRun = process.argv.includes('--dry-run');

function walkTcFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '_legacy'].includes(entry.name)) walkTcFiles(full, out);
    } else if (/^TC-.*\.md$/.test(entry.name) && /[\\/]test-cases[\\/]/.test(full)) {
      out.push(full);
    }
  }
  return out;
}

function parseBlock(raw, key) {
  const m = raw.match(new RegExp(`^${key}:\\n((?:[ \\t]+.*\\n?)*)`, 'm'));
  if (!m) return null;
  const get = (k) => m[1].match(new RegExp(`^\\s+${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim() ?? null;
  return { raw: m[0], at: get('at'), via: get('via'), jira: get('jira'), status: get('status') };
}

function emptyFirstBlock() {
  return `first_execution:\n  at: null\n  via: null\n  jira: null\n`;
}

function filledFirstBlock({ at, via, jira }) {
  return (
    `first_execution:\n` +
    `  at: ${at?.startsWith('"') ? at : at ? `"${at}"` : 'null'}\n` +
    `  via: ${via && via !== 'null' ? `"${via.replace(/^"|"$/g, '')}"` : 'null'}\n` +
    `  jira: ${jira && jira !== 'null' ? `"${jira.replace(/^"|"$/g, '')}"` : 'null'}\n`
  );
}

function isEmptyAt(at) {
  return !at || at === 'null' || at === '~';
}

function isExecuted(le) {
  if (!le) return false;
  if (le.status && le.status !== 'not_run') return true;
  return !isEmptyAt(le.at);
}

let added = 0;
let backfilled = 0;
let skipped = 0;

for (const file of walkTcFiles(qaDocs)) {
  let raw = fs.readFileSync(file, 'utf-8');
  const le = parseBlock(raw, 'last_execution');
  let fe = parseBlock(raw, 'first_execution');
  let next = raw;
  let changed = false;

  if (!fe) {
    const block = emptyFirstBlock();
    if (/^last_execution:\n/m.test(raw)) {
      next = raw.replace(/^last_execution:\n/m, `${block}last_execution:\n`);
    } else {
      next = raw.replace(/\n---\n/, `\n${block}---\n`);
    }
    fe = parseBlock(next, 'first_execution');
    changed = true;
    added++;
  }

  if (fe && isEmptyAt(fe.at) && isExecuted(le)) {
    const block = filledFirstBlock({
      at: le.at,
      via: le.via,
      jira: le.jira,
    });
    next = next.replace(/^first_execution:\n(?:[ \t]+\S.*\n)*/m, block);
    changed = true;
    backfilled++;
  } else if (!changed) {
    skipped++;
  }

  if (changed && next !== raw) {
    if (!dryRun) fs.writeFileSync(file, next, 'utf-8');
  }
}

console.log(
  `${dryRun ? '[dry-run] ' : ''}first_execution: +${added} blok baru, ${backfilled} backfill dari last_execution, ${skipped} sudah OK`,
);
