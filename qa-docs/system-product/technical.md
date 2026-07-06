---
doc_type: technical
menu: system-product
menu_name: "System Product"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# System Product — Technical Documentation

## 1. Architecture Overview

SCM master product module. Single table `scm_products` with type discrimination via `productTree`, bundle via `billOfMaterial`, assembly via separate `is_bom=1` Header BOM.

Three controller entry points share `ProductController` logic with different `typeProduct`:

| Controller | `typeProduct` | Route prefix |
|------------|---------------|--------------|
| `ProductController` | `Product` (default) | `supplychain/product` |
| `ProductGeneralConfigurationController` | `general` | `supplychain/product-general-configuration` |
| `ProductInventoryConfigurationController` | `inventory` | `supplychain/product-inventory-configuration` |

Photos/video/detail merge via `ProductDetailController` / `ProductGeneralDetailController` (`type=general` in constructor).

---

## 2. Frontend File Map

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/SCM/master/Product/DataList.vue` | List wrapper |
| `olshoperp-frontend/src/pages/SCM/master/Product/components/DatalistProductComponent.vue` | Columns, import/export, bulk actions |
| `olshoperp-frontend/src/pages/SCM/master/Product/Form.vue` | Create/edit shell |
| `olshoperp-frontend/src/pages/SCM/master/Product/components/FormProductComponent.vue` | Main form (~5.5k lines): basic, unit, D&W modal, variant, bundle, shipping, tax |
| `olshoperp-frontend/src/pages/SCM/master/Product/BundleProductForm.vue` | Bundle detail per variant accordion |
| `olshoperp-frontend/src/pages/SCM/master/Product/VariantUpdateForm.vue` | Variant child edit modal |
| `olshoperp-frontend/src/pages/SCM/master/Product/components/InventoryManagement.vue` | Inventory flags accordion |
| `olshoperp-frontend/src/pages/SCM/master/Product/components/TaxConfig.vue` | Sales/purchase tax inline |
| `olshoperp-frontend/src/utils/imports.ts` | Import type constants & endpoints |

**Routes (Vue router):** `supplychain_product_index`, create/edit form routes under `/supplychain/product`.

> **Legacy path in old docs:** `src/pages/SupplyChain/Product/**` — **incorrect**. Use `SCM/master/Product/**`.

---

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/SupplyChain/Http/Controllers/ProductController.php` | CRUD, index datalist, select2, import, status, `checkTransaction()` |
| `Modules/SupplyChain/Http/Controllers/ProductGeneralConfigurationController.php` | General mode wrapper |
| `Modules/SupplyChain/Http/Controllers/ProductInventoryConfigurationController.php` | Inventory mode wrapper |
| `Modules/SupplyChain/Http/Controllers/ProductSpecificationController.php` | Spec, variant columns, sales fields, barcode |
| `Modules/SupplyChain/Http/Controllers/ProductVariantController.php` | Variant generation, activate |
| `Modules/SupplyChain/Http/Controllers/ProductDnWController.php` | D&W profiles per unit (`is_unit_default`, `is_platform_default`, `is_trx_default`) |
| `Modules/SupplyChain/Http/Controllers/ProductDetailController.php` | Photos & video upload |
| `Modules/SupplyChain/Http/Controllers/BillOfMaterialController.php` | Bundle detail validation (`is_bom=0`) |
| `Modules/SupplyChain/Entities/Product.php` | Model, stock: `getAvailability()`, `getOnHand()`, `getATS()`, bundle min helpers |
| `Modules/SupplyChain/Routes/api.php` | Route registration |
| `Modules/OmniChannel/Http/Controllers/SalesOrderDetailController.php` | Bundle pricing split Case A/B |

**Import classes:** `ProductImport`, `UpdateProductImport`, `InsertProductRandomImport`, etc. — dispatched from `ProductController@importExcel`.

---

## 4. API Endpoints (key)

Prefix varies by mode; examples for **full** menu:

| Method | Path | Handler |
|--------|------|---------|
| GET | `/api/supplychain/product` | `@index` — PrimeVue datalist |
| POST | `/api/supplychain/product` | `@store` |
| GET | `/api/supplychain/product/{id}` | `@show` — includes `can_update_sku`, `primary_unit_disabled` |
| PUT | `/api/supplychain/product/{id}` | `@update` |
| DELETE | `/api/supplychain/product/{id}` | `@destroy` |
| POST | `/api/supplychain/product/{id}/detail` | Photo/video (`ProductDetailController`) |
| GET/POST | `/api/supplychain/product/{id}/dnw/*` | D&W profiles |
| GET | `/api/supplychain/product/{id}/specification/variant-column` | Dynamic variant columns |
| POST | `/api/supplychain/product/import-excel` | Import dispatch |
| GET | `/api/supplychain/product/download-template` | New product template |
| GET | `/api/supplychain/product/progress` | Import progress |

Full route list: `docs/api/supply_chain/routes.md`

---

## 5. Data Model

### 5.1 Product types

| UI Type | Detection | Transactable |
|---------|-----------|--------------|
| SINGLE | No parent in `productTree` | Yes |
| PARENT | `productTree` parent row | No |
| VARIANT child | `productTree` child | Yes |
| Bundle | `billOfMaterial` header, `is_bom=0` | SO only |

### 5.2 D&W schema (per unit)

Entity chain: `Product` → `ProductUnit` (primary/alternate) → `ProductDnW` profiles.

Flags per profile:

- `is_unit_default` — one per unit  
- `is_platform_default` — one global per product  
- `is_trx_default` — one global per product  
- `is_primary` — first profile on primary unit  

Default on create: 1×1×1×1 dimensions; seed tax from `DefaultVat`.

### 5.3 Bundle BoM

Table: bill of material header/detail pivot. Validation in `BillOfMaterialController::validateBundle()` — invalid if 0 lines or 1 line qty=1; random SKUs exempt.

---

## 6. Stock Calculations

### 6.1 Non-bundle (`Product.php`)

```php
// Availability: sum item_stocks.available_quantity with unit conversion
// On Hand: sum ending_stocks.on_hand_stock
// ATS: globalAtsStock
```

### 6.2 Bundle

```php
// Availability: floor(min(child_availability / bom_qty))
// getMinAvailabilityChild(), getMinOnHandChild(), getMinGlobalAtsChild()
```

### 6.3 Datalist cache

Index formats cache 1 minute:

- `product-availability-{id}`  
- `product-onhand-{id}`  
- `product-ats-{id}`  

---

## 7. D&W per Unit — Implementation Notes

**Refactor date:** 7 Mei 2026 (artifact v1.0).

| Artifact requirement | Code location | Status |
|---------------------|---------------|--------|
| Unit Configuration section | `FormProductComponent.vue` L941–1193 | ✅ |
| D&W modal per unit | L1937–2116 | ✅ |
| 3 radio defaults | `ProductDnWController` L48–155 | ✅ |
| D&W removed from Shipping | L1205 comment | ✅ |
| D&W Default Summary cards | — | ❌ Not in main form |
| All D&W flat table | — | ❌ Modal only |

**Platform/Trx global exclusivity:** enforced in FE modal + BE on save.

---

## 8. Variant Generation

`ProductVariantController.php`:

- SKU format: `{parent}-{opt1}`, `{parent}-{opt1}-{opt2}`, three segments for 3 types  
- Random option → `-random` suffix segment  
- Max 3 types: FE guard only (`Object.keys(variant_options).length <= 2` blocks 4th)

Variant columns API: `ProductSpecificationController@indexPrimevue` + `@variantColumn`.

---

## 9. Bundle Pricing (Sales Order)

`SalesOrderDetailController.php` ~L1195–1265:

**Case B** (all retail 0):

```php
$price = $header_price / count($details);
```

**Case A** (some retail > 0):

```php
$percent = $price_total_row / sum(retail * qty);
$final = $percent * $header_price;
```

Alternate VAT path ~L1572–1594 uses `price_before_vat / total_price`.

Random lines: `SalesOrderDetailRandom` created for random children ~L1596–1617.

---

## 10. Validation Messages (QA scripts)

| Context | Message |
|---------|---------|
| SKU duplicate (create) | `The sku has already been taken.` |
| Random in SKU | `Random sku is not allowed` |
| Primary unit lock | `Primary unit cannot be updated because product has relation to transaction` |
| Bundle invalid | `Detail Bundle requires at least 2 items or 1 item with qty > 1` |
| Inactive with stock | (availability/ATS check in `updateStatusProduct`) |

---

## 11. Import Pipeline

`ProductController@importExcel` L3173–3245:

- Max **5000** rows L3190–3196  
- Types: `new`, `update`, `bundle`, `insert_random`, `insert_alternative_unit`, `update_variant_product`, `bulk_update_vat`  
- SKU scoped: `where('sku')->where('owned_by', $company_id)` in import classes  
- Progress/history endpoints for UI polling  

Import disabled on general/inventory datalists: `has_import_history = false`.

---

## 12. Transaction Immutability

`ProductController::checkTransaction()` L2468+ — returns false (locked) if product has:

- PR detail, PO detail, BoM detail, inbound detail, outbound detail  

**Not checked:** SO, assembly, transfer internal.

Fields affected:

- `can_update_sku`  
- `primary_unit_disabled`  
- Alternate unit `haveRelations()`  

---

## 13. Config & Constants

| Key | Value / usage |
|-----|---------------|
| `config('upload.size.video')` | 20480 KB |
| `Product::COND_NEW` | `'Brand New'` |
| `Product::COND_SECOND` | `'Second-hand'` |
| `Product::INSURANCE_REQUIRED/OPTIONAL` | Shipping insurance |
| `config('general.max_child')` | Used in other modules; product import max 5000 |

---

## 14. Testing Notes

1. **Datalist:** assert combined column + cache refresh after inbound  
2. **D&W:** set Platform Default on alternate unit → verify global uncheck on primary  
3. **Bundle:** activate with 1×qty2 vs 2×qty1 vs invalid 1×qty1; verify Accounting & Tax accordion **hidden** when bundle ON (`FormProductComponent.vue` `!enable_bundle`)  
4. **Variant:** 3 types FE block; BE accepts 4th if API called directly (regression)  
5. **Create SKU duplicate:** test same SKU different `owned_by` (GAP-SP-01)  
6. **Video:** upload mp4 ✓, mkv ✗, mov ✓  
7. **Import:** 5001 rows rejected  
8. **Inactive:** blockquote > 0 blocked  

---

## 15. Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Bill of Material | [../bill-of-material/technical.md](../bill-of-material/technical.md) |
| Random SKU | [../random-sku/technical.md](../random-sku/technical.md) |
| D&W Label master | [../supplychain-dimension-and-weight-label/technical.md](../supplychain-dimension-and-weight-label/technical.md) |
| Sales Order bundle runtime | [../sales-order-general/technical.md §9](../sales-order-general/technical.md#9-product-bundle--proporsi-harga-file-map) |
| DB schema | `docs/db-schema/supply_chain/scm_products.md` (if exists) |

---

## 16. Bundle pricing (cross-module)

Distribusi harga bundle di **Sales Order** (bukan di System Product form):

| Topic | Location |
|-------|----------|
| Requirement §11 | [requirement.md §11](./requirement.md#11-bundle-pricing-distribution-sales-order--to-be) |
| SO requirement §10 | [../sales-order-general/requirement.md §10](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat) |
| Canonical BE | `SalesOrderDetailController::pickBundleChildren()` (OmniChannel) |

Parent bundle: **no tax config** in SP UI when bundle toggle ON — tax resolved per BoM child at SO time.
