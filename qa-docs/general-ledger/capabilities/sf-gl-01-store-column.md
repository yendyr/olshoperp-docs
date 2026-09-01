---
doc_type: menu-capability
menu: general-ledger
id: SF-GL-01
title: Kolom Store
aliases: [store_formatted, STORE column, journal store GL]
scope: menu
summary: >-
  Kolom STORE di datalist GL menampilkan nama store dari header journal
  (pivot), bukan langsung dari transaksi referensi.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Kolom Store

## Apa ini

Kolom **STORE** di General Ledger menampilkan **nama store yang tercatat di header journal** (`accounting_journal_store_pivots`), bukan store yang hanya ada di Customer Invoice / Payment tanpa masuk journal.

## Kapan dipakai

- Audit mutasi per akun **per toko/platform**.
- Cocokkan baris GL dengan store operasional setelah journal Approved.

## Cara baca

| Tampilan | Arti |
|----------|------|
| Nama store | Pivot header journal terisi |
| `-` | Journal tanpa store di header — **normal** untuk transaksi tanpa konteks store |
| Beberapa nama (koma) | Satu journal, multi-store — hover **tooltip** untuk daftar penuh |

## Catatan

- **Aturan bisnis:** jika transaksi referensi **memuat store**, store **harus** masuk header journal agar muncul di GL ([requirement §9](../requirement.md)).
- **Gap AS-IS:** journal AR Receive, Credit Note, Debit Note (actor Store) belum selalu menulis pivot — kolom bisa `-` meski dokumen sumber punya store.
- SO General vs Platform: **sama** untuk tampilan store (dari sales order); beda hanya COA receivable.

## Lihat juga

- [Filter Store](#sf-lingo:SF-GL-02)
- [Journal — Store field](../../journal/requirement.md#81-store-di-header-journal--general-ledger)
- [Instant Settlement Upload](../../accounting-settlement-upload/requirement.md)
