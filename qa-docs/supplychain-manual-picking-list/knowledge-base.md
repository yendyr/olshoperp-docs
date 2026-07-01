---
doc_type: knowledge-base
menu: supplychain-manual-picking-list
menu_name: "Manual Picking List"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Manual Picking List — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Manual Picking List** (kode `PL-*`) adalah dokumen transfer internal untuk memindahkan barang dari gudang asal ke rak picking (out rack) secara manual — tanpa terikat wave/omni picking otomatis.

## Kapan dipakai

- Picking manual untuk kebutuhan operasional (bukan dari wave SO).
- Persiapan stok ke area picking sebelum proses checking/packing.

## Langkah operator

### 1. Buat Picking List

1. Buka **Supply Chain → Operations → Manual Picking List**.
2. Create — pilih **warehouse origin**, tanggal transaksi, nama (opsional).
3. Sistem otomatis set **warehouse destination** dari Warehouse Setting (out rack type PICKING).

### 2. Tambah detail produk

1. Edit dokumen — tambah produk/qty di tab detail.
2. Bulk FIFO: ambil stok berdasarkan FIFO.
3. Import Excel: upload file detail (`manual-picking-list-detail/upload`).

### 3. Set lokasi & proses picking

1. Buka **Set Location** (`/manual-picking-list/set-location/:id`) — scan/set lokasi per item.
2. Buka **Process** (`/manual-picking-list/process/:id`) — jalankan picking aktual.
3. Pause/Resume tersedia jika proses terinterrupt.

### 4. Selesaikan & cetak

- **Completion Summary** — ringkasan SKU/qty.
- Print: per dokumen atau bulk print.
- Export Excel dari datalist.

## Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| Destination kosong | Out rack belum di-setting | Atur di Warehouse Setting |
| Tidak bisa edit | Picking sudah dimulai (`start` terisi) | Hanya bisa pause/resume atau buat PL baru |
| Incomplete picklist badge | Ada PL belum selesai | Cek menu incomplete picklist |

## Relasi menu

- **Warehouse Setting** — out rack picking destination.
- **Location** — lokasi fisik saat set-location.
- **Real Time Stock** — cek ketersediaan stok asal.
