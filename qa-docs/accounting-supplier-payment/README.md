# Account Payment — Dokumentasi QA

Menu **Account Payment** (Accounting / Account Payable).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | draft |

**UI route:** `/accounting/supplier-payment`  
**Help Center overview:** [`_meta/docs-hub/menus/accounting-supplier-payment/`](../_meta/docs-hub/menus/accounting-supplier-payment/)  
**PM source:** `account-payment-requirement.md` (29 Okt 2025) + Import AP (Apr 2026)  
**Upstream:** [Purchase Invoice](../accounting-supplier-invoice/)  
**3 layer version:** KB 2.3 · requirement/technical 2.2 · **User-guide:** v1.1 · `source_version` 2.2 · **Feature Map:** 1.0 · **Last updated:** 2026-07-29

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-07-05 | Requirement v2 — PI allocation, journal, gaps |
| 2.1 | 2026-07-06 | Full PM merge: multi-source, balancing, import AP |
| 2.2 | 2026-07-17 | Compliance qa-docs-standard; user-guide v1.0 |
| 2.3 | 2026-07-29 | Feature Map + 6 capability cards; KB rewrite operator; UG v1.1 (SF tags, review); Help Center overview en/id |

## Related menus

| Menu | Link |
|------|------|
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — sumber hutang |
| Debit Note | [../accounting-debit-note/](../accounting-debit-note/) — payment source potong hutang; import AP spawn DN |
| Purchase Return | [../accounting-purchase-return/](../accounting-purchase-return/) — sumber DN retur billed |
| Purchase Inbound | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) — barang masuk sebelum PI |
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) — acuan harga/biaya |

**Maintenance owner:** QA — Yemima

> Test cases (non-canonical): [test-cases/](./test-cases/)
