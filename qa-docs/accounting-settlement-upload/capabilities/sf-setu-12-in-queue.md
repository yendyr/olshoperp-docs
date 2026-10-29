---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-12
title: In Queue / Antrean global
aliases: [In Queue, antrean settlement, settlement queue, Stop Queue]
scope: menu
summary: >-
  File Instant Settlement menunggu giliran: 1 generate di semua company, jeda ±10 menit,
  FIFO. Approve AR tetap manual. Follow-up Stop Queue / Retry / Delete / stuck di ETM-16910/16911.
version: 1.0
last_updated: 2026-10-29
status: review
jira: [ETM-16060, ETM-16910, ETM-16911, ETM-16894, ETM-16895]
---

# In Queue / Antrean global

## Apa ini

Setelah upload, file masuk **In Queue** sebelum generate Sales Invoice & Outbound. Sistem hanya menjalankan **satu** batch generate di **semua company**. Setelah batch aktif selesai, tunggu **±10 menit** baru file berikutnya. Mirip Skip Wave Process, tanpa Processing Date.

## Kapan dipakai

- Upload banyak file beruntun.
- Memahami kenapa file belum “jalan” meski sudah di-upload.

## Cara pakai

1. Pilih store → Import CSV (boleh berulang).
2. Lihat status **In Queue** / menunggu giliran.
3. Pantau file yang sedang generating (Progress Status).
4. Setelah journals approved → **Approve** AR manual (di luar antrean).

## Catatan

- **AS-IS (ETM-16060):** antrean + jeda 10 menit sudah deploy; tooltip FIFO / Stop Queue masih gap ([ETM-16894](https://erpintegration.atlassian.net/browse/ETM-16894), [ETM-16910](https://erpintegration.atlassian.net/browse/ETM-16910)).
- **TO-BE ETM-16910:** Stop Queue hanya In Queue; Delete diblok saat generating; Retry vs batch aktif; retensi file 24 jam; FIFO `ORDER BY created_at`.
- **TO-BE ETM-16911:** batch macet tidak menahan antrean sampai 1 hari.
- Jangan buat SI kosong Net Sales 0 (guard [ETM-16895](https://erpintegration.atlassian.net/browse/ETM-16895)).

## Lihat juga

- [Upload Progress](#sf-lingo:SF-SETU-04) · [Retry](#sf-lingo:SF-SETU-07) · [Delete](#sf-lingo:SF-SETU-08)
- Requirement §6.5 · [Skip Wave Process](../../omni-skip-wave-process/README.md)
