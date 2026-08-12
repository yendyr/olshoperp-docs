---
doc_type: menu-capability
menu: supplychain-purchase-requisition
id: SF-DET-01
title: Add / edit detail SKU
aliases: [tambah detail PR, Select Product, Select Multiple Products, qty PR]
scope: menu
summary: >-
  Tambah baris SKU ke PR lewat Select Product (satu), Select Multiple Products (modal checkbox),
  atau Import. Maksimal 100 baris; qty manual bilangan bulat; edit hanya sebelum Approved.
version: 1.1
last_updated: 2026-08-12
status: draft
---

# Add / edit detail SKU

## Apa ini

Section **Detail** berisi daftar produk yang diminta. Kamu menambah SKU dari System Product, mengatur qty/unit/deskripsi, lalu menyimpan sebelum Approve.

## Kapan dipakai

- Menyusun permintaan beli internal (SKU + qty).
- Mengoreksi qty sebelum PR di-approve.
- Menambah banyak SKU cepat via **Select Multiple Products** (modal centang) atau [Import](#sf-lingo:SF-IMP-01).

## Cara pakai

1. Simpan header PR (tanggal, priority, dll.) — lanjut di halaman **edit**.
2. Di Detail:
   - **Select Product** — pilih satu SKU (qty default 1), atau
   - **Select Multiple Products** — buka modal, centang banyak SKU, Add (masing-masing qty 1), atau
   - Import Excel.
3. Pastikan total baris ≤ **100**. Jika pilihan modal akan melebihi 100, sistem menolak **seluruh** batch.
4. Qty di form manual = **bilangan bulat**; hapus/edit baris hanya sebelum **Approved**.
5. Set status **Open** → **Approve**.

## Catatan

- **Select Multiple Products** hanya di edit (Draft / Open / Rejected) — tidak di Show setelah Approved.
- SKU duplikat diizinkan (baris baru), sama seperti import.
- Setelah ada detail, **tanggal / required delivery / priority** bisa terkunci — hapus detail dulu jika perlu diganti.
- Bundle & SKU random tidak bisa dipilih / tidak ketemu di import.
- Setelah Reject + ubah detail, status sering jadi **Draft** — set **Open** lagi sebelum Approve.
- Priority hanya informasi untuk procurement — tidak mengubah aturan sistem.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| PR baru | Select Multiple Products → 3 SKU | 3 baris qty 1 |
| 2 baris SKU-A sudah ada | Centang SKU-A lagi di modal | Baris SKU-A baru (duplikat OK) |
| 95 baris sudah ada | Centang 10 di modal | Ditolak seluruhnya — total > 100 |
| PR Approved (Show) | Cari tombol Select Multiple Products | Tidak muncul |

## Lihat juga

- [Import Detail](#sf-lingo:SF-IMP-01)
- [Process to Purchase Order](#sf-lingo:SF-PR-03)
- Requirement [§5.1.1](../requirement.md#511-select-multiple-products-to-be)
