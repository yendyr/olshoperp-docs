import { expect, Locator, Page } from '@playwright/test';

export function identifierPattern(identifier: string): RegExp {
  const escaped = identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Batas non-alphanumeric agar SKU1 tidak match SKU112 / SKU66200
  return new RegExp(`(?:^|[^A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, 'i');
}

export function rowMatchesIdentifier(rowText: string, identifier: string): boolean {
  const normalized = ` ${rowText.replace(/\s+/g, ' ')} `;
  return identifierPattern(identifier).test(normalized);
}

/**
 * Urutan identifier di tabel detail (atas → bawah) berdasarkan teks baris.
 * Match identifier terpanjang dulu agar SKU112 menang atas SKU1.
 */
export function extractIdentifierOrder(
  rowTexts: string[],
  identifiers: string[],
): string[] {
  const order: string[] = [];
  const sortedIds = [...identifiers].sort((a, b) => b.length - a.length);

  for (const rowText of rowTexts) {
    const match = sortedIds.find((id) => rowMatchesIdentifier(rowText, id));
    if (match && !order.includes(match)) {
      order.push(match);
    }
  }

  return order;
}

export async function getDetailDataRowTexts(section: Locator): Promise<string[]> {
  const rows = section.locator('tbody tr');
  const count = await rows.count();
  const texts: string[] = [];

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const text = ((await row.innerText().catch(() => '')) || '').trim();
    if (!text || /no data available/i.test(text)) {
      continue;
    }
    texts.push(text);
  }

  return texts;
}

export async function waitForIdentifierInSection(
  section: Locator,
  identifier: string,
  timeout = 90_000,
): Promise<void> {
  await expect
    .poll(
      async () => {
        const texts = await getDetailDataRowTexts(section);
        return texts.some((text) => rowMatchesIdentifier(text, identifier));
      },
      { timeout },
    )
    .toBe(true);
}

export async function waitForIdentifierCountInSection(
  section: Locator,
  identifiers: string[],
  timeout = 90_000,
): Promise<void> {
  await expect
    .poll(
      async () => {
        const texts = await getDetailDataRowTexts(section);
        const found = extractIdentifierOrder(texts, identifiers);
        return found.length;
      },
      { timeout },
    )
    .toBeGreaterThanOrEqual(identifiers.length);
}

export async function enableShowDeletedInSection(section: Locator): Promise<void> {
  const toggle = section
    .getByText('Show deleted data', { exact: true })
    .locator('xpath=ancestor::label[1]//input | preceding-sibling::input')
    .first()
    .or(section.locator('#prime-delete-switch'))
    .or(section.locator('input[type="checkbox"]').filter({ has: section.getByText('Show deleted data') }));

  const switchInput = section
    .locator('label')
    .filter({ hasText: 'Show deleted data' })
    .locator('input[type="checkbox"]')
    .first();

  if (await switchInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
    if (!(await switchInput.isChecked().catch(() => false))) {
      await switchInput.click({ force: true });
      await section.page().waitForTimeout(1_500);
    }
    return;
  }

  if (await toggle.isVisible({ timeout: 2_000 }).catch(() => false)) {
    if (!(await toggle.isChecked().catch(() => false))) {
      await toggle.click({ force: true });
      await section.page().waitForTimeout(1_500);
    }
  }
}

export async function selectAllDetailRows(section: Locator): Promise<void> {
  const headerCheckbox = section
    .locator('thead input[type="checkbox"], th .p-checkbox input, th input[type="checkbox"]')
    .first();

  if (await headerCheckbox.isVisible({ timeout: 3_000 }).catch(() => false)) {
    if (!(await headerCheckbox.isChecked().catch(() => false))) {
      await headerCheckbox.click({ force: true });
      await section.page().waitForTimeout(800);
    }
  }
}

export type DetailOrderAssertResult = {
  pass: boolean;
  expected: string[];
  actual: string[];
  lastAdded?: string;
  lastAddedIndex?: number;
};

/**
 * Expected order untuk ETM-15214 = last-in-first-row:
 * setelah menambah [A, B, C], tabel (atas→bawah) harus [C, B, A].
 */
export function expectedLastInFirstRowOrder(addedInSequence: string[]): string[] {
  return [...addedInSequence].reverse();
}

export function evaluateDetailOrder(
  rowTexts: string[],
  identifiersInAddOrder: string[],
): DetailOrderAssertResult {
  const expected = expectedLastInFirstRowOrder(identifiersInAddOrder);
  const actual = extractIdentifierOrder(rowTexts, identifiersInAddOrder);
  const lastAdded = identifiersInAddOrder[identifiersInAddOrder.length - 1];
  const lastAddedIndex = lastAdded ? actual.indexOf(lastAdded) : -1;

  return {
    pass:
      actual.length === expected.length &&
      actual.every((value, index) => value === expected[index]),
    expected,
    actual,
    lastAdded,
    lastAddedIndex: lastAddedIndex >= 0 ? lastAddedIndex : undefined,
  };
}

export async function assertDetailRowOrder(
  section: Locator,
  identifiersInAddOrder: string[],
  context: string,
): Promise<DetailOrderAssertResult> {
  const rowTexts = await getDetailDataRowTexts(section);
  const result = evaluateDetailOrder(rowTexts, identifiersInAddOrder);

  expect(
    result.actual,
    [
      `${context} — last-in-first-row`,
      `expected (atas→bawah): ${result.expected.join(' → ')}`,
      `actual (atas→bawah): ${result.actual.join(' → ') || '(kosong)'}`,
      `last added: ${result.lastAdded ?? '-'} @ index ${result.lastAddedIndex ?? 'n/a'} (0 = paling atas)`,
    ].join(' | '),
  ).toEqual(result.expected);

  return result;
}

/**
 * Pilih opsi multiselect dengan EXACT match pada kode/SKU (di elemen strong),
 * agar `SKU112` tidak salah pilih `SKU11238`.
 */
export async function pickMultiselectOptionExact(
  page: Page,
  combobox: Locator,
  identifier: string,
): Promise<void> {
  await expect(combobox).toBeVisible({ timeout: 30_000 });
  await combobox.click();
  await combobox.fill(identifier);
  await page.waitForTimeout(1_000);

  const options = page.locator('.multiselect-option:visible');
  await expect(options.first(), `Opsi multiselect "${identifier}" harus muncul`).toBeVisible({
    timeout: 20_000,
  });

  // 1) Exact match pada <strong> (option.sku / option.code)
  const exactStrong = options.filter({
    has: page.locator('strong', { hasText: new RegExp(`^\\s*${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i') }),
  });
  if (await exactStrong.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
    await exactStrong.first().click();
    await page.waitForTimeout(1_500);
    return;
  }

  // 2) Word-boundary match di teks opsi
  const boundary = options.filter({ hasText: identifierPattern(identifier) }).first();
  if (await boundary.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await boundary.click();
    await page.waitForTimeout(1_500);
    return;
  }

  // 3) Fallback: substring
  await options.filter({ hasText: identifier }).first().click();
  await page.waitForTimeout(1_500);
}

export async function selectFromSectionMultiselect(
  page: Page,
  section: Locator,
  searchTerm: string,
  placeholder: RegExp = /select product|select sales order/i,
): Promise<void> {
  const combobox = section
    .locator('.multiselect')
    .filter({ has: page.locator('[role="combobox"]') })
    .first()
    .getByRole('combobox')
    .or(section.getByRole('combobox').filter({ hasText: placeholder }).first())
    .or(section.locator('.multiselect').first().getByRole('combobox'));

  await pickMultiselectOptionExact(page, combobox, searchTerm);
}
