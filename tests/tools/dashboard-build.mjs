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
  const allModules = new Set();
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
      allModules.add(moduleMatch[1]);
      currentMenu = null;
    }
  }
  return { menuToModule, allModules: [...allModules].sort() };
}

const MODULE_URL_KEYS = {
  Accounting: 'accounting',
  OmniChannel: 'omni',
  SupplyChain: 'scm',
  Gate: 'gate',
  GeneralSetting: 'settings',
  BusinessDevelopment: 'businessdevelopment',
  AI: 'ai',
};

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

/** Apakah status frontmatter menandakan TC pernah dieksekusi. */
function isExecutedStatus(status) {
  return Boolean(status && status !== 'not_run');
}

/**
 * Resolve hasil eksekusi terakhir per TC.
 * last_execution = sumber kebenaran (rule 13); test_result = arsip diagnostik legacy.
 */
function resolveExecution(testResult, lastExecution) {
  const tr = testResult || {};
  const le = lastExecution || {};
  const leHasRun = Boolean(le.at) || isExecutedStatus(le.status);

  if (leHasRun) {
    return {
      status: le.status || 'unknown',
      finished_at: le.at || tr.finished_at || null,
      started_at: tr.started_at || null,
      environment: tr.environment || null,
      log_summary: le.notes || tr.log_summary || null,
      via: le.via || null,
    };
  }

  if (isExecutedStatus(tr.status)) {
    return {
      status: tr.status,
      finished_at: tr.finished_at || null,
      started_at: tr.started_at || null,
      environment: tr.environment || null,
      log_summary: tr.log_summary || null,
      via: null,
    };
  }

  return {
    status: 'not_run',
    finished_at: null,
    started_at: null,
    environment: null,
    log_summary: null,
    via: null,
  };
}

function main() {
  const { menuToModule, allModules } = loadManifestModules();
  const files = walkTcFiles(qaDocs);

  const tcs = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '');
    const fm = parseFrontmatter(text);
    if (!fm.tc_code) continue;

    const automated = fm.automated === 'true';
    const exec = resolveExecution(fm.test_result, fm.last_execution);
    const firstExecution = fm.first_execution || {};
    const firstAt = cleanScalar(firstExecution.at ?? '') || null;
    const firstVia = cleanScalar(firstExecution.via ?? '') || null;

    const menuSlug = fm.menu || fm.menu_slug || '';
    const moduleName = menuToModule[menuSlug] || 'Unclassified';
    const moduleUrlKey = MODULE_URL_KEYS[moduleName] || moduleName.toLowerCase().replace(/\s+/g, '');

    tcs.push({
      tc_code: fm.tc_code,
      title: fm.title || '',
      menu: menuSlug,
      menu_name: fm.menu_name || fm.menu || '',
      module: moduleName,
      module_url_key: moduleUrlKey,
      test_type: fm.test_type || 'unclassified',
      automated,
      automated_spec: fm.automated_spec || null,
      status: exec.status,
      started_at: exec.started_at,
      finished_at: exec.finished_at,
      first_execution_at: firstAt,
      first_execution_via: firstVia,
      environment: exec.environment,
      log_summary: exec.log_summary,
      execution_via: exec.via,
    });
  }

  const automatedTcs = tcs.filter((t) => t.automated);
  const executed = tcs.filter((t) => t.status !== 'not_run');
  const passed = executed.filter((t) => t.status === 'passed');
  const failed = executed.filter((t) => t.status === 'failed' || t.status === 'error');

  const moduleMap = new Map();
  for (const tc of tcs) {
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

  const executedAutomated = executed.filter((t) => t.automated).length;
  const executedManual = executed.length - executedAutomated;

  for (const mod of allModules) {
    if (!moduleMap.has(mod)) {
      moduleMap.set(mod, { module: mod, total: 0, executed: 0, passed: 0, failed: 0, last_run: null });
    }
  }

  const moduleOrder = (a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.module.localeCompare(b.module);
  };

  const modules = [...moduleMap.values()]
    .filter((m) => m.module !== 'Unclassified' || m.total > 0)
    .sort(moduleOrder);

  const data = {
    generated_at: new Date().toISOString(),
    source: 'last_execution (primary) + test_result fallback — no new test run',
    summary: {
      total_tc: tcs.length,
      automated_tc: automatedTcs.length,
      executed_tc: executed.length,
      executed_automated_tc: executedAutomated,
      executed_manual_tc: executedManual,
      never_run_tc: tcs.length - executed.length,
      passed: passed.length,
      failed: failed.length,
      pass_rate: executed.length > 0 ? Math.round((passed.length / executed.length) * 100) : null,
    },
    modules,
    recent_failures: recentFailures,
    recent_runs: recentRuns,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  console.log(`TC total: ${tcs.length} | automated: ${automatedTcs.length} | executed: ${executed.length} | passed: ${passed.length} | failed: ${failed.length}`);
  console.log(`Ditulis ke ${path.relative(root, outPath)}`);
}

main();
