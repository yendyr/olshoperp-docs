---
doc_type: technical
menu: omni-other-cost
menu_name: "Other Cost"
version: 1.3
last_updated: 2026-06-23
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Master Other Cost — Technical Documentation

## 1. Architecture Overview

Master Other Cost adalah CRUD master data di modul **OmniChannel** (route prefix `omnichannel`), dipakai lintas modul Accounting & Supply Chain sebagai referensi biaya tambahan. Data disimpan di `omni_other_costs` dengan relasi many-to-many ke store via `accounting_other_cost_pivots`.

Audit trail memakai trait **OwenIt Auditable** pada `MainModel` — tidak ada observer khusus. Authorization via `OtherCostPolicy` → `MainPolicy`.

```
Vue Form/DataList
    → OtherCostController (OmniChannel)
        → OtherCost (omni_other_costs)
        → OtherCostPivot (accounting_other_cost_pivots)
        → ChartOfAccount (expense_coa_id)
    → Konsumen: PO/SO/CI/SI controllers + SettlementUploadController
```

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/Omni/master/OtherCost/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET omnichannel/other-cost` |
| `Form.vue` | Create/Edit + audit slideover | `POST/PUT omnichannel/other-cost`, `GET .../audit` |
| `OtherCostSelect.vue` | Reusable select2 | `GET omnichannel/other-cost/select2` |

**Routes** (`src/router/index.ts` ~L3708–3739):

| Path | Component | `document.title` |
|------|-----------|------------------|
| `other-cost` | DataList | `Master Other Cost` |
| `other-cost/create` | Form | `Create Other Cost` |
| `other-cost/edit/:id` | Form | `Edit Other Cost` |

**Transaction consumers (picker / line UI):**

| Menu | Path |
|------|------|
| Purchase Order | `src/pages/SCM/PurchaseOrder/OtherCost.vue`, `OtherCostForm.vue` |
| Supplier Invoice (PI) | `src/pages/Accounting/AccountPayable/SupplierInvoice/OtherCost*.vue` |
| Customer Invoice (SI) | `src/pages/Accounting/AccountReceivable/CustomerInvoice/OtherCost*.vue` |
| Sales Order General | `src/pages/BusinessDevelopment/SalesOrderGeneral/OtherCost.vue` |
| Sales Order Platform | `src/pages/Omni/SalesOrder/OtherCost.vue` (read-only) |

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/OmniChannel/Http/Controllers/OtherCostController.php` | CRUD, datalist, audit, COA select2, import |
| `Modules/OmniChannel/Entities/OtherCost.php` | Model `omni_other_costs` |
| `Modules/OmniChannel/Policies/OtherCostPolicy.php` | RBAC |
| `Modules/OmniChannel/Import/OtherCostImport.php` | Excel import |
| `Modules/OmniChannel/Http/Controllers/OtherCostOwnerController.php` | Prasyarat global setting |
| `Modules/Accounting/Entities/OtherCostPivot.php` | Pivot Applied Store |
| `Modules/Accounting/Http/Controllers/SettlementUploadController.php` | Template general — filter OC by store |
| `Modules/SupplyChain/Http/Controllers/PurchaseOrderOtherCostController.php` | PO line |
| `Modules/OmniChannel/Http/Controllers/SalesOrderOtherCostController.php` | SO line |
| `Modules/Accounting/Http/Controllers/CustomerInvoiceOtherCostController.php` | CI line |
| `Modules/Accounting/Http/Controllers/SupplierInvoiceOtherCostController.php` | SI line |

**Line entities & tables:**

| Entity | Table |
|--------|-------|
| `PurchaseOrderOtherCost` | `scm_purchase_order_other_costs` |
| `SalesOrderOtherCost` | `omni_sales_order_other_costs` |
| `CustomerInvoiceOtherCost` | `accounting_customer_invoice_other_costs` |
| `SupplierInvoiceOtherCost` | `accounting_supplier_invoice_other_costs` |

## 4. API Routes

Prefix: `/api/omnichannel/other-cost` (middleware `auth:sanctum`, `auth_verified`)

| Method | Path | Action |
|--------|------|--------|
| GET | `/other-cost` | `index` — datalist |
| POST | `/other-cost` | `store` |
| GET | `/other-cost/{id}` | `show` |
| PUT | `/other-cost/{id}` | `update` |
| DELETE | `/other-cost/{id}` | `destroy` (soft) |
| GET | `/other-cost/select2` | Active OC select2 |
| GET | `/other-cost/select2-expense` | COA Expense leaf select2 |
| GET | `/other-cost/{id}/audit` | Audit log datatable |
| POST | `/other-cost/import` | Excel import |
| GET | `/other-cost/import-history` | Import history |
| GET | `/other-cost/import-log` | Import log rows |
| GET | `/other-cost/check-import-log` | Check import progress |

**Store select2 (Applied Store):**  
`GET /api/omnichannel/store/select2?general_only=true&current_company=true`

## 5. Database Schema

### `omni_other_costs`

| Column | Type | Notes |
|--------|------|-------|
| `code` | string | Unique per `owned_by` |
| `name` | string | |
| `description` | text | Nullable |
| `tariff` | numeric | Legacy — UI disabled |
| `expense_coa_id` | FK | → `accounting_chart_of_accounts` |
| `is_all_stores` | boolean | `1` = All Stores |
| `is_all_company` | boolean | Always `0` in create |
| `status` | tinyint | `1` active |
| `owned_by` | FK | Company scope |

### `accounting_other_cost_pivots`

| Column | Notes |
|--------|-------|
| `other_cost_id` | FK → `omni_other_costs` |
| `store_id` | FK → `omni_stores` |
| Soft deletes | Sync on update |

**db-schema docs:** `docs/db-schema/omni_channel/omni_other_costs.md`

## 6. Key Implementation Details

### 6.1 Validation location

Tidak ada FormRequest — validasi inline di `OtherCostController@store` / `@update`. Lihat [requirement.md §3](./requirement.md) untuk daftar lengkap.

### 6.2 COA select2 (`select2Child_expense`)

```289:306:Modules/OmniChannel/Http/Controllers/OtherCostController.php
    public function select2Child_expense(Request $request)
    {
        // ...
        $query = ChartOfAccount::withoutCompanyScope()
                                ->whereNotIn('id', $selectParent)
                                ->where('owned_by', getToken()->company_id ?? null)
                                ->whereHas('chart_of_account_class', function ($class) {
                                    $class->where('name', 'Expense');
                                })
                                ->where('status', 1);
```

### 6.3 Applied to Store + Settlement filter

Konsumen utama: template **Instant Settlement General** — kolom `OC: {code}`. Spesifikasi lengkap: [accounting-settlement-upload §4.6](../accounting-settlement-upload/requirement.md). Pola identik untuk `OD:` di [Other Discount](../omni-other-discount/technical.md).

```1014:1022:Modules/Accounting/Http/Controllers/SettlementUploadController.php
        $other_costs_query = OtherCost::where('status', 1);
        if ($store_id) {
            $other_costs_query->where(function ($query) use ($store_id) {
                $query->where('is_all_stores', 1)
                      ->orWhereHas('stores', function ($q) use ($store_id) {
                          $q->where('omni_stores.id', $store_id);
                      });
            });
        }
```

### 6.4 Store eligibility

- Form select2: `Store::filterByRequest` dengan `general_only` → `Platform::PL_OTHER`, `status=1`
- Import: `OtherCostImport::eligibleStoreQuery()` — sama

### 6.5 Audit log

- Component: `AuditLogTables.vue`
- API: `GET .../other-cost/{id}/audit` → `auditDatatable($other_cost)`
- `expense_coa_id` diformat `{code} | {name}` via `AuditHandlerTrait`
- `OtherCostPivot` changes audited terpisah; `is_all_stores` → "All Store: Yes/No"

### 6.6 Export

Tidak ada dedicated export class. `DataTablesV3.exportActivePageOnly()` — kolom = visible columns di `DataList.vue` (4 kolom).

### 6.7 Form auto-save (edit mode)

`Form.vue` watchers pada `expense_coa_id` dan `status` memanggil `update()` langsung tanpa Save All.

## 7. Jobs / Observers / Events

| Item | Status |
|------|--------|
| Dedicated observer | Tidak ada |
| Auditable trait | Ya — `MainModel` |
| Import job | Sync via `OtherCostImport` (bukan queue terpisah) |

## 8. Related QA Docs

| Menu | Slug | Catatan |
|------|------|---------|
| Instant Settlement | `accounting-settlement-upload` | |
| Purchase Order | `supplychain-purchase-order` | |
| Customer Invoice | `accounting-customer-invoice` | |
| Supplier Invoice | `accounting-supplier-invoice` | COA default dari master; **override editable** di PI sebelum approve |
| Sales Order General | `sales-order-general` | |
| Other Discount | `omni-other-discount` | |

## 9. COA class limits (per channel)

| Channel | Allowed classes | Endpoint / file |
|---------|-----------------|-----------------|
| Form dropdown | Expense only | `OtherCostController@select2Child_expense` |
| Import (AS-IS) | Expense + Other Revenue & Expenses | `OtherCostImport::ALLOWED_COA_CLASSES` |
| API save | No explicit class check after pick | `store` / `update` — leaf + owner only |

## 10. Import — AS-IS audit (QA v1.3)

Lihat [requirement.md §4.4](./requirement.md). Applied Store by **`store_name`** — **correct AS-IS** (bukan store code).

Sisa gap utama: IMP-02 (company scope store), IMP-03 (COA `owned_by`), IMP-04–06.

## 11. Known Technical Debt

Lihat [requirement.md §5 Open Items](./requirement.md) — FormRequest refactor (O-12), `expense_coa_id` di update rules (O-09), inactive bypass store API (O-07), export Applied to Store (O-05).
