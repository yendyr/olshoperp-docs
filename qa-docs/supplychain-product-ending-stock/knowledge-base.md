---
doc_type: knowledge-base
menu: supplychain-product-ending-stock
menu_name: "Product Ending Stock"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Product Ending Stock — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Product Ending Stock?

Laporan **saldo akhir stok** per produk dan gudang, berdasarkan data `scmag_ending_stocks` (hasil kalkulasi ending balance). Menu memiliki dua tab: **By Warehouse** (agregasi per gudang) dan **By SKU** (per produk).

| Item | Nilai |
|------|-------|
| Menu | SCM → Report → Product Ending Stock |
| Route UI | `/supplychain/product-ending-stock` |
| API | `supplychain/product-ending-stock`, `product-ending-stock-by-sku` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Ending Stock | Saldo stok setelah mutasi terakhir dihitung |
| On Hand | Stok fisik di gudang (termasuk reserved) |
| ATS | Available to Sell — stok siap dijual |
| Latest Calculation | Timestamp kalkulasi ending balance terakhir (`CalculateTodoDate`) |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Lihat stok ending per warehouse atau per SKU
- Filter/search kolom datalist
- Export Excel (async job + progress)
- Trigger manual calculate (tab By Warehouse — memanggil `real-stock/manual-calculate`)

### Tidak Bisa

- Edit stok langsung dari menu ini (read-only report)
- Menampilkan gudang In Transit / Voided Order (tergantung setting company)

## 4. Cara Pakai

1. Buka menu → pilih tab **By Warehouse** atau **By SKU**.
2. Gunakan filter datalist untuk cari SKU/gudang.
3. Klik **Export** → pantau progress di panel export file.
4. Jika data terasa stale, jalankan **Manual Calculate** (By Warehouse) lalu tunggu job selesai.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Data kosong | Belum ada ending stock > 0 | Jalankan kalkulasi ending balance |
| Gudang tidak muncul | Filter virtual void / In Transit | Cek Application setting `include_virtual_wh_void` |
| Export lama | Dataset besar | Tunggu job queue (Horizon) |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
