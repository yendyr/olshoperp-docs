# Credit Note — Dokumentasi QA

Menu **Credit Note** (Accounting / Account Receivable).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | draft |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (9 DRAFT, ETM-15442; 1 E2E **failed**) |

**UI route:** `/accounting/credit-note`  
**Help Center overview:** [`_meta/docs-hub/menus/accounting-credit-note/`](../_meta/docs-hub/menus/accounting-credit-note/)  
**SoT:** `accounting-credit-note-source-of-truth.md` v1.0 (17 Jul 2026)  
**3 layer version:** 1.1 · **User-guide:** v1.2 · `source_version` 1.1 · **Feature Map:** 1.0 · **Last updated:** 2026-08-05

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-08-05 | TO-BE Receiving Destination free COA (GAP-CN-05); SF-DET-01 dual path; Help Center overview sync |
| 1.0 | 2026-07-17 | Docs awal dari SoT v1.0: konsep CN/Payment, import all-or-nothing, auto Sales Return billed, AR deposit, gaps CN-01–04; user-guide v1.0 |
| 1.0b | 2026-07-29 | Feature Map + 5 capability cards; UG v1.1 (SF tags, status review); Help Center overview en/id |

## Related menus

| Menu | Link |
|------|------|
| Sales Invoice | [../accounting-customer-invoice/](../accounting-customer-invoice/) — trx ref / billed |
| Sales Return Approval | [../accounting-sales-return/](../accounting-sales-return/) — auto-generate CN billed |
| Sales Return (SC) | [../supplychain-sales-returns/](../supplychain-sales-returns/) — qty/nilai retur |
| Account Receive | [../accounting-customer-payment/](../accounting-customer-payment/) — pakai CN sebagai deposit |
| Debit Note (mirror AP) | [../accounting-debit-note/](../accounting-debit-note/) — klaim supplier; dipakai di Account Payment |
| Journal | [../journal/](../journal/) — auto journal approve |
| Store Binding | [../omni-store-binding/](../omni-store-binding/) — Deposit COA Platform |
| Cash/Bank Account | [../accounting-company-detail-bank/](../accounting-company-detail-bank/) — Receiving Cash/Bank; COA bound exclude free picker |

**Maintenance owner:** QA — Yemima
