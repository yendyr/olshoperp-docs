import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ETM_15556_RESULTS_DIR,
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
  type DefaultVariantInfo,
} from '../../helpers/system-product';

/**
 * ETM-15556 / TC-SYSPROD-006 — Import New Product
 * Single-eligible + Default ON → parent {sku}-(PARENT) + child = SKU file
 *
 * Mapping langkah kartu → POM:
 * 1. Import → New Product; 1 row SKU + wajib; Variant Type/Option kosong
 *    → importNewProductFile (file dari download-template)
 * 2. SKU bukan Parent di row lain; Submit; progress + import log
 *    → waitForImportProgress
 * 3. Datalist + edit: parent SKU, child SKU, Enable Variations, Default group
 *    → searchDatalist + openCreateOrEditBySku + isVariationsEnabled
 *
 * Company: DEV-STG (13)
 * Expected: qa-docs/system-product/requirement.md §6.3.1 Import create V-03
 */

const COMPANY = 'DEV-STG';
const SALES_CATEGORY = 'Hobbies & Collections';
const PRODUCT_COA_GROUP = 'Purchased Item';
const PRODUCT_CONDITION = 'Brand New';
const PRIMARY_UNIT = 'Pieces';

type AcResult = {
  id: string;
  title: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  detail: string;
};

type RunDump = {
  card: string;
  tc: string;
  menu: string;
  route: string;
  company: string;
  sku: string;
  parentSku: string;
  defaultVariant: DefaultVariantInfo | null;
  templateHeaders: string[];
  importRow: string[];
  importFile: string | null;
  importHttp: { status: number; message: string } | null;
  progress: unknown;
  datalistParent: boolean;
  datalistChild: boolean;
  parentFormSku: string | null;
  variationsOn: boolean | null;
  variantType: string | null;
  parentEditUrl: string | null;
  ac: AcResult[];
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

function stampSku(): string {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14);
  return `ETM15556-IN-${stamp}`;
}

function writeDump(dump: RunDump): void {
  fs.mkdirSync(ETM_15556_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(ETM_15556_RESULTS_DIR, 'measurements.json'),
    JSON.stringify(dump, null, 2),
  );
}

test.describe.configure({ retries: 0 });

test.describe.serial('ETM-15556 System Product Import New Default ON', () => {
  test('[@TC-SYSPROD-006][@ETM-15556] Import New Single-eligible Default ON → parent -(PARENT) + child = SKU file', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    fs.mkdirSync(path.join(ETM_15556_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });
    fs.mkdirSync(path.join(ETM_15556_RESULTS_DIR, 'fixtures'), {
      recursive: true,
    });

    const sku = stampSku();
    const parentSku = `${sku}-(PARENT)`;
    const notes: string[] = [];
    const sp = new SystemProductPage(page);

    const dump: RunDump = {
      card: 'ETM-15556',
      tc: 'TC-SYSPROD-006',
      menu: 'System Product',
      route: SYSTEM_PRODUCT_DATALIST_PATH,
      company: COMPANY,
      sku,
      parentSku,
      defaultVariant: null,
      templateHeaders: [],
      importRow: [],
      importFile: null,
      importHttp: null,
      progress: null,
      datalistParent: false,
      datalistChild: false,
      parentFormSku: null,
      variationsOn: null,
      variantType: null,
      parentEditUrl: null,
      ac: [],
      verdict: 'FAIL',
      notes,
    };

    try {
      await prepareSession(page, {
        companyCode: COMPANY,
        targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
      });
      await sp.gotoDatalist();
      await sp.screenshot('01-datalist.png');

      dump.defaultVariant = await sp.findDefaultVariantInCompany();
      if (!dump.defaultVariant) {
        notes.push(
          'Precondition Master Default ON tidak ketemu di API /supplychain/variant (GAP-VAR-01 / ETM-15511).',
        );
      } else {
        notes.push(
          `Default Variant: ${dump.defaultVariant.name || dump.defaultVariant.code} / opsi ${dump.defaultVariant.option || '(tidak terbaca)'}`,
        );
      }

      const templatePath = path.join(
        ETM_15556_RESULTS_DIR,
        'fixtures',
        'template-new-product.xlsx',
      );
      dump.templateHeaders = await sp.downloadNewProductTemplate(templatePath);
      notes.push(`Header template: ${dump.templateHeaders.join(' | ')}`);

      const importPath = path.join(
        ETM_15556_RESULTS_DIR,
        'fixtures',
        `${sku}.xlsx`,
      );
      dump.importRow = sp.buildSingleEligibleImportFile(
        dump.templateHeaders,
        {
          sku,
          name: `ETM-15556 Import New ${sku}`,
          salesCategory: SALES_CATEGORY,
          productCoaGroup: PRODUCT_COA_GROUP,
          condition: PRODUCT_CONDITION,
          primaryUnit: PRIMARY_UNIT,
        },
        importPath,
      );
      dump.importFile = importPath;

      dump.importHttp = await sp.importNewProductFile(importPath);
      await sp.screenshot('02-after-import-submit.png');
      notes.push(
        `Import HTTP ${dump.importHttp.status}: ${dump.importHttp.message}`,
      );

      const progress = await sp.waitForImportProgress(180_000);
      dump.progress = progress.raw;
      notes.push(`Import progress done=${progress.done}`);
      await sp.screenshot('03-import-progress.png');

      await sp.gotoDatalist();
      await sp.searchDatalist(sku);
      dump.datalistParent = await sp
        .areSkusVisibleInDatalist([parentSku])
        .catch(() => false);
      dump.datalistChild = await sp
        .areSkusVisibleInDatalist([sku])
        .catch(() => false);
      await sp.screenshot('04-datalist-after-import.png');

      if (dump.datalistParent) {
        const mode = await sp.openCreateOrEditBySku(parentSku);
        notes.push(`Open parent mode=${mode}`);
        dump.parentEditUrl = page.url();
        dump.parentFormSku = await sp.readSkuValue();
        dump.variationsOn = await sp.isVariationsEnabled();
        dump.variantType = await sp.readSelectedVariantType();
        await sp.screenshot('05-parent-edit.png');
      } else if (dump.datalistChild) {
        const mode = await sp.openCreateOrEditBySku(sku);
        notes.push(`Parent -(PARENT) tidak ada; open child/single mode=${mode}`);
        dump.parentEditUrl = page.url();
        dump.parentFormSku = await sp.readSkuValue();
        dump.variationsOn = await sp.isVariationsEnabled();
        dump.variantType = await sp.readSelectedVariantType();
        await sp.screenshot('05-child-or-single-edit.png');
      }

      dump.ac = [
        {
          id: 'AC-01',
          title: 'Import New sukses (bukan blank / ditolak karena Default)',
          status:
            dump.importHttp.status >= 200 && dump.importHttp.status < 400
              ? 'PASS'
              : 'FAIL',
          detail: dump.importHttp.message,
        },
        {
          id: 'AC-02',
          title: `Parent = ${parentSku}`,
          status: dump.datalistParent ? 'PASS' : 'FAIL',
          detail: dump.datalistParent
            ? `Parent tampil di datalist`
            : `Parent ${parentSku} tidak tampil di datalist`,
        },
        {
          id: 'AC-03',
          title: `Child = ${sku} tanpa suffix opsi Default`,
          status: dump.datalistChild ? 'PASS' : 'FAIL',
          detail: dump.datalistChild
            ? 'Child SKU file tampil di datalist'
            : `Child ${sku} tidak tampil di datalist`,
        },
        {
          id: 'AC-04',
          title: 'Enable Variations ON + Default group terpasang',
          status:
            dump.variationsOn && dump.variantType
              ? 'PASS'
              : dump.variationsOn
                ? 'FAIL'
                : 'FAIL',
          detail: `variationsOn=${dump.variationsOn} variantType=${dump.variantType ?? '(kosong)'} formSku=${dump.parentFormSku ?? '(tidak dibuka)'}`,
        },
      ];

      dump.verdict = dump.ac.every((item) => item.status === 'PASS')
        ? 'PASS'
        : 'FAIL';
      writeDump(dump);

      expect(
        dump.defaultVariant,
        'Precondition: Master Variant Default ON harus ada di DEV-STG',
      ).not.toBeNull();
      expect(dump.importHttp, 'Response import-excel harus ada').toBeTruthy();
      expect(
        dump.importHttp?.status,
        dump.importHttp?.message,
      ).toBeGreaterThanOrEqual(200);
      expect(
        dump.importHttp?.status,
        dump.importHttp?.message,
      ).toBeLessThan(400);
      expect(dump.datalistParent, `Parent ${parentSku} harus ada`).toBe(true);
      expect(dump.datalistChild, `Child ${sku} harus ada`).toBe(true);
      expect(dump.variationsOn, 'Enable Variations harus ON di parent').toBe(
        true,
      );
      expect(
        dump.variantType,
        'Default group harus terpasang di parent',
      ).toBeTruthy();
    } catch (error) {
      dump.notes.push(error instanceof Error ? error.message : String(error));
      dump.verdict = 'FAIL';
      writeDump(dump);
      await sp.screenshot('99-failure.png').catch(() => undefined);
      throw error;
    }
  });
});
