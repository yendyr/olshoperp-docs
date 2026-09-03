---
doc_type: e2e-test-case
tc_code: TC-ASO-034
menu: all-sales-order
menu_name: "All Sales Order"
test_type: edge
title: "Ketiadaan tombol Delete Row di seluruh permukaan UI (Aturan No Delete)"
summary: "Memastikan aturan No Delete terpenuhi di seluruh titik antarmuka dokumen SO Platform (Detail DataTable, Modal Edit SKU, dan Bulk Action saat centang multi-rows)."
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
  - "1. Buka form edit dokumen SO Platform berstatus Open"
  - "2. Periksa kolom aksi pada setiap baris di Detail Order DataTable"
  - "3. Buka Modal Edit SKU Detail Order (jika ada modal edit per baris item) dan periksa keberadaan tombol Delete"
  - "4. Berikan centang (checklist) pada beberapa baris detail order (multi rows) dan periksa menu Bulk Action Button di atas tabel"
expected_result: |
  Tidak ada icon/tombol Delete Baris pada DataTable detail order, tidak ada tombol Delete di dalam Modal Edit SKU, dan tidak ada aksi Bulk Delete saat memilih multi-baris detail item. Pengecualian pemecahan baris hanya diperbolehkan melalui fitur Extract Bundle.
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
- Jira Test Case: [ETM-15756](https://erpintegration.atlassian.net/browse/ETM-15756) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RzIu55hh`.
