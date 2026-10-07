---
doc_type: knowledge-base
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 0.1
last_updated: 2026-10-07
owner: QA - Yemima
status: draft
aliases: [Pricelist Product, product pricelist, harga jual SKU]
---

# Pricelist Product — Knowledge Base

## Apa itu

Daftar harga jual per produk untuk setiap **Category Price**. Angka margin bisa datang dari beberapa aturan (harga + berat) yang dijumlahkan.

## Alur kerja

```mermaid
flowchart TD
    A[Pastikan Category sudah punya Variable Price] --> B[Update to Pricelist dari Category]
    B --> C[Cek final price & margin di Pricelist]
    C --> D{Perlu ubah manual?}
    D -->|Ya| E[Edit margin — tercatat di log sebagai ubahan user]
    D -->|Tidak| F[Selesai]
```

## Contoh

Produk harga 16.000, berat primary 1.500 gram, tiga aturan margin → harga jual 24.500. Arahkan mouse ke angka margin 8.500 untuk melihat pecahan 3.000 + 2.000 + 3.500.

## Weight kosong

Jika produk belum punya berat primary, muncul peringatan. Aturan berdasarkan berat **tidak dihitung**; aturan berdasarkan harga tetap jalan.

## Troubleshooting

| Gejala | Solusi |
|--------|--------|
| Margin tidak pecah di hover | Baris sudah diubah manual — bukan hasil hitung multi tier |
| Setelah ubah Category, angka Pricelist lama | Jalankan lagi Update to Pricelist (akan menimpa termasuk ubahan manual) |
