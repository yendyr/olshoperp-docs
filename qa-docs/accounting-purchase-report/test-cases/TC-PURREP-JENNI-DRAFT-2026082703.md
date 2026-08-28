---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082703
title: "POV Purchase Invoice — Perhitungan Total Price Per Line SKU Exclude Taxes & Header Extra Charges"
status: draft
module: Accounting
menu: accounting-purchase-report
menu_name: "Purchase Report"
test_type: happy
priority: high
automated: false
automated_spec: null
origin_jira: ETM-15488
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-supplier-invoice
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu Purchase Report (https://staging.olshoperp.com/accounting/purchase-report)"
  - "Terdapat data transaksi Purchase Invoice di database"
requirement_ref: "qa-docs/accounting-purchase-report/requirement.md"
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Test Case: POV Purchase Invoice — Perhitungan Total Price Per Line SKU Exclude Taxes & Header Extra Charges

## 📋 Summary
Memastikan kalkulasi Total Price per baris SKU pada laporan POV PI murni perkalian Qty x Unit Price tanpa terpengaruh pajak atau biaya header yang tidak teralokasi ke line SKU.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Pilih transaksi Purchase Invoice yang memiliki pajak atau biaya ekstra pada header-nya.
2. Buka menu Purchase Report POV Purchase Invoice.
3. Bandingkan kolom Total Price per SKU di Purchase Report dengan detail line PI origin.

## ✅ Expected Result
- Total Price per SKU dihitung berdasarkan (Qty x Unit Price) produk saja.
- Komponen pajak / extra charges header tidak mengubah Total Price per line SKU di laporan ini.
