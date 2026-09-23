---
doc_type: e2e-test-case
tc_code: PENDING-20260918155504
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: negative
title: "Validasi Penolakan Input Nilai Qty Manual Desimal pada Detail Stock Opname"
summary: "Memastikan batas guard input manual Qty Opname tetap mewajibkan bilangan bulat (whole number) dan menolak pecahan desimal, menjaga konsistensi fisik stok."
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

# TC-SOPNAME-DRAFT-20260918155504: Validasi Penolakan Input Nilai Qty Manual Desimal pada Detail Stock Opname

## Objective
Memastikan bahwa pelonggaran validasi desimal HANYA berlaku untuk UNIT PRICE, sedangkan input manual kolom Qty Opname (Physical Qty) tetap divalidasi ketat sebagai bilangan bulat (*whole number*).

## Preconditions
1. User login ke OlshopERP Staging.
2. Terdapat dokumen Stock Opname berstatus `Open`.

## Test Steps
1. Buka dokumen Stock Opname pada mode edit.
2. Pada baris produk, ubah kolom **Actual / Physical Qty** menjadi angka pecahan desimal (contoh: `1.5` atau `10.25`).
3. Coba simpan atau klik tombol **Update Detail**.

## Expected Results
1. Sistem menolak penyimpanan data Qty pecahan desimal manual.
2. Muncul pesan validasi bahwa Qty harus berupa bilangan bulat (*whole number*).
3. Data tidak tersimpan ke database hingga user menginput angka bulat yang valid.
