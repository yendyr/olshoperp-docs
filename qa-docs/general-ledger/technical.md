---
doc_type: technical
menu: general-ledger
menu_name: "General Ledger Report"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# General Ledger Report — Technical Documentation

## 1. Architecture Overview

Read-only report. Data from approved `JournalDetail` rows grouped by COA, with optional UNION to `CurrentProfitLossHistory`.

**No create/update** — `GeneralLedgerController` except `index`, `exportExcel`, export file endpoints.

## 2. Frontend

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/Accounting/Report/GeneralLedger/DataList.vue` | Main UI |
| `src/components/project/DataTables/DataTablesV3.vue` | Grid + SearchBuilder filters |
| `src/components/project/DataTables/ExportFileTable.vue` | Async export list |

**Route:** `accounting_general-ledger_index` → `/accounting/general-ledger`

## 3. Backend

| File | Role |
|------|------|
| `Modules/Accounting/Http/Controllers/GeneralLedgerController.php` | `index`, export, select2 |
| `app/Helpers/Accounting/JournalReport.php` | `getBeginningBalance()`, `getEndingBalance()` |
| `Modules/Accounting/Jobs/GeneralLedgerExportJob.php` | Async Excel |
| `Modules/Accounting/Exports/GeneralLedgerExport.php` | Column mapping |
| `Modules/Accounting/Policies/GeneralLedgerPolicy.php` | Menu permission |
| `Modules/Accounting/Entities/Journal.php` | Header |
| `Modules/Accounting/Entities/JournalDetail.php` | Line items |
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
ORDER BY coa_id ASC, transaction_date ASC
```

### Period filter

Applied via DataTables **SearchBuilder** on `trx_date_formatted` — not in `mainQuery` directly.

`resolveStartEndDate()` reads: `period` param, `start`/`end`, or SearchBuilder date criteria.

### Balance columns

- `opening_balance` / `ending_balance` via `JournalReport` — **COA-level** values repeated per row in UI
- **Passiva adjustment** applied inconsistently (export job & `coa_title` vs UI columns)

### Current Profit/Loss UNION

If company has COA "Current Profit/Loss", union rows from `CurrentProfitLossHistory` with `coa_id` replaced.

## 6. TO-BE gaps (see requirement §5–7)

| Gap | Target |
|-----|--------|
| Group header totals | Debit/credit/ending per COA group |
| Running ending balance | Per transaction row in UI & export |
| Passiva consistency | Position-aware formula everywhere |

## 7. DB schema docs

- `docs/db-schema/accounting/accounting_journals.md`
- `docs/db-schema/accounting/accounting_journal_details.md`
- `docs/db-schema/accounting/accounting_chart_of_accounts.md`

## Related Documents

| Doc | Path |
|-----|------|
| Requirement (AS-IS/TO-BE detail) | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
