---
doc_type: technical
menu: accounting-product-profit-loss
menu_name: "Product Profit Loss"
version: 1.3
last_updated: 2026-06-29
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Product Profit Loss — Technical Documentation

> **DRAFT** — Dokumentasi AS-IS dari codebase (29 Juni 2026). Belum final review QA/PM.

## 1. Architecture Overview

Read-only reporting menu. Data flow:

1. User membuka halaman / mengubah filter → `GET /api/accounting/product-profit-loss`
2. `generateData()` cek batch aktif; jika perlu, queue `GenerateProductProfitLossDataJob` per **tanggal** dalam periode
3. Job menulis baris granular (per `sales_order_id` + `product_id` + `transaction_date`) ke `accounting_product_profit_losses`
4. `reportQuery()` agregasi per `product_id` untuk DataTables
5. Scheduler `clean-product-profit-loss` **hourly** menghapus snapshot `created_at` > 1 jam

```mermaid
flowchart TB
    subgraph FE["DataList.vue"]
        F[Period / Category / Variant filters]
        R[Refresh Data button]
        DT[DataTablesV3 index]
        MD[Modal Detail Orders]
        EX[ExportFileTable]
    end

    subgraph API["ProductProfitLossController"]
        IDX[index]
        GEN[generateDailyData]
        ORD[orders]
        EXP[exportExcel]
        CHK[checkStatus]
    end

    subgraph Jobs["Queue"]
        B[Bus batch ProductProfitLossData:companyId]
        J[GenerateProductProfitLossDataJob per date]
        EJ[GenerateProductProfitLossExportJob]
    end

    subgraph DB[("accounting_product_profit_losses\n(snapshot)")]
    end

    subgraph SRC[("omni_sales_orders\nomni_sales_order_details\nscm_stock_mutations / outbound")]
    end

    F --> IDX
    R -->|"refresh=1"| IDX
    IDX --> GEN
    GEN --> B --> J --> GEN
    J --> DB
    IDX --> DB
    MD --> ORD --> DB
    EX --> EXP --> EJ
    GEN --> SRC
```

**Bukan** real-time query penuh setiap request. Mekanisme AS-IS (by design):

1. **Lazy generate** — snapshot dibuat saat user buka menu / ubah periode / klik Refresh Data
2. **Hourly cleanup** — `clean-product-profit-loss` menghapus baris `created_at` > 1 jam (bukan auto-regenerate)

Lihat [requirement.md §7.1](./requirement.md) untuk keputusan desain.

---

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/Accounting/Report/ProductProfitLoss/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Satu-satunya halaman UI | Lihat §4 |

**Route:** `accounting_product-profit-loss_index` → `/accounting/product-profit-loss`  
**Document title:** `Product Profit Loss`

### 2.1 DataTablesV3 props (main table)

| Prop | Value | Catatan |
|------|-------|---------|
| `modal_for` | `ProductProfitLoss` | localStorage key & CSS export suffix |
| `filter_column` | `true` | Per-column header filter |
| `advanced_filter` | `false` | SearchBuilder panel **off** |
| `export_all` | `true` | Export slider |
| `with_default_columns` | `false` | Tanpa kolom default id/audit |
| `custom_filter` | `false` | |

### 2.2 Query params dikirim ke API (`additionalData`)

| Param | Sumber FE |
|-------|-----------|
| `datePeriod` | `start,end` (yyyy-MM-dd) |
| `refresh` | `1` saat tombol Refresh Data |
| `category_ids` | Comma-separated IDs |
| `variant_status` | `''`, `non_random`, `random` |

### 2.3 Dead / prepared code (belum aktif)

| Fitur | Lokasi | Status |
|-------|--------|--------|
| Summary cards & daily chart | `handleDataFetched()` | BE tidak return `summary` |
| Echo WebSocket progress | `listenPageEvent('ProcessCalculating')` | Di-comment |
| `processFullData` watcher | `DataList.vue` | Di-comment |

---

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/Accounting/Http/Controllers/ProductProfitLossController.php` | Index, generate, orders, export, checkStatus |
| `Modules/Accounting/Entities/AccountingProductProfitLoss.php` | Model snapshot |
| `Modules/Accounting/Entities/ProductProfitLoss.php` | Gate menu / policy entity |
| `Modules/Accounting/Entities/ProductProfitLossExportFile.php` | Export history |
| `Modules/Accounting/Jobs/GenerateProductProfitLossDataJob.php` | Generate 1 hari / company |
| `Modules/Accounting/Jobs/GenerateProductProfitLossExportJob.php` | Excel async |
| `Modules/Accounting/Exports/ProductProfitLossExport.php` | Maatwebsite headings/map |
| `Modules/Accounting/Policies/ProductProfitLossPolicy.php` | Authorization |
| `Modules/Accounting/Broadcasting/ProductProfitLossChannel.php` | WebSocket channel (broadcast di-comment) |
| `Modules/Accounting/Constants/WebSocketChannel.php` | `PRODUCT_PROFIT_LOSS` |
| `app/Console/Commands/CleanProductProfitLoss.php` | Hapus snapshot >1 jam |
| `Modules/Gate/Database/Seeders/ModuleMenu/AccountingMenuSeeder.php` | `menu_text`, `menu_link`, `menu_class` |

---

## 4. API Routes

Prefix: `/api/accounting/product-profit-loss`  
Middleware: `auth:sanctum`, `auth_verified`

| Method | Path | Handler | Role |
|--------|------|---------|------|
| GET | `/` | `index` | DataTables agregat per SKU |
| GET | `/check-status` | `checkStatus` | Progress batch `job_batches` |
| GET | `/orders` | `orders` | Detail order per `product_id` (modal) |
| GET | `/export-excel` | `exportExcel` | Queue export job |
| GET | `/export-progress` | `exportProgress` | Count export in-progress |
| GET | `/export-file` | `exportFile` | History export table |

### 4.1 `index` response flags

| Field | Type | Description |
|-------|------|-------------|
| `is_calculating` | bool | Batch `ProductProfitLossData:{companyId}` masih jalan |
| DataTables rows | JSON | Agregasi dari `reportQuery()` |

### 4.2 `check-status` response

```json
{
  "is_calculating": true,
  "pending_jobs": 10,
  "total_jobs": 90,
  "failed_jobs": 0,
  "progress": 88
}
```

Sumber: tabel `job_batches` nama `ProductProfitLossData:{companyId}`.

---

## 5. Database Schema

### 5.1 `accounting_product_profit_losses`

Migration: `2026_05_08_102507_create_product_profit_losses_table.php`

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | PK (baseColumns) |
| `owned_by` | FK company | Scope perusahaan |
| `product_id` | FK nullable | Null pada dummy row penanda hari kosong |
| `sales_order_id` | FK nullable | Granular per order (pre-aggregate) |
| `product_sku`, `product_name` | string | Denormalized |
| `total_qty_sold` | decimal(20,4) | Primary unit |
| `product_unit` | string | Primary unit code |
| `total_gross_sales` | decimal(20,4) | IDR |
| `total_hpp` | decimal(20,4) | COGS |
| `total_net_sales` | decimal(20,4) | Net profit |
| `profit_percentage` | decimal(20,4) | Margin % |
| `avg_selling_price`, `avg_buying_price` | decimal(20,4) | |
| `transaction_date` | date | **Filter periode = tanggal SO** |
| `sales_order_code`, `store_name`, `platform_name` | string | Untuk modal detail |

**Index:** `(owned_by, transaction_date)`

**Lifecycle:** Row di-`forceDelete` saat refresh manual, regenerate per date, atau `clean-product-profit-loss` (>1 jam).

### 5.2 `accounting_product_profit_loss_export_files`

| Column | Description |
|--------|-------------|
| `menu` | Literal `'Product Profit Loss'` |
| `file_name` | `Product Profit Loss_{d-m-Y H.i.s}.xlsx` |
| `url` | S3/public path setelah job selesai |
| `status` | 0 = processing, 1 = done |

---

## 6. Kalkulasi & Business Logic

### 6.1 `generateDailyData($date, $companyId)`

**Sales query** — agregasi per `(sales_order_id, product_id)`:

- Join: `omni_sales_orders`, `omni_sales_order_details`, `scm_products`, `scm_units`, store, platform
- Filter: Approved/Processed, `wh_process_id` NOT NULL, `whereDate(transaction_date, $date)`, company scope
- `applySalesDetailRowFilter()` — exclude bundle parent, variant random master, random child parent rows
- Qty: `SUM(sod.sales_order_quantity_in_base_unit)`
- Gross: price × discount × VAT rule × qty × exchange_rate (lihat `selectRaw` di controller)

**HPP query** — per `(sales_order_id, product_id)`:

- Join outbound mutation detail → `item_stocks.each_price_before_vat`
- `somd.transaction_reference_class` = `SalesOrderDetail`
- Outbound `transaction_status` = Approved
- Same SO status & date filters

**Merge logic:**

- Jika tidak ada outbound row → `total_hpp = 0`, `total_net_sales = 0`, margin & avg buying = 0
- Jika ada → proporsi value per primary unit × qty sold
- Insert array ke `accounting_product_profit_losses`
- Jika tidak ada sales sama sekali → dummy row (`product_id` null) penanda date generated

### 6.2 `reportQuery()` — agregasi UI

`GROUP BY product_id, product_sku, product_name, product_unit` dengan `SUM` metrics dan `CASE` untuk margin & averages.

### 6.3 `applySalesDetailRowFilter()`

Exclude baris `sod` jika:

1. Punya child di `omni_sales_order_detail_randoms` (random parent)
2. Product punya `scm_product_variant` + `scm_variant_options.option LIKE '%random%'`
3. Punya child di `omni_sales_order_detail_trees` (bundle parent)

### 6.4 Filter `wh_process_id`

Order wajib `so.wh_process_id IS NOT NULL` — hanya SO yang sudah terikat **Warehouse Process** (fulfillment). Di-set saat create SO (dari store) atau **Send to Default Waves** (`WaveService`). Penjelasan bisnis: [requirement.md §5.2](./requirement.md).

### 6.5 Variant Status filter (display)

Setelah snapshot ada, filter `variant_status`:

| Value | SQL logic |
|-------|-----------|
| `random` | EXISTS sod dengan `so_detail_random_id` NOT NULL untuk pasangan SO+product |
| `non_random` | NOT EXISTS kondisi di atas |

---

## 7. Jobs / Scheduler

| Komponen | Detail |
|----------|--------|
| `GenerateProductProfitLossDataJob` | Queue: `platformproduct`; timeout 900s; tries 2; batchable |
| Batch name | `ProductProfitLossData:{companyId}` |
| Queue trigger | Tanggal dalam periode belum punya snapshot, atau `refresh=1` |
| `clean-product-profit-loss` | `Kernel.php` → **hourly**; delete `created_at < now()-1hour` |
| `GenerateProductProfitLossExportJob` | Queue: `import`; disk S3 (prod) / public (local) |

**WebSocket:** `broadcastStatus()` ada tetapi pemanggilan di batch `finally` di-comment.

---

## 8. Export Excel

| Aspek | Detail |
|-------|--------|
| Trigger | `GET export-excel` dari ExportFileTable |
| Opsi FE | `EXPORT_OPTIONS_ALL_ACTIVE_PAGE`: **All**, **This Page Only** |
| `applyFilters` | `true` — period & filter ikut |
| `with_option` | `false` — tanpa With/Without Details |
| Kolom file | SKU, Product Name, Qty Sold, Unit, Gross Sales, Total COGS, Net Profit, Profit Margin (%), Avg. Selling Price, Avg. Buying Price |
| Nama file | `Product Profit Loss_{dd-mm-yyyy H.i.s}.xlsx` |
| Path storage | `exports/product_profit_loss/{file_name}` |

---

## 9. Import

**Tidak ada** endpoint import, FormRequest import, atau template file di modul ini. Lihat [requirement.md §8](./requirement.md).

---

## 10. Permission

| Layer | Mechanism |
|-------|-----------|
| API | `ProductProfitLossPolicy` extends `MainPolicy` |
| Menu Gate | `menu_class` = `ProductProfitLoss::class` |
| Menu link | `accounting/product-profit-loss` |

---

## 11. Related db-schema docs

| Tabel | Doc path (jika ada) |
|-------|---------------------|
| `omni_sales_orders` | `docs/db-schema/` omni module |
| `scm_stock_mutations` | supply chain outbound |

---

## 12. Related Menus & Data Mapping

Detail peran bisnis: [requirement.md §6](./requirement.md).

| Menu terkait | Sidebar | Route | Data ke PPL |
|--------------|---------|-------|-------------|
| Sales Order General | Dev - Sales Order | `businessdevelopment/sales-order-general` | Qty Sold, Gross Sales (`type_sales_order = General`) |
| Sales Platform | Dev - Sales Platform | `omni/sales-order` | Qty Sold, Gross Sales (`type_sales_order = Platform`) |
| Outbound External | Outbound External | `supplychain/mutation-outbound` | Total COGS (approved, ref `SalesOrderDetail`) |

### 12.1 Tabel & join (AS-IS)

| Sumber | Tabel | Dipakai untuk |
|--------|-------|---------------|
| SO General + Platform | `omni_sales_orders`, `omni_sales_order_details` | Sales query di `generateDailyData()` |
| Outbound | `scm_stock_mutations`, `scm_outbound_mutation_details`, `scm_item_stocks` | HPP query |
| Snapshot | `accounting_product_profit_losses` | Output agregat per SKU / per SO+SKU |

### 12.2 QA doc links

| Menu | Doc slug |
|------|----------|
| Sales Order | [sales-order-general](../sales-order-general/technical.md) |
| Outbound | [supplychain-mutation-outbound](../supplychain-mutation-outbound/technical.md) |
| Store | [omni-store-binding](../omni-store-binding/technical.md) |

---

## 13. Regression / Agent Notes

- Jangan cache sidebar dengan key yang salah — tidak relevan langsung, tapi menu pakai Gate class standard
- Export `menu` field harus tetap `'Product Profit Loss'` — dipakai di `where('menu', ...)`
- `modal_for="ProductProfitLoss"` di FE adalah **identifier teknis**, bukan display name menu
