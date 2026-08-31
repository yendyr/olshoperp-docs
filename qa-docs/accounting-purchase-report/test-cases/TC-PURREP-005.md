---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: TC-PURREP-005
title: "POV Purchase Order — Validasi Date Range Gate, Filter SearchBuilder & Export File"
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

# Test Case: POV Purchase Order — Validasi Date Range Gate, Filter SearchBuilder & Export File

## 📋 Summary
Memastikan wajib memilih Date Range sebelum data dimuat (date gate), fitur Search/Advanced Filter berfungsi presisi, dan Export Excel/CSV menghasilkan format flat yang sesuai.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Buka menu Purchase Report tanpa memilih Date Range.
2. Verifikasi state awal halaman (gate mandatory date).
3. Isi Date Range, jalankan Global Search / Advanced Filter.
4. Klik tombol Export (Export All / Export This Page).

## ✅ Expected Result
- Halaman awal dalam keadaan blank gate sampai Date Range diisi (default last 30 days).
- Advanced Filter & Global Search mampu memfilter data POV PO dengan akurat.
- File Export (Excel/CSV) terunduh dalam format flat lengkap dengan kolom Supplier dan menghormati setting Column Show/Hide.
