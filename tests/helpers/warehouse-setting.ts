import fs from 'fs';
import path from 'path';
import { Locator, Page, expect } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const WAREHOUSE_SETTING_PATH = '/supplychain/setting';

export const ETM_15508_RESULTS_DIR = path.join(
  process.cwd(),
  'Automate Testing Card QA Review',
  'ETM-15508',
);

export type ColumnPanelMetrics = {
  height: number;
  width: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  checkboxCount: number;
  lastItemVisible: boolean;
  clippedByViewport: boolean;
  clippedByParent: boolean;
  clippingParent: string | null;
  fullyInViewport: boolean;
};

/**
 * POM Warehouse Setting — SCM Master (inline grid, tanpa Create).
 * Selector: tests/pom-registry/warehouse-setting.yaml
 */
export class WarehouseSettingPage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder('find something ...');
  }

  dataRows(): Locator {
    return this.page.locator('table tbody tr').filter({
      hasNot: this.page.locator(
        'td.dataTables_empty, td.p-datatable-emptymessage',
      ),
    });
  }

  columnShowHideTrigger(): Locator {
    return this.page.getByRole('button', { name: 'Columns Show/Hide' });
  }

  resetToDefaultButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset to Default' });
  }

  columnPanel(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.resetToDefaultButton() })
      .filter({
        has: this.page.getByRole('listitem', { name: 'Out Rack Location' }),
      })
      .last();
  }

  async gotoDatalist(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'GET') return false;
        const url = response.url();
        return (
          (url.includes('setting-warehouse-scrap-n-void') ||
            url.includes('/supplychain/setting')) &&
          !url.includes('/select2/')
        );
      },
      { timeout: 90_000 },
    );

    await this.page.goto(WAREHOUSE_SETTING_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await listResponse.catch(() => undefined);
    await expect(this.page.getByRole('table').first()).toBeVisible({
      timeout: 45_000,
    });
    await expect(this.searchInput).toBeVisible({ timeout: 20_000 });
    await this.page.waitForTimeout(800);
  }

  async rowCount(): Promise<number> {
    const empty = this.page.locator(
      'td.dataTables_empty, td.p-datatable-emptymessage',
    );
    if (await empty.isVisible().catch(() => false)) {
      return 0;
    }
    return this.dataRows().count();
  }

  async searchAndWait(query: string): Promise<void> {
    const responsePromise = this.page
      .waitForResponse(
        (response) => {
          if (response.request().method() !== 'GET') return false;
          const url = response.url();
          return (
            url.includes('setting-warehouse-scrap-n-void') ||
            url.includes('/supplychain/setting')
          );
        },
        { timeout: 30_000 },
      )
      .catch(() => undefined);

    await this.searchInput.fill(query);
    await this.searchInput.press('Enter').catch(() => undefined);
    await responsePromise;
    await this.page.waitForTimeout(1_200);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
    await this.searchInput.press('Enter').catch(() => undefined);
    await this.page.waitForTimeout(1_200);
  }

  async openColumnShowHide(): Promise<Locator> {
    const trigger = this.columnShowHideTrigger();
    await expect(trigger, 'Tombol Column Show/Hide harus terlihat').toBeVisible({
      timeout: 20_000,
    });
    await trigger.click();
    await this.page.waitForTimeout(400);

    await expect(this.resetToDefaultButton()).toBeVisible({ timeout: 8_000 });
    await expect(this.page.getByText('Scrap Location', { exact: true })).toBeVisible({
      timeout: 8_000,
    });
    return this.resetToDefaultButton();
  }

  async closeColumnShowHide(): Promise<void> {
    const panelVisible = await this.resetToDefaultButton()
      .isVisible()
      .catch(() => false);
    if (!panelVisible) {
      return;
    }

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
    if (await this.resetToDefaultButton().isVisible().catch(() => false)) {
      await this.columnShowHideTrigger().click();
      await this.page.waitForTimeout(300);
    }
  }

  async measurePanel(_panel?: Locator): Promise<ColumnPanelMetrics> {
    return this.page.evaluate(() => {
      const reset = Array.from(document.querySelectorAll('button')).find((button) =>
        (button.textContent ?? '').includes('Reset to Default'),
      );
      const item = Array.from(document.querySelectorAll('li, [role="listitem"]')).find(
        (el) => (el.textContent ?? '').includes('Out Rack Location'),
      );
      if (!reset || !item) {
        throw new Error('Columns Show/Hide panel tidak lengkap (Reset / list item)');
      }

      const list = item.closest('ul') ?? item.parentElement ?? item;
      const overlay =
        (reset.closest('div') && list.closest('div')
          ? reset.parentElement
          : null) ?? list;

      const r1 = reset.getBoundingClientRect();
      const r2 = list.getBoundingClientRect();
      const rect = {
        top: Math.min(r1.top, r2.top),
        bottom: Math.max(r1.bottom, r2.bottom),
        left: Math.min(r1.left, r2.left),
        right: Math.max(r1.right, r2.right),
      };

      const height = rect.bottom - rect.top;
      const width = rect.right - rect.left;
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const fullyInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportH + 1 &&
        rect.right <= viewportW + 1;

      const items = Array.from(
        (list.matches('ul') ? list : list.parentElement ?? list).querySelectorAll(
          'li, [role="listitem"]',
        ),
      ) as HTMLElement[];
      const lastCb = items[items.length - 1];
      const lastRect = lastCb?.getBoundingClientRect();
      const lastItemVisible = lastRect
        ? lastRect.bottom <= rect.bottom + 4 && lastRect.top >= rect.top - 4
        : true;

      let clippedByParent = false;
      let clippingParent: string | null = null;
      let parent: HTMLElement | null = overlay instanceof HTMLElement ? overlay : list;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        const overflow = `${style.overflow} ${style.overflowY} ${style.overflowX}`;
        if (
          overflow.includes('hidden') ||
          overflow.includes('auto') ||
          overflow.includes('scroll')
        ) {
          const pRect = parent.getBoundingClientRect();
          const clipped =
            rect.bottom > pRect.bottom + 2 ||
            rect.top < pRect.top - 2 ||
            rect.right > pRect.right + 2 ||
            rect.left < pRect.left - 2;
          if (clipped) {
            clippedByParent = true;
            clippingParent =
              `${parent.tagName.toLowerCase()}.${parent.className}`
                .replace(/\s+/g, '.')
                .slice(0, 180);
            break;
          }
        }
        parent = parent.parentElement;
      }

      return {
        height: Math.round(height),
        width: Math.round(width),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        checkboxCount: items.length,
        lastItemVisible,
        clippedByViewport: !fullyInViewport,
        clippedByParent,
        clippingParent,
        fullyInViewport,
      };
    });
  }

  isClipped(metrics: ColumnPanelMetrics): boolean {
    return metrics.clippedByParent || !metrics.fullyInViewport || metrics.height < 40;
  }

  async screenshotPanel(
    fileName: string,
    extra?: { fullPage?: boolean },
  ): Promise<string> {
    fs.mkdirSync(path.join(ETM_15508_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });
    const filePath = path.join(ETM_15508_RESULTS_DIR, 'screenshots', fileName);
    await this.page.screenshot({
      path: filePath,
      fullPage: extra?.fullPage ?? false,
    });
    return filePath;
  }

  async firstRowSearchToken(): Promise<string> {
    const text = (await this.dataRows().first().innerText()).trim();
    const token = text.split(/\s+/).find((part) => part.length >= 4);
    return token ?? text.slice(0, 12);
  }

  private async resolveOpenPanel(): Promise<Locator> {
    await expect(this.resetToDefaultButton()).toBeVisible({ timeout: 8_000 });
    const panel = this.columnPanel();
    await expect(panel).toBeVisible({ timeout: 8_000 });
    return panel;
  }
}
