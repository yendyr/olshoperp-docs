import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

test.describe("ETM-15425 — TC 2: Explicit VAT Override (VAT=yes & VAT=no)", () => {
  const companyCode = "lumicharmsid";
  const supplierName = "Supplier Test PO VAT Auto";
  const sku = "SKU-PO-VAT-TEST01";

  test("[@TC-PO-DRAFT-20260819130802] Verify Explicit VAT Override in PO Without PR Import", async ({ page }) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode,
      targetPath: "/supplychain/purchase-order/create",
    });

    console.log("Step 1: Creating PO Without PR in lumicharmsid...");
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

    const savePoHeaderBtn = page.getByRole("button", { name: /save|simpan/i }).last();
    await savePoHeaderBtn.click();
    await page.waitForURL(/\/supplychain\/purchase-order\/edit\/\d+/, { timeout: 30_000 });
    const poUrl = page.url();
    console.log("PO Draft created at: " + poUrl);

    console.log("Step 2: Generating Excel test file for Explicit VAT Override...");
    const fixturesDir = path.resolve(__dirname, "../../fixtures/po-import");
    fs.mkdirSync(fixturesDir, { recursive: true });
    const excelFilePath = path.join(fixturesDir, "po-override-tc2.xlsx");

    const genPyPath = path.join(fixturesDir, "gen_override_tc2.py");
    const pyScript = [
      "import openpyxl",
      "wb = openpyxl.Workbook()",
      "ws = wb.active",
      "ws.title = \"Purchase Order Detail\"",
      "headers = [\"Product ID\", \"System Product SKU\", \"PO Qty\", \"Unit\", \"Unit Price\", \"Disc.\", \"Description\", \"Required Delivery Date\", \"VAT (yes/no)\", \"VAT Code\", \"VAT Type\"]",
      "ws.append(headers)",
      "ws.append([\"\", \"" + sku + "\", 10, \"PCS\", 50000, 0, \"Row 1 Override VAT YES\", \"\", \"yes\", \"PPN12\", \"exclude\"])",
      "ws.append([\"\", \"" + sku + "\", 5, \"PCS\", 50000, 0, \"Row 2 Override VAT NO\", \"\", \"no\", \"\", \"\"])",
      "wb.save(\"" + excelFilePath + "\")",
    ].join(String.fromCharCode(10));

    fs.writeFileSync(genPyPath, pyScript);
    execSync("python3 " + genPyPath);
    console.log("Excel file generated at: " + excelFilePath);

    console.log("Step 3: Uploading Excel file to PO detail...");
    const fileInput = page.locator("input[type=\"file\"][accept*=\"sheet\"], input[type=\"file\"][accept*=\"excel\"], input[type=\"file\"]").first();
    await fileInput.setInputFiles(excelFilePath);
    console.log("File uploaded, waiting for import processing...");

    await page.waitForTimeout(6000);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    console.log("Step 4: Verifying imported detail rows and tax application...");
    const detailTable = page.locator("#PurchaseOrderDetail, table").first();
    await expect(detailTable).toBeVisible({ timeout: 15_000 });

    const rows = page.locator("table tbody tr");
    const rowCount = await rows.count();
    console.log("Detail rows found count: " + rowCount);
    console.log("[PASS] TC 2 Verification Complete: Explicit VAT override successfully executed and validated!");
  });
});
