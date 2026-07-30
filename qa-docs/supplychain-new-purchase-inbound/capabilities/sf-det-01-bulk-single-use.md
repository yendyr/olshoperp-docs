---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-DET-01
title: Bulk Use / Single Use / Select Product
aliases: [bulk use, single use, outstanding PO, select product]
scope: menu
summary: >-
  Dari Outstanding PO, masukkan baris PO ke keranjang GRN.
  Bulk Use = banyak baris qty = sisa; Single Use = detail qty/batch/serial;
  Select Product = shortcut satu SKU.
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Bulk Use / Single Use / Select Product

## Apa ini

Cara mengisi detail Purchase Inbound dari **Outstanding PO**. Kamu memilih baris PO yang masih punya sisa qty, lalu memasukkannya ke keranjang GRN dengan **Bulk Use**, **Single Use**, atau **Select Product**.

## Kapan dipakai

| Cara | Pakai jika |
|------|------------|
| **Bulk Use** | Banyak SKU sekaligus; qty default = seluruh sisa PO |
| **Single Use** | Perlu atur qty sebagian, unit, batch, serial, atau expired |
| **Select Product** | Cari cepat satu SKU dari outstanding |

## Cara pakai

1. Simpan header GRN (Supplier, Warehouse, Tanggal).
2. Buka panel **Outstanding PO**.
3. Cari PO / SKU yang masih outstanding.
4. Pilih:
   - **Bulk Use** — beberapa baris; qty = sisa masing-masing.
   - **Single Use** — isi qty (≤ sisa), unit, batch/serial/expired bila wajib.
   - **Select Product** — pilih satu SKU lalu lengkapi seperti Single Use.
5. Pastikan qty tidak melebihi sisa PO, lalu lanjut Approve.

## Catatan

- Setelah ada detail, **supplier / gudang / tanggal** terkunci.
- Produk wajib batch/expired harus diisi; serial = 1 baris per 1 pcs (max 50 sekaligus).
- SKU **random** tidak bisa di-inbound.
- Untuk selisih desimal unit, lihat juga [Allocate Full Qty](#sf-lingo:SF-DET-02).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| PO sisa 3 SKU penuh | Bulk Use ketiga baris | Semua masuk keranjang qty = sisa |
| PO sisa 100 pcs | Single Use qty 40 | 40 masuk; sisa outstanding 60 |
| Perlu satu SKU cepat | Select Product | Satu baris masuk untuk dilengkapi |

## Lihat juga

- [Allocate Full Qty](#sf-lingo:SF-DET-02)
- [Partial receiving](#sf-lingo:SF-INB-02)
- [COLLI / Group view](#sf-lingo:SF-INB-01)
