---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-08
menu: system-product
menu_name: "System Product"
test_type: edge
title: "T08: Toggle OFF Baris D&W yang Sedang Menjadi Default (Auto-Clear State)"
summary: "Memastikan bahwa ketika baris profil Dimensi & Berat (D&W) yang sedang aktif sebagai Platform Default atau Trx & Report Default di-toggle OFF, radio button otomatis mati dan tampilan summary card ter-clear menampilkan keterangan kosong ('No platform default selected' / 'No trx & report default selected')."
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
  - "Tersedia produk dengan konfigurasi D&W yang sedang aktif sebagai Platform Default atau Trx & Report Default"
test_data: []
steps:
  - "1. Buka form edit produk di menu System Product"
  - "2. Buka modal konfigurasi Dimensi & Berat (D&W)"
  - "3. Pastikan salah satu baris profil D&W sedang terpilih sebagai 'Platform Default' atau 'Trx & Report Default'"
  - "4. Matikan toggle aktif (ubah menjadi OFF) pada baris profil D&W tersebut"
  - "5. Verifikasi bahwa radio button pada baris tersebut otomatis berstatus nonaktif (mati)"
  - "6. Verifikasi bahwa card summary seketika ter-clear dan menampilkan teks placeholder kosong yang jelas: 'No platform default selected' atau 'No trx & report default selected'"
expected_result: |
  1. Radio button pada baris profil D&W yang di-toggle OFF otomatis dinonaktifkan / di-uncheck.
  2. Summary card di modal D&W langsung reactive ter-clear dan menampilkan keterangan 'No platform default selected' atau 'No trx & report default selected'.
test_result:
  status: passed
  started_at: "2026-09-27T21:25:00+07:00"
  finished_at: "2026-09-27T21:27:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Saat toggle D&W yang sedang aktif jadi default di-turn OFF, radio button otomatis mati dan card summary ter-clear dengan keterangan 'No platform default selected' atau 'No trx & report default selected'."
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
  notes: "Saat toggle D&W row OFF yang sedang jadi Platform/Trx Default: otomatis mati dan card summary ter-clear dengan keterangan 'No platform default selected' atau 'No trx & report default selected'."
---

# TC-SYSPROD-15120-08: T08: Toggle OFF Baris D&W yang Sedang Menjadi Default (Auto-Clear State)

## Konteks Pengujian (Card ETM-15120 — T08)

Memvalidasi integritas state UI ketika profil D&W dinonaktifkan: pemilihan default global tidak boleh tertinggal pada row yang tidak aktif, dan tampilan summary card harus secara instan mencerminkan ketiadaan default terpilih.
