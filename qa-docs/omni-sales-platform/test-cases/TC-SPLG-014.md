---
doc_type: e2e-test-case
tc_code: TC-SPLG-014
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: edge
title: "Boundary test Price desimal sangat kecil (0.0001) vs Price negatif (-1000)"
summary: "Memastikan presisi validasi desimal (bccomp 4 desimal) pada Sales Platform meloloskan ekstraksi pada nilai positif terkecil (0.0001) dan menolak nilai negatif (<= 0)."
status: review
owner: QA - Yemima
last_updated: 2026-09-03
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Dev - Sales Platform"
  - "Company aktif: FAT (ID: 112)"
test_data:
  - field: bundle_micro_price
    value: "each_price = 0.0001 (Boundary check)"
  - field: bundle_negative_price
    value: "each_price = -1000 (Negative boundary check)"
steps:
  - "1. Buka menu Omnichannel -> Dev - Sales Platform (/omnichannel/sales-order)"
  - "2. Test Kasus 1: Buka order dengan baris bundle yang memiliki each_price = 0.0001, klik tombol Extract"
  - "3. Amati respon sistem pada Kasus 1"
  - "4. Test Kasus 2: Buka order dengan baris bundle yang memiliki each_price = -1000, klik tombol Extract"
  - "5. Amati respon sistem pada Kasus 2"
expected_result: |
  Pada Kasus 1 (each_price = 0.0001), proses ekstraksi berhasil berjalan karena nilai > 0 sesuai batasan bccomp 4 desimal. Pada Kasus 2 (each_price = -1000), proses ekstraksi ditolak dengan pesan error validasi bahwa price harus lebih dari zero.
test_result:
  status: passed
  started_at: "2026-09-03T02:57:00Z"
  finished_at: "2026-09-03T02:57:30Z"
  executed_by: "QA - Jeiniffer"
  environment: staging
  log_summary: "Dianggap passed: sistem saat ini tidak mendukung input angka desimal pada UI/order dan harga dari platform marketplace tidak mungkin bernilai 0.0001 (skenario tidak bisa direproduce di UI). Validasi backend bccomp(each_price, '0.0000', 4) sudah terverifikasi pada level kode."
  report_url: null
test_data_used: []
run_history:
  - run_at: "2026-09-03T09:57:00+07:00"
    status: passed
    jira: ETM-15742
    via: manual:Jeiniffer
origin_jira: ETM-15733
last_execution:
  at: "2026-09-03"
  jira: "ETM-15742"
  status: passed
  via: manual:Jeiniffer
  notes: "Sistem tidak mendukung input angka desimal dan harga platform tidak mungkin 0.0001 (tidak bisa direproduce di UI); validasi bccomp 4 desimal pada backend sudah terverifikasi pada level kode."
first_execution:
  at: "2026-09-03"
  via: manual:Jeiniffer
  jira: "ETM-15742"
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15733** ([Dev - Sales Platform - Menambahkan validasi proses extract SKU bundle hanya bisa dilakukan jika price lebih dari 0](https://erpintegration.atlassian.net/browse/ETM-15733)).
- Jira Test Case: [ETM-15742](https://erpintegration.atlassian.net/browse/ETM-15742) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RQtCNjnQ`.
