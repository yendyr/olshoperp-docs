---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-11
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T11: Hapus Alternate Unit yang Belum Dipakai Transaksi"
summary: "Memastikan bahwa pada produk yang unit alternatifnya belum pernah digunakan dalam transaksi (misal: ID produk 94470), tombol Delete (ikon tempat sampah) pada baris unit tersebut aktif dan berfungsi dengan baik untuk menghapus alternate unit beserta konfigurasi D&W-nya."
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
  - "Tersedia produk dengan alternate unit yang belum pernah transaksi (misal: ID produk 94470)"
test_data:
  - field: "URL Edit Product"
    value: "https://staging.olshoperp.com/supplychain/product/edit/94470"
steps:
  - "1. Buka form edit produk melalui URL https://staging.olshoperp.com/supplychain/product/edit/94470"
  - "2. Scroll ke section Unit Configuration pada tabel Alternate Unit"
  - "3. Cari baris alternate unit yang belum pernah digunakan dalam transaksi"
  - "4. Klik tombol Delete (ikon tempat sampah) pada baris unit tersebut"
  - "5. Verifikasi bahwa unit tersebut berhasil terhapus dari tabel Alternate Unit"
expected_result: |
  1. Tombol Delete pada baris alternate unit aktif dan dapat diklik.
  2. Alternate unit yang belum digunakan transaksi berhasil terhapus dari konfigurasi produk.
test_result:
  status: passed
  started_at: "2026-09-27T21:18:00+07:00"
  finished_at: "2026-09-27T21:20:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Pada produk ID 94470 (belum transaksi), tombol delete pada baris alternate unit aktif dan berhasil menghapus alternate unit yang dipilih."
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
  notes: "Tombol delete pada baris alternate unit aktif dan berhasil menghapus unit terkait pada produk yang belum dipakai transaksi (ID 94470)."
---

# TC-SYSPROD-15120-11: T11: Hapus Alternate Unit yang Belum Dipakai Transaksi

## Konteks Pengujian (Card ETM-15120 — T11)

Memvalidasi bahwa user memiliki fleksibilitas penuh untuk membersihkan atau menghapus unit alternatif yang salah diinput atau belum pernah digunakan dalam aktivitas transaksi.
