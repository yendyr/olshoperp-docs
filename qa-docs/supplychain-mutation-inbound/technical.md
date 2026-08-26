---
doc_type: technical
menu: supplychain-mutation-inbound
menu_name: "Purchase Inbound"
version: 1.1
last_updated: 2026-08-14
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Purchase Inbound — Technical Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


## 1. Architecture Overview

Semua menu stock mutation berbagi tabel header **`scm_stock_mutations`** (model `StockMutation`) dengan global scope `ignore_opname` (`is_opname != 1`). Menu ini memakai subclass **`StockMutationInbound`** dengan filter query spesifik di controller index.

```mermaid
flowchart TB
    subgraph Frontend
        FE["Vue pages"]
    end
    subgraph API
        CTL["StockMutationInboundController"]
        API["supplychain/mutation-inbound"]
    end
    subgraph Domain
        ENT["StockMutationInbound"]
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

**Approve flow:** POST `mutation-inbound/{id}/approve` → `ItemStockMutation::approveInbound()` — update item stock, QC/inspection jika ada, set `transaction_status = approved`.

**Colli v2 (parity BETA):** FE `InventoryIn/**`; FK `multisku_colli_id` on details + item_stocks; entity `MultiskuColli` (`COL`). Takedown `InboundColly` / import v1. Canonical: [BETA technical](../supplychain-new-purchase-inbound/technical.md) §8 + invariants INV-INB-08…14.

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/SCM/StockMutation/InventoryIn/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET supplychain/mutation-inbound` |
| `Form.vue` | Create/edit header + tabs detail | `POST/PUT supplychain/mutation-inbound` |
| `DatalistDetail.vue` | Grid detail PrimeVue | nested detail resource |
| `DatalistLogApproval.vue` | Approval history | `GET .../log/approve` |
| `ApprovalEligibility.vue` | Pre-approve checks | `GET .../approval-eligibility` |

**Router:** `olshoperp-frontend/src/router/index.ts` — path `mutation-inbound` under `/supplychain`.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/StockMutationInboundController.php` | Header CRUD, approve, export |
| `Modules/SupplyChain/Entities/StockMutationInbound.php` | Eloquent subclass `StockMutation` |
| `Modules/SupplyChain/Entities/StockMutation.php` | Base model, type constants |
| `Modules/SupplyChain/Entities/StockMutationApproval.php` | Approval log rows |
| `app/Helpers/SupplyChain/ItemStockMutation.php` | Core approve inbound/outbound/transfer |
| `Modules/SupplyChain/Policies/StockMutationInboundPolicy.php` | Gate authorization |
| `Modules/SupplyChain/Routes/api.php` | Route group `mutation-inbound` |

Controllers terkait: StockMutationInboundController, StockMutationInboundDetailController, StockMutationInboundMiddleDetailController.

## 4. API Routes (utama)

| Method | Path | Controller@method |
|--------|------|-------------------|
| GET | `supplychain/mutation-inbound` | index |
| POST | `supplychain/mutation-inbound` | store |
| GET | `supplychain/mutation-inbound/{id}` | show |
| PUT | `supplychain/mutation-inbound/{id}` | update |
| DELETE | `supplychain/mutation-inbound/{id}` | destroy |
| POST | `supplychain/mutation-inbound/{id}/approve` | approve |
| GET | `supplychain/mutation-inbound/{id}/audit` | audit |
| GET | `supplychain/mutation-inbound/{id}/log/approve` | approval log |
| GET | `supplychain/mutation-inbound/approval-eligibility/{id}` | eligibility |
| GET | `supplychain/mutation-inbound/export-excel` | export all |

Detail nested: `supplychain/mutation-inbound/{id}/...-detail` — lihat `Modules/SupplyChain/Routes/api.php` untuk route lengkap.

## 5. Database Schema

### Header: `scm_stock_mutations`

| Column | Relevansi menu ini |
|--------|-------------------|
| `code` | Prefix `IN` via `generateCode()` |
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

`scm_inbound_mutation_details` (`InboundMutationDetail`) + optional middle `scm_inbound_mutation_middle_details`

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
`warehouse_origin` null · `supplier_id` not null · `is_inventory_adjustment = 0` · `is_return_process = 0`
```

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Requirement | [requirement.md](./requirement.md) |
| Canonical BETA | [../supplychain-new-purchase-inbound/technical.md](../supplychain-new-purchase-inbound/technical.md) |
| Colli Type | [../supplychain-colli-type/technical.md](../supplychain-colli-type/technical.md) |
| Mermaid style | [../_meta/MERMAID_STYLE_GUIDE.md](../_meta/MERMAID_STYLE_GUIDE.md) |
