# Tax — Dokumentasi

Menu **Tax** (Finance Accounting → Master) — master tarif PPN + mapping Purchase/Sales COA untuk penjurnalan VAT.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (TC-TAX-001…004) |

**PM source:** Tax Source of Truth **v1.0** (5 Agustus 2026)  
**3 layer version:** 1.0 · **User-guide:** 1.0 (`source_version` 1.0)  
**Maintenance owner:** QA — Yemima

**UI route:** `/accounting/tax`

**Help Center overview:** [ID](../_meta/docs-hub/menus/accounting-tax/overview.id.md) · [EN](../_meta/docs-hub/menus/accounting-tax/overview.en.md) (authored v1.0)

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | Finance Accounting → Master |
| UI | `/accounting/tax` |
| API | `accounting/tax` |

## Related menus

- [Chart of Account](../accounting-chart-of-account/README.md) — Activa / Passiva  
- [System Product](../system-product/README.md) — bind purchase/sales tax  
- [Purchase Order](../supplychain-purchase-order/README.md) — tax lines + snapshot  
- [Purchase Invoice](../accounting-supplier-invoice/README.md) — journal dari snapshot  
- [General Company](../generalsetting-general-company/README.md) — auto-add VAT  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-05 | 1.0 | Full 5-file dari SoT v1.0; Gap `GAP-TAX-01..06`; PI snapshot vs SI live; Coefficient 11/12 |
| 2026-08-04 | 0.x | Draft awal (digantikan) |
| 2026-08-05 | HC 1.0 | Help Center overview ID + EN dari file authored user (Master Tax) |
