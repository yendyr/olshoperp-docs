# Debit Note Refund — Dokumentasi QA

Menu **Debit Note Refund** (Accounting / Account Payable): mencatat uang sisa Debit Note yang dikembalikan supplier.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |

**UI route:** `/accounting/debit-note-refund`  
**Origin:** [ETM-17686](https://erpintegration.atlassian.net/browse/ETM-17686) · prototype: https://claude.ai/artifact/2Gf5AeYbGpuPBe7FAVCWuN  
**3 layer version:** 1.0 · **User-guide:** v1.0 · `source_version` 1.0 · **Last updated:** 2026-11-26  
**Test Case Jira:** ETM-17791 … ETM-17821  
**Related Jira:** [ETM-17655](https://erpintegration.atlassian.net/browse/ETM-17655) · [ETM-17620](https://erpintegration.atlassian.net/browse/ETM-17620) · [ETM-17657](https://erpintegration.atlassian.net/browse/ETM-17657)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-11-26 17:00 | Menu baru: catat uang sisa Debit Note yang dikembalikan supplier; sisa dipakai bersama Account Payment; uang masuk tanpa cek saldo rekening; rumus Adjustment mengikuti Account Receive |

## Related menus

| Menu | Link |
|------|------|
| Debit Note | [../accounting-debit-note/](../accounting-debit-note/) — sumber sisa saldo |
| Account Payment | [../accounting-supplier-payment/](../accounting-supplier-payment/) — memakai sisa Debit Note yang sama |
| Credit Note Refund | [../accounting-credit-note-refund/](../accounting-credit-note-refund/) — kembaran sisi customer |
| Journal | [../journal/](../journal/) — jurnal saat Approve |
| Cash/Bank Account | [../accounting-company-detail-bank/](../accounting-company-detail-bank/) — rekening penerima |

**Maintenance owner:** QA — Yemima
