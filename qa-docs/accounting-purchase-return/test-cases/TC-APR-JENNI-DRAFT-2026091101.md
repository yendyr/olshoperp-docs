---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091101
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Unit Price Purchase Return dari PO Non-VAT Tanpa Diskon
summary: "Memastikan nilai Unit Price (Before VAT) pada baris Purchase Return Detail menampilkan nilai harga satuan murni dari PO Non-VAT tanpa diskon."
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

# TC-APR-JENNI-DRAFT-2026091101: Kalkulasi Unit Price Purchase Return dari PO Non-VAT Tanpa Diskon

## Objective
Memastikan nilai `Unit Price (Before VAT)` pada baris Purchase Return Detail menampilkan nilai harga satuan murni dari Purchase Order (PO) yang bertipe Non-VAT/Non-Tax dan tanpa diskon (Unit Price Return = Price PO).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat Purchase Order (PO) inbound yang telah selesai/approved dengan ketentuan:
   - Pengaturan Pajak: **Non-VAT / Non-Tax (0%)**
   - Diskon Baris / Header: **Tidak Ada (No Discount / 0)**
   - Contoh Harga Satuan PO: **Rp 100.000 / unit**
3. Stok SKU dari PO tersebut telah masuk dan berada di gudang Purchase Return (*Seruni Gudang Retur Beli*).

## Test Steps
1. Buka menu **Finance / Accounting → Purchase Return** (`/accounting/purchase-return`).
2. Buat dokumen Purchase Return baru atau edit transaksi return.
3. Tambahkan SKU target yang berasal dari PO Non-VAT tanpa diskon tersebut ke dalam detail Purchase Return.
4. Input **Qty Return** (contoh: 2 pcs).
5. Amati nilai yang tampil pada kolom **Unit Price (Before VAT)** dan **Total Price Return**.

## Expected Results
1. Kolom **Unit Price (Before VAT)** secara presisi bernilai sama dengan harga PO: **Rp 100.000**.
2. Kolom **Total Price Return** mengkalkulasi otomatis: `2 × Rp 100.000 = Rp 200.000`.
3. Nilai harga tampil secara read-only dan konsisten di halaman Edit, Show, serta modal detail.
