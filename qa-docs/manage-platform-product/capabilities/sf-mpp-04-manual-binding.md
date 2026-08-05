---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-04
title: Manual Binding
aliases: [bind manual, specification product, unbind]
scope: menu
summary: >-
  Manual Binding menghubungkan satu baris Platform Product ke System Product
  lewat modal Specification Product. PARENT tidak bisa di-bind langsung.
version: 1.0
last_updated: 2026-07-31
status: review
---

# Manual Binding

## Apa ini

**Manual Binding** menghubungkan satu SKU marketplace ke satu **System Product** lewat ikon binding di baris → modal **Specification Product** → section Binding. Status menjadi **Binded** (hijau). Unbind = kosongkan System Product lalu Save.

## Kapan dipakai

- SKU platform ≠ SKU system (Auto Binding tidak cocok).
- Binding satu SKU di satu toko dengan kontrol penuh.
- Mengganti atau melepas binding yang sudah ada.
- Order stuck karena produk belum bind — bind SKU terkait.

## Cara pakai

1. Pastikan **Store** terpilih dan baris bukan **PARENT**.
2. Klik ikon **binding** pada baris.
3. Di **Binding Product**, pilih System Product → **Save**.
4. (Opsional) Atur [Stock Management](#sf-lingo:SF-MPP-07) di section yang sama → Save.
5. Cek badge **Binded** dan kolom System Product terisi.

## Catatan

- **PARENT** tidak punya tombol bind — bind tiap **VARIANT**; PARENT hijau jika semua anak sudah bind.
- System Product **Fix Asset** ditolak.
- Produk random vs non-random tanpa konfirmasi ditolak.
- Toko belum authorized → tombol binding disembunyikan.
- Setelah bind, order yang error unbinded product biasanya terisi otomatis (tidak perlu re-sync order).
- Unbind tidak menghapus product_id yang sudah terisi di order lama.

## Lihat juga

- [Auto Binding](#sf-lingo:SF-MPP-05)
- [Bulk Binding](#sf-lingo:SF-MPP-06)
- [Feature Map](../feature-map.md) · [KB §6 Bind manual](../knowledge-base.md#skenario-bind-manual-satu-sku-satu-toko)
