---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-12
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T12: Proteksi Hapus Alternate Unit yang Sudah Dipakai Transaksi (Delete Disabled)"
summary: "Memastikan bahwa pada produk yang unit alternatifnya sudah pernah digunakan dalam transaksi (misal: alternate unit box pada produk ID 92638), tombol Delete pada baris unit tersebut berstatus disabled (atau tidak tersedia) guna memproteksi data transaksi historis dari penghapusan."
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
  - "Tersedia produk dengan alternate unit yang sudah pernah transaksi (misal: ID produk 92638, unit box)"
test_data:
  - field: "URL Edit Product"
    value: "https://staging.olshoperp.com/supplychain/product/edit/92638"
steps:
  - "1. Buka form edit produk melalui URL https://staging.olshoperp.com/supplychain/product/edit/92638"
  - "2. Scroll ke section Unit Configuration pada tabel Alternate Unit"
  - "3. Cari baris alternate unit 'box' yang sudah pernah bertransaksi"
  - "4. Periksa tombol Delete (ikon tempat sampah) pada baris unit tersebut"
  - "5. Verifikasi bahwa tombol Delete berstatus disabled (tidak bisa diklik / locked) dan unit tidak dapat dihapus"
expected_result: |
  1. Tombol Delete pada baris alternate unit yang sudah bertransaksi berstatus disabled.
  2. Sistem mencegah aksi penghapusan unit untuk menjaga integritas data transaksi.
test_result:
  status: passed
  started_at: "2026-09-27T21:20:00+07:00"
  finished_at: "2026-09-27T21:21:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Pada produk ID 92638 (alternate unit box sudah pernah transaksi), tombol delete pada baris unit tersebut berstatus disabled dan tidak bisa dihapus."
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
  notes: "Tombol delete pada unit alternate transaksi (box) berstatus disabled / diproteksi sehingga tidak bisa dihapus (ID 92638)."
---

# TC-SYSPROD-15120-12: T12: Proteksi Hapus Alternate Unit yang Sudah Dipakai Transaksi (Delete Disabled)

## Konteks Pengujian (Card ETM-15120 — T12)

Memvalidasi proteksi integritas transaksi data: sistem dilarang keras mengizinkan penghapusan unit alternatif yang sudah pernah terikat pada Sales Order, Purchase Order, Surat Jalan, atau Mutasi Stok.
