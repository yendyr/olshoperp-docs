---
doc_type: e2e-test-case
tc_code: TC-ASO-030
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: "Edit Unit Price, Discount per item, dan VAT pada baris detail SO Platform"
summary: "Memastikan pengubahan Unit Price, Discount per item, dan VAT pada baris detail SO Platform berhasil tersimpan serta melakukan kalkulasi ulang DPP, PPN, dan Total Order secara akurat."
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
  - "2. Pada baris detail produk, ubah nilai Unit Price (misal Rp 50.000 menjadi Rp 65.000)"
  - "3. Isi nilai Discount per item (misal Rp 5.000) dan tentukan opsi VAT"
  - "4. Perhatikan pembaruan kalkulasi subtotal baris dan footer total order"
  - "5. Klik tombol Save / Save All"
expected_result: |
  Nilai Unit Price, Disc, dan VAT baru berhasil disimpan ke database. Perhitungan DPP, PPN, dan Total Order terhitung akurat sesuai formula perhitungan standar SO General.
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
- Jira Test Case: [ETM-15752](https://erpintegration.atlassian.net/browse/ETM-15752) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RzIu55hh`.
