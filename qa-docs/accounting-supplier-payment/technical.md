---
doc_type: technical
menu: accounting-supplier-payment
menu_name: "Account Payment"
version: 2.1
last_updated: 2026-07-06
owner: QA - Yemima
status: review
---

# Account Payment — Technical Documentation

**API prefix:** `accounting/supplier-payment`  
**Type:** `Payment to Supplier` · **Code prefix:** `PY`

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Wrapper | `SupplierPaymentController.php` → delegates `PaymentController` |
| Core | `PaymentController.php` |
| PI allocation | `PaymentDetailController.php` |
| Wrapper | `SupplierPaymentDetailController.php` |
| Cash/Bank source | `PaymentDetailFundController.php` |
| DN source | `PaymentDetailFundController.php` (`storeClearing`, deposits) |
| Wrapper funds | `SupplierPaymentDetailFundController.php` |
| Adjustment | `PaymentDetailAdjustmentController.php` |
| Header import | `SupplierPaymentImportController.php` |
| Models | `Payment.php`, `SupplierPayment.php`, `PaymentDetail.php`, `PaymentDetailFund.php`, `PaymentDetailDeposit.php`, `PaymentDetailAdjustment.php` |
| Pricing | `PaymentPrice.php`, `PaymentDetailHelper.php` |
| Journal | `JournalProcess::supplierPaymentAutoJournal()` |
| Balance | `JournalReport::getInPeriodAvailableBalance()` |
| Import jobs | `SupplierPaymentImportJob`, `SupplierPaymentImportPerMutationJob`, `ImportSupplierPaymentFinalValidationJob` |
| Routes | `Modules/Accounting/Routes/api.php` (prefix `accounting/supplier-payment`) |

### Frontend

| File | Section |
|------|---------|
| `AccountPayable/Payment/DataList.vue` | List + Import Log |
| `Form.vue` | Basic Information |
| `PaymentSource.vue` | Section B — Cash/Bank + DN |
| `OutstandingSupplierInvoice.vue` | Section C — Outstanding PI |
| `DatalistDetail.vue` | Section D — Detail grid |
| `Adjustment.vue` | Section E |
| `ImportLog.vue` | Header import UI |

**Route:** `/accounting/supplier-payment`, `/create`, `/edit/:id`

---

## 2. API Routes (utama)

| Method | Path | Action |
|--------|------|--------|
| GET/POST | `accounting/supplier-payment` | index / store |
| GET/PATCH/DELETE | `accounting/supplier-payment/{id}` | show / update / destroy |
| POST | `accounting/supplier-payment/{id}/approve` | approve (void via `approval_status=void` — broken) |
| GET | `.../outstanding-supplier-invoice` | outstanding PI |
| GET | `.../cash-bank-account` | outstanding cash/bank |
| POST | `.../cash-bank-account/bulk-use` | bulk cash allocation |
| GET | `.../debit-note` | available DN datalist |
| POST | `.../supplier-payment-detail-fund/clearing` | single DN full clear |
| GET | `.../select2-available-debit-notes` | DN select2 |
| CRUD | `.../supplier-payment-detail` | PI lines |
| POST | `.../bulk-select` | full outstanding PI (clearing) |
| POST | `.../supplier-payment-detail-bulk` | bulk PI add |
| CRUD | `.../supplier-payment-adjustment` | adjustments |
| GET | `accounting/supplier-payment/supplier-invoice/{id}` | PI show from payment |
| **Import** | `accounting/supplier-payment/import/*` | template, import, progress, errors |

---

## 3. Database

### `accounting_payments` (supplier)

| Column | Notes |
|--------|-------|
| `type` | `Payment to Supplier` |
| `code` | PY prefix via `SupplierPayment::$code_identifier` |
| `actor_reference_id` | supplier `Company` id |
| `currency_id`, `exchange_rate` | header |
| `transaction_status` | draft/open/approved/... |
| `grand_total` | computed |

### `accounting_payment_details`

| Column | Notes |
|--------|-------|
| `transaction_reference_id/class` | `SupplierInvoice` |
| `payment_amount_in_invoice_currency` | paid in PI currency |
| `amount_before_discount_before_vat` | used in grand total |
| `exchange_gain_local_currency` | forex per line |
| `cash_difference_local_currency` | full-clearing diff |
| `is_full_amount` | clearing flag |

### `accounting_payment_detail_funds`

Cash/bank: `coa_id`, `amount`, `amount_foreign`, `company_detail_bank_id`

### `accounting_payment_detail_deposits`

Debit note: `deposit_id` → `DebitNote`, `type = Debit Note`, `amount`

### `accounting_payment_detail_adjustments`

`coa_id`, `debit`, `credit`, `description`

### PI coupling (`accounting_supplier_invoices`)

| Field | Event |
|-------|-------|
| `prepared_to_payment_amount` | detail store/delete |
| `processed_to_payment_amount` | payment approve |
| `prepared_to_amount_return` / `processed_to_amount_return` | **unused by PR writer** |

### DN coupling (`accounting_payments` as DebitNote)

| Field | Event |
|-------|-------|
| `prepared_to_use_amount` | deposit store |
| `processed_to_use_amount` | payment approve |

---

## 4. Pricing & Balancing

### `PaymentPrice::grandTotalPriceAfterVat` (supplier)

```php
grandTotal = totalDetailAfterVat − totalAdjustment
// totalAdjustment = Σ(credit − debit) on adjustments
```

### `PaymentPrice::totalSource`

```php
totalSource = totalFund + totalDeposit
// foreign: totalFundForeign + totalDepositForeign
```

### Approve check (`checkBalancePayment`)

```php
bccomp(grandTotalPriceAfterVat, totalSource, 15) === 0
```

### Exchange gain (`PaymentDetailHelper::calculateExchangeGain`)

```php
exchange_gain = (invoice.exchange_rate − payment.exchange_rate) × amount_in_invoice_currency
// when has_exchange_gain flag true
```

### Cash difference (full clearing)

```php
cash_difference = (invoice_remaining − paid_in_invoice_currency) × rate_factor
```

---

## 5. Journal (`supplierPaymentAutoJournal`)

Requires company COAs: **Exchange Diff. COA**, **Cash Diff. COA**, supplier **Account Payable COA**.

| Source | Posting |
|--------|---------|
| `payment_detail_funds` | Cr cash/bank COA |
| `payment_detail_deposits` | Cr deposit COA + DN forex |
| `payment_details` | Dr AP (`paid × PI.exchange_rate`) + line forex |
| Sum `cash_difference_local_currency` | Cr/Dr Cash Diff COA |
| `payment_detail_adjustments` | Dr/Cr per row |

---

## 6. Cash/Bank Balance

```php
available = JournalReport::getInPeriodAvailableBalance($coa, '1900-01-01', $payment_date)
        − JournalReport::getInPeriodReservedPayment(...)
```

Blocked when `balance < fund_amount` for `Payment to Supplier`.

---

## 7. Outstanding PI Query

`PaymentController::queryOutstandingSupplierInvoice`:

- `supplier_id` = payment actor
- `transaction_status` IN (`approved`, `processed`)
- `grand_total_after_vat > processed_to_payment_amount`
- PI date ≤ payment date
- Eager: inbound refs, `purchase_return`, `debit_notes`

Accessor `invoice_remaining_after_vat` on `SupplierInvoice`.

---

## 8. Import AP

| Component | Path |
|-----------|------|
| Controller | `SupplierPaymentImportController` |
| Template export | `AccountPaymentTemplateExport` (3 sheets) |
| Validate job | `ImportSupplierPaymentValidateBankMutationJob` |
| Process job | `SupplierPaymentImportJob` → `SupplierPaymentImportPerMutationJob` |
| Entities | `ImportSupplierPayment`, `ImportSupplierPaymentDetail`, `ImportSupplierPaymentLog` |

Queue lock: `cacheKey(['import', 'ap', $company_id])`

---

## 9. Approve Flow

1. `Cache::lock` approval
2. `validate_fiscal_period`
3. `can_approve` (status **open**)
4. Require details + (funds OR deposits)
5. `checkBalancePayment`
6. `approvePayment`:
   - PI: `processed_to_payment` ↑, `prepared_to_payment` ↓
   - DN: `processed_to_use` ↑, `prepared_to_use` ↓
7. `supplierPaymentAutoJournal`

---

## 10. Known Issues

| ID | Issue |
|----|-------|
| GAP-PAY-VOID-01 | Void from approved — `can_approve` requires open |
| GAP-PAY-DN-CLEAR | FE bulk DN → wrong `customer-payment` URL |
| GAP-PAY-PR-OUT | PR return fields on PI not wired to payment outstanding |
| GAP-PAY-01 | PI status not set processed on pay |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Purchase Invoice | [../accounting-supplier-invoice/technical.md](../accounting-supplier-invoice/technical.md) |
