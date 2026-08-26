import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ETM_15550_PAGES,
  ETM_15550_RESULTS_DIR,
  FilterFieldSizingPage,
  PLATFORM_PRODUCT_PATH,
  SIZE_TOLERANCE_PX,
  type BoxSize,
  type PageFilterTarget,
} from '../../helpers/filter-field-sizing';

/**
 * ETM-15550 — Field filtering: tinggi = Global Search, lebar = Choose Store (Platform Product).
 *
 * Mapping langkah kartu:
 * 1. Buka Platform Product → ukur Global Search (tinggi) + Choose Store (lebar)
 * 2. Buka tiap URL kartu → ukur field filtering toolbar
 * 3. Bandingkan vs baseline (± SIZE_TOLERANCE_PX)
 *
 * Company: DEV-STG (13) — sesuai instruksi run.
 */

type FilterResult = {
  label: string;
  size: BoxSize;
  widthOk: boolean | null;
  heightOk: boolean | null;
  note?: string;
};

type PageResult = {
  id: string;
  path: string;
  menuLabel: string;
  accessible: boolean;
  status: 'PASS' | 'FAIL' | 'N/A' | 'BLOCKED';
  filters: FilterResult[];
  notes: string[];
};

type RunDump = {
  card: string;
  company: string;
  companyId: number;
  environment: string;
  baseline: {
    globalSearch: BoxSize;
    chooseStore: BoxSize;
    expectedHeight: number;
    expectedWidth: number;
    cardExpectedHeight: number;
    cardExpectedWidth: number;
  };
  tolerancePx: number;
  pages: PageResult[];
  summary: {
    pass: number;
    fail: number;
    na: number;
    blocked: number;
  };
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

test.describe.configure({ retries: 0 });

test.describe('ETM-15550 filter field sizing vs Platform Product baseline', () => {
  test('[@ETM-15550] Tinggi=Global Search, lebar=Choose Store di 15 halaman', async ({
    page,
  }) => {
    test.setTimeout(600_000);
    fs.mkdirSync(path.join(ETM_15550_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });

    const helper = new FilterFieldSizingPage(page);
    const runNotes: string[] = [];

    await prepareSession(page, {
      companyCode: 'DEV-STG',
      targetPath: PLATFORM_PRODUCT_PATH,
    });

    // --- Baseline Platform Product ---
    await helper.gotoPath(PLATFORM_PRODUCT_PATH);
    const accessibleBaseline = await helper.assertPageLoaded(PLATFORM_PRODUCT_PATH);
    expect(accessibleBaseline, 'Platform Product harus accessible di DEV-STG').toBeTruthy();

    const globalSearch = await helper.measureGlobalSearch();
    expect(globalSearch.found, 'Global Search harus terlihat di Platform Product').toBeTruthy();

    const chooseStore = await helper.measureNamedFilter('Choose Store');
    expect(chooseStore.found, 'Choose Store harus terlihat di Platform Product').toBeTruthy();

    await helper.screenshot('00-baseline-platform-product.png');

    const expectedHeight = globalSearch.height;
    const expectedWidth = chooseStore.width;

    runNotes.push(
      `Baseline DEV-STG: Global Search ${globalSearch.width}×${globalSearch.height}, Choose Store ${chooseStore.width}×${chooseStore.height}`,
    );
    runNotes.push(
      `Kartu ETM-15550 (baseline lama Lumielle): tinggi 38, lebar Choose Store 539 — bandingkan juga di HASIL.`,
    );

    const pages: PageResult[] = [];

    for (const target of ETM_15550_PAGES) {
      const pageResult = await measurePage(
        helper,
        target,
        expectedWidth,
        expectedHeight,
      );
      pages.push(pageResult);
      await helper.screenshot(
        `${String(pages.length).padStart(2, '0')}-${target.id}.png`,
      );
    }

    const summary = {
      pass: pages.filter((p) => p.status === 'PASS').length,
      fail: pages.filter((p) => p.status === 'FAIL').length,
      na: pages.filter((p) => p.status === 'N/A').length,
      blocked: pages.filter((p) => p.status === 'BLOCKED').length,
    };

    const verdict: 'PASS' | 'FAIL' =
      summary.fail === 0 && summary.blocked === 0 ? 'PASS' : 'FAIL';

    const dump: RunDump = {
      card: 'ETM-15550',
      company: 'DEV-STG',
      companyId: 13,
      environment: 'https://staging.olshoperp.com',
      baseline: {
        globalSearch,
        chooseStore,
        expectedHeight,
        expectedWidth,
        cardExpectedHeight: 38,
        cardExpectedWidth: 539,
      },
      tolerancePx: SIZE_TOLERANCE_PX,
      pages,
      summary,
      verdict,
      notes: runNotes,
    };

    fs.writeFileSync(
      path.join(ETM_15550_RESULTS_DIR, 'measurements.json'),
      JSON.stringify(dump, null, 2),
    );

    writeHasilMd(dump);

    expect(
      verdict,
      `ETM-15550 verdict FAIL — fail=${summary.fail} blocked=${summary.blocked}. Lihat Automate Testing Card QA Review/ETM-15550/`,
    ).toBe('PASS');
  });
});

async function measurePage(
  helper: FilterFieldSizingPage,
  target: PageFilterTarget,
  expectedWidth: number,
  expectedHeight: number,
): Promise<PageResult> {
  const notes: string[] = [];
  await helper.gotoPath(target.path);
  const accessible = await helper.assertPageLoaded(target.path).catch(() => false);

  if (!accessible) {
    return {
      id: target.id,
      path: target.path,
      menuLabel: target.menuLabel,
      accessible: false,
      status: 'BLOCKED',
      filters: [],
      notes: ['Halaman tidak accessible / topbar tidak muncul'],
    };
  }

  if (target.expectNoFilter) {
    const toolbar = await helper.measureToolbarFilters();
    const named = toolbar.filter((t) => !/find something/i.test(t.selectorHint));
    if (named.length === 0) {
      return {
        id: target.id,
        path: target.path,
        menuLabel: target.menuLabel,
        accessible: true,
        status: 'N/A',
        filters: [],
        notes: ['Sesuai kartu: hanya Global Search, tidak ada field filtering'],
      };
    }
    notes.push(
      `Kartu bilang N/A tapi ditemukan ${named.length} kontrol filter — dinilai sebagai FAIL jika ukuran tidak match`,
    );
  }

  const filters: FilterResult[] = [];

  if (target.filterLabels.length > 0) {
    const seenKeys = new Set<string>();
    for (const label of target.filterLabels) {
      const size = await helper.measureNamedFilter(label);
      if (!size.found) {
        continue;
      }
      // Dedup alias casing / ukuran hampir sama (satu kontrol)
      const key = `${size.width}x${size.height}`;
      if (seenKeys.has(key)) {
        continue;
      }
      seenKeys.add(key);
      const match = helper.matchesSize(size, expectedWidth, expectedHeight);
      filters.push({
        label,
        size,
        widthOk: match.widthOk,
        heightOk: match.heightOk,
      });
    }
    if (filters.length === 0) {
      filters.push({
        label: target.filterLabels[0],
        size: {
          width: 0,
          height: 0,
          found: false,
          selectorHint: `not-found:${target.filterLabels.join('|')}`,
        },
        widthOk: null,
        heightOk: null,
        note: 'Kontrol tidak ditemukan',
      });
    }
  } else if (!target.expectNoFilter) {
    const toolbar = await helper.measureToolbarFilters();
    if (toolbar.length === 0) {
      filters.push({
        label: '(toolbar filter)',
        size: { width: 0, height: 0, found: false, selectorHint: 'none' },
        widthOk: null,
        heightOk: null,
        note: 'Tidak ada field filtering terdeteksi di toolbar',
      });
    } else {
      for (const size of toolbar) {
        const match = helper.matchesSize(size, expectedWidth, expectedHeight);
        filters.push({
          label: size.selectorHint || '(toolbar)',
          size,
          widthOk: match.widthOk,
          heightOk: match.heightOk,
        });
      }
    }
  }

  // Dedup labels that failed lookup when another alias succeeded
  const foundFilters = filters.filter((f) => f.size.found);
  const missingOnly = filters.filter((f) => !f.size.found);
  const effective =
    foundFilters.length > 0
      ? foundFilters
      : missingOnly.length > 0
        ? missingOnly
        : filters;

  let status: PageResult['status'] = 'PASS';
  if (target.expectNoFilter && effective.length === 0) {
    status = 'N/A';
  } else if (effective.length === 0) {
    status = 'FAIL';
    notes.push('Tidak ada filter terukur');
  } else if (effective.some((f) => !f.size.found)) {
    status = 'FAIL';
    notes.push('Satu atau lebih filter tidak ditemukan');
  } else if (effective.some((f) => f.widthOk === false || f.heightOk === false)) {
    status = 'FAIL';
  }

  return {
    id: target.id,
    path: target.path,
    menuLabel: target.menuLabel,
    accessible: true,
    status,
    filters: effective,
    notes,
  };
}

function writeHasilMd(dump: RunDump): void {
  const lines: string[] = [];
  lines.push('# Hasil Automate Testing — ETM-15550');
  lines.push('');
  lines.push(`**Tanggal run:** ${new Date().toISOString()}`);
  lines.push(`**Environment:** ${dump.environment}`);
  lines.push(`**Company:** ${dump.company} (id ${dump.companyId})`);
  lines.push(
    `**Spec:** \`tests/specs/filter-field-sizing/etm-15550-filter-field-size.spec.ts\``,
  );
  lines.push(
    '**Perintah:** `OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/filter-field-sizing/etm-15550-filter-field-size.spec.ts -g "@ETM-15550"`',
  );
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Ringkasan');
  lines.push('');
  lines.push(
    `**${dump.verdict}.** PASS=${dump.summary.pass}, FAIL=${dump.summary.fail}, N/A=${dump.summary.na}, BLOCKED=${dump.summary.blocked}.`,
  );
  lines.push('');
  lines.push(
    `Kartu: [ETM-15550](https://erpintegration.atlassian.net/browse/ETM-15550)`,
  );
  lines.push('');
  lines.push('## Baseline');
  lines.push('');
  lines.push(
    `| Kontrol | Ukur (px) | Acuan kartu (Lumielle) |`,
  );
  lines.push(`|---|---|---|`);
  lines.push(
    `| Global Search | ${dump.baseline.globalSearch.width}×${dump.baseline.globalSearch.height} | tinggi **38** |`,
  );
  lines.push(
    `| Choose Store (Platform Product) | ${dump.baseline.chooseStore.width}×${dump.baseline.chooseStore.height} | lebar **539** |`,
  );
  lines.push(
    `| Tolerance | ±${dump.tolerancePx}px | |`,
  );
  lines.push('');
  lines.push('## Detail per halaman');
  lines.push('');
  lines.push('| Halaman | Path | Status | Filter (W×H) | Width OK | Height OK |');
  lines.push('|---|---|---|---|---|---|');

  for (const p of dump.pages) {
    if (p.status === 'N/A' || p.status === 'BLOCKED') {
      lines.push(
        `| ${p.menuLabel} | \`${p.path}\` | **${p.status}** | ${p.notes.join('; ') || '-'} | - | - |`,
      );
      continue;
    }
    const filterText = p.filters
      .map((f) => `${f.label}: ${f.size.found ? `${f.size.width}×${f.size.height}` : 'NOT FOUND'}`)
      .join('<br>');
    const wOk = p.filters.map((f) => (f.widthOk == null ? '-' : f.widthOk ? '✅' : '❌')).join(' ');
    const hOk = p.filters
      .map((f) => (f.heightOk == null ? '-' : f.heightOk ? '✅' : '❌'))
      .join(' ');
    lines.push(
      `| ${p.menuLabel} | \`${p.path}\` | **${p.status}** | ${filterText} | ${wOk} | ${hOk} |`,
    );
  }

  lines.push('');
  lines.push('## Catatan QA');
  lines.push('');
  for (const n of dump.notes) {
    lines.push(`- ${n}`);
  }
  for (const p of dump.pages) {
    for (const n of p.notes) {
      lines.push(`- **${p.id}:** ${n}`);
    }
  }
  lines.push(
    '- Expected kartu: tinggi filter = Global Search; lebar filter = Choose Store Platform Product.',
  );
  lines.push(
    '- Run di **DEV-STG (13)** sesuai instruksi user (kartu original pretest di Lumielle).',
  );
  lines.push('');
  lines.push('## Isi folder');
  lines.push('');
  lines.push('| File | Isi |');
  lines.push('|---|---|');
  lines.push('| `HASIL.md` | Ringkasan ini |');
  lines.push('| `measurements.json` | Metrik + verdict |');
  lines.push('| `screenshots/` | Screenshot tiap halaman |');

  fs.writeFileSync(path.join(ETM_15550_RESULTS_DIR, 'HASIL.md'), lines.join('\n'));
}
