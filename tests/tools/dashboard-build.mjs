#!/usr/bin/env node
/**
 * Test Dashboard — baca status eksekusi TC yang SUDAH ADA (last_execution / test_result
 * di frontmatter TC-*.md), bukan menjalankan test baru. Menghasilkan dashboard-data.json
 * yang dipakai halaman statis dashboard/index.html.
 *
 * Pakai: npm run dashboard:build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');
const manifestPath = path.join(qaDocs, '_meta', 'manifest.yaml');
const outPath = path.join(root, 'dashboard', 'dashboard-data.json');

function loadManifestModules() {
  const text = fs.readFileSync(manifestPath, 'utf-8');
  const lines = text.split(/\r?\n/);
  const menuToModule = {};
  let currentMenu = null;
  for (const line of lines) {
    const menuMatch = line.match(/^  ([a-z0-9-]+):\s*$/);
    if (menuMatch) {
      currentMenu = menuMatch[1];
      continue;
    }
    const moduleMatch = line.match(/^    module:\s*(\S+)\s*$/);
    if (moduleMatch && currentMenu) {
      menuToModule[currentMenu] = moduleMatch[1];
      currentMenu = null;
    }
  }
  return menuToModule;
}

// Parser frontmatter sederhana: cukup untuk skema TC-*.md (flat keys + 1 level nesting
// test_result/last_execution, termasuk block scalar `key: |` seperti log_summary).
// Tidak menangani array-of-object atau nesting > 1 level karena skema TC tidak butuh
// itu untuk field yang dibaca di sini.
function cleanScalar(value) {
  const v = value.trim();
  if (v === '' || v === 'null' || v === '~') return null;
  return v.replace(/^"(.*)"$/, '$1');
}

function parseFrontmatter(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!fm) return {};

  const result = {};
  let currentBlock = null;
  let blockScalar = null; // { target, key, indent, lines }

  const flushBlockScalar = () => {
    if (blockScalar) {
      blockScalar.target[blockScalar.key] = blockScalar.lines.join('\n').trim() || null;
      blockScalar = null;
    }
  };

  for (const raw of fm.split(/\r?\n/)) {
    if (blockScalar) {
      if (raw.trim() === '') {
        blockScalar.lines.push('');
        continue;
      }
      const indent = raw.match(/^(\s*)/)[1].length;
      if (indent > blockScalar.indent) {
        blockScalar.lines.push(raw.slice(blockScalar.indent + 2));
        continue;
      }
      flushBlockScalar();
    }

    const topMatch = raw.match(/^([a-zA-Z_]+):\s?(.*)$/);
    if (topMatch) {
      const [, key, value] = topMatch;
      const trimmedValue = value.trim();
      if (value === '') {
        currentBlock = {};
        result[key] = currentBlock;
      } else if (/^[|>][-+]?$/.test(trimmedValue)) {
        currentBlock = null;
        blockScalar = { target: result, key, indent: 0, lines: [] };
      } else {
        currentBlock = null;
        result[key] = cleanScalar(value);
      }
      continue;
    }

    const nestedMatch = raw.match(/^ {2}([a-zA-Z_]+):\s?(.*)$/);
    if (nestedMatch && currentBlock && typeof currentBlock === 'object') {
      const [, key, value] = nestedMatch;
      const trimmedValue = value.trim();
      if (/^[|>][-+]?$/.test(trimmedValue)) {
        blockScalar = { target: currentBlock, key, indent: 2, lines: [] };
      } else {
        currentBlock[key] = cleanScalar(value);
      }
    }
  }
  flushBlockScalar();
  return result;
}

function walkTcFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTcFiles(full, out);
    } else if (/^TC-.*\.md$/.test(entry.name) && /[\\/]test-cases[\\/]/.test(full)) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const menuToModule = loadManifestModules();
  const files = walkTcFiles(qaDocs);

  const tcs = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '');
    const fm = parseFrontmatter(text);
    if (!fm.tc_code) continue;

    const automated = fm.automated === 'true';
    const testResult = fm.test_result || {};
    const lastExecution = fm.last_execution || {};
    const status = testResult.status || lastExecution.status || 'not_run';
    const finishedAt = testResult.finished_at || lastExecution.at || null;

    tcs.push({
      tc_code: fm.tc_code,
      title: fm.title || '',
      menu: fm.menu || '',
      menu_name: fm.menu_name || fm.menu || '',
      module: menuToModule[fm.menu] || 'Unclassified',
      test_type: fm.test_type || 'unclassified',
      automated,
      automated_spec: fm.automated_spec || null,
      status: automated ? status : 'not_automated',
      started_at: testResult.started_at || null,
      finished_at: finishedAt,
      environment: testResult.environment || null,
      log_summary: testResult.log_summary || null,
    });
  }

  const automatedTcs = tcs.filter((t) => t.automated);
  const executed = automatedTcs.filter((t) => t.status !== 'not_run');
  const passed = executed.filter((t) => t.status === 'passed');
  const failed = executed.filter((t) => t.status === 'failed' || t.status === 'error');

  const moduleMap = new Map();
  for (const tc of automatedTcs) {
    if (!moduleMap.has(tc.module)) {
      moduleMap.set(tc.module, { module: tc.module, total: 0, executed: 0, passed: 0, failed: 0, last_run: null });
    }
    const m = moduleMap.get(tc.module);
    m.total += 1;
    if (tc.status !== 'not_run') {
      m.executed += 1;
      if (tc.status === 'passed') m.passed += 1;
      if (tc.status === 'failed' || tc.status === 'error') m.failed += 1;
      if (tc.finished_at && (!m.last_run || tc.finished_at > m.last_run)) m.last_run = tc.finished_at;
    }
  }

  const recentFailures = failed
    .slice()
    .sort((a, b) => (b.finished_at || '').localeCompare(a.finished_at || ''))
    .slice(0, 20);

  const recentRuns = executed
    .slice()
    .sort((a, b) => (b.finished_at || '').localeCompare(a.finished_at || ''))
    .slice(0, 50);

  const data = {
    generated_at: new Date().toISOString(),
    source: 'existing test_result / last_execution frontmatter — no new test run',
    summary: {
      total_tc: tcs.length,
      automated_tc: automatedTcs.length,
      executed_tc: executed.length,
      never_run_tc: automatedTcs.length - executed.length,
      passed: passed.length,
      failed: failed.length,
      pass_rate: executed.length > 0 ? Math.round((passed.length / executed.length) * 100) : null,
    },
    modules: [...moduleMap.values()].sort((a, b) => b.total - a.total),
    recent_failures: recentFailures,
    recent_runs: recentRuns,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  console.log(`TC total: ${tcs.length} | automated: ${automatedTcs.length} | executed: ${executed.length} | passed: ${passed.length} | failed: ${failed.length}`);
  console.log(`Ditulis ke ${path.relative(root, outPath)}`);
}

main();
