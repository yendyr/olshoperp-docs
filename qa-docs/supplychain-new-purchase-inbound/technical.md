---
doc_type: technical
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
version: 2.4
last_updated: 2026-08-14
owner: QA - Yemima
status: review
---

# Purchase Inbound (GRN) — Technical Documentation

**UI route (BETA):** `/supplychain/new-purchase-inbound`  
**API base:** `supplychain/mutation-inbound`  
**Behavior SoT:** [requirement.md](./requirement.md) v2.4  
**Colli v2 SOT:** [../_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md](../_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md)  
**Legacy UI:** [../supplychain-mutation-inbound/technical.md](../supplychain-mutation-inbound/technical.md)

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `StockMutationInboundController.php` |
| Detail | `StockMutationInboundDetailController.php` |
| Middle (COLLI v1 — takedown) | `StockMutationInboundMiddleDetailController.php` |
| Colli v2 entity | `MultiskuColli` (`scm_multisku_collis`, `code_identifier = COL`) |
| Colli Type | `ColliType` — [../supplychain-colli-type/technical.md](../supplychain-colli-type/technical.md) |
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
| `DatalistDetail.vue` / `DatalistDetailGroup.vue` | Flat vs group; v1 COLLI until takedown |
| `InboundColly.vue` | **Takedown** — Colli ID v1 inline |
| `OutstandingPurchaseOrderDetail.vue` | Outstanding PO panel; TO-BE Colli Existing/New + Type |

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
| CRUD | `…/middle/*` | COLLI v1 middle (takedown) |
| POST | `…/mutation-inbound-detail/upload` | Import |
| GET | Import log / history / export | Monitoring + export |

---

## 3. Database — Key Tables

| Table | Notes |
|-------|-------|
| `scm_stock_mutations` | Header GRN (`IN-` code, supplier, warehouse, status) |
| `scm_inbound_mutation_details` | Lines + `purchase_order_detail_id`; **`multisku_colli_id` nullable** (Colli v2) |
| `scm_inbound_mutation_middle_details` | COLLI v1: `qty_in_colly`, `qty_each_colly` (takedown UX) |
| `scm_multisku_collis` | Colli code; `colli_type_id`; prefix `COL` |
| `scm_item_stocks` | **`multisku_colli_id` nullable** — availability in colli after Approve |
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
| INV-INB-06 | AS-IS v1: inbound qty = `qty_in_colly × qty_each_colly` when colli > 0 (takedown) |
| INV-INB-07 | Journal amount = price before VAT × qty base (no VAT lines at GRN) |
| INV-INB-08 | Parity Colli v2 di BETA + legacy UI (shared GRN API) |
| INV-INB-09 | Existing colli WH = header destination **exact** (WH terkecil) |
| INV-INB-10 | Maks 1 `multisku_colli_id` per detail; NULL allowed |
| INV-INB-11 | Qty / outstanding / serial GRN **unchanged** by Colli v2 |
| INV-INB-12 | New colli deletable until ≥1 referencing inbound **Approved**; then permanent |
| INV-INB-13 | Import TO-BE: same numbering → one New Colli; existing code → validate WH |
| INV-INB-14 | Void inbound × colli lifecycle = deferred (GAP-CIV2-08) |

---

## 6. Failure Modes & Transaction Boundary

| Failure | Scope | Behavior |
|---------|-------|----------|
| Concurrent approve | Cache 60s | Error *Approval in progress* |
| Import in progress / async job running | Pre-TX | Approve blocked |
| Empty detail / fiscal / max 10000 | Pre-TX | Error |
| Missing Product COA | Mid approve / journal | Error; incomplete COA message |
| COLLI v1 job fail | Async job | Status → open; delete partial stock/journal/approval; toast; re-approve |
| Existing colli WH mismatch | Assign / import | Validation error (GAP-CIV2-04/07) |
| Delete inbound → orphan new colli | Destroy header | Colli removed from Multisku list if never Approved + no remaining refs |
| Void from UI | Approve API | Rejected — only approved/rejected accepted (GAP-PI-01) |

---

## 7. Data Lifecycle (PO → GRN → PI)

| Stage | Document | Flag / field | Meaning |
|-------|----------|--------------|---------|
| PO | Detail | `prepared_to_grn_quantity` | Reserved by GRN draft/open |
| PO | Detail | `processed_to_grn_quantity` | Finalized on GRN approve |
| PO header | Status | processed / complete | Partial vs full receive |
| GRN | Detail | `multisku_colli_id` | Colli v2 link (nullable) |
| GRN | Middle | `qty_in_colly` / `qty_each_colly` | COLLI v1 packaging (takedown) |
| Item Stock | FK | `multisku_colli_id` | Availability in colli after Approve |
| GRN → PI | Inbound detail | `prepared_to_invoice_quantity` | Reserved by PI draft |
| GRN → PI | Inbound detail | `processed_to_invoice_quantity` | Finalized on PI approve |

Business rules: [requirement.md](./requirement.md).

---

## 8. PO qty & Colli v2

**Balance (unchanged):** `inBalance() = order_base − prepared_grn − processed_grn`

**Colli v2 (TO-BE):** assign Existing/New on detail; `MultiskuColli` generate via `code_identifier = COL`; Type from `ColliType` (Active; Default preselect — GAP-CT-01 / GAP-CIV2-05). Filter Existing = exact `warehouse` = header destination. Qty insert paths: `bulk_product_id ? 1 : in_balance`. Availability = Item Stock after Approve, not link-time.

**COLLI v1 (AS-IS until takedown):** auto middle row; `latest_colly`; async approve when middle exists; `is_colly` on ItemStock; cache `item_stock_status_formatted:{id}`. Files: `InboundColly.vue`, `StockMutationInboundColliImport`. GAP-CIV2-03/09 — behavior target = v2 replaces v1 UX; no code-change prescription.

---

## 9. Journal — Product COA Group type

`JournalProcess::stockInboundAutoJournal()`:

| Type | Stock ID? | Debit | Credit |
|------|-----------|-------|--------|
| Purchased / Manufactured | Yes | Inventory | Unbilled Goods |
| Fix Asset | Yes (`is_fix_asset`) | Assets | Unbilled Goods |
| Service | No | Operational Expense | Unbilled Goods |

**Amount:** `each_price_before_vat` (dari PO, max 4dp) × qty base — **tanpa** baris VAT. Sumber rounding: [PO technical §5](../supplychain-purchase-order/technical.md#5-pricing--decimal-precision-etm-15313--rounding-sot-27-jul).

Config `inbound-with-unbilled-goods=false` → Credit AP on supplier. Tax lines deferred to Purchase Invoice (`supplierInvoiceAutoJournal` clears Unbilled + Dr VAT + Cr AP).

---

## 10. Import & Config

| Import | Class |
|--------|-------|
| Standard | `StockMutationInboundImport` |
| COLLI v1 | `StockMutationInboundColliImport` → job; qty = colli × isi (**takedown**) |
| Colli v2 TO-BE | 1 column numbering / existing code / empty (GAP-CIV2-02) |

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
| Linked to colli — cannot delete | detail destroy (v1 middle) |
| WH mismatch existing colli | assign / import v2 |
| > 10.000 details | approve |
| Concurrent import blocked | upload |

---

## 12. Frontend Behaviors

| Behavior | Note |
|----------|------|
| Create open/draft | Status radio |
| Header lock after details | Supplier, WH, date |
| Group view | AS-IS v1 COLLI column; TO-BE Colli code + Existing/New |
| Item Stock Status % | Async COLLI v1 progress |
| Colli v2 toolbar / modal / inline | GAP-CIV2-03 — parity InventoryIn + PurchaseInbound |
| Void dialog | Present but BE rejects (GAP-PI-01); void × colli deferred GAP-CIV2-08 |
| BETA datalist | `from_menu=newInobound` (typo preserved) |

---

## 13. Tests & QA Notes

1. Standard approve → sync stock + journal  
2. Colli v2: 3 SKU New Colli → 1 COL; Existing WH mismatch reject  
3. Delete draft inbound → new COL gone if never Approved  
4. AS-IS v1: COLLI 300+ koli → async; job fail → open + re-approve  
5. PO partial/full transitions  
6. Serial 51st blocked  
7. Service → no ItemStock; Fix Asset → Assets debit  
8. Void UI → API rejection (GAP-PI-01)

---

## 14. Known Issues

| ID | Issue |
|----|-------|
| GAP-PI-01 | Void UI broken — BE rejects void |
| GAP-PI-02 | Close not functional on GRN header |
| GAP-PI-03 | BETA + legacy two UIs same API |
| GAP-PI-06 | Unapprove production/local only |
| GAP-PI-07 | `from_menu=newInobound` typo |
| GAP-CIV2-01…09 | Colli v2 lifecycle, import, UI, WH filter, Default Type, Multisku docs, EN messages, void deferred, v1 takedown |
| DEV-PI-01…05 | Wire void/close; ClosedDialog; unapprove policy; typo; journal deep links |

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
| Colli Type | [../supplychain-colli-type/technical.md](../supplychain-colli-type/technical.md) |
| Legacy UI | [../supplychain-mutation-inbound/technical.md](../supplychain-mutation-inbound/technical.md) |
