---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: TC-PURREP-006
title: "POV Purchase Invoice — Datalist Detail PI per SKU Grouped by Supplier & Running Total Tagihan"
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

# Test Case: POV Purchase Invoice — Datalist Detail PI per SKU Grouped by Supplier & Running Total Tagihan

## 📋 Summary
Memastikan saat Type = Purchase Invoice, datalist menampilkan hanya data Purchase Invoice per SKU yang di-group per Supplier dengan running total tagihan & header group yang akurat.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Buka menu Accounting -> Report -> Purchase Report (https://staging.olshoperp.com/accounting/purchase-report).
2. Pilih Type = "Purchase Invoice".
3. Tentukan Date Range (misal 30 hari terakhir) dan klik "Apply / Search".
4. Verifikasi struktur datalist dan pengelompokan baris data per Supplier.

## ✅ Expected Result
- Datalist menampilkan data per SKU dari Purchase Invoice yang dikelompokkan (Grouped) berdasarkan Supplier.
- Setiap grup Supplier memiliki header group dengan akumulasi total tagihan running yang sesuai.
- Setiap baris SKU menampilkan detail spesifik PI (Trx Code, SKU, Product Name, Qty, Unit Price, Total Price).
