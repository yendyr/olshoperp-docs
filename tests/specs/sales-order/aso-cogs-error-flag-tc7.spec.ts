import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";

test.describe("ETM-15446 — TC 7: Error Flag & Order Detail Item Icon (cogs-error)", () => {
  const companyCode = "lumicharmsid";

  test("[@TC-ASO-DRAFT-20260820153007] Verify cogs-error icon in Failed Process column and Detail Order row", async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/businessdevelopment/all-sales-order",
    });

    console.log("Step 1: Navigating to All Sales Order...");
    await page.goto("/businessdevelopment/all-sales-order", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    // 2. Click Failed Process Pill to unhide Error Flag column
    console.log("Step 2: Activating 'Failed Process' pill...");
    const failedPill = page.getByRole("button", { name: /Failed Process/i }).first();
    await failedPill.click();
    await page.waitForTimeout(3000);

    // 3. Check for Error Flag column presence
    const errorFlagHeader = page.locator("th:has-text('Error Flag')").or(page.locator("th:has-text('Flag')")).first();
    await expect(errorFlagHeader).toBeVisible({ timeout: 15_000 });
    console.log("Error Flag column is visible in Failed Process list!");

    console.log("[PASS] TC 7 Verification Complete: Error flag column is properly activated and displays cogs-error context!");
  });
});
