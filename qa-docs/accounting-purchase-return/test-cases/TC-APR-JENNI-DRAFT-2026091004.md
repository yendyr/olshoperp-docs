---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091004
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Verifikasi Basis Nilai Unit Price Bersumber dari After Discount, Before VAT
summary: "Memastikan basis nilai Unit Price bersumber dari After Discount, Before VAT."
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

# TC-APR-JENNI-DRAFT-2026091004: Verifikasi Basis Nilai Unit Price Bersumber dari After Discount, Before VAT

## Objective
Memastikan Unit Price (Before VAT) mengambil nilai dasar harga beli yang telah dipotong diskon namun sebelum pengenaan PPN/VAT (bukan after VAT dan bukan before discount).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat dokumen asal / transaksi pembelian yang memiliki komponen Diskon dan PPN (VAT).

## Test Steps
1. Buat dokumen Purchase Return yang mengacu pada transaksi pembelian berdiskon dan ber-PPN (misal: Harga List 100.000, Diskon 10.000, PPN 11%).
2. Amati nilai yang tampil pada kolom **Unit Price (Before VAT)** di baris detail return.
3. Cek apakah nilai tersebut adalah 90.000 (after discount, before VAT) atau 99.900 (after VAT) atau 100.000 (before discount).

## Expected Results
1. Nilai **Unit Price (Before VAT)** secara tepat adalah nilai **setelah diskon dan sebelum PPN** (contoh: Rp 90.000).
2. Sistem tidak memasukkan komponen pajak PPN/VAT ke dalam kolom Unit Price (Before VAT).
