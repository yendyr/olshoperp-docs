---
doc_type: knowledge-base
menu: supplychain-real-stock
menu_name: "Real Time Stock"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Real Time Stock — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Real Time Stock?

Laporan **stok real-time** dengan metrik operasional: On Hand, Availability (ATS), Outstanding SO, Reserved Transfer, Reserved Outbound, In Transit. Tersedia dalam tab **By Location** dan **By SKU**, dengan drill-down modal per metrik.

| Item | Nilai |
|------|-------|
| Menu | SCM → Report → Real Time Stock |
| Route UI | `/supplychain/real-stock` |
| API | `real-stock/by-location`, `real-stock/by-sku` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| On Hand | Stok fisik di gudang (termasuk yang akan dikirim) |
| Availability / ATS | Stok siap dijual (On Hand − outstanding − reserved) |
| Stock Booked | Qty terbooking pada SO |
| Stock Reserved | Reserved transfer/outbound |
| Manual Calculate | Recalculate ending stock jobs |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Filter warehouse space type + warehouse tree
- Toggle **Show based on unit UP** (primary unit conversion)
- Klik angka metrik → modal detail per warehouse
- Export By Location / By SKU (async)
- Manual calculate + log calculate (`CalculateLog.vue`)

### Tidak Bisa

- Edit stok langsung
- Lihat semua company (scoped by token)

## 4. Cara Pakai

### By Location

1. Pilih warehouse level dan warehouse parent.
2. Datalist tampil per lokasi dengan kolom metrik stok.
3. Klik qty untuk modal detail (on hand, booked, reserved, dll.).

### By SKU

1. Pilih warehouse filter (opsional).
2. Datalist pivot per SKU dengan kolom dinamis per warehouse group.
3. Export jika perlu.

### Manual Calculate

1. Dari By Location (atau Ending Stock), trigger calculate.
2. Pantau progress → cek log di `manual-calculate-log`.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Angka tidak update | Ending stock belum dihitung | Manual calculate |
| Kolom warehouse kosong | `warehouse_id` null di filter SKU | Pilih warehouse |
| Export SKU gagal | `RealStockSkuExportJob` error | Cek Horizon failed jobs |

## Related Documents

| Doc | Path |
|-----|------|
| Product Ending Stock | [../supplychain-product-ending-stock/README.md](../supplychain-product-ending-stock/README.md) |
