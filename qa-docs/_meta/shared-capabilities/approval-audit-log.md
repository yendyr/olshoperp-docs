---
doc_type: shared-capability
id: SF-LOG-01
also: [SF-LOG-02]
title: Approval Log & Audit Log
aliases: [approval log, audit log, riwayat approve, log perubahan]
scope: global
summary: >-
  Jejak siapa melakukan apa pada transaksi — riwayat approve/reject terpisah
  dari riwayat perubahan data.
version: 0.2
last_updated: 2026-07-27
status: draft
---

# Approval Log & Audit Log

## Apa ini

Dua jenis riwayat di form transaksi. **Approval Log** mencatat approve / reject. **Audit Log** mencatat perubahan data (siapa mengubah field apa).

## Kapan dipakai

| Pertanyaan | Buka |
|------------|------|
| Kapan dokumen di-approve / di-reject? Siapa? | **Approval Log** |
| Siapa yang mengubah due date, qty, atau supplier? | **Audit Log** |

## Cara pakai

1. Buka form transaksi (bukan hanya baris di datalist).
2. Buka panel **Approval Log** atau **Audit Log** (biasanya di sidebar / tab form).
3. Baca entri dari yang terbaru — catat waktu, user, dan catatan bila ada.
4. Tutup panel setelah selesai.

## Catatan

- Log biasanya tersedia di **form**, bukan di toolbar datalist utama.
- Kedalaman field yang tercatat di Audit Log bisa berbeda per menu.
- Approval Log fokus peristiwa status; Audit Log fokus isi data.

## Lihat juga

- Override label panel & field: Feature Map / requirement § Approval & Audit menu terkait
