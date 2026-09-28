---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-03
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T03: Klik Edit pada Alternate Unit yang Belum Dipakai Transaksi"
summary: "Memastikan bahwa pada produk dengan alternate unit yang belum pernah digunakan dalam transaksi (misal ID 94470), klik tombol Edit membuka modal dengan seluruh field (Unit dan Qty Conversion) berstatus fully editable tanpa disable."
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
  - "Tersedia produk dengan alternate unit yang belum bertransaksi (misal: ID produk 94470)"
test_data:
  - field: "URL Edit Product"
    value: "https://staging.olshoperp.com/supplychain/product/edit/94470"
steps:
  - "1. Buka form edit produk melalui URL https://staging.olshoperp.com/supplychain/product/edit/94470"
  - "2. Scroll ke section Unit Configuration pada tabel Alternate Unit"
  - "3. Klik tombol Edit pada salah satu baris alternate unit yang belum bertransaksi"
  - "4. Verifikasi bahwa modal terbuka dan semua field (Unit dropdown dan Qty Conversion) berstatus editable (bisa diedit bebas)"
expected_result: |
  1. Modal Edit Unit terbuka dengan lancar.
  2. Field Unit dan Qty Conversion dapat diedit tanpa adanya disable ataupun warning banner transaksi.
test_result:
  status: passed
  started_at: "2026-09-27T21:18:00+07:00"
  finished_at: "2026-09-27T21:20:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Pada produk ID 94470 yang belum pernah dipakai transaksi, modal edit alternate unit terbuka dengan semua field (unit dan konversi) berstatus fully editable."
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
  notes: "Modal terbuka, field unit dan konversi dapat diedit secara bebas tanpa disable pada alternate unit yang belum dipakai transaksi (ID 94470)."
---

# TC-SYSPROD-15120-03: T03: Klik Edit pada Alternate Unit yang Belum Dipakai Transaksi

## Konteks Pengujian (Card ETM-15120 — T03)

Memvalidasi bahwa unit alternatif yang baru ditambahkan atau belum memiliki jejak transaksi tetap dapat disesuaikan secara bebas (edit unit dan konversi nilai) tanpa adanya pemblokiran sistem.
