---
doc_type: knowledge-base
menu: supplychain-other-inbound
menu_name: "Other Inbound"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Other Inbound — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Other Inbound** adalah penerimaan stok **tanpa Purchase Order / supplier**. Dipakai untuk barang masuk non-pembelian, misalnya hasil **Assembly (Work Order)**, adjustment operasional, atau sumber non-PO lain.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Other Inbound |
| Route UI | `/supplychain/other-inbound` |
| Datalist API | `GET supplychain/other-inbound` |
| Detail/approve API | `supplychain/mutation-inbound*` (shared) |
| Scope DB | `supplier_id IS NULL`, `is_inventory_adjustment = 0` |
| Kode dokumen | Prefix `IN` |

## Kapan dipakai

- Stok masuk bukan dari pembelian supplier (tanpa PO).
- Hasil produksi/assembly perlu masuk finish-good warehouse.
- Penerimaan manual produk + harga (`each_price_before_vat`) tanpa referensi PO.

## Langkah operasional

### 1. Lihat / buka other inbound

1. Buka **Other Inbound** — datalist dari `OtherInboundController@index` (filter tanpa supplier).
2. Banyak dokumen **auto-generated** dari Work Order/Assembly (deskripsi: "Auto generated from Assembly …").
3. Klik kode → edit form (`/supplychain/other-inbound/edit/{id}`).

### 2. Tambah detail produk

1. Di panel detail, tambah produk langsung (tanpa outstanding PO).
2. Isi qty, unit, harga per unit (`each_price_before_vat`), batch/expired jika wajib.
3. API: `POST mutation-inbound/{id}/mutation-inbound-detail`.
4. Tidak memakai middle-detail layer (skip FIFO middle untuk other path).

### 3. Approve

1. `POST mutation-inbound/{id}/approve` — sama dengan purchase inbound.
2. Stok naik di warehouse destination.
3. Tidak update PO qty (karena tidak ada `purchase_order_detail_id`).

## Perbedaan dengan Purchase Inbound

| Aspek | Purchase Inbound | Other Inbound |
|-------|------------------|---------------|
| Supplier | Wajib | Tidak ada |
| Sumber detail | Outstanding PO | Produk langsung |
| Middle detail FIFO | Ya (default) | Tidak |
| Harga | Dari PO | Input manual `each_price_before_vat` |
| Datalist API | `mutation-inbound` + supplier filter | `other-inbound` |

## Status dokumen

| Status | Arti |
|--------|------|
| `open` | Bisa edit & tambah detail |
| `approved` | Stok sudah posted |
| `rejected` | Ditolak approver |

## Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| Dokumen tidak punya supplier | Expected — other inbound scope | Normal |
| Link dari Work Order | Auto-generated saat WO approve | Buka dari Assembly reference |
| Header form read-only | Field disabled di Form.vue saat edit | Perilaku UI saat ini |
| Create manual | Header create via `mutation-inbound` store dengan `other=true` (programmatic) | UI create route ada; form perlu verifikasi QA |

## Relasi menu

| Menu | Route | Hubungan |
|------|-------|----------|
| Assembly / Work Order | `supplychain/assembly` | Auto-generate other inbound |
| Purchase Inbound | `supplychain/new-purchase-inbound` | Same backend, beda scope |
| Adjustment Addition | `supplychain/adjustment-addition` | Beda flag `is_inventory_adjustment=1` |
| Real Time Stock | `supplychain/real-stock` | Stok naik setelah approve |

## Istilah

| Istilah | Arti |
|---------|------|
| Other inbound | GRN non-PO / non-supplier |
| `generateDetailOther()` | Backend path create detail tanpa PO |
| Work Order inbound | Other inbound auto dari assembly approval job |
