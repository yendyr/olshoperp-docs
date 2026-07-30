---
doc_type: menu-capability
menu: system-product
id: SF-SP-05
title: Availability / On Hand / ATS
aliases: [stock columns, available to sell, on hand stock, bundle lowest denominator]
scope: menu
summary: >-
  Tiga angka stok di datalist: Availability (bisa dipakai), On Hand (fisik), dan
  ATS (bersih untuk dijual). Bundle memakai komponen paling sedikit.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Availability / On Hand / ATS

## Apa ini

Tiga indikator stok yang ditampilkan per SKU di datalist. Membantu operator tahu berapa yang bisa dijual/dipakai sekarang.

## Kapan dipakai

- Cek stok sebelum menjanjikan pengiriman.
- Verifikasi stok bundle sebelum jual.

## Cara pakai

| Kolom | Arti |
|-------|------|
| **Availability** | Stok yang bisa dipakai sekarang |
| **On Hand** | Stok fisik di gudang |
| **ATS** | Available to Sell — stok bersih untuk dijual |

Angka di-cache 1 menit per produk; refresh setelah transaksi.

## Catatan

- **Bundle:** angka = komponen paling sedikit (**lowest denominator**). Contoh: butuh 2 A + 1 B, stok A=10 B=3 → bundle max 3.
- **Parent variant:** tooltip menyebut `-`; backend tetap menghitung angka (GAP-SP-08).
- Cache bisa membuat angka tampak tertunda hingga 1 menit.

## Contoh

| SKU | Availability | On Hand | ATS |
|-----|--------------|---------|-----|
| Bundle (2A+1B, A=10 B=3) | 3 | 3 | 3 |

## Lihat juga

- [Bundle Configuration & tax hide](#sf-lingo:SF-SP-04)
- [Product Type & transactability](#sf-lingo:SF-SP-01)
