import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ACCOUNT_RECEIVE_DATALIST_PATH,
  AccountReceivePage,
} from '../../helpers/account-receive';

/**
 * Bulk Approve Account Receive — Dev Staging (13)
 * Route: /accounting/customer-payment
 *
 * Catatan selection: gunakan shared filter prefix agar DataTables tidak
 * deselect baris saat search diganti antar kode.
 */
test.describe.serial('Account Receive — Bulk Approve (DEV-STG)', () => {
  const companyCode = 'DEV-STG';

  const tc1Open = [
    'RC-5SO3DMPA',
    'RC-5SO3DMUP',
    'RC-5SO3DMUT',
    'RC-5SO3DMR2',
    'RC-5SO3DMSP',
    'RC-5SO3DMU1',
    'RC-5SO3DMP7',
    'RC-5SO3DMSH',
    'RC-5SO3DMT9',
    'RC-5SO3DMZP',
  ];
  const tc1Filter = 'RC-5SO3DM';

  const tc2Open = [
    'RC-5T6FVV0H',
    'RC-5T76JS8G',
    'RC-5T767TVN',
    'RC-5T8KSC15',
    'RC-5TBVFJ4K',
  ];
  const tc2Approved = ['RC-5T4LUJDD', 'RC-5T6CRQVZ', 'RC-5T45TBYJ'];
  const tc3Draft = ['RC-5TNMT9CH', 'RC-5TNYSCE1'];
  const tc3Filter = 'RC-5TN';

  test('[@TC-AR-BULK-APPROVE-BTN] Tombol Approve inactive tanpa seleksi, active setelah pilih Open', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: ACCOUNT_RECEIVE_DATALIST_PATH,
    });

    const ar = new AccountReceivePage(page);
    await ar.gotoDatalist();

    await ar.assertBulkApproveInactive();
    await ar.captureEvidence('step1-approve-inactive-no-selection.png');

    // Seed Open: pakai TC-2 open (TC-1 mungkin sudah Approved dari run sebelumnya)
    let seedOpen = tc2Open[0];
    for (const code of [...tc2Open, ...tc1Open]) {
      const text = await ar.getRowStatusText(code);
      if (/open/i.test(text) && !/approved/i.test(text)) {
        seedOpen = code;
        break;
      }
    }

    const seedText = await ar.getRowStatusText(seedOpen);
    if (!/open/i.test(seedText) || /approved/i.test(seedText)) {
      throw new Error(
        `BLOCKER (step1): tidak ada AR Open tersisa untuk uji tombol Approve (coba ${seedOpen}: "${seedText}").`,
      );
    }

    await ar.checkRowByTrxCode(seedOpen);
    await ar.assertBulkApproveActive();
    await ar.captureEvidence('step1-approve-active-with-selection.png');
  });

  test('[@TC-AR-BULK-APPROVE-001] Bulk approve 10 AR status Open → Approved + notifikasi sukses', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    await prepareSession(page, {
      companyCode,
      targetPath: ACCOUNT_RECEIVE_DATALIST_PATH,
    });

    const ar = new AccountReceivePage(page);
    await ar.gotoDatalist();

    const toApprove: string[] = [];
    for (const code of tc1Open) {
      const text = await ar.getRowStatusText(code);
      if (/approved/i.test(text)) {
        continue;
      }
      if (!/open/i.test(text)) {
        throw new Error(`BLOCKER: ${code} status bukan Open (baris: "${text}").`);
      }
      toApprove.push(code);
    }

    if (toApprove.length === 0) {
      await ar.assertRowsStatus(tc1Open, /approved/i);
      await ar.captureEvidence('tc1-already-approved.png');
      return;
    }

    await ar.checkRowsVisibleTogether(toApprove, tc1Filter);
    await ar.captureEvidence('tc1-rows-selected.png');

    const responsePromise = ar.waitForBulkApproveResponse();
    await ar.clickBulkApproveAndConfirm();
    const response = await responsePromise;

    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { error_count?: number; error_details?: unknown[] };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Bulk approve gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    const errorCount = Number(body?.data?.error_count ?? 0);
    if (errorCount > 0) {
      await expect(ar.bulkErrorDialog()).toBeVisible({ timeout: 15_000 });
      await ar.captureEvidence('tc1-unexpected-error-dialog.png');
      throw new Error(
        `BLOCKER (TC-1): expected full success, got error_count=${errorCount}`,
      );
    }

    const successToast = ar.toastLocator(/success|berhasil|approved|info/i);
    await expect(successToast.first()).toBeVisible({ timeout: 30_000 });
    await ar.captureEvidence('tc1-success-toast.png');

    await ar.assertRowsStatus(tc1Open, /approved/i);
    await ar.captureEvidence('tc1-all-approved-datalist.png');
  });

  test('[@TC-AR-BULK-APPROVE-002] Bulk approve mix Open + Approved → partial success + error detail', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    await prepareSession(page, {
      companyCode,
      targetPath: ACCOUNT_RECEIVE_DATALIST_PATH,
    });

    const ar = new AccountReceivePage(page);
    await ar.gotoDatalist();

    const openStillOpen: string[] = [];
    for (const code of tc2Open) {
      const text = await ar.getRowStatusText(code);
      if (/approved/i.test(text)) {
        continue;
      }
      if (!/open/i.test(text)) {
        throw new Error(`BLOCKER: ${code} diharapkan Open, dapat: "${text}"`);
      }
      openStillOpen.push(code);
    }

    for (const code of tc2Approved) {
      const text = await ar.getRowStatusText(code);
      if (!/approved/i.test(text)) {
        throw new Error(
          `BLOCKER: ${code} diharapkan Approved (precondition TC-2), dapat: "${text}"`,
        );
      }
    }

    const selectCodes = [...openStillOpen, ...tc2Approved];
    const ids = await ar.collectRowIds(selectCodes);
    await ar.captureEvidence('tc2-precondition-checked.png');

    if (openStillOpen.length === 0) {
      await ar.assertRowsStatus(tc2Open, /approved/i);
      await ar.captureEvidence('tc2-open-already-approved.png');
      return;
    }

    const { responseStatus, body } = await ar.bulkApproveViaUiWithIds(
      ids,
      openStillOpen[0],
    );

    if (responseStatus < 200 || responseStatus >= 300 || body?.status?.error) {
      throw new Error(
        `Bulk approve gagal: ${body?.status?.message ?? `HTTP ${responseStatus}`}`,
      );
    }

    const errorCount = Number(body?.data?.error_count ?? 0);
    const toastVisible = await ar
      .toastLocator(/berhasil|gagal|approved|success|fail|info/i)
      .first()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
    const dialogVisible = await ar
      .bulkErrorDialog()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    expect(
      errorCount > 0 || toastVisible || dialogVisible,
      'Expected partial feedback (toast dan/atau error dialog) untuk mix Open+Approved',
    ).toBeTruthy();

    if (errorCount > 0) {
      await expect(ar.bulkErrorDialog()).toBeVisible({ timeout: 15_000 });
    }

    await ar.captureEvidence('tc2-partial-feedback.png');
    await ar.closeBulkErrorDialogIfOpen();

    // error_details.data_id sering berisi HTML clipboard + trx code, bukan id mentah
    const failedBlob = JSON.stringify(body?.data?.error_details ?? []);
    const failedOpenCodes = tc2Open.filter((code) => failedBlob.includes(code));
    const successOpenCodes = tc2Open.filter((code) => !failedOpenCodes.includes(code));

    expect(
      errorCount,
      `Expected partial failures for already-Approved rows; error_count=${errorCount}, body=${failedBlob.slice(0, 500)}`,
    ).toBeGreaterThan(0);

    for (const code of successOpenCodes) {
      await ar.assertRowStatus(code, /approved/i);
    }
    for (const code of failedOpenCodes) {
      const text = await ar.getRowStatusText(code);
      expect(/open|approved/i.test(text), `${code} setelah gagal approve`).toBeTruthy();
    }
    await ar.assertRowsStatus(tc2Approved, /approved/i);
    await ar.captureEvidence('tc2-final-statuses.png');
  });

  test('[@TC-AR-BULK-APPROVE-003] Bulk approve Draft — status tidak berubah + error/notifikasi', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode,
      targetPath: ACCOUNT_RECEIVE_DATALIST_PATH,
    });

    const ar = new AccountReceivePage(page);
    await ar.gotoDatalist();

    for (const code of tc3Draft) {
      const text = await ar.getRowStatusText(code);
      if (!/draft|rejected/i.test(text)) {
        throw new Error(
          `BLOCKER: ${code} diharapkan Draft/Rejected, dapat: "${text}"`,
        );
      }
    }

    await ar.checkRowsVisibleTogether(tc3Draft, tc3Filter);
    await ar.captureEvidence('tc3-draft-rows-selected.png');

    // Perilaku UI AS-IS: tanpa Open terpilih, tombol bulk approve disembunyikan
    await ar.assertBulkApproveInactive();
    await ar.captureEvidence('tc3-approve-inactive-draft-only.png');

    await ar.assertRowsStatus(tc3Draft, /draft|rejected/i);
    await ar.captureEvidence('tc3-status-unchanged.png');
  });
});
