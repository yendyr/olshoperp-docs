---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-PASS-01
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: happy
title: "Input Unit Price Desimal Minimal 2 Angka Dibelakang Koma pada Detail Stock Opname Surplus"
summary: "Memastikan user dapat menginput nilai desimal (minimal 2 desimal di UI dan hingga 4 desimal di backend) pada kolom Unit Price baris surplus tanpa ditolak validasi whole numbers."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-18
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15968
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-stock-opname-approval
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

# TC-SOPNAME-PASS-01: Input Unit Price Desimal Minimal 2 Angka Dibelakang Koma pada Detail Stock Opname Surplus

## Objective
Memvalidasi bahwa penyesuaian pada kolom UNIT PRICE di detail Stock Opname / Stock Opname Approval mengizinkan input angka desimal (minimal 2 angka di belakang koma, misal `12500.50`) untuk baris surplus (Adjustment In) dan tidak lagi memunculkan pesan error penolakan desimal.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com` | scope `FAT`).
2. Terdapat dokumen Stock Opname baru berstatus `Open` di menu Stock Opname (`/supplychain/stock-opname`) atau Stock Opname Approval (`/accounting/stock-opname-approval`).
3. Terdapat SKU produk surplus di mana Actual Qty > System Qty (selisih positif / Adjustment Addition).

## Test Steps
1. Buka menu **Supply Chain → Stock Opname** (`/supplychain/stock-opname`) atau **Accounting → Stock Opname Approval** (`/accounting/stock-opname-approval`).
2. Buka dokumen Stock Opname target yang berstatus `Open`.
3. Pada tabel detail produk, cari baris produk yang mengalami surplus stok (Difference > 0).
4. Pada kolom **Unit Price**, masukkan angka desimal 2 angka di belakang koma (contoh: `12500.50`).
5. Klik tombol **Save / Update Detail**.

## Expected Results
1. Input nilai desimal `12500.50` pada kolom Unit Price diterima dengan sukses oleh sistem.
2. Tidak muncul pesan error validasi: *"Unit Price must be entered in whole numbers not decimals"*.
3. Nilai Unit Price tersimpan di database dengan format desimal yang presisi (kolom `decimal(21,4)`).
4. Nilai total amount kalkulasi baris menyesuaikan secara akurat (`Difference Qty × 12500.50`).
