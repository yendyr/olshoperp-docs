---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091106
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Exclude VAT dengan Diskon
summary: "Memastikan nilai Unit Price (Before VAT) dari PO Exclude VAT dengan diskon dihitung dari harga dasar setelah diskon."
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

# TC-APR-JENNI-DRAFT-2026091106: Kalkulasi Unit Price Purchase Return dari PO Exclude VAT dengan Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return dari PO bertipe Exclude VAT dengan Diskon Pembelian dihitung dari harga dasar setelah diskon dan sebelum penambahan PPN Exclude (`(Price PO - Discount) Before VAT`).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang selesai dengan ketentuan:
   - Pengaturan Pajak: **Exclude VAT (11%)**
   - Harga Satuan Dasar (DPP): **Rp 100.000 / unit**
   - Diskon Pembelian: **Rp 20.000 / unit**
   - Nilai DPP Setelah Diskon (Before VAT): `Rp 100.000 - Rp 20.000 = Rp 80.000`
   - PPN Exclude (11% dari Rp 80.000): Rp 8.800 (Total tagihan per unit di PO = Rp 88.800)
3. Stok SKU berada di lokasi retur beli.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Masukkan SKU dari PO Exclude VAT berdiskon ke detail Purchase Return.
3. Input **Qty Return** (contoh: 2 pcs).
4. Periksa nilai kolom **Unit Price (Before VAT)** dan **Total Price Return**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** secara tepat menampilkan nilai **Rp 80.000** (nilai setelah diskon dan sebelum penambahan PPN Exclude).
2. Sistem tidak mengambil nilai kotor Rp 100.000 maupun nilai setelah pajak Rp 88.800.
3. Kolom **Total Price Return** bernilai: `2 × Rp 80.000 = Rp 160.000`.
