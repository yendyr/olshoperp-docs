---
doc_type: menu-capability
menu: omni-skip-wave-process
id: SF-SW-02
title: Processing Date
aliases: [processing order date, tanggal processing skip wave]
scope: menu
summary: >-
  Tanggal & jam yang dipakai sistem untuk seluruh proses batch Skip Wave (wave → pick → ship, termasuk stok). Shared dengan Unassign Wave per company.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Processing Date

## Apa ini

Field date-time di **pojok kiri atas**. Satu nilai untuk **seluruh** order di upload: dipakai saat kirim wave, proses gudang, dan pergerakan stok.

## Kapan dipakai

- Order lama baru bisa diproses karena stok baru ready → set ke **hari proses**.
- Mau menyamakan tanggal dokumen gudang untuk satu batch.
- Field kosong → sistem memakai **waktu sekarang** (tanggal + jam upload).

## Cara pakai

1. Buka Skip Wave Process.
2. Isi **Processing Date** di kiri atas (atau biarkan kosong).
3. Simpan / lanjut upload — sistem mengingat pilihan terakhir.
4. Nilai yang sama muncul di **Unassign Wave** (company yang sama).

## Catatan

- Tidak set per Order No di Excel.
- Order **lebih baru** dari Processing Date: Import bisa sukses, tetapi order **gagal di Wave** — naikkan tanggal lalu upload ulang.
- Tidak bisa simpan jika periode akuntansi ditutup atau tanggal di masa depan.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Field kosong | Upload | Batch memakai waktu sekarang |
| Order 28 Sep, date 20 Sep | Upload | Import OK; order gagal Wave → naikkan date |

## Lihat juga

- Unassign Wave: [Processing Date](../../omni-unassign-wave/capabilities/sf-uw-02-processing-date.md) (`SF-UW-02`)
- Requirement: [§5.1 Processing Date](../requirement.md)

