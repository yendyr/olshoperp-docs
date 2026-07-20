---
doc_type: technical
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
version: 2.2
last_updated: 2026-07-17
owner: QA - Yemima
status: review
---

# Purchase Inbound (GRN) — Technical Documentation

**UI route (BETA):** `/supplychain/new-purchase-inbound`  
**API base:** `supplychain/mutation-inbound`  
**Behavior SoT:** [requirement.md](./requirement.md) v2.2  
**Legacy UI:** [../supplychain-mutation-inbound/technical.md](../supplychain-mutation-inbound/technical.md)

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `StockMutationInboundController.php` |
| Detail | `StockMutationInboundDetailController.php` |
| Middle (COLLI) | `StockMutationInboundMiddleDetailController.php` |
| Model | `StockMutationInbound` / `InboundMutationDetail` / `InboundMutationMiddleDetail` |
| Approve helper | `app/Helpers/SupplyChain/ItemStockMutation.php` → `approveInbound()` |
| Journal | `app/Helpers/Accounting/JournalProcess.php` → `stockInboundAutoJournal()` |
| Jobs | `ApproveInboundJob`, `GenerateItemStockChunkJob` |
| Import | `StockMutationInboundImport`, `StockMutationInboundColliImport` |

### Frontend

| File | Role |
|------|------|
| `SCM/Inbound/PurchaseInbound/DataList.vue` | Header datalist |
| `Form.vue` | Create/edit |
| `DatalistDetail.vue` / `DatalistDetailGroup.vue` | Flat vs group + COLLI |
| `InboundColly.vue` | COLLI inline edit |
| `OutstandingPurchaseOrderDetail.vue` | Outstanding PO panel |

**Router:** `new-purchase-inbound` · View toggle `groupView` in Form.

### Scope filter

`StockMutationInbound` on `scm_stock_mutations`: `supplier_id` not null, `type` null, not inventory adjustment, not return process.

---

## 2. API Routes (utama)

| Method | Path | Action |
|--------|------|--------|
| CRUD | `supplychain/mutation-inbound` | Index/store/show/update/destroy |
| POST | `…/{id}/approve` | Approve / reject |
| GET | `…/unapprove/{id}` | Dev/local only |
| GET | `…/{id}/print`, `/print-rir` | PDF GRN / RIR |
| GET | `…/{id}/mutation-inbound-detail/outstanding` | Outstanding PO |
| CRUD | `…/mutation-inbound-detail/*` | Detail lines |
| CRUD | `…/middle/*` | COLLI middle |
| POST | `…/mutation-inbound-detail/upload` | Import |
| GET | Import log / history / export | Monitoring + export |

---

## 3. Database — Key Tables

| Table | Notes |
|-------|-------|
| `scm_stock_mutations` | Header GRN (`IN-` code, supplier, warehouse, status) |
| `scm_inbound_mutation_details` | Lines + `purchase_order_detail_id`; invoice qty bridge |
| `scm_inbound_mutation_middle_details` | COLLI: `qty_in_colly`, `qty_each_colly`, unit |
| PO detail flags | `prepared_to_grn_quantity`, `processed_to_grn_quantity` |

---

## 4. Approve Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant C as StockMutationInboundController
    participant Cache as Cache lock 60s
    participant ISM as ItemStockMutation
    participant Job as ApproveInboundJob
    participant JP as JournalProcess
    participant PO as PO detail

    FE->>C: POST approve
    C->>Cache: approval_process_inbound
    alt lock / import / job running
        C-->>FE: wait / error
    else ok
        alt middle COLLI exists
            C->>Job: dispatch async
            Job->>ISM: chunk GenerateItemStockChunkJob
            Job->>JP: stockInboundAutoJournal
            Job->>PO: prepared↓ processed↑
            alt job fail
                Job-->>FE: toast; status open; rollback stock/journal
            end
        else standard
            C->>ISM: approveInbound sync
            C->>JP: stockInboundAutoJournal
            C->>PO: prepared↓ processed↑
        end
    end
```

**Transaction boundary:** sync path posts stock+journal inline; async COLLI defers stock gen — on job fail, status → open and partial stock/journal deleted (re-approve).

---

## 5. Invariants

| ID | Invariant |
|----|-----------|
| INV-INB-01 | Per PO detail: `prepared_to_grn + processed_to_grn ≤ order_quantity_in_base_unit` |
| INV-INB-02 | Detail inbound qty (base) ≤ `inBalance()` at store time |
| INV-INB-03 | Detail count ≤ `config('general.max_child_10000')` (10000) |
| INV-INB-04 | Serial create ≤ `LIMIT_CREATE_SERIAL_NUMBER` (50) per operation |
| INV-INB-05 | Service COA type → no ItemStock; journal still posts |
| INV-INB-06 | COLLI: inbound qty = `qty_in_colly × qty_each_colly` when colli > 0 |
| INV-INB-07 | Journal amount = price before VAT × qty base (no VAT lines at GRN) |

---

## 6. Failure Modes & Transaction Boundary

| Failure | Scope | Behavior |
|---------|-------|----------|
| Concurrent approve | Cache 60s | Error *Approval in progress* |
| Import in progress / async job running | Pre-TX | Approve blocked |
| Empty detail / fiscal / max 10000 | Pre-TX | Error |
| Missing Product COA | Mid approve / journal | Error; incomplete COA message |
| COLLI job fail | Async job | Status → open; delete partial stock/journal/approval; toast; re-approve |
| Delete detail with colli | Destroy | Blocked until colli cleared |
| Void from UI | Approve API | Rejected — only approved/rejected accepted (GAP-PI-01) |

---

## 7. Data Lifecycle (PO → GRN → PI)

| Stage | Document | Flag / field | Meaning |
|-------|----------|--------------|---------|
| PO | Detail | `prepared_to_grn_quantity` | Reserved by GRN draft/open |
| PO | Detail | `processed_to_grn_quantity` | Finalized on GRN approve |
| PO header | Status | processed / complete | Partial vs full receive |
| GRN | Middle | `qty_in_colly` / `qty_each_colly` | COLLI packaging |
| GRN → PI | Inbound detail | `prepared_to_invoice_quantity` | Reserved by PI draft |
| GRN → PI | Inbound detail | `processed_to_invoice_quantity` | Finalized on PI approve |

Business rules: [requirement.md](./requirement.md).

---

## 8. PO qty & COLLI

**Balance:** `inBalance() = order_base − prepared_grn − processed_grn`

**COLLI:** auto middle row on detail add; `latest_colly` from last middle same product (floor, unit-converted). FE safety: if `colli × latest > outstanding + current` → isi = 1. Async approve when middle exists; `is_colly` on ItemStock when colli > 0. Progress: cache `item_stock_status_formatted:{id}`.

---

## 9. Journal — Product COA Group type

`JournalProcess::stockInboundAutoJournal()`:

| Type | Stock ID? | Debit | Credit |
|------|-----------|-------|--------|
| Purchased / Manufactured | Yes | Inventory | Unbilled Goods |
| Fix Asset | Yes (`is_fix_asset`) | Assets | Unbilled Goods |
| Service | No | Operational Expense | Unbilled Goods |

Config `inbound-with-unbilled-goods=false` → Credit AP on supplier. Tax lines deferred to Purchase Invoice.

---

## 10. Import & Config

| Import | Class |
|--------|-------|
| Standard | `StockMutationInboundImport` |
| COLLI | `StockMutationInboundColliImport` → job; qty = colli × isi |

| Config | Value |
|--------|-------|
| `general.max_child_10000` | 10000 |
| Serial limit | 50 |
| `accounting.inbound-with-unbilled-goods` | true default |

---

## 11. Validation Highlights

| Message / rule | Where |
|----------------|-------|
| Trx date ≤ today | store/update |
| Qty exceeds outstanding | detail store |
| Approval in progress | async approve |
| Linked to colli — cannot delete | detail destroy |
| > 10.000 details | approve |
| Concurrent import blocked | upload |

---

## 12. Frontend Behaviors

| Behavior | Note |
|----------|------|
| Create open/draft | Status radio |
| Header lock after details | Supplier, WH, date |
| Group view | Shows COLLI column |
| Item Stock Status % | Async COLLI progress |
| Void dialog | Present but BE rejects (GAP-PI-01) |
| BETA datalist | `from_menu=newInobound` (typo preserved) |

---

## 13. Tests & QA Notes

1. Standard approve → sync stock + journal  
2. COLLI 300+ koli → async completes  
3. Job fail → open + re-approve  
4. PO partial/full transitions  
5. Serial 51st blocked  
6. Service → no ItemStock; Fix Asset → Assets debit  
7. Void UI → API rejection (GAP-PI-01)

---

## 14. Known Issues

| ID | Issue |
|----|-------|
| GAP-PI-01 | Void UI broken — BE rejects void |
| GAP-PI-02 | Close not functional on GRN header |
| GAP-PI-03 | BETA + legacy two UIs same API |
| GAP-PI-06 | Unapprove production/local only |
| GAP-PI-07 | `from_menu=newInobound` typo |
| DEV-PI-01…05 | Wire void/close; fix ClosedDialog; unapprove policy; typo; journal deep links |

Full registry: [requirement §19–§21](./requirement.md).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Purchase Order | [../supplychain-purchase-order/technical.md](../supplychain-purchase-order/technical.md) |
| Purchase Invoice | [../accounting-supplier-invoice/technical.md](../accounting-supplier-invoice/technical.md) |
| Legacy UI | [../supplychain-mutation-inbound/technical.md](../supplychain-mutation-inbound/technical.md) |
