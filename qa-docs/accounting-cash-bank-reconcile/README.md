# Cash/Bank Reconcile — Dokumentasi QA

Menu **Cash/Bank Reconcile** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| Test Cases (ETM-15298 Auto-match) | [test-cases/README.md](./test-cases/README.md) | QA | draft |
| Sumber skenario auto-match | [testcase-auto-match-cbr-ap-ar.md](./testcase-auto-match-cbr-ap-ar.md) | QA | draft |

**SoT:** `cash_bank_reconcile_requirement.md` v1.1 (16 Jul 2026)  
**Version:** 1.2 · **Last updated:** 2026-07-17  
**UI route:** `/accounting/cash-bank-reconcile` · **Prefix:** `BR-`

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Placeholder pending |
| 1.2 | 2026-07-17 | Rewrite SoT v1.1 + AS-IS: matching/import/approve; gap CBR-01..12; period lock missing |
| 1.3 | 2026-07-21 | Pindah test cases ETM-15298 (auto-match AP/AR) dari implementation-card |
| 1.4 | 2026-07-21 | Renumber TC draft → TC-CBRAM-01 … TC-CBRAM-14 |

## Related menus

| Menu | Link |
|------|------|
| Journal | Create dari modal matching; sumber GL Approved |
| Master Cash/Bank | Opsi Cash Bank Account |
| GL Reports | Tampilan status Reconciled (lifecycle flag) |

**Maintenance owner:** QA — Yemima
