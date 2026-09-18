---
doc_type: e2e-test-case
tc_code: PENDING-20260918155505
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: edge
title: "Approval Stock Opname dengan Fallback Harga Desimal dari Master Benchmark COGS"
summary: "Memastikan ketika unit price dikosongkan dan sistem mengambil fallback Benchmark COGS yang bernilai desimal, dokumen tetap dapat di-approve tanpa bentrok validasi."
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

# TC-SOPNAME-DRAFT-20260918155505: Approval Stock Opname dengan Fallback Harga Desimal dari Master Benchmark COGS

## Objective
Menguji skenario di mana user tidak menginput Unit Price secara manual pada baris surplus, sehingga sistem mengambil fallback nilai dari master Benchmark COGS yang mengandung nilai desimal (contoh: `9999.25`), memastikan tidak terjadi kegagalan validasi saat dokumen di-approve.

## Preconditions
1. Terdapat SKU produk yang memiliki nilai Benchmark COGS berupa angka desimal di menu `/accounting/product-benchmark-price` (contoh: Rp 9.999,25).
2. Dokumen Stock Opname memiliki baris surplus untuk SKU tersebut dengan kolom Unit Price manual dibiarkan kosong (0 / null).

## Test Steps
1. Buka dokumen Stock Opname terkait.
2. Pastikan nilai acuan harga mengambil fallback Benchmark COGS (`9999.25`).
3. Lakukan proses **Approve** pada dokumen Stock Opname di menu Stock Opname Approval.

## Expected Results
1. Dokumen berhasil disetujui (Approved) secara mulus.
2. Tidak terjadi bentrok validasi harga desimal dari master Benchmark COGS.
3. Dokumen Adjustment Addition terbentuk dengan harga satuan mengikuti nilai Benchmark COGS desimal tersebut.
