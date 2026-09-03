---
doc_type: e2e-test-case
tc_code: TC-ASO-033
menu: all-sales-order
menu_name: "All Sales Order"
test_type: edge
title: "Ekstraksi SKU Bundle saat dokumen SO Platform sudah mencapai kuota 100 baris detail"
summary: "Memastikan penanganan sistem saat dokumen SO Platform telah mencapai kuota 100 baris detail dan user menjalankan aksi Extract pada salah satu baris SKU Bundle (potensi ekspansi baris > 100)."
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
  - "1. Buka form edit dokumen SO Platform yang memiliki 100 baris detail"
  - "2. Cari baris SKU Bundle yang memiliki child komponen"
  - "3. Klik tombol/ikon Extract (fa-box-open) pada baris bundle tersebut"
  - "4. Amati respon sistem terhadap pemecahan bundle menjadi 3 baris komponen (potensi ekspansi menjadi 102 baris)"
expected_result: |
  Sistem memproses ekstraksi bundle secara aman sesuai mekanisme validasi batas kuota 100 baris tanpa terjadi error unhandled 500 / data corruption.
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
- Jira Test Case: [ETM-15755](https://erpintegration.atlassian.net/browse/ETM-15755) (Assignee: **OlshopERP**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RzIu55hh`.
