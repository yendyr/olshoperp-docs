---
doc_type: technical
menu: supplychain-mutation-transfer-void
menu_name: "Void Transfer"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Void Transfer — Technical Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


## 1. Architecture Overview

Semua menu stock mutation berbagi tabel header **`scm_stock_mutations`** (model `StockMutation`) dengan global scope `ignore_opname` (`is_opname != 1`). Menu ini memakai subclass **`StockMutationTransferVoid`** dengan filter query spesifik di controller index.

```mermaid
flowchart TB
    subgraph Frontend
        FE["Vue pages"]
    end
    subgraph API
        CTL["StockMutationTransferVoidController"]
        API["supplychain/mutation-transfer-void"]
    end
    subgraph Domain
        ENT["StockMutationTransferVoid"]
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

**Approve flow:** POST `mutation-transfer-void/{id}/approve` — wajib `warehouse_destination` terisi di header sebelum approve.

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/SCM/StockMutation/TransferVoid/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET supplychain/mutation-transfer-void` |
| `Form.vue` | Create/edit header + tabs detail | `POST/PUT supplychain/mutation-transfer-void` |
| `DatalistDetail.vue` | Grid detail PrimeVue | nested detail resource |
| `DatalistLogApproval.vue` | Approval history | `GET .../log/approve` |
| `ApprovalEligibility.vue` | Pre-approve checks | `GET .../approval-eligibility` |

**Router:** `olshoperp-frontend/src/router/index.ts` — path `mutation-transfer-void` under `/supplychain`.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/StockMutationTransferVoidController.php` | Header CRUD, approve, export |
| `Modules/SupplyChain/Entities/StockMutationTransferVoid.php` | Eloquent subclass `StockMutation` |
| `Modules/SupplyChain/Entities/StockMutation.php` | Base model, type constants |
| `Modules/SupplyChain/Entities/StockMutationApproval.php` | Approval log rows |
| `app/Helpers/SupplyChain/ItemStockMutation.php` | Core approve inbound/outbound/transfer |
| `Modules/SupplyChain/Policies/StockMutationTransferVoidPolicy.php` | Gate authorization |
| `Modules/SupplyChain/Routes/api.php` | Route group `mutation-transfer-void` |

Controllers terkait: StockMutationTransferVoidController, StockMutationTransferVoidDetailController.

## 4. API Routes (utama)

| Method | Path | Controller@method |
|--------|------|-------------------|
| GET | `supplychain/mutation-transfer-void` | index |
| POST | `supplychain/mutation-transfer-void` | store |
| GET | `supplychain/mutation-transfer-void/{id}` | show |
| PUT | `supplychain/mutation-transfer-void/{id}` | update |
| DELETE | `supplychain/mutation-transfer-void/{id}` | destroy |
| POST | `supplychain/mutation-transfer-void/{id}/approve` | approve |
| GET | `supplychain/mutation-transfer-void/{id}/audit` | audit |
| GET | `supplychain/mutation-transfer-void/{id}/log/approve` | approval log |
| GET | `supplychain/mutation-transfer-void/approval-eligibility/{id}` | eligibility |
| GET | `supplychain/mutation-transfer-void/export-excel` | export all |

Detail nested: `supplychain/mutation-transfer-void/{id}/...-detail` — lihat `Modules/SupplyChain/Routes/api.php` untuk route lengkap.

## 5. Database Schema

### Header: `scm_stock_mutations`

| Column | Relevansi menu ini |
|--------|-------------------|
| `code` | Prefix `TFV` via `generateCode()` |
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

`scm_transfer_mutation_details` + middle details

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
`type = tf internal` · `process_type = from void` · origin voided order virtual WH
```

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Requirement | [requirement.md](./requirement.md) |
| Mermaid style | [../_meta/MERMAID_STYLE_GUIDE.md](../_meta/MERMAID_STYLE_GUIDE.md) |
