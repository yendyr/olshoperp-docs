import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  JOURNAL_DATALIST_PATH,
  JournalPage,
} from '../../helpers/journal';

/**
 * One-shot: approve GL-5TVAETMA dari datalist depan.
 */
test.describe('Journal — Approve from datalist GL-5TVAETMA', () => {
  test.describe.configure({ timeout: 300_000 });

  const code = 'GL-5TVAETMA';

  test('approve GL-5TVAETMA dari datalist (action Approve)', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: JOURNAL_DATALIST_PATH,
    });

    const jrn = new JournalPage(page);
    const result = await jrn.approveFromDatalist(
      code,
      'automation playwright',
    );

    expect(
      /approved/i.test(result.statusText ?? ''),
      `Status row harus Approved. Got: ${result.statusText}`,
    ).toBeTruthy();

    // Simpan ringkasan di console untuk report
    console.log(
      JSON.stringify({
        code,
        message: result.message ?? null,
        statusSnippet: (result.statusText ?? '').slice(0, 200),
        result: 'PASS',
      }),
    );
  });
});
