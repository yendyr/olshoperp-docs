---
owner: QA - Jenni
tc_code: TC-GL-002
title: "General Ledger — Filter Pencarian Store Name Melalui Global Search"
module: Accounting
menu: General Ledger
menu_slug: general-ledger
test_type: happy
priority: high
automated: false
automated_spec: null
origin_jira: ETM-15666
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu Finance / Accounting -> General Ledger (/accounting/general-ledger)"
  - "Terdapat data transaksi jurnal dengan variasi store terisi (Store Name) dan store NULL"
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
first_execution:
  at: null
  via: null
  jira: null
---

# Test Case: General Ledger — Filter Pencarian Store Name Melalui Global Search

## 📋 Summary
Memastikan input Global Search pada datalist General Ledger dapat memproses pencarian berdasarkan kata kunci Nama Toko (Store Name).

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu General Ledger.
- Berada di halaman `/accounting/general-ledger`.

## 🧪 Test Steps
1. Buka menu General Ledger (https://staging.olshoperp.com/accounting/general-ledger).
2. Masukkan kata kunci Nama Toko (misal: 'Shopee Official Store' atau 'Tokopedia') pada kolom Global Search.
3. Tekan Enter / amati pembaruan otomatis pada datalist General Ledger.

## ✅ Expected Result
- Fitur Global Search secara responsif memfilter datalist General Ledger dan hanya menampilkan baris transaksi yang mengandung keyword Store Name yang dicari.
- Baris transaksi yang tidak cocok dengan keyword Store Name akan di-filter out dari tampilan.

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: Not Run
