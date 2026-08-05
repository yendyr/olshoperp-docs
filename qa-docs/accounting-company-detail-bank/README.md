# Cash/Bank Account — Dokumentasi

Menu **Cash/Bank Account** (Finance Accounting → Master) — master rekening kas/bank + binding COA Assets leaf & currency.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (TC-CBA-001…004) |

**PM source:** Cash/Bank Account Source of Truth **v1.0** (5 Agustus 2026)  
**Canonical slug:** `accounting-company-detail-bank` (SoT key: `accounting-cash-bank-account`)  
**3 layer version:** 1.0 · **User-guide:** 1.0  
**Maintenance owner:** QA — Yemima

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul UI | Finance Accounting → Master |
| UI | `/accounting/company-detail-bank` |
| Backend | `Modules/GeneralSetting` — `CompanyDetailBank` |
| FE | `pages/Accounting/master/CashBankAccount/` |

## Related menus

- [Chart of Account](../accounting-chart-of-account/README.md)  
- [Cash Bank Reconcile](../accounting-cash-bank-reconcile/README.md)  
- [Product COA Group](../accounting-product-coa-group/README.md) — TO-BE COA exclusion  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-05 | 1.0 | Full 5-file dari SoT v1.0; Gap `GAP-CBA-01..05` |
