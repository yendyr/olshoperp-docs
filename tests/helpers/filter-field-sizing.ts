import fs from 'fs';
import path from 'path';
import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './shared/staging-banner';

export const ETM_15550_RESULTS_DIR = path.join(
  process.cwd(),
  'Automate Testing Card QA Review',
  'ETM-15550',
);

export const PLATFORM_PRODUCT_PATH = '/omni/platform-product';

/** Toleransi px untuk rounding bounding box. */
export const SIZE_TOLERANCE_PX = 2;

export type BoxSize = {
  width: number;
  height: number;
  found: boolean;
  selectorHint: string;
};

export type PageFilterTarget = {
  id: string;
  path: string;
  menuLabel: string;
  /** Label UI filter di toolbar (bukan Advanced Filter). Kosong = ukur semua filter toolbar. */
  filterLabels: string[];
  /** true jika kartu menyebut N/A (hanya Global Search). */
  expectNoFilter?: boolean;
};

/**
 * 15 URL dari ETM-15550 (baseline Choose Store + Global Search di Platform Product).
 */
export const ETM_15550_PAGES: PageFilterTarget[] = [
  {
    id: 'pricelist',
    path: '/businessdevelopment/pricelist',
    menuLabel: 'Pricelist Product',
    filterLabels: ['Select Pricelist Category', 'Choose Pricelist Category'],
  },
  {
    id: 'settlement-upload',
    path: '/accounting/settlement-upload',
    menuLabel: 'Instant Settlement',
    filterLabels: ['Choose Store'],
  },
  {
    id: 'waves-management',
    path: '/omni/waves-management',
    menuLabel: 'Waves Management',
    filterLabels: ['Choose warehouse', 'Choose Warehouse'],
  },
  {
    id: 'stock-monitoring',
    path: '/supplychain/stock-monitoring',
    menuLabel: 'Stock Monitoring',
    filterLabels: ['Choose Warehouse'],
  },
  {
    id: 'product-mutation',
    path: '/supplychain/product-mutation',
    menuLabel: 'Product Mutation History',
    filterLabels: ['Choose Product'],
  },
  {
    id: 'stock-history',
    path: '/supplychain/stock-history',
    menuLabel: 'Stock History',
    filterLabels: [],
  },
  {
    id: 'real-stock',
    path: '/supplychain/real-stock',
    menuLabel: 'Real Time Stock',
    filterLabels: ['Show data as', 'Show Data As'],
  },
  {
    id: 'org-structure',
    path: '/hr/org-structure',
    menuLabel: 'Department Structure',
    filterLabels: [],
  },
  {
    id: 'attendance-calculated',
    path: '/hr/attendance-calculated',
    menuLabel: 'Attendance List',
    filterLabels: ['Choose Date'],
  },
  {
    id: 'platform-product',
    path: '/omni/platform-product',
    menuLabel: 'Platform Product',
    filterLabels: ['Choose Store'],
  },
  {
    id: 'settlement-mapping',
    path: '/accounting/settlement-mapping',
    menuLabel: 'Settlement Mapping',
    filterLabels: ['Choose COA', 'Choose Value Type'],
  },
  {
    id: 'general-ledger',
    path: '/accounting/general-ledger',
    menuLabel: 'General Ledger',
    filterLabels: [],
    expectNoFilter: true,
  },
  {
    id: 'profit-loss',
    path: '/accounting/profit-loss',
    menuLabel: 'Profit Loss',
    filterLabels: [],
  },
  {
    id: 'trial-balance',
    path: '/accounting/trial-balance',
    menuLabel: 'Trial Balance',
    filterLabels: [],
  },
  {
    id: 'balance-sheet',
    path: '/accounting/balance-sheet',
    menuLabel: 'Balance Sheet',
    filterLabels: [],
  },
];

/**
 * Helper ukur field filtering toolbar vs baseline Platform Product.
 * Selector diverifikasi dari run staging (sibling FE tidak ada di mesin).
 */
export class FilterFieldSizingPage {
  constructor(private readonly page: Page) {}

  globalSearch(): Locator {
    return this.page
      .getByPlaceholder(/find something/i)
      .or(this.page.getByRole('searchbox'))
      .first();
  }

  async gotoPath(routePath: string): Promise<void> {
    await this.page.goto(routePath, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async measureLocator(locator: Locator, hint: string): Promise<BoxSize> {
    if (!(await locator.isVisible({ timeout: 8_000 }).catch(() => false))) {
      return { width: 0, height: 0, found: false, selectorHint: hint };
    }
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);

    // Ukur root kontrol (multiselect / datepicker), bukan input search dalamnya.
    const root = locator
      .locator(
        'xpath=ancestor-or-self::*[contains(@class,"multiselect") or contains(@class,"p-datepicker") or contains(@class,"p-calendar")][1]',
      )
      .or(locator)
      .first();

    const box = await root.boundingBox().catch(() => null);
    if (!box) {
      return { width: 0, height: 0, found: false, selectorHint: hint };
    }
    return {
      width: Math.round(box.width),
      height: Math.round(box.height),
      found: true,
      selectorHint: hint,
    };
  }

  async measureGlobalSearch(): Promise<BoxSize> {
    return this.measureLocator(this.globalSearch(), 'global-search');
  }

  /**
   * Cari kontrol filter di toolbar/filter bar berdasarkan placeholder / teks label.
   */
  async measureNamedFilter(label: string): Promise<BoxSize> {
    const candidates: Array<{ loc: Locator; hint: string }> = [
      {
        loc: this.page.locator(`[aria-placeholder="${label}"]`).first(),
        hint: `aria-placeholder="${label}"`,
      },
      {
        loc: this.page.locator(`[placeholder="${label}"]`).first(),
        hint: `placeholder="${label}"`,
      },
      {
        loc: this.page
          .locator('.multiselect')
          .filter({ has: this.page.locator(`[aria-placeholder*="${label}" i]`) })
          .first(),
        hint: `.multiselect[aria~="${label}"]`,
      },
      {
        loc: this.page
          .locator('.multiselect')
          .filter({ hasText: new RegExp(label, 'i') })
          .first(),
        hint: `.multiselect:has-text(${label})`,
      },
      {
        loc: this.page
          .locator('.multiselect, .p-multiselect, [class*="multiselect"]')
          .filter({ hasText: new RegExp(label, 'i') })
          .first(),
        hint: `multiselect:has-text(${label})`,
      },
      {
        loc: this.page
          .locator('.p-datepicker, .p-calendar, [class*="datepicker"]')
          .filter({ has: this.page.getByPlaceholder(new RegExp(label, 'i')) })
          .first(),
        hint: `datepicker:${label}`,
      },
      {
        loc: this.page
          .getByPlaceholder(new RegExp(label.replace(/\s+/g, '.*'), 'i'))
          .first(),
        hint: `getByPlaceholder(~${label})`,
      },
      {
        loc: this.page
          .getByText(label, { exact: true })
          .locator(
            'xpath=following::*[contains(@class,"multiselect") or contains(@class,"p-datepicker") or self::input][1]',
          )
          .first(),
        hint: `following-sibling-control:${label}`,
      },
      {
        loc: this.page
          .locator('div.flex, div.grid, .toolbar, [class*="filter"]')
          .filter({ hasText: new RegExp(label, 'i') })
          .locator('.multiselect, .p-datepicker, input')
          .first(),
        hint: `toolbar-row:${label}`,
      },
      {
        loc: this.page
          .locator('div, span, label')
          .filter({ hasText: new RegExp(`^${label}$`, 'i') })
          .first()
          .locator(
            'xpath=ancestor::*[contains(@class,"flex") or contains(@class,"grid")][1]//*[contains(@class,"multiselect") or contains(@class,"p-datepicker") or self::input][1]',
          )
          .first(),
        hint: `nearby:${label}`,
      },
    ];

    // Prefer kandidat lebar masuk akal (>= 200) bila ada; tetap terima kontrol sempit (mis. Value Type)
    let best: BoxSize | null = null;
    for (const { loc, hint } of candidates) {
      const size = await this.measureLocator(loc, hint);
      if (!size.found || size.height < 20 || size.width < 40) continue;
      if (!best || size.width > best.width) {
        best = size;
      }
      if (size.width >= 200 && size.height >= 30) {
        return size;
      }
    }
    if (best) return best;

    return { width: 0, height: 0, found: false, selectorHint: `not-found:${label}` };
  }

  /**
   * Ukur filter toolbar generik (bukan Global Search): multiselect / datepicker di area atas tabel.
   */
  async measureToolbarFilters(): Promise<BoxSize[]> {
    const boxes = await this.page.evaluate(() => {
      const search = document.querySelector(
        'input[placeholder*="find something" i], [role="searchbox"]',
      );
      const searchTop = search?.getBoundingClientRect().top ?? 120;

      const nodes = Array.from(
        document.querySelectorAll(
          '.multiselect, .p-datepicker, .p-calendar, [aria-placeholder*="Choose" i], [aria-placeholder*="Select" i], [aria-placeholder*="Show" i]',
        ),
      ) as HTMLElement[];

      const results: Array<{
        width: number;
        height: number;
        hint: string;
        top: number;
      }> = [];

      for (const el of nodes) {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 40 || rect.height < 20) continue;
        // Toolbar biasanya dekat search / di atas tabel
        if (rect.top > searchTop + 180) continue;
        if (rect.top < 40) continue;

        const placeholder =
          el.getAttribute('aria-placeholder') ||
          el.querySelector('[aria-placeholder]')?.getAttribute('aria-placeholder') ||
          el.getAttribute('placeholder') ||
          (el.textContent ?? '').trim().slice(0, 40);

        // Skip global search itself
        if (/find something/i.test(placeholder)) continue;

        results.push({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          hint: placeholder || el.className.toString().slice(0, 40),
          top: rect.top,
        });
      }

      // Dedup by similar size+top
      const deduped: typeof results = [];
      for (const r of results) {
        const dup = deduped.some(
          (d) =>
            Math.abs(d.top - r.top) < 4 &&
            Math.abs(d.width - r.width) < 4 &&
            Math.abs(d.height - r.height) < 4,
        );
        if (!dup) deduped.push(r);
      }
      return deduped;
    });

    return boxes.map((b) => ({
      width: b.width,
      height: b.height,
      found: true,
      selectorHint: b.hint,
    }));
  }

  async screenshot(name: string): Promise<void> {
    const dir = path.join(ETM_15550_RESULTS_DIR, 'screenshots');
    fs.mkdirSync(dir, { recursive: true });
    await this.page.screenshot({
      path: path.join(dir, name),
      fullPage: false,
    });
  }

  matchesSize(
    actual: BoxSize,
    expectedWidth: number,
    expectedHeight: number,
    tol = SIZE_TOLERANCE_PX,
  ): { widthOk: boolean; heightOk: boolean } {
    if (!actual.found) {
      return { widthOk: false, heightOk: false };
    }
    return {
      widthOk: Math.abs(actual.width - expectedWidth) <= tol,
      heightOk: Math.abs(actual.height - expectedHeight) <= tol,
    };
  }

  async assertPageLoaded(routePath: string): Promise<boolean> {
    // Deteksi blank/forbidden
    const bodyText = ((await this.page.locator('body').innerText().catch(() => '')) ?? '').slice(
      0,
      500,
    );
    if (/403|forbidden|not authorized|access denied/i.test(bodyText)) {
      return false;
    }
    await expect(this.page.locator('.topbar')).toBeVisible({ timeout: 30_000 });
    return true;
  }
}
