import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRIPT = path.join(__dirname, 'xlsx-inline.py');

function runPython(args: string[]): string {
  return execFileSync('python3', [SCRIPT, ...args], {
    encoding: 'utf8',
  }).trim();
}

export function readXlsxHeaders(filePath: string): string[] {
  const raw = runPython(['headers', filePath]);
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Gagal baca header xlsx: ${raw}`);
  }
  return parsed.map((item) => String(item ?? ''));
}

export function writeXlsx(
  filePath: string,
  headers: string[],
  rows: string[][],
): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  runPython(['write', filePath, JSON.stringify({ headers, rows })]);
}
