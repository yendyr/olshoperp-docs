---
doc_type: technical
menu: general-ledger
menu_name: "General Ledger Report"
version: 1.1
last_updated: 2026-09-01
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../journal/technical.md
  - ../accounting-settlement-upload/requirement.md
---

# General Ledger Report — Technical Documentation

## 1. Architecture Overview

Read-only report. Data from approved `JournalDetail` rows grouped by COA, with optional UNION to `CurrentProfitLossHistory`.

**No create/update** — `GeneralLedgerController` except `index`, `exportExcel`, export file endpoints.

**Store column (ETM-15666):** derived from `journal.stores` many-to-many via `accounting_journal_store_pivots` — not from polymorphic transaction reference directly.

## 2. Frontend

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/Accounting/Report/GeneralLedger/DataList.vue` | Main UI — kolom `store_formatted`, SearchBuilder title **Store** |
| `src/components/project/DataTables/DataTablesV3.vue` | Grid + SearchBuilder filters |
| `src/components/project/DataTables/ExportFileTable.vue` | Async export list |

**Route:** `accounting_general-ledger_index` → `/accounting/general-ledger`

**Column order (visible):** TRX. DATE → TRX. CODE → **STORE** → TRX. REF. → DESCRIPTION → FOREIGN → DEBIT → CREDIT

## 3. Backend

| File | Role |
|------|------|
| `Modules/Accounting/Http/Controllers/GeneralLedgerController.php` | `index`, export, `store_formatted` column + filter |
| `app/Helpers/Accounting/JournalReport.php` | `getBeginningBalance()`, `getEndingBalance()` |
| `Modules/Accounting/Jobs/GeneralLedgerExportJob.php` | Async Excel — eager `journal.stores`, kolom Store |
| `Modules/Accounting/Exports/GeneralLedgerExport.php` | Excel headings — Store = kolom D |
| `Modules/Accounting/Policies/GeneralLedgerPolicy.php` | Menu permission |
| `Modules/Accounting/Entities/Journal.php` | Header + `stores()` hasMany through pivot |
| `Modules/Accounting/Entities/JournalStorePivot.php` | Pivot `accounting_journal_store_pivots` |
| `Modules/Accounting/Entities/JournalDetail.php` | Line items |
| `app/Helpers/Accounting/JournalProcess.php` | Auto-journal — penulisan pivot store (lihat requirement §9) |
| `Modules/Accounting/Http/Controllers/JournalController.php` | Manual journal store multiselect → pivot |
| `Modules/Accounting/Entities/ChartOfAccount.php` | COA |
| `Modules/Accounting/Entities/ChartOfAccountClass.php` | Activa/Passiva position |
| `Modules/Accounting/Entities/CurrentProfitLossHistory.php` | P&L running balance union |
| `app/Helpers/MainHelper.php` | `resolveStartEndDate()` |

## 4. API

| Method | Path | Role |
|--------|------|------|
| GET | `/api/accounting/general-ledger` | DataTables datalist |
| GET | `/api/accounting/general-ledger/export-excel` | Trigger export |
| GET | `/api/accounting/general-ledger/general-ledger-export-file` | Export file list |
| GET | `/api/accounting/general-ledger/export-progress` | Export progress |
| GET | `/api/accounting/general-ledger/select2/child` | COA filter |

**Auth:** `auth:sanctum`, company scope via `getCompany(true)`.

## 5. Query & balance logic (AS-IS)

### Data source

```
JournalDetail
  JOIN Journal (approved, company)
  JOIN ChartOfAccount + ChartOfAccountClass
  LEFT JOIN polymorphic transaction_reference
  EAGER journal.stores (store_name)   // kolom Store
ORDER BY coa_id ASC, transaction_date ASC
```

### Store column (`store_formatted`)

| Layer | Implementation |
|-------|----------------|
| Display | `journal.stores` → join `store_name`; empty → `-`; multi → `Str::limit(..., 30)` + tooltip HTML stacked |
| Global search | `filterColumn('store_formatted')` → `whereHas('journal.stores', store_name LIKE)` |
| Advanced filter | SearchBuilder handler `$filter['store_formatted']` — IS NULL / IS NOT NULL / LIKE / NOT LIKE on `journal.stores.store_name` |
| Export job | `stores->pluck('store_name')->join(', ')` or `-` |

### Period filter

Applied via DataTables **SearchBuilder** on `trx_date_formatted` — not in `mainQuery` directly.

`resolveStartEndDate()` reads: `period` param, `start`/`end`, or SearchBuilder date criteria.

### Balance columns

- `opening_balance` / `ending_balance` via `JournalReport` — **COA-level** values repeated per row in UI
- **Passiva adjustment** applied inconsistently (export job & `coa_title` vs UI columns)

### Current Profit/Loss UNION

If company has COA "Current Profit/Loss", union rows from `CurrentProfitLossHistory` with `coa_id` replaced.

## 6. Cross-menu data flow (Store → GL)

```
[Transaksi dengan store]
    → auto/manual Journal header
        → accounting_journal_store_pivots
            → GeneralLedgerController (journal.stores)
                → store_formatted / export Store
```

| Upstream menu | Journal origin | Pivot store AS-IS |
|---------------|----------------|-------------------|
| `journal` | Manual | ✅ `JournalController` |
| `accounting-customer-invoice` | `customerInvoiceAutoJournal` | ✅ from SO `store_id` |
| Settlement SI/OB | Outbound + SI auto-journal | ✅ |
| `accounting-settlement-upload` AR (Approve) | `customerPaymentAutoJournal` | ⚠️ gap |
| `accounting-customer-payment` | `customerPaymentAutoJournal` | ⚠️ gap |
| `accounting-credit-note` | `creditNoteAutoJournal` | ⚠️ gap |
| `accounting-debit-note` | `debitNoteAutoJournal` | ⚠️ gap |
| `accounting-sales-return` | `stockSalesReturnAutoJournal` | ✅ `platform_return.store_id` |

Detail gap & aturan bisnis: [requirement.md §9](./requirement.md#9-kolom-store--aturan-bisnis--gap-implementasi).

## 7. TO-BE gaps (see requirement §5–7)

| Gap | Target |
|-----|--------|
| Group header totals | Debit/credit/ending per COA group |
| Running ending balance | Per transaction row in UI & export |
| Passiva consistency | Position-aware formula everywhere |
| Store pivot on AR/CN/DN auto-journal | Align with business rule — requirement §9 |

## 8. DB schema docs

- `docs/db-schema/accounting/accounting_journals.md`
- `docs/db-schema/accounting/accounting_journal_details.md`
- `docs/db-schema/accounting/accounting_chart_of_accounts.md`
- Pivot: `accounting_journal_store_pivots` (journal_id, store_id)

## Related Documents

| Doc | Path |
|-----|------|
| Requirement (AS-IS/TO-BE + Store gap) | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Journal (header store input) | [../journal/technical.md](../journal/technical.md) |
| Settlement Upload | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
| Test cases ETM-15666 | [test-cases/README.md](./test-cases/README.md) |
