---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-01
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T01: Buka Create System Product Baru (Unit Configuration Default & Editable Primary)"
summary: "Memastikan saat membuka form Create System Product baru, section Unit Configuration langsung tampil dengan default Primary Unit 'pieces', user dapat mengubahnya ke unit lain di master, dan toggle Alternative Unit default OFF serta berfungsi normal."
status: draft
owner: QA - Yemima
last_updated: 2026-09-27
requirement_ref: "qa-docs/system-product/requirement.md"
card_ref: "ETM-15120"
automated: false
automated_spec: null
execution_company:
  id: null
  code: null
related_menus: []
preconditions:
  - "User login ke OlshopERP Staging dengan hak akses menu System Product"
  - "Buka form Create Product baru (/supplychain/product/create)"
test_data: []
steps:
  - "1. Buka menu Supply Chain -> Master Data -> System Product"
  - "2. Klik tombol '+ Create Product'"
  - "3. Scroll ke accordion section 'Unit Configuration'"
  - "4. Verifikasi Primary Unit default bernilai 'pieces'"
  - "5. Verifikasi Primary Unit dapat diubah ke unit lain yang terdaftar di master unit"
  - "6. Verifikasi toggle Alternative Unit default berstatus OFF dan berfungsi normal saat dinyalakan"
expected_result: |
  1. Section Unit Configuration tampil saat create produk baru.
  2. Default Primary Unit bernilai 'pieces' dan dapat diubah secara bebas oleh user.
  3. Toggle Alternative Unit berstatus OFF secara default dan berfungsi normal saat diaktifkan.
test_result:
  status: passed
  started_at: "2026-09-27T21:10:00+07:00"
  finished_at: "2026-09-27T21:11:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Saat create new product ada section Unit Configuration berisi default primary unit pieces + toggle alternative unit OFF. Primary unit dapat diubah bebas dengan unit lain di master, toggle alternative unit berfungsi normal."
  report_url: null
first_execution:
  at: "2026-09-27"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-27"
  jira: "ETM-15120"
  status: passed
  via: "manual:resty"
  notes: "Saat create new product ada section unit configuration yang berisi default primary unit (pieces) + toggle alternative unit=off. User dapat mengubah primary unit ke master unit lain, dan toggle alternative unit berfungsi normal."
---

# TC-SYSPROD-15120-01: T01: Buka Create System Product Baru

## Konteks Pengujian (Card ETM-15120 — T01)

Memvalidasi bahwa saat pembuatan SKU System Product baru, section Unit Configuration telah tersedia secara otomatis dengan Primary Unit default `pieces` yang dapat diubah bebas sebelum ada transaksi, serta toggle Alternative Unit dalam kondisi default OFF yang siap diaktifkan.
