---
doc_type: e2e-test-case
tc_code: TC-ASO-037
menu: all-sales-order
menu_name: "All Sales Order"
test_type: regression
title: "Read-Only Guard pada Dokumen Berstatus Approved (UI dan Button Save Hilang)"
summary: "Memastikan dokumen SO Platform yang sudah berstatus Approved mengunci seluruh interaksi form detail (tombol Add Product hilang, seluruh field input disabled, dan tombol Save/Save All tidak ditampilkan)."
status: draft
owner: QA - Yemima
last_updated: 2026-09-03
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - omni-sales-platform
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu All Sales Order"
  - "Company aktif: FAT (ID: 112)"
  - "Dokumen SO Platform berstatus DRAFT/OPEN"
test_data: []
steps:
  - "1. Buka halaman detail dokumen SO Platform berstatus Approved di All Sales Order"
  - "2. Periksa keberadaan tombol Add Product pada section detail"
  - "3. Periksa seluruh field input (Qty, Unit Price, Disc, VAT) pada tabel baris produk"
  - "4. Periksa keberadaan tombol Save / Save All pada halaman"
expected_result: |
  Seluruh form detail terkunci sempurna dalam mode read-only: tombol Add Product tidak ditampilkan (hilang), seluruh input field disabled, dan tombol Save / Save All tidak ditampilkan pada antarmuka halaman.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15748
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
first_execution:
  at: null
  via: null
  jira: null
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15748** ([All Sales Order - Edit detail SO platform sebelum approve (add/replace SKU, price, VAT; no delete)](https://erpintegration.atlassian.net/browse/ETM-15748)).
- Jira Test Case: [ETM-15759](https://erpintegration.atlassian.net/browse/ETM-15759) (Assignee: **OlshopERP**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RzIu55hh`.
