# Product COA Group — Dokumentasi

Menu **Product COA Group** (Finance Accounting → Master) — template mapping COA per tipe System Product untuk auto-journal transaksi.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (TC-PCG-001…006) |

**PM source:** Product COA Group Source of Truth **v1.0** (5 Agustus 2026)  
**3 layer version:** 2.0 · **User-guide:** 1.0 (`source_version` 2.0)  
**Maintenance owner:** QA — Yemima

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | Finance Accounting → Master |
| UI | `/accounting/product-coa-group` |
| API | `accounting/product-coa-group` |

## Related menus

- [System Product](../system-product/README.md) — assign group  
- [Chart of Account](../accounting-chart-of-account/README.md) — leaf COA  
- [Tax](../accounting-tax/README.md) — PPN (terpisah)  
- [Instant Settlement](../accounting-settlement-upload/README.md) — retry journal mapping terkini  
- [Cash/Bank Account](../accounting-company-detail-bank/README.md) — GAP-PCG-03 exclusion  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-05 | 2.0 | Full 5-file dari SoT v1.0; Gap `GAP-PCG-01..05`; Default = 1 per company |
| 2026-08-04 | 1.3 | Draft Cash/Bank TO-BE (digantikan) |
