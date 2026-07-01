---
doc_type: knowledge-base
menu: supplychain-transfer-inbound
menu_name: "Transfer Inbound"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Transfer Inbound — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Transfer Inbound** adalah sisi **penerimaan** dari **Transfer External** antar warehouse. Operator menerima barang yang sudah **in transit** atau **delivered** dari gudang origin ke gudang destination.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Transfer Inbound |
| Route UI | `/supplychain/transfer-inbound` (edit only) |
| API shared | `supplychain/mutation-transfer-external` |
| Entity | `StockMutationTransferExternal` (`type = tf external`) |
| Tabel detail | `scm_transfer_mutation_details` |

## Kapan dipakai

- Transfer external sudah di-ship dari gudang asal.
- Barang dalam perjalanan (`in transit`) atau sudah sampai (`delivered`).
- Perlu konfirmasi qty received, broken, dan missing di destination.

## Langkah operasional

### 1. Lihat daftar transfer masuk

1. Buka **Transfer Inbound**.
2. Datalist menampilkan transfer dengan `transit_status` = **`in transit`** atau **`delivered`**.
3. Klik kode transfer → form edit (mode inbound).

### 2. Konfirmasi penerimaan per baris

1. Di detail transfer, isi:
   - **Quantity received** — qty diterima baik
   - **Broken quantity** — qty rusak (→ scrap warehouse)
   - **Missing quantity** — qty hilang
2. Total received + broken + missing harus = qty transfer.
3. Endpoint: `POST mutation-transfer-detail-ext/update-received` atau `transfer-external-middle-detail/update-received`.

### 3. Approve (inbound side)

1. Approval transfer inbound memakai `StockMutationTransferExternalController@approve` dengan flag **`transit`**.
2. Jika ada broken qty → sistem resolve scrap warehouse parent.
3. Setelah approved → stok masuk destination warehouse.

## Perbedaan dengan Transfer External

| Aspek | Transfer External | Transfer Inbound |
|-------|-------------------|------------------|
| Route UI | `/supplychain/mutation-transfer-external` | `/supplychain/transfer-inbound` |
| Fokus | Pick, pack, ship dari origin | Receive di destination |
| Create | Bisa create transfer baru | **Tidak ada create** — hanya edit existing |
| Filter datalist | Semua transfer external | Hanya in transit / delivered |
| Router meta | — | `transferInbound: true` |

## Status & transit

| Field | Nilai | Arti |
|-------|-------|------|
| `transaction_status` | open → approved | Status dokumen |
| `transit_status` | `in transit` | Barang dalam perjalanan |
| `transit_status` | `delivered` | Barang sudah sampai, menunggu konfirmasi |

## Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| Transfer tidak muncul | Belum in transit/delivered | Selesaikan proses ship di Transfer External |
| Qty received ditolak | Total ≠ transfer qty | Sesuaikan received + broken + missing |
| Tidak bisa edit | Status sudah approved | Cek approval log |
| Broken qty error | Scrap warehouse belum setup | Konfigurasi warehouse scrap di setting |

## Relasi menu

| Menu | Route | Hubungan |
|------|-------|----------|
| Transfer External | `supplychain/mutation-transfer-external` | Sisi outbound/pengiriman |
| Real Time Stock | `supplychain/real-stock` | Stok origin turun, destination naik |
| Warehouse Setting | `supplychain/setting` | Scrap/void warehouse config |

## Istilah

| Istilah | Arti |
|---------|------|
| Transfer External | Mutasi stok antar warehouse (external) |
| Transit status | Tahap pengiriman barang antar gudang |
| `packed_in_base_unit` | Field qty received (base unit) di detail transfer |
