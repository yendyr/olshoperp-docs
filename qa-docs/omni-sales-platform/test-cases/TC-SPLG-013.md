---
doc_type: e2e-test-case
tc_code: TC-SPLG-013
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: happy
title: "Ekstraksi SKU Bundle berhasil saat Price bernilai lebih dari 0 (Price > 0)"
summary: "Memastikan proses Extract pada baris SKU Bundle di detail Sales Platform berhasil memecah bundle menjadi komponen child SKU jika harga bundle lebih dari 0."
status: review
owner: QA - Yemima
last_updated: 2026-09-03
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/etm-15741-extract-bundle-positive-price.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Dev - Sales Platform"
  - "Company aktif: FAT (ID: 112)"
  - "Tersedia dokumen Platform Sales Order (status Open/Pending) yang memiliki SKU Bundle dengan Price > 0"
test_data:
  - field: order_shopee
    value: "SO-5T84B64G (Platform ID: 260518NYTFGYS8, ID: 2395191, Price: 13.999)"
  - field: order_tiktok
    value: "SO-5TBAYYV9 (Platform ID: 584214850089748400, ID: 2446670, Price: 15.499)"
steps:
  - "1. Buka menu Dev - Sales Platform / Sales Order Platform (/omni/sales-order/edit/{id}) di company FAT"
  - "2. Buka detail dokumen Sales Order Platform yang memiliki SKU Bundle dengan Price > 0 (SO-5T84B64G & SO-5TBAYYV9)"
  - "3. Cari baris bundle tersebut pada tabel detail item, lalu klik tombol/ikon Extract (fa-box-open)"
  - "4. Amati respon API dan perubahan baris pada tabel item"
  - "5. Verifikasi bahwa API mengembalikan status 200 Success dan bundle terurai menjadi komponen child SKU"
expected_result: |
  Proses ekstraksi berhasil dilakukan. Baris SKU Bundle terurai menjadi baris-baris komponen child SKU secara terpisah sesuai rasio kuantitas dan alokasi harga bundle. API mengembalikan respon 200 'Sales order details successfully extracted'.
test_result:
  status: passed
  started_at: "2026-09-03T02:22:00Z"
  finished_at: "2026-09-03T02:22:30Z"
  executed_by: "QA - Antigravity Agent"
  environment: staging
  log_summary: "Extract button on orders SO-5T84B64G (Price 13.999) and SO-5TBAYYV9 (Price 15.499) successfully extracted with HTTP 200: Sales order details successfully extracted."
  report_url: null
test_data_used:
  - "SO-5T84B64G (Platform Order ID: 260518NYTFGYS8, ID: 2395191, Price: 13.999)"
  - "SO-5TBAYYV9 (Platform Order ID: 584214850089748400, ID: 2446670, Price: 15.499)"
run_history:
  - run_at: "2026-09-03T09:22:32+07:00"
    status: passed
    jira: ETM-15741
    via: tests/specs/sales-platform/etm-15741-extract-bundle-positive-price.spec.ts
origin_jira: ETM-15733
last_execution:
  at: "2026-09-03"
  jira: "ETM-15741"
  status: passed
  via: tests/specs/sales-platform/etm-15741-extract-bundle-positive-price.spec.ts
first_execution:
  at: "2026-09-03"
  via: tests/specs/sales-platform/etm-15741-extract-bundle-positive-price.spec.ts
  jira: "ETM-15741"
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15733** ([Dev - Sales Platform - Menambahkan validasi proses extract SKU bundle hanya bisa dilakukan jika price lebih dari 0](https://erpintegration.atlassian.net/browse/ETM-15733)).
- Jira Test Case: [ETM-15741](https://erpintegration.atlassian.net/browse/ETM-15741) (Assignee: **OlshopERP**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RQtCNjnQ`.
