---
doc_type: knowledge-base
menu: supplychain-product-mutation-stock
menu_name: "Stock History"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Stock History — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Stock History?

Laporan **riwayat mutasi stok per produk dan gudang** (warehouse-scoped). Berbeda dengan Product Mutation History yang global, menu ini menampilkan ending balance **per warehouse** dan mendukung filter periode tanggal, warehouse level, dan warehouse tree.

| Item | Nilai |
|------|-------|
| Menu | SCM → Report → Stock History |
| Route UI | `/supplychain/product-mutation-stock` |
| API | `GET supplychain/product-mutation-stock` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Ending Balance Per Warehouse | Saldo per gudang (`scmag_ending_balance_per_warehouses`) |
| Warehouse Space Type | Level gudang (building, rack, dll.) |
| Select Periode | Rentang tanggal transaksi |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Filter: Product, Warehouse, Warehouse Level, Periode
- Lihat qty in/out dan ending balance per baris mutasi per gudang
- Export Excel async
- Trigger manual ending balance calculation (shared endpoint dengan Product Mutation)

### Tidak Bisa

- Edit transaksi dari report
- Lihat tanpa memilih produk

## 4. Cara Pakai

1. Pilih **Product**, **Warehouse**, **Level**, dan **Periode**.
2. Klik search/load → datalist mutasi per warehouse.
3. Export jika perlu arsip Excel.
4. Gunakan calculate jika ending balance belum sinkron.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Ending balance 0 semua | Warehouse child tidak match level | Sesuaikan warehouse level filter |
| Data tidak filter periode | `select_periode` tidak dikirim | Set range date di FE |

## Related Documents

| Doc | Path |
|-----|------|
| Product Mutation History | [../supplychain-product-mutation/README.md](../supplychain-product-mutation/README.md) |
