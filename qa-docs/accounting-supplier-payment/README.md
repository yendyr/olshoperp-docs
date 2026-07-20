# Account Payment — Dokumentasi QA

Menu **Account Payment** (Accounting / Account Payable).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | draft |

**PM source:** `account-payment-requirement.md` (29 Okt 2025 MVP) + Import AP Relational (Apr 2026)  
**3 layer version:** 2.2 · **User-guide:** v1.0 · `source_version` 2.2 · **Last updated:** 2026-07-17 · **Prefix:** `PY-`

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-07-05 | Initial PI allocation + journal |
| 2.1 | 2026-07-06 | Full PM merge: multi-source, sections A–E, balancing, import, relasi DN/Cash-Bank/PI/PR |
| 2.2 | 2026-07-17 | Compliance qa-docs-standard (5-file); technical invariants/failure modes; tambah user-guide v1.0 |

## Related menus

| Menu | Link |
|------|------|
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — outstanding hutang |
| Debit Note | [../accounting-debit-note/](../accounting-debit-note/) — sumber potongan |
| Purchase Return | [../accounting-purchase-return/](../accounting-purchase-return/) — asal DN retur |
| Purchase Inbound | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) — hulu penerimaan |
| Cash Bank Reconcile | [../accounting-cash-bank-reconcile/](../accounting-cash-bank-reconcile/) — saldo rekening |

**Maintenance owner:** QA — Yemima
