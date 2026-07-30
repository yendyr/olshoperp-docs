---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-IMP-01
title: Import Credit Note
aliases: [import CN, template credit note, import history CN]
scope: menu
summary: >-
  Import massal Credit Note via Excel/CSV untuk customer General.
  Satu baris error membatalkan seluruh file; hasil berstatus Open.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Import Credit Note

## Apa ini

**Import** membuat banyak Credit Note sekaligus dari template. Cocok untuk customer tipe **General** (kode perusahaan). Customer **Platform/store** dibuat lewat form, bukan import.

## Kapan dipakai

- Banyak CN customer company sekaligus.
- Data sudah ada di spreadsheet finance.

## Cara pakai

1. Di list Credit Note, buka impor → **Download Template**.
2. Isi kolom wajib: tanggal, **kode** customer (bukan nama), GL Acc Cash/Bank, amount (minimal 1).
3. Store opsional (maksimal 5 nama, dipisah koma/titik koma).
4. Upload file — tunggu progress.
5. Jika gagal: cek **Import History** / **View Error Log**, perbaiki Excel, upload ulang **seluruh** file.
6. Approve satu per satu CN berstatus **Open**.

## Catatan

- **All-or-nothing:** satu baris salah → tidak ada CN yang terbentuk.
- Currency mengikuti mata uang utama company.
- Primary currency company harus sudah ter-set — tanpa itu import gagal.
- Hasil import **Open** (belum approved) — review amount & COA sebelum Approve.

## Contoh

| File | Hasil |
|------|--------|
| 50 baris valid | 50 CN Open |
| 49 valid + 1 amount kosong | Seluruh upload batal |
| Customer Platform di file | Tidak untuk jalur import — buat manual |

## Lihat juga

- [How CN is created](#sf-lingo:SF-CN-01)
- [Receiving Destination](#sf-lingo:SF-DET-01)
- Knowledge Base: [§5 Import massal](../knowledge-base.md)
