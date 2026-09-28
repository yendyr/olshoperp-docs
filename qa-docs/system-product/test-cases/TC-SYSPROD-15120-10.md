---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-10
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T10: System Product dengan Variant (Pewarisan Unit Parent dan Redirect Child)"
summary: "Memastikan bahwa pada produk yang memiliki varian, konfigurasi unit sepenuhnya menginduk ke SKU Parent (tidak diatur mandiri di child), dan saat user mengklik atau membuka SKU child, sistem secara konsisten mengarahkan (redirect) ke form SKU Parent dari produk tersebut."
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
  - "Tersedia produk bervarian yang memiliki SKU Parent dan SKU Child di datalist"
test_data: []
steps:
  - "1. Buka datalist menu Supply Chain -> Master Data -> System Product"
  - "2. Cari produk yang bertipe Variant"
  - "3. Klik pada salah satu SKU Child dari produk varian tersebut untuk membuka detail / form edit"
  - "4. Verifikasi bahwa sistem secara otomatis mengarahkan (redirect) halaman ke form SKU Parent dari produk tersebut"
  - "5. Verifikasi bahwa konfigurasi Unit Configuration dan Dimensi Berat diatur terpusat pada form parent tersebut dan berlaku untuk seluruh varian child"
expected_result: |
  1. Klik pada SKU Child secara otomatis diarahkan ke form SKU Parent.
  2. Konfigurasi unit dan D&W dikelola terpusat di level parent dan diwariskan ke seluruh varian anak.
test_result:
  status: passed
  started_at: "2026-09-27T21:26:00+07:00"
  finished_at: "2026-09-27T21:28:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Konfigurasi unit produk varian otomatis mengikuti parent. Saat klik SKU child, user otomatis terarahkan ke SKU parent dari child tersebut."
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
  notes: "Konfigurasi unit pada produk varian otomatis mengikuti parent, bahkan ketika klik SKU child, otomatis diarahkan ke form SKU parent dari child tersebut."
---

# TC-SYSPROD-15120-10: T10: System Product dengan Variant (Pewarisan Unit Parent dan Redirect Child)

## Konteks Pengujian (Card ETM-15120 — T10)

Memvalidasi arsitektur pewarisan konfigurasi unit pada produk bervarian: varian anak tidak memiliki konfigurasi unit terpisah melainkan mewarisi penuh setup dari parent, dan alur navigasi dari SKU anak secara seamless mengarahkan user ke halaman manajemen parent produk.
