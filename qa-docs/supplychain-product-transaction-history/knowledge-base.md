---
doc_type: knowledge-base
menu: supplychain-product-transaction-history
menu_name: "Product Transaction History"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Product Transaction History — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Product Transaction History?

Dashboard analitik **siklus pembelian dan penjualan** per produk dalam rentang tanggal. Menampilkan metrik PR, PO, inbound, outbound, grafik tren, dan tab detail (Purchase Requisition, Purchase Order, Mutation, Recent Price/Outbound History).

| Item | Nilai |
|------|-------|
| Menu | SCM → Report → Product Transaction History |
| Route UI | `/supplychain/product-transaction-history` |
| API backend | `supplychain/item-transaction-history/*` (bukan path UI) |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| PR | Purchase Requisition |
| PO | Purchase Order |
| Lead Time | Rata-rata waktu PR→PO→Inbound |
| Approved Only | Filter hanya transaksi approved |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Pilih produk, start/end date, status transaksi (All / Approved Only)
- Lihat KPI cards: jumlah transaksi, qty, rata-rata harian
- Drill-down tab PR, PO, Mutation, price history, outbound history
- Export Excel report

### Tidak Bisa

- Edit dokumen PR/PO dari menu ini
- Lihat data tanpa memilih produk

## 4. Cara Pakai

1. Pilih produk, tanggal mulai/akhir, status.
2. Dashboard KPI dan chart ter-refresh otomatis.
3. Buka tab detail untuk melihat daftar transaksi.
4. Export Excel jika perlu.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Semua KPI 0 | Produk tidak ada transaksi di periode | Perluas rentang tanggal |
| Chart kosong | `product_id` null | Pilih produk |
| Export gagal | Job queue | Cek Horizon |

## Related Documents

| Doc | Path |
|-----|------|
| Purchase Order | [../supplychain-purchase-order/README.md](../supplychain-purchase-order/README.md) |
