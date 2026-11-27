# Credit Note Refund — Dokumentasi QA

Menu **Credit Note Refund** (Accounting / Account Receivable): mengembalikan uang sisa Credit Note ke customer.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v1.1) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) (v1.1) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v1.1) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v1.1) | Publish eksternal (Notion/Lark) | review |

**UI route:** `/accounting/credit-note-refund`  
**Origin:** [ETM-17655](https://erpintegration.atlassian.net/browse/ETM-17655) · prototype: https://claude.ai/artifact/XuJtr2bgsH5Mnn4tuoQ8t8 · **[ETM-17829](https://erpintegration.atlassian.net/browse/ETM-17829)** (Exchange Gain)  
**3 layer version:** 1.1 · **User-guide:** v1.1 · `source_version` 1.1 · **Last updated:** 2026-11-27  
**Test Case Jira:** ETM-17757 … ETM-17790 · valas: [ETM-17787](https://erpintegration.atlassian.net/browse/ETM-17787)  
**Related Jira:** [ETM-17620](https://erpintegration.atlassian.net/browse/ETM-17620) · [ETM-17657](https://erpintegration.atlassian.net/browse/ETM-17657) · [ETM-17686](https://erpintegration.atlassian.net/browse/ETM-17686)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-11-27 09:35 | TO-BE ETM-17829: kolom/summary Exchange Gain + rumus/jurnal selisih kurs konsisten Account Payment [yemimadocs] |
| 1.0 | 2026-11-26 17:00 | Menu baru: refund sisa Credit Note ke customer lewat Cash/Bank; sisa Credit Note dipakai bersama Account Receive; customer General atau store Platform; saldo Cash/Bank dicek saat isi dan saat Approve |

## Related menus

| Menu | Link |
|------|------|
| Credit Note | [../accounting-credit-note/](../accounting-credit-note/) — sumber sisa saldo yang di-refund |
| Account Receive | [../accounting-customer-payment/](../accounting-customer-payment/) — memakai sisa Credit Note yang sama |
| Debit Note Refund | [../accounting-debit-note-refund/](../accounting-debit-note-refund/) — kembaran sisi supplier |
| Journal | [../journal/](../journal/) — jurnal saat Approve |
| Cash/Bank Account | [../accounting-company-detail-bank/](../accounting-company-detail-bank/) — rekening uang keluar |

**Maintenance owner:** QA — Yemima
