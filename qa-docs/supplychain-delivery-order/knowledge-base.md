---
doc_type: knowledge-base
menu: supplychain-delivery-order
menu_name: "Delivery Order"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Delivery Order — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Delivery Order (DO)** adalah dokumen pengiriman barang ke customer. DO menggabungkan referensi dari **Sales Order**, **Inventory Out (Outbound)**, atau **Transfer Internal**, lalu saat disetujui memicu transfer shipping di gudang.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Delivery Order |
| Route UI | `/supplychain/delivery-order` |
| Kode dokumen | `DO` |
| Tabel utama | `omni_delivery_orders` |

> Entity DO disimpan di modul OmniChannel (`omni_delivery_orders`), tetapi diakses dari menu SCM. Class SCM `Modules\SupplyChain\Entities\DeliveryOrder` extends entity OmniChannel.

## Kapan dipakai

- Mengirim barang untuk **Sales Order** (general atau platform) yang sudah melewati proses collecting/shipping.
- Mengirim berdasarkan **Inventory Out** yang outstanding.
- Mengirim berdasarkan **Transfer Internal** outstanding.
- Membuat dokumen resmi pengiriman beserta shipper, AWB, dan alamat.

## Langkah operasional

### 1. Buat DO

1. Buka **Delivery Order** → **Create**.
2. Isi header: tanggal, shipper (wajib), AWB, alamat, kendaraan.
3. Simpan — status awal **`draft`**.
4. Ubah ke **`open`** jika siap isi detail.

### 2. Tambah detail

Pilih salah satu sumber (bisa kombinasi per dokumen):

| Sumber | Panel di form | Prasyarat |
|--------|---------------|-----------|
| **Sales Order** | Available Sales Order | SO sudah punya collecting list (`PROCESS_TYPE_SHIPPING`); tanggal DO ≥ tanggal SO & collecting |
| **Inventory Out** | Available Inventory Out | Outbound outstanding |
| **Transfer Internal** | Available Transfer Internal | Transfer internal outstanding |

Gunakan **Bulk Use** untuk menambah grup referensi sekaligus.

### 3. Approve DO

1. Pastikan minimal **1 baris detail**.
2. Klik **Approve**.
3. Sistem:
   - Update qty processed di SO detail & outbound detail
   - Generate **Shipping DO transfer** (`PROCESS_TYPE_SHIPPING_DO`)
   - Auto-approve transfer shipping tersebut

### 4. Setelah approve

- DO tidak bisa diedit sembarangan.
- Lanjutkan proses outbound/settlement sesuai alur SO (lihat dokumentasi Sales Order General).

## Status dokumen

| Status | Arti untuk operator |
|--------|---------------------|
| `draft` | Baru dibuat; header bisa diisi |
| `open` | Siap tambah detail / approve |
| `approved` | Disetujui; transfer shipping DO terbuat |
| `rejected` | Ditolak approver |
| `void` | Dibatalkan |

## Panel penting di form

| Panel | Fungsi |
|-------|--------|
| Header Basic Information | Tanggal, shipper, AWB, alamat |
| Available Sales Order | Pilih SO outstanding untuk DO |
| Available Inventory Out | Pilih outbound outstanding |
| Available Transfer Internal | Pilih transfer internal outstanding |
| Datalist Detail | Baris DO yang sudah ditambahkan |
| Approval Eligibility / Log | Workflow approval |

## Troubleshooting

| Gejala | Kemungkinan penyebab | Tindakan |
|--------|---------------------|----------|
| SO tidak bisa dipakai di DO | Collecting list belum ada atau tanggal DO lebih awal | Cek Transfer Collected; sesuaikan tanggal DO |
| "SO has later transaction date" | Tanggal DO < tanggal SO | Naikkan tanggal DO |
| Approve gagal — no detail | Belum ada baris | Tambah detail dari salah satu sumber |
| Approval sedang berjalan | Cache lock 15 detik | Tunggu lalu coba lagi |
| DO sudah approved | Status final untuk edit | Tidak bisa ubah header/detail |

## Relasi menu

| Menu terkait | Route | Hubungan |
|--------------|-------|----------|
| Sales Order General | `businessdevelopment/sales-order-general` | Sumber detail DO (SO internal) |
| Sales Order Platform | `omni/sales-order` | Sumber detail DO (marketplace) |
| Inventory Out | `supplychain/mutation-outbound` | Sumber detail outbound |
| Transfer Internal | `supplychain/mutation-transfer-internal` | Sumber detail transfer |
| Collecting / Shipping | Transfer Summary SCM | Prasyarat SO — `PROCESS_TYPE_SHIPPING` |
| [Instant Settlement](../accounting-settlement-upload/README.md) | Butuh DO approved → Shipped WH 3PL sebelum upload |

## Relasi Instant Settlement (operator)

Order harus **Shipped WH 3PL** sebelum bisa di-settle. Status itu tercapai setelah rantai gudang termasuk **Collecting** dan **Delivery Order approved**.

| Gejala settlement | Cek di DO |
|-------------------|-----------|
| SO Failed — belum Shipped | Apakah DO sudah approve? Collecting list ada? |
| Tanggal tidak valid | Tanggal DO ≥ tanggal SO; collecting date ≤ DO |

Detail: [Instant Settlement](../accounting-settlement-upload/requirement.md)

## Istilah

| Istilah | Arti |
|---------|------|
| AWB | Air Waybill / nomor resi pengiriman |
| Collecting List | Transfer shipping sebelum DO — virtual WH `shipping` |
| Shipping DO | Transfer otomatis saat DO di-approve (`PROCESS_TYPE_SHIPPING_DO`) |
