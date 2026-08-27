---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082702
title: "POV Purchase Invoice — Cakupan Status Transaksi Purchase Invoice & Multi-Currency"
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
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Test Case: POV Purchase Invoice — Cakupan Status Transaksi Purchase Invoice & Multi-Currency

## 📋 Summary
Memastikan Purchase Report POV PI menampilkan seluruh dokumen Purchase Invoice di berbagai status pembayaran/status transaksi (Unpaid, Partially Paid, Paid, Posted) dengan Currency as-is.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Pastikan di company testing terdapat data Purchase Invoice dengan berbagai status (Unpaid, Partially Paid, Paid, Posted).
2. Buka menu Purchase Report dan filter Type = "Purchase Invoice".
3. Periksa seluruh baris transaksi yang ditampilkan pada datalist.

## ✅ Expected Result
- Seluruh dokumen Purchase Invoice yang valid muncul dalam laporan.
- Kolom Type Transaction menampilkan "Purchase Invoice".
- Nilai Currency ditampilkan as-is sesuai dokumen PI origin.
