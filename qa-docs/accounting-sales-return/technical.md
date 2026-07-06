---
doc_type: technical
menu: accounting-sales-return
menu_name: "Sales Return"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ../supplychain-sales-returns/technical.md
---

# Sales Return Approval — Technical (Finance Layer)

**UI route:** `/accounting/sales-return`  
**Shared FE:** `olshoperp-frontend/src/pages/Accounting/Return/SalesReturn/` with `fromScm=false`, `withPrice=true`

Full architecture: [supplychain-sales-returns/technical.md](../supplychain-sales-returns/technical.md)

---

## 1. Finance-specific FE

| Prop | Value | Effect |
|------|-------|--------|
| `fromScm` | `false` | Complete button visible; back link → `/accounting/sales-return` |
| `withPrice` | `true` | Detail API `?with_price=1`; price/COGS columns |

**Complete handler:** `DetailButtons.vue` → `POST accounting/sales-returns/{id}/approve`

---

## 2. Price columns API

`SalesReturnDetailController@index` with `with_price=1`:

- `total_outbound_cogs` — order-level price + COGS
- `total_inbound_cogs` — return-proportional price + COGS (dynamic on qty change)

COGS source on create: average outbound (`SalesReturnController@createDetail` L459–492).

---

## 3. Approve & Journal

| Step | Class / method |
|------|----------------|
| Authorize | `SalesReturnController@approve` → `authorize('approval', SalesReturn::class)` |
| Stock | `ItemStockMutation::approveReturn()` |
| Per detail | `SalesReturnDetail::generateStock()` |
| Journal | `JournalProcess::stockSalesReturnAutoJournal()` L1867+ |
| Invoice reversal | `JournalProcess::processSalesReturnInvoice()` L2963+ |
| Credit Note | `generateCreditNoteFromReturn()` L1547+ (billed) |

Journal auto-approved (system user 0).

---

## 4. Accounting type logic

Set in `createDetail` from invoice payment:

```php
$is_billed = $invoice->processed_to_payment_amount > 0;
// accounting_type: 'billed' | 'unbilled' on omni_sales_returns
```

Invoice counters updated on qty edit:

- `prepared_to_amount_return`
- `prepared_to_amount_credit_note` (if billed)

On approve → `processed_to_amount_return`, `processed_to_amount_credit_note`.

---

## 5. Menu seeder flags

`AccountingMenuSeeder.php` L547–565:

- Route: `accounting/sales-return`
- `approval => 1`
- `print => 0`

Contrast SCM `SupplyChainMenuSeeder.php`: `approval => 0`, `print => 1` (print not implemented).

---

## 6. Auto-approve

| Component | Path |
|-----------|------|
| Config API | `omnichannel/sales-return-configuration` |
| Command | `app/Console/Commands/SalesReturnAutoApprove.php` |
| Job | `SalesReturnAutoApproveJob` |
| FE config | `Omni/master/GlobalSetting/SalesReturnConfiguration.vue` |

Selects open platform returns older than `open_to_approve_duration`, dispatches approve job.

---

## 7. Testing (Finance focus)

1. Complete from accounting route only
2. `with_price=1` columns populated
3. Billed path → Credit Note row in DB
4. Unbilled path → no CN, sales/AR journal lines
5. Lost without Return Expense COA → 422 on approve
6. Tax reversal via `customer_invoice_detail_taxes` pivot

---

## Related Documents

| Doc | Path |
|-----|------|
| Canonical technical | [../supplychain-sales-returns/technical.md](../supplychain-sales-returns/technical.md) |
| Credit Note | [../accounting-credit-note/README.md](../accounting-credit-note/README.md) |
