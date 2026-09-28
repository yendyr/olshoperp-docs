---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-07
title: Retry batch / per order
aliases: [retry settlement, continue settlement, warning progress]
scope: menu
summary: >-
  Retry melanjutkan tahap yang gagal/macet untuk seluruh batch atau satu order (Continue). Bukan untuk SO Failed validasi awal.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Retry batch / per order

## Apa ini

Jika proses macet atau error di tengah jalan, kamu bisa **Retry**:

- **Batch:** ikon ⚠️ di progress bar, atau tombol di header LogTable  
- **Per order:** tombol **Continue** di log error SI/Outbound/journal  

## Kapan dipakai

- Progress stuck (sering > 10 menit tanpa maju) dengan state yang bisa di-retry.
- Error counter SI/Out/AR > 0 (bukan SO Failed screening).

## Cara pakai

1. Lihat ikon ⚠️ di Trx. Code / progress, atau buka log dari angka merah.
2. **Retry batch** untuk seluruh tahap yang gagal/macet.
3. Atau **Continue** untuk satu `settlement_id` di log.
4. Pantau progress lagi.

## Catatan

- SO Failed karena validasi awal → perbaiki file + upload ulang, bukan Retry.
- Retry tidak menghapus dokumen yang sudah approved.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Jurnal outbound gagal, SI sudah approved | Retry batch | Lanjut tahap jurnal |
| 1 order error generate SI | Continue di log | Retry order itu saja |

## Lihat juga

- [Upload Progress (5 tahap)](#sf-lingo:SF-SETU-04)
- [All-or-nothing Validasi](#sf-lingo:SF-SETU-03)

