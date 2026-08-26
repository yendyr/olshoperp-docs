#!/usr/bin/env node
/**
 * TC Pending — daftar TC yang hasilnya BELUM diketahui, dipisah menurut apakah
 * jawabannya bisa dicari sendiri atau harus ditanyakan ke orang.
 *
 * Latar: sebagian besar TC dijalankan manual oleh tim. Hasilnya sering ada di card
 * Jira (Done with passed / failed / blocked), bukan di file TC. Selama TC menyimpan
 * rujukan card (`last_execution.jira` / `origin_jira` / `card_ref`), hasilnya bisa
 * ditelusuri. Yang tidak punya rujukan sama sekali = harus ditanyakan ke prompter.
 *
 * Pakai:
 *   node tests/tools/tc-pending.mjs             # ringkasan
 *   node tests/tools/tc-pending.mjs --ask       # hanya yang perlu ditanyakan
 *   node tests/tools/tc-pending.mjs --menu {slug}
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');
const ONLY_ASK = process.argv.includes('--ask');
const menuIdx = process.argv.indexOf('--menu');
const menuArg = menuIdx === -1 ? null : process.argv[menuIdx + 1];

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '_legacy'].includes(e.name)) continue;
      yield* walk(f);
    } else if (/^TC-.*\.md$|^testcase\.md$/.test(e.name) && /(test-cases|flows)/.test(f)) yield f;
  }
}

const traceable = [];   // punya rujukan card -> cek Jira
const mustAsk = [];     // tidak ada rujukan -> tanya prompter

for (const file of walk(qaDocs)) {
  const raw = fs.readFileSync(file, 'utf-8');
  const fm = raw.match(/^﻿?---\n([\s\S]*?)\n---/)?.[1];
  if (!fm) continue;
  const g = (k) => fm.match(new RegExp(`^${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim();
  const menu = g('menu');
  if (menuArg && menu !== menuArg) continue;

  const le = fm.match(/^last_execution:\n((?:[ \t]+.*\n?)+)/m)?.[1] ?? '';
  const status = le.match(/^\s+status:\s*(\S+)/m)?.[1];
  if (status && !['not_run', 'unknown'].includes(status)) continue; // sudah ada hasil

  const refs = [
    le.match(/^\s+jira:\s*"?([A-Z]+-\d+)"?/m)?.[1],
    g('origin_jira'),
    g('card_ref'),
  ].filter((x) => x && x !== 'null');

  const row = { tc: g('tc_code'), menu, title: (g('title') ?? '').slice(0, 62), refs: [...new Set(refs)] };
  (row.refs.length ? traceable : mustAsk).push(row);
}

const print = (rows, head) => {
  if (!rows.length) return;
  console.log(`\n${head}`);
  const byMenu = new Map();
  for (const r of rows) byMenu.set(r.menu, [...(byMenu.get(r.menu) ?? []), r]);
  for (const [menu, list] of [...byMenu].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${menu} (${list.length})`);
    for (const r of list.slice(0, 6)) {
      console.log(`     ${r.tc}${r.refs.length ? `  → ${r.refs.join(', ')}` : ''}  ${r.title}`);
    }
    if (list.length > 6) console.log(`     … ${list.length - 6} lagi`);
  }
};

console.log(`TC Pending — ${traceable.length + mustAsk.length} TC belum punya hasil`);
if (!ONLY_ASK) {
  print(
    traceable,
    `📌 ${traceable.length} PUNYA rujukan card — hasilnya cek status card Jira-nya\n` +
      `   (Done with passed / failed / blocked), lalu catat ke last_execution + notes`,
  );
}
print(
  mustAsk,
  `❓ ${mustAsk.length} TANPA rujukan card — tidak ada jejak siapa pun\n` +
    `   Tanyakan hasilnya ke prompter/penguji. Jangan menebak, jangan biarkan menggantung.`,
);
console.log(
  `\nSesudah dapat jawabannya, catat di TC-nya:\n` +
    `  last_execution: { status, via: "manual:{Nama}", notes: "actual result", jira: {card} }\n` +
    `Lalu: npm run tc:lint && npm run docs:sync`,
);
