# Stock Shortage Monitoring (Omni Channel > Report Omni)

- UI route: `/omni/stock-shortage-monitoring` (sidebar: Omni Channel > Report Omni > Stock Shortage Monitoring)
- API: `GET omnichannel/stock-shortage-monitoring` (datatable Per SKU), `.../summary`, `.../{productId}/orders` (modal Order Count), `.../{productId}/inbounds` (modal Inbound Count)
- Backend: `Modules/OmniChannel/Http/Controllers/StockShortageMonitoringController.php` (yendyr/olshoperp)
- Frontend: `src/pages/Omni/Report/StockShortageMonitoring/DataList.vue` (yendyr/olshoperp-frontend)

## Logika data (ringkas, dari kode per 15-10-2026)

- Populasi order: SO `transaction_status` approved/processed, `unassign_wave_status` not in queue / in queue, belum ada detail dengan prepared/processed out > 0. Filter Store = `so.store_id`, Order Date = `so.transaction_date`.
- Demand per SKU: detail SO non-bundle + komponen bundle (qty bundle × qty komponen dari BoM `is_bom = 0`). Baris detail anak tree (parent_id terisi) diabaikan supaya komponen bundle tidak terhitung 2x (fix ETM-16583).
- Avail: `SUM(item_stock.available_quantity)` di gudang proses store (`COALESCE(so.wh_process_id, store.warehouse_process_id)`) + semua gudang anak non-virtual (kecuali WIP scrap/void). Sama dengan kolom **Available** di Real Time Stock > By SKU untuk gudang induk yang sama.
- Qty Kurang = max(0, Total Qty Order − Avail). Coverage = min(100, Avail / Total Qty Order × 100), 1 desimal.
- Summary: SKU in demand = jumlah baris, SKU short = baris qty > avail, Qty short = jumlah Qty Kurang.
- Cache dataset 5 menit per (company, store, tanggal): data baru bisa telat muncul sampai 5 menit.

## Cara cross-check cepat

1. Filter store + tanggal, cari SKU, catat Total Qty Order / Avail.
2. Klik angka Order Count: total di modal harus = Total Qty Order (ada info "Consistency").
3. Real Time Stock > By SKU > pilih Building = gudang proses store (mis. SERUNI-ST) > cari SKU: kolom **Available** = Avail report.
4. Buka SO sumber: qty komponen bundle = qty bundle × rasio BoM.

## Test case

- [TC-SSM-DATA-001](test-cases/TC-SSM-DATA-001.md) — validasi data report vs sumber (ETM-16583)
