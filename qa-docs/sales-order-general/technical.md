---
doc_type: technical
menu: sales-order-general
menu_name: "Sales Order General (Internal)"
version: 1.1
last_updated: 2026-07-02
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Sales Order General — Technical Documentation

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | AS-IS import + merge bulk improvement TO-BE |
| 1.1 | 2026-07-02 | QA - Yemima | §7 Failed Process AS-IS file map + §8 Re-check TO-BE design |

**Stack:** Laravel 13 · Vue 3 · Horizon · MariaDB  
**Type:** `type_sales_order = general`  
**UI routes:** `/businessdevelopment/sales-order-general`, `/businessdevelopment/all-sales-order`, `/omni/sales-order` (Dev - Sales Platform)  
**API prefix:** `/api/omnichannel/sales-order/*`

---

## 1. Architecture Overview

```mermaid
flowchart LR
    subgraph Input
        M[Manual Form]
        I[Excel Import 2-sheet]
        P[POS]
    end
    subgraph Core
        SO[SalesOrder header]
        SOD[SalesOrderDetail]
        OC[Other Cost/Discount]
    end
    subgraph Fulfillment
        W[Wave]
        DO[Delivery Order]
        OB[Outbound]
    end
    subgraph Finance
        INV[Customer Invoice]
        STL[Settlement]
    end
    M & I & P --> SO
    SO --> SOD & OC
    SO --> W --> DO --> OB --> INV
    STL --> INV
```

**Entity:** `SalesOrderGeneral` extends `SalesOrder` (policy/menu scoping only).

**Tables:** `omni_sales_orders`, `omni_sales_order_details`, `omni_sales_order_other_costs`, `omni_sales_order_other_discounts`, `omni_sales_order_other_infos`, `omni_sales_order_import_histories`, `omni_sales_order_import_logs`.

---

## 2. Frontend File Map

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/BusinessDevelopment/SalesOrderGeneral/DataList.vue` | CRUD + import UI |
| `olshoperp-frontend/src/pages/BusinessDevelopment/SalesOrderGeneral/Form.vue` | Create/edit SO |
| `olshoperp-frontend/src/pages/BusinessDevelopment/Report/AllSalesOrder/DataList.vue` | Combined view + import + PillButtons Failed Process |
| `olshoperp-frontend/src/pages/Omni/SalesOrder/DataList.vue` | Dev - Sales Platform datalist + Failed Process |
| `olshoperp-frontend/src/pages/Omni/SalesOrder/components/PillButtons.vue` | Pills: Failed Process, Failed Sync, Ready to Process |
| `src/utils/imports.ts` | Import history columns |
| `src/components/project/DataTables/ImportFileTable.vue` | Import progress |

**Router:** `businessdevelopment_sales-order-general_index`, `businessdevelopment_all-sales-order_index`

---

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/OmniChannel/Http/Controllers/SalesOrderController.php` | CRUD, `error_flags_formatted`, `failedProcess()`, `validateOrderDetails()` |
| `Modules/OmniChannel/Entities/SalesOrder.php` | `renderErrorFlags()`, `getErrors()`, `dataListRelations()` |
| `Modules/OmniChannel/Entities/SalesOrderDetailError.php` | Detail-level error flags (`omni_sales_order_detail_errors`) |
| `Modules/OmniChannel/Concerns/CanManageOrderDetailError.php` | `addError()`, `removeError()`, `clearError()` |
| `Modules/OmniChannel/Jobs/CheckOrderFlagsJob.php` | Post-approve platform validation flags |
| `app/Console/Commands/ScreeningErrorFlagStockSalesOrderCommand.php` | Daily auto-clear `stock-error` |
| `Modules/OmniChannel/Http/Controllers/SalesOrderDetailController.php` | Detail lines, detail import |
| `Modules/OmniChannel/Import/SalesOrderImport.php` | Import orchestrator |
| `Modules/OmniChannel/Import/SalesOrderImportSheet1.php` | Sheet 1 parse + validate (sync today) |
| `Modules/OmniChannel/Import/SalesOrderImportSheet2.php` | Sheet 2 other cost/discount |
| `Modules/OmniChannel/Import/SalesOrderDetailImport.php` | Per-SO detail import |
| `Modules/OmniChannel/Jobs/SalesOrderImportJob.php` | 1 job = 1 SO group |
| `Modules/OmniChannel/Jobs/StoreSOBasedStockJob.php` | Batch finally — recalc SO stock |
| `Modules/BusinessDevelopment/Entities/SalesOrderGeneral.php` | Subclass for policy |
| `Modules/OmniChannel/Entities/SalesOrderImportHistory.php` | Import session |
| `Modules/OmniChannel/Entities/ImportSoLog.php` | Per-row error log |

**Config:** `config/general.php` → `max_child = 100`

---

## 4. Import — AS-IS (Current Implementation)

### 4.1 Flow

```
POST upload (.xlsx/.xls)
  → SalesOrderImportHistory (status: processing)
  → Parse Sheet 1 + Sheet 2 — SYNCHRONOUS in HTTP request
  → On validation fail → import_status = failed
  → On success → Bus::batch(SalesOrderImportJob[]) per order group
  → Each job: SalesOrderController@store + detail per line
  → Batch finally: StoreSOBasedStockJob
  → Update history counts
```

**Progress:** `GET omnichannel/sales-order/progress` (~95% during batch, ~5% stock calc)

### 4.2 Order grouping key

`Customer + Store + Transaction Date + Platform Order ID + Shipper Service Code + Tracking Number`

### 4.3 Limits (AS-IS)

| Rule | Value |
|------|-------|
| Max detail per order | 100 (`limitDetail` + `max_child`) |
| File format | `.xlsx`, `.xls` |
| Max rows file | No hard cap |
| Concurrent import | 1 active batch per company |
| SO status after import | `open` |
| Approve during import | Blocked (`so_general_import_{so_id}` cache) |

### 4.4 API (import)

| Method | Path | Role |
|--------|------|------|
| POST | `omnichannel/sales-order/upload` | Upload Excel |
| GET | `omnichannel/sales-order/progress` | Progress polling |
| GET | `omnichannel/sales-order/import-history` | History list |
| GET | `omnichannel/sales-order/import-history-detail/{id}` | Per-SKU detail |
| GET | `omnichannel/sales-order/import-log` | Row-level errors |
| GET | `omnichannel/sales-order/export?type=general` | Download template |

### 4.5 Known AS-IS issues

| Issue | Cause |
|-------|-------|
| ~2.000 rows stuck at 0% | Full parse in HTTP thread → timeout before jobs dispatch |
| No Horizon jobs visible | Request dies before `Bus::batch` |
| Old history → failed on new upload | Stale batch cleanup marks previous `failed` |
| No export failed orders | Feature not implemented |

---

## 5. Import Bulk Improvement — TO-BE (Design Spec)

> Merged from legacy `old_sales-order-import-bulk-improvement.md`. **Not yet implemented.**

### 5.1 Goals

| ID | Goal |
|----|------|
| G1 | Handle ≥5.000 rows per file without stuck |
| G2 | 1 order = 1 Horizon job |
| G3 | Partial success — valid orders proceed if others fail |
| G4 | Error reports include Excel row numbers |
| G5 | Export failed orders in re-importable template format |

### 5.2 Target architecture

```mermaid
flowchart TD
    A[Upload file → storage] --> B[Create history processing]
    B --> C[Dispatch SalesOrderImportParseJob async]
    C --> D[Chunked parse Sheet 1 + 2]
    D --> E{"Per order valid?"}
    E -->|Yes| F[SalesOrderImportJob per order]
    E -->|No| G[Log failed + row numbers]
    F --> H[Create SO + details]
    H --> I[Update progress]
    G --> I
    I --> J[Batch finally: StoreSOBasedStockJob]
    J --> K[status: success / partial_success / failed]
```

**Key change:** HTTP returns in <10s; parsing moves to queue (`SalesOrderImportParseJob`).

### 5.3 Validation rules (TO-BE)

- **Order-level atomic failure:** 1 invalid row → entire order fails (no partial SO)
- **>100 detail lines:** entire order fails with row range message
- **File-level failure:** corrupt template → entire session `failed` immediately

### 5.4 Proposed API additions

| Method | Path | Role |
|--------|------|------|
| GET | `import-history/{id}/orders` | Order-level success/fail list |
| GET | `import-history/{id}/export-failed` | Re-importable Excel |

### 5.5 Proposed schema changes

**`omni_sales_order_import_histories`:** `total_so_failed`, `total_order`, `processed_order`, `parse_status`, `failure_reason`

**Order-level tracking:** extend `import_history_details` or new `import_history_orders` with `group_key`, `first_row_number`, `last_row_number`, `row_numbers` (json)

### 5.6 New jobs (proposal)

| Job | Role |
|-----|------|
| `SalesOrderImportParseJob` | Async chunked Excel read + order grouping |
| `SalesOrderImportFailedExport` | Generate failed-order Excel |

### 5.7 QA test scenarios (TO-BE)

| # | Scenario | Expected |
|---|----------|----------|
| TS-1 | 5.000 rows, 50 orders | Progress >0%, Horizon shows jobs |
| TS-2 | Order 101 SKU lines | Order fails; others succeed → `partial_success` |
| TS-3 | Export failed → fix → re-import | Fixed orders succeed |

---

## 7. Failed Process — AS-IS (Technical)

### 7.1 Data model

| Tabel / relasi | Level | Isi |
|----------------|-------|-----|
| `omni_sales_order_detail_errors` | Per detail (morph) | JSON `errors`: `{ "bind-error": "...", "stock-error": "..." }` |
| `omni_sales_order_errors` (`error_info`) | Per order | JSON `error` — shipping, warehouse, stock order-level |
| `SalesOrder::getErrors()` | Aggregate | Merge `error_info` + reduce `detail_error_flags` |

**AS-IS gap:** Tidak ada kolom `last_checked_at` per flag.

### 7.2 API (AS-IS)

| Method | Path | Role |
|--------|------|------|
| POST/GET | `omnichannel/sales-order/get?failed_process=true` | Datalist + kolom `error_flags_formatted` |
| POST | `businessdevelopment/all-sales-order/get?failed_process=true` | All Sales Order (proxy ke SalesOrderController) |
| GET | `omnichannel/sales-order/failed-process` | Counter pill Failed Process |
| GET | `omnichannel/unassign-wave/refresh-stock` | Manual stock re-check (**Unassign Wave only**) |

### 7.3 Rendering pipeline

```
SalesOrderController@index
  → addColumn('error_flags_formatted')
  → if failed_process=false → return '-'
  → $row->getErrors()
  → Store::getStockWH() → warehouse-error jika empty
  → SalesOrder::renderErrorFlags($id, $flag, $message, $color)
  → HTML tooltip-function-text + fa-solid icon
```

Flag → icon mapping: `SalesOrder::renderErrorFlags()` (`bind-error` → `link-slash`, `coa-error` → `share-nodes`, `stock-error` → `boxes-stacked`, `warehouse-error` → `warehouse`).

### 7.4 Scheduled & manual refresh (AS-IS)

| Mechanism | Schedule / trigger | Scope | Flags |
|-----------|-------------------|-------|-------|
| `screening:error-flag-stock-sales-order` | Daily 04:00 WIB | Semua SO dengan stock-error | `stock-error` only |
| `CheckOrderFlagsJob` | Post platform approve | 1 SO | All approve validation flags |
| `UnassignWaveController@refreshStock` | Manual button | Unassign Wave list | `stock-error` |
| `ProductBindingObserver` | On bind/unbind | Related orders | `bind-error` |

---

## 8. Re-check Failed Process — TO-BE (Design Spec)

> Merged dari requirement §9. **Not yet implemented.**

### 8.1 Target architecture

```mermaid
flowchart TD
    A[User klik Re-check Failed Process] --> B[Create batch log session]
    B --> C[Bus::batch RecheckFailedProcessJob per SO]
    C --> D1[Job SO-001]
    C --> D2[Job SO-002]
    C --> DN[Job SO-N]
    D1 --> E[Evaluate bind / COA / stock / warehouse granular]
    E --> F[Update flags + last_checked per icon]
    F --> G[Aggregate log per store]
    G --> H[Enable tombol kembali]
```

### 8.2 Proposed API

| Method | Path | Role |
|--------|------|------|
| POST | `businessdevelopment/all-sales-order/recheck-failed-process` | Dispatch batch (all orders) |
| GET | `businessdevelopment/all-sales-order/recheck-failed-process/progress` | Batch progress + disable/enable button |
| GET | `businessdevelopment/all-sales-order/recheck-failed-process/logs` | Log grouped per store |

### 8.3 Proposed jobs

| Job | Role |
|-----|------|
| `RecheckFailedProcessBatchJob` | Orchestrator — collect all SO ids, dispatch `Bus::batch` |
| `RecheckFailedProcessOrderJob` | 1 SO — reuse logic dari `validateOrderDetails()` + warehouse check; granular `addError`/`removeError`; partial failure tracking |

**Reuse candidates:** `SalesOrderController@validateOrderDetails()`, `Store::getProcessWH()` / `getStockWH()`, `CanManageOrderDetailError::removeError()`.

### 8.4 Proposed schema changes

**Option A — extend detail errors JSON:**

```json
{
  "stock-error": "Insufficient stock",
  "_meta": {
    "stock-error": { "last_checked_at": "2026-06-23T14:32:05+07:00" }
  }
}
```

**Option B — tabel baru `omni_sales_order_failed_process_checks`:** `sales_order_id`, `flag`, `last_checked_at`, `last_result` (ok/failed), `last_error`.

**Log table (proposal):** `bd_all_sales_order_recheck_logs` — batch_id, store_id, triggered_at, triggered_by, success_count, failed_summary, started_at, ended_at.

### 8.5 Frontend (TO-BE)

| File | Change |
|------|--------|
| `AllSalesOrder/DataList.vue` | Tombol Re-check + progress message + log modal |
| `SalesOrder/DataList.vue` | Tooltip Last Checked (konsumsi API `error_flags_formatted` terbaru) |
| `SalesOrder::renderErrorFlags()` | Append Last checked ke tooltip `value` |

### 8.6 Horizon & locking

- Pattern mirip export lock: `Cache::lock('recheck_failed_process_{company_id}')` selama batch aktif
- Progress: poll `recheck-failed-process/progress` atau reuse batch ID Laravel `Bus::batch`

---

## 6. Cross-References

| Topic | Doc |
|-------|-----|
| Business rules & import columns | [requirement.md](./requirement.md) §4 |
| Operator guide | [knowledge-base.md](./knowledge-base.md) |
| Platform SO comparison | [requirement.md](./requirement.md) §6 |
| Failed Process AS-IS & TO-BE | [requirement.md](./requirement.md) §8–§9 |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Legacy import improvement source | [../_legacy/old_sales-order-import-bulk-improvement.md](../_legacy/old_sales-order-import-bulk-improvement.md) |
