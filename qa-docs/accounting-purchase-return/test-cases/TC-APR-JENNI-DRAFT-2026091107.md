---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091107
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient FALSE dengan Diskon
summary: "Memastikan nilai Unit Price (Before VAT) dari PO Include VAT (coefficient FALSE) dengan diskon diekstraksi dengan benar."
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

# TC-APR-JENNI-DRAFT-2026091107: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient FALSE dengan Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return dari PO bertipe Include VAT standar (`coefficient = FALSE`) dengan Diskon Pembelian diekstraksi dengan benar (`(Gross Price - Discount) / (1 + Tariff)`).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang selesai dengan ketentuan:
   - Pengaturan Pajak: **Include VAT**, Tarif = **11%**, **`coefficient = FALSE`**
   - Harga Satuan Gross PO (Include): **Rp 111.000 / unit**
   - Diskon Pembelian: **Rp 11.100 / unit** (Nilai Gross Net = Rp 99.900)
   - Nilai DPP Net Before VAT: `Rp 99.900 / 1.11 = Rp 90.000`
3. Stok SKU berada di lokasi retur beli.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Tambahkan SKU dari PO Include VAT berdiskon (Coefficient FALSE) ke detail return.
3. Input **Qty Return** (contoh: 3 pcs).
4. Amati nilai pada kolom **Unit Price (Before VAT)** dan **Total Price Return**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** secara tepat bernilai **Rp 90.000** (nilai DPP bersih setelah pemotongan diskon dan pemisahan PPN Include).
2. Sistem tidak menggunakan nilai gross include berdiskon (Rp 99.900) ataupun nilai include sebelum diskon (Rp 111.000).
3. Kolom **Total Price Return** terhitung: `3 × Rp 90.000 = Rp 270.000`.
