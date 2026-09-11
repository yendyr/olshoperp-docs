---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091003
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Konversi Unit Price (Before VAT) dan Perhitungan Total Return untuk Alternatif Unit
summary: "Memastikan konversi Unit Price (Before VAT) dan perhitungan Total Return untuk alternatif unit."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-10
requirement_ref: "qa-docs/accounting-purchase-return/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15858
first_execution:
  at: null
  jira: null
  via: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-APR-JENNI-DRAFT-2026091003: Konversi Unit Price (Before VAT) dan Perhitungan Total Return untuk Alternatif Unit

## Objective
Memastikan jika baris return menggunakan Alternatif Unit, sistem mengonversi Unit Price (Before VAT) secara tepat dari primary unit (`Price Primary × Conversion Rate`), dan Total Price Return terhitung berdasarkan Qty Alternatif Unit.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat SKU produk yang memiliki Alternatif Unit (contoh: Primary Unit = Pcs, Alternatif Unit = Dus dengan rasio 1 Dus = 12 Pcs).

## Test Steps
1. Buka halaman **Edit Purchase Return**.
2. Tambahkan atau pilih baris SKU yang memiliki alternatif unit.
3. Pilih unit transaksi pengembalian menggunakan **Alternatif Unit** (contoh: Dus).
4. Amati nilai **Unit Price (Before VAT)** yang muncul.
5. Periksa nilai **Total Price Return**.

## Expected Results
1. **Unit Price (Before VAT)** otomatis menyesuaikan unit transaksi yang dipilih: `Harga Primary Unit × Nilai Konversi Alternatif Unit`.
2. **Total Price Return** terkalkulasi dari `Qty Return (Alternatif Unit) × Unit Price Konversi (Before VAT)`.
3. Jika unit dikembalikan ke Primary Unit, Unit Price dan Total Price Return kembali ke perhitungan satuan primary.
