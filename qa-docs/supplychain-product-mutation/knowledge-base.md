---
doc_type: knowledge-base
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Product Mutation History — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Product Mutation History?

Laporan **riwayat mutasi stok global** per produk (tanpa filter gudang). Menampilkan setiap baris `mutation_summaries` dengan qty in/out dan **ending balance** setelah transaksi. Wajib pilih produk terlebih dahulu.

| Item | Nilai |
|------|-------|
| Menu | SCM → Report → Product Mutation History |
| Route UI | `/supplychain/product-mutation` |
| API | `GET supplychain/product-mutation?product_id=` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Mutation Summary | Ringkasan per baris mutasi stok (`scmag_mutation_summaries`) |
| Ending Balance | Saldo setelah mutasi (`scmag_ending_balances`) |
| Stock Mutation Code | Kode dokumen (IN, OT, TF, AI, PT, AO, dll.) |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Lihat history mutasi per SKU (global, semua gudang)
- Export Excel history
- Trigger **manual ending balance calculation** jika ada todo date pending
- Pantau progress kalkulasi

### Tidak Bisa

- Filter per gudang di menu ini (gunakan **Stock History** / `product-mutation-stock`)
- Edit mutasi dari report

## 4. Cara Pakai

1. Pilih **Product** dari select2.
2. Datalist memuat mutasi dengan kode IN/OT/AI/TF/PT/AO.
3. Kolom ending balance menunjukkan saldo setelah transaksi.
4. Jika diminta recalculate, klik calculate → pantau `calculation-progress`.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Datalist kosong | `product_id` belum dipilih | Pilih produk |
| Ending balance tidak update | Kalkulasi pending | Jalankan calculation |
| Another calculation running | Batch job aktif | Tunggu selesai |

## Related Documents

| Doc | Path |
|-----|------|
| Stock History | [../supplychain-product-mutation-stock/README.md](../supplychain-product-mutation-stock/README.md) |
