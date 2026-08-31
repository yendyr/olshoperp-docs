---
doc_type: menu-capability
menu: accounting-opening-stock
id: SF-OS-05
title: Beda dari Stock Opname
aliases: [vs stock opname, standalone opening, no building origin, kode OS]
scope: menu
summary: >-
  Opening Stock = saldo awal di Accounting (kode OS, wajib COA, tanpa Building
  Origin). Stock Opname = hitung stok rutin (kode SP, ada Building Origin).
version: 1.0
last_updated: 2026-08-31
status: review
---

# Beda dari Stock Opname

## Apa ini

Opening Stock dan Stock Opname memakai mesin UI yang mirip, tetapi **tujuan & aturan beda**. Opening Stock khusus **saldo awal** di menu Accounting; Stock Opname untuk **hitung ulang stok rutin**.

## Kapan dipakai

| Pakai Opening Stock jika | Pakai Stock Opname jika |
|--------------------------|-------------------------|
| Mulai inventory accounting / saldo awal | Opname berkala di gudang |
| Perlu jurnal Assets + Equity | Tidak perlu COA opening |
| Tidak ada Building Origin di header | Butuh Building Origin |

## Cara pakai

1. Buka **Accounting → Opening Stock** (bukan menu SCM Opening Stock terpisah — memang tidak ada).
2. Isi [Opening Balance COA](#sf-lingo:SF-OS-01) + detail di lokasi rack.
3. Jangan mencari Building Origin di header — lokasi hanya di baris.
4. Setelah approve, cek [Generated Trx](#sf-lingo:SF-OS-03) di SCM bila perlu.

## Catatan

- Kode dokumen: **OS-…** (bukan SP).
- Di SCM yang sering terlihat = Stock Addition/Deduction hasil generate, bukan menu Opening Stock kedua.
- Approved = **final** di production.

## Contoh

| Situasi | Menu yang benar |
|---------|-----------------|
| Go-live stok & nilai awal | Opening Stock (FA) |
| Opname bulanan rak A | Stock Opname |
| Cari “Opening Stock” di sidebar SCM | Tidak ada — pakai FA |

## Lihat juga

- [Opening Balance COA](#sf-lingo:SF-OS-01)
- [Generated Trx](#sf-lingo:SF-OS-03)
- Feature Map: [feature-map.md](../feature-map.md)
