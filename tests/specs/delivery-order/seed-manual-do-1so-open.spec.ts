import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  OlshopDatalist,
  OlshopFormActions,
  OlshopMultiselect,
  waitForSuccessToast,
} from '../../helpers/shared';

/**
 * One-off seed: Delivery Order by Manual — 1 SO → status Open (lumicharmsid).
 * Precondition: packing complete for SO-5TU4KQUG / SO-5TU4LJIU / SO-5TU4UD5F.
 *
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   $env:NODE_OPTIONS="--max-old-space-size=4096"
 *   npx playwright test tests/specs/delivery-order/seed-manual-do-1so-open.spec.ts --project=authenticated --workers=1 --retries=0 --trace=off
 */

const DO_PATH = '/supplychain/delivery-order';
const DO_EDIT_PATTERN = /\/supplychain\/delivery-order\/edit\/\d+/;
const PREFERRED_SO = 'SO-5TU4KQUG';
const FALLBACK_SOS = ['SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;
const SHIPPER_EXACT = 'SHIPPER AUTOMATION';
const DESC = 'automation playwright';

async function waitLoadingGone(page: Page) {
  const loading = page.getByText('Loading...', { exact: true });
  await loading.waitFor({ state: 'hidden', timeout: 90_000 }).catch(() => undefined);
  await page
    .locator('.dt-processing, .dataTables_processing, .p-datatable-loading-overlay')
    .waitFor({ state: 'hidden', timeout: 30_000 })
    .catch(() => undefined);
}

function dtSearchInput(scope: Locator | Page): Locator {
  const root = 'page' in scope && typeof (scope as Page).locator === 'function'
    ? (scope as Page)
    : (scope as Locator);
  return root
    .locator(
      [
        '.dt-search input[type="search"]',
        '.dt-search input.dt-input',
        '.dataTables_filter input[type="search"]',
        'input[type="search"]',
      ].join(', '),
    )
    .or(root.getByRole('searchbox'))
    .first();
}

async function searchInScope(page: Page, scope: Locator | Page, query: string) {
  const input = dtSearchInput(scope);
  await expect(input).toBeVisible({ timeout: 60_000 });
  await input.fill('');
  await input.fill(query);
  await page.waitForTimeout(1_200);
  await waitLoadingGone(page);
}

async function selectShipper(page: Page, multiselect: OlshopMultiselect): Promise<string> {
  const combobox = multiselect.comboboxByAriaPlaceholder('e.g: Shopee Logistic');
  await expect(combobox, 'Shipper Name multiselect').toBeVisible({ timeout: 45_000 });

  // Exact first
  try {
    await multiselect.selectOption(combobox, SHIPPER_EXACT, {
      exact: true,
      typeToFilter: SHIPPER_EXACT,
    });
    const selected = await multiselect.selectedLabel(combobox);
    if (/shipper\s*automation/i.test(selected)) {
      return selected;
    }
  } catch {
    // fall through
  }

  // Case-insensitive / partial
  await multiselect.open(combobox);
  await combobox.fill('SHIPPER AUTOMATION').catch(async () => {
    await combobox.pressSequentially('SHIPPER AUTOMATION', { delay: 40 });
  });
  await page.waitForTimeout(800);

  const option = page
    .locator('.multiselect-option:visible')
    .filter({ hasText: /shipper\s*automation/i })
    .filter({ hasNotText: 'No results found' })
    .first();

  await expect(
    option,
    'Shipper option matching SHIPPER AUTOMATION harus ada',
  ).toBeVisible({ timeout: 25_000 });

  const label = ((await option.textContent()) ?? '').trim();
  await option.click();
  await page.waitForTimeout(500);
  return label || (await multiselect.selectedLabel(combobox));
}

async function fillDescription(page: Page) {
  const basic = page.locator('#BasicInformation').first();
  const textarea = basic
    .locator('textarea')
    .filter({ hasNot: page.locator('[disabled]') })
    .first()
    .or(basic.locator('textarea').first());
  await expect(textarea).toBeVisible({ timeout: 20_000 });
  await textarea.fill(DESC);
}

function useButton(scope: Page | Locator): Locator {
  return scope
    .locator('button[class*="use-button"]')
    .or(scope.getByRole('button', { name: /^Use$/i }))
    .or(scope.locator('button.tooltip-use'))
    .or(scope.locator('button[id^="useButton"]'));
}

/** Panel Available DO: kolom Action bisa ter-clip. Jangan scroll jika sudah visible. */
async function revealAndClickUse(page: Page, useBtn: Locator) {
  const alreadyVisible = await useBtn.isVisible().catch(() => false);

  if (!alreadyVisible) {
    await useBtn.evaluate((el) => {
      el.scrollIntoView({ block: 'nearest', inline: 'end' });
      let parent: HTMLElement | null = el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowX = style.overflowX;
        if (
          (overflowX === 'auto' || overflowX === 'scroll') &&
          parent.scrollWidth > parent.clientWidth + 2
        ) {
          const btnRect = el.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();
          if (btnRect.right > parentRect.right) {
            parent.scrollLeft += btnRect.right - parentRect.right + 16;
          }
        }
        parent = parent.parentElement;
      }
    });
    await page.waitForTimeout(400);
  }

  if (await useBtn.isVisible().catch(() => false)) {
    await useBtn.click({ timeout: 10_000 });
    return;
  }

  // Fallback: native DOM click untuk tombol yang masih clipped
  await useBtn.evaluate((el: HTMLElement) => {
    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        buttons: 1,
      }),
    );
  });
}

function isUseSoApi(url: string): boolean {
  return (
    /create-sales-order-group|bulk-use-sales-order/i.test(url) ||
    (/delivery-order-detail/i.test(url) &&
      /create-sales-order|sales-order-group/i.test(url))
  );
}

async function openAvailableToDo(page: Page) {
  const link = page.getByText('Available to Delivery Order', { exact: true });
  await expect(link).toBeVisible({ timeout: 60_000 });
  await link.click();
  await page.waitForTimeout(800);

  await expect(
    page.getByRole('link', { name: /SO-/i }).first(),
    'Available DO harus menampilkan SO',
  ).toBeVisible({ timeout: 90_000 });

  await expect(
    useButton(page).first(),
    'Available DO modal harus punya tombol Use di DOM',
  ).toBeAttached({ timeout: 60_000 });
  await waitLoadingGone(page);
}

async function useOneSo(page: Page): Promise<string> {
  const preferred = [PREFERRED_SO, ...FALLBACK_SOS];

  for (const soCode of preferred) {
    const searchBoxes = page.locator(
      [
        '.dt-search input[type="search"]',
        '.dataTables_filter input[type="search"]',
        'input[type="search"]',
      ].join(', '),
    );
    const modalSearch = searchBoxes.last();
    if (await modalSearch.isVisible().catch(() => false)) {
      await modalSearch.fill('');
      await modalSearch.fill(soCode);
      await page.waitForTimeout(1_500);
      await waitLoadingGone(page);
    }

    const row = page.getByRole('row').filter({ hasText: soCode }).first();
    const visible = await row.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!visible) continue;

    const useBtn = row.locator('button[class*="use-button"]').first();
    await expect(useBtn, `Tombol Use untuk ${soCode}`).toBeAttached({
      timeout: 15_000,
    });

    const useResponse = page.waitForResponse(
      (res) => isUseSoApi(res.url()) && res.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await revealAndClickUse(page, useBtn);
    const res = await useResponse;
    expect(res.ok(), `Use ${soCode} API harus OK`).toBeTruthy();
    await waitForSuccessToast(page, 15_000).catch(() => undefined);
    await page.waitForTimeout(1_000);
    return soCode;
  }

  const anyUse = page.locator('button[class*="use-button"]').first();
  await expect(anyUse, 'Minimal 1 SO Available to Delivery Order').toBeAttached({
    timeout: 15_000,
  });
  const rowText =
    (await anyUse.locator('xpath=ancestor::tr[1]').textContent()) ?? '';
  const soMatch = rowText.match(/SO-[A-Z0-9]+/i);
  const soCode = soMatch ? soMatch[0].toUpperCase() : 'UNKNOWN';

  const useResponse = page.waitForResponse(
    (res) => isUseSoApi(res.url()) && res.request().method() === 'POST',
    { timeout: 90_000 },
  );
  await revealAndClickUse(page, anyUse);
  const res = await useResponse;
  expect(res.ok(), `Use ${soCode} API harus OK`).toBeTruthy();
  await waitForSuccessToast(page, 15_000).catch(() => undefined);
  return soCode;
}

async function closeAvailablePanel(page: Page) {
  const link = page.getByText('Available to Delivery Order', { exact: true });
  if (await link.isVisible().catch(() => false)) {
    await link.click();
    await page.waitForTimeout(500);
  }
  // Escape fallback
  await page.keyboard.press('Escape').catch(() => undefined);
}

async function setStatusOpen(page: Page) {
  const openRadio = page.locator('#open');
  await expect(openRadio).toBeVisible({ timeout: 30_000 });
  await expect(openRadio).toBeEnabled({ timeout: 15_000 });

  if (await openRadio.isChecked().catch(() => false)) {
    return;
  }

  const updateResponse = page
    .waitForResponse(
      (res) =>
        /\/supplychain\/delivery-order\/\d+/.test(res.url()) &&
        !res.url().includes('delivery-order-detail') &&
        !res.url().includes('select2') &&
        res.request().method() === 'POST',
      { timeout: 90_000 },
    )
    .catch(() => null);

  await openRadio.click({ force: true });
  await updateResponse;
  await waitForSuccessToast(page, 15_000).catch(() => undefined);
  await expect(openRadio).toBeChecked({ timeout: 20_000 });
  await page.waitForTimeout(1_000);
}

test.describe.serial('Seed Delivery Order Manual — 1 SO Open', () => {
  test('[@SEED-DO-MANUAL] Create DO by Manual → Use 1 SO → Open — lumicharmsid', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    const datalist = new OlshopDatalist(page);
    const form = new OlshopFormActions(page);
    const multiselect = new OlshopMultiselect(page);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: DO_PATH,
    });
    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });

    // 1–2. Open Delivery Order → Create
    await datalist.clickCreate('link');
    await page.waitForURL(/\/supplychain\/delivery-order\/create/, {
      timeout: 60_000,
    });
    await expect(
      page.getByRole('button', { name: /Basic Inform/i }).first(),
    ).toBeVisible({ timeout: 45_000 });

    // 3. Shipper Name
    const shipperSelected = await selectShipper(page, multiselect);
    expect(shipperSelected, 'Shipper harus terpilih').toMatch(/automation/i);

    await fillDescription(page);

    // 4. Save & Next
    const createPost = page.waitForResponse((res) => {
      const u = res.url();
      return (
        /\/supplychain\/delivery-order(?:\?|$)/.test(u) &&
        !u.includes('/edit/') &&
        !u.includes('select2') &&
        !u.includes('delivery-order-detail') &&
        res.request().method() === 'POST'
      );
    }, { timeout: 120_000 });

    await form.clickSaveAndNext();
    const created = await createPost;
    expect(created.ok(), 'Create Delivery Order API harus OK').toBeTruthy();
    await page.waitForURL(DO_EDIT_PATTERN, { timeout: 90_000 });
    await waitForSuccessToast(page, 10_000).catch(() => undefined);

    // 5. Capture Transaction Code
    const codeInput = page.locator('#code').or(
      page.getByPlaceholder('Automatically generate by system'),
    );
    await expect(codeInput.first()).toBeVisible({ timeout: 30_000 });
    await expect(codeInput.first()).not.toHaveValue('', { timeout: 30_000 });
    const trxCode = (await codeInput.first().inputValue()).trim();
    expect(trxCode.length, 'Transaction Code auto-generate').toBeGreaterThan(3);

    // Ensure detail section visible
    const detailBtn = page.getByRole('button', {
      name: /Delivery Order Detail/i,
    });
    if (await detailBtn.first().isVisible().catch(() => false)) {
      if ((await detailBtn.first().getAttribute('aria-expanded')) !== 'true') {
        await detailBtn.first().click();
        await page.waitForTimeout(700);
      }
    }

    // 6–7. Available to Delivery Order → Use 1 SO
    await openAvailableToDo(page);
    const usedSo = await useOneSo(page);
    await closeAvailablePanel(page);

    // Detail harus berisi SO yang di-Use (best-effort)
    await page.waitForTimeout(1_000);
    await waitLoadingGone(page);

    // 8. Radio Open
    await setStatusOpen(page);

    // 9–11. Datalist search by trx code → Trx Status Open
    await page.goto(DO_PATH, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitLoadingGone(page);

    await searchInScope(page, page, trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row, `DO ${trxCode} harus muncul di datalist`).toBeVisible({
      timeout: 45_000,
    });

    const rowText = ((await row.textContent()) ?? '').replace(/\s+/g, ' ');
    expect(
      rowText,
      `Trx Status harus Open untuk ${trxCode}. Row: ${rowText}`,
    ).toMatch(/\bOpen\b/i);

    // Report ke console untuk agent summary
    console.log(
      JSON.stringify(
        {
          menu_route: DO_PATH,
          trx_code: trxCode,
          so_used: usedSo,
          shipper: shipperSelected,
          trx_status: 'Open',
          preferred_so_available: usedSo === PREFERRED_SO,
        },
        null,
        2,
      ),
    );
  });
});
