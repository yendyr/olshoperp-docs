---
doc_type: e2e-test-case
tc_code: TC-SPLG-016
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: regression
title: "Verifikasi regresi guard status order (Approved / Void) pada SKU Bundle berharga valid"
summary: "Memastikan order platform yang sudah berstatus Approved atau Void tetap memblokir ekstraksi SKU bundle meskipun price bundle bernilai lebih dari 0."
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
  - "Tersedia Sales Platform order berstatus Approved/Void (data uji: 260529P186G3V3) yang memiliki SKU Bundle"
test_data:
  - field: platform_order_id_approved
    value: "260529P186G3V3 (Status: Approved)"
steps:
  - "1. Buka menu Dev - Sales Platform (/omni/sales-order) di company FAT"
  - "2. Buka detail Platform Sales Order berstatus Approved (Platform Order ID: 260529P186G3V3)"
  - "3. Periksa baris detail SKU bundle pada tabel item dan pastikan tombol/ikon Extract (fa-box-open) tidak ditampilkan"
  - "4. Verifikasi bahwa status Approved maupun Void setara dalam mengunci perubahan dokumen pesanan"
expected_result: |
  Meskipun Price > 0, sistem tetap memblokir proses ekstraksi bundle pada order Platform yang sudah Approved maupun Void. Ikon Extract tidak muncul pada baris detail SKU (read-only), dan backend guard menolak transaksi non-Pending.
test_result:
  status: passed
  started_at: "2026-09-03T03:20:00Z"
  finished_at: "2026-09-03T03:22:00Z"
  executed_by: "QA - Jeiniffer"
  environment: staging
  log_summary: "Regresi guard status Approved/Void terverifikasi: Pada order 260529P186G3V3 (status Approved), tombol/ikon Extract bundle tidak ditampilkan pada baris detail SKU (tidak bisa diekstrak). Guard status dokumen berjalan sesuai ekspektasi."
  report_url: null
test_data_used:
  - "Platform Order ID: 260529P186G3V3 (Status: Approved)"
run_history:
  - run_at: "2026-09-03T10:22:00+07:00"
    status: passed
    jira: ETM-15744
    via: manual:Jeiniffer
origin_jira: ETM-15733
last_execution:
  at: "2026-09-03"
  jira: "ETM-15744"
  status: passed
  via: manual:Jeiniffer
  notes: "Pada order berstatus Approved/Void (260529P186G3V3), tombol/ikon Extract bundle tidak ditampilkan pada baris detail SKU sehingga tidak dapat diekstrak; guard backend juga menolak status selain Pending."
first_execution:
  at: "2026-09-03"
  via: manual:Jeiniffer
  jira: "ETM-15744"
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15733** ([Dev - Sales Platform - Menambahkan validasi proses extract SKU bundle hanya bisa dilakukan jika price lebih dari 0](https://erpintegration.atlassian.net/browse/ETM-15733)).
- Jira Test Case: [ETM-15744](https://erpintegration.atlassian.net/browse/ETM-15744) (Assignee: **Jeiniffer**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RQtCNjnQ`.
