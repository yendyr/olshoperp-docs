---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091001
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Tampilan Kolom Unit Price (Before VAT) & Total Price Return pada Halaman Edit dan Show Purchase Return
summary: "Memastikan kolom Unit Price (Before VAT) dan Total Price Return muncul secara default, read-only, di sebelah kiri kolom Location."
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

# TC-APR-JENNI-DRAFT-2026091001: Tampilan Kolom Unit Price (Before VAT) & Total Price Return pada Halaman Edit dan Show Purchase Return

## Objective
Memastikan kolom `Unit Price (Before VAT)` dan `Total Price Return` muncul secara default (visible = true), bersifat read-only, dan berada di sebelah kiri kolom Location pada section Purchase Return Detail di halaman Edit maupun Show.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Scope Company: `Dev Staging`.
3. Terdapat dokumen Purchase Return dengan minimal 1 baris detail.

## Test Steps
1. Buka menu **Finance / Accounting → Purchase Return** (`/accounting/purchase-return`).
2. Klik tombol **Edit** pada salah satu transaksi Purchase Return yang memiliki baris detail.
3. Perhatikan kolom-kolom pada section **Purchase Return Detail**.
4. Amati posisi kolom `Unit Price (Before VAT)` dan `Total Price Return` terhadap kolom `Location`.
5. Coba lakukan klik / inline edit pada nilai di kedua kolom tersebut.
6. Buka halaman **Show** untuk transaksi Purchase Return yang sama.

## Expected Results
1. Di halaman **Edit** dan **Show**, kolom `Unit Price (Before VAT)` dan `Total Price Return` tampil secara default (*visible = true*).
2. Posisi kedua kolom terletak tepat di **sebelah kiri kolom Location**.
3. Kedua kolom berstatus **read-only** (tidak dapat diedit secara langsung).
4. Nilai yang ditampilkan pada halaman Edit dan Show identik dan konsisten.
