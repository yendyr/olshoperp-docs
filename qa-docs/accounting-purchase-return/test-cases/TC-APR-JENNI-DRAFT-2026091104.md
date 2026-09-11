---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091104
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient TRUE Tanpa Diskon
summary: "Memastikan nilai Unit Price (Before VAT) dari PO Include VAT (coefficient TRUE) diekstraksi menggunakan formula DPP Koefisien."
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

# TC-APR-JENNI-DRAFT-2026091104: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient TRUE Tanpa Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return dari PO bertipe Include VAT dengan aturan Koefisien Pajak (`coefficient = TRUE`) tanpa diskon secara presisi diekstraksi menggunakan formula DPP Koefisien yang berlaku (efektif 11% / paper 12%).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang selesai dengan ketentuan:
   - Pengaturan Pajak: **Include VAT**, Paper Tariff = **12%**, **`coefficient = TRUE`** (Tarif Efektif = 11%)
   - Diskon: **Tidak Ada (No Discount)**
   - Contoh Harga Satuan Gross PO: **Rp 112.000 / unit**
   - Nilai DPP Coefficient yang diakui sistem pada PO
3. Stok SKU tersedia di lokasi gudang retur beli.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Pilih SKU dari PO Include VAT (Coefficient TRUE) tanpa diskon ke detail Purchase Return.
3. Input **Qty Return** (contoh: 1 pcs).
4. Amati nilai pada kolom **Unit Price (Before VAT)**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** menampilkan nilai DPP dasar yang dihitung menggunakan formula Koefisien Pajak PPN (bukan nilai gross Rp 112.000).
2. Sistem secara konsisten menggunakan basis DPP hasil perhitungan koefisien yang sama antara PO/Inbound dan Purchase Return.
3. Nilai Total Price Return terhitung proporsional mengikuti nilai Unit Price hasil koefisien tersebut.
