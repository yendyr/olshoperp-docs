---
doc_type: menu-capability
menu: accounting-customer-invoice
id: SF-DET-01
title: Outstanding SO Use
aliases: [outstanding sales order, use SO, partial invoice, bulk use SO]
scope: menu
summary: >-
  Ambil sisa SO ke SI per baris SKU atau per SO. Qty line = seluruh sisa baris
  (tidak edit partial 5 dari 10). Satu SO boleh multi SI antar SKU.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Outstanding SO Use

## Apa ini

Panel **Outstanding Sales Order** menampilkan sisa SO yang belum penuh di-invoice. **Use** memasukkan baris ke SI. Qty yang diambil = **seluruh sisa** baris itu — bukan sebagian qty dalam satu SKU.

## Kapan dipakai

- Tagih sebagian SO dulu (SKU-A sekarang, SKU-B nanti).
- Tagih seluruh sisa satu SO sekaligus (group).
- Cek Invoice Progress: Prepared (SI belum approved) vs Processed (SI approved).

## Cara pakai

1. Buka SI yang masih Draft/Open.
2. Buka **Outstanding Sales Order** (detail per SKU atau group per SO).
3. Pilih baris / SO → **Use** (atau create-group untuk semua outstanding line SO).
4. Pastikan qty = sisa penuh baris — field qty with-SO biasanya **tidak** bisa diedit partial.
5. Lanjut Approve setelah status **Open**.

## Catatan

- Filter outstanding pakai **SO number internal**, bukan platform order code.
- Bundle: yang tampil biasanya **header bundle**.
- Setelah ada detail, customer/tanggal/kurs terkunci sampai detail dikosongkan.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| SO: SKU-A 10, SKU-B 10 | Use hanya SKU-A | SI qty 10; SKU-B tetap outstanding |
| Mau 5 dari 10 di satu SKU via Use | Coba edit qty | Tidak — harus full remaining line |
| Satu SO masih ada sisa | Group Use | Semua outstanding line SO masuk SI |

## Lihat juga

- [How SI is created](#sf-lingo:SF-SI-01)
- [Net Sales](#sf-lingo:SF-SI-03)
- Knowledge Base: [knowledge-base.md](../knowledge-base.md)
