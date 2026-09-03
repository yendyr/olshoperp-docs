---
doc_type: e2e-test-case
tc_code: TC-ASO-024
menu: all-sales-order
menu_name: "All Sales Order"
test_type: edge
title: "Boundary test Price desimal sangat kecil (0.0001) vs Price negatif (-1000)"
summary: "Memastikan presisi validasi desimal (bccomp 4 desimal) meloloskan ekstraksi pada nilai positif terkecil (0.0001) dan menolak nilai negatif (<= 0)."
status: review
owner: QA - Yemima
last_updated: 2026-09-02
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - sales-order-general
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu All Sales Order"
  - "Company aktif: FAT (ID: 112)"
test_data:
  - field: bundle_micro_price
    value: "each_price = 0.0001"
  - field: bundle_negative_price
    value: "each_price = -1000"
steps:
  - "1. Buka menu Business Development -> All Sales Order (/businessdevelopment/all-sales-order)"
  - "2. Test Kasus 1: Buka order dengan baris bundle yang memiliki each_price = 0.0001, klik tombol Extract"
  - "3. Amati respon sistem pada Kasus 1"
  - "4. Test Kasus 2: Buka order dengan baris bundle yang memiliki each_price = -1000, klik tombol Extract"
  - "5. Amati respon sistem pada Kasus 2"
expected_result: |
  Pada Kasus 1 (each_price = 0.0001), proses ekstraksi berhasil berjalan karena nilai > 0 sesuai batasan bccomp 4 desimal. Pada Kasus 2 (each_price = -1000), proses ekstraksi ditolak dengan pesan error validasi bahwa price harus lebih dari zero.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used:
  - "Boundary Decimal Simulation (0.0001)"
run_history: []
origin_jira: ETM-15732
last_execution:
  at: "2026-09-03"
  jira: ETM-15736
  status: passed
  via: manual:Jeiniffer
  notes: "Not reproducible via UI karena antarmuka tidak menerima input desimal; backend bccomp guard 4 digit aman."
first_execution:
  at: "2026-09-03"
  via: manual:Jeiniffer
  jira: ETM-15736
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15732** ([All Sales Order - Menambahkan validasi proses extract SKU bundle hanya bisa dilakukan jika price lebih dari 0](https://erpintegration.atlassian.net/browse/ETM-15732)).
- Jira Test Case: [ETM-15736](https://erpintegration.atlassian.net/browse/ETM-15736) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RQtCNjnQ`.
