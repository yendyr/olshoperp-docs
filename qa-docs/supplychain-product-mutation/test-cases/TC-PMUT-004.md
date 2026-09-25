---
doc_type: e2e-test-case
tc_code: TC-PMUT-004
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
test_type: regression
title: "Akurasi kalkulasi Ending Balance pada SKU Fast-Moving & mutasi backdate (sejak 1 Juli 2026)"
summary: "Verifikasi nilai kolom Ending Balance pada baris mutasi SKU Fast-Moving terisi konsisten dan akurat sesuai akumulasi (Saldo Awal + In - Out) setelah kalkulasi manual dijalankan."
status: draft
owner: QA - Yemima
last_updated: 2026-09-24
requirement_ref: "qa-docs/supplychain-product-mutation/requirement.md"
card_ref: "ETM-15984"
automated: false
automated_spec: null
execution_company:
  id: null
  code: null
related_menus:
  - supplychain-product-ending-stock
  - supplychain-real-stock
preconditions:
  - "Manual calculation of ending balance telah dijalankan dan selesai sukses (TC-PMUT-003 passed)."
  - "Tersedia SKU Fast-Moving dengan riwayat mutasi reguler (Inbound PO + Outbound SO) sejak sebelum dan sesudah 1 Juli 2026."
test_data:
  - label: "SKU Fast-Moving"
    sku: "SKUCasing-Cinnamoroll"
    baseline_ending_balance_latest: null
    sample_date_mid: "2026-08-01"
    sample_date_latest: "2026-09-25"
steps:
  - "Buka menu Supply Chain -> Report -> Product Mutation History (/supplychain/product-mutation)."
  - "Pilih SKU Fast-Moving di dropdown Choose Product, lalu klik Apply."
  - "Amati baris mutasi paling awal di sekitar 1 Juli 2026: pastikan nilai Ending Balance terisi angka (bukan null/kosong/minus aneh)."
  - "Pilih sampel 3 baris mutasi secara berurutan di tengah periode (misal Agustus 2026): verifikasi rumus baris n: Ending Balance (n) = Ending Balance (n-1) + Product In (n) - Product Out (n)."
  - "Amati baris mutasi teratas (transaksi hari ini / terbaru): pastikan Ending Balance akhir sesuai dengan hasil akumulasi mutasi fisik."
expected_result: |
  1. Seluruh baris riwayat mutasi untuk SKU Fast-Moving memiliki kolom Ending Balance yang terisi lengkap.
  2. Nilai Ending Balance terhitung secara matematis konsisten (Saldo Baru = Saldo Lama + In - Out) dari transaksi backdate hingga transaksi terkini.
test_result:
  status: passed
  started_at: "2026-09-25T08:50:00+07:00"
  finished_at: "2026-09-25T08:56:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASS Akurasi Ending Balance SKU Fast-Moving SKUCasing-Cinnamoroll · Kolom Ending Balance terisi lengkap dan nilainya konsisten dengan akumulasi mutasi fisik (Saldo Baru = Saldo Lama + In - Out)"
  report_url: null
first_execution:
  at: "2026-09-25"
  via: "manual:resty"
  jira: "ETM-15984"
last_execution:
  at: "2026-09-25"
  jira: "ETM-15984"
  status: passed
  via: "manual:resty"
---

# TC-PMUT-004: Akurasi Kalkulasi Ending Balance pada SKU Fast-Moving & Mutasi Backdate (Sejak 1 Juli 2026)

## Konteks Pengujian (Card ETM-15984)

Memastikan bahwa pembaruan logika kalkulasi background tidak merusak integritas angka mutasi stok, terutama pada SKU dengan intensitas pergerakan stok tinggi dari pesanan penjualan (Sales Order) dan pembelian (Purchase Order).
