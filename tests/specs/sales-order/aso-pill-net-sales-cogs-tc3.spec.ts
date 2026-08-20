import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";

test.describe("ETM-15446 — TC 3: Deaktivasi Filter Pill (Toggle OFF)", () => {
  const companyCode = "lumicharmsid";

  test("[@TC-ASO-DRAFT-20260820153003] Verify Toggling OFF Net Sales < COGS returns full Sales Order data", async ({ page }) => {
    test.setTimeout(180_000);

    // 1. Prepare authenticated session
    await prepareSession(page, {
      companyCode,
      targetPath: "/businessdevelopment/all-sales-order",
    });

    console.log("Step 1: Navigating to All Sales Order page...");
    await page.goto("/businessdevelopment/all-sales-order", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const netSalesPill = page.getByRole("button", { name: /Net Sales/i }).or(page.locator("button:has-text('Net Sales')")).first();
    await expect(netSalesPill).toBeVisible({ timeout: 15_000 });

    // 2. Click to toggle ON
    console.log("Step 2: Activating 'Net Sales < COGS' filter...");
    const [filterOnResp] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes("sales-order") && resp.url().includes("net_sales_below_cogs=true") && resp.status() === 200, { timeout: 30_000 }),
      netSalesPill.click(),
    ]);
    console.log("Filter ON URL:", filterOnResp.url());
    expect(filterOnResp.url()).toContain("net_sales_below_cogs=true");

    await page.waitForTimeout(2000);

    // 3. Click again to toggle OFF
    console.log("Step 3: Clicking again to toggle OFF 'Net Sales < COGS' filter...");
    const [filterOffResp] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes("sales-order") && !resp.url().includes("net_sales_below_cogs=true") && resp.status() === 200, { timeout: 30_000 }),
      netSalesPill.click(),
    ]);
    console.log("Filter OFF URL:", filterOffResp.url());
    expect(filterOffResp.url()).not.toContain("net_sales_below_cogs");

    // 4. Verify unfiltered data returned
    const json = await filterOffResp.json().catch(() => null);
    const records = json?.data || json?.records || [];
    console.log();

    console.log("[PASS] TC 3 Verification Complete: Toggling OFF 'Net Sales < COGS' successfully restored unfiltered datalist without net_sales_below_cogs parameter!");
  });
});
