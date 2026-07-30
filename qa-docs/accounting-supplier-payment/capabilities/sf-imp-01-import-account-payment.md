---
doc_type: menu-capability
menu: accounting-supplier-payment
id: SF-IMP-01
title: Import Account Payment
aliases: [import AP, import payment, import log payment]
scope: menu
summary: >-
  Import massal Account Payment via Excel multi-sheet (Bank Mutation, Detail,
  Adjustment). Hasil berstatus Open untuk direview lalu di-approve satu per satu.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Import Account Payment

## Apa ini

**Import Log** di datalist memungkinkan unggah Excel untuk membuat banyak dokumen Account Payment sekaligus. Template berisi beberapa sheet (mutasi bank / sumber, detail alokasi PI, adjustment).

## Kapan dipakai

- Banyak pembayaran rutin yang datanya sudah ada di spreadsheet.
- Tim finance ingin draft massal lalu review sebelum Approve.

## Cara pakai

1. Di datalist Account Payment, buka **Import Log**.
2. Download template (3 sheet) sesuai panduan.
3. Isi data — saat ini import fokus **IDR**.
4. Upload file (satu import berjalan per company).
5. Hasil payment berstatus **Open** — review Source/Detail/balance.
6. **Approve** satu per satu setelah yakin ([Strict balancing](#sf-lingo:SF-PAY-01)).

## Catatan

- Jangan Approve buta hasil import — cek supplier, PI, dan amount.
- Satu import per company pada satu waktu.
- Void setelah approve belum ada — kesalahan import yang sudah di-approve sulit dibatalkan lewat UI.
- Detail validasi kolom ada di requirement / technical.

## Contoh

| Langkah | Hasil |
|---------|--------|
| Upload template valid | Beberapa PY- status Open |
| Review + balance OK | Approve berhasil; hutang PI berkurang |
| Source ≠ Detail | Approve gagal sampai dikoreksi |

## Lihat juga

- [Strict balancing](#sf-lingo:SF-PAY-01)
- [Outstanding PI Use](#sf-lingo:SF-DET-01)
- User Guide § Alternatif — Import massal
