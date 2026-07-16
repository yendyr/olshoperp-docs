import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { UNIT_DATALIST_PATH, UnitPage } from '../../helpers/unit';

/**
 * Unit (SCM Master) — create unit baru.
 * Company default: lumicharmsid (153)
 * Credentials: playwright@gmail.com
 */
test.describe('Unit — Create', () => {
  test('[@TC-UNIT-001] Create new unit BOX / Box Besar', async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: UNIT_DATALIST_PATH,
    });

    const unit = new UnitPage(page);

    // Prefer TC data; jika Code sudah ada, pakai suffix unik (izin ubah test data)
    let code = 'BOX';
    let name = 'Box Besar';

    if (await unit.isCodeVisibleInDatalist(code)) {
      const stamp = Date.now().toString().slice(-6);
      code = `BOX-AT-${stamp}`;
      name = `Box Besar ${stamp}`;
    }

    await unit.openCreateForm();
    await unit.fillForm({
      code,
      name,
      unitClass: 'Pieces',
      conversionRate: '1',
      description: 'Satuan untuk kardus besar isi produk',
    });
    await unit.clickSaveAndNextAndWaitForEdit();
    await unit.assertUnitInDatalist(code, name);
  });
});
