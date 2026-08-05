---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-DET-01
title: Use / Allocate Full Qty Clearing
aliases: [use, allocate full, available product, outstanding PR]
scope: menu
summary: >-
  Dari Available Product, masukkan baris ke detail PO. Use = satu baris
  dengan qty/harga bisa diisi; Allocate Full Qty Clearing = isi sisa qty PR sekaligus.
version: 1.1
last_updated: 2026-08-05
status: draft
---

# Use / Allocate Full Qty Clearing

## Apa ini

Cara mengisi detail Purchase Order dari modal **Available Product**. **Use** membuka form untuk satu baris (qty, unit, harga, diskon, VAT). **Allocate Full Qty Clearing** (With PR) mengisi sisa qty outstanding PR sekaligus tanpa isi satu per satu.

## Kapan dipakai

- **With PR:** ambil baris dari outstanding PR.
- **Without PR:** pilih produk aktif lalu isi qty/harga.
- Butuh menghabiskan sisa qty PR cepat → **Allocate Full Qty Clearing**.

## Cara pakai

1. Pastikan header PO sudah tersimpan (supplier & tipe sudah dipilih).
2. Di section Detail, buka **Available Product**.
3. Cari baris yang masih outstanding (PR) atau produk yang diinginkan.
4. Pilih salah satu:
   - **Use** — isi qty, unit, harga, diskon, VAT, lalu konfirmasi.
   - **Allocate Full Qty Clearing** (With PR) — sisa qty PR masuk ke detail.
5. Simpan detail; ulangi sampai baris yang dibutuhkan lengkap.

## Catatan

- With PR: qty tidak boleh melebihi sisa outstanding PR.
- Input manual qty di form = **bilangan bulat**; import boleh desimal > 0.
- Maksimal **500** baris detail per PO.
- Setelah PO approved, detail terkunci — edit/hapus hanya sebelum approve.
- **Pajak (TO-BE GAP-PO-11):** Allocate Full / bulk Use harus memakai **resolver tax yang sama** dengan add product (hormati supplier `auto_add`) — **AS-IS** Allocate Full sering **tanpa** tax line. Setelah rilis, hasil tax harus konsisten dengan Use / import kosong VAT.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| PR sisa 100 pcs, belum di-PO | Use qty 40 | 40 masuk detail; sisa PR outstanding 60 |
| PR sisa 60 pcs | Allocate Full Qty Clearing | 60 masuk detail; outstanding PR untuk baris itu habis |
| Without PR, produk aktif | Use qty 10, harga 50.000 | Baris produk masuk detail |
| Allocate Full + supplier auto_add yes (TO-BE) | Allocate Full | Detail + tax sama seperti add product |

## Lihat juga

- [With PR / Without PR](#sf-lingo:SF-PO-01)
- [Import Detail](#sf-lingo:SF-IMP-01)
- Knowledge Base: [§6.2 Section Detail](../knowledge-base.md)

