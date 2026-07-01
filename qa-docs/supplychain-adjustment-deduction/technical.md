---
doc_type: technical
menu: supplychain-adjustment-deduction
menu_name: "Stock Deduction"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Stock Deduction — Technical Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


## 1. Architecture Overview

Semua menu stock mutation berbagi tabel header **`scm_stock_mutations`** (model `StockMutation`) dengan global scope `ignore_opname` (`is_opname != 1`). Menu ini memakai subclass **`StockMutationDeduction`** dengan filter query spesifik di controller index.

```mermaid
flowchart TB
    subgraph Frontend
        FE["Vue pages"]
    end
    subgraph API
        CTL["StockMutationDeductionController"]
        API["supplychain/adjustment-deduction"]
    end
    subgraph Domain
        ENT["StockMutationDeduction"]
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

**Approve flow:** SCM: create/edit only. Approve via Accounting: POST `accounting/adjustment-deduction/{id}/approve` (`Accounting\StockMutationDeductionController`).

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/SCM/StockAdjustment/StockDeduction/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET supplychain/adjustment-deduction` |
| `Form.vue` | Create/edit header + tabs detail | `POST/PUT supplychain/adjustment-deduction` |
| `DatalistDetail.vue` | Grid detail PrimeVue | nested detail resource |
| `DatalistLogApproval.vue` | Approval history | `GET .../log/approve` |
| `ApprovalEligibility.vue` | Pre-approve checks | `GET .../approval-eligibility` |

**Router:** `olshoperp-frontend/src/router/index.ts` — path `adjustment-deduction` under `/supplychain`.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/StockMutationDeductionController.php` | Header CRUD, approve, export |
| `Modules/SupplyChain/Entities/StockMutationDeduction.php` | Eloquent subclass `StockMutation` |
| `Modules/SupplyChain/Entities/StockMutation.php` | Base model, type constants |
| `Modules/SupplyChain/Entities/StockMutationApproval.php` | Approval log rows |
| `app/Helpers/SupplyChain/ItemStockMutation.php` | Core approve inbound/outbound/transfer |
| `Modules/SupplyChain/Policies/StockMutationDeductionPolicy.php` | Gate authorization |
| `Modules/SupplyChain/Routes/api.php` | Route group `adjustment-deduction` |

Controllers terkait: StockMutationDeductionController, StockMutationDeductionDetailController.

## 4. API Routes (utama)

| Method | Path | Controller@method |
|--------|------|-------------------|
| GET | `supplychain/adjustment-deduction` | index |
| POST | `supplychain/adjustment-deduction` | store |
| GET | `supplychain/adjustment-deduction/{id}` | show |
| PUT | `supplychain/adjustment-deduction/{id}` | update |
| DELETE | `supplychain/adjustment-deduction/{id}` | destroy |
| POST | `supplychain/adjustment-deduction/{id}/approve` | approve |
| GET | `supplychain/adjustment-deduction/{id}/audit` | audit |
| GET | `supplychain/adjustment-deduction/{id}/log/approve` | approval log |
| GET | `supplychain/adjustment-deduction/approval-eligibility/{id}` | eligibility |
| GET | `supplychain/adjustment-deduction/export-excel` | export all |

Detail nested: `supplychain/adjustment-deduction/{id}/...-detail` — lihat `Modules/SupplyChain/Routes/api.php` untuk route lengkap.

## 5. Database Schema

### Header: `scm_stock_mutations`

| Column | Relevansi menu ini |
|--------|-------------------|
| `code` | Prefix `AO` via `generateCode()` |
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

`scm_outbound_mutation_details` — FIFO item stock selection

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
`is_inventory_adjustment = 1` · `warehouse_destination` null · `warehouse_origin` not null
```

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Requirement | [requirement.md](./requirement.md) |
| Mermaid style | [../_meta/MERMAID_STYLE_GUIDE.md](../_meta/MERMAID_STYLE_GUIDE.md) |
