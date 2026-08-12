---
doc_type: technical
menu: accounting-profit-loss
menu_name: "Profit & Loss"
version: 1.0
last_updated: 2026-08-12
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Profit & Loss — Technical Documentation

> **Review** — AS-IS P&L v2 (2026-08-12). Behavior: [requirement v1.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-12 | QA - Yemima | indexV2, JournalReport, export jobs, FE PeriodFilter/TableByPeriod |

---

## 1. File Map

| Layer | Path |
|-------|------|
| Routes | `Modules/Accounting/Routes/api.php` — `profit-loss/v2`, `profit-loss/v2/exports*` |
| Controller | `ProfitLossController@indexV2`, `getBalance` |
| Export API | `ProfitLossExportController` |
| Jobs | `ProfitLossExportChunkJob`, `ProfitLossExportCombineJob` |
| Export | `Modules/Accounting/Exports/ProfitLossExport.php` |
| Entity | `ProfitLoss`, `ProfitLossExportFile`, `CurrentProfitLossHistory` |
| Policy | `ProfitLossPolicy` (`menu_link` = `accounting/profit-loss`) |
| Helper | `app/Helpers/Accounting/JournalReport.php` — `getInPeriodBalance*`, `getInPeriodProfitLoss*` |
| FE | `olshoperp-frontend/src/pages/Accounting/Report/ProfitLoss/**` — `DataList.vue`, `PeriodFilter.vue`, `TableByPeriod.vue`, `ExportLog.vue` |
| Menu | `AccountingMenuSeeder` → `accounting/profit-loss` |

---

## 2. Invariants

1. Hanya COA class: Revenue, Other Revenue & Expenses, Cost Of Goods Sold, Expense.  
2. Leaf/parent balance: journal `transaction_status = Approved`; nilai `debit`/`credit` (IDR).  
3. `periods` = jumlah pembanding; kolom balance = `periods + 1` (UI max 12).  
4. Row-group total = sum leaf only (`children_exists` = false).  
5. Export privilege = `viewAny` ProfitLoss; empty → *"There is no data to export"*.  
6. Read-only — tidak menulis journal / mengubah saldo.  
7. Whole-month selected range → BE mundur `subMonth` start/end of month (bukan fixed day window).  
8. Current P/L via history path — query AS-IS **tanpa** filter Approved.

---

## 3. Multi-period keys

- Balance column key: `balance-{dd-MM-yyyy}_{dd-MM-yyyy}`.  
- FE duration (non-month): `diffDays + 1`.  
- BE duration (non-month): Carbon `diffInDays` (no +1) → **GAP-PL-04** mismatch risk.  
- Difference %: `((current − previous) / |previous|) × 100`; prev=0 → ±100 AS-IS.

---

## 4. Export

1. POST export with `from`, `to`, `periods` (+ URL filters).  
2. Four chunk jobs (one per COA class) → combine Excel.  
3. Progress via export log UI.

---

## 5. Failure modes

| Failure | Effect |
|---------|--------|
| ValidationException from/to/periods | 422 |
| Export no data | Error message |
| Timeout / slow | Large periods × COA × per-cell balance (no range cap) |
| FE empty vs BE | Balance key mismatch FE/BE duration |
| Privilege | Export gated; `indexV2` authorize gap (GAP-PL-16) |

---

## 6. Data lifecycle

Journal Approved (SI/PI/Payment/Outbound/…) → Journal Detail → agregasi P&L **on read** → optional `ProfitLossExportFile` async. Entity `ProfitLoss` = policy marker (no document state machine).

---

## 7. Known Issues

[requirement §11](./requirement.md#11-gap-registry) — GAP-PL-01…17.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Dev P&L | [../accounting-profit-loss-v1/technical.md](../accounting-profit-loss-v1/technical.md) |
| Journal | [../journal/technical.md](../journal/technical.md) |
