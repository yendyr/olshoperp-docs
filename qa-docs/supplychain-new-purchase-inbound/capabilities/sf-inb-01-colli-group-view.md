---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-INB-01
title: COLLI / Group view
aliases: [COLLI, koli, group view, isi per koli]
scope: menu
summary: >-
  Fitur BETA untuk barang dikemas per koli: isi jumlah koli × isi per koli
  → Inbound Qty otomatis; Approve membuat 1 Stock ID per koli (background).
version: 1.0
last_updated: 2026-07-28
status: draft
---

# COLLI / Group view

## Apa ini

**COLLI** mencatat penerimaan berdasarkan **kemasan koli** (box/pallet). Di **Group view**, kamu mengisi **jumlah koli** dan **isi per koli**; Inbound Qty = koli × isi. Saat Approve, sistem membuat **satu Stock ID per koli** lewat proses background.

## Kapan dipakai

- Barang datang dalam koli/box yang ingin dilacak per kemasan.
- Perlu qty otomatis dari rumus koli × isi.
- **Tanpa COLLI** (jumlah koli = 0): isi Inbound Qty manual seperti biasa.

## Cara pakai

1. Tambah baris dari Outstanding PO.
2. Aktifkan **Group view** di detail.
3. Isi **jumlah koli** dan **isi per koli** (isi per koli sering terisi dari transaksi terakhir SKU yang sama, atau 1 jika melebihi sisa).
4. Cek Inbound Qty otomatis = koli × isi (tidak boleh > sisa PO).
5. **Approve** → pantau **Item Stock Status** (%) di daftar.
6. Jika gagal: notifikasi → status kembali **Open** → **Approve ulang**.

## Catatan

- Hanya di UI **BETA**; menu legacy tidak punya alur COLLI yang sama.
- Hapus/edit baris yang sudah punya data COLLI: hapus/edit COLLI dulu.
- Import punya **template colli** terpisah dari template standard.
- Proses stock per koli bisa asynchronous — jangan anggap gagal hanya karena loading sebentar.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Sisa PO 100; 10 koli × 10 isi | Isi COLLI lalu Approve | Inbound Qty 100; 10 Stock ID (1 per koli) |
| Colli = 0 | Isi qty manual 40 | Satu alur non-COLLI seperti biasa |
| Job COLLI gagal | Lihat notifikasi | Status Open → Approve ulang |

## Lihat juga

- [Bulk Use / Single Use](#sf-lingo:SF-DET-01)
- [Import Excel](#sf-lingo:SF-IMP-01)
- Knowledge Base: [§4 Fitur COLLI](../knowledge-base.md)
