---
doc_type: menu-capability
menu: accounting-customer-invoice
id: SF-SI-02
title: Other Cost / Other Discount
aliases: [additional cost, additional discount, other cost SI, other discount SI]
scope: menu
summary: >-
  Biaya atau diskon tambahan di header SI dari master Other Cost / Discount.
  Masuk Net Sales, tidak masuk basis PPN produk.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Other Cost / Other Discount

## Apa ini

**Other Cost** dan **Other Discount** adalah baris tambahan di Sales Invoice (bukan harga SKU). Dipilih dari master yang Active; akun di tabel bisa diubah. Keduanya masuk **Net Sales**, tetapi **tidak** masuk basis PPN produk.

## Kapan dipakai

- Ada ongkir/biaya lain yang ditagih ke customer.
- Ada potongan tambahan di luar diskon item.
- Menyelaraskan total tagihan sebelum Approve.

## Cara pakai

1. Buka SI Draft/Open.
2. Tambah **Other Cost** atau **Other Discount** (pilih master + harga + deskripsi).
3. Cek COA di tabel bila perlu diganti.
4. Lihat dampak di [Net Sales](#sf-lingo:SF-SI-03).
5. **Approve** setelah status Open.

## Catatan

- Tidak wajib — SI boleh tanpa Other Cost/Discount.
- Master harus **Active**.
- Tidak mengubah cara hitung PPN per produk.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Ada ongkir 50.000 | Tambah Other Cost | Net Sales naik; PPN produk tidak berubah dari ongkir |
| Potongan promo header | Tambah Other Discount | Net Sales turun |

## Lihat juga

- [Net Sales](#sf-lingo:SF-SI-03)
- [Outstanding SO Use](#sf-lingo:SF-DET-01)
- Feature Map: [feature-map.md](../feature-map.md)
