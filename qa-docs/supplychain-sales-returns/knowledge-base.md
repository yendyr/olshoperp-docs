---
doc_type: knowledge-base
menu: supplychain-sales-returns
menu_name: "Sales Return"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Sales Return — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

Menu **Sales Return** dipakai operator gudang untuk memproses retur pesanan penjualan (platform/omni). UI berada di modul SCM, tetapi API utama di modul **Accounting** (`accounting/sales-returns`).

## Kapan dipakai

- Paket retur diterima di gudang.
- Perlu restock, catat barang rusak/hilang, dan approve inbound retur.

## Langkah operator

### 1. Siapkan konteks gudang

1. Buka **Supply Chain → Operations → Sales Return**.
2. Pilih **Warehouse** dan **CCTV Location** — disimpan di localStorage per company.

### 2. Scan / input Sales Order

1. Scan atau ketik kode SO / platform order ID / platform return ID.
2. Sistem validasi: SO ditemukan, belum fully processed, tidak ada pending return.

### 3. Proses detail retur

1. Buka halaman edit retur (`sales-returns/edit/:id`).
2. Per SKU isi:
   - **Restock quantity** (masuk gudang)
   - **Broken quantity**
   - **Lost quantity**
3. Minimal salah satu qty > 0 sebelum approve.

### 4. Approve

1. Klik Approve — sistem:
   - Mutasi stok inbound retur (`ItemStockMutation::approveReturn`)
   - Jurnal akuntansi terkait
   - Duplikasi platform return jika masih ada sisa qty

## Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| SO tidak ditemukan | Kode salah / scope company | Cek kode SO atau platform ID |
| Pending return exists | Ada retur belum selesai | Selesaikan retur sebelumnya |
| Approve: qty kosong | Semua qty 0 | Isi restock/broken/lost |
| Fiscal period error | Periode tutup | Buka periode atau ubah tanggal |

## Relasi menu

- **Sales Order** (Omni / General) — sumber retur.
- **Inventory In** — mutasi inbound hasil approve.
- **Customer Invoice** — referensi harga/COA.
