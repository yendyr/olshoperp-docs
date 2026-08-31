---
owner: QA - Jenni
tc_code: TC-GL-003
title: "General Ledger — Filter Pencarian Store Name Melalui Advance Filter"
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

# Test Case: General Ledger — Filter Pencarian Store Name Melalui Advance Filter

## 📋 Summary
Memastikan panel Advance Filter pada General Ledger memiliki bidang/opsi filter 'Store Name' dan dapat memfilter datalist secara presisi.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu General Ledger.
- Berada di halaman `/accounting/general-ledger`.

## 🧪 Test Steps
1. Buka menu General Ledger (https://staging.olshoperp.com/accounting/general-ledger).
2. Klik tombol 'Advance Filter' untuk membuka panel filter lanjutan.
3. Pilih/masukkan opsi 'Store Name' spesifik pada form filter.
4. Klik tombol 'Apply Filter' / 'Cari'.

## ✅ Expected Result
- Field 'Store Name' tersedia di dalam panel Advance Filter.
- Saat filter dijalankan, datalist General Ledger secara presisi menampilkan hanya transaksi yang memiliki Store Name sesuai pilihan filter.

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: Not Run
