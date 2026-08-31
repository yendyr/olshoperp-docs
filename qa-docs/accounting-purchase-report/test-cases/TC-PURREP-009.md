---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: TC-PURREP-009
title: "POV Purchase Invoice — Navigasi Hyperlink Trx Code PI & Isolasi Data dari PO Outstanding"
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

# Test Case: POV Purchase Invoice — Navigasi Hyperlink Trx Code PI & Isolasi Data dari PO Outstanding

## 📋 Summary
Memastikan Trx Code di-hyperlink langsung ke detail Purchase Invoice origin serta terisolasi dari transaksi Purchase Order (PO) yang belum terbit PI-nya.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Pada datalist Purchase Report POV PI, klik salah satu kode transaksi pada kolom Trx Code (misal PI-XXXXX).
2. Verifikasi halaman yang terbuka.
3. Periksa apakah terdapat transaksi PO yang belum di-invoice pada datalist ini.

## ✅ Expected Result
- Klik Trx Code (PI-XXXXX) berhasil membuka tab/halaman detail Purchase Invoice (/accounting/purchase-invoice) yang sesuai.
- Datalist terisolasi 100%: hanya menampilkan transaksi yang sudah menjadi Purchase Invoice, tidak mencakup PO pending/unbilled.
