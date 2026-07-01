---
doc_type: technical
menu: random-sku
menu_name: "Random SKU"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
cross_menu: true
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Random SKU — Technical Documentation

## 1. Data Model

| Entity | Flag / table | Notes |
|--------|--------------|-------|
| `VariantOption` | `is_random` (tinyint) | Set when option name = `random` |
| `Product` (scm) | `is_random` | Generated SKU e.g. `PREFIX-random` |
| `SalesOrderDetailRandom` | `omni_sales_order_detail_randoms` | Platform SO random lines |
| `scm_variant_options.is_random` | DB column | Schema doc available |

## 2. Generation

| File | Role |
|------|------|
| `VariantOptionController.php` | Sets `is_random = 1` when option is `random` |
| `ProductVariantController.php` | Generates variant SKUs including `-random` suffix |
| `ProductSpecificationController.php` | Variant spec flow (random checks commented in places) |

**Naming:** `generateRandomCode()` used in variant SKU generation paths.

## 3. Fulfillment — auto-pick sibling

| File | Function | Role |
|------|----------|------|
| `app/Helpers/SupplyChain/WarehouseHelper.php` | `getFifoProductRandom()` | FIFO pick among siblings excluding random options |
| | `getFifoProductRandomV2()` | V2 with fixed option support |
| | `randomizeVariants()` | Distribute qty across variant stocks |

**Logic summary:**
1. Resolve sibling product IDs from product tree
2. Exclude variants with `random` option IDs
3. Filter `ItemStock` by warehouse parent hierarchy + `available_quantity` threshold
4. Pick highest available (FIFO by `transaction_date`)

**Callers:** Wave/picking flows, `ManualPickingListDetailController`, `PicklistService`

## 4. Platform binding

| File | Behavior |
|------|----------|
| `ProductController::binding()` | Random system product requires confirmation |
| `CanAutoBind.php` | Optional `-random` → `-acak` SKU mapping (`config('omni.random_is_acak')`) |

## 5. Restrictions in code

| Area | Check |
|------|-------|
| `StockOpnameDetailController` | Blocks random product stock ops |
| `ItemStockObserver` | Skips random products |
| `ProductBenchmarkPriceJob` | Excludes random variant options |
| BOM controllers | Random excluded from header/detail |

## 6. Order platform

| Entity | Field |
|--------|-------|
| `SalesOrderDetail` | Normal lines with `product_id` |
| `SalesOrderDetailRandom` | Random-specific lines |
| `UpdateOrderDetailOnProductBindJob` | Backfill after bind |

## 7. Config

```php
// config/omni.php
'random_is_acak' => true  // auto-bind maps -random ↔ -acak
```

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Bill of Material | [../bill-of-material/requirement.md](../bill-of-material/requirement.md) |
