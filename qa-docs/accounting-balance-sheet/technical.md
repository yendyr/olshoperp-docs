---
doc_type: technical
menu: accounting-balance-sheet
menu_name: "Balance Sheet"
version: 1.0
last_updated: 2026-08-12
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Balance Sheet — Technical Documentation

> **Review** — AS-IS 2026-08-12. Behavior: [requirement v1.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-12 | QA - Yemima | BalanceSheetController, JournalReport beginning/ending helpers, FE DataList |

---

## 1. File Map

| Layer | Path |
|-------|------|
| FE | `olshoperp-frontend/src/pages/Accounting/Report/BalanceSheet/DataList.vue` |
| Routes | `Modules/Accounting/Routes/api.php` — `balance-sheet/report`, `balance-sheet/datalist` |
| Controller | `BalanceSheetController@get_heading_cards`, `@index` |
| Entity / Policy | `BalanceSheet`, `BalanceSheetPolicy` (`menu_link` = `accounting/balance-sheet`) |
| Helper | `JournalReport::getBeginningBalance*`, `getBeginningBalanceClass`, `getBeginningBalanceParent`, `getEndingProfitLoss`, `getCurrentProfitLoss` |
| History | `CurrentProfitLossHistory` |
| Mapping | `getProfitLossCoaIds(getCompany())` |
| Menu | `AccountingMenuSeeder` → `accounting/balance-sheet` |

---

## 2. Invariants

1. Hanya COA class Assets, Liabilities, Equity.  
2. Report & datalist `authorize('viewAny', BalanceSheet)`.  
3. Default `period` kosong → `date('Y-m-d')` (today).  
4. Kartu: `equities = abs(equity class) + getEndingProfitLoss`.  
5. Beginning COA: `DATE(transaction_date) < period`, journal Approved.  
6. Ending P/L: history `≤ period` — **tanpa** Approved filter (GAP-BS-03).  
7. Current P/L (parent Equity): Fiscal Period Open covering `period`; else 0.  
8. Read-only — no export endpoint/UI; no `balance_sheets` table entity.

---

## 3. Cards vs rows (ringkas)

| Surface | Assets | Liabilities | Equity | Current P/L |
|---------|--------|-------------|--------|-------------|
| Cards | Σ beginning (no abs) | abs(Σ beginning) | abs(Σ Equity) + Ending P/L | Ending P/L signed |
| Leaf row | abs(beginning) | abs(beginning) | abs(beginning) | Ending P/L if mapped COA |
| Equity parent row | — | — | abs(parent beginning) + **Current** P/L | — |

→ GAP-BS-01/02: cut-off `<` vs `≤`; Ending vs Current helper mismatch.

---

## 4. Failure modes

| Mode | Sumber |
|------|--------|
| 403 | Policy viewAny |
| Apply no-op | FE `period == ""` |
| Empty table | className mismatch / no COA |
| Odd As-at figures | Cut-off / dual P/L helpers |
| Invalid period string | No BE date validation (GAP-BS-05) |

---

## 5. Data lifecycle

Journal Approved → Journal Detail → agregasi **on-read** (cards + dual datalist). Fiscal Period close dapat menggeser P/L ke Retained via COA/journal close — bukan state machine di entity BalanceSheet.

---

## 6. Known Issues

[requirement §11](./requirement.md#11-gap-registry) — GAP-BS-01…08.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Profit & Loss | [../accounting-profit-loss/technical.md](../accounting-profit-loss/technical.md) |
| Fiscal Period | [../accounting-fiscal-period/technical.md](../accounting-fiscal-period/technical.md) |
