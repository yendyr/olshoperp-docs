---
doc_type: technical
menu: accounting-supplier-invoice
menu_name: "Purchase Invoice"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
---

# Purchase Invoice — Technical Documentation

**API prefix:** `accounting/supplier-invoice`  
**Module:** `Modules/Accounting`

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Routes | `Modules/Accounting/Routes/components/supplier-invoice.php` |
| Controller | `Modules/Accounting/Http/Controllers/SupplierInvoiceController.php` |
| Detail items | `SupplierInvoiceDetailItemController.php` |
| Other cost | `SupplierInvoiceOtherCostController.php` |
| Other discount | `Modules/Accounting/Http/Controllers/SupplierInvoiceOtherDiscountController.php` |
| Model header | `Modules/Accounting/Entities/SupplierInvoice.php` |
| Model detail | `SupplierInvoiceDetailItem.php` |
| Pricing | `Modules/Accounting/Services/SupplierInvoicePrice.php` |
| Journal | `Modules/Accounting/Services/JournalProcess.php` → `supplierInvoiceAutoJournal()` |
| Export | `SupplierInvoiceExportJob` |
| FormRequest | `StoreSupplierInvoiceRequest`, `UpdateSupplierInvoiceRequest` |

### Frontend

| Layer | Path |
|-------|------|
| Route | `olshoperp-frontend/src/router/accounting.ts` → `/accounting/supplier-invoice` |
| List | `src/pages/Accounting/AccountPayable/SupplierInvoice/DataList.vue` |
| Form | `Form.vue` |
| Outstanding | `DatalistOutstanding.vue`, `DatalistOutstandingGroup.vue` |
| Other cost PO select | `OtherCostSelectFromPO.vue` |
| Other discount PO select | `OtherDiscountSelectFromPO.vue` |
| Detail grid | `DetailItemDataList.vue` |

### Account Payment (cross-ref)

| Layer | Path |
|-------|------|
| Controller | `PaymentController.php`, `PaymentDetailController.php` |
| FE | `src/pages/Accounting/AccountPayable/SupplierPayment/` |

---

## 2. API Routes ( utama )

| Method | Path | Action |
|--------|------|--------|
| GET | `accounting/supplier-invoice` | Index |
| POST | `accounting/supplier-invoice` | Store |
| GET | `accounting/supplier-invoice/{id}` | Show |
| PATCH | `accounting/supplier-invoice/{id}` | Update |
| DELETE | `accounting/supplier-invoice/{id}` | Destroy |
| POST | `accounting/supplier-invoice/{id}/approve` | Approve |
| GET | `accounting/supplier-invoice/{id}/outstanding-inbound` | Outstanding flat |
| GET | `accounting/supplier-invoice/{id}/outstanding-inbound-group` | Outstanding grouped |
| POST | `accounting/supplier-invoice/{id}/details` | Add line |
| POST | `accounting/supplier-invoice/{id}/details/bulk` | Bulk add |
| POST | `accounting/supplier-invoice/{id}/details/group` | Group add |
| GET | `accounting/supplier-invoice/{id}/print` | Print (**broken — PO template**) |

---

## 3. Database — Key Tables

### `accounting_supplier_invoices`

| Column | Notes |
|--------|-------|
| `code` | PI prefix |
| `transaction_date`, `due_date` | |
| `supplier_id`, `currency_id`, `exchange_rate` | Lock after details |
| `grand_total_before_vat`, `grand_total_after_vat` | From `SupplierInvoicePrice` |
| `prepared_to_payment_amount`, `processed_to_payment_amount` | Payment allocation |
| `account_payable_coa_id` | Set on approve |
| `transaction_status` | draft/open/approved/... |
| `supplier_reference_document` | Supplier ref / tax invoice |

### `accounting_supplier_invoice_detail_items`

| Column | Notes |
|--------|-------|
| `mutation_inbound_detail_item_id` | FK inbound detail |
| `purchase_order_detail_id` | Price source |
| `invoice_quantity` | In invoice UOM |
| `invoice_quantity_in_base_unit` | Base UOM |
| Price fields | Copied from PO via `getDetailPriceAndTax()` |

### Inbound qty bridge (`supplychain_mutation_inbound_detail_items`)

| Column | PI usage |
|--------|----------|
| `prepared_to_invoice_quantity` | Reserved on add line |
| `processed_to_invoice_quantity` | Finalized on PI approve |

**Balance:** `invoiceBalance()` on inbound detail model.

### PO other cost flags (`supplychain_purchase_order_other_costs`)

| Column | PI usage |
|--------|----------|
| `prepared_to_invoice` | Set when cost linked to draft PI |
| `processed_to_invoice` | Set on PI approve |

---

## 4. Pricing Service

**Class:** `SupplierInvoicePrice`

```php
// grandTotal
subTotal.before_vat = Σ (invoice_quantity × invoice_each_price_after_discount_before_vat)
subTotal.after_vat  = Σ (invoice_quantity × invoice_each_price_after_discount_after_vat)
grandTotal.before_vat = subTotal.before_vat + totalOtherCost - totalOtherDiscount
grandTotal.after_vat  = subTotal.after_vat  + totalOtherCost - totalOtherDiscount
```

**Exchange diff:** `(PO.exchange_rate - PI.exchange_rate) × qty × unit_price` → journal line.

**Line pricing source:** `PurchaseOrderDetail::getDetailPriceAndTax()` — includes discount %, VAT, fake_vat, vat_included.

---

## 5. Approve Flow

**Controller:** `SupplierInvoiceController@approve`

1. `Cache::lock('approval_supplier_invoice_{id}', 30)`
2. Validate: status open, fiscal period, ≥1 detail
3. `$supplierInvoice->approve()` — status + approval log
4. For each detail: inbound `prepared↓ processed↑`
5. PO other costs/discounts: `processed_to_invoice=true`
6. `JournalProcess::supplierInvoiceAutoJournal($supplierInvoice)`

### Journal lines (`supplierInvoiceAutoJournal`)

| Dr/Cr | COA | Amount basis |
|-------|-----|--------------|
| Dr | Unbilled Goods (product) | qty_base × DPP_unit × PO_rate |
| Dr | Tax COA | pro-rata VAT on qty |
| Dr | Other cost expense | primary amount |
| Cr | Other discount expense | primary amount |
| Dr/Cr | Exchange diff COA | net diff |
| Cr | Account Payable | balance |

---

## 6. Outstanding Inbound Query

Filters in controller/repository:

- Inbound approved (has approval records)
- Same `supplier_id`, PO currency = PI currency
- `transaction_date` inbound < PI date
- `processed_to_invoice_quantity < quantity_in_base_unit`
- Exclude adjustment/return types

---

## 7. Account Payment Integration

### Outstanding PI query

`PaymentController@queryOutstandingSupplierInvoice`:

```sql
-- conceptual
WHERE status IN ('approved','processed')
  AND grand_total_after_vat > processed_to_payment_amount + prepared_to_payment_amount (outstanding calc)
  AND supplier_id = payment.supplier_id
  AND transaction_date <= payment.transaction_date
```

### Payment detail save

Updates PI `prepared_to_payment_amount` on payment detail store/update/delete.

### Payment approve

`processed_to_payment_amount` += allocated amount; `prepared` adjusted.

**Gap:** PI header `transaction_status` not auto-updated to `processed` on partial pay.

### Reverse lookup

`GET accounting/supplier-payment/supplier-invoice/{id}` → show PI from payment context.

---

## 8. Validation Highlights

| Rule | Location |
|------|----------|
| Unique code per company | Store/Update request |
| Fiscal period | Approve middleware |
| Invoice qty ≤ invoiceBalance | Detail store |
| Currency match PO | Detail store |
| No duplicate inbound line on same PI | Detail store |
| Cannot update header fields if details exist | Update request |
| Other cost amount ≤ PO remaining | OtherCost store |

---

## 9. Frontend Behaviors

| Behavior | File |
|----------|------|
| Auto-submit create | `Form.vue` — `fetchDefaultValues()` |
| Totals computed | API show includes `grand_total_*`, FE `totalProduct` |
| Outstanding overlay | `DatalistOutstanding.vue` |
| PO cost multiselect | `OtherCostSelectFromPO.vue` → `supplychain/purchase-order/outstanding-other-costs/select2` |
| Print | Calls print API — wrong PDF backend |
| Min backdate 6 months | Date picker config |

---

## 10. Tests & QA Notes

| Area | Suggestion |
|------|------------|
| Approve journal | Feature test: assert Dr Unbilled Goods + Tax, Cr AP |
| Qty bridge | Assert prepared/processed on inbound detail |
| Payment allocation | Integration: payment approve updates PI processed_to_payment |
| Void | Document expected failure — no reversal today |
| Print | Assert 200 + correct view name (currently fails expectation) |
| Exchange diff | Foreign PO + different PI rate |

---

## 11. Known Issues (code)

| ID | Issue |
|----|-------|
| GAP-PI-01 | `print()` uses PurchaseOrder PDF |
| GAP-PI-02 | Void no inbound/journal reversal |
| GAP-PI-03 | `processed` status not set from payment |
| GAP-PI-08 | Create auto-submit |
| GAP-PI-10 | `rejected` vs `declined` in canApprove |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Account Payment Technical | [../accounting-supplier-payment/technical.md](../accounting-supplier-payment/technical.md) |
| Purchase Inbound Technical | [../supplychain-new-purchase-inbound/technical.md](../supplychain-new-purchase-inbound/technical.md) |
