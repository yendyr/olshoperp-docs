---
doc_type: technical
menu: system-product
menu_name: "System Product"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# System Product — Technical Documentation

## 1. Architecture Overview

SCM master product module. Single table `scm_products` with type flags (single, variant parent/child, bundle). Configuration split across general vs inventory controllers.

## 2. Frontend

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/SupplyChain/Product/DataList.vue` | Product list |
| `olshoperp-frontend/src/pages/SupplyChain/Product/Form.vue` | Create/edit tabs |
| Variant/bundle/BOM sub-forms | Under Product form sections |

**Routes:** `supplychain_system-product_index`, `create_system-product_form`, `edit_system-product_form`

## 3. Backend

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/ProductController.php` | Core product CRUD |
| `Modules/SupplyChain/Http/Controllers/ProductGeneralConfigurationController.php` | General config, import/export |
| `Modules/SupplyChain/Http/Controllers/ProductGeneralVariantController.php` | Variant generation |
| `Modules/SupplyChain/Http/Controllers/ProductGeneralDetailController.php` | Bundle detail |
| `Modules/SupplyChain/Http/Controllers/ProductInventoryConfigurationController.php` | Inventory flags |
| `Modules/SupplyChain/Entities/Product.php` | Eloquent model (`scm_products`) |
| `Modules/SupplyChain/Routes/api.php` | `product-general-configuration/*` routes |

**Related menus:**
- [bill-of-material](../bill-of-material/) — BOM header/detail APIs under `product-general-configuration/bill-of-material/*`
- [random-sku](../random-sku/) — `-random` SKU generation in variant controller

## 4. API (prefix)

`/api/supplychain/product-general-configuration/*`

Key endpoints: product list, store, variant activate, bundle detail, BOM routes, import/export Excel.

Full list: `docs/api/supply_chain/routes.md`

## 5. Product types (data model)

| Type | `product_type` / flags | Transactable |
|------|------------------------|--------------|
| Single | SINGLE | Yes |
| Variant parent | VARIANT parent | No (wrapper only) |
| Variant child | VARIANT child | Yes |
| Bundle | bundle flags | Yes (sales only) |

## 6. Stock calculations

Displayed columns computed server-side:

- **Availability** = Inbound − Used − All Reserved
- **On Hand** = Inbound − Transfer Out (approved) − Used − Transfer In (in transit)
- **ATS** = On Hand − Outstanding SO − Reserved Out

Method: `Product::getATS()`, warehouse-scoped queries.

## 7. Bundle pricing (order time)

Proportional distribution when bundle has retail prices; equal split when component price = 0. See requirement.md §3.C.

## 8. DB schema docs

- `docs/db-schema/supply_chain/scm_products.md` (if exists)
- Related: `scm_product_trees`, bundle pivot tables

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Bill of Material | [../bill-of-material/knowledge-base.md](../bill-of-material/knowledge-base.md) |
| Random SKU | [../random-sku/knowledge-base.md](../random-sku/knowledge-base.md) |
