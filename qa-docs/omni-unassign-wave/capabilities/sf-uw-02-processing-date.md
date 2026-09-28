---
doc_type: menu-capability
menu: omni-unassign-wave
id: SF-UW-02
title: Processing Date
aliases: [processing order date, tanggal processing unassign]
scope: menu
summary: >-
  Tanggal & jam untuk cek stok FIFO dan dokumen gudang saat Send / Refresh. Shared dengan Skip Wave Process per company.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Processing Date

## Apa ini

Field date-time di **kiri** tombol **Refresh Availability Stock**. Dipakai sistem saat mengevaluasi stok dan memproses kirim ke Default Wave.

## Kapan dipakai

- Order lama, stok baru ready hari ini → set ke **hari proses**.
- Field kosong → sistem memakai **waktu sekarang** (bukan 23:59:59).

## Cara pakai

1. Isi **Processing Date** (atau biarkan kosong).
2. Simpan — sistem mengingat pilihan terakhir.
3. Nilai sama dengan **Skip Wave Process** (company yang sama).
4. Lanjut **Refresh Availability Stock** atau **Send to Default Waves**.

## Catatan

- Icon **Unavailable Stock** dievaluasi memakai tanggal ini.
- Tidak bisa simpan jika tanggal masa depan atau periode akuntansi ditutup.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Order 27 Jul, stok ready 28 Jul | Set date 28 Jul → Send | Evaluasi stok di 28 Jul |
| Date masih April, stok masuk Sep | Flag Stock tetap | Ubah date ke Sep lalu Refresh |

## Lihat juga

- [Refresh Availability Stock](#sf-lingo:SF-UW-04)
- Skip Wave: [Processing Date](../../omni-skip-wave-process/capabilities/sf-sw-02-processing-date.md)

