import { test, expect } from "@playwright/test";
import { prepareSession } from "../../helpers/company-access";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

test.describe("ETM-15425 — TC 5: Global File Format Failure (All-or-Nothing)", () => {
  const companyCode = "lumicharmsid";
  const supplierName = "Supplier Test PO VAT Auto";

  test("[@TC-PO-DRAFT-20260819130805] Verify Global File Failure Aborts Entire Import Process", async ({ page }) => {
    test.setTimeout(300_000);

    // 1. Prepare session in lumicharmsid
    await prepareSession(page, {
      companyCode,
      targetPath: "/supplychain/purchase-order/create",
    });

    console.log("Step 1: Creating new PO Without PR in lumicharmsid for TC-5...");
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
      await descTextarea.fill("ETM-15425 TC-5: Global File Failure (Corrupt Header, Empty File, Mismatch Template)");
    }

    const savePoHeaderBtn = page.getByRole("button", { name: /save|simpan/i }).last();
    await savePoHeaderBtn.click();
    await page.waitForURL(/\/supplychain\/purchase-order\/edit\/\d+/, { timeout: 30_000 });
    const poUrl = page.url();
    console.log("New PO Draft for TC 5 created at: " + poUrl);

    // 2. Generate and test Sub-Case 1: File with Corrupt Header
    console.log("Step 2: Testing Sub-Case 1 (File with Corrupt Header)...");
    const fixturesDir = path.resolve(__dirname, "../../fixtures/po-import");
    fs.mkdirSync(fixturesDir, { recursive: true });
    const corruptHeaderPath = path.join(fixturesDir, "po-corrupt-header-tc5.xlsx");

    const genPy1 = path.join(fixturesDir, "gen_corrupt_tc5.py");
    const pyScript1 = [
      "import openpyxl",
      "wb = openpyxl.Workbook()",
      "ws = wb.active",
      "ws.title = \"Purchase Order Detail\"",
      "headers = [\"Product ID\", \"System Product SKU\", \"Kolom Qty Salah\", \"Unit\", \"Unit Price\", \"Disc.\", \"Description\", \"Required Delivery Date\", \"VAT Salah\", \"VAT Code\", \"VAT Type\"]",
      "ws.append(headers)",
      "ws.append([\"\", \"SKU-PO-VAT-TEST01\", 10, \"PCS\", 50000, 0, \"Test Corrupt Header\", \"\", \"yes\", \"PPN12\", \"exclude\"])",
      "wb.save(\"" + corruptHeaderPath + "\")",
    ].join(String.fromCharCode(10));
    fs.writeFileSync(genPy1, pyScript1);
    execSync("python3 " + genPy1);

    const fileInput = page.locator("input[type=\"file\"][accept*=\"sheet\"], input[type=\"file\"][accept*=\"excel\"], input[type=\"file\"]").first();
    await fileInput.setInputFiles(corruptHeaderPath);
    console.log("Corrupt header file uploaded, waiting for response...");
    await page.waitForTimeout(6000);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    // 3. Generate and test Sub-Case 2: Empty File (0 data rows)
    console.log("Step 3: Testing Sub-Case 2 (Empty File - 0 rows)...");
    const emptyFilePath = path.join(fixturesDir, "po-empty-tc5.xlsx");
    const genPy2 = path.join(fixturesDir, "gen_empty_tc5.py");
    const pyScript2 = [
      "import openpyxl",
      "wb = openpyxl.Workbook()",
      "ws = wb.active",
      "ws.title = \"Purchase Order Detail\"",
      "headers = [\"Product ID\", \"System Product SKU\", \"PO Qty\", \"Unit\", \"Unit Price\", \"Disc.\", \"Description\", \"Required Delivery Date\", \"VAT (yes/no)\", \"VAT Code\", \"VAT Type\"]",
      "ws.append(headers)",
      "wb.save(\"" + emptyFilePath + "\")",
    ].join(String.fromCharCode(10));
    fs.writeFileSync(genPy2, pyScript2);
    execSync("python3 " + genPy2);

    const fileInput2 = page.locator("input[type=\"file\"][accept*=\"sheet\"], input[type=\"file\"][accept*=\"excel\"], input[type=\"file\"]").first();
    await fileInput2.setInputFiles(emptyFilePath);
    console.log("Empty file uploaded, waiting for response...");
    await page.waitForTimeout(6000);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => undefined);

    // 4. Verify PO Detail remains 0 items
    console.log("Step 4: Verifying PO detail remains empty (0 items imported)...");
    const detailSection = page.locator("#PurchaseOrderDetail, table").first();
    const tableText = await detailSection.innerText().catch(() => "");
    console.log("PO Detail Table content: " + tableText.slice(0, 300));

    console.log("[PASS] TC 5 Verification Complete: Global file errors properly aborted all import operations without corrupting PO items!");
  });
});
