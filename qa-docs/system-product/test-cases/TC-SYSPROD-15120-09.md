---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-09
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T09: Pengelolaan dan Penambahan Baris D&W Terisolasi per Unit"
summary: "Memvalidasi bahwa konfigurasi Dimensi & Berat (D&W) diakses langsung melalui ikon pada kolom D&W tabel Alternate Unit, modal yang terbuka hanya memuat profil spesifik unit tersebut, dan penambahan profil D&W baru otomatis terikat ke unit yang bersangkutan tanpa perlu memilih unit lagi."
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
  - "Buka form edit produk dengan beberapa alternate unit (misal: SKU-COLLI01)"
test_data:
  - field: "Sample SKU"
    value: "SKU-COLLI01"
steps:
  - "1. Buka form edit untuk produk SKU-COLLI01 (/supplychain/product)"
  - "2. Scroll ke section Unit Configuration pada tabel Alternate Unit"
  - "3. Verifikasi terdapat kolom 'D&W' dengan ikon di setiap baris alternate unit"
  - "4. Klik ikon D&W pada salah satu unit (misal Box atau Lusin)"
  - "5. Verifikasi bahwa modal hanya menampilkan daftar profil D&W milik unit tersebut"
  - "6. Klik tombol tambah profil D&W di dalam modal dan pastikan input langsung mengarah ke label D&W dan ukuran tanpa meminta pemilihan unit lagi"
expected_result: |
  1. Ikon kolom D&W di tabel Alternate Unit berfungsi membuka modal D&W per-unit.
  2. Profil D&W terisolasi hanya menampilkan profil milik unit terkait.
  3. Penambahan profil D&W baru otomatis terikat pada unit yang sedang dikelola.
test_result:
  status: passed
  started_at: "2026-09-27T20:45:00+07:00"
  finished_at: "2026-09-27T20:50:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: D&W diakses via ikon di kolom D&W tabel Alternate Unit, modal hanya menampilkan profil spesifik unit tersebut, dan penambahan baru langsung terikat ke unit."
  report_url: "https://app.betterbugs.io/session/6ab646b59a0216b8a623b4af"
first_execution:
  at: "2026-09-27"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-27"
  jira: "ETM-15120"
  status: passed
  via: "manual:resty"
  notes: "D&W diakses via ikon di kolom D&W tabel Alternate Unit, modal hanya menampilkan profil spesifik unit tersebut, penambahan baru langsung terikat ke unit."
---

# TC-SYSPROD-15120-09: T09: Pengelolaan dan Penambahan Baris D&W Terisolasi per Unit

## Konteks Pengujian (Card ETM-15120 — T09)

Memvalidasi bahwa penambahan profil D&W terfilter dan terisolasi per unit yang telah dikonfigurasi, sesuai penyesuaian mockup terbaru di mana akses D&W langsung diletakkan pada baris tabel unit masing-masing.
