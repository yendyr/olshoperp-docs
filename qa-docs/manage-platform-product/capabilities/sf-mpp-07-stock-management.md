---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-07
title: Stock Management
aliases: [Fake Stock, Minimum Stock, Stock Ratio, pengaturan stok platform]
scope: menu
summary: >-
  Di modal Specification, atur Fake Stock, Minimum Stock, dan Stock Ratio
  per baris. Fake Stock prioritas tertinggi saat Push Stock.
version: 1.0
last_updated: 2026-07-31
status: review
---

# Stock Management

## Apa ini

Section **Stock Management** di modal **Specification Product** mengatur bagaimana angka stok dikirim ke marketplace saat [Push Stock](#sf-lingo:SF-MPP-03):

| Field | Fungsi singkat |
|-------|----------------|
| **Fake Stock** | Angka tetap yang selalu diprioritaskan saat push |
| **Minimum Stock** | Ambang bawah — di bawah ini push bisa jadi 0 |
| **Stock Ratio** | Persentase (0–100, bilangan bulat) dari stok tersedia jual |

## Kapan dipakai

- Belum bind tapi ingin tetap push angka ke etalase → set **Fake Stock**.
- Sengaja tampilkan stok etalase berbeda dari gudang → Fake Stock.
- Push sebagian dari ATS (mis. 80%) → **Stock Ratio**.
- Jangan push jika stok terlalu tipis → **Minimum Stock**.

## Cara pakai

1. Buka baris → ikon binding / Specification Product.
2. Isi **Fake Stock** dan/atau **Minimum Stock** / **Stock Ratio**.
3. **Save**.
4. Jalankan **Push Stock** (header atau bulk).

## Catatan

- Menyimpan pengaturan lokal tetap boleh meski belum bind — tapi push tidak efektif tanpa bind **atau** Fake Stock.
- **Stock Ratio** tidak boleh desimal.
- Bulk Edit Stock (centang banyak baris) melewati baris **PARENT**.
- Stok PARENT di marketplace diabaikan saat sync stok.

## Contoh

| Fake | Ratio | Min | ATS | Hasil push (ringkas) |
|------|-------|-----|-----|----------------------|
| 100 | — | — | 5 | 100 (Fake menang) |
| kosong | 50% | 0 | 40 | 20 |
| kosong | 100% | 30 | 25 | 0 (di bawah minimum) |

## Lihat juga

- [Push Stock](#sf-lingo:SF-MPP-03)
- [Manual Binding](#sf-lingo:SF-MPP-04)
- [Feature Map](../feature-map.md) · [KB Fake Stock FAQ](../knowledge-base.md#8-faq)
