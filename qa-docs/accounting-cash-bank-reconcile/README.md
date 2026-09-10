# Cash/Bank Reconcile — Dokumentasi QA

Menu **Cash/Bank Reconcile** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |
| Help Center overview | — | Docs Page | ditunda |
| Test Cases (ETM-15298 Auto-match) | [test-cases/README.md](./test-cases/README.md) | QA | draft |
| Matching slideover brief | [../_meta/sot/cbr-matching-slideover-brief.md](../_meta/sot/cbr-matching-slideover-brief.md) | PM, Dev | TO-BE ETM-15856 |

**SoT:** `cash_bank_reconcile_requirement.md` v1.1 (16 Jul 2026)  
**3 layer + UG:** v1.6 · user-guide v1.0 (`source_version` 1.6) · Feature Map 1.0  
**Last updated:** 2026-09-10 10:44  
**UI route:** `/accounting/cash-bank-reconcile` · **Prefix:** `BR-`  
**Jira matching UI:** [ETM-15856](https://erpintegration.atlassian.net/browse/ETM-15856)  
**Mockup:** https://claude.ai/code/artifact/30842e2e-3647-485f-b96c-d54a6000f274

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Placeholder pending |
| 1.2 | 2026-07-17 | Rewrite SoT v1.1 + AS-IS: matching/import/approve; gap CBR-01..12 |
| 1.3 | 2026-07-21 | Pindah test cases ETM-15298 (auto-match AP/AR) |
| 1.4 | 2026-07-21 | Renumber TC draft → TC-CBRAM-01 … TC-CBRAM-14 |
| 1.5 | 2026-09-10 10:36 | Matching Slideover dua arah + Quick Journal (TO-BE ETM-15856); keputusan D1–D5 |
| 1.6 | 2026-09-10 10:44 | Promote KB/requirement/technical ke review; user-guide v1.0; Feature Map + 5 Lingo cards (SF-CBR-01…05); overview Help Center ditunda |

## Related menus

| Menu | Link |
|------|------|
| Journal | Sumber GL Approved; TO-BE Quick Journal dari matching |
| Master Cash/Bank | Opsi Cash Bank Account |
| GL Reports | Status Reconciled (lifecycle flag) |

**Maintenance owner:** QA — Yemima
