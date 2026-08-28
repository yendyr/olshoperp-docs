---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082602
title: "POV Purchase Order — Cakupan Data Transaksi With PR, Without PR & Seluruh Status PO"
status: draft
module: Accounting
menu: accounting-purchase-report
menu_name: "Purchase Report"
test_type: happy
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

# Test Case: POV Purchase Order — Cakupan Data Transaksi With PR, Without PR & Seluruh Status PO

## 📋 Summary
Memastikan Purchase Report POV PO menampilkan seluruh transaksi Purchase Order baik tipe With PR maupun Without PR di semua status transaksi (Draft, Open, Approved, Completed, Cancelled).

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Pastikan di company testing terdapat data PO tipe With PR dan Without PR dalam berbagai status (Draft, Open, Approved, Completed, Cancelled).
2. Buka menu Purchase Report dan filter Type = "Purchase Order".
3. Periksa seluruh baris transaksi yang ditampilkan pada datalist.

## ✅ Expected Result
- Seluruh transaksi PO (With PR & Without PR) di berbagai status muncul dalam laporan.
- Kolom Type Transaction menampilkan "Purchase Order".
- Nilai Currency ditampilkan as-is sesuai dokumen PO origin.
