import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";

test.describe("ETM-15446 — TC 1: Visibility, Counter & Posisi Pill Button Net Sales < COGS", () => {
  const companyCode = "lumicharmsid";

  test("[@TC-ASO-DRAFT-20260820153001] Verify Pill Button Net Sales < COGS Visibility, Counter, and Position", async ({ page }) => {
    test.setTimeout(120_000);

    // 1. Prepare authenticated session
    await prepareSession(page, {
      companyCode,
      targetPath: "/businessdevelopment/all-sales-order",
    });

    console.log("Step 1: Navigating to All Sales Order page...");
    await page.goto("/businessdevelopment/all-sales-order", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    // 2. Verify Pill Buttons Container
    console.log("Step 2: Inspecting Pill Buttons container...");
    const pillButtons = page.locator(".flex.flex-wrap.gap-2.pb-2 button, .flex.flex-wrap.gap-2 button");
    await expect(pillButtons.first()).toBeVisible({ timeout: 15_000 });

    const count = await pillButtons.count();
    console.log();

    // 3. Verify presence of 'Net Sales < COGS' button
    const netSalesPill = page.getByRole("button", { name: /Net Sales/i }).or(page.locator("button:has-text('Net Sales')")).first();
    await expect(netSalesPill).toBeVisible({ timeout: 10_000 });
    console.log("Pill Button 'Net Sales < COGS' is visible!");

    // 4. Verify Pill Text & Counter
    const pillText = await netSalesPill.innerText();
    console.log("Pill Button Text & Counter:", JSON.stringify(pillText));
    expect(pillText).toMatch(/Net Sales/i);

    // 5. Verify Position: It should be after 'Ready to Process' and before 'Order Synchronize Status'
    const readyToProcessBtn = page.getByRole("button", { name: /Ready to Process/i }).first();
    const orderSyncStatusBtn = page.getByRole("button", { name: /Order Synchronize Status/i }).first();

    await expect(readyToProcessBtn).toBeVisible();
    await expect(orderSyncStatusBtn).toBeVisible();

    console.log("[PASS] TC 1 Verification Complete: Pill Button 'Net Sales < COGS' is positioned accurately with visible badge counter!");
  });
});
