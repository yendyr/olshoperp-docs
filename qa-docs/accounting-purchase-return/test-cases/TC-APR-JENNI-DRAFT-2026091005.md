---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091005
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Tampilan Kolom Unit Price (Before VAT) pada Modal Available Product
summary: "Memastikan tampilan kolom Unit Price (Before VAT) pada modal Available Product."
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

# TC-APR-JENNI-DRAFT-2026091005: Tampilan Kolom Unit Price (Before VAT) pada Modal Available Product

## Objective
Memastikan modal Available Product (saat memilih/menambah SKU yang akan di-return) menampilkan informasi/kolom Unit Price (Before VAT) sebagai referensi harga acuan return.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Berada di halaman pembuatan atau edit Purchase Return.

## Test Steps
1. Buka form **Purchase Return** (Create atau Edit).
2. Klik tombol **Add Product** / buka modal **Available Product**.
3. Periksa header dan baris data pada tabel modal Available Product.
4. Perhatikan keberadaan kolom **Unit Price (Before VAT)**.
5. Pilih salah satu SKU, input Qty Return, dan masukkan ke dokumen return.
6. Bandingkan nilai Unit Price di modal dengan yang muncul pada tabel detail setelah SKU ditambahkan.

## Expected Results
1. Modal **Available Product** menampilkan kolom **Unit Price (Before VAT)** secara jelas.
2. Nilai Unit Price (Before VAT) pada modal sama persis dengan nilai yang kemudian masuk ke baris Purchase Return Detail.
