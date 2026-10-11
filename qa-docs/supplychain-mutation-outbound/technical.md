---
doc_type: technical
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
version: 2.0
last_updated: 2026-10-11
owner: QA - Yemima
status: review
aliases: [outbound external API, StockMutationOutbound, InventoryOut]
---

# Outbound External — Technical Documentation

**API prefix:** `supplychain/mutation-outbound`  
**Behavior:** [requirement.md](./requirement.md) v2.0  
**Code prefix:** `OT-%` — `StockMutationOutbound` (destination null, non-adjustment, non-return)

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `Modules/SupplyChain/Http/Controllers/StockMutationOutboundController.php` |
| Detail | `StockMutationOutboundDetailController.php` |
| Entity | `Modules/SupplyChain/Entities/StockMutationOutbound.php` |
| Import | `Modules/SupplyChain/Import/StockMutationOutboundImport.php` |
| Approve stok | `app/Helpers/SupplyChain/ItemStockMutation.php` → `approveOutbound` |
| Journal | `app/Helpers/Accounting/JournalProcess.php` → `stockOutboundAutoJournal` |
| Assembly | `Modules/SupplyChain/Jobs/WorkOrderApprovalJob.php` |
| Settlement | `Modules/Accounting/Entities/Settlement.php`; `DeleteSettlementJob::deleteOutbound` |

### Frontend

| Layer | Path |
|-------|------|
| Pages | `olshoperp-frontend/src/pages/SCM/StockMutation/InventoryOut/` |
| | `DataList.vue`, `Form.vue`, `AvailableWarehouse.vue` |
| | `DatalistDetail.vue`, `DatalistDetailGroup.vue`, `DatalistDetailBySO.vue` |
| Route | `/supplychain/mutation-outbound` (+ create/edit) |

---

## 2. API (utama)

| Method | Path | Action |
|--------|------|--------|
| GET | `mutation-outbound` | Index + SearchBuilder |
| POST | `mutation-outbound` | Store header |
| PUT/GET | `mutation-outbound/{id}` | Update / show |
| DELETE | `mutation-outbound/{id}` | Soft delete |
| POST | `…/{id}/approve` | Approve / reject |
| POST | `…/{id}/un-approve` | **Hanya local/development** |
| GET | `…/default-values` | Last `warehouse_origin`, `type_so` |
| GET/POST | export / import detail | With/without details; detail upload |

---

## 3. Database

Header: `scm_stock_mutations` (`StockMutationOutbound`).  
Detail: `scm_outbound_mutation_details` (+ middle-detail untuk group view).

| Field penting | Notes |
|---------------|-------|
| `type_so` | `sales order general` \| `other` (juga platform/POS di data generate) |
| `warehouse_origin` | 3PL filter UI for SO |
| `is_fifo` on detail | 1 fulfill/FIFO; 0 manual stock id |
| `prepared_to_do_quantity` / `processed_to_do_quantity` | DO Status column AS-IS |
| `generator_class` | Settlement / assembly chain |

---

## 4. Invariants

| ID | Rule |
|----|------|
| INV-OB-01 | UI: SO → `is_3pl=true`; Other → `is_3pl=false` (store API does not enforce) |
| INV-OB-02 | Approve → Cr Inventory; Dr OpEx / COGS / WIP by type/ref |
| INV-OB-03 | Production unapprove rejected; settlement delete may revert OT |
| INV-OB-04 | Import without `item_stock_id` → fulfill/`is_fifo=1` |
| INV-OB-05 | Modal/bulk use with `item_stock_id` → manual/`is_fifo=0` |

---

## 5. Journal mapping (approve)

| Condition | Debit COA (Product COA Group) |
|-----------|-------------------------------|
| `transaction_reference_class` WorkOrder | Work In Progress |
| `type_so` sales order* or ref SalesOrder | Cogs |
| Else (Other) | Operational Expense |

Credit: Inventory. Missing COA → validation exception.

---

## 6. Approve / generate notes

- `authorized=true` + header ref SalesOrder/SalesOrderGeneral → block approve message.
- Settlement/jobs call approve with bypass.
- `from_platform` / POS: datalist hides approve/delete/print.
- Auto SI: SO detail without prepared/processed invoice qty → `CustomerInvoiceHelper::autoGenerateFromSalesOrder`.
- Descriptions: Assembly `Auto generated from Assembly {code}`; Settlement `Auto Generated From Transfer {code}`.

---

## 7. Gaps (tech refs)

| ID | Note |
|----|------|
| GAP-OB-01 | DO column = Prepared/Processed; intended DO codes |
| GAP-OB-02 | No BE type↔3PL validation on store |
| GAP-OB-03 | Approve block rules — pending discussion |
| GAP-OB-04 | `unApprove` env-gated |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Instant Settlement technical | [../accounting-settlement-upload/technical.md](../accounting-settlement-upload/technical.md) |
