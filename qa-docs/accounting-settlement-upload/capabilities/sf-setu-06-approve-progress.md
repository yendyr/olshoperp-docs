---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-06
title: Approve Progress (4 tahap)
aliases: [approve progress, progress receive settlement]
scope: menu
summary: >-
  Kolom Progress mengikuti 4 tahap setelah user Approve: generate receive → approve receive → jurnal → approve jurnal.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Approve Progress (4 tahap)

## Apa ini

Kolom **Progress** (bukan Progress Status) mengikuti 4 tahap setelah kamu **Approve**:

1. Generating Receives  
2. Approving Receives  
3. Generating Receive Journals  
4. Approving Receive Journals  

## Kapan dipakai

- Memantau pelunasan AR setelah Approve.
- Mendeteksi stuck di tahap receive/jurnal.

## Cara pakai

1. Setelah Approve, lihat kolom **Progress**.
2. Tunggu sampai selesai / hijau.
3. Jika macet > ~10 menit + ⚠️ → [Retry](#sf-lingo:SF-SETU-07).

## Catatan

- Hanya aktif setelah Upload Progress mencapai journals approved.
- Klik angka **AR** di grid untuk melihat hasil / error.

## Lihat juga

- [Approve / Bulk Approve](#sf-lingo:SF-SETU-05)
- [Upload Progress (5 tahap)](#sf-lingo:SF-SETU-04)

