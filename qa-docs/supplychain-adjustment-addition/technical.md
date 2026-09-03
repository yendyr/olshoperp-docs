---
doc_type: technical
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
version: 1.1
last_updated: 2026-09-03
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../supplychain-new-purchase-inbound/requirement.md
  - ../supplychain-colli-type/requirement.md
---

# Stock Addition — Technical Documentation

> Status **review**. **Colli v2** (§8) = TO-BE — reuse pola PI; lihat requirement §11 · ETM-15633.


## 1. Architecture Overview

Semua menu stock mutation berbagi tabel header **`scm_stock_mutations`** (model `StockMutation`) dengan global scope `ignore_opname` (`is_opname != 1`). Menu ini memakai subclass **`StockMutationAddition`** dengan filter query spesifik di controller index.

```mermaid
flowchart TB
    subgraph Frontend
        FE["Vue pages"]
    end
    subgraph API
        CTL["StockMutationAdditionController"]
        API["supplychain/adjustment-addition"]
    end
    subgraph Domain
        ENT["StockMutationAddition"]
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

**Approve flow:** SCM: create/edit only. Approve via Accounting: POST `accounting/adjustment-inbound/{id}/approve` (`InboundValueAdjustmentController`).

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/SCM/StockAdjustment/StockAddition/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET supplychain/adjustment-addition` |
| `Form.vue` | Create/edit header + tabs detail | `POST/PUT supplychain/adjustment-addition` |
| `DatalistDetail.vue` | Grid detail PrimeVue | nested detail resource |
| `DatalistLogApproval.vue` | Approval history | `GET .../log/approve` |
| `ApprovalEligibility.vue` | Pre-approve checks | `GET .../approval-eligibility` |

**Router:** `olshoperp-frontend/src/router/index.ts` — path `adjustment-addition` under `/supplychain`.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/StockMutationAdditionController.php` | Header CRUD, approve, export |
| `Modules/SupplyChain/Entities/StockMutationAddition.php` | Eloquent subclass `StockMutation` |
| `Modules/SupplyChain/Entities/StockMutation.php` | Base model, type constants |
| `Modules/SupplyChain/Entities/StockMutationApproval.php` | Approval log rows |
| `app/Helpers/SupplyChain/ItemStockMutation.php` | Core approve inbound/outbound/transfer |
| `Modules/SupplyChain/Policies/StockMutationAdditionPolicy.php` | Gate authorization |
| `Modules/SupplyChain/Routes/api.php` | Route group `adjustment-addition` |

Controllers terkait: StockMutationAdditionController, StockMutationAdditionDetailController.

## 4. API Routes (utama)

| Method | Path | Controller@method |
|--------|------|-------------------|
| GET | `supplychain/adjustment-addition` | index |
| POST | `supplychain/adjustment-addition` | store |
| GET | `supplychain/adjustment-addition/{id}` | show |
| PUT | `supplychain/adjustment-addition/{id}` | update |
| DELETE | `supplychain/adjustment-addition/{id}` | destroy |
| POST | `supplychain/adjustment-addition/{id}/approve` | approve |
| GET | `supplychain/adjustment-addition/{id}/audit` | audit |
| GET | `supplychain/adjustment-addition/{id}/log/approve` | approval log |
| GET | `supplychain/adjustment-addition/approval-eligibility/{id}` | eligibility |
| GET | `supplychain/adjustment-addition/export-excel` | export all |

Detail nested: `supplychain/adjustment-addition/{id}/...-detail` — lihat `Modules/SupplyChain/Routes/api.php` untuk route lengkap.

## 5. Database Schema

### Header: `scm_stock_mutations`

| Column | Relevansi menu ini |
|--------|-------------------|
| `code` | Prefix `AI` via `generateCode()` |
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

`scm_inbound_mutation_details` — perlu harga/benchmark untuk jurnal

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
`is_inventory_adjustment = 1` · `warehouse_origin` null · `supplier_id` null · `is_return_process = 0`
```

## 8. Colli v2 (TO-BE — ETM-15633)

**Requirement bisnis:** [requirement §11](./requirement.md#11-fitur-colli-v2-to-be--etm-15633).  
**Kanonik implementasi UI/API:** reuse pola New Purchase Inbound Colli v2 — lihat [PI technical](../supplychain-new-purchase-inbound/technical.md) (section Colli / Multisku) + SoT `_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md`.

| Area | Catatan Stock Addition |
|------|------------------------|
| Detail entity | `scm_inbound_mutation_details` — link colli (sama family inbound detail seperti PI) |
| WH binding | `warehouse_destination` header = Location Destination (exact match Existing Colli) |
| Insert SKU | Tanpa Available PO Use — hanya select product / import |
| Approve side-effect | Permanence colli on Accounting approve (`InboundValueAdjustmentController` / ItemStockMutation) |
| Import | Satu kolom Colli; ganti template v1 `colli` × `colli_qty` jika masih ada |
| Master | Colli Type Active + Default ON |

**Dev note:** jangan port validasi outstanding PO ke Stock Addition. Shared Multisku Colli / Colli Type services boleh dipakai ulang.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Requirement | [requirement.md](./requirement.md) |
| PI Colli v2 | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) |
| Mermaid style | [../_meta/MERMAID_STYLE_GUIDE.md](../_meta/MERMAID_STYLE_GUIDE.md) |
