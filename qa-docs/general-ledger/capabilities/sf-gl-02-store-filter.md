---
doc_type: menu-capability
menu: general-ledger
id: SF-GL-02
title: Filter Store (search + advanced)
aliases: [store filter GL, SearchBuilder Store, global search store name]
scope: menu
summary: >-
  Global search dan Advanced Filter kolom Store memfilter baris GL via
  journal.stores.store_name (LIKE).
version: 1.0
last_updated: 2026-09-01
status: review
---

# Filter Store (search + advanced)

## Apa ini

Dua cara mempersempit baris GL berdasarkan **nama store di header journal**:

1. **Global Search** — keyword match `store_name` pivot journal.  
2. **Advanced Filter** — kolom **Store** (`store_formatted`) dengan kondisi string (contains, equals, is empty, dll.).

## Kapan dipakai

- Laporan mutasi Kas / Piutang / Pendapatan **per store** dalam periode tertentu.
- Verifikasi ETM-15666 / TC-GL-002, TC-GL-003.

## Cara pakai

1. Set filter **Trx. Date** (default bulan berjalan).
2. Ketik nama store di **global search**, **atau** buka Advanced Filter → kolom **Store**.
3. Baris tanpa pivot store **tidak** match filter “contains nama store” — hanya baris dengan pivot terisi.

## Catatan

- Filter **tidak** membaca store di menu Invoice/Payment jika pivot journal kosong.
- IS NULL / empty → baris journal tanpa store di header.
- Multi-store: cukup **satu** store di pivot match keyword.

## Lihat juga

- [Kolom Store](#sf-lingo:SF-GL-01)
- TC: [TC-GL-002](../test-cases/TC-GL-002.md), [TC-GL-003](../test-cases/TC-GL-003.md)
