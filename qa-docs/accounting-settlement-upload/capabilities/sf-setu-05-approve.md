---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-05
title: Approve / Bulk Approve
aliases: [approve settlement, bulk approve, approval dialog reject]
scope: menu
summary: >-
  Approve menghasilkan 1 AR per batch (Smart AR skip SI yang sudah punya AR). Bulk Approve hanya jika semua baris terpilih eligible.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Approve / Bulk Approve

## Apa ini

Setelah Upload Progress selesai (journals approved), **Approve** membuka dialog untuk menghasilkan **1 Account Receive (AR)** per batch — atau **Reject** untuk menolak pelunasan tanpa AR.

## Kapan dipakai

- Settlement siap dilunasi ke kas/bank.
- Banyak batch eligible → **Bulk Approve** dari toolbar.

## Cara pakai

1. Pastikan **Receiving Destination COA** sudah di Store Setting.
2. Pastikan semua Sales Invoice di batch **satu tanggal kalender** yang sama.
3. Klik ✓ **Approve** di baris → dialog **Approve** / **Reject**.
4. Atau centang beberapa baris → toolbar **Bulk Approve** (semua harus `can_approve`).
5. Pantau kolom **Progress** (Approve Progress).

## Catatan

- Smart AR: SI yang sudah punya AR manual di-skip.
- Bulk gagal untuk baris tidak eligible jika selection campur.
- Tidak bisa Approve jika semua SI sudah punya AR, atau tanggal SI campur beda hari.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Journals approved, COA OK, tanggal SI sama | Approve | 1 AR + Approve Progress |
| 2 eligible + 1 sudah approved | Bulk Approve | Gagal untuk yang tidak eligible |

## Lihat juga

- [Approve Progress (4 tahap)](#sf-lingo:SF-SETU-06)
- [Delete / Revert](#sf-lingo:SF-SETU-08)

