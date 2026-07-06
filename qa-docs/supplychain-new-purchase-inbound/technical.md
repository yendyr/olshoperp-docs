---
doc_type: technical
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ./knowledge-base.md
  - ../supplychain-mutation-inbound/technical.md
---

# Purchase Inbound (GRN) — Technical Documentation

**UI route (BETA):** `/supplychain/new-purchase-inbound`  
**API base:** `{VITE_API_URL}supplychain/mutation-inbound`  
**Controller:** `StockMutationInboundController`  
**Detail:** `StockMutationInboundDetailController`  
**Middle (COLLI):** `StockMutationInboundMiddleDetailController`

---

## 1. Entity & scope filter

`StockMutationInbound` extends `StockMutation` on `scm_stock_mutations`:

```php
// StockMutationInboundController@index
->whereNotNull('supplier_id')
->whereNull('type')
->where('is_inventory_adjustment', 0)
->where('is_return_process', 0);
```

Detail: `InboundMutationDetail` → `scm_inbound_mutation_details` with `purchase_order_detail_id`.

Middle: `InboundMutationMiddleDetail` → `scm_inbound_mutation_middle_details` (`qty_in_colly`, `qty_each_colly`, `qty_each_colly_unit_id`).

---

## 2. Frontend File Map

| File | Role |
|------|------|
| `SCM/Inbound/PurchaseInbound/DataList.vue` | Header datalist |
| `SCM/Inbound/PurchaseInbound/Form.vue` | Create/edit |
| `SCM/Inbound/PurchaseInbound/DatalistDetail.vue` | Detail grid (flat) |
| `SCM/Inbound/PurchaseInbound/DatalistDetailGroup.vue` | Detail grid (group + COLLI column) |
| `SCM/Inbound/PurchaseInbound/InboundColly.vue` | COLLI inline edit component |
| `OutstandingPurchaseOrderDetail.vue` | Outstanding PO panel |

**Router:** `src/router/index.ts` L1307–1339 → `new-purchase-inbound`

**View toggle:** `groupView` in Form.vue — `DatalistDetail` vs `DatalistDetailGroup`

---

## 3. API Routes (key)

| Method | Path |
|--------|------|
| CRUD | `supplychain/mutation-inbound` |
| Approve | `POST …/{id}/approve` |
| Unapprove | `GET …/unapprove/{id}` (dev/local) |
| Print | `GET …/{id}/print`, `/print-rir` |
| Export | `GET …/export-excel`, `/export-file`, `/export-progress` |
| Outstanding | `GET …/{id}/mutation-inbound-detail/outstanding` |
| Detail CRUD | `…/mutation-inbound-detail/*` |
| Middle CRUD | `…/middle/*` |
| Import | `POST …/mutation-inbound-detail/upload` |
| Import log | `…/import-log`, `/import-history` |

Full list: `Modules/SupplyChain/Routes/api.php` L234–293

---

## 4. PO qty chain

```php
// PurchaseOrderDetail::inBalance()
order_quantity_in_base_unit - prepared_to_grn_quantity - processed_to_grn_quantity
```

| Event | Field |
|-------|-------|
| Detail add | `prepared_to_grn_quantity` ↑ |
| Detail delete | `prepared_to_grn_quantity` ↓ |
| Approve | prepared ↓, `processed_to_grn_quantity` ↑ |

PO observer: partial → `processed`; full all lines → `complete`.

---

## 5. COLLI technical flow

### 5.1 Middle detail create/update

`StockMutationInboundMiddleDetailController`:
- Auto-creates middle row on detail add
- `latest_colly` column: last middle detail same product_id, converted unit, `floor()`

### 5.2 FE auto-fill (`InboundColly.vue`)

```javascript
if (qty_in_colly > 0) {
  if (qty_in_colly * latest_colly <= outstanding_po_qty + quantity)
    item.qty_each_colly = latest_colly;
  else
    item.qty_each_colly = 1;
}
```

### 5.3 Approve async path

`StockMutationInboundController@approve`:
- If middle details exist → dispatch `ApproveInboundJob`
- Job chunks `GenerateItemStockChunkJob` (200 detail IDs/chunk)
- `ItemStock.isFloor` with `is_colly = (middle_detail.qty_in_colly > 0)`

### 5.4 Job failure (`ApproveInboundJob::handleFailed`)

- Revert header to `open`
- Delete partial ItemStock, journal, approval record
- Toast notification to creator
- User re-clicks Approve

### 5.5 Progress UI

`item_stock_status_formatted` column — cache key `item_stock_status_formatted:{id}`

---

## 6. Approve sync path

`ItemStockMutation::approveInbound()`:
- Creates `ItemStock` per detail **kecuali** `ProductCoaGroup.type == 'Service'`
- `each_price_before_vat` from PO line
- Fix Asset: `is_fix_asset = true` on ItemStock (`product->isFixAsset()`)
- Service: skip stock block entirely (L401); journal still posted
- `StockAfterApproveHandler` for ending balance jobs

---

## 7. Journal — Product COA Group type matrix

`JournalProcess::stockInboundAutoJournal()` L254–294:

| `ProductCoaGroup.type` | Debit COA field | Credit COA field | Stock |
|------------------------|-----------------|------------------|-------|
| `Purchased Item` | Inventory | Unbilled Goods | ✅ |
| `Manufactured Item` | Inventory | Unbilled Goods | ✅ |
| `Fix Asset` | **Assets** | Unbilled Goods | ✅ |
| `Service` | **Operational Expense** | Unbilled Goods | ❌ |

Constants: `ProductCoaGroup::PRODUCT_TYPE_*` in `Modules/Accounting/Entities/ProductCoaGroup.php`.

| Config | Effect |
|--------|--------|
| `inbound-with-unbilled-goods=true` | Credit Unbilled Goods COA (all types) |
| false | Credit AP COA on supplier |

Tax lines commented — deferred to Supplier Invoice L298–307.

Currency: first detail PO `current_primary_currency_id`.

---

## 8. Import classes

| Class | File |
|-------|------|
| Standard | `StockMutationInboundImport.php` |
| COLLI | `StockMutationInboundColliImport.php` → `InboundDetailImportColliJob` |

Colli rule: `inbound_qty = colli × colli_qty`

---

## 9. Config keys

| Key | Value |
|-----|-------|
| `general.max_child_10000` | 10000 max detail rows |
| `StockMutation::LIMIT_CREATE_SERIAL_NUMBER` | 50 |
| `accounting.inbound-with-unbilled-goods` | true default |
| `upload.size.file` | attachment max |

---

## 10. Validation catalog (selected)

| Message | Source |
|---------|--------|
| `Transaction date cannot be greater than today.` | store/update |
| `Input Quantity exceeds Outstanding PO. Max allowed: {n}` | detail store |
| `Approval in progress, please wait a moment.` | async approve |
| `{code} has failed to be approved` | ApproveInboundJob fail toast |
| `Data cannot be deleted because it is already linked to colli data.` | detail destroy |
| `This transaction have more than 10.000 details.` | approve validate |

---

## 11. Testing Notes

1. Standard approve → sync stock + journal
2. COLLI 300+ koli → async job completes without timeout
3. Job fail simulation → open status + re-approve
4. PO partial/full status transitions
5. Serial 51st row blocked
6. Import colli template validation
7. Void dialog → expect API rejection (regression GAP-PI-01)
8. `latest_colly` when last isi > outstanding → defaults 1
9. Service SKU → no ItemStock; journal Dr Operational Expense
10. Fix Asset SKU → ItemStock `is_fix_asset=1`; journal Dr Assets COA

---

## 12. Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Legacy menu technical | [../supplychain-mutation-inbound/technical.md](../supplychain-mutation-inbound/technical.md) |
| Purchase Order | [../supplychain-purchase-order/technical.md](../supplychain-purchase-order/technical.md) |
| ItemStockMutation | `app/Helpers/SupplyChain/ItemStockMutation.php` |
| JournalProcess | `app/Helpers/Accounting/JournalProcess.php` |
