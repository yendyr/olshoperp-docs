---
doc_type: technical
menu: system-product
menu_name: "System Product"
version: 2.4
last_updated: 2026-09-01
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# System Product — Technical Documentation

> **2.4 (2026-09-01):** AS-IS **Product Image Sync** — `SyncProductImageJob`, `ExternalProductController@sync`, `scm_settings`, `is_synced` — [requirement §13.2](./requirement.md#132-product-image-sync-as-is--api-pull).

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
| `olshoperp-frontend/src/pages/SCM/master/Product/components/DatalistProductComponent.vue` | Columns, import/export, bulk actions, **Sync Product Images** + status poll |
| `olshoperp-frontend/src/pages/SCM/Setting/components/ProductImageSyncSetting.vue` | Config `product_sync_url` / `product_sync_api_key` (also embedded in Application Form) |
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
| `Modules/SupplyChain/Http/Controllers/ProductController.php` | CRUD, index datalist, select2, import, status, **`syncImages` / `syncImagesStatus`**, `checkTransaction()` |
| `Modules/SupplyChain/Http/Controllers/ExternalProductController.php` | M2M **`sync`** / `index` / `show` — provider path gambar by SKU |
| `Modules/SupplyChain/Http/Controllers/ScmSettingController.php` | PATCH `product_sync_url`, `product_sync_api_key` |
| `Modules/SupplyChain/Jobs/SyncProductImageJob.php` | Pull path gambar chunk 100 SKU → `scm_product_*_images` |
| `Modules/SupplyChain/Entities/ScmSetting.php` | Per-company SCM settings row |
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
| POST | `/api/supplychain/product/sync-images` | Queue `SyncProductImageJob` |
| GET | `/api/supplychain/product/sync-images/status` | Cache status `product_image_sync_{companyId}` |
| PATCH | `/api/supplychain/settings` | Field `product_sync_url` / `product_sync_api_key` |
| POST | `/api/supplychain/external-products/sync` | M2M provider (ability `external-product:read`) — body `{ product_ids: string[] }` |

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

- Max **5000** rows L3190–3196 (default product imports)  
- Types (AS-IS): `new`, `update`, `bundle`, `insert_random`, `insert_alternative_unit`, `update_variant_product`, `bulk_update_vat`  
- SKU scoped: `where('sku')->where('owned_by', $company_id)` in import classes  
- Progress/history endpoints for UI polling  

Import disabled on general/inventory datalists: `has_import_history = false`.

### 11.1 Import Product Images (TO-BE · GAP-SP-16)

| Item | Spec |
|------|------|
| FE | Add to `PRODUCT_IMPORT_OPTIONS` + `PRODUCT_DOWNLOAD_OPTIONS` — label **Import Product Images** |
| Template | `Template Import Product Images.xlsx` — columns **SKU Code**, **Image URL** (required headers red) |
| Max rows | **1000** (separate cap from 5000) |
| Job | Dedicated/throttled queue: download GDrive → validate → store; delay between downloads |
| Storage target | `ProductImage` (parent/single/bundle/random) or `ProductVariantImage` (variant child); set/replace `is_primary` |
| Replace | Update primary image blob/record only; leave non-primary rows |
| URL rules | Google Drive public only; detect 403/unlisted → English error (requirement §13.1) |
| Validation | MIME jpg/jpeg/png; size ≤ **20 MB** (align FE product photo); no dimension enforce |
| Duplicates | Pre-scan file: SKUs with count > 1 → fail all those rows; continue unique |
| Partial | Commit success rows; log failures |

Suggested classes: `ImportProductImagesImport` + `ImportProductImagesJob` (or equivalent under SupplyChain Import/Jobs).

### 11.2 Default Variant create/import/expand (TO-BE · GAP-SP-17 / GAP-SP-18)

| Area | Touch points (AS-IS → extend) |
|------|-------------------------------|
| Master Default | `scm_variants.is_default` (GAP-VAR-01) — create+default+1 option **skips** `random` inject in `VariantOptionController` |
| Create | `ProductController@store` + specification/variant store — if default ON and not enabling single path: create parent `sku-(PARENT)`, child `sku`, attach default variant/option |
| Import | `ProductImport` — Single-eligible rows apply same; skip explicit variant / parent-used SKUs |
| Expand block | `ProductSpecificationController` L102–104 hard-block — **remove/replace** with soft-delete vs leftover |
| Soft delete gate | `haveRelations()` / `ProductVariantController::checkRelations` — relation-only (not stock-only) |
| Naming | Omit default option segment when building child SKU from Default-origin products |
| FE | `FormProductComponent.vue` — confirm OFF→Single; confirm expand leftover; hide Default column in variant datatable |

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
| `config('upload.size.image')` | 512 KB (used elsewhere; **product photo UI** uses **20 MB** — Import Product Images follows **20 MB**) |
| Product photo max (FE) | 20 MB — `FormProductComponent.vue` |
| Import Product Images max rows | **1000** (TO-BE) |
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
7. **Import:** 5001 rows rejected (standard imports)  
8. **Import Product Images:** 1001 rows rejected; unpublic GDrive English error; duplicate SKU rows skipped; primary-only replace  
9. **Inactive:** blockquote > 0 blocked  
10. **Product Image Sync:** configure URL+key → job completes; `is_synced` rows match provider; manual images preserved; variant child merges `variant_images` by SKU

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

---

## 17. Product Image Sync (API pull — AS-IS)

Documented from codebase per 2026-09-01. Requirement: [§13.2](./requirement.md#132-product-image-sync-as-is--api-pull).

### 17.1 Flow

```
[FE] Sync Product Images
  → POST product/sync-images (auth:sanctum + company)
  → SyncProductImageJob::dispatch(company_id) on queue platform_product
  → chunk active Product owned_by company (100)
  → HTTP POST product_sync_url + Bearer product_sync_api_key
       body: { product_ids: [sku, ...] }
  → merge response data.products[] into scm_product_images / scm_product_variant_images
  → Cache status completed|failed
[FE] poll GET product/sync-images/status every 2s
```

### 17.2 Provider contract (`ExternalProductController@sync`)

- Route: `POST /api/supplychain/external-products/sync`
- Middleware: `token.ability:external-product:read` (no `auth_verified`)
- Lookup: `Product::withoutGlobalScopes()->whereIn('sku', product_ids)`
- Response shape:

```json
{
  "data": {
    "products": [
      {
        "sku": "SKU-001",
        "images": [{ "image_path": "production/uploads/product/img/..." }],
        "variant_images": [{ "image_path": "...", "variant_sku": "SKU-001-RED" }]
      }
    ]
  }
}
```

- `resolveVariantOwner()` maps variant image rows to correct **variant SKU** within product family tree (avoids wrong child when option reused across products).

Token bootstrap: `php artisan token:external-product` → machine user + permanent Sanctum token.

### 17.3 Consumer merge (`SyncProductImageJob::syncProduct`)

| Case | Model | Query scope |
|------|-------|-------------|
| Non-variant | `ProductImage` | `product_id = $product->id` |
| Variant child | `ProductVariantImage` | parent id + variant_id + option_id |

Only rows with **`is_synced = true`** participate in update/create/delete. Manual uploads remain `is_synced = false` (default on manual create) and are untouched.

Display: `ProductImage::getImageBlobAttribute()` → `route('render-file', $path)` — consumer must resolve path on its storage.

### 17.4 Settings schema

Migration `2026_07_29_101247_create_scm_settings_table.php`:

- `scm_settings.product_sync_url` (text, nullable)
- `scm_settings.product_sync_api_key` (text, nullable)

FE: `ProductImageSyncSetting.vue` → `GET/PATCH supplychain/settings`.

### 17.5 Edge cases (QA)

| Case | Behavior |
|------|----------|
| SKU missing in API response | Skip product (no error) |
| Duplicate SKU globally on provider `sync()` | `keyBy('sku')` in job — last wins (ambiguous) |
| One HTTP chunk fails | Entire job `failed` |
| Horizon worker down | Stuck `queued` / no completion |
| Shared storage absent | Paths copied but thumbnails 404 |
