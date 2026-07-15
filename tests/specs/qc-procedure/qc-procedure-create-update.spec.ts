import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  QC_PROCEDURE_DATALIST_PATH,
  QcProcedurePage,
} from '../../helpers/qc-procedure';

/**
 * QC Procedure — create header lalu update + Procedure Detail.
 * Company: lumicharmsid (153)
 */
test.describe.serial('QC Procedure — Create then Update', () => {
  test.describe.configure({ timeout: 240_000 });

  let createdCode = '';
  let createdName = '';
  let updatedName = '';
  let activityName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: QC_PROCEDURE_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-qc-procedure] Create QC Procedure header', async ({
    page,
  }) => {
    const qc = new QcProcedurePage(page);
    const stamp = Date.now().toString().slice(-6);
    createdCode = `QCAT${stamp}`.slice(0, 15);
    createdName = `QC Auto ${stamp}`;

    await qc.gotoDatalist();
    await qc.openCreateForm();
    await qc.fillCreateForm({
      code: createdCode,
      name: createdName,
      description: `QC automation ${stamp}`,
    });
    await qc.clickSaveAndWaitForEdit();

    await expect(qc.codeInput).toHaveValue(createdCode, { timeout: 15_000 });
    await expect(qc.nameInput).toHaveValue(createdName, { timeout: 15_000 });
    await qc.assertInDatalist(createdCode);
  });

  test('[@TC-UPDATE-qc-procedure] Update header + Procedure Detail', async ({
    page,
  }) => {
    expect(createdCode, 'Harus ada code dari CREATE').toBeTruthy();

    const qc = new QcProcedurePage(page);
    await qc.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedName = `QC Upd ${stamp}`;
    activityName = `Vis check ${stamp}`.slice(0, 30);

    await qc.updateBasicFields({
      name: updatedName,
      description: `QC updated ${stamp}`,
    });
    await qc.clickSaveAllAndWait();
    await expect(qc.nameInput).toHaveValue(updatedName, { timeout: 15_000 });

    await qc.addProcedureActivity('1', activityName);
    await qc.assertDetailHasActivity(activityName);
  });
});
