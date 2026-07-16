---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-003
menu: supplychain-stock-opname
menu_name: "Stock Opname"
title: "Add Available Product + Adjustment Qty on existing Opname"
summary: "Edit dokumen Stock Opname (SP-6A56E465): buka Available Products, Use 1 product, isi Adjustment Quantity, verifikasi baris di Opname Detail."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: true
automated_spec: "tests/specs/stock-opname/stock-opname-add-available-product.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Dokumen SP-6A56E465 ada, editable (belum closed/approved)."
  - "Building Origin dokumen punya Available Products (stock)."
test_data:
  - field: "Transaction Code"
    value: "SP-6A56E465"
  - field: "Adjustment Quantity"
    value: "1"
steps:
  - "Buka Stock Opname → search SP-6A56E465 → edit."
  - "Di Opname Detail, klik Available Products."
  - "Klik Use pada baris product pertama."
  - "Isi Adjustment Quantity = 1 → Save."
  - "Verifikasi product muncul di tabel Opname Detail."
expected_result: |
  Product dari Available Products masuk ke Opname Detail dengan qty yang diisi.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~53s) — SP-6A56E465 sudah punya LUMI00001cabang-kuning (Available Products Use + Adj Qty 1);
    Expected stock di-update ke 2. Dokumen siap dengan product + qty.
  report_url: null
test_data_used:
  - field: "Code"
    value: "SP-6A56E465"
  - field: "Product"
    value: "LUMI00001cabang-kuning"
  - field: "Adjustment Qty"
    value: "1"
  - field: "Expected stock (updated)"
    value: "2"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-SOPNAME-003 — add available product + qty on SP-6A56E465"
---

# TC-SOPNAME-003

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu Stock Opname → search **SP-6A56E465** → edit.
3. Section **Opname Detail** → klik **Available Products**.
4. Klik **Use** pada product pertama.
5. Modal **Use Product** → isi **Adjustment Quantity** → **Save**.
6. Product harus muncul di grid Opname Detail.

## Catatan automation

- Spec tag: `@TC-SOPNAME-003`
- Helper: `tests/helpers/stock-opname.ts` (`useFirstAvailableProductWithQty`)
