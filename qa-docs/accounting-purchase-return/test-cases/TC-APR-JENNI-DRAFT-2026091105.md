---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091105
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Non-VAT dengan Diskon
summary: "Memastikan nilai Unit Price (Before VAT) dari PO Non-VAT yang memiliki diskon dihitung sebagai nilai bersih setelah diskon."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-11
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

# TC-APR-JENNI-DRAFT-2026091105: Kalkulasi Unit Price Purchase Return dari PO Non-VAT dengan Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return dari PO bertipe Non-VAT yang memiliki Diskon Pembelian dihitung secara akurat sebagai nilai bersih setelah diskon (`Price PO - Discount per unit`).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang selesai dengan ketentuan:
   - Pengaturan Pajak: **Non-VAT / Non-Tax (0%)**
   - Harga Satuan PO: **Rp 100.000 / unit**
   - Diskon Pembelian: **Rp 15.000 / unit** (atau diskon 15%)
   - Harga Bersih di PO: `Rp 100.000 - Rp 15.000 = Rp 85.000`
3. Stok SKU berada di lokasi retur beli.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Tambahkan SKU dari PO Non-VAT berdiskon tersebut ke baris detail return.
3. Input **Qty Return** (contoh: 4 pcs).
4. Amati nilai pada kolom **Unit Price (Before VAT)** dan **Total Price Return**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** secara tepat menampilkan nilai **after discount**: **Rp 85.000** (bukan harga kotor Rp 100.000).
2. Kolom **Total Price Return** mengkalkulasi otomatis: `4 × Rp 85.000 = Rp 340.000`.
3. Diskon pembelian berhasil diakomodasi sebagai pengurang nilai acuan pengembalian barang ke supplier.
