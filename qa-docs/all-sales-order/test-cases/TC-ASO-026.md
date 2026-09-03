---
doc_type: e2e-test-case
tc_code: TC-ASO-026
menu: all-sales-order
menu_name: "All Sales Order"
test_type: regression
title: "Verifikasi regresi guard status order (Approved / Void) pada SKU Bundle berharga valid"
summary: "Memastikan order yang sudah berstatus Approved atau Void tetap memblokir ekstraksi SKU bundle meskipun price bundle bernilai lebih dari 0."
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
  - "Tersedia Sales Order berstatus Approved dan Sales Order berstatus Void yang memiliki baris SKU Bundle dengan Price > 0"
test_data: []
steps:
  - "1. Buka menu Business Development -> All Sales Order (/businessdevelopment/all-sales-order)"
  - "2. Buka detail Sales Order berstatus Approved yang memiliki SKU Bundle (Price > 0)"
  - "3. Coba lakukan ekstraksi bundle dan amati tombol/respon penolakan"
  - "4. Buka detail Sales Order berstatus Void yang memiliki SKU Bundle (Price > 0)"
  - "5. Coba lakukan ekstraksi bundle dan amati tombol/respon penolakan"
expected_result: |
  Meskipun Price > 0, sistem tetap memblokir proses ekstraksi bundle pada order Approved maupun Void (guard status dokumen tetap menjadi aturan utama dan tidak terdistorsi oleh validasi price).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used:
  - "Platform Order ID: 260529P186G3V3 (Status: Approved)"
run_history: []
origin_jira: ETM-15732
last_execution:
  at: "2026-09-03"
  jira: ETM-15738
  status: passed
  via: manual:Jeiniffer
  notes: "Tombol extract tersembunyi pada status Approved/Void; backend guard menolak transaksi non-Pending."
first_execution:
  at: "2026-09-03"
  via: manual:Jeiniffer
  jira: ETM-15738
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15732** ([All Sales Order - Menambahkan validasi proses extract SKU bundle hanya bisa dilakukan jika price lebih dari 0](https://erpintegration.atlassian.net/browse/ETM-15732)).
- Jira Test Case: [ETM-15738](https://erpintegration.atlassian.net/browse/ETM-15738) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RQtCNjnQ`.
