---
doc_type: menu-capability
menu: omni-skip-wave-process
id: SF-SW-05
title: Redispatch
aliases: [redispatch skip wave, batch macet]
scope: menu
summary: >-
  Tombol untuk mengulang penutup / lanjut batch yang progress hampir selesai tetapi status masih Processing lama (diam lebih dari 60 menit).
version: 1.0
last_updated: 2026-09-28
status: review
---

# Redispatch

## Apa ini

Aksi **Redispatch** untuk batch yang “macet”: progress sudah hampir selesai, tetapi status masih **Processing** terlalu lama. Sistem mencoba menutup / melanjutkan pekerjaan yang seharusnya sudah selesai.

## Kapan dipakai

- Progress Wave / Skip hampir penuh, status masih Processing.
- Batch diam **lebih dari 60 menit** tanpa maju.

## Cara pakai

1. Pastikan gejala: progress hampir selesai + Processing lama.
2. Klik **Redispatch** pada batch tersebut.
3. Pantau status lagi. Jika tetap gagal → minta DevOps / cek Horizon Jobs.

## Catatan

- Bukan pengganti perbaikan file Import Failed.
- Syarat diam > 60 menit — jangan spam jika batch masih aktif normal.

## Lihat juga

- [Wave Progress & Skip Processing](#sf-lingo:SF-SW-04)
- Requirement: [§6.3a Status macet & Redispatch](../requirement.md)

