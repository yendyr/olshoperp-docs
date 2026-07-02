---
doc_type: knowledge-base
menu: supplychain-purchase-order
menu_name: "Purchase Order"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
aliases: [PO, purchase order docs, pembelian, outstanding PR, goods receipt link]
---

# Purchase Order — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Purchase Order (PO)** adalah dokumen pembelian ke supplier di modul Supply Chain. PO mencatat produk, harga, pajak, biaya/diskon tambahan, dan menjadi dasar penerimaan barang melalui **Inbound (GRN)**.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Purchase Order |
| Route UI | `/supplychain/purchase-order` |
| Kode dokumen | `PO` |
| Tabel utama | `scm_purchase_orders` |

## Kapan dipakai

- Memesan barang ke **supplier** (General Company dengan flag supplier).
- Melanjutkan **Purchase Requisition (PR)** yang sudah disetujui (`with_pr = 1`).
- Membuat pesanan pembelian langsung tanpa PR (`with_pr = 0`).
- Menjadi referensi saat barang diterima di menu **Inbound**.

## Tipe PO

| Tipe (`with_pr`) | Arti | Cara isi detail |
|------------------|------|-----------------|
| **With PR** | PO berbasis Purchase Requisition | Ambil baris outstanding PR lewat panel Outstanding PR |
| **Without PR** | PO langsung | Tambah produk manual di detail PO |

Tipe PO **tidak bisa diubah** setelah header dibuat.

## Langkah operasional

### 1. Buat PO baru

1. Buka **Purchase Order** → **Create**.
2. Isi header: tanggal transaksi, supplier, mata uang, kurs, alamat, tipe PO (With/Without PR).
3. Simpan — status awal **`open`**.
4. Tambah detail produk (manual atau dari PR).
5. (Opsional) Tambah **Other Cost** dan **Other Discount**.
6. (Opsional) Upload lampiran.

### 2. Ajukan approval

1. Pastikan PO punya minimal **1 baris detail**.
2. Klik **Approve** (workflow approval multi-level sesuai role).
3. Setelah disetujui, status menjadi **`approved`**.
4. PO **With PR**: qty PR ter-update (`processed_to_po_quantity` naik).

### 3. Terima barang (GRN)

1. Buka menu **Inbound** (`supplychain/mutation-inbound`).
2. Buat inbound dengan referensi detail PO.
3. Saat qty diterima ter-update di detail PO:
   - Sebagian diterima → status PO **`processed`**
   - Semua qty terpenuhi → status PO **`complete`**

### 4. Tutup / void

- **Void** atau **Close** tersedia setelah approval, sesuai hak akses dan kondisi dokumen (mis. belum ada proses GRN).

## Status dokumen

| Status | Arti untuk operator |
|--------|---------------------|
| `draft` | Masih disusun (bisa diedit jika di-set ke draft) |
| `open` | Siap diisi detail / diajukan approval |
| `approved` | Disetujui; siap diterima via Inbound |
| `processed` | Sebagian qty sudah diterima (GRN) |
| `complete` | Semua qty PO sudah diterima penuh |
| `rejected` | Ditolak approver; bisa diedit lalu diajukan ulang |
| `void` | Dibatalkan |

## Panel & fitur penting di form

| Panel | Fungsi |
|-------|--------|
| Header Basic Information | Supplier, tanggal, mata uang, kurs, alamat |
| Detail (tree) | Produk, qty, harga, diskon, pajak |
| Outstanding PR | Hanya PO With PR — pilih baris PR outstanding |
| Other Cost / Other Discount | Biaya tambahan & diskon header-level |
| Approval Eligibility | Siapa yang boleh approve |
| Log Approval | Riwayat approval |

## Troubleshooting

| Gejala | Kemungkinan penyebab | Tindakan |
|--------|---------------------|----------|
| Tidak bisa edit PO | Status sudah `approved` / `processed` / `complete` | Cek status; void/close hanya jika diizinkan |
| Approve gagal — no detail | Belum ada baris produk | Tambah minimal 1 detail |
| Supplier tidak muncul | Bukan General Company supplier | Cek master General Company (`is_supplier = 1`) |
| Kurs invalid | Mata uang primer tapi kurs ≠ 1 | Set kurs = 1 untuk mata uang primer |
| Tanggal ditolak | Tanggal > hari ini atau di luar fiscal period | Sesuaikan tanggal transaksi |
| Import detail masih jalan | Batch import PR/PO aktif | Tunggu proses import selesai lalu approve ulang |
| PR tidak bisa dipakai | PR closed atau qty habis | Cek outstanding PR & status PR |

## Relasi menu

| Menu terkait | Route | Hubungan |
|--------------|-------|----------|
| Purchase Requisition | `supplychain/purchase-requisition` | Sumber detail untuk PO With PR |
| Inbound (GRN) | `supplychain/mutation-inbound` | Penerimaan barang dari PO → ubah status processed/complete |
| General Company | General Setting | Master supplier |
| Adjustment Addition | `supplychain/adjustment-addition` | Tidak langsung; via inbound |

## Istilah

| Istilah | Arti |
|---------|------|
| GRN | Goods Receipt Note — penerimaan barang (Inbound) |
| With PR | PO dengan referensi Purchase Requisition |
| Outstanding PR | Baris PR yang belum diproses ke PO |
