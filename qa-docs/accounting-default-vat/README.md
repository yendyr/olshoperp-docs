# Default VAT — Dokumentasi

Menu **Default VAT** (Finance Accounting → Master) — template VAT Purchase/Sales per company yang di-seed ke Product Tax saat create/import System Product.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (TC-DVAT-DRAFT-*) |

**PM source:** Default VAT Source of Truth **v1.0** (5 Agustus 2026)  
**3 layer version:** 1.0 · **User-guide:** 1.0 (`source_version` 1.0)  
**Maintenance owner:** QA — Yemima

**UI route:** `/accounting/default-vat`

**Help Center overview:** [ID](../_meta/docs-hub/menus/accounting-default-vat/overview.id.md) · [EN](../_meta/docs-hub/menus/accounting-default-vat/overview.en.md) (authored v1.0)

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | Finance Accounting → Master |
| UI | `/accounting/default-vat` |
| API | `accounting/default-vat` |

## Related menus

- [Tax](../accounting-tax/README.md) — sumber Select VAT + mirror  
- [System Product](../system-product/README.md) — seed Product Tax  
- [Purchase Order](../supplychain-purchase-order/README.md) — konsumsi Product Tax  
- [General Company](../generalsetting-general-company/README.md) — auto-add setting paralel  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-05 | 1.0 | Full 5-file dari SoT v1.0; Gap `GAP-DV-01..04`; auto-save + seed semantics |
| 2026-08-05 | HC 1.0 | Help Center overview ID + EN dari file authored user (Default VAT) |
