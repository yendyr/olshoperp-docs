---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091102
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Exclude VAT Tanpa Diskon
summary: "Memastikan nilai Unit Price (Before VAT) pada Purchase Return dari PO Exclude VAT tanpa diskon secara akurat menampilkan harga dasar DPP."
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

# TC-APR-JENNI-DRAFT-2026091102: Kalkulasi Unit Price Purchase Return dari PO Exclude VAT Tanpa Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada Purchase Return yang mengacu pada PO bertipe Exclude VAT (PPN ditambahkan di luar DPP) tanpa diskon secara akurat menampilkan harga dasar DPP sebelum penambahan PPN.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat PO inbound yang telah diselesaikan dengan ketentuan:
   - Pengaturan Pajak: **Exclude VAT (misal PPN 11% atau 12%)**
   - Diskon: **Tidak Ada (No Discount)**
   - Contoh Harga Satuan PO (DPP): **Rp 100.000** (Total per unit di PO setelah VAT = Rp 111.000 / Rp 112.000)
3. Stok SKU telah tersedia di gudang retur beli.

## Test Steps
1. Buka menu **Purchase Return** (`/accounting/purchase-return`).
2. Masukkan SKU dari PO Exclude VAT tanpa diskon ke baris detail Purchase Return.
3. Input **Qty Return** (contoh: 5 pcs).
4. Amati nilai pada kolom **Unit Price (Before VAT)** dan periksa apakah nilai tersebut terbebas dari komponen PPN Exclude.

## Expected Results
1. Kolom **Unit Price (Before VAT)** secara tepat menampilkan nilai DPP murni sebelum PPN: **Rp 100.000** (bukan Rp 111.000 / Rp 112.000).
2. Sistem tidak menambahkan komponen PPN Exclude ke dalam kolom Unit Price Return.
3. **Total Price Return** terhitung otomatis: `5 × Rp 100.000 = Rp 500.000`.
