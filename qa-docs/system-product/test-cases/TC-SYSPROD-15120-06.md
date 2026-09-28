---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-06
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T06: Set Platform Default di Unit Lain (Cross-Unit Mutual Exclusion)"
summary: "Memastikan bahwa pemilihan radio button 'Platform Default' bersifat global (cross-unit mutual exclusion): saat user memilih Platform Default pada suatu unit/baris, sistem otomatis meng-uncheck pilihan Platform Default pada unit/baris lain dan seketika memperbarui tampilan Platform Default summary card."
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
  - "Tersedia produk dengan beberapa unit dan profil D&W (misal: SKU-COLLI01)"
test_data:
  - field: "Sample SKU"
    value: "SKU-COLLI01"
steps:
  - "1. Buka form edit untuk produk SKU-COLLI01 (/supplychain/product)"
  - "2. Buka modal konfigurasi Dimensi & Berat (D&W)"
  - "3. Pilih radio button 'Platform Default' pada salah satu profil D&W di unit awal"
  - "4. Pindah ke profil D&W pada unit lain dan pilih radio button 'Platform Default' di baris tersebut"
  - "5. Verifikasi bahwa radio button 'Platform Default' pada unit awal otomatis ter-uncheck (mati)"
  - "6. Verifikasi bahwa summary card Platform Default langsung ter-update menampilkan informasi profil dan unit yang baru dipilih"
expected_result: |
  1. Radio button Platform Default hanya dapat bernilai 1 pilihan aktif secara global (antar semua unit).
  2. Pemilihan pada unit lain otomatis meng-uncheck unit sebelumnya.
  3. Summary card Platform Default langsung reactive meng-update nilainya.
test_result:
  status: passed
  started_at: "2026-09-25T16:30:00+07:00"
  finished_at: "2026-09-25T16:35:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Memilih Platform Default di satu unit otomatis meng-uncheck pilihan di unit sebelumnya dan seketika meng-update card summary Platform Default."
  report_url: "https://app.betterbugs.io/session/6ab63f1f9a0216b8a623b3f9"
first_execution:
  at: "2026-09-25"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-25"
  jira: "ETM-15120"
  status: passed
  via: "manual:resty"
  notes: "Memilih Platform Default di satu unit otomatis meng-uncheck pilihan di unit sebelumnya dan seketika meng-update card summary."
---

# TC-SYSPROD-15120-06: T06: Set Platform Default di Unit Lain (Cross-Unit Mutual Exclusion)

## Konteks Pengujian (Card ETM-15120 — T06)

Memvalidasi integritas konfigurasi default platform: sinkronisasi dimensi dan berat ke platform marketplace / e-commerce membutuhkan tepat satu acuan global per SKU. Sistem harus menjamin hanya 1 profil D&W yang aktif sebagai Platform Default lintas unit.
