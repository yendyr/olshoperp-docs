---
doc_type: technical
menu: omni-other-discount
menu_name: "Other Discount"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../omni-other-cost/technical.md
---

# Master Other Discount — Technical Documentation

## 1. Architecture Overview

Master Other Discount adalah CRUD master data di modul **OmniChannel** (route prefix `omnichannel`), dipakai lintas modul Accounting & Supply Chain sebagai referensi potongan/diskon. Data di `omni_other_discounts` dengan pivot `omni_other_discount_pivots`.

Struktur **mirror** [Other Cost](../omni-other-cost/technical.md); perbedaan utama: validasi **COA class** (§9).

```
Vue Form/DataList
    → OtherDiscountController (OmniChannel)
        → OtherDiscount (omni_other_discounts)
        → OtherDiscountPivot (omni_other_discount_pivots)
        → ChartOfAccount (expense_coa_id)
    → Konsumen: PO/SO/CI/SI + SettlementUploadController (OD: headers)
```

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/Omni/master/OtherDiscount/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | Index datalist | `GET omnichannel/other-discount` |
| `Form.vue` | Create/Edit + audit slideover | `POST/PUT omnichannel/other-discount`, `GET .../audit` |
| `OtherDiscountSelect.vue` | Reusable select2 | `GET omnichannel/other-discount/select2` |

**Routes** (`src/router/index.ts` ~L3742–3775):

| Path | Component | `document.title` |
|------|-----------|------------------|
| `other-discount` | DataList | `Master Other Discount` |
| `other-discount/create` | Form | `Create Other Discount` |
| `other-discount/edit/:id` | Form | `Edit Other Discount` |

**Transaction consumers:**

| Menu | Path |
|------|------|
| Purchase Order | `src/pages/SCM/PurchaseOrder/OtherDiscount.vue`, `OtherDiscountForm.vue` |
| Supplier Invoice (PI) | `src/pages/Accounting/AccountPayable/SupplierInvoice/OtherDiscount*.vue` |
| Customer Invoice (SI) | `src/pages/Accounting/AccountReceivable/CustomerInvoice/OtherDiscount*.vue` |
| Sales Order General | `src/pages/BusinessDevelopment/SalesOrderGeneral/OtherDiscount.vue` |
| Sales Order Platform | `src/pages/Omni/SalesOrder/OtherDiscount.vue` |

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/OmniChannel/Http/Controllers/OtherDiscountController.php` | CRUD, datalist, audit, COA select2, import |
| `Modules/OmniChannel/Entities/OtherDiscount.php` | Model `omni_other_discounts` |
| `Modules/OmniChannel/Policies/OtherDiscountPolicy.php` | RBAC |
| `Modules/OmniChannel/Import/OtherDiscountImport.php` | Excel import |
| `Modules/OmniChannel/Http/Controllers/OtherDiscountOwnerController.php` | Global setting platform order |
| `Modules/OmniChannel/Entities/OtherDiscountPivot.php` | Pivot Applied Store |
| `Modules/Accounting/Http/Controllers/SettlementUploadController.php` | Template general — filter OD by store |
| `Modules/SupplyChain/Http/Controllers/PurchaseOrderOtherDiscountController.php` | PO line |
| `Modules/OmniChannel/Http/Controllers/SalesOrderOtherDiscountController.php` | SO line |
| `Modules/Accounting/Http/Controllers/CustomerInvoiceOtherDiscountController.php` | CI line |
| `Modules/Accounting/Http/Controllers/SupplierInvoiceOtherDiscountController.php` | SI line |

**Line entities & tables:**

| Entity | Table |
|--------|-------|
| `PurchaseOrderOtherDiscount` | `scm_purchase_order_other_discounts` |
| `SalesOrderOtherDiscount` | `omni_sales_order_other_discounts` |
| `CustomerInvoiceOtherDiscount` | `accounting_customer_invoice_other_discounts` |
| `SupplierInvoiceOtherDiscount` | `accounting_supplier_invoice_other_discounts` |

## 4. API Routes

Prefix: `/api/omnichannel/other-discount`

| Method | Path | Action |
|--------|------|--------|
| GET | `/other-discount` | `index` — datalist |
| POST | `/other-discount` | `store` |
| GET | `/other-discount/{id}` | `show` |
| PUT | `/other-discount/{id}` | `update` |
| DELETE | `/other-discount/{id}` | `destroy` (soft) |
| GET | `/other-discount/select2` | Active OD select2 |
| GET | `/other-discount/select2-expense` | COA select2 (AS-IS: Expense only) |
| GET | `/other-discount/{id}/audit` | Audit log |
| POST | `/other-discount/import` | Excel import |
| GET | `/other-discount/import-history` | Import history |
| GET | `/other-discount/import-log` | Import log |
| GET | `/other-discount/check-import-log` | Check import |

**Applied Store picker:** `GET /api/omnichannel/store/select2?general_only=true&current_company=true`

## 5. Database Schema

### `omni_other_discounts`

| Column | Notes |
|--------|-------|
| `code` | Unique per `owned_by` — **namespace terpisah** dari `omni_other_costs` |
| `name` | max 50 |
| `description` | Nullable |
| `tariff` | Legacy |
| `expense_coa_id` | FK COA (nama kolom legacy) |
| `is_all_stores` | `1` = All Stores |
| `status` | `1` active |
| `owned_by` | Company scope |

### `omni_other_discount_pivots`

| Column | Notes |
|--------|-------|
| `other_discount_id` | FK |
| `store_id` | FK → `omni_stores` |
| Soft deletes | Sync on update |

## 6. Settlement Integration

`SettlementUploadController@generalTemplate`:

- Filter `OtherCost` / `OtherDiscount` — lihat [accounting-settlement-upload §4.6](../accounting-settlement-upload/requirement.md).

## 7. Import (`OtherDiscountImport`)

| Aspek | Detail |
|-------|--------|
| Headers | `Code`, `Name`, `Other Discount COA`, `Applied Store`, `Description` |
| Applied Store | `parseAppliedStoreInput()` — **store name**, `ALL`, case-insensitive |
| COA AS-IS | `ALLOWED_COA_CLASSES`: Expense, Other Revenue & Expenses |
| Mode | All-or-nothing |
| Owner check | Tidak ada (IMP-05) |

Lihat [requirement.md §4.4](./requirement.md).

## 8. Related QA Docs

| Menu | Slug | Catatan |
|------|------|---------|
| Other Cost (pasangan) | `omni-other-cost` | |
| Instant Settlement | `accounting-settlement-upload` | |
| Purchase Order | `supplychain-purchase-order` | |
| Customer Invoice | `accounting-customer-invoice` | |
| Supplier Invoice | `accounting-supplier-invoice` | COA default dari master; **override editable** di PI sebelum approve |
| Sales Order General | `sales-order-general` | |

## 9. COA class limits (perbedaan vs Other Cost)

| Channel | Other Discount (AS-IS) | Other Discount (TO-BE) | Other Cost (TO-BE) |
|---------|------------------------|------------------------|-------------------|
| Form `select2-expense` | Expense only | Revenue + ORev + COGS | Expense + ORev |
| Import | Expense + ORev | Revenue + ORev + COGS | Expense + ORev |
| API save | Leaf + owner only | — | — |

**File:** `OtherDiscountController@select2Child_expense` L343–345; `OtherDiscountImport::ALLOWED_COA_CLASSES` L37–40.

**Task:** O-08 — selaraskan form + import ke class diskon (bukan Expense).

## 10. Known Technical Debt

Lihat [requirement.md §5](./requirement.md) — O-08 (COA class), O-01 (no space), O-05 (export Applied to Store), IMP-02–06, O-14 (error message copy).
