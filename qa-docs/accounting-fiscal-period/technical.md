---
doc_type: technical
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
version: 1.0
last_updated: 2026-08-07
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Fiscal Period — Technical Documentation

> **Review** — AS-IS 2026-08-07. Behavior: [requirement v1.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-07 | QA - Yemima | Controller CRUD/approve, gate helper, auto journal Close, GAP-FP-* |

---

## 1. File Map

| Layer | Path / simbol |
|-------|----------------|
| Controller | `Modules/Accounting/Http/Controllers/FiscalPeriodController.php` (`index`, `store`, `update`, `destroy`, `approve`, `autoGenerateJournal`, `show`) |
| Entity | `Modules/Accounting/Entities/FiscalPeriod.php` · table `accounting_fiscal_periods` |
| Policy | `Modules/Accounting/Policies/FiscalPeriodPolicy.php` |
| Routes | `Modules/Accounting/Routes/api.php` — resource `fiscal-period` + `POST fiscal-period/{id}/approve` |
| Gate global | `validate_fiscal_period()` di `app/Helpers/MainHelper.php` |
| can_closed | `App\MainModel::canClosed` (cabang `instanceof FiscalPeriod`) |
| COA resolve | `Company::coa_company_name('Current Profit/Loss' \| 'Retained Profit/Loss')` |
| FE | `olshoperp-frontend/src/pages/Accounting/master/FiscalPeriod/{DataList,Form}.vue` |
| CBR create order | `CashBankReconciliationController` — fiscal sebelum overlap CBR |
| Journal approve order | `JournalController` — fiscal lalu `validate_cash_bank_reconcile_lock` |

---

## 2. Store / update / destroy / approve (ringkas)

**store**

- Validate name (max 50), period_start/end (date), description (max 150).  
- Reject if Current or Retained P/L COA missing.  
- Overlap check (same company, non-deleted) → `The selected date is already in use.`  
- Create: `transaction_status = open`, `status = 1`.  
- **No** explicit `period_start <= period_end` (GAP-FP-07).

**update**

- Reject if Journal company exists with `transaction_date` in range (message uses *delete* wording — GAP-FP-02).  
- Overlap exclude self.  
- Forces remaining Open.

**destroy**

- Soft-delete. Same Journal-in-range check as update.  
- Scope = Journal only (GAP-FP-01).

**approve (Close)**

- Require earlier Open periods closed first.  
- `DB::beginTransaction` → `autoGenerateJournal` → approve journal → `current_profit_loss = 0` → Closed.  
- `can_closed` for FiscalPeriod = approval privilege only — **does not** check already Closed (GAP-FP-06).  
- Typo path: `This fiscal perios…` (GAP-FP-04).

**autoGenerateJournal**

```text
if current_profit_loss < 0:
  Credit Current P/L, Debit Retained P/L (abs)
else:
  Debit Current P/L, Credit Retained P/L (abs)
```

Exactly 2 detail lines; Σ Debit = Σ Credit = abs(balance before reset). Journal date = end of day `period_end`.

---

## 3. Gate `validate_fiscal_period`

| Check order | Failure message |
|-------------|-----------------|
| Company missing | `Company not found.` |
| Zero periods | `To create any transaction in OlshopERP, an active fiscal period must exist.` |
| Bad date format | `Invalid transaction date format.` |
| Older than 6 months | `Transaction date must be within the past 6 months.` |
| In Closed period | `Fiscal period {date} is already closed.` |
| Outside all periods | `Date must be in an active fiscal period.` |

Success only when date falls in an **Open** period and passes the 6-month rule.

---

## 4. Invariants & failure modes

- No two non-deleted same-company periods with overlapping date ranges.  
- Write gate: Open period + within past 6 months.  
- After Close: `transaction_status = closed`, `current_profit_loss = 0`; no reopen API.  
- Soft-delete FP does not delete historical journals.  
- Close mid-failure should roll back controller transaction (review atomicity vs JournalController approve commits when hardening).

---

## 5. Known Issues

[requirement §11](./requirement.md#11-gap-registry).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Cash Bank Reconcile | [../accounting-cash-bank-reconcile/technical.md](../accounting-cash-bank-reconcile/technical.md) |
