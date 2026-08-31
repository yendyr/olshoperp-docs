---
doc_type: menu-capability
menu: accounting-opening-stock
id: SF-OS-03
title: Generated Trx
aliases: [generated trx, stock addition opening, stock deduction opening]
scope: menu
summary: >-
  Dari Adjustment Qty, sistem otomatis membuat Stock Addition (+) atau
  Stock Deduction (−). Kolom Generated Trx menampilkan link dokumen turunan.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Generated Trx

## Apa ini

**Generated Trx** adalah dokumen **Stock Addition** atau **Stock Deduction** yang dibuat otomatis dari Adjustment Qty di Opening Stock. Kamu tidak perlu membuat Addition manual untuk saldo awal.

## Kapan dipakai

- Setelah isi detail Expected Stock (Adjustment ≠ 0).
- Saat cek dampak di SCM / list Addition-Deduction.
- Setelah Approve — Stock ID digenerate lewat jalur Addition opening.

## Cara pakai

1. Isi detail sampai [Adjustment](#sf-lingo:SF-OS-02) terbentuk.
2. Lihat kolom **Generated Trx** di datalist / detail (link ke child).
3. **Approve** Opening Stock — child Addition diproses + [Item Stock Status](#sf-lingo:SF-OS-04) berjalan.
4. Buka link Generated Trx jika perlu verifikasi.

## Catatan

- Adjustment **+** → Stock Addition; **−** → Stock Deduction.
- Ini bukan menu Opening Stock di SCM — yang terlihat di SCM biasanya dokumen turunan.
- Opening Stock tetap **standalone** (bukan child dari Opname/Sales Return).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Adjustment +50 | Simpan detail | Generated Trx = Stock Addition |
| Adjustment −10 | Simpan detail | Generated Trx = Stock Deduction |

## Lihat juga

- [Expected Stock & Adjustment](#sf-lingo:SF-OS-02)
- [Item Stock Status](#sf-lingo:SF-OS-04)
- [Beda dari Stock Opname](#sf-lingo:SF-OS-05)
