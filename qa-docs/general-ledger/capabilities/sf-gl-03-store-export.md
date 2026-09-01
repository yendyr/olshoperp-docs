---
doc_type: menu-capability
menu: general-ledger
id: SF-GL-03
title: Export kolom Store
aliases: [GL export Store, GeneralLedgerExport column D]
scope: menu
summary: >-
  Export Excel async menyertakan kolom Store (D) — nama store dari pivot
  header journal, join koma jika multi-store.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Export kolom Store

## Apa ini

**Export All** / export halaman aktif menghasilkan file Excel dengan kolom **Store** (kolom **D**), setelah GL Trx. Code.

Nilai = `journal.stores` → `store_name` digabung koma; `-` jika pivot kosong.

## Kapan dipakai

- Share laporan GL ke finance ops dengan konteks store.
- Rekonsiliasi offline per store (Excel).

## Cara pakai

1. Terapkan filter periode / COA / Store seperti di datalist.
2. Klik **Export All** — tunggu di tab Export File.
3. Download — verifikasi kolom **Store** (D) selaras dengan tampilan UI.

## Catatan

- Urutan kolom export berubah vs versi lama: Store = **D**, Trx. Date = **E** (lihat [technical.md](../technical.md)).
- Filter aktif saat export ikut diterapkan ke dataset job.
- Gap pivot AR/CN/DN → kolom Store export juga `-` untuk baris tersebut.

## Lihat juga

- [Kolom Store](#sf-lingo:SF-GL-01)
- TC: [TC-GL-004](../test-cases/TC-GL-004.md)
