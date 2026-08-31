---
owner: QA - Jenni
tc_code: TC-GL-001
title: "General Ledger — Visibilitas Kolom Store pada Datalist GL (Header Trx Journal Store Name vs Store Null '-')"
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

# Test Case: General Ledger — Visibilitas Kolom Store pada Datalist GL (Header Trx Journal Store Name vs Store Null '-')

## 📋 Summary
Memastikan datalist General Ledger menampilkan kolom 'Store' yang memuat informasi Store Name sesuai header transaksi jurnal asal, dan menampilkan karakter '-' (strip) apabila nilai store bernilai NULL.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu General Ledger.
- Berada di halaman `/accounting/general-ledger`.

## 🧪 Test Steps
1. Buka menu Finance / Accounting -> General Ledger (https://staging.olshoperp.com/accounting/general-ledger).
2. Periksa keberadaan kolom baru 'Store' pada tabel datalist General Ledger.
3. Amati baris transaksi jurnal yang memiliki referensi toko/store (misal transaksi dari marketplace Shopee/Tokopedia).
4. Amati baris transaksi jurnal manual/internal yang tidak terikat store (store null).

## ✅ Expected Result
- Kolom 'Store' tampil secara jelas di datalist General Ledger.
- Untuk transaksi jurnal yang memiliki store, kolom menampilkan nama toko (Store Name) yang sesuai.
- Untuk transaksi jurnal yang store-nya null, kolom menampilkan simbol '-' (strip).

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: Not Run
