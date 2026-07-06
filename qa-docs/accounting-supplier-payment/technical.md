---
doc_type: technical
menu: accounting-supplier-payment
menu_name: "Account Payment"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
---

# Account Payment — Technical Documentation

**API prefix:** `accounting/supplier-payment`  
**Module:** `Modules/Accounting`

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Routes | `Modules/Accounting/Routes/components/supplier-payment.php` |
| Controller | `Modules/Accounting/Http/Controllers/PaymentController.php` |
| Detail | `PaymentDetailController.php` |
| Model | `Modules/Accounting/Entities/Payment.php`, `PaymentDetail.php` |
| Journal | `JournalProcess::supplierPaymentAutoJournal()` |

### Frontend

| Layer | Path |
|-------|------|
| Route | `olshoperp-frontend/src/router/accounting.ts` |
| List | `src/pages/Accounting/AccountPayable/SupplierPayment/DataList.vue` |
| Form | `Form.vue` |
| Outstanding PI | `DatalistOutstandingSupplierInvoice.vue` |

---

## 2. API Routes

| Method | Path | Action |
|--------|------|--------|
| GET | `accounting/supplier-payment` | Index |
| POST | `accounting/supplier-payment` | Store |
| GET | `accounting/supplier-payment/{id}` | Show |
| PATCH | `accounting/supplier-payment/{id}` | Update |
| DELETE | `accounting/supplier-payment/{id}` | Destroy |
| POST | `accounting/supplier-payment/{id}/approve` | Approve |
| GET | `accounting/supplier-payment/{id}/outstanding-supplier-invoice` | Outstanding PI |
| GET | `accounting/supplier-payment/supplier-invoice/{id}` | Show PI from payment |
| POST | `accounting/supplier-payment/{id}/details` | Add PI allocation |
| PATCH | `accounting/supplier-payment/{id}/details/{detailId}` | Update allocation |
| DELETE | `accounting/supplier-payment/{id}/details/{detailId}` | Remove allocation |

---

## 3. PI Allocation — Database

### `accounting_payments` / `accounting_payment_details`

| Column | Notes |
|--------|-------|
| `supplier_id` | Filters outstanding PI |
| `currency_id`, `exchange_rate` | |
| `bank_coa_id` | Cr on journal |
| detail.`supplier_invoice_id` | FK to PI |
| detail.`amount` | Allocation in payment currency |

### PI fields updated (`accounting_supplier_invoices`)

| Field | When |
|-------|------|
| `prepared_to_payment_amount` | Detail store/update/delete on draft/open payment |
| `processed_to_payment_amount` | Payment approve |

**Outstanding formula:**

```
outstanding = grand_total_after_vat - prepared_to_payment_amount - processed_to_payment_amount
```

---

## 4. Outstanding PI Query

`PaymentController@queryOutstandingSupplierInvoice` (conceptual filters):

- `transaction_status` IN (`approved`, `processed`)
- Same `supplier_id` as payment
- PI `transaction_date` ≤ payment date
- Outstanding > 0

---

## 5. Approve Flow

1. Validate open status, fiscal period, ≥1 detail
2. For each detail: move PI prepared → processed payment amounts
3. `supplierPaymentAutoJournal($payment)` — Dr AP / Cr Bank per line
4. Set payment approved

---

## 6. Integration with Purchase Invoice

| Event | PI effect |
|-------|-----------|
| Payment detail created | `prepared_to_payment_amount` += amount |
| Payment detail deleted | prepared -= amount |
| Payment approved | prepared -= amount; processed += amount |
| Payment void (if implemented) | Should reverse processed — **verify** (GAP-PAY-02) |

PI header status **not** updated to `processed` on pay (GAP-PAY-01).

Cross-ref: [PI technical §7](../accounting-supplier-invoice/technical.md#7-account-payment-integration)

---

## 7. Validation

| Rule | Message |
|------|---------|
| amount ≤ PI outstanding | `To be paid amount must be less than invoice outstanding amount` |
| No duplicate PI on same payment | `already included in this payment detail` |
| amount > 0 | standard validation |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Purchase Invoice | [../accounting-supplier-invoice/technical.md](../accounting-supplier-invoice/technical.md) |
