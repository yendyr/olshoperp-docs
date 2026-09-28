---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-04
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T04: Klik Edit pada Alternate Unit yang Sudah Dipakai Transaksi"
summary: "Memastikan bahwa pada produk dengan alternate unit yang sudah pernah digunakan dalam transaksi (misal: unit box pada produk ID 92638), klik tombol Edit membuka modal dengan field Unit dan Qty Conversion dalam kondisi disabled (terkunci rapat) serta menampilkan warning banner."
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
  - "Tersedia produk dengan alternate unit yang sudah pernah bertransaksi (misal: ID produk 92638, unit box)"
test_data:
  - field: "URL Edit Product"
    value: "https://staging.olshoperp.com/supplychain/product/edit/92638"
steps:
  - "1. Buka form edit produk melalui URL https://staging.olshoperp.com/supplychain/product/edit/92638"
  - "2. Scroll ke section Unit Configuration pada tabel Alternate Unit"
  - "3. Cari baris alternate unit 'box' yang sudah pernah bertransaksi"
  - "4. Klik tombol Edit pada baris unit tersebut"
  - "5. Verifikasi bahwa modal terbuka dan field Unit dropdown serta Qty Conversion berstatus disabled (terkunci)"
  - "6. Verifikasi tampil warning banner transaksi"
expected_result: |
  1. Modal Edit Unit terbuka.
  2. Field Unit dan Qty Conversion pada unit yang sudah bertransaksi berstatus disabled.
  3. Warning banner perlindungan transaksi tampil di dalam modal.
test_result:
  status: passed
  started_at: "2026-09-27T21:20:00+07:00"
  finished_at: "2026-09-27T21:21:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Pada produk ID 92638 dengan alternate unit 'box' yang pernah bertransaksi, modal edit unit menampilkan field Unit dan Qty Conversion disabled serta terlindungi."
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
  notes: "Modal terbuka, field Alternate Unit (box) dan konversinya terkunci disabled karena sudah pernah bertransaksi (ID 92638)."
---

# TC-SYSPROD-15120-04: T04: Klik Edit pada Alternate Unit yang Sudah Dipakai Transaksi

## Konteks Pengujian (Card ETM-15120 — T04)

Memvalidasi proteksi integritas transaksi pada Alternate Unit: unit alternatif yang sudah terlibat dalam transaksi pesanan, mutasi, atau inventory tidak diizinkan diubah nama unit maupun nilai konversinya guna menjaga validitas kalkulasi stok dan laporan finansial.
