# Contoh — Real Time Stock

Menu: `supplychain-real-stock` · Route: `/supplychain/real-stock`  
POM: `tests/pom-registry/real-stock.yaml`

## Flow utama — By Location (default tab)

| # | Elemen UI | Selector hint | Aksi tour | Popover | Catatan |
|---|-----------|---------------|-----------|---------|---------|
| 1 | Breadcrumb Real Time Stock | text: Real Time Stock / link breadcrumb | `highlight` | **Real Time Stock** — Laporan stok real-time (On Hand, ATS, Availability) per lokasi & SKU. | Shell |
| 2 | Tab By Location | role: tab "By Location" | `highlight` | **By Location** — Lihat stok dikelompokkan per warehouse/lokasi. | Default aktif |
| 3 | Multiselect warehouse | placeholder: Select one or more items to view data | `highlight + explain-click` | **Pilih warehouse** — Data belum load sampai Building dipilih. | Wajib sebelum datalist |
| 4 | Select "Show data as" | placeholder: Show data as / class `.show-data-as-select` | `highlight` | **Show data as** — Opsional: tampilkan data per level warehouse. | Boleh skip di tour dasar |
| 5 | (Setelah warehouse dipilih) Tombol Manual Calculate | text: Manual Calculate | `wait-visible → highlight` | **Manual Calculate** — Recalculate ending stock jika angka terasa stale. | Conditional |
| 6 | Tombol Log Data | text: Log Data | `highlight` | **Log Data** — Riwayat / progress kalkulasi. | Conditional; muncul bersama #5 |
| 7 | Kolom On Hand / ATS / Availability | columnheader | `highlight` | **Metrik stok** — On Hand = fisik; ATS/Availability = siap jual. Klik angka untuk detail. | Setelah data load |
| 8 | Tab By SKU | role: tab "By SKU" | `highlight + explain-click` | **By SKU** — Pivot stok per produk; mode WH / Sales / ALL. | Transisi tab opsional |

## Flow opsional — setelah klik Tab By SKU

| # | Elemen UI | Selector hint | Aksi tour | Popover | Catatan |
|---|-----------|---------------|-----------|---------|---------|
| 9 | Toggle WH Team | button: WH Team | `pre-click → highlight` (klik Tab By SKU dulu) | **WH Team** — Filter Building untuk gudang (max 5). | Default By SKU |
| 10 | Toggle Sales Team | button: Sales Team | `highlight` | **Sales Team** — Filter Building sisi sales. | |
| 11 | Toggle ALL | button: ALL | `highlight + explain-click` | **ALL** — Load semua warehouse tanpa Multiselect. | Cara tercepat lihat data |
| 12 | Multiselect By SKU | placeholder: You can choose up to 5 Buildings. | `highlight` | **Buildings** — Wajib jika mode WH/Sales; max 5. | Hilang saat ALL |

## data-tour yang disarankan (FE)

```
data-tour="real-stock__tab-by-location"
data-tour="real-stock__tab-by-sku"
data-tour="real-stock__warehouse-filter"
data-tour="real-stock__show-data-as"
data-tour="real-stock__manual-calculate"
data-tour="real-stock__log-data"
data-tour="real-stock__btn-wh-team"
data-tour="real-stock__btn-sales-team"
data-tour="real-stock__btn-all"
data-tour="real-stock__warehouse-filter-sku"
data-tour="real-stock__table"
```
