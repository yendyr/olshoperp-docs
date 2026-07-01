---
doc_type: technical
menu: bill-of-material
menu_name: "Bill of Material"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Bill of Material — Technical Documentation

## 1. Architecture

BOM stored in `scm_bill_of_materials` with `is_bom` flag distinguishing BOM vs bundle records. Master BOM menu uses dedicated controller separate from System Product embedded BOM routes.

## 2. Frontend

**Root:** `olshoperp-frontend/src/pages/SCM/master/MasterBillOfMaterial/`

| File | Role |
|------|------|
| `DataList.vue` | Main list + export |
| `Form.vue` | Create/edit header + detail |
| `DatalistDetail.vue` | Detail grid |
| `TreeDetail.vue` | Variant tree detail |
| `CreateVariant.vue` | Variant BOM setup |
| `ImportLog.vue` | Import history |

**Routes:** `supplychain_bill-of-material_index`, `create_bill-of-material_form`, `edit_bill-of-material_form`

## 3. Backend

| File | Role |
|------|------|
| `MasterBillOfMaterialController.php` | CRUD, tree, export, import history |
| `BillOfMaterialController.php` | Shared BOM logic, validity check |
| `BillOfMaterialGeneralConfigurationController.php` | BOM from System Product form |
| `BillOfMaterialInventoryConfigurationController.php` | Inventory-side BOM |
| `Entities/BillOfMaterial.php` | Model (`scm_bill_of_materials`) |
| `Exports/BillOfMaterialDetailExport.php` | Excel export |
| `Jobs/BillOfMaterialExportJob` | Async export (if used) |

## 4. API Routes

**Prefix:** `/api/supplychain/bill-of-material`

| Method | Path | Controller |
|--------|------|------------|
| GET | `/bill-of-material` | `index` |
| POST | `/bill-of-material` | `store` |
| GET | `/bill-of-material/{id}` | `show` |
| PUT | `/bill-of-material/{id}` | `update` |
| GET | `/bill-of-material/tree/{header_product_bom_id}` | `tree` |
| GET | `/bill-of-material/select2-product` | `select2Product` |
| POST | `/bill-of-material/export-excel` | `exportExcel` |
| GET | `/bill-of-material/export-file` | `exportFile` |

**System Product embedded BOM:** `product-general-configuration/bill-of-material/*` in `Modules/SupplyChain/Routes/api.php`

Full list: `docs/api/supply_chain/routes.md`

## 5. Database

| Table | Purpose |
|-------|---------|
| `scm_bill_of_materials` | Header + detail rows, `is_bom`, `header_product_bom_id` |
| `scm_bill_of_material_export_files` | Export jobs |
| `scm_bill_of_material_import_logs` | Import errors |

Schema: `docs/db-schema/supply_chain/scm_bill_of_materials.md`

## 6. Key methods

| Method | Role |
|--------|------|
| `checkAndSetBundleValidity()` | Composition rule → active flag |
| `store_header()` | Create BOM header |
| `index_detail_primevue()` | Detail datalist for export |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| System Product | [../system-product/technical.md](../system-product/technical.md) |
