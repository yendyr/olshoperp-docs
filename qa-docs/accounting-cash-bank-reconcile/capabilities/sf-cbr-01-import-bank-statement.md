---
doc_type: menu-capability
menu: accounting-cash-bank-reconcile
id: SF-CBR-01
title: Import Bank Statement
aliases: [import statement, upload bank, template reconciliation]
scope: menu
summary: >-
  Mutasi bank masuk ke reconcile hanya lewat import template.
  Tanggal harus dalam Period; isi Received atau Spent saja.
version: 1.0
last_updated: 2026-09-10
status: review
---

# Import Bank Statement

## Apa ini

Cara memasukkan mutasi dari bank ke dokumen **Cash/Bank Reconcile**. Sistem **tidak** mengizinkan buat baris statement manual di panel matching — hanya **import**.

## Kapan dipakai

- Setelah header reconcile (Period + akun kas/bank) tersimpan dan status **Open**.
- Saat ada file statement bank untuk periode yang sama.

## Cara pakai

1. Buka dokumen `BR-` → tab **Bank Statement**.
2. Unduh **template** import.
3. Isi kolom: **TransactionDate**, **Received** *atau* **Spent**, **Description** (opsional).
4. Upload file.
5. Cek daftar baris di tab Bank Statement; lanjut ke [Reconcile Process](#sf-lingo:SF-CBR-02).

## Catatan

- Tanggal wajib dalam **Period** dokumen.
- Jangan isi Received dan Spent sekaligus; jangan kosong keduanya.
- Satu baris salah bisa membuat **seluruh import batal** — perbaiki file lalu upload ulang.
- Setelah baris Match, kode journal bisa tampil di statement.

## Contoh

| Kolom | Contoh masuk | Contoh keluar |
|-------|--------------|---------------|
| TransactionDate | 12/09/2026 | 16/09/2026 |
| Received | 3000000 | (kosong) |
| Spent | (kosong) | 15000 |
| Description | TRSF PT SINAR | BIAYA ADM |

## Lihat juga

- [Reconcile Process & Suggestion](#sf-lingo:SF-CBR-02)
- [Matching Slideover](#sf-lingo:SF-CBR-03)
- Requirement: [../requirement.md](../requirement.md) §5.3
