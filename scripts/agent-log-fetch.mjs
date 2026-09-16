#!/usr/bin/env node

/**
 * OlshopERP Laravel Log Debugger Runner Script (Node.js)
 * 
 * Tool untuk membaca dan mendebug Laravel Application Logs dari server:
 * - merdian (via https://n9n.olshoperp.com/webhook/agent-log-merdian)
 * - tyas & staging (via https://n8n.olshoperp.com/webhook/agent-log-tyas)
 * 
 * Usage:
 *   node scripts/agent-log-fetch.mjs --server=merdian --file=laravel-2026-09-04.log --level=error --start=1 --end=50
 *   node scripts/agent-log-fetch.mjs --server=tyas --file=laravel-2026-09-04.log --level=error --start=1 --end=50
 *   node scripts/agent-log-fetch.mjs --server=staging --file=laravel-2026-09-04.log --level=error --start=1 --end=50
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const args = process.argv.slice(2);

  const today = new Date().toISOString().split('T')[0];
  let server = 'tyas';
  let fileName = `laravel-${today}.log`;
  let level = 'error';
  let startLine = 1;
  let endLine = 50;
  let raw = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log(`
OlshopERP Agent Log Fetch Runner
--------------------------------
Usage:
  node scripts/agent-log-fetch.mjs [--server=tyas|staging|merdian] [--file=laravel-YYYY-MM-DD.log] [--level=error|warning|info|debug] [--start=1] [--end=50] [--raw]

Options:
  --server, -s  Target server: tyas, staging, merdian (default: tyas)
  --file, -f    Log file name (default: laravel-YYYY-MM-DD.log)
  --level, -l   Log level filter: error, warning, info, debug
  --start       Start line number (default: 1)
  --end         End line number (default: 50)
  --raw, -r     Output raw JSON response
  --help, -h    Show this help message
      `);
      return;
    } else if (arg.startsWith('--server=')) {
      server = arg.slice(9).toLowerCase();
    } else if (arg === '--server' || arg === '-s') {
      server = args[++i].toLowerCase();
    } else if (arg.startsWith('--file=')) {
      fileName = arg.slice(7);
    } else if (arg === '--file' || arg === '-f') {
      fileName = args[++i];
    } else if (arg.startsWith('--level=')) {
      level = arg.slice(8);
    } else if (arg === '--level' || arg === '-l') {
      level = args[++i];
    } else if (arg.startsWith('--start=')) {
      startLine = parseInt(arg.slice(8), 10);
    } else if (arg === '--start') {
      startLine = parseInt(args[++i], 10);
    } else if (arg.startsWith('--end=')) {
      endLine = parseInt(arg.slice(6), 10);
    } else if (arg === '--end') {
      endLine = parseInt(args[++i], 10);
    } else if (arg === '--raw' || arg === '-r') {
      raw = true;
    }
  }

  const validServers = ['tyas', 'staging', 'merdian'];
  if (!validServers.includes(server)) {
    console.error(JSON.stringify({
      status: 'error',
      message: `Server '${server}' tidak valid. Pilihan valid: ${validServers.join(', ')}`
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  // Determine Webhook URL & Payload structure
  let webhookUrl = '';
  const payload = {
    file_name: fileName,
    level: level.toLowerCase(),
    startLine: Number(startLine) || 1,
    endLine: Number(endLine) || 50
  };

  if (server === 'merdian') {
    webhookUrl = process.env.LOG_DEBUG_WEBHOOK_URL_MERDIAN || env.LOG_DEBUG_WEBHOOK_URL_MERDIAN || 'https://n9n.olshoperp.com/webhook/agent-log-merdian';
  } else {
    // For tyas and staging
    webhookUrl = process.env.LOG_DEBUG_WEBHOOK_URL_TYAS || env.LOG_DEBUG_WEBHOOK_URL_TYAS || 'https://n8n.olshoperp.com/webhook/agent-log-tyas';
    payload.server = server;
  }

  const apiKey = process.env.LOG_DEBUG_API_KEY || env.LOG_DEBUG_API_KEY || process.env.DB_DEBUG_API_KEY || env.DB_DEBUG_API_KEY || '$D3v3l0pm3nt';

  const validLevels = ['debug', 'error', 'info', 'warning'];
  if (level && !validLevels.includes(level.toLowerCase())) {
    console.error(JSON.stringify({
      status: 'error',
      message: `Level '${level}' tidak valid. Level yang didukung: ${validLevels.join(', ')}`
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(JSON.stringify({
        status: 'error',
        statusCode: response.status,
        message: `HTTP ${response.status}: ${response.statusText}`,
        detail: errorText
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    const data = await response.json();

    if (raw) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(JSON.stringify({
        status: 'success',
        server: server,
        file_name: fileName,
        level: level,
        startLine: startLine,
        endLine: endLine,
        payload: payload,
        response: data
      }, null, 2));
    }
  } catch (err) {
    console.error(JSON.stringify({
      status: 'error',
      message: err.message,
      stack: err.stack
    }, null, 2));
    process.exitCode = 1;
  }
}

main();
