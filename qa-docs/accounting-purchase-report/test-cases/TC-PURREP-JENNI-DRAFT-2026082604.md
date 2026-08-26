---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082604
title: "POV Purchase Order — Navigasi Hyperlink Trx Code PO & Isolasi Data dari Purchase Invoice / AP"
status: draft
module: Accounting
menu: accounting-purchase-report
menu_name: "Purchase Report"
test_type: cross-menu
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
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Test Case: POV Purchase Order — Navigasi Hyperlink Trx Code PO & Isolasi Data dari Purchase Invoice / AP

## 📋 Summary
Memastikan Trx Code di-hyperlink langsung ke detail Purchase Order origin serta terisolasi dari data Purchase Invoice (PI) maupun Account Payable (AP) Report.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Pada datalist Purchase Report POV PO, klik salah satu kode transaksi pada kolom Trx Code (misal PO-XXXXX).
2. Verifikasi halaman yang terbuka.
3. Periksa apakah terdapat kolom atau data yang berasal dari Purchase Invoice (PI) / AP Report.

## ✅ Expected Result
- Klik Trx Code (PO-XXXXX) berhasil membuka tab/halaman detail Purchase Order yang sesuai.
- Datalist terisolasi 100%: tidak ada data/kolom Purchase Invoice (PI) atau AP Report yang tercampur.
