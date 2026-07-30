---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-INB-03
title: Service / Fix Asset / Inventory
aliases: [service SKU, fix asset, stock ID, unbilled goods]
scope: menu
summary: >-
  Saat Approve GRN, perilaku stok dan jurnal mengikuti tipe Product COA Group:
  barang biasa (Inventory), Fix Asset (Assets), Service (tanpa Stock ID).
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Service / Fix Asset / Inventory

## Apa ini

Setelah GRN di-approve, sistem memposting stok dan jurnal **Unbilled Goods** sesuai tipe akun produk. Tidak semua SKU menghasilkan Stock ID atau Debit Inventory.

## Kapan dipakai

| Tipe produk | Yang terjadi saat Approve |
|-------------|---------------------------|
| **Barang biasa** | Stock ID + Debit **Inventory** → Credit Unbilled Goods |
| **Fix Asset** | Stock ID + Debit **Assets** → Credit Unbilled Goods |
| **Service (jasa)** | **Tidak** ada Stock ID; jurnal biaya operasional → Unbilled Goods |

## Cara pakai

1. Pastikan Product COA Group lengkap **sebelum** Approve (termasuk Unbilled Goods).
2. Tambah baris dari PO seperti biasa.
3. **Approve** GRN.
4. Cek hasil: stok muncul (kecuali Service); jurnal tanpa PPN — PPN di Purchase Invoice.

## Catatan

- Nilai Unbilled memakai **harga sebelum PPN** dari PO — bukan DPP/VAT tampilan.
- COA kosong → Approve gagal dengan pesan konfigurasi akun.
- Random SKU tidak bisa di-inbound.
- Jangan mengharapkan PPN di jurnal GRN.

## Contoh

| SKU | Setelah Approve |
|-----|-----------------|
| Barang dagang | Ada Stock ID; Debit Inventory |
| Mesin (Fix Asset) | Ada Stock ID; Debit Assets |
| Jasa instalasi (Service) | Tidak ada Stock ID; jurnal biaya operasional |

## Lihat juga

- [Partial receiving](#sf-lingo:SF-INB-02)
- Knowledge Base: [§7 Aturan penting](../knowledge-base.md)
- Purchase Invoice — titik PPN Masukan
