---
doc_type: technical
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.3
last_updated: 2026-11-06
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Trial Balance — Technical Documentation

> v1.3 — AS-IS + TO-BE [ETM-17077](https://erpintegration.atlassian.net/browse/ETM-17077) kolom **Balance** · [ETM-17078](https://erpintegration.atlassian.net/browse/ETM-17078) Column Show & Hide · [ETM-17079](https://erpintegration.atlassian.net/browse/ETM-17079) export header Period.

## 1. Architecture Overview

Read-only report. **No CRUD.** `TrialBalanceController@index` serves DataTables JSON per COA class. `TrialBalance` entity is empty — used only for `TrialBalancePolicy`. All balance math in `JournalReport`.

```mermaid
flowchart TB
    subgraph FE["DataList.vue only"]
        DP[VueDatePicker period]
        DT1[DataTables Assets]
        DT2[DataTables Liabilities]
        DTN["... 5 more tables"]
    end

    subgraph BE["TrialBalanceController"]
        IDX[index]
    end

    subgraph Helper["JournalReport"]
        BD[getBeginningDebit]
        BC[getBeginningCredit]
        ID[getInPeriodDebit]
        IC[getInPeriodCredit]
        PAR[Parent rollup helpers]
        PL[Profit/Loss COA helpers]
    end

    subgraph DB[("accounting_journals\naccounting_journal_details\naccounting_chart_of_accounts")]
    end

    DP --> DT1 & DT2 & DTN
    DT1 -->|"GET datalist?className=assets"| IDX
    IDX --> Helper
    Helper --> DB
```

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/Accounting/Report/TrialBalance/`

| File | Role | Key API |
|------|------|---------|
| `DataList.vue` | **Satu-satunya** halaman UI | 7x `GET accounting/trial-balance/datalist` |

Tidak ada `Form.vue`, create route, atau action buttons.

**Route:** `accounting_trial-balance_index` → `/accounting/trial-balance`

### 2.1 DataTables instances (7)

| UI Section | `className` param |
|------------|-------------------|
| Assets | `assets` |
| Liabilities | `liabilities` |
| Equity | `equity` |
| Revenues | `revenue` |
| Other Revenues & Expenses | `other revenue & expenses` |
| Expenses | `expense` |
| Other Cost of Goods Sold | `cost of goods sold` |

Shared props: `trial_balance=true`, `pageLength=1000`, `with_default_columns=false`, `filter_column=false`.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/Accounting/Http/Controllers/TrialBalanceController.php` | `index` only |
| `Modules/Accounting/Policies/TrialBalancePolicy.php` | `menu_link = accounting/trial-balance` |
| `Modules/Accounting/Entities/TrialBalance.php` | Policy model placeholder |
| `Modules/Accounting/Entities/ChartOfAccount.php` | Query source |
| `app/Helpers/Accounting/JournalReport.php` | All balance calculations |
| `Modules/Accounting/Routes/api.php` | `GET trial-balance/datalist` |

## 4. API Routes

| Method | Path | Role |
|--------|------|------|
| GET | `/api/accounting/trial-balance/datalist` | DataTables JSON |
| POST/GET | `/api/accounting/trial-balance/export-excel` (via controller `exportExcel`) | Queue export job |
| GET | `/api/accounting/trial-balance/export-file` | Riwayat file export |
| GET | `/api/accounting/trial-balance/export-progress` | Progress counter |

**Query params (datalist):**

| Param | Required | Description |
|-------|----------|-------------|
| `className` | Yes | COA class name filter |
| `period` | No | `start,end` dates; default today |

**Export (ETM-17079):** `exportExcel` parse `period` sama datalist → `TrialBalanceExportJob` → `TrialBalanceExport`. Header baris 1: `OlshopERP | Trial Balance Period {d-m-Y} - {d-m-Y}` (merge `A1:L1`, center). Kolom baris 2 mencakup Beginning/In Period/Ending **Balance**. Entity `TrialBalanceExportFile`.

**Column Show & Hide (ETM-17078):** FE `ColumnVisibility.vue` di slot `#initial_dom_action` DataTablesV3 (Assets table). `columns[].select_name` label opsi (contoh `Beginning Balance - Debit`). `:tables="trialBalanceTables"` menyinkronkan visibilitas ke semua 7 DataTables di halaman. Komponen generic di `src/components/project/DataTables/components/`.

Commented/disabled in `api.php`: `Route::resource('/trial-balance', ...)`, per-class legacy actions.

## 5. Controller logic summary

1. Authorize `viewAny` on `TrialBalance::class`
2. Parse `period` → `$start_date`, `$end_date` (default: today)
3. Query `ChartOfAccount` where class name = `className`, with `coaTree` for hierarchy
4. Order by parsed COA code segments (numeric hierarchy)
5. For each row, compute 6 amount pairs via `JournalReport`:
   - `beginning_debit` / `beginning_credit`
   - `in_period_debit` / `in_period_credit`
   - `ending_debit` / `ending_credit` (= beginning + in-period per side)
6. Special branch if `coa_id == current_profit_loss_id`
7. Parent COA uses `*Parent` helpers when `all_childs()->exists()`
8. **TO-BE ETM-17077:** derive 3 Balance columns from Debit/Credit + `chart_of_account_class.position` (see §5.1)

### 5.1 TO-BE — kolom Balance (ETM-17077)

| Suggested column `data` | Source Debit/Credit | After UI column |
|-------------------------|---------------------|-----------------|
| `beginning_balance` (+ `_number` for footer) | beginning_debit / beginning_credit | after `beginning_credit` |
| `in_period_balance` (+ `_number`) | in_period_debit / in_period_credit | after `in_period_credit` |
| `ending_balance` (+ `_number`) | ending_debit / ending_credit | after `ending_credit` |

```text
position == 'Activa'  → balance = debit - credit
position == 'Passiva' → balance = credit - debit
# signed; negative stays negative
```

- Load `chart_of_account_class.position` on the COA query (already with class for filter).
- FE `DataList.vue`: insert 3 columns titled **BALANCE** (or **Balance**); update `columnWithFooter` indices (currently `[2,3,4,5,6,7]` for 6 amount cols — becomes 9 amount cols).
- Do **not** change JournalReport Debit/Credit helpers for this card — Balance is a presentation/derived field on TB response.

## 6. JournalReport methods used

| Method | Use |
|--------|-----|
| `getBeginningDebit` / `getBeginningCredit` | Leaf COA opening |
| `getBeginningDebitParent` / `getBeginningCreditParent` | Parent opening |
| `getInPeriodDebit` / `getInPeriodCredit` | Period movement |
| `getInPeriodDebitParent` / `getInPeriodCreditParent` | Parent movement |
| `getBeginningProfitLossDebit/Credit` | Current P/L COA |
| `getInPeriodProfitLossDebit/Credit` | P/L in period |
| `getEndingProfitLossDebit/Credit` | P/L ending |

Company helpers: `getProfitLossCoaIds(getCompany())`.

## 7. Database — no trial balance table

Trial Balance tidak punya tabel persistensi. Data live dari:

- `accounting_chart_of_accounts`
- `accounting_chart_of_account_classes`
- `accounting_journals` (approved)
- `accounting_journal_details`

## 8. Related docs

- [general-ledger/technical.md](../general-ledger/technical.md) — shared `JournalReport`
- `docs/api/accounting/routes.md` — route index
