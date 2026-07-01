---
doc_type: knowledge-base
menu: supplychain-assembly
menu_name: "Assembly"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Assembly — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

Menu **Assembly** (kode dokumen `AS-*`) digunakan untuk merakit produk jadi (finish goods) dari komponen Bill of Material (BoM). Di backend, fitur ini diimplementasikan sebagai **Work Order** (`work-order` API).

## Kapan dipakai

- Produksi internal: mengubah komponen menjadi produk jadi di gudang tertentu.
- Setelah SO/transfer internal membutuhkan barang rakitan sebelum dikirim.

## Langkah operator

### 1. Buat Assembly

1. Buka **Supply Chain → Operations → Assembly**.
2. Klik **Create** — isi tanggal transaksi, gudang, tanggal mulai, dan tipe.
3. Simpan — status awal **draft**.

### 2. Tambah detail produk jadi

1. Buka dokumen Assembly (edit).
2. Tambah baris detail: pilih produk finish goods yang punya BoM aktif.
3. Isi quantity yang akan dirakit.
4. Opsional: import detail via Excel (`work-order-detail/upload`).

### 3. Approve Assembly

1. Pastikan **Warehouse Setting** gudang terkait sudah punya WIP dan Finish Good warehouse.
2. Pastikan stok komponen BoM mencukupi di gudang assembly.
3. Klik **Approve** — sistem akan:
   - Validasi COA WIP & Inventory pada produk BoM.
   - Generate transfer internal (komponen ke WIP, finish goods masuk FG).
   - Menjalankan job approval async (`WorkOrderApprovalJob`).

### 4. Monitor progress

- Kolom **Progress** menampilkan persentase penyelesaian detail.
- Jika ada error di detail, perbaiki komponen/stok lalu gunakan **Retry** (`work-order/{id}/retry`).

## Troubleshooting

| Gejala | Kemungkinan penyebab | Tindakan |
|--------|---------------------|----------|
| Approve gagal: WIP/FG belum dikonfigurasi | Setting gudang kosong | Atur di **Warehouse Setting** |
| Approve gagal: COA tidak lengkap | Produk BoM tanpa COA WIP/Inventory | Perbaiki COA produk di master Product |
| Approve gagal: komponen tidak aktif | BoM berisi produk inactive | Update BoM / aktifkan produk |
| Progress stuck / generating | Job masih berjalan | Tunggu 2 menit, coba retry |
| Stok komponen tidak cukup | Available qty di bawah threshold | Pastikan inbound/transfer sudah approved |

## Relasi menu

- **Bill of Material** — sumber struktur komponen.
- **Warehouse Setting** — WIP & Finish Good warehouse per gudang assembly.
- **Transfer Internal** — dokumen transfer yang dihasilkan saat approve.
