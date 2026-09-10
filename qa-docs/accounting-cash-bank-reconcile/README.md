# Cash/Bank Reconcile — Dokumentasi QA

Menu **Cash/Bank Reconcile** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | — | End-user | pending (3 layer masih draft) |
| Help Center overview | — | Docs Page | belum ada |
| Test Cases (ETM-15298 Auto-match) | [test-cases/README.md](./test-cases/README.md) | QA | draft |
| Sumber skenario auto-match | [testcase-auto-match-cbr-ap-ar.md](./testcase-auto-match-cbr-ap-ar.md) | QA | draft |
| Matching slideover brief | [../_meta/sot/cbr-matching-slideover-brief.md](../_meta/sot/cbr-matching-slideover-brief.md) | PM, Dev | TO-BE ETM-15856 |

**SoT:** `cash_bank_reconcile_requirement.md` v1.1 (16 Jul 2026)  
**Version:** 1.5 · **Last updated:** 2026-09-10 10:36  
**UI route:** `/accounting/cash-bank-reconcile` · **Prefix:** `BR-`  
**Jira matching UI:** [ETM-15856](https://erpintegration.atlassian.net/browse/ETM-15856)  
**Mockup:** https://claude.ai/code/artifact/30842e2e-3647-485f-b96c-d54a6000f274

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Placeholder pending |
| 1.2 | 2026-07-17 | Rewrite SoT v1.1 + AS-IS: matching/import/approve; gap CBR-01..12; period lock missing |
| 1.3 | 2026-07-21 | Pindah test cases ETM-15298 (auto-match AP/AR) dari implementation-card |
| 1.4 | 2026-07-21 | Renumber TC draft → TC-CBRAM-01 … TC-CBRAM-14 |
| 1.5 | 2026-09-10 10:36 | Matching Slideover dua arah + Quick Journal (TO-BE ETM-15856): POV bank↔GL, difference bar, Match manual setelah auto-select journal, bank import-only, quick journal ringkas tanpa attachment/store/ref |

## Related menus

| Menu | Link |
|------|------|
| Journal | Sumber GL Approved; TO-BE Quick Journal dari matching; draft menunggu approve di sini |
| Master Cash/Bank | Opsi Cash Bank Account |
| GL Reports | Tampilan status Reconciled (lifecycle flag) |

**Maintenance owner:** QA — Yemima
