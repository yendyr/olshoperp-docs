#!/usr/bin/env node
/**
 * Terapkan snapshot Jira → last_execution / first_execution di TC-*.md.
 *
 * Input: JSON file atau stdin
 * {
 *   "cards": [ { "key": "ETM-15635", "status": "Done", "testResult": "Passed", ... } ]
 * }
 *
 * Pakai:
 *   npm run tc:jira-sync -- --apply payload.json
 *   cat payload.json | npm run tc:jira-sync -- --apply -
 *   npm run tc:jira-sync -- --apply payload.json --force
 *   npm run tc:jira-sync -- --apply payload.json --dry-run
 */
import fs from 'fs';
import {
  applyCardToTcFile,
  indexTcByJiraRef,
  normalizeEtmKey,
} from './tc-jira-sync-lib.mjs';

const args = process.argv.slice(2);
const applyIdx = args.indexOf('--apply');
if (applyIdx === -1) {
  console.error('Pakai: npm run tc:jira-sync -- --apply <file.json|-] [--force] [--dry-run]');
  process.exit(1);
}

const inputPath = args[applyIdx + 1];
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');

if (!inputPath) {
  console.error('Missing path setelah --apply');
  process.exit(1);
}

const rawInput =
  inputPath === '-'
    ? fs.readFileSync(0, 'utf-8')
    : fs.readFileSync(inputPath, 'utf-8');

/** @type {{ cards?: object[] }} */
let payload;
try {
  payload = JSON.parse(rawInput);
} catch {
  console.error('Input bukan JSON valid');
  process.exit(1);
}

const cards = payload.cards ?? (Array.isArray(payload) ? payload : [payload]);
if (!cards.length) {
  console.error('Tidak ada card di payload');
  process.exit(1);
}

const index = indexTcByJiraRef();
const results = [];

for (const card of cards) {
  const key = normalizeEtmKey(card.key);
  if (!key) {
    results.push({ key: card.key, action: 'error', reason: 'Kode Jira tidak valid' });
    continue;
  }

  const files = index.get(key) ?? [];
  if (!files.length) {
    results.push({ key, action: 'no_tc', reason: 'Tidak ada TC dengan origin_jira/card_ref/folder match' });
    continue;
  }

  for (const file of files) {
    results.push(applyCardToTcFile(file, { ...card, key }, { force, dryRun }));
  }
}

const updated = results.filter((r) => r.action === 'updated' || r.action === 'would_update');
const skipped = results.filter((r) => r.action === 'skipped');
const noTc = results.filter((r) => r.action === 'no_tc');

console.log(`\n#sync-jira-done apply ${dryRun ? '(dry-run) ' : ''}— ${cards.length} card(s)`);
for (const r of updated) {
  console.log(`  ✅ ${r.key} → ${r.file} (${r.status} @ ${r.at})`);
}
for (const r of skipped) {
  console.log(`  ⏭️  ${r.key} → ${r.file ?? '-'} — ${r.reason}`);
}
for (const r of noTc) {
  console.log(`  ⚠️  ${r.key} — ${r.reason}`);
}

if (!updated.length && !dryRun) {
  process.exit(skipped.length || noTc.length ? 2 : 0);
}
