---
doc_type: menu-capability
menu: supplychain-purchase-requisition
id: SF-DET-01
title: Add / edit detail SKU
aliases: [tambah detail PR, multiselect product, qty PR]
scope: menu
summary: >-
  Tambah baris SKU ke Purchase Requisition (multiselect atau import).
  Maksimal 100 baris; qty manual bilangan bulat; edit hanya sebelum Approved.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Add / edit detail SKU

## Apa ini

Section **Detail** berisi daftar produk yang diminta. Kamu menambah SKU dari System Product, mengatur qty/unit/deskripsi, lalu menyimpan sebelum Approve.

## Kapan dipakai

- Menyusun permintaan beli internal (SKU + qty).
- Mengoreksi qty sebelum PR di-approve.
- Menambah banyak SKU cepat via multiselect (qty default 1) atau [Import](#sf-lingo:SF-IMP-01).

## Cara pakai

1. Simpan header PR (tanggal, priority, dll.).
2. Di Detail, pilih produk (multiselect) atau buka baris untuk edit qty/unit/description.
3. Pastikan total baris ≤ **100** (termasuk hasil import).
4. Qty di form manual = **bilangan bulat**; hapus/edit baris hanya sebelum **Approved**.
5. Set status **Open** → **Approve**.

## Catatan

- Setelah ada detail, **tanggal / required delivery / priority** bisa terkunci — hapus detail dulu jika perlu diganti.
- Bundle child & SKU random tidak bisa dipilih / tidak ketemu di import.
- Setelah Reject + ubah detail, status sering jadi **Draft** — set **Open** lagi sebelum Approve.
- Priority hanya informasi untuk procurement — tidak mengubah aturan sistem.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| PR baru | Multiselect 3 SKU | 3 baris qty 1 |
| 95 baris sudah ada | Import 10 baris | Ditolak — total > 100 |
| PR Approved | Edit qty | Tidak bisa — read-only |

## Lihat juga

- [Import Detail](#sf-lingo:SF-IMP-01)
- [Process to Purchase Order](#sf-lingo:SF-PR-03)
