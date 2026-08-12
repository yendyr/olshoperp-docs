# Fiscal Period — Dokumentasi

Menu **Fiscal Period** (Finance Accounting → Master) — master rentang tanggal pembukuan; Open memungkinkan transaksi, Closed mengunci tanggal secara permanen + auto-journal P/L.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (TC-FP-001…004) |

**PM source:** Fiscal Period Source of Truth **v1.0** (7 Agustus 2026)  
**Canonical slug:** `accounting-fiscal-period`  
**3 layer version:** 1.0 · **User-guide:** 1.0  
**Maintenance owner:** QA — Yemima

**UI route:** `/accounting/fiscal-period`

**Help Center overview:** [ID](../_meta/docs-hub/menus/accounting-fiscal-period/overview.id.md) · [EN](../_meta/docs-hub/menus/accounting-fiscal-period/overview.en.md) (authored v1.0)

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul UI | Finance Accounting → Master |
| UI | `/accounting/fiscal-period` |
| Backend | `Modules/Accounting` — `FiscalPeriod` |
| Gate global | `validate_fiscal_period()` (`MainHelper`) |
| FE | `pages/Accounting/master/FiscalPeriod/` |

## Related menus

- [Cash Bank Reconcile](../accounting-cash-bank-reconcile/README.md)  
- [Chart of Account](../accounting-chart-of-account/README.md)  
- Internal / General Company (COA Current & Retained P/L)

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-07 | 1.0 | Full 5-file dari SoT v1.0; Gap `GAP-FP-01..07` (FP-08 closed) |
| 2026-08-07 | HC 1.0 | Help Center overview ID + EN dari file authored user (Fiscal Period) |
