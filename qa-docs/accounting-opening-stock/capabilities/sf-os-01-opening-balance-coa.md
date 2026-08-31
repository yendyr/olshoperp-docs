---
doc_type: menu-capability
menu: accounting-opening-stock
id: SF-OS-01
title: Opening Balance COA
aliases: [coa debit assets, coa credit equity, opening balance coa]
scope: menu
summary: >-
  Header wajib dua akun: Debit Assets dan Credit Equity. Setelah Approve,
  satu jurnal opening memakai pasangan akun ini untuk seluruh transaksi.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Opening Balance COA

## Apa ini

Di header Opening Stock kamu mengisi **Opening Balance COA Debit** (akun Assets) dan **Opening Balance COA Credit** (akun Equity). Setelah **Approve**, sistem membuat **satu jurnal** memakai kedua akun itu untuk seluruh dokumen.

## Kapan dipakai

- Setiap kali buat Opening Stock baru — kedua field **wajib**.
- Saat cek jurnal / Balance Sheet setelah approve.

## Cara pakai

1. **Create** Opening Stock.
2. Pilih **Opening Balance COA Debit** dari daftar akun Assets.
3. Pilih **Opening Balance COA Credit** dari daftar akun Equity.
4. Lanjut isi detail SKU, lalu **Approve**.
5. Cek jurnal: Debit Assets, Credit Equity.

## Catatan

- Kedua COA **tidak boleh kosong**.
- Tippy: Debit = Assets; Credit = Equity.
- Default bisa terisi dari Opening Stock terakhir.
- Saat ini jurnal **tidak** memecah Debit per COA inventory tiap SKU — satu pasangan header untuk semua baris.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Debit Assets + Credit Equity terisi | Approve 3 SKU | 1 jurnal Dr Assets / Cr Equity |
| Debit dikosongkan | Save/Approve | Ditolak — wajib diisi |

## Lihat juga

- [Expected Stock & Adjustment](#sf-lingo:SF-OS-02)
- [Item Stock Status](#sf-lingo:SF-OS-04)
- Feature Map: [feature-map.md](../feature-map.md)
