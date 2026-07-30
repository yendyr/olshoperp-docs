---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-PO-01
title: With PR / Without PR
aliases: [with pr, without pr, tipe PO, from PR]
scope: menu
summary: >-
  Tipe Purchase Order menentukan sumber baris detail: dari Purchase Requisition
  outstanding (With PR) atau langsung dari System Product (Without PR).
version: 1.0
last_updated: 2026-07-28
status: draft
---

# With PR / Without PR

## Apa ini

Saat membuat Purchase Order, kamu memilih **With PR** atau **Without PR**. Pilihan ini menentukan dari mana baris barang diambil — bukan hanya label di header.

## Kapan dipakai

| Tipe | Pakai jika |
|------|------------|
| **With PR** | Pembelian mengikuti Purchase Requisition yang sudah approved/processed dan masih punya sisa qty |
| **Without PR** | Pembelian langsung ke supplier tanpa PR (produk aktif, punya grup akun, bukan bundle/random) |

## Cara pakai

1. Buka **SCM → Purchase Order → Create**.
2. Pilih radio **With PR** atau **Without PR** sebelum menambah detail.
3. Isi supplier, tanggal, mata uang, kurs, lalu simpan.
4. Tambah detail lewat **Available Product** (sumber mengikuti tipe yang dipilih).

## Catatan

- Setelah ada baris detail, tipe **tidak bisa diubah** di form.
- **Import Detail** bisa mengubah tipe PO jika isi file tidak hati-hati (semua baris ada kode PR vs semua kosong) — sesuaikan file dengan tipe yang diinginkan.
- With PR: tanggal PR harus sebelum tanggal PO; PR closed/complete atau qty habis tidak muncul.

## Contoh

| Situasi | Pilih |
|---------|--------|
| Ada PR gudang untuk 100 pcs SKU A, sisa 100 | **With PR** |
| Urgent beli tanpa PR | **Without PR** |
| Sudah ada 3 baris detail With PR | Tidak bisa ganti ke Without PR di form — hapus detail dulu atau buat PO baru |

## Lihat juga

- [Use / Allocate Full Qty Clearing](#sf-lingo:SF-DET-01)
- [Import Detail](#sf-lingo:SF-IMP-01)
- Feature Map: [feature-map.md](../feature-map.md)
