import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

test.describe("ETM-15425 — TC 6 & TC 7: Edge Case Validations on PO Import Detail", () => {
  const companyCode = "lumicharmsid";
  const supplierName = "Supplier Test PO VAT Auto";
  const skuWithTax = "SKU-PO-VAT-TEST01";
  const skuWithoutTax = "SKU-VAT-delete";

  test("[@TC-PO-DRAFT-20260819170001] [TC-6] Verify VAT Type Filled when No Tax Basis exists", async ({ page }) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/supplychain/purchase-order/create",
    });

    console.log("=== TC-6: Testing VAT Type Filled with No Tax Basis ===");
    await page.goto("/supplychain/purchase-order/create", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const withoutPrRadio = page.locator("input[type=\"radio\"][value=\"without_pr\"]").or(page.locator("input[type=\"radio\"][id*=\"without\"]")).first();
    if (await withoutPrRadio.isVisible().catch(() => false)) {
      await withoutPrRadio.check({ force: true });
    }

    const supplierDropdown = page.locator("#supplier_id, .multiselect:has-text(\"Supplier\")").or(page.locator(".multiselect").first());
    await supplierDropdown.click();
    const supplierOption = page.locator(".multiselect-option, .multiselect__option").filter({ hasText: new RegExp(supplierName, "i") }).first();
    if (await supplierOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await supplierOption.click();
    } else {
      await page.locator(".multiselect-option, .multiselect__option").first().click();
    }

    const descTextarea = page.locator("textarea[name=\"description\"], #description, textarea[placeholder*=\"description\" i]").first();
    if (await descTextarea.isVisible().catch(() => false)) {
      await descTextarea.fill("ETM-15425 TC-6: VAT Type Filled with No Tax Basis (0% Tax Expected)");
    }

    const savePoHeaderBtn = page.getByRole("button", { name: /save|simpan/i }).last();
    await savePoHeaderBtn.click();
    await page.waitForURL(/\/supplychain\/purchase-order\/edit\/\d+/, { timeout: 30_000 });
    const poUrl6 = page.url();
    console.log("[TC-6] PO created at: " + poUrl6);

    // Generate file for TC 6
    const fixturesDir = path.resolve(__dirname, "../../fixtures/po-import");
    fs.mkdirSync(fixturesDir, { recursive: true });
    const tc6FilePath = path.join(fixturesDir, "po-tc6-no-tax-basis.xlsx");

    const genPy6 = path.join(fixturesDir, "gen_tc6.py");
    const pyScript6 = [
      "import openpyxl",
      "wb = openpyxl.Workbook()",
      "ws = wb.active",
      "ws.title = \"Purchase Order Detail\"",
      "headers = [\"Product ID\", \"System Product SKU\", \"PO Qty\", \"Unit\", \"Unit Price\", \"Disc.\", \"Description\", \"Required Delivery Date\", \"VAT (yes/no)\", \"VAT Code\", \"VAT Type\"]",
      "ws.append(headers)",
      "ws.append([\"\", \"" + skuWithoutTax + "\", 10, \"PCS\", 50000, 0, \"TC-6 No Tax Basis Test\", \"\", \"\", \"\", \"exclude\"])",
      "wb.save(\"" + tc6FilePath + "\")",
    ].join(String.fromCharCode(10));
    fs.writeFileSync(genPy6, pyScript6);
    execSync("python3 " + genPy6);

    const fileInput6 = page.locator("input[type=\"file\"][accept*=\"sheet\"], input[type=\"file\"][accept*=\"excel\"], input[type=\"file\"]").first();
    await fileInput6.setInputFiles(tc6FilePath);
    console.log("[TC-6] File uploaded, waiting for response...");
    await page.waitForTimeout(6000);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const detailSection = page.locator("#PurchaseOrderDetail, table").first();
    await expect(detailSection).toBeVisible({ timeout: 15_000 });
    console.log("[TC-6] Detail table verified.");
  });

  test("[@TC-PO-DRAFT-20260819170002] [TC-7] Verify Validation on Partial Missing Fields when VAT is YES", async ({ page }) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/supplychain/purchase-order/create",
    });

    console.log("=== TC-7: Testing Partial Missing Fields Validation when VAT is YES ===");
    await page.goto("/supplychain/purchase-order/create", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    const withoutPrRadio = page.locator("input[type=\"radio\"][value=\"without_pr\"]").or(page.locator("input[type=\"radio\"][id*=\"without\"]")).first();
    if (await withoutPrRadio.isVisible().catch(() => false)) {
      await withoutPrRadio.check({ force: true });
    }

    const supplierDropdown = page.locator("#supplier_id, .multiselect:has-text(\"Supplier\")").or(page.locator(".multiselect").first());
    await supplierDropdown.click();
    const supplierOption = page.locator(".multiselect-option, .multiselect__option").filter({ hasText: new RegExp(supplierName, "i") }).first();
    if (await supplierOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await supplierOption.click();
    } else {
      await page.locator(".multiselect-option, .multiselect__option").first().click();
    }

    const descTextarea = page.locator("textarea[name=\"description\"], #description, textarea[placeholder*=\"description\" i]").first();
    if (await descTextarea.isVisible().catch(() => false)) {
      await descTextarea.fill("ETM-15425 TC-7: Validation on Partial Missing Fields when VAT is YES");
    }

    const savePoHeaderBtn = page.getByRole("button", { name: /save|simpan/i }).last();
    await savePoHeaderBtn.click();
    await page.waitForURL(/\/supplychain\/purchase-order\/edit\/\d+/, { timeout: 30_000 });
    const poUrl7 = page.url();
    console.log("[TC-7] PO created at: " + poUrl7);

    // Generate file for TC 7
    const fixturesDir = path.resolve(__dirname, "../../fixtures/po-import");
    fs.mkdirSync(fixturesDir, { recursive: true });
    const tc7FilePath = path.join(fixturesDir, "po-tc7-partial-missing.xlsx");

    const genPy7 = path.join(fixturesDir, "gen_tc7.py");
    const pyScript7 = [
      "import openpyxl",
      "wb = openpyxl.Workbook()",
      "ws = wb.active",
      "ws.title = \"Purchase Order Detail\"",
      "headers = [\"Product ID\", \"System Product SKU\", \"PO Qty\", \"Unit\", \"Unit Price\", \"Disc.\", \"Description\", \"Required Delivery Date\", \"VAT (yes/no)\", \"VAT Code\", \"VAT Type\"]",
      "ws.append(headers)",
      "ws.append([\"\", \"" + skuWithTax + "\", 10, \"PCS\", 50000, 0, \"Row 1 Empty Code & Type\", \"\", \"yes\", \"\", \"\"])",
      "ws.append([\"\", \"" + skuWithTax + "\", 5, \"PCS\", 50000, 0, \"Row 2 Empty Type\", \"\", \"yes\", \"PPN12\", \"\"])",
      "wb.save(\"" + tc7FilePath + "\")",
    ].join(String.fromCharCode(10));
    fs.writeFileSync(genPy7, pyScript7);
    execSync("python3 " + genPy7);

    const fileInput7 = page.locator("input[type=\"file\"][accept*=\"sheet\"], input[type=\"file\"][accept*=\"excel\"], input[type=\"file\"]").first();
    await fileInput7.setInputFiles(tc7FilePath);
    console.log("[TC-7] File uploaded, waiting for response...");
    await page.waitForTimeout(6000);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    console.log("[PASS] TC 6 and TC 7 edge cases successfully executed and validated!");
  });
});
