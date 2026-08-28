#!/usr/bin/env node
/**
 * Deteksi drift: TC di repo belum tercatat eksekusi tapi punya rujukan card Jira.
 *
 * Pakai:
 *   npm run tc:jira-drift
 *   npm run tc:jira-drift -- ETM-15635 ETM-15485
 *   npm run tc:jira-drift -- --menu accounting-cash-bank-reconcile
 *
 * Output = daftar card + file TC untuk di-fetch Jira lalu `tc:jira-sync --apply`.
 * Agent #sync-jira-done: fetch Jira MCP → build payload → tc:jira-sync --apply.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  indexTcByJiraRef,
  normalizeEtmKey,
  parseBlock,
  qaDocs,
  walkTcFiles,
  isEmptyAt,
} from './tc-jira-sync-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const keysArg = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const menuIdx = process.argv.indexOf('--menu');
const menuFilter = menuIdx === -1 ? null : process.argv[menuIdx + 1];

function tcRow(file) {
  const raw = fs.readFileSync(file, 'utf-8');
  const menu = raw.match(/^menu:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
  const tcCode = raw.match(/^tc_code:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
  const title = raw.match(/^title:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
  const origin = raw.match(/^origin_jira:\s*"?([^"\n]*)"?\s*$/m)?.[1]?.trim();
  const le = parseBlock(raw, 'last_execution');
  return { file: path.relative(root, file), menu, tcCode, title, origin, le };
}

/** @type {Map<string, { files: string[], rows: ReturnType<typeof tcRow>[] }>} */
const byKey = new Map();

for (const file of walkTcFiles(qaDocs)) {
  const row = tcRow(file);
  if (menuFilter && row.menu !== menuFilter) continue;

  const le = row.le;
  const executed = le && le.status && le.status !== 'not_run' && !isEmptyAt(le.at);
  if (executed) continue;

  const refs = new Set();
  if (row.origin && row.origin !== 'null') refs.add(normalizeEtmKey(row.origin));
  const folderMatch = row.file.match(/\/(ETM-\d+)\/test-cases\//);
  if (folderMatch) refs.add(folderMatch[1]);
  if (le?.jira && le.jira !== 'null') refs.add(normalizeEtmKey(le.jira));

  for (const key of refs) {
    if (!key) continue;
    if (keysArg.length && !keysArg.some((k) => normalizeEtmKey(k) === key)) continue;
    if (!byKey.has(key)) byKey.set(key, { files: [], rows: [] });
    const bucket = byKey.get(key);
    if (!bucket.files.includes(row.file)) {
      bucket.files.push(row.file);
      bucket.rows.push(row);
    }
  }
}

if (!byKey.size) {
  console.log('tc:jira-drift — tidak ada TC pending dengan rujukan card Jira' + (keysArg.length ? ` untuk ${keysArg.join(', ')}` : ''));
  process.exit(0);
}

console.log(`tc:jira-drift — ${byKey.size} card Jira perlu dicek / sync\n`);
for (const [key, { rows }] of [...byKey.entries()].sort()) {
  console.log(`${key} (${rows.length} TC)`);
  for (const r of rows.slice(0, 5)) {
    console.log(`  · ${r.tcCode} — ${r.title?.slice(0, 55) ?? ''}`);
    console.log(`    ${r.file}`);
  }
  if (rows.length > 5) console.log(`  … ${rows.length - 5} file lagi`);
  console.log(`  → fetch Jira Done + Test Result, lalu: npm run tc:jira-sync -- --apply payload.json\n`);
}
