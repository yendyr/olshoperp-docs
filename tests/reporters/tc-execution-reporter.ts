import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * TC Execution Reporter — memperbarui `last_execution` di file TC origin setiap kali
 * TC tersebut dieksekusi, baik langsung maupun lewat flow yang me-recall-nya.
 *
 * Konsep yang ditegakkan (rule 13): **satu TC origin dipakai di banyak tempat.**
 * TC bisa dijalankan sendiri, dipanggil flow cross-menu, atau diuji ulang untuk card
 * Jira tertentu — semuanya eksekusi atas TC yang sama. Karena itu `last_execution`
 * cukup SATU dan terus diperbarui; card Jira yang melahirkan TC dicatat sekali di
 * `origin_jira` sebagai asal-usul, bukan kepemilikan, dan tidak pernah ditimpa.
 *
 * Sumber kode TC yang dieksekusi:
 *   1. tag `@TC-*` di judul test (spec single-menu)
 *   2. daftar `recalls` di attachment `flow-phase` (spec flow) — inilah yang membuat
 *      TC origin ikut ter-update saat flow berjalan, karena rantainya nyata
 */
export default class TcExecutionReporter implements Reporter {
  private executed = new Map<string, { status: string; via: string }>();

  onTestEnd(test: TestCase, result: TestResult): void {
    const via = path.relative(process.cwd(), test.location.file);

    for (const m of test.title.matchAll(/@(TC-[A-Z0-9-]+)/g)) {
      this.record(m[1], result.status, via);
    }

    const attachment = result.attachments.find((a) => a.name === 'flow-phase' && a.body);
    if (!attachment) return;
    try {
      const phase = JSON.parse(attachment.body!.toString('utf-8')) as {
        recalls?: string[];
      };
      for (const raw of phase.recalls ?? []) {
        // Nilai konstanta bisa gabungan ("TC-A + TC-B") — pecah jadi kode terpisah.
        for (const code of raw.split(/\s*\+\s*/).map((c) => c.trim())) {
          if (code) this.record(code, result.status, via);
        }
      }
    } catch {
      /* attachment rusak — abaikan, bukan tugas reporter memvalidasi */
    }
  }

  private record(code: string, status: string, via: string): void {
    const prev = this.executed.get(code);
    // Kalau satu TC dieksekusi beberapa kali dalam satu run (mis. retry atau dipakai
    // dua flow), status gagal lebih informatif untuk dicatat daripada lulus.
    if (prev && prev.status !== 'passed') return;
    this.executed.set(code, { status, via });
  }

  onEnd(): void {
    if (this.executed.size === 0) return;

    const qaDocs = path.resolve(process.cwd(), 'qa-docs');
    if (!fs.existsSync(qaDocs)) return;

    // Index tc_code → path file, sekali saja. Termasuk sub-folder per card
    // (`{menu}/ETM-xxxxx/test-cases/`) yang dipakai untuk mengelompokkan TC + card.md.
    const index = new Map<string, string>();
    const walk = (dir: string, depth = 0): void => {
      if (!fs.existsSync(dir) || depth > 4) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          if (!e.name.startsWith('_')) walk(full, depth + 1);
        } else if (/^TC-.*\.md$/.test(e.name) && /[\\/]test-cases[\\/]/.test(full)) {
          const code = fs
            .readFileSync(full, 'utf-8')
            .replace(/^﻿/, '')
            .match(/^tc_code:\s*"?([^"\n]+)"?\s*$/m)?.[1]
            ?.trim();
          if (code) index.set(code, full);
        }
      }
    };
    walk(qaDocs);

    const today = new Date().toISOString().slice(0, 10);
    const jira = process.env.OLSHOP_RUN_JIRA?.trim() || null;
    const updated: string[] = [];
    const missing: string[] = [];

    for (const [code, { status, via }] of this.executed) {
      const file = index.get(code);
      if (!file) {
        missing.push(code);
        continue;
      }

      const raw = fs.readFileSync(file, 'utf-8');
      const lastBlock =
        `last_execution:\n` +
        `  at: "${today}"\n` +
        `  jira: ${jira ? `"${jira}"` : 'null'}\n` +
        `  status: ${status}\n` +
        `  via: "${via}"\n`;

      let next = raw;

      // first_execution — set once saat run terminal pertama (rule 13 §first_execution).
      const feMatch = next.match(/^first_execution:\n(?:[ \t]+\S.*\n)*/m);
      const feAt = feMatch?.[0]?.match(/^\s+at:\s*(.+)$/m)?.[1]?.trim();
      const feEmpty = !feAt || feAt === 'null' || feAt === '""';
      if (feEmpty) {
        const firstBlock =
          `first_execution:\n` +
          `  at: "${today}"\n` +
          `  via: "${via}"\n` +
          `  jira: ${jira ? `"${jira}"` : 'null'}\n`;
        if (feMatch) {
          next = next.replace(/^first_execution:\n(?:[ \t]+\S.*\n)*/m, firstBlock);
        } else if (/^last_execution:\n/m.test(next)) {
          next = next.replace(/^last_execution:\n/m, `${firstBlock}last_execution:\n`);
        } else {
          next = next.replace(/\n---\n/, `\n${firstBlock}---\n`);
        }
      }

      // Ganti blok last_execution; origin_jira TIDAK pernah disentuh.
      if (/^last_execution:\n(?:[ \t]+\S.*\n)*/m.test(next)) {
        next = next.replace(/^last_execution:\n(?:[ \t]+\S.*\n)*/m, lastBlock);
      } else {
        next = next.replace(/\n---\n/, `\n${lastBlock}---\n`);
      }
        fs.writeFileSync(file, next, 'utf-8');
        updated.push(`${code} (${status})`);
      }
    }

    if (updated.length) {
      // eslint-disable-next-line no-console
      console.log(`\nlast_execution diperbarui di ${updated.length} TC: ${updated.join(', ')}`);
    }
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.log(
        `Catatan: ${missing.length} kode TC tidak ditemukan di qa-docs (${missing.join(', ')})` +
          ` — kemungkinan tag deskriptif tanpa TC origin, atau TC belum dibuat.`,
      );
    }
  }
}
