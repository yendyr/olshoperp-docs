import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

type PhaseRecord = {
  flow_id: string;
  run_id: string;
  company: string;
  test_data: {
    supplier: string;
    product_lines: Array<{ sku: string; qty: number }>;
  };
  phase: number;
  menu: string;
  recalls?: string[];
  produces: Record<string, unknown>;
  // diisi reporter:
  test_title: string;
  status: TestResult['status'];
  duration_ms: number;
  error?: string;
};

/**
 * Membaca attachment `flow-phase` (JSON) yang di-attach tiap phase pada flow spec,
 * lalu menulis ringkasan run ke playwright-report/flow-summary.md + .json.
 * Phase yang gagal SEBELUM sempat attach tetap tercatat (dari title [@FLOW-*][phase-N]).
 */
export default class FlowSummaryReporter implements Reporter {
  private records: PhaseRecord[] = [];
  private startedAt = new Date();

  onTestEnd(test: TestCase, result: TestResult): void {
    const flowTag = test.title.match(/\[@(FLOW-[A-Z0-9-]+)\]/)?.[1];
    if (!flowTag) return;

    const attachment = result.attachments.find((a) => a.name === 'flow-phase' && a.body);
    const base: Partial<PhaseRecord> = attachment
      ? (JSON.parse(attachment.body!.toString('utf-8')) as PhaseRecord)
      : {
          flow_id: flowTag.toLowerCase(),
          run_id: 'unknown',
          company: 'unknown',
          test_data: { supplier: '-', product_lines: [] },
          phase: Number(test.title.match(/\[phase-(\d+)\]/)?.[1] ?? 0),
          menu: '-',
          produces: {},
        };

    this.records.push({
      ...(base as PhaseRecord),
      test_title: test.title,
      status: result.status,
      duration_ms: result.duration,
      error: result.error?.message?.split('\n')[0],
    });
  }

  onEnd(result: FullResult): void {
    if (this.records.length === 0) return;

    const outDir = path.resolve(process.cwd(), 'playwright-report');
    fs.mkdirSync(outDir, { recursive: true });

    const byFlow = new Map<string, PhaseRecord[]>();
    for (const rec of this.records) {
      const key = `${rec.flow_id}::${rec.run_id}`;
      byFlow.set(key, [...(byFlow.get(key) ?? []), rec]);
    }

    const lines: string[] = [
      '# Flow E2E Summary',
      '',
      `- Run selesai: ${new Date().toISOString()}`,
      `- Hasil keseluruhan: **${result.status}**`,
      '',
    ];

    for (const [key, phases] of byFlow) {
      const first = phases[0];
      phases.sort((a, b) => a.phase - b.phase);
      const totalMs = phases.reduce((sum, p) => sum + p.duration_ms, 0);
      const allPassed = phases.every((p) => p.status === 'passed');

      lines.push(
        `## ${first.flow_id} — run \`${first.run_id}\` ${allPassed ? '✅' : '❌'}`,
        '',
        `- Company: \`${first.company}\``,
        `- Supplier: ${first.test_data.supplier}`,
        `- Test data: ${first.test_data.product_lines
          .map((l) => `${l.sku} (qty ${l.qty})`)
          .join(', ') || '-'}`,
        `- Total durasi: ${(totalMs / 1000).toFixed(1)}s`,
        '',
        '| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |',
        '|-------|------|------------------|--------|--------|--------------------|-------|',
      );

      for (const p of phases) {
        const produced = Object.entries(p.produces)
          .map(([k, v]) => `${k}: \`${v}\``)
          .join('<br>');
        const recalls = (p.recalls ?? []).join('<br>');
        lines.push(
          `| ${p.phase} | ${p.menu} | ${recalls || '—'} | ${p.status === 'passed' ? '✅ passed' : `❌ ${p.status}`} | ${(p.duration_ms / 1000).toFixed(1)}s | ${produced || '—'} | ${p.error ?? ''} |`,
        );
      }
      lines.push('');
    }

    lines.push(
      '> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.',
      '',
    );

    const summaryMd = lines.join('\n');
    const summaryJson = JSON.stringify(
      { finished_at: new Date().toISOString(), overall: result.status, phases: this.records },
      null,
      2,
    );

    fs.writeFileSync(path.join(outDir, 'flow-summary.md'), summaryMd, 'utf-8');
    fs.writeFileSync(path.join(outDir, 'flow-summary.json'), summaryJson, 'utf-8');

    // History per flow: simpan run terakhir + run sebelumnya (untuk banding before/after).
    // last-run.* dirotasi ke prev-run.* setiap ada run baru — maks 2 snapshot per flow.
    for (const [, phases] of byFlow) {
      const flowId = phases[0].flow_id;
      // Phase yang gagal SEBELUM sempat attach hanya punya data fallback dari tag
      // (run_id 'unknown', flow_id turunan tag). Grup seperti ini tetap tampil di
      // summary sebagai bukti kegagalan, tapi TIDAK boleh menulis history —
      // kalau ditulis, ia membuat folder flow palsu di tests/flow-history/.
      if (phases[0].run_id === 'unknown') continue;
      const historyDir = path.resolve(process.cwd(), 'tests', 'flow-history', flowId);
      fs.mkdirSync(historyDir, { recursive: true });
      for (const ext of ['md', 'json']) {
        const last = path.join(historyDir, `last-run.${ext}`);
        if (fs.existsSync(last)) {
          fs.copyFileSync(last, path.join(historyDir, `prev-run.${ext}`));
        }
      }
      fs.writeFileSync(path.join(historyDir, 'last-run.md'), summaryMd, 'utf-8');
      fs.writeFileSync(path.join(historyDir, 'last-run.json'), summaryJson, 'utf-8');
    }

    // eslint-disable-next-line no-console
    console.log(
      `\nFlow summary: playwright-report/flow-summary.md | history: tests/flow-history/{flow_id}/last-run.md (+prev-run.md)`,
    );
  }
}
