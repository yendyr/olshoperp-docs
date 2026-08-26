import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ETM_8618_RESULTS_DIR,
  WAREHOUSE_STRUCTURE_DATALIST_PATH,
  WarehouseStructurePage,
} from '../../helpers/warehouse-structure';

/**
 * ETM-8618 — Prefix Type generator boleh berbeda di setiap level warehouse.
 *
 * Mapping kartu + TC komentar staging:
 * TC-01 Code >50 / spasi
 * TC-02 Name >150
 * TC-03 Type kosong
 * TC-04 Prefix duplikat identik
 * TC-05 Prefix duplikat beda kapital
 * TC-06 Prefix non-alphabet
 * TC-07 Prefix Type Numeric + Alphabet (inti kartu)
 * TC-08 2 Numeric + 1 prefix invalid
 *
 * Company: PT Huawei Tech Investment (915) — instruksi run.
 * Docs: qa-docs/supplychain-warehouse-structure/requirement.md V-07 (draft)
 */

const COMPANY = 'HUAWEI';

type AcResult = {
  id: string;
  title: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  detail: string;
};

type RunDump = {
  card: string;
  company: string;
  typeLabel: string | null;
  ac: AcResult[];
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

function writeDump(dump: RunDump): void {
  fs.mkdirSync(ETM_8618_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(ETM_8618_RESULTS_DIR, 'measurements.json'),
    JSON.stringify(dump, null, 2),
  );
}

function stamp(): string {
  return Date.now().toString().slice(-6);
}

test.describe.configure({ retries: 0 });

test.describe('ETM-8618 Warehouse Structure generator prefix per level', () => {
  const ac: AcResult[] = [];
  const notes: string[] = [];
  let typeLabel: string | null = null;
  let verdict: 'PASS' | 'FAIL' = 'FAIL';

  const dump = (): RunDump => ({
    card: 'ETM-8618',
    company: COMPANY,
    typeLabel,
    ac,
    verdict,
    notes,
  });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: WAREHOUSE_STRUCTURE_DATALIST_PATH,
    });
  });

  test.afterAll(() => {
    const failed = ac.filter((item) => item.status === 'FAIL');
    verdict = failed.length === 0 && ac.length > 0 ? 'PASS' : 'FAIL';
    writeDump(dump());
  });

  async function openCreate(page: import('@playwright/test').Page) {
    const wh = new WarehouseStructurePage(page);
    await wh.gotoDatalist();
    await wh.openCreateForm();
    return wh;
  }

  test('[@ETM-8618][@TC-01] Code >50 tanpa spasi, lalu code <50 pakai spasi ditolak', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = await openCreate(page);
    const longCode = `W${'X'.repeat(50)}`;
    await wh.codeInput.fill(longCode);
    await wh.nameInput.fill(`automation playwright ETM-8618 ${stamp()}`);
    typeLabel = await wh.firstTypeOptionLabel();
    notes.push(`Type Huawei: ${typeLabel}`);
    await wh.screenshot('01-tc01-code-over-50.png');
    const first = await wh.saveAndCapture();
    notes.push(`TC-01a: ok=${first.ok} msg=${first.message ?? '(none)'}`);

    const spaceCode = `WH ${stamp()}`;
    await wh.codeInput.fill(spaceCode);
    const second = await wh.saveAndCapture();
    notes.push(`TC-01b: ok=${second.ok} msg=${second.message ?? '(none)'}`);
    await wh.screenshot('02-tc01-code-space.png');

    const rejected = !first.ok && !second.ok;
    const spaceMsg = /space/i.test(`${second.message ?? ''}`);
    ac.push({
      id: 'TC-01',
      title: 'Code >50 tanpa spasi, lalu code <50 pakai spasi',
      status: rejected ? 'PASS' : 'FAIL',
      detail: `>50: ok=${first.ok} "${first.message}"; spasi: ok=${second.ok} "${second.message}" spaceMsg=${spaceMsg}`,
    });
    expect(rejected, 'Code invalid harus gagal disimpan').toBeTruthy();
  });

  test('[@ETM-8618][@TC-02] Name > 150 karakter ditolak', async ({ page }) => {
    test.setTimeout(180_000);
    const wh = await openCreate(page);
    await wh.codeInput.fill(`WH8618N${stamp()}`);
    await wh.nameInput.fill(`N${'a'.repeat(160)}`);
    if (!typeLabel) typeLabel = await wh.firstTypeOptionLabel();
    else await wh.selectType(typeLabel);
    const result = await wh.saveAndCapture();
    notes.push(`TC-02: ok=${result.ok} msg=${result.message ?? '(none)'}`);
    await wh.screenshot('03-tc02-name-over-150.png');
    ac.push({
      id: 'TC-02',
      title: 'Name > 150 karakter',
      status: result.ok ? 'FAIL' : 'PASS',
      detail: `ok=${result.ok} message=${result.message ?? '(none)'}`,
    });
    expect(result.ok, 'Name >150 harus ditolak').toBeFalsy();
  });

  test('[@ETM-8618][@TC-03] Type dibiarkan kosong ditolak', async ({ page }) => {
    test.setTimeout(180_000);
    const wh = await openCreate(page);
    await wh.codeInput.fill(`WH8618T${stamp()}`);
    await wh.nameInput.fill(`automation playwright ETM-8618 ${stamp()}`);
    const result = await wh.saveAndCapture();
    notes.push(`TC-03: ok=${result.ok} msg=${result.message ?? '(none)'}`);
    await wh.screenshot('04-tc03-type-empty.png');
    ac.push({
      id: 'TC-03',
      title: 'Type dibiarkan kosong',
      status: result.ok ? 'FAIL' : 'PASS',
      detail: `ok=${result.ok} message=${result.message ?? '(none)'}`,
    });
    expect(result.ok, 'Type kosong harus ditolak').toBeFalsy();
  });

  test('[@ETM-8618][@TC-04] Prefix duplikat sama persis ditolak', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = await openCreate(page);
    await fillHeader(wh);
    const opened = await wh.expandGenerator();
    if (!opened) {
      ac.push({
        id: 'TC-04',
        title: 'Prefix duplikat sama persis',
        status: 'SKIP',
        detail: 'Section Child Warehouse Generator tidak ketemu.',
      });
      notes.push('TC-04 SKIP: generator section tidak ketemu');
      test.skip(true, 'Generator section tidak tampil');
      return;
    }
    await wh.fillGeneratorRow(0, { prefixType: 'Numeric', prefix: 'ABCD', amount: '2' });
    await wh.fillGeneratorRow(1, { prefixType: 'Numeric', prefix: 'ABCD', amount: '2' });
    await wh.screenshot('05-tc04-prefix-duplicate.png');
    const result = await wh.saveAndCapture();
    notes.push(`TC-04: ok=${result.ok} msg=${result.message ?? '(none)'}`);
    const unique = /Prefix must be unique/i.test(`${result.message ?? ''}`);
    ac.push({
      id: 'TC-04',
      title: 'Prefix duplikat sama persis',
      status: !result.ok && unique ? 'PASS' : 'FAIL',
      detail: `ok=${result.ok} message=${result.message ?? '(none)'} uniqueMsg=${unique}`,
    });
    expect(result.ok, 'Prefix duplikat harus ditolak').toBeFalsy();
    expect(unique, 'Pesan Prefix must be unique').toBeTruthy();
  });

  test('[@ETM-8618][@TC-05] Prefix duplikat beda kapital ditolak', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = await openCreate(page);
    await fillHeader(wh);
    const opened = await wh.expandGenerator();
    if (!opened) {
      ac.push({
        id: 'TC-05',
        title: 'Prefix duplikat beda kapital',
        status: 'SKIP',
        detail: 'Section generator tidak ketemu.',
      });
      test.skip(true, 'Generator section tidak tampil');
      return;
    }
    await wh.fillGeneratorRow(0, { prefixType: 'Numeric', prefix: 'ABCD', amount: '2' });
    await wh.fillGeneratorRow(1, { prefixType: 'Alphabet', prefix: 'abcd', amount: '2' });
    await wh.screenshot('06-tc05-prefix-case.png');
    const result = await wh.saveAndCapture();
    notes.push(`TC-05: ok=${result.ok} msg=${result.message ?? '(none)'}`);
    ac.push({
      id: 'TC-05',
      title: 'Prefix duplikat beda kapital (ABCD vs abcd)',
      status: result.ok ? 'FAIL' : 'PASS',
      detail: `ok=${result.ok} message=${result.message ?? '(none)'}`,
    });
    expect(result.ok, 'Prefix unique tanpa bedakan kapital').toBeFalsy();
  });

  test('[@ETM-8618][@TC-06] Prefix non-alphabet ditolak', async ({ page }) => {
    test.setTimeout(240_000);
    const wh = await openCreate(page);
    await fillHeader(wh);
    const opened = await wh.expandGenerator();
    if (!opened) {
      ac.push({
        id: 'TC-06',
        title: 'Prefix non-alphabet',
        status: 'SKIP',
        detail: 'Section generator tidak ketemu.',
      });
      test.skip(true, 'Generator section tidak tampil');
      return;
    }
    await wh.fillGeneratorRow(0, { prefixType: 'Numeric', prefix: 'AB1', amount: '2' });
    await wh.screenshot('07-tc06-prefix-non-alpha.png');
    const result = await wh.saveAndCapture();
    notes.push(`TC-06: ok=${result.ok} msg=${result.message ?? '(none)'}`);
    const alphaMsg = /Prefix must be alphabet/i.test(`${result.message ?? ''}`);
    ac.push({
      id: 'TC-06',
      title: 'Prefix non-alphabet (huruf+angka)',
      status: !result.ok ? 'PASS' : 'FAIL',
      detail: `ok=${result.ok} message=${result.message ?? '(none)'} alphabetMsg=${alphaMsg}`,
    });
    expect(result.ok, 'Prefix non-alphabet harus ditolak').toBeFalsy();
  });

  test('[@ETM-8618][@TC-07] Prefix Type beda antar level (Numeric + Alphabet) save sukses', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const wh = await openCreate(page);
    await fillHeader(wh);
    const opened = await wh.expandGenerator();
    if (!opened) {
      ac.push({
        id: 'TC-07',
        title: 'Prefix Type Numeric + Alphabet',
        status: 'FAIL',
        detail: 'Section Child Warehouse Generator tidak ketemu — AC kartu tidak bisa diuji.',
      });
      await wh.screenshot('08-tc07-no-generator.png');
      expect(opened, 'Generator harus ada untuk AC ETM-8618').toBeTruthy();
      return;
    }
    await wh.fillGeneratorRow(0, { prefixType: 'Numeric', prefix: 'LT', amount: '2' });
    await wh.fillGeneratorRow(1, { prefixType: 'Alphabet', prefix: 'RK', amount: '2' });
    await wh.screenshot('09-tc07-mixed-prefix-type.png');
    const result = await wh.saveAndCapture();
    notes.push(`TC-07: ok=${result.ok} url=${page.url()} msg=${result.message ?? '(none)'}`);
    await wh.screenshot('10-tc07-after-save.png');
    ac.push({
      id: 'TC-07',
      title: 'Prefix Type beda antar level (Numeric + Alphabet)',
      status: result.ok ? 'PASS' : 'FAIL',
      detail: `ok=${result.ok} url=${page.url()} message=${result.message ?? '(none)'}`,
    });
    expect(result.ok, `TC-07 Save harus sukses: ${result.message}`).toBeTruthy();
  });

  test('[@ETM-8618][@TC-08] 2 baris Numeric, 1 baris prefix invalid ditolak', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = await openCreate(page);
    await fillHeader(wh);
    const opened = await wh.expandGenerator();
    if (!opened) {
      ac.push({
        id: 'TC-08',
        title: '2 Numeric + 1 prefix invalid',
        status: 'SKIP',
        detail: 'Section generator tidak ketemu.',
      });
      test.skip(true, 'Generator section tidak tampil');
      return;
    }
    await wh.fillGeneratorRow(0, { prefixType: 'Numeric', prefix: 'AA', amount: '2' });
    await wh.fillGeneratorRow(1, { prefixType: 'Numeric', prefix: 'BB', amount: '2' });
    await wh.fillGeneratorRow(2, { prefixType: 'Numeric', prefix: 'C1', amount: '2' });
    await wh.screenshot('11-tc08-one-invalid.png');
    const result = await wh.saveAndCapture();
    notes.push(`TC-08: ok=${result.ok} msg=${result.message ?? '(none)'}`);
    ac.push({
      id: 'TC-08',
      title: '2 baris Numeric, 1 baris prefix invalid',
      status: result.ok ? 'FAIL' : 'PASS',
      detail: `ok=${result.ok} message=${result.message ?? '(none)'}`,
    });
    expect(result.ok, 'Satu baris prefix invalid harus gagal seluruh save').toBeFalsy();
  });

  async function fillHeader(wh: WarehouseStructurePage): Promise<void> {
    await wh.codeInput.fill(`WH8618${stamp()}`);
    await wh.nameInput.fill(`automation playwright ETM-8618 ${stamp()}`);
    if (!typeLabel) {
      typeLabel = await wh.firstTypeOptionLabel();
    } else {
      await wh.selectType(typeLabel);
    }
    await wh.ensureActiveOn();
  }
});
