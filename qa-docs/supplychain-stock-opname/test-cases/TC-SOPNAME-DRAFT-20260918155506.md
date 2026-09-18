---
doc_type: e2e-test-case
tc_code: PENDING-20260918155506
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: regression
title: "Verifikasi Regresi Input dan Approval Unit Price Desimal pada Menu Opening Stock"
summary: "Memastikan shared engine dan validasi harga pada Opening Stock ikut mendukung unit price desimal dan dapat di-approve dengan sukses."
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

# TC-SOPNAME-DRAFT-20260918155506: Verifikasi Regresi Input dan Approval Unit Price Desimal pada Menu Opening Stock

## Objective
Memastikan bahwa pelepasan guard whole-number pada shared engine Stock Opname juga berdampak positif secara konsisten pada menu Opening Stock (`/accounting/opening-stock`), sehingga user dapat menginput dan meng-approve Opening Stock dengan unit price desimal.

## Preconditions
1. User login ke OlshopERP Staging dengan hak akses Opening Stock.
2. Periode fiskal aktif untuk transaksi Opening Stock.

## Test Steps
1. Buka menu **Accounting → Opening Stock** (`/accounting/opening-stock`).
2. Buat atau buka dokumen Opening Stock berstatus `Open`.
3. Tambahkan baris produk dan masukkan kolom **Unit Price** dengan nilai desimal (contoh: `100.75`).
4. Simpan detail dan lakukan **Approve** dokumen Opening Stock.

## Expected Results
1. Pengisian Unit Price `100.75` berhasil disimpan tanpa error whole numbers.
2. Dokumen Opening Stock berhasil di-approve.
3. Saldo awal persediaan dan mutasi inbound tercatat dengan nilai desimal yang presisi.
