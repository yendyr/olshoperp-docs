---
doc_type: technical
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
version: 1.1
last_updated: 2026-06-26
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Transfer Internal — Technical Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


## 1. Architecture Overview

Semua menu stock mutation berbagi tabel header **`scm_stock_mutations`** (model `StockMutation`) dengan global scope `ignore_opname` (`is_opname != 1`). Menu ini memakai subclass **`StockMutationTransfer`** dengan filter query spesifik di controller index.

```mermaid
flowchart TB
    subgraph Frontend
        FE["Vue pages"]
    end
    subgraph API
        CTL["StockMutationTransferController"]
        API["supplychain/mutation-transfer"]
    end
    subgraph Domain
        ENT["StockMutationTransfer"]
        ISM["ItemStockMutation"]
    end
    subgraph Data
        DB[("scm_stock_mutations")]
        STK[("scm_item_stocks")]
    end
    FE --> API --> CTL --> ENT
    CTL --> ISM --> STK
    ENT --> DB
```

**Approve flow:** POST `mutation-transfer/{id}/approve` → validasi semua detail punya `warehouse_destination_id` → `ItemStockMutation` transfer internal — kurangi origin, tambah destination.

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/SCM/StockMutation/Transfer/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET supplychain/mutation-transfer` |
| `Form.vue` | Create/edit header + tabs detail | `POST/PUT supplychain/mutation-transfer` |
| `DatalistDetail.vue` | Grid detail PrimeVue | nested detail resource |
| `DatalistLogApproval.vue` | Approval history | `GET .../log/approve` |
| `ApprovalEligibility.vue` | Pre-approve checks | `GET .../approval-eligibility` |

**Router:** `olshoperp-frontend/src/router/index.ts` — path `mutation-transfer-internal` under `/supplychain`.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/StockMutationTransferController.php` | Header CRUD, approve, export |
| `Modules/SupplyChain/Entities/StockMutationTransfer.php` | Eloquent subclass `StockMutation` |
| `Modules/SupplyChain/Entities/StockMutation.php` | Base model, type constants |
| `Modules/SupplyChain/Entities/StockMutationApproval.php` | Approval log rows |
| `app/Helpers/SupplyChain/ItemStockMutation.php` | Core approve inbound/outbound/transfer |
| `Modules/SupplyChain/Policies/StockMutationTransferPolicy.php` | Gate authorization |
| `Modules/SupplyChain/Routes/api.php` | Route group `mutation-transfer` |

Controllers terkait: StockMutationTransferController, StockMutationTransferDetailController, StockMutationTransferInternalController.

## 4. API Routes (utama)

| Method | Path | Controller@method |
|--------|------|-------------------|
| GET | `supplychain/mutation-transfer` | index |
| POST | `supplychain/mutation-transfer` | store |
| GET | `supplychain/mutation-transfer/{id}` | show |
| PUT | `supplychain/mutation-transfer/{id}` | update |
| DELETE | `supplychain/mutation-transfer/{id}` | destroy |
| POST | `supplychain/mutation-transfer/{id}/approve` | approve |
| GET | `supplychain/mutation-transfer/{id}/audit` | audit |
| GET | `supplychain/mutation-transfer/{id}/log/approve` | approval log |
| GET | `supplychain/mutation-transfer/approval-eligibility/{id}` | eligibility |
| GET | `supplychain/mutation-transfer/export-excel` | export all |

Detail nested: `supplychain/mutation-transfer/{id}/...-detail` — lihat `Modules/SupplyChain/Routes/api.php` untuk route lengkap.

## 5. Database Schema

### Header: `scm_stock_mutations`

| Column | Relevansi menu ini |
|--------|-------------------|
| `code` | Prefix `TFI` via `generateCode()` |
| `transaction_date` | Tanggal transaksi |
| `warehouse_origin` / `warehouse_destination` | Sesuai tipe in/out/transfer |
| `type` | `in` / `out` / `tf internal` / `tf external` |
| `type_so` | Outbound: sales order type |
| `transit_status` | External: `in transit` / `delivered` |
| `transaction_status` | `open`, `approved`, `rejected`, ... |
| `is_inventory_adjustment` | 0 mutation / 1 adjustment |
| `process_type` | scrap, from void, picking, dll. |
| `supplier_id` | Inbound PO only |
| `transaction_reference_*` | Polymorphic link |

### Detail

`scm_transfer_mutation_details` (`TransferMutationDetail`)

### Approval

`scm_stock_mutation_approvals` — `scm_stock_mutations_id`, `approval_status`, `description`, `created_by`.

## 6. Jobs / Observers / Events

| Job / Service | Dipakai untuk |
|---------------|---------------|
| Export jobs (`StockMutation*ExportJob`) | Async export list/detail |
| Import jobs (`InboundDetailImportJob`, dll.) | Excel import detail |
| `ItemStockMutation` | Sync stock update on approve |
| `TransferExternalApproveMutationJob` | External transfer approve (jika transit) |

## 7. Index query filter (AS-IS)

```
`type = tf internal` · `is_inventory_adjustment = 0` · `process_type` null (bukan scrap/void/failed ship)
```

## 8. Relasi Failed Ship & rantai fulfillment

Transfer Internal adalah **ledger pusat** semua perpindahan stok antar gudang, termasuk rantai order fulfillment (virtual WH) dan dokumen **Failed Ship**.

### 8.1 Kenapa fulfillment tidak tampil di datalist default

Index `StockMutationTransferController@index` (dipakai menu ini) secara default:

- `whereNull('process_type')` — hanya TF manual umum (prefix TFI tanpa proses Omni)
- Exclude virtual WH kecuali `show_virtual=true`
- Exclude `process_type = failed ship` (kecuali baris FS dengan restock qty > 0)

**Operator / QA:** aktifkan toggle **Show Virtual** di `Transfer/DataList.vue` (`show_virtual_data` → query param `show_virtual`) untuk melihat pergerakan transaksional order.

### 8.2 Rantai `process_type` satu order (menu terkait)

| Urutan | `process_type` | Prefix | Menu approve | Origin → Destination |
|--------|----------------|--------|--------------|----------------------|
| 0 | `in wave` | TFI (virtual) | — (tidak di-approve) | Rack → Rack-Waves |
| 1 | `picking` | PL | [Picking Process](../omni-picking-process/requirement.md) | Rack → Outrack |
| 2 | `checking` | CL | [Checking Process](../omni-checking-process/requirement.md) | Outrack → virtual Checking |
| 3 | `packing` | PK | [Packing Process](../omni-packing-process/requirement.md) | virtual Checking → virtual Packing |
| 4 | `shipping` | SL | Collecting (pra-DO) | virtual Packing → virtual Collected |
| 5 | `shipping do` | TFI | [Delivery Order](../supplychain-delivery-order/technical.md) approve | virtual Collected → **WH 3PL** |
| 6 | `failed ship` | FS | [Failed Ship](../supplychain-failed-ship/requirement.md) approve | WH 3PL → Location / lost / scrap |

Semua baris TF order memakai `transaction_reference_id` = SO atau `SalesOrderDetail` (tergantung tahap).

### 8.3 Failed Ship di TF Internal

| Aspek | Detail |
|-------|--------|
| Header FS | `process_type = failed ship`, `transaction_reference` = Sales Order |
| Approve FS | `ItemStockMutation::approveTransfer` — restock dari 3PL; child `lost` / `scrap` |
| Filter index | FS tidak muncul di datalist manual default — buka dari menu Failed Ship atau filter virtual + process type |

**Doc utama FS:** [supplychain-failed-ship/technical.md §11](../supplychain-failed-ship/technical.md#11-cross-menu--pergerakan-stok--dokumen-terkait)

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Requirement | [requirement.md](./requirement.md) |
| Mermaid style | [../_meta/MERMAID_STYLE_GUIDE.md](../_meta/MERMAID_STYLE_GUIDE.md) |
