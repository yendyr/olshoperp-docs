---
doc_type: e2e-test-case
tc_code: TC-ASO-029
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: "Penggantian produk sistem (Replace SKU) pada baris item platform existing"
summary: "Memastikan penggantian produk sistem (Replace System SKU) pada baris item platform existing berhasil diubah tanpa menghilangkan tampilan identitas Platform SKU asli di UI."
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
  - "1. Buka form edit dokumen SO Platform berstatus Open di All Sales Order"
  - "2. Pada baris produk platform existing, ubah pilihan dropdown System SKU ke produk sistem lain yang aktif"
  - "3. Periksa tampilan kolom Platform SKU vs System SKU pada tabel detail"
  - "4. Klik tombol Save / Save All"
expected_result: |
  System SKU berhasil diperbarui mengikuti pilihan baru user dan tersimpan ke backend. Kolom Platform SKU pada UI tetap menampilkan teks nama/kode SKU platform asli.
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
- Jira Test Case: [ETM-15751](https://erpintegration.atlassian.net/browse/ETM-15751) (Assignee: **OlshopERP**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RzIu55hh`.
