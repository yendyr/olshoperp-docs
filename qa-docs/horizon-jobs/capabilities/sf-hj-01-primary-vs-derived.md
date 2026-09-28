---
doc_type: menu-capability
menu: horizon-jobs
id: SF-HJ-01
title: Primary vs Derived Jobs
aliases: [job utama, job turunan, primary derived]
scope: menu
summary: >-
  Membedakan job yang dipicu langsung dari menu (primary) vs job otomatis karena stok/audit/sync (derived) yang tidak dipilih di UI.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Primary vs Derived Jobs

## Apa ini

Setiap aksi berat bisa memicu banyak pekerjaan antrean. **Job utama (primary)** datang dari menu (validasi file, kirim wave, skip gudang). **Job turunan (derived)** jalan otomatis karena stok berubah, audit, atau sync marketplace — **tidak** dipilih di layar.

## Kapan dipakai

- Layar bilang Completed tetapi server masih sibuk.
- Menjelaskan kenapa satu upload 1.000 order menghasilkan ribuan job.

## Cara pakai

1. Identifikasi menu sumber (mis. Skip Wave Process).
2. Baca progress di menu = jejak job utama.
3. Jika Completed tapi beban server tinggi → kemungkinan job turunan masih mengantre.
4. Investigasi lanjut bersama DevOps di Horizon; jangan mengubah setting worker sendiri.

## Catatan

- “Completed di menu” ≠ “semua job turunan sudah habis”.
- Jangan upload batch besar beruntun saat turunan masih padat.

## Lihat juga

- [Gerbang satu batch aktif](#sf-lingo:SF-HJ-02)
- Pipeline: [pipelines/skip-wave-process.md](../pipelines/skip-wave-process.md)

