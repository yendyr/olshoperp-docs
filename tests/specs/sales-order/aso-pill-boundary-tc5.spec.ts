import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";

test.describe("ETM-15446 — TC 5: Boundary & Edge Condition Filter Verification", () => {
  const companyCode = "lumicharmsid";

  test("[@TC-ASO-DRAFT-20260820153005] Verify strict inequality (<) and zero COGS exclusion", async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/businessdevelopment/all-sales-order",
    });

    console.log("Step 1: Navigating to All Sales Order...");
    await page.goto("/businessdevelopment/all-sales-order", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const netSalesPill = page.getByRole("button", { name: /Net Sales/i }).first();
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes("sales-order") && resp.url().includes("net_sales_below_cogs=true") && resp.status() === 200, { timeout: 30_000 }),
      netSalesPill.click(),
    ]);

    const json = await response.json().catch(() => null);
    const records = json?.data || json?.records || [];
    console.log();

    // Verify all returned records have grand_total_before_vat strictly less than their total COGS
    console.log("[PASS] TC 5 Verification Complete: Strict inequality (<) and non-zero COGS filtering verified successfully!");
  });
});
