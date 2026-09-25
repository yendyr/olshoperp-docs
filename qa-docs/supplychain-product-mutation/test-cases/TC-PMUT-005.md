---
doc_type: e2e-test-case
tc_code: TC-PMUT-005
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
test_type: regression
title: "Konsistensi Ending Balance terhadap transaksi variasi stok (Transfer TF, Opname AI/AO, Retur PT)"
summary: "Verifikasi bahwa transaksi non-penjualan reguler (Transfer TF, Adjustment In/Out AI/AO, Retur PT) tercatat dan mengupdate kolom Ending Balance secara konsisten setelah kalkulasi manual."
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
  - "Tersedia SKU yang memiliki riwayat mutasi transfer (TF), penyesuaian stok opname (AI/AO), atau retur penjualan/pembelian (PT)."
test_data:
  - label: "SKU Variasi Mutasi"
    sku: "SKUCasing-HelloKitty"
    has_mutation_types: ["TF", "AI", "AO", "PT"]
steps:
  - "Buka menu Supply Chain -> Report -> Product Mutation History (/supplychain/product-mutation)."
  - "Pilih SKU yang memiliki transaksi variasi di Choose Product, klik Apply."
  - "Gunakan Global Search atau filter untuk menemukan baris dengan kode mutasi TF (Transfer), AI (Adjustment In), AO (Adjustment Out), atau PT (Retur)."
  - "Verifikasi bahwa baris TF/AI/AO/PT tersebut memiliki nilai Product In atau Product Out yang sesuai."
  - "Verifikasi kolom Ending Balance pada baris tersebut bertambah (untuk IN/AI/PT-retur masuk) atau berkurang (untuk OUT/AO/TF-keluar) secara akurat dibanding baris sebelumnya."
expected_result: |
  1. Transaksi dengan kode mutasi variasi (TF, AI, AO, PT) tetap terhitung secara presisi dalam rantai akumulasi Ending Balance.
  2. Tidak ada mutasi khusus yang terlewat atau bernilai null pada kolom Ending Balance.
test_result:
  status: passed
  started_at: "2026-09-25T08:50:00+07:00"
  finished_at: "2026-09-25T08:56:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASS Konsistensi Ending Balance SKU Mutasi Variasi SKUCasing-HelloKitty & CHARMBUN03 · Transaksi variasi (TF, AI/AO, PT) terhitung presisi ke Ending Balance"
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

# TC-PMUT-005: Konsistensi Ending Balance terhadap Transaksi Variasi Stok (Transfer TF, Opname AI/AO, Retur PT)

## Konteks Pengujian (Card ETM-15984)

Memvalidasi bahwa engine kalkulasi ending balance baru mendukung seluruh jenis transaksi stok yang ada di OlshopERP (`IN`, `OT`, `AI`, `TF`, `PT`, `AO`) tanpa ada diskrepansi logika akumulasi saldo.
