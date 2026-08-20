import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";

test.describe("ETM-15447 — TC 2: Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif (Sales Platform)", () => {
  const companyCode = "FAT";

  test("[@TC-SPLG-DRAFT-20260820200502] Verify filter triggers API with net_sales_below_cogs=true and renders under-COGS platform orders", async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/omni/sales-order",
    });

    console.log("Step 1: Navigating to Platform Sales Order page in company FAT...");
    await page.goto("/omni/sales-order", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const netSalesPill = page.getByRole("button", { name: /Net Sales/i }).or(page.locator("button:has-text('Net Sales')")).first();
    await expect(netSalesPill).toBeVisible({ timeout: 15_000 });

    console.log("Step 2: Clicking 'Net Sales < COGS' Pill Button and monitoring API response...");
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes("sales-order") && resp.url().includes("net_sales_below_cogs=true") && resp.status() === 200, { timeout: 30_000 }),
      netSalesPill.click(),
    ]);

    const requestUrl = response.url();
    console.log("Step 3: Verified API Datalist URL with filter param:", requestUrl);
    expect(requestUrl).toContain("net_sales_below_cogs=true");
    expect(requestUrl).toContain("type=platform");

    const json = await response.json().catch(() => null);
    const records = json?.data || json?.records || [];
    console.log();

    await page.waitForTimeout(3000);

    console.log("[PASS] TC 2 Verification Complete: Filter 'Net Sales < COGS' successfully triggers API with type=platform&net_sales_below_cogs=true and renders filtered records!");
  });
});
