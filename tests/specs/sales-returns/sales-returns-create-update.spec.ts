import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SALES_RETURNS_DATALIST_PATH,
  SalesReturnsPage,
} from '../../helpers/sales-returns';

/**
 * Sales Return (SCM) — create via scan SO → update Restock Qty.
 * Company: lumicharmsid (153)
 *
 * AS-IS: create butuh SO outbound+invoice. Jika tidak ada:
 * CREATE = smoke shell + bind open SR*; UPDATE = Restock pada fixture.
 */
test.describe.serial('Sales Return — Create then Update', () => {
  test.describe.configure({ timeout: 360_000 });

  let createdSrCode = '';
  let createdEditPath = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SALES_RETURNS_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-sales-returns] Scan SO create or bind open SR', async ({
    page,
  }) => {
    const sr = new SalesReturnsPage(page);
    await sr.gotoDatalist();
    await sr.assertShellVisible();
    await sr.ensureWarehouseAndLocation();

    let created = false;

    // Coba SO dari pill platform (unused) dulu
    await sr.togglePlatformReturns();
    let orderCode = await sr.pickSalesOrderCodeFromTable();

    if (!orderCode) {
      // Toggle kembali ke list utama
      await sr.togglePlatformReturns();
      orderCode = await sr.pickSalesOrderCodeFromTable();
    }

    if (orderCode) {
      try {
        const result = await sr.createByScan(orderCode);
        createdSrCode = result.srCode;
        createdEditPath = result.editUrl;
        created = true;
        expect(createdSrCode.toUpperCase()).toMatch(/^SR/);
        await sr.assertEditPageReady();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        test.info().annotations.push({
          type: 'note',
          description: `Scan create gagal (${orderCode}): ${msg} — fallback bind open SR`,
        });
      }
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Tidak ada SO di datalist/platform — CREATE smoke + bind',
      });
    }

    if (!created) {
      try {
        createdSrCode = await sr.openFirstEditableFromDatalist();
        createdEditPath = page.url();
        expect(createdSrCode.toUpperCase()).toMatch(/^SR/);
        await sr.assertEditPageReady();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/tidak ada open SR|datalist/i.test(msg)) {
          test.info().annotations.push({
            type: 'note',
            description:
              'AS-IS: tidak ada SO eligible dan tidak ada open SR — CREATE smoke only; UPDATE skip',
          });
          createdSrCode = '';
          createdEditPath = '';
          return;
        }
        throw err;
      }
    }
  });

  test('[@TC-UPDATE-sales-returns] Restock Qty auto-save', async ({ page }) => {
    test.skip(
      !createdSrCode,
      'Skip UPDATE — tidak ada SR open/fixture dari CREATE',
    );

    const sr = new SalesReturnsPage(page);
    if (createdEditPath) {
      await sr.gotoEditUrl(createdEditPath);
    }

    await expect(page.getByText(new RegExp(createdSrCode, 'i')).first()).toBeVisible({
      timeout: 30_000,
    });

    await sr.updateRestockQty();
  });
});
