---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091103
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient FALSE Tanpa Diskon
summary: "Memastikan nilai Unit Price (Before VAT) dari PO Include VAT (coefficient FALSE) diekstraksi menjadi DPP Before VAT."
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

# TC-APR-JENNI-DRAFT-2026091103: Kalkulasi Unit Price Purchase Return dari PO Include VAT Coefficient FALSE Tanpa Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return dari PO bertipe Include VAT standar (`coefficient = FALSE`) tanpa diskon berhasil diekstraksi kembali menjadi harga DPP Before VAT dengan pembagi `(1 + Tariff)`.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang selesai dengan ketentuan:
   - Pengaturan Pajak: **Include VAT**, Tarif = **11%**, **`coefficient = FALSE`**
   - Diskon: **Tidak Ada (No Discount)**
   - Contoh Harga Gross PO (Include): **Rp 111.000 / unit**
   - Nilai DPP Before VAT di PO: `Rp 111.000 / 1.11 = Rp 100.000`
3. Stok SKU berada di lokasi Purchase Return.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Tambahkan SKU dari PO Include VAT (Coefficient FALSE) tanpa diskon ke detail return.
3. Input **Qty Return** (contoh: 3 pcs).
4. Periksa nilai yang muncul pada kolom **Unit Price (Before VAT)**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** menampilkan nilai hasil pemisahan pajak include standar: **Rp 100.000** (`Gross PO / 1.11`), bukan nilai gross include Rp 111.000.
2. Kolom **Total Price Return** mengkalkulasi: `3 × Rp 100.000 = Rp 300.000`.
3. Nilai yang ditampilkan sinkron antara modal Available Product dan baris detail dokumen return.
