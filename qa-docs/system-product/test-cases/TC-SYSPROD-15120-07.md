---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-07
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T07: Set Trx & Report Default di Unit Lain (Cross-Unit Mutual Exclusion)"
summary: "Memastikan bahwa pemilihan radio button 'Trx & Report Default' bersifat global (cross-unit mutual exclusion): saat user memilih Trx & Report Default pada suatu unit/baris, sistem otomatis meng-uncheck pilihan pada unit/baris lain dan seketika memperbarui tampilan Trx & Report Default summary card."
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
  - "3. Pilih radio button 'Trx & Report Default' pada salah satu profil D&W"
  - "4. Pindah ke profil D&W pada unit lain dan pilih radio button 'Trx & Report Default' di baris tersebut"
  - "5. Verifikasi bahwa radio button 'Trx & Report Default' pada pilihan sebelumnya otomatis ter-uncheck (mati)"
  - "6. Verifikasi bahwa summary card Trx & Report Default langsung ter-update menampilkan informasi profil dan unit yang baru dipilih"
expected_result: |
  1. Radio button Trx & Report Default hanya dapat bernilai 1 pilihan aktif secara global lintas semua unit.
  2. Pemilihan pada unit lain otomatis meng-uncheck pilihan sebelumnya.
  3. Summary card Trx & Report Default langsung reactive ter-update.
test_result:
  status: passed
  started_at: "2026-09-25T16:30:00+07:00"
  finished_at: "2026-09-25T16:35:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Memilih Trx & Report Default di satu unit otomatis meng-uncheck pilihan di unit sebelumnya dan seketika meng-update card summary Trx & Report Default."
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
  notes: "Memilih Trx & Report Default di satu unit otomatis meng-uncheck pilihan di unit sebelumnya dan seketika meng-update card summary."
---

# TC-SYSPROD-15120-07: T07: Set Trx & Report Default di Unit Lain (Cross-Unit Mutual Exclusion)

## Konteks Pengujian (Card ETM-15120 — T07)

Memvalidasi default dimensi dan berat untuk transaksi dan pelaporan: perhitungan ongkos kirim internal, alur picking/packing gudang, dan laporan inventory memerlukan acuan D&W global tunggal yang konsisten.
