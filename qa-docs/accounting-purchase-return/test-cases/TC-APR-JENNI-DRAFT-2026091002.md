---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091002
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Kalkulasi Otomatis Total Price Return Berdasarkan Qty Return dan Unit Price (Before VAT)
summary: "Memastikan kalkulasi otomatis Total Price Return berdasarkan Qty Return dan Unit Price (Before VAT)."
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

# TC-APR-JENNI-DRAFT-2026091002: Kalkulasi Otomatis Total Price Return Berdasarkan Qty Return dan Unit Price (Before VAT)

## Objective
Memastikan nilai Total Price Return terhitung otomatis dengan rumus `Qty Return × Unit Price (Before VAT)` dan nilainya langsung ter-update secara proporsional saat Qty Return diubah.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Berada di halaman Edit Purchase Return dengan minimal 1 baris detail.

## Test Steps
1. Buka halaman **Edit Purchase Return**.
2. Pada baris detail produk, catat nilai **Unit Price (Before VAT)** dan **Qty Return** yang tertera.
3. Hitung manual: `Total Price Return = Qty Return × Unit Price (Before VAT)`.
4. Bandingkan dengan nilai yang tampil di kolom **Total Price Return**.
5. Ubah nilai **Qty Return** (contoh: dari 2 menjadi 5 atau 10).
6. Periksa perubahan nilai pada kolom **Total Price Return**.

## Expected Results
1. Kolom **Total Price Return** secara presisi bernilai `Qty Return × Unit Price (Before VAT)`.
2. Saat **Qty Return** diubah, nilai **Total Price Return** secara dinamis dan real-time langsung ter-update secara proporsional tanpa perlu reload halaman.
3. Format angka dan pemisah desimal/ribuan mengikuti format standar mata uang di OlshopERP.
