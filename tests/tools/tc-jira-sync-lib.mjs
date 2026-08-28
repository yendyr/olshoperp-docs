/**
 * Shared helpers — sync Jira Test Case Done → qa-docs TC last_execution / first_execution.
 * Field map: tests/tools/jira-etm-config.json (ETM site).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const qaDocs = path.join(root, 'qa-docs');

export const jiraConfig = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'jira-etm-config.json'), 'utf-8'),
);

/** @param {unknown} node */
export function adfToPlainText(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(adfToPlainText).join('');
  if (typeof node !== 'object') return String(node);
  if (node.type === 'text' && typeof node.text === 'string') return node.text;
  const parts = [];
  if (Array.isArray(node.content)) parts.push(node.content.map(adfToPlainText).join(''));
  if (Array.isArray(node.items)) parts.push(node.items.map(adfToPlainText).join('\n'));
  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function normalizeEtmKey(raw) {
  const s = String(raw ?? '').trim().toUpperCase();
  if (!s) return null;
  if (/^ETM-\d+$/.test(s)) return s;
  if (/^\d+$/.test(s)) return `ETM-${s}`;
  return null;
}

export function parseBlock(raw, key) {
  const m = raw.match(new RegExp(`^${key}:\\n((?:[ \\t]+.*\\n?)*)`, 'm'));
  if (!m) return null;
  const get = (k) => m[1].match(new RegExp(`^\\s+${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim() ?? null;
  return {
    at: get('at'),
    via: get('via'),
    jira: get('jira'),
    status: get('status'),
    notes: get('notes'),
  };
}

export function isEmptyAt(at) {
  return !at || at === 'null' || at === '~';
}

export function toDateOnly(isoOrDate) {
  if (!isoOrDate) return null;
  const s = String(isoOrDate);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

export function yamlQuote(value) {
  if (value == null || value === 'null') return 'null';
  const s = String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${s}"`;
}

export function buildExecutionBlock(prefix, { at, jira, status, via, notes }) {
  let block = `${prefix}:\n`;
  block += `  at: ${at ? yamlQuote(at) : 'null'}\n`;
  if (prefix === 'last_execution') {
    block += `  jira: ${jira ? yamlQuote(jira) : 'null'}\n`;
    block += `  status: ${status ?? 'not_run'}\n`;
  }
  block += `  via: ${via ? yamlQuote(via) : 'null'}\n`;
  if (prefix === 'last_execution' && notes != null) {
    block += `  notes: ${yamlQuote(notes)}\n`;
  } else if (prefix === 'first_execution') {
    block += `  jira: ${jira ? yamlQuote(jira) : 'null'}\n`;
  }
  return block;
}

export function walkTcFiles(dir, out = []) {
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

export function readFrontmatterScalar(raw, key) {
  return raw.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim() ?? null;
}

/** @returns {Map<string, string[]>} jiraKey → file paths */
export function indexTcByJiraRef() {
  /** @type {Map<string, Set<string>>} */
  const map = new Map();
  const add = (key, file) => {
    const k = normalizeEtmKey(key);
    if (!k) return;
    if (!map.has(k)) map.set(k, new Set());
    map.get(k).add(file);
  };

  for (const file of walkTcFiles(qaDocs)) {
    const raw = fs.readFileSync(file, 'utf-8');
    add(readFrontmatterScalar(raw, 'origin_jira'), file);
    add(readFrontmatterScalar(raw, 'card_ref'), file);
    const le = parseBlock(raw, 'last_execution');
    add(le?.jira, file);

    const rel = path.relative(qaDocs, file);
    const folderMatch = rel.match(/\/(ETM-\d+)\/test-cases\//);
    if (folderMatch) add(folderMatch[1], file);
  }

  /** @type {Map<string, string[]>} */
  const out = new Map();
  for (const [k, set] of map) out.set(k, [...set].sort());
  return out;
}

export function mapTestResult(value) {
  if (!value) return null;
  const v = typeof value === 'object' && value.value ? value.value : String(value);
  return jiraConfig.test_result_map[v] ?? null;
}

export function isJiraDone(card) {
  const cat = (card.statusCategory ?? card.status_category ?? '').toLowerCase();
  if (cat === 'done') return true;
  const name = card.status ?? '';
  return jiraConfig.done_status_names.includes(name);
}

export function summarizeNotes(actualResult, key) {
  const text = (actualResult ?? '').trim();
  if (text.length >= 20) {
    return text.length > 500 ? `${text.slice(0, 497)}…` : text;
  }
  return `Disinkron dari Jira ${key}: Test Result terisi, Actual Result ${text ? 'ringkas' : 'kosong'} (via #sync-jira-done).`;
}

/**
 * @param {object} card snapshot from Jira MCP
 * @param {{ force?: boolean }} opts
 */
export function shouldUpdateExisting(last, cardStatus, { force = false } = {}) {
  if (!last || last.status === 'not_run' || isEmptyAt(last.at)) return true;
  if (force) return true;
  const via = (last.via ?? '').replace(/^"|"$/g, '');
  if (via.startsWith('card:')) return true;
  if (via.startsWith('tests/') || via.includes('.spec.ts')) return false;
  if (via.startsWith('manual:')) return false;
  return cardStatus !== last.status;
}

/**
 * @param {string} file
 * @param {object} card
 * @param {{ force?: boolean, dryRun?: boolean }} opts
 */
export function applyCardToTcFile(file, card, opts = {}) {
  const key = normalizeEtmKey(card.key);
  const raw = fs.readFileSync(file, 'utf-8');
  const le = parseBlock(raw, 'last_execution');

  if (!isJiraDone(card)) {
    return { file, key, action: 'skipped', reason: `Jira status bukan Done (${card.status ?? '?'})` };
  }

  const status = mapTestResult(card.testResult);
  if (!status) {
    return { file, key, action: 'skipped', reason: 'Test Result kosong / tidak dikenali di Jira' };
  }

  if (!shouldUpdateExisting(le, status, opts)) {
    return {
      file,
      key,
      action: 'skipped',
      reason: 'last_execution sudah dari Playwright CLI — pakai --force untuk timpa',
    };
  }

  const at =
    toDateOnly(card.testedAt) ?? toDateOnly(card.updated) ?? new Date().toISOString().slice(0, 10);
  const via = `card:${key}`;
  const notes = summarizeNotes(card.actualResult, key);

  const lastBlock = buildExecutionBlock('last_execution', {
    at,
    jira: key,
    status,
    via,
    notes,
  });

  let next = raw;
  if (/^last_execution:\n(?:[ \t]+\S.*\n)*/m.test(next)) {
    next = next.replace(/^last_execution:\n(?:[ \t]+\S.*\n)*/m, lastBlock);
  } else {
    next = next.replace(/\n---\n/, `\n${lastBlock}---\n`);
  }

  const feParsed = parseBlock(next, 'first_execution');
  if (!feParsed || isEmptyAt(feParsed.at)) {
    const firstBlock = buildExecutionBlock('first_execution', { at, jira: key, via });
    if (/^first_execution:\n(?:[ \t]+\S.*\n)*/m.test(next)) {
      next = next.replace(/^first_execution:\n(?:[ \t]+\S.*\n)*/m, firstBlock);
    } else {
      next = next.replace(/^last_execution:\n/m, `${firstBlock}last_execution:\n`);
    }
  }

  if (next !== raw && !opts.dryRun) fs.writeFileSync(file, next, 'utf-8');

  return {
    file: path.relative(root, file),
    key,
    action: next !== raw ? (opts.dryRun ? 'would_update' : 'updated') : 'unchanged',
    status,
    at,
  };
}

/** Normalize MCP getJiraIssue payload → card snapshot */
export function normalizeJiraIssue(issue) {
  const f = issue.fields ?? {};
  const names = issue.names ?? {};
  const cfg = jiraConfig.fields;
  const testResultField = f[cfg.test_result];
  const actualField = f[cfg.actual_result];
  return {
    key: issue.key,
    issueType: f.issuetype?.name ?? null,
    status: f.status?.name ?? null,
    statusCategory: f.status?.statusCategory?.key ?? f.status?.statusCategory?.name ?? null,
    updated: f.updated ?? null,
    testedAt: f[cfg.end_date] ?? f.updated ?? null,
    testResult: testResultField?.value ?? testResultField ?? null,
    actualResult: adfToPlainText(actualField),
    testExecuteBy: f[cfg.test_execute_by]?.displayName ?? null,
    fieldNames: {
      test_result: names[cfg.test_result] ?? 'Test Result',
      actual_result: names[cfg.actual_result] ?? 'Actual Result',
    },
  };
}

export const jiraFetchFields = [
  'status',
  'issuetype',
  'updated',
  jiraConfig.fields.test_result,
  jiraConfig.fields.actual_result,
  jiraConfig.fields.end_date,
  jiraConfig.fields.test_execute_by,
];
