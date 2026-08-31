---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026083004
title: "General Ledger — Inklusi Kolom Store Name pada Hasil Export File General Ledger"
module: Accounting
menu: General Ledger
menu_slug: general-ledger
type: functional
priority: high
automated: false
automated_spec: null
origin_jira: ETM-15666
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-general-ledger
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu Finance / Accounting -> General Ledger (/accounting/general-ledger)"
  - "Terdapat data transaksi jurnal dengan variasi store terisi (Store Name) dan store NULL"
---

# Test Case: General Ledger — Inklusi Kolom Store Name pada Hasil Export File General Ledger

## 📋 Summary
Memastikan file hasil pengunduhan Export All / Export Excel General Ledger memuat kolom 'Store' dengan informasi Store Name yang konsisten dengan UI datalist.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu General Ledger.
- Berada di halaman `/accounting/general-ledger`.

## 🧪 Test Steps
1. Buka menu General Ledger (https://staging.olshoperp.com/accounting/general-ledger).
2. Terapkan filter tanggal / store (jika diperlukan) lalu klik tombol 'Export All' / 'Export Excel'.
3. Unduh dan buka file spreadsheet hasil export General Ledger.
4. Periksa struktur kolom dan isi data pada file export.

## ✅ Expected Result
- File Excel hasil export General Ledger memuat kolom 'Store'.
- Isi data pada kolom 'Store' di file export 100% cocok dengan informasi Store Name (atau '-' jika null) yang ada di UI datalist General Ledger.

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: Not Run
