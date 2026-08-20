import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";

test.describe("ETM-15446 — TC 4: Single-Active Toggle antar Pill Button", () => {
  const companyCode = "lumicharmsid";

  test("[@TC-ASO-DRAFT-20260820153004] Verify Single-Active Toggle behavior across Pill Buttons", async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/businessdevelopment/all-sales-order",
    });

    console.log("Step 1: Navigating to All Sales Order...");
    await page.goto("/businessdevelopment/all-sales-order", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const failedPill = page.getByRole("button", { name: /Failed Process/i }).first();
    const netSalesPill = page.getByRole("button", { name: /Net Sales/i }).first();
    const readyPill = page.getByRole("button", { name: /Ready to Process/i }).first();

    // 2. Click Failed Process
    console.log("Step 2: Activating 'Failed Process' pill...");
    await failedPill.click();
    await page.waitForTimeout(2000);

    // 3. Click Net Sales < COGS directly
    console.log("Step 3: Activating 'Net Sales < COGS' pill directly...");
    const [netSalesResp] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes("sales-order") && resp.url().includes("net_sales_below_cogs=true") && resp.status() === 200, { timeout: 30_000 }),
      netSalesPill.click(),
    ]);
    expect(netSalesResp.url()).toContain("net_sales_below_cogs=true");
    expect(netSalesResp.url()).not.toContain("failed_process=true");
    console.log("Verified 'Net Sales < COGS' is active exclusively without failed_process.");

    // 4. Click Ready to Process directly
    console.log("Step 4: Activating 'Ready to Process' pill...");
    const [readyResp] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes("sales-order") && resp.url().includes("failed_process=false") && resp.status() === 200, { timeout: 30_000 }),
      readyPill.click(),
    ]);
    expect(readyResp.url()).toContain("failed_process=false");
    expect(readyResp.url()).not.toContain("net_sales_below_cogs=true");
    console.log("Verified 'Ready to Process' is active exclusively without net_sales_below_cogs.");

    console.log("[PASS] TC 4 Verification Complete: Single-active toggle functions seamlessly across all pill buttons!");
  });
});
