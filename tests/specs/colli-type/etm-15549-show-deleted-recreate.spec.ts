import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  COLLI_TYPE_DATALIST_PATH,
  ETM_15549_RESULTS_DIR,
  ColliTypePage,
  type DeletedRowState,
  type SaveResult,
} from '../../helpers/colli-type';

/**
 * ETM-15549 — Colli Type: Show deleted = already deleted;
 * recreate code yang sudah soft-delete (REOPEN).
 *
 * Mapping langkah kartu → POM (halaman /supplychain/colli-type):
 * 1. Buka Colli Type                              → gotoDatalist
 * 2. Create type unused (code unik)               → openCreateForm + fill + saveCreate
 * 3. Klik Delete baris → konfirmasi Are you sure? → softDeleteByCode
 * 4. Pastikan hilang dari list default            → setShowDeletedData(false) + search
 * 5. Centang Show deleted data                    → setShowDeletedData(true)
 * 6. Cari type terhapus, cek Action               → readDeletedRow
 * 7. Create ulang code+name yang sama             → openCreateForm + fill + saveCreate
 *
 * Company: PT Huawei Tech Investment (915 / HUAWEI)
 * Expected (kartu + REOPEN comment):
 *   AC-01 Soft delete unused sukses; Show deleted = already deleted (bukan link Deleted)
 *   AC-02 Create ulang data yang sama dengan type terhapus sukses (bukan Data conflict)
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
  menu: string;
  route: string;
  company: string;
  companyId: number;
  code: string;
  name: string;
  created: SaveResult | null;
  deleted: SaveResult | null;
  goneFromActive: boolean | null;
  deletedRow: DeletedRowState | null;
  recreate: SaveResult | null;
  ac: AcResult[];
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

function writeDump(dump: RunDump): void {
  fs.mkdirSync(ETM_15549_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(ETM_15549_RESULTS_DIR, 'measurements.json'),
    JSON.stringify(dump, null, 2),
  );
}

test.describe.configure({ retries: 0 });

test.describe.serial('ETM-15549 Colli Type Show deleted + recreate', () => {
  test('[@ETM-15549] [@TC-CT-009] Show deleted already deleted dan recreate code terhapus', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    fs.mkdirSync(path.join(ETM_15549_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });

    const stamp = Date.now().toString().slice(-6);
    const code = `CT-QA-15549-${stamp}`;
    const name = `QA ETM-15549 ${stamp}`;
    const notes: string[] = [];
    const ac: AcResult[] = [];

    const dump: RunDump = {
      card: 'ETM-15549',
      menu: 'Colli Type',
      route: COLLI_TYPE_DATALIST_PATH,
      company: 'PT Huawei Tech Investment',
      companyId: 915,
      code,
      name,
      created: null,
      deleted: null,
      goneFromActive: null,
      deletedRow: null,
      recreate: null,
      ac,
      verdict: 'FAIL',
      notes,
    };

    const colli = new ColliTypePage(page);

    try {
      await prepareSession(page, {
        companyCode: COMPANY,
        targetPath: COLLI_TYPE_DATALIST_PATH,
      });
      await colli.gotoDatalist();
      await colli.screenshot('01-datalist.png');

      await colli.openCreateForm();
      await colli.fillCreateForm({
        code,
        name,
        description: 'automation playwright',
      });
      dump.created = await colli.saveCreate();
      await colli.screenshot('02-created.png');

      if (!dump.created.ok) {
        notes.push(`Create awal gagal: ${dump.created.message}`);
        ac.push({
          id: 'AC-01',
          title: 'Soft delete unused + Show deleted = already deleted',
          status: 'FAIL',
          detail: `Tidak bisa create fixture ${code}: ${dump.created.message}`,
        });
        ac.push({
          id: 'AC-02',
          title: 'Create ulang code yang sudah soft-delete',
          status: 'SKIP',
          detail: 'Skip karena create awal gagal',
        });
        dump.verdict = 'FAIL';
        writeDump(dump);
        expect(dump.created.ok, `Create Colli Type ${code}: ${dump.created.message}`).toBe(
          true,
        );
        return;
      }

      dump.deleted = await colli.softDeleteByCode(code);
      await colli.gotoDatalist();
      await colli.setShowDeletedData(false);
      await colli.searchCode(code);
      dump.goneFromActive = !(await colli.isCodeVisible(code));
      await colli.screenshot('03-after-delete-active-list.png');

      dump.deletedRow = await colli.readDeletedRow(code);
      await colli.screenshot('04-show-deleted.png');

      const ac01Pass =
        Boolean(dump.deleted?.ok) &&
        dump.goneFromActive === true &&
        dump.deletedRow?.visible === true &&
        dump.deletedRow.hasAlreadyDeleted === true &&
        dump.deletedRow.hasDeletedLink === false;

      ac.push({
        id: 'AC-01',
        title: 'Soft delete unused + Show deleted = already deleted',
        status: ac01Pass ? 'PASS' : 'FAIL',
        detail: [
          `delete ok=${dump.deleted?.ok} toast="${dump.deleted?.toast ?? ''}"`,
          `hilang list default=${dump.goneFromActive}`,
          `show deleted visible=${dump.deletedRow?.visible}`,
          `already deleted=${dump.deletedRow?.hasAlreadyDeleted}`,
          `link Deleted=${dump.deletedRow?.hasDeletedLink} href=${dump.deletedRow?.deletedHref ?? '-'}`,
          `actionText=${JSON.stringify(dump.deletedRow?.actionText ?? '')}`,
        ].join(' | '),
      });

      await colli.gotoDatalist();
      await colli.setShowDeletedData(false);
      await colli.openCreateForm();
      await colli.fillCreateForm({
        code,
        name,
        description: 'automation playwright',
      });
      dump.recreate = await colli.saveCreate();
      await colli.screenshot('05-recreate.png');

      const conflict = /data conflict|already been taken/i.test(
        `${dump.recreate.message} ${dump.recreate.toast}`,
      );
      const ac02Pass = dump.recreate.ok && !conflict;

      ac.push({
        id: 'AC-02',
        title: 'Create ulang code yang sudah soft-delete',
        status: ac02Pass ? 'PASS' : 'FAIL',
        detail: `ok=${dump.recreate.ok} http=${dump.recreate.httpStatus} message="${dump.recreate.message}" toast="${dump.recreate.toast}" edit=${dump.recreate.editUrl ?? '-'}`,
      });

      dump.verdict = ac.every((item) => item.status === 'PASS') ? 'PASS' : 'FAIL';
      writeDump(dump);

      expect(ac01Pass, `AC-01 FAIL: ${ac[0]?.detail}`).toBe(true);
      expect(ac02Pass, `AC-02 FAIL: ${ac[1]?.detail}`).toBe(true);
    } catch (error) {
      notes.push(error instanceof Error ? error.message : String(error));
      dump.verdict = 'FAIL';
      writeDump(dump);
      throw error;
    }
  });
});
