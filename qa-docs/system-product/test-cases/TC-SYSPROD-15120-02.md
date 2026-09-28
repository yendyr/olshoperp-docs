---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-02
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T02: Klik Edit pada Primary Unit yang Sudah Dipakai Transaksi"
summary: "Memastikan bahwa pada produk yang sudah pernah digunakan dalam transaksi (misal: SKU-COLLI01), klik tombol Edit pada Primary Unit membuka modal dengan field Unit dan Qty Conversion dalam keadaan disabled (terkunci rapat) serta menampilkan warning banner perlindungan transaksi."
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
  - "Tersedia SKU yang sudah pernah bertransaksi (misal: SKU-COLLI01)"
test_data:
  - field: "Sample SKU"
    value: "SKU-COLLI01"
steps:
  - "1. Buka form edit untuk produk SKU-COLLI01 (/supplychain/product)"
  - "2. Pada section Unit Configuration, klik tombol Edit pada baris Primary Unit"
  - "3. Verifikasi modal Edit Unit terbuka"
  - "4. Verifikasi bahwa field Unit dan Qty Conversion dalam status disabled (terkunci, tidak bisa diubah)"
  - "5. Verifikasi tampil warning banner pemberitahuan bahwa unit sudah digunakan dalam transaksi"
expected_result: |
  1. Modal Edit Unit terbuka dengan normal.
  2. Field Unit dan Qty Conversion berstatus disabled.
  3. Warning banner perlindungan transaksi tampil di dalam modal.
test_result:
  status: passed
  started_at: "2026-09-25T16:15:00+07:00"
  finished_at: "2026-09-25T16:17:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Pada SKU-COLLI01 yang sudah dipakai transaksi, modal Edit Unit terbuka dengan field Unit dan Qty Conversion disabled, serta warning banner tampil."
  report_url: "https://app.betterbugs.io/session/6ab636e99a0216b8a623b2a4"
first_execution:
  at: "2026-09-25"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-25"
  jira: "ETM-15120"
  status: passed
  via: "manual:resty"
  notes: "Modal terbuka, field Primary Unit dan konversi berstatus disabled (terkunci rapat tidak dapat diubah-ubah lagi) karena sudah pernah transaksi."
---

# TC-SYSPROD-15120-02: T02: Klik Edit pada Primary Unit yang Sudah Dipakai Transaksi

## Konteks Pengujian (Card ETM-15120 — T02)

Memvalidasi proteksi transaksi pada level Primary Unit: ketika SKU sudah pernah digunakan dalam transaksi apapun, identitas Primary Unit dan faktor konversinya dikunci secara permanen guna mencegah inkonsistensi data historis transaksi dan mutasi stok.
