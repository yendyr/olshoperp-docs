---
doc_type: technical
menu: supplychain-stock-opname
menu_name: "Stock Opname"
version: 1.1
last_updated: 2026-09-18
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Stock Opname — Technical Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

**Stack:** Laravel 13 API · Vue 3 SPA  
**Primary module:** `Modules/SupplyChain` (+ `Modules/Accounting` for finance approval)  
**Menu slug:** `supplychain-stock-opname`  
**UI route:** `/supplychain/stock-opname`  
**API base:** `{VITE_API_URL}supplychain/stock-opname*`

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-09-18 | §9 GAP-SOPNAME-01 — unit price decimal guard map + implementation notes |
| 1.0 | 2026-06-19 | Draft awal dari codebase |

---

## 1. Architecture Overview

```mermaid
flowchart TB
    subgraph Frontend_SCM["olshoperp-frontend SCM"]
        DL[DataList.vue]
        FM[Form.vue]
        TD[TreeDetail.vue]
        AW[AvailableWarehouse.vue]
    end

    subgraph Frontend_ACC["olshoperp-frontend Accounting"]
        SOA["stock-opname-approval routes"]
    end

    subgraph API_SC["SupplyChain API"]
        SOC[StockOpnameController]
        SODC[StockOpnameDetailController]
        SMAC[StockMutationAdditionController]
        SMDC[StockMutationDeductionController]
    end

    subgraph API_ACC["Accounting API"]
        SOCFA[StockOpnameController\nwrapper]
    end

    subgraph Domain["Entities"]
        SM["StockMutation\nis_opname=1"]
        OD[OpnameDetail\nscm_opname_details]
        SMA[StockMutationAddition]
        SMD[StockMutationDeduction]
        SOFA[StockOpnameFA]
    end

    DL --> SOC
    FM --> SOC
    TD --> SODC
    AW --> SODC
    SOA --> SOCFA
    SOCFA --> SOC
    SOC --> SM
    SODC --> OD
    SODC --> SMAC
    SODC --> SMDC
    SMAC --> SMA
    SMDC --> SMD
    SOCFA --> SOFA
```

---

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/SCM/StockOpname/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Datalist opname + export | `GET supplychain/stock-opname` |
| `Form.vue` | Create/edit wrapper | route to FormComponen |
| `FormComponen.vue` | Header form | `POST/PUT stock-opname/{id}` |
| `TreeDetail.vue` | Detail tree | `stock-opname-detail` |
| `DatalistDetail.vue` | PrimeVue detail grid | `stock-opname-detail/primevue` |
| `DataListComponen.vue` | Sub datalist component | — |
| `AvailableWarehouse.vue` | Bulk add from warehouse stock | `available_products`, `bulk-create` |
| `ApprovalEligibility.vue` | Eligible approvers | role-privilege |
| `DatalistLogApproval.vue` | Approval log | `stock-opname/{id}/log/approve` |

### Router (`src/router/index.ts`)

| Route | Component |
|-------|-----------|
| `supplychain/stock-opname` | `DataList.vue` |
| `supplychain/stock-opname/create` | `Form.vue` |
| `supplychain/stock-opname/edit/:id` | `Form.vue` |
| `accounting/stock-opname-approval` | Accounting mirror (shared/delegated UI) |
| `accounting/stock-opname-approval/edit/:id` | Finance approval edit |

---

## 3. Backend File Map

### 3.1 Controllers (SupplyChain)

| Class | Path | Responsibility |
|-------|------|----------------|
| `StockOpnameController` | `Modules/SupplyChain/Http/Controllers/StockOpnameController.php` | CRUD header, approve, export, select2 warehouse |
| `StockOpnameDetailController` | `.../StockOpnameDetailController.php` | CRUD detail, auto adjustment, import, bulk |
| `StockMutationAdditionController` | `.../StockMutationAdditionController.php` | Auto-create addition header/detail |
| `StockMutationDeductionController` | `.../StockMutationDeductionController.php` | Auto-create deduction header/detail |

### 3.2 Controllers (Accounting wrapper)

| Class | Path | Responsibility |
|-------|------|----------------|
| `Accounting\Http\Controllers\StockOpnameController` | `Modules/Accounting/Http/Controllers/StockOpnameController.php` | Delegates to SupplyChain with `StockOpnameFA`, `is_finance=true` |
| `Accounting\Http\Controllers\StockOpnameDetailController` | `.../StockOpnameDetailController.php` | Detail endpoints for finance menu |

### 3.3 Models

| Class | Table | Notes |
|-------|-------|-------|
| `StockOpname` | `scm_stock_mutations` | Extends `StockMutation`; empty subclass |
| `StockMutation` | `scm_stock_mutations` | `is_opname` flag, relations `opname_details`, `stock_additions`, `stock_deductions` |
| `OpnameDetail` | `scm_opname_details` | Per-SKU opname row |
| `StockOpnameFA` | `scm_stock_mutations` | Accounting subclass for finance menu |
| `StockOpnamePolicy` | — | SCM authorization |
| `StockOpnameFAPolicy` | — | Accounting authorization |

### 3.4 Jobs & import

| Class | Purpose |
|-------|---------|
| `StockOpnameDetailImportJob` | Async import detail Excel |
| `StockMutationStockOpnameExportJob` | Export opname list |
| `StockOpnameDetailImport` | Import parser class |

---

## 4. API Routes

### 4.1 SCM — `Modules/SupplyChain/Routes/api.php`

| Method | Path | Controller@method |
|--------|------|-------------------|
| GET | `stock-opname` | `StockOpnameController@index` |
| POST | `stock-opname` | `StockOpnameController@store` |
| GET | `stock-opname/{id}` | `StockOpnameController@show` |
| PUT | `stock-opname/{id}` | `StockOpnameController@update` |
| DELETE | `stock-opname/{id}` | `StockOpnameController@destroy` |
| POST | `stock-opname/{id}/approve` | `StockOpnameController@approve` |
| GET | `stock-opname/default-values` | `StockOpnameController@getDefaultValues` |
| GET | `stock-opname/{id}/stock-opname-detail/primevue` | `StockOpnameDetailController@index` |
| POST | `stock-opname-detail/{id}/bulk-create` | `StockOpnameDetailController@bulkCreate` |
| POST | `stock-opname/{id}/stock-opname-detail/upload` | `StockOpnameDetailController@uploadFileOpnameDetail` |
| POST | `stock-opname-detail/mass-delete-sku` | `StockOpnameDetailController@massDestroyBySku` |

### 4.2 Accounting — `Modules/Accounting/Routes/api.php`

| Method | Path | Notes |
|--------|------|-------|
| GET | `stock-opname-approval` | Finance datalist (`StockOpnameFA`) |
| POST | `stock-opname-approval/{id}/approve` | Same approve logic, `is_finance=true` |
| Resource | `stock-opname-approval` | CRUD mirror |
| Resource | `stock-opname-approval.stock-opname-detail` | Detail CRUD mirror |

---

## 5. Database

### 5.1 Header `scm_stock_mutations` (opname rows)

| Column | Keterangan |
|--------|------------|
| `is_opname` | `1` untuk stock opname |
| `warehouse_origin` | Gudang induk opname |
| `warehouse_destination` | Biasanya NULL di header |
| `code` | Prefix `SP` |
| `transaction_status` | open → approved |

Global scope `ignore_opname` pada `StockMutation` — di-bypass via `withoutGlobalScope('ignore_opname')` di controller opname.

### 5.2 Detail `scm_opname_details`

| Column | Keterangan |
|--------|------------|
| `stock_mutation_id` | FK header opname |
| `product_id` | SKU |
| `warehouse_destination_id` | Lokasi/rak |
| `opname_quantity` | Qty fisik |
| `origin_avail_quantity_in_base_unit` | Stok sistem saat create |
| `adjustment_quantity_in_base_unit` | Selisih (bisa +/-) |
| `adjustment_type` | `in` atau `out` |
| `each_price_before_discount_before_vat` | Harga untuk adjustment in — **sudah** `decimal(21,4)` (migration `create_opname_details_table`); schema siap desimal; blocker AS-IS hanya guard aplikasi |

### 5.3 Auto-generated children

| Child doc | FK | Class reference |
|-----------|-----|-----------------|
| Addition header | `transaction_reference_id` → opname id | `StockOpname::class` |
| Addition detail | `transaction_reference_id` → opname detail id | `OpnameDetail::class` |
| Deduction header | same pattern | `StockOpname::class` |
| Deduction detail | `stock_opname_detail_id` | — |

---

## 6. Auto adjustment flow

`StockOpnameDetailController@store` (simplified):

```mermaid
flowchart TD
    A["Input opname qty"] --> B{"adjustment qty"}
    B -->|"> 0"| C["adjustment_type = in"]
    B -->|"< 0"| D["adjustment_type = out"]
    C --> E["StockMutationAdditionController::store"]
    E --> F["StockMutationAdditionDetailController::store"]
    D --> G["StockMutationDeductionController::store"]
    G --> H["Outbound detail store"]
```

On approve (`StockOpnameController@approve`):

1. Validate sum opname additions == sum inbound mutation details
2. Validate sum opname deductions == sum outbound mutation details
3. `InboundValueAdjustmentController::approve()` per addition
4. `Accounting\StockMutationDeductionController::approve()` per deduction
5. `$stock_opname->approve($request)`

---

## 7. Index query notes

`StockOpnameController@index`:

- Filter `is_opname = 1`
- `whereNotNull('warehouse_origin')` (exclude opening stock pattern)
- Eager load `stock_additions`, `stock_deductions` + journals
- Finance index passes `StockOpnameFA` class — link di datalist mengarah ke `accounting/stock-opname-approval`

---

## 8. Permissions

| Policy | Menu |
|--------|------|
| `StockOpnamePolicy` | SCM stock opname |
| `StockOpnameFAPolicy` | Accounting stock opname approval |

Approve cache helpers: `addCacheApproveStockMutation()`, `deleteCacheApproveStockMutation()`, `ensureMutationNotApprovedOrApproving()`.

---

## 9. Unit price decimal — GAP-SOPNAME-01

Requirement: [requirement.md §3.4](./requirement.md#34-gap-sopname-01--unit-price-desimal-to-be).

### 9.1 AS-IS guards (hapus / relax saat implementasi)

| Lokasi | Method / area | Check |
|--------|---------------|-------|
| `Modules/SupplyChain/Http/Controllers/StockOpnameDetailController.php` | `store` (~L508–514) | `floor((float)$price) != (float)$price` → error whole numbers |
| Same | `update` (~L991–997) | Same |
| `Modules/SupplyChain/Http/Controllers/StockOpnameController.php` | `approve` (~L999–1009) | Filter detail dengan harga fraksi → error per SKU |
| `Modules/SupplyChain/Import/StockOpnameDetailImport.php` | `validationUnitPrice` (~L896–901) | Same floor check on import |

Pesan AS-IS: `"Unit Price must be entered in whole numbers not decimals."`

Qty manual tetap di-guard dengan `ctype_digit` / pesan *quantity in whole numbers* — **jangan** diubah bersama GAP harga.

### 9.2 Downstream (tidak perlu guard price-whole)

| Komponen | Catatan |
|----------|---------|
| `StockMutationAdditionDetailController` | Menerima `each_price_before_vat`; qty whole saja — tidak menolak price desimal |
| Journal via addition approve | Nominal = harga × qty; ikut fraksi sen setelah TO-BE |
| Benchmark fallback | `product.benchmarkPrice.benchmark_price` sudah bisa desimal |
| Opening Stock | Flag `is_opening_stock` memakai controller/import yang sama — **wajib** regresi bersama |

### 9.3 TO-BE implementasi (dev checklist)

1. Hapus/relax ketiga `floor` price checks di atas.
2. Optional align PO: `roundHalfDown($price, 4)` sebelum persist.
3. FE: kolom UNIT PRICE di `DatalistDetail.vue` (`type: "amount"`) — pastikan tidak memaksa integer; bandingkan perilaku edit amount di Purchase Order.
4. Regression: C1–C5 di requirement §3.4; include Opening Stock + Stock Opname Approval (`is_finance`).
5. Update TC yang expect whole-price rejection setelah deploy.

### 9.4 Referensi PO (pola target)

- `PurchaseOrderDetailController`: `each_price_*` → `numeric` + `roundHalfDown(..., 4)` — **tidak** ada floor-whole pada unit price.
- Qty manual PO: whole; import boleh desimal qty — Opname **tidak** mengikuti longgarnya import qty PO; Opname qty manual tetap whole.
