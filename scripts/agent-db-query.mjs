#!/usr/bin/env node

/**
 * OlshopERP Database Debugger Runner Script (Node.js)
 * 
 * Tool aman untuk query database production (tyas_olshoperp) / staging (staging_olshoperp) / merdian (merdian_olshoperp)
 * Membaca kredensial dari .env dan memberlakukan validasi STRICT READ-ONLY.
 * 
 * Usage:
 *   node scripts/agent-db-query.mjs --db=tyas_olshoperp --query="SELECT id, name, email FROM gate_users LIMIT 5"
 *   node scripts/agent-db-query.mjs --db=staging_olshoperp --query="SELECT * FROM audits WHERE auditable_id = 10"
 *   node scripts/agent-db-query.mjs --db=merdian_olshoperp --query="SELECT id, name, email FROM gate_users LIMIT 5"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Baca file .env
function loadEnv() {
  const possiblePaths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../olshoperp/.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'olshoperp/.env'),
    path.resolve(process.cwd(), '../olshoperp/.env'),
    'd:/olshoperp/olshoperp/.env',
    'd:/olshoperp/.env'
  ];

  const env = {};
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const equalIdx = trimmed.indexOf('=');
        if (equalIdx > 0) {
          const key = trimmed.slice(0, equalIdx).trim();
          let val = trimmed.slice(equalIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          env[key] = val;
        }
      }
      break;
    }
  }
  return env;
}

async function main() {
  const env = loadEnv();
  // 2. Parse arguments
  const args = process.argv.slice(2);
  let query = null;
  let db = 'tyas_olshoperp';
  let limit = null;
  let raw = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log(`
OlshopERP Agent DB Query Runner
-------------------------------
Usage:
  node scripts/agent-db-query.mjs --query="<SQL_QUERY>" [--db=<DB_NAME>] [--limit=<NUM>] [--raw]

Options:
  --query, -q    SQL query to execute (Must be read-only: SELECT, EXPLAIN, DESCRIBE, SHOW)
  --db, -d       Target database (default: tyas_olshoperp, options: tyas_olshoperp, staging_olshoperp, merdian_olshoperp)
  --limit, -l    Force limit rows (default: 100 if no LIMIT is provided)
  --raw, -r      Output raw unformatted JSON response
  --help, -h     Show this help message
      `);
      return;
    } else if (arg.startsWith('--query=')) {
      query = arg.slice(8);
    } else if (arg === '--query' || arg === '-q') {
      query = args[++i];
    } else if (arg.startsWith('--db=')) {
      db = arg.slice(5);
    } else if (arg === '--db' || arg === '-d') {
      db = args[++i];
    } else if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.slice(8), 10);
    } else if (arg === '--limit' || arg === '-l') {
      limit = parseInt(args[++i], 10);
    } else if (arg === '--raw' || arg === '-r') {
      raw = true;
    }
  }

  // Determine webhook URL and API key based on target database
  let webhookUrl = env.DB_DEBUG_WEBHOOK_URL || process.env.DB_DEBUG_WEBHOOK_URL || 'https://n8n.olshoperp.com/webhook/agent-db-tyas';
  let apiKey = env.DB_DEBUG_API_KEY || process.env.DB_DEBUG_API_KEY || '';

  if (db === 'merdian_olshoperp') {
    webhookUrl = env.DB_DEBUG_WEBHOOK_URL_MERDIAN || process.env.DB_DEBUG_WEBHOOK_URL_MERDIAN || 'https://n9n.olshoperp.com/webhook/agent-db-merdian';
    apiKey = env.DB_DEBUG_API_KEY_MERDIAN || process.env.DB_DEBUG_API_KEY_MERDIAN || apiKey;
  }

  if (!apiKey) {
    console.error(JSON.stringify({
      status: 'error',
      message: 'DB_DEBUG_API_KEY / DB_DEBUG_API_KEY_MERDIAN tidak ditemukan pada file .env!'
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  if (!query) {
    console.error(JSON.stringify({
      status: 'error',
      message: 'Parameter --query wajib diisi. Contoh: node scripts/agent-db-query.mjs --query="SELECT * FROM gate_users LIMIT 5"'
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  query = query.trim();

  // 3. Strict Read-Only Guard
  const normalized = query.replace(/\s+/g, ' ');
  const upperQuery = normalized.toUpperCase();

  if (!/^(SELECT|EXPLAIN|DESCRIBE|SHOW|WITH)\b/i.test(normalized)) {
    console.error(JSON.stringify({
      status: 'error',
      code: 'MUTATION_BLOCKED',
      message: 'KEAMANAN: Hanya query READ-ONLY (SELECT, EXPLAIN, DESCRIBE, SHOW, WITH) yang diizinkan! Dilarang mengubah data.'
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  const forbiddenKeywords = [
    'INSERT INTO', 'UPDATE ', 'DELETE FROM', 'DROP TABLE', 'DROP DATABASE',
    'ALTER TABLE', 'TRUNCATE TABLE', 'TRUNCATE ', 'REPLACE INTO', 'CREATE TABLE',
    'CREATE DATABASE', 'GRANT ', 'REVOKE ', 'FLUSH PRIVILEGES', 'SET PASSWORD',
    'INTO OUTFILE', 'INTO DUMPFILE'
  ];

  for (const forbidden of forbiddenKeywords) {
    if (upperQuery.includes(forbidden)) {
      console.error(JSON.stringify({
        status: 'error',
        code: 'FORBIDDEN_KEYWORD',
        message: `KEAMANAN: Query dibatalkan karena memuat keyword mutasi terlarang: ${forbidden}`
      }, null, 2));
      process.exitCode = 1;
      return;
    }
  }

  // 4. Auto-limit safeguard jika belum ada LIMIT pada SELECT
  if (limit) {
    if (!/\bLIMIT\s+\d+/i.test(query)) {
      query = query.replace(/;+$/, '') + ` LIMIT ${limit}`;
    }
  } else if (/^SELECT\b/i.test(query) && !/\bLIMIT\s+\d+/i.test(query) && !/\bCOUNT\s*\(/i.test(query)) {
    query = query.replace(/;+$/, '') + ' LIMIT 100';
  }

  // 5. Eksekusi Request ke n8n Webhook
  try {
    const payload = {
      query: query,
      db: db
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();

    if (raw) {
      process.stdout.write(rawText + '\n');
      return;
    }

    let decoded;
    try {
      decoded = JSON.parse(rawText);
    } catch (e) {
      decoded = rawText;
    }

    if (!response.ok || (typeof decoded === 'object' && decoded !== null && decoded.error)) {
      console.error(JSON.stringify({
        status: 'error',
        http_status: response.status,
        response: decoded
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    if (Array.isArray(decoded)) {
      console.log(JSON.stringify({
        status: 'success',
        database: db,
        query_executed: query,
        total_rows: decoded.length,
        data: decoded
      }, null, 2));
    } else {
      console.log(JSON.stringify({
        status: 'success',
        database: db,
        query_executed: query,
        result: decoded
      }, null, 2));
    }
  } catch (err) {
    console.error(JSON.stringify({
      status: 'error',
      code: 'FETCH_ERROR',
      message: `Gagal menghubungi endpoint webhook n8n: ${err.message}`
    }, null, 2));
    process.exitCode = 1;
  }
}

main();
