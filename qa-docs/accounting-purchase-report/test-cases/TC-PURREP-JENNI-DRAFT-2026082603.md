---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082603
title: "POV Purchase Order — Perhitungan Total Price Per Line SKU Exclude Other Cost & Discount Header"
status: draft
module: Accounting
menu: accounting-purchase-report
menu_name: "Purchase Report"
test_type: edge
priority: high
automated: false
automated_spec: null
origin_jira: ETM-15487
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-purchase-order
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu Purchase Report (https://staging.olshoperp.com/accounting/purchase-report)"
  - "Terdapat data transaksi Purchase Order (With PR & Without PR) di database"
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

# Test Case: POV Purchase Order — Perhitungan Total Price Per Line SKU Exclude Other Cost & Discount Header

## 📋 Summary
Memastikan kalkulasi Total Price per baris SKU pada laporan murni perkalian Qty x Unit Price tanpa dipengaruhi Other Cost atau Discount pada header PO.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Pilih transaksi PO yang memiliki informasi Other Cost atau Discount pada header-nya.
2. Buka menu Purchase Report POV Purchase Order.
3. Bandingkan kolom Total Price per SKU di Purchase Report dengan detail line PO origin.

## ✅ Expected Result
- Total Price per SKU dihitung berdasarkan (Qty x Unit Price) produk saja.
- Komponen Other Cost dan Header Discount tidak memotong atau menambah Total Price per line SKU di laporan ini.
