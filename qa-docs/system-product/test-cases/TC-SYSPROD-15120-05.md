---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-05
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T05: Tambah D&W Profile dari Modal Konfigurasi D&W"
summary: "Memastikan bahwa pada modal konfigurasi Dimensi & Berat (D&W), tombol '+ Add D&W profile' berfungsi dengan baik untuk menambahkan baris profil baru yang dapat diisi label D&W dan ukuran dimensi (L, W, H, Weight) secara inline."
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
  - "Buka form edit produk (misal: SKU-COLLI01)"
test_data:
  - field: "Sample SKU"
    value: "SKU-COLLI01"
steps:
  - "1. Buka form edit untuk produk SKU-COLLI01 (/supplychain/product)"
  - "2. Buka modal konfigurasi Dimensi & Berat (D&W)"
  - "3. Klik tombol '+ Add D&W profile' di dalam modal"
  - "4. Verifikasi bahwa baris profil baru otomatis bertambah di dalam tabel"
  - "5. Isi label D&W dan masukkan nilai numerik pada field L, W, H, dan Weight"
  - "6. Verifikasi baris profil baru tersimpan dan tercatat pada konfigurasi D&W unit tersebut"
expected_result: |
  1. Tombol '+ Add D&W profile' responsif.
  2. Baris profil baru bertambah dan mendukung inline edit untuk L, W, H, dan Weight.
test_result:
  status: passed
  started_at: "2026-09-25T16:15:00+07:00"
  finished_at: "2026-09-25T16:17:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Tombol + Add D&W profile di dalam modal berfungsi menambah profil baru dengan field L, W, H, Weight yang dapat diisi."
  report_url: "https://app.betterbugs.io/session/6ab638669a0216b8a623b2f7"
first_execution:
  at: "2026-09-25"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-25"
  jira: "ETM-15120"
  status: passed
  via: "manual:resty"
  notes: "Tombol + Add D&W profile di dalam modal berfungsi menambah profil baru dengan field L, W, H, Weight yang dapat diisi secara inline."
---

# TC-SYSPROD-15120-05: T05: Tambah D&W Profile dari Modal Konfigurasi D&W

## Konteks Pengujian (Card ETM-15120 — T05)

Memvalidasi penambahan profil dimensi dan berat baru dari dalam modal D&W, memungkinkan multi-packaging/dimensi per unit produk untuk kebutuhan operasional logistik yang variatif.
