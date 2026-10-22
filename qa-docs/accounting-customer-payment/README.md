# Account Receive — Dokumentasi

Menu **Account Receive** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | End user | review |
| Test Cases | [test-cases/README.md](./test-cases/README.md) | QA, Manual Tester | review |

**Menu terkait:** [Sales Invoice](../accounting-customer-invoice/README.md) (sumber piutang yang dilunasi) · [Credit Note](../accounting-credit-note/README.md) (sumber dana deposit sekaligus hasil kelebihan bayar) · [Instant Settlement](../accounting-settlement-upload/README.md) (Approve settlement membentuk dokumen AR otomatis)

**PM source:** `_meta/sot/accounting-customer-payment-source-of-truth.md` v1.0 — dari raw requirement Import AR v3.0 (April 2026) + verifikasi codebase.

**Maintenance owner:** QA — Yemima

## Navigasi

| Item | Nilai |
|------|-------|
| Sidebar | Accounting → **Account Receive** |
| Route UI | `/accounting/customer-payment` |
| Test Case Library | `/test-case-library?menu=accounting-customer-payment` |

**Open CR:** [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) — Summary section setelah Adjustment (sibling AP [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643))  
**Layer version:** requirement **2.3** · user-guide **1.1** · **Last updated:** 2026-10-22  
**Related Jira:** [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.3 | 2026-10-22 | TO-BE ETM-16764: Payment Source CN stamp COA dari asal CN (SR → Deposit of Sales Return) |
| 2.2 | 2026-10-19 | TO-BE ETM-16644: Section Summary (header CCY, CN terpisah, tanda Credit+/Debit−, Total orange jika ≠ 0) |
| 2.1 | 2026-09-01 17:05 | Cross-ref Instant Settlement ETM-15701: AR date/time dari SI + guard same calendar date |
| 2.0 | 2026-08-31 | Split dari SoT v1.0 — Import AR multi-sheet, validasi terverifikasi codebase, Gap Registry GAP-AR-01..09; technical.md & user-guide.md dibuat; 3 layer naik ke review |
| 1.1 | 2026-06-26 | Test cases AR detail insert (single/bulk use, bulk select) |
| 1.0 | 2026-06-23 | Cross-reference Relasi Instant Settlement (Fase 1) |
