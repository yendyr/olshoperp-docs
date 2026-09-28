---
doc_type: menu-capability
menu: horizon-jobs
id: SF-HJ-02
title: Gerbang satu batch aktif
aliases: [antrian batch, satu batch processing, gate skip wave]
scope: menu
summary: >-
  Hanya satu batch Skip Wave boleh pending/processing di seluruh sistem; batch lain menunggu sampai gerbang terbuka.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Gerbang satu batch aktif

## Apa ini

Aturan antrian Skip Wave: sistem hanya memproses **satu** batch aktif (`pending` / `processing`) di seluruh sistem. Batch lain menunggu — bahkan dari company lain.

## Kapan dipakai

- Banyak batch Pending lama.
- Upload baru tidak mulai Processing.

## Cara pakai

1. Cek datalist Skip Wave: ada batch Processing?
2. Tunggu selesai, atau [Redispatch](#sf-lingo:SF-HJ-03) jika sudah macet > 60 menit.
3. Setelah gerbang terbuka, batch berikutnya masuk Processing.

## Catatan

- Bukan bug kalau file kamu “mengantre” sementara company lain masih Processing.
- Detail validasi Q1–Q2 ada di requirement Skip Wave.

## Lihat juga

- [Redispatch saat batch macet](#sf-lingo:SF-HJ-03)
- Skip Wave KB: [../omni-skip-wave-process/knowledge-base.md](../omni-skip-wave-process/knowledge-base.md)

