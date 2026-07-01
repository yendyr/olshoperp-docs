---
doc_type: knowledge-base
menu: supplychain-inventory-detail
menu_name: "Inventory Detail"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Inventory Detail — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Inventory Detail?

Laporan **detail inventori per lokasi gudang** berdasarkan warehouse space type (level gudang). Menampilkan SKU, lokasi, qty on hand, reserved, in transit, stock alert, dan drill-down ke item stock / reserved detail.

| Item | Nilai |
|------|-------|
| Menu | SCM → Report → Inventory Detail |
| Route UI | `/supplychain/inventory-detail` |
| API | `GET supplychain/inventory-detail?warehouse_space_type=` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Warehouse Space Type | Level struktur gudang (company, building, rack, dll.) |
| Item Stock | Batch/lot stok fisik (`scm_item_stocks`) |
| Reserved | Qty terbooking untuk transfer/outbound draft |
| In Transit | Qty sedang dalam perpindahan gudang |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Pilih warehouse level → datalist semua SKU di level tersebut
- Quick filter cards: All Stock, Out of Stock, Number of Warning, Qty In Transit
- Drill-down modal: detail item stock IDs, reserved stock mutations
- Export Excel async (chunked via temp table)

### Tidak Bisa

- Adjust stok dari menu ini
- Lihat tanpa memilih warehouse space type

## 4. Cara Pakai

1. Pilih **Warehouse Level** di dropdown.
2. Gunakan search builder / filter kolom.
3. Klik angka reserved/in transit untuk modal detail (jika tersedia).
4. Export → pantau progress.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Count card tidak update | `warehouse_space_type` belum dipilih | Pilih level dulu |
| Export lambat | Banyak SKU × warehouse | Job async — tunggu |
| Reserved selalu `-` | Column hardcoded return `-` di sebagian path | Known AS-IS — cek versi controller |

## Related Documents

| Doc | Path |
|-----|------|
| Real Time Stock | [../supplychain-real-stock/README.md](../supplychain-real-stock/README.md) |
