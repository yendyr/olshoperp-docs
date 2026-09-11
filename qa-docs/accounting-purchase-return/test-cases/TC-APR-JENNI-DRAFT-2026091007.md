---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091007
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Verifikasi Isolasi Perhitungan Total Price Return pada Transaksi Multi-Baris Detail
summary: "Memastikan isolasi perhitungan Total Price Return pada transaksi multi-baris detail."
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

# TC-APR-JENNI-DRAFT-2026091007: Verifikasi Isolasi Perhitungan Total Price Return pada Transaksi Multi-Baris Detail

## Objective
Memastikan pada dokumen Purchase Return yang memiliki beberapa baris SKU berbeda (dengan variasi harga, diskon, dan qty), perhitungan Total Price Return setiap baris tetap terisolasi dan tidak tertukar.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Berada di form Purchase Return.

## Test Steps
1. Buat atau buka Purchase Return dengan minimal 3 baris SKU yang berbeda:
   - Baris 1: SKU A, Qty = 2, Unit Price = 50.000
   - Baris 2: SKU B, Qty = 3, Unit Price = 120.000
   - Baris 3: SKU C, Qty = 1, Unit Price = 75.000
2. Periksa kolom **Total Price Return** pada masing-masing baris.
3. Ubah Qty pada Baris 2 (misal dari 3 menjadi 4).
4. Amati kolom Total Price Return pada Baris 1, Baris 2, dan Baris 3.

## Expected Results
1. Masing-masing baris menampilkan Total Price Return yang presisi:
   - Baris 1 = 100.000
   - Baris 2 = 360.000 (menjadi 480.000 setelah qty diubah)
   - Baris 3 = 75.000
2. Perubahan qty pada Baris 2 hanya mempengaruhi Total Price Return Baris 2, tanpa mempengaruhi atau merusak nilai baris lainnya (*no cross-row leakage*).
