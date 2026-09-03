---
doc_type: e2e-test-case
tc_code: TC-ASO-025
menu: all-sales-order
menu_name: "All Sales Order"
test_type: edge
title: "Multi-bundle dalam 1 order dengan kombinasi Price = 0 dan Price > 0"
summary: "Memastikan proses Extract pada satu baris bundle hanya memvalidasi harga baris tersebut secara independen tanpa memengaruhi atau mengubah baris bundle lain dalam order yang sama."
status: review
owner: QA - Yemima
last_updated: 2026-09-02
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/etm-15743-multi-bundle-zero-and-positive.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - sales-order-general
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu All Sales Order"
  - "Company aktif: FAT (ID: 112)"
  - "Tersedia Sales Order dengan minimal 2 baris SKU Bundle (Bundle-A: Price = 0, Bundle-B: Price = 25,000)"
test_data: []
steps:
  - "1. Buka menu Business Development -> All Sales Order (/businessdevelopment/all-sales-order)"
  - "2. Buka detail Sales Order multi-bundle target"
  - "3. Klik tombol Extract pada baris Bundle-A (Price = 0) dan amati error penolakan"
  - "4. Klik tombol Extract pada baris Bundle-B (Price = 25,000) dan amati proses ekstraksi"
expected_result: |
  Bundle-A (Price = 0) gagal diekstrak dan memunculkan notifikasi error validasi harga. Bundle-B (Price = 25,000) berhasil diekstrak dan terurai menjadi child SKU secara independen tanpa memengaruhi atau mengubah baris Bundle-A.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used:
  - "Order ID: 409573 (SO-68ABC8A4)"
  - "SKU Price 0: 12JPITBUNG-HL-blue"
  - "SKU Price > 0: 12JPITBUNG-HL-purple"
run_history: []
origin_jira: ETM-15732
last_execution:
  at: "2026-09-03"
  jira: ETM-15737
  status: passed
  via: tests/specs/sales-platform/etm-15743-multi-bundle-zero-and-positive.spec.ts
first_execution:
  at: "2026-09-03"
  via: tests/specs/sales-platform/etm-15743-multi-bundle-zero-and-positive.spec.ts
  jira: ETM-15737
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15732** ([All Sales Order - Menambahkan validasi proses extract SKU bundle hanya bisa dilakukan jika price lebih dari 0](https://erpintegration.atlassian.net/browse/ETM-15732)).
- Jira Test Case: [ETM-15737](https://erpintegration.atlassian.net/browse/ETM-15737) (Assignee: **OlshopERP**).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvu2RQtCNjnQ`.
