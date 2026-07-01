---
doc_type: knowledge-base
menu: supplychain-stock-monitoring
menu_name: "Dev - Stock Monitoring"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Dev - Stock Monitoring — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Dev - Stock Monitoring?

Menu **Dev - Stock Monitoring** menampilkan **item stock per warehouse** dengan breakdown kuantitas: Inbound, Transfer, Used, Reserved, Availability, dan On Hand. Operator wajib memilih warehouse terlebih dahulu sebelum tabel muncul. Menu ini juga dipakai sebagai picker stok dari modul mutation (outbound, transfer, SO) dan memiliki halaman detail per `item_stock`.

| Atribut | Nilai |
|---------|-------|
| Route UI | `/supplychain/stock-monitoring` |
| Detail | `/supplychain/stock-monitoring/{item_stock_id}` |
| API datalist | `GET supplychain/stock-monitoring?warehouse_id={id}` |
| Permission entity | `ItemStockMonitoring` (extends `ItemStock`) |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Item stock | Record stok di `scm_item_stocks` per produk + warehouse + batch/lokasi |
| Inbound | Qty diterima dari transaksi inbound approved |
| Transfer | Qty yang sudah ditransfer ke warehouse lain |
| Used | Qty dari outbound approved |
| All Reserved | Reserved Out + Reserved TF − In Transit |
| Availability | Transfer − Used − Reserved (label lama: Stock WH) |
| On Hand | Transfer − Used |
| Latest Calculation | Timestamp job kalkulasi stok terakhir (`CalculateTodoDate`) |
| Virtual WH | Warehouse virtual processing — aktif via double-click label warehouse (dev shortcut) |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Pilih warehouse → lihat semua item stock di warehouse tersebut
- Advanced filter / SearchBuilder per kolom numerik dan tanggal
- Klik Availability → modal breakdown per colli (`modal-available`)
- Export all Excel/ZIP (async, chunk job)
- Buka detail item: Product Trx History, Certificate, Product Interchange
- Lihat **Latest Calculation** di header tabel

### Tidak Bisa

- Lihat datalist tanpa memilih warehouse (FE: `dataTableComponentKey` tetap 1 sampai Apply)
- Edit qty langsung dari datalist (read-only kecuali embedded sebagai picker mutation)
- Lihat unit value / harga (mode finance ada di menu Accounting Stock Monitoring Value terpisah)

## 4. Cara Pakai (How-To)

### Skenario: Monitor stok di satu warehouse

1. Buka **SCM → Report → Dev - Stock Monitoring**.
2. Pilih **Warehouse Name** (select2 `stock-monitoring/select2/warehouse`).
3. Klik **Apply** — tabel load dengan `warehouse_id`.
4. Gunakan filter kolom atau SearchBuilder untuk cari SKU/lokasi.
5. Klik angka **Availability** biru untuk lihat detail colli.

### Skenario: Export semua baris warehouse

1. Setelah warehouse terpilih, buka panel **Export All**.
2. Trigger export — sistem chunk 500 ID per job, batch max 40 jobs.
3. Pantau status di tab export file (`export-file`, `export-progress`).
4. Download saat status Ready (file ZIP jika > 5000 baris).

### Skenario: Detail satu item stock

1. Dari datalist atau link di modul lain (`/supplychain/stock-monitoring/{id}`).
2. Tab **Product Trx History** — ledger mutasi produk.
3. Tab **Certificate** — sertifikat item stock.
4. Tab **Product Interchange** — produk interchangeable.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tabel tidak muncul | Warehouse belum dipilih | Pilih warehouse + Apply |
| Latest Calculation kosong | Belum ada `CalculateTodoDate` status 0 | Tunggu job kalkulasi / trigger dari Real Stock |
| Export stuck Processing | Job gagal atau > 30 menit | Cek Horizon; progress auto-reset setelah 30 menit |
| "Export process is running" | Lock cache per user 600 detik | Tunggu export sebelumnya selesai |
| Availability negatif / anomali | Data mutation belum sync | Cek mutation approval & transfer in-transit |
| 403 | Role tanpa viewAny ItemStockMonitoring | Update permission Gate |

## 6. FAQ

**Q: Beda dengan Real Stock?**  
A: Stock Monitoring = **per item_stock** (granular, per batch/lokasi). Real Stock = agregasi per SKU/warehouse/location.

**Q: Kenapa prefix "Dev"?**  
A: Label menu di seeder: `Dev - Stock Monitoring` — masih dalam pengembangan/QA intensive.

**Q: Apakah sama dengan Accounting Stock Monitoring Value?**  
A: Controller sama (`StockMonitoringController`) tetapi path `accounting/stock-monitoring-value` mengaktifkan `show_unit_value=1` (harga).

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Accounting variant | [accounting-stock-monitoring-value/knowledge-base.md](../accounting-stock-monitoring-value/knowledge-base.md) |
