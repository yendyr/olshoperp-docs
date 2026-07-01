---
doc_type: knowledge-base
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# BETA - New Purchase Inbound — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**New Purchase Inbound** (UI BETA) adalah antarmuka penerimaan barang pembelian (GRN) dari **Purchase Order** yang sudah approved. Secara teknis memakai API **`mutation-inbound`** yang sama dengan menu Inbound legacy, dengan filter UI `from_menu=newInobound`.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → BETA - New Purchase Inbound |
| Route UI | `/supplychain/new-purchase-inbound` |
| API datalist | `GET supplychain/mutation-inbound?from_menu=newInobound` |
| API CRUD | `supplychain/mutation-inbound*` |
| Kode dokumen | Prefix `IN` |
| Tabel | `scm_stock_mutations` + `scm_inbound_mutation_details` |

## Kapan dipakai

- Barang dari supplier sudah tiba sesuai PO approved/processed.
- Perlu catat penerimaan ke lokasi warehouse (level 20 / leaf).
- Perlu update progress PO (`prepared_to_grn_quantity` / `processed_to_grn_quantity`).

## Langkah operasional

### 1. Buat inbound

1. Buka **New Purchase Inbound** → **Create**.
2. Isi: tanggal transaksi, **supplier** (wajib), lokasi destination, deskripsi.
3. Simpan — status **`open`**; kode auto `IN`.
4. Supplier menentukan PO outstanding yang bisa dipilih.

### 2. Tambah detail dari PO

1. Buka panel **Outstanding PO**.
2. Pilih baris `PurchaseOrderDetail` yang masih ada sisa qty GRN.
3. Isi qty, batch/expired (jika produk wajib), serial number (jika applicable).
4. Sistem buat **middle detail** (FIFO layer) lalu detail inbound per SN/qty.

### 3. Receiving inspection (opsional)

- Checklist inspeksi dari template `ReceivingInspectionTemplate`.
- Diisi sebelum/saat approval.

### 4. Approve inbound

1. Minimal 1 detail.
2. Warehouse destination harus level ≤ 20 (leaf warehouse).
3. Approval memicu `ItemStockMutation::approveInbound()` → stok naik, PO qty ter-update.

### 5. Dampak ke PO

- Partial receive → PO status **`processed`**.
- Full receive semua baris → PO **`complete`**.

## Status dokumen

| Status | Arti |
|--------|------|
| `draft` / `open` | Bisa edit header & detail |
| `approved` | Stok sudah masuk; tidak bisa edit |
| `rejected` | Ditolak approver |
| `declined` | Ada item rejected saat approval partial |

## Panel form

| Panel | Fungsi |
|-------|--------|
| Header | Supplier, tanggal, warehouse destination |
| Outstanding PO | Pilih baris PO outstanding per supplier |
| Middle detail | Layer FIFO sebelum split SN |
| Detail inbound | Baris penerimaan (tree parent-child) |
| Receiving inspection | Checklist QC penerimaan |
| Approval / Audit | Workflow & audit trail |

## Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| PO tidak muncul di outstanding | PO belum approved/processed atau supplier beda | Cek status PO & supplier inbound |
| Qty melebihi outstanding | Input > inBalance PO | Kurangi qty atau full allocate |
| Supplier wajib | Validasi create | Pilih supplier sebelum save |
| Warehouse ditolak | Bukan leaf / level > 20 | Pilih lokasi level 20 tanpa sub-lokasi |
| Tidak bisa ubah supplier | Sudah ada detail | Hapus detail dulu |
| Approval busy | Cache lock / import detail aktif | Tunggu proses selesai |

## Relasi menu

| Menu | Route | Hubungan |
|------|-------|----------|
| Purchase Order | `supplychain/purchase-order` | Sumber detail outstanding |
| Purchase Requisition | `supplychain/purchase-requisition` | Traceability via PO With PR |
| Supplier Invoice | Accounting | `prepared_to_invoice_quantity` di detail inbound |
| Real Time Stock | `supplychain/real-stock` | Stok naik setelah approve |

## Istilah

| Istilah | Arti |
|---------|------|
| GRN | Goods Receipt Note — dokumen penerimaan |
| Middle detail | Layer agregasi FIFO sebelum split serial |
| Outstanding PO | Baris PO dengan sisa qty belum diterima |
