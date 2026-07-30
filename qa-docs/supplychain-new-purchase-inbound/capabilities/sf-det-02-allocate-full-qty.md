---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-DET-02
title: Allocate Full Qty
aliases: [allocate full, sisa PO penuh, clearing qty]
scope: menu
summary: >-
  Ambil sisa qty PO penuh ke baris GRN — membantu saat konversi unit
  meninggalkan sisa desimal yang sulit diisi manual.
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Allocate Full Qty

## Apa ini

Aksi di modal Outstanding PO untuk **mengambil seluruh sisa qty** baris PO ke detail GRN. Berguna saat konversi unit membuat sisa desimal yang sulit diketik manual tanpa melebihi batas.

## Kapan dipakai

- Ingin menerima **seluruh sisa** satu baris PO.
- Ada selisih kecil karena unit (pcs vs pack) yang membuat input manual rawan error.
- Melengkapi sisa setelah sebelumnya partial receive.

## Cara pakai

1. Buka **Outstanding PO** pada form GRN.
2. Pilih baris yang masih punya sisa.
3. Klik **Allocate Full Qty** (atau ekuivalen di modal).
4. Qty terisi = sisa outstanding; lengkapi batch/serial/expired bila wajib.
5. Simpan detail lalu Approve bila siap.

## Catatan

- Tetap tidak boleh melebihi sisa PO — Allocate Full memakai sisa yang sah.
- Beda dengan **Bulk Use**: Allocate Full fokus menghabiskan sisa satu/lebih baris yang dipilih dengan qty penuh; Bulk Use memasukkan banyak baris sekaligus dengan qty default sisa.
- Setelah PO **Closed** / void untuk sisa, baris tidak muncul / tidak bisa dialokasi.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Sisa PO 12,5 (unit aneh setelah konversi) | Allocate Full Qty | Qty = 12,5 tanpa tebak-tebakan |
| Sisa 60 setelah GRN sebelumnya 40 | Allocate Full Qty | 60 masuk; baris PO siap Complete setelah approve |

## Lihat juga

- [Bulk Use / Single Use](#sf-lingo:SF-DET-01)
- [Partial receiving](#sf-lingo:SF-INB-02)
