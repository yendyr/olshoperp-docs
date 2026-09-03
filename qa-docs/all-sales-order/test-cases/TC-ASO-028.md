---
doc_type: e2e-test-case
tc_code: TC-ASO-028
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: "Penambahan baris produk baru (Add Product) pada SO Platform status DRAFT/OPEN"
summary: "Memastikan user dapat menambahkan baris produk baru (Add Product / Select Product) pada dokumen Sales Order tipe Platform berstatus DRAFT/OPEN seperti pada SO General."
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
  - "1. Buka menu All Sales Order (/businessdevelopment/all-sales-order) di company FAT"
  - "2. Buka form edit dokumen Sales Order Platform berstatus Open / Draft"
  - "3. Pada tabel detail produk, klik tombol Add Product / pilih baris baru pada dropdown Select Product"
  - "4. Pilih System SKU aktif, tentukan Qty (> 0), Unit Price, dan Warehouse"
  - "5. Klik tombol Save / Save All"
expected_result: |
  Baris produk baru berhasil ditambahkan sebagai murni system product (tanpa platform product ID). Nilai subtotal dan total order terakumulasi dengan benar, serta dokumen berhasil disimpan tanpa kendala.
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
- Jira Test Case: [ETM-15750](https://erpintegration.atlassian.net/browse/ETM-15750) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RzIu55hh`.
