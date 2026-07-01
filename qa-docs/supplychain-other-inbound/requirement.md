---
doc_type: requirement
menu: supplychain-other-inbound
menu_name: "Other Inbound"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Other Inbound — Requirement Detail

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

**Modul:** SupplyChain  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** AS-IS

---

## 1. Fungsi & Tujuan

**Other Inbound** adalah subset `StockMutationInbound` tanpa supplier dan tanpa PO. Scope datalist:

```text
warehouse_origin IS NULL
warehouse_destination IS NOT NULL
supplier_id IS NULL
is_inventory_adjustment = 0
is_return_process = 0
type IS NULL
```

`OtherInboundController` hanya handle **index, show, export**. Create/update/approve/detail memakai **`StockMutationInboundController`** dan **`StockMutationInboundDetailController`** dengan parameter internal `other=true` (programmatic) atau detail path tanpa PO (UI).

---

## 2. How It Works — Alur Kerja

### 2.1 Inbound types comparison

```mermaid
flowchart TB
    subgraph Purchase["Purchase Inbound"]
        PI["supplier_id NOT NULL"]
        PO["Outstanding PO detail"]
    end
    subgraph Other["Other Inbound"]
        OI["supplier_id NULL"]
        PRD["Product direct +\neach_price_before_vat"]
    end
    subgraph Adjustment["Adjustment Addition"]
        AI["is_inventory_adjustment=1\ncode AI"]
    end

    PI --> PO
    OI --> PRD
```

### 2.2 Auto-generate from Work Order

`WorkOrderApprovalJob` (Assembly):

1. Cari inbound open dengan `transaction_reference_class = WorkOrder`, `supplier_id = null`.
2. Jika tidak ada → `StockMutationInboundController@store($request, with_auth: false, other: true)`.
3. Create detail via inbound detail store dengan harga dari outbound component cost.
4. Link ke Work Order detail via `stock_mutation_ids`.

### 2.3 Manual detail (UI)

`InventoryOther/DatalistDetail.vue`:

- `POST mutation-inbound/{id}/mutation-inbound-detail` tanpa `purchase_order_detail_id`.
- Backend: path `generateDetail()` (bukan `generateDetailOther` kecuali `$other=true` internal).
- Input harga manual di form detail other inbound.

### 2.4 Approval

Identik purchase inbound: `POST mutation-inbound/{id}/approve` → `ItemStockMutation::approveInbound()`.

Tidak ada update PO qty.

---

## 3. Validasi yang Berjalan

### 3.1 Header (store with other=true)

| Field | Rule |
|-------|------|
| `warehouse_destination` | Required |
| `transaction_date` | Required; ≤ today |
| `supplier_id` | NULL (other scope) |
| `is_inventory_adjustment` | 0 (when other=true + no customer) |
| Code | Prefix `IN` |
| Fiscal period | When with_auth |

### 3.2 Detail (non-PO path)

| Field | Rule |
|-------|------|
| `product_id` | Required (no PO/outbound ref) |
| `quantity` | Required numeric; whole number |
| `quantity_unit_id` | Required |
| `each_price_before_vat` | Set on other path (`generateDetailOther`) |
| `batch_number` / `expired_date` | Per product config |
| Bundle check | Skipped when other=true on product path |

### 3.3 Datalist scope

`OtherInboundController@index` → delegates to `StockMutationInboundController@index(other: true)`:

- Adds `whereNull(supplier_id)` filter
- Link formatting → `/supplychain/other-inbound/edit/{id}`

### 3.4 Export

| Endpoint | Behavior |
|----------|----------|
| `GET other-inbound/export-excel` | Batch export via `OtherInboundExportJob` |
| Filter types | With details / Without details / Active page |

---

## 4. Relasi Menu Lain

```mermaid
flowchart LR
    WO["Work Order / Assembly"]
    OI["Other Inbound"]
    ST["ItemStock"]

    WO -->|"WorkOrderApprovalJob\nstore other=true"| OI
    OI -->|"approveInbound"| ST
```

| Menu | Relasi |
|------|--------|
| Assembly | Auto-create other inbound + detail |
| Purchase Inbound | Shared mutation-inbound API |
| Journal (Accounting) | JournalProcess links to other-inbound edit URL |

---

## 5. Known Gaps / Open Questions

| ID | Gap |
|----|-----|
| G-01 | `OtherInboundController` resource route declares CRUD but **store/update/destroy not implemented** in controller — UI uses `mutation-inbound` for mutations |
| G-02 | `InventoryOther/Form.vue` — header fields disabled; **no `submit()` method** in script (create flow perlu verifikasi QA manual) |
| G-03 | Detail store from UI does not pass `$other=true` — uses `generateDetail()` without PO (works but different code path vs `generateDetailOther`) |
| G-04 | `routes.md` lists `OtherInboundController@store` — may be stale vs actual controller |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| New Purchase Inbound | [../supplychain-new-purchase-inbound/requirement.md](../supplychain-new-purchase-inbound/requirement.md) |
