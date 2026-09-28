---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-04
title: Upload Progress (5 tahap)
aliases: [progress status, upload progress settlement]
scope: menu
summary: >-
  Kolom Progress Status menampilkan 5 tahap otomatis setelah import: validasi → SI/Outbound → approve → jurnal → approve jurnal.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Upload Progress (5 tahap)

## Apa ini

Kolom **Progress Status** mengikuti 5 tahap otomatis setelah file lolos import:

1. Validating  
2. Generating Invoices & Outbounds  
3. Approving Invoices & Outbounds  
4. Generating Invoice & Outbound Journals  
5. Approving Invoice & Outbound Journals  

## Kapan dipakai

- Memantau batch baru setelah Import.
- Mengetahui tahap mana yang macet (lalu Retry).

## Cara pakai

1. Setelah Import, lihat kolom **Progress Status**.
2. Badge bisa menampilkan persen / estimasi sisa waktu.
3. Selesai upload journals → siap **Approve** (AR).
4. Jika diam lama + ikon ⚠️ → [Retry](#sf-lingo:SF-SETU-07).

## Catatan

- Approve Progress (AR) baru aktif setelah upload journals approved.
- Jika jurnal gagal, SI/Outbound yang sudah approved **tidak di-rollback** otomatis.

## Lihat juga

- [Approve Progress (4 tahap)](#sf-lingo:SF-SETU-06)
- [Retry batch / per order](#sf-lingo:SF-SETU-07)

