---
doc_type: technical
menu: accounting-product-coa-group
menu_name: "Product COA Group"
version: 2.0
last_updated: 2026-08-05
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Product COA Group — Technical Documentation

> **Review** — AS-IS 2026-08-05. Behavior: [requirement v2.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2026-08-05 | QA - Yemima | Controller, slots, propagate job, JournalProcess mapping, gaps; Default = company-wide |

---

## 1. File Map

| Layer | Path |
|-------|------|
| Controller | `Modules/Accounting/Http/Controllers/ProductCoaGroupController.php` |
| Entities | `ProductCoaGroup`, `ProductCoaGroupDetail`, `TransactionCoaList` |
| Product copy | `ProductAccounting` + `Product::product_coa_name($slot)` |
| Job | `Modules/SupplyChain/Jobs/ProductCoaGroupProductAccountingJob` |
| Journal | `app/Helpers/Accounting/JournalProcess.php` |
| Routes | `accounting/product-coa-group` + select2-* COA filters |
| FE | `olshoperp-frontend/src/pages/Accounting/master/ProductCoaGroup/{DataList,Form}.vue` |

---

## 2. Default & header rules (AS-IS)

```php
// store: setting default clears ALL company defaults (not scoped by type)
ProductCoaGroup::where('owned_by', $companyId)->update(['is_default' => 0]);
```

- **1 default per company** across all Types.  
- Update: cannot inactive while default; cannot clear last default.  
- Type change involving Fix Asset blocked if products used on Sales Order.

---

## 3. Slot validation

- Loop `transaction_coa_list_id`: empty COA → error **except** name `Return Expense` (skipped).  
- Hide `Purchase Return` from selectable lists (`whereNot('name', 'Purchase Return')`).  
- Reject Current Profit/Loss COA; reject inactive/missing COA.  
- Cash/Bank exclusion: **not implemented** (GAP-PCG-03).

---

## 4. Propagate on edit

`ProductCoaGroupProductAccountingJob::dispatch` after COA store on create/update — async re-copy to products bound to the group. Race: approve mid-sync may briefly see old mapping `[VERIFY residual]`.

---

## 5. JournalProcess — slot usage (verified samples)

| Slot name | Used when |
|-----------|-----------|
| `Sales` | SI (and Sales Return invoice path uses Sales, not "Sales Return") |
| `Sales Return` | **No** `product_coa_name('Sales Return')` hit found |
| `Inventory` / `COGS` / `Operational Expense` / `Return Inventory` / `Work In Progress` | Outbound / Inbound / Assembly branches |
| `Inventory Adjustment` | `is_inventory_adjustment` mutations (opname/deduction/addition) |
| `Return Expense` | Lost-items style deduction — hard fail if missing |
| `Unbilled Goods` / `Assets` | Inbound / Fix Asset inbound |
| Depreciation* | **Not** found in JournalProcess |

Purchase Return journals lean on company COAs (e.g. Deposit of Purchase Return) + existing inventory/unbilled patterns — dedicated PCG slot hidden (GAP-PCG-01).

---

## 6. Coefficient / DPP for Sales journal

When Tax `coefficient` ON: UI may show paper 12% DPP; **posted Sales (and similar) journal amount must use effective 11% DPP** so Dr=Cr. Documented as GAP-PCG-02 vs Tax SoT §6.1 wording.

---

## 7. Invariants & failure modes

- Required slots filled before transactional approve (else Configure COA).  
- Service/Fix Asset blocked from inventory adjustment menus.  
- Instant Settlement retries use **current** `product_coa_name`, not failure-time snapshot.  
- Parent SKU: one `product_coa_group_id` for all variants.

---

## 8. Known Issues

[requirement §11](./requirement.md#11-gap-registry).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Tax | [../accounting-tax/technical.md](../accounting-tax/technical.md) |
