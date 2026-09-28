---
doc_type: menu-capability
menu: horizon-jobs
id: SF-HJ-03
title: Redispatch saat batch macet
aliases: [redispatch horizon, batch stuck processing]
scope: menu
summary: >-
  Jika progress hampir penuh tetapi status masih Processing lama, pakai Redispatch di menu Skip Wave (syarat diam > 60 menit).
version: 1.0
last_updated: 2026-09-28
status: review
---

# Redispatch saat batch macet

## Apa ini

Skenario ops: progress Wave/Skip hampir penuh, status batch masih **Processing** terlalu lama — penutup otomatis sering gagal. Solusi operator: **Redispatch** di Skip Wave Process.

## Kapan dipakai

- Progress hampir 100%, status masih Processing.
- Batch diam **lebih dari 60 menit**.

## Cara pakai

1. Buka **Skip Wave Process**.
2. Pastikan gejala macet (bukan batch yang masih aktif normal).
3. Klik **Redispatch**.
4. Jika gagal berulang → eskalasi DevOps + cek Horizon.

## Catatan

- Bukan untuk Import Failed (perbaiki file + upload ulang).
- Card UI detail: Skip Wave [Redispatch](../omni-skip-wave-process/capabilities/sf-sw-05-redispatch.md).

## Lihat juga

- [Primary vs Derived Jobs](#sf-lingo:SF-HJ-01)
- [Gerbang satu batch aktif](#sf-lingo:SF-HJ-02)

