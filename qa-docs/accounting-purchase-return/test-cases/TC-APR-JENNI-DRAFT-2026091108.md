---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091108
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient TRUE dengan Diskon
summary: "Memastikan nilai Unit Price (Before VAT) dari PO Include VAT (coefficient TRUE) dengan diskon dikalkulasikan berdasarkan DPP Koefisien."
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

# TC-APR-JENNI-DRAFT-2026091108: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient TRUE dengan Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return dari PO bertipe Include VAT dengan Koefisien Pajak (`coefficient = TRUE`) dan memiliki Diskon Pembelian berhasil dikalkulasikan secara akurat berdasarkan DPP Koefisien setelah diskon.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang selesai dengan ketentuan:
   - Pengaturan Pajak: **Include VAT**, Paper Tariff = **12%**, **`coefficient = TRUE`**
   - Diskon Pembelian terisi pada PO (misal diskon nominal atau persentase)
   - Nilai DPP Koefisien setelah diskon terhitung di PO
3. Stok SKU berada di lokasi retur beli.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Masukkan SKU dari PO Include VAT Koefisien TRUE berdiskon ke baris detail Purchase Return.
3. Input **Qty Return** (contoh: 2 pcs).
4. Amati nilai pada kolom **Unit Price (Before VAT)** dan **Total Price Return**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** secara tepat menampilkan nilai DPP setelah diskon yang diselaraskan dengan aturan Koefisien Pajak PPN yang berlaku.
2. Tidak terjadi selisih atau deviasi desimal pembulatan antara DPP bersih pada PO asal dan Unit Price pada Purchase Return.
3. Kolom **Total Price Return** mengalikan Qty Return dengan Unit Price Koefisien tersebut secara presisi.
