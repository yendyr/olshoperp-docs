# BETA - New Purchase Inbound — Dokumentasi QA

Menu **Purchase Inbound (GRN)** — UI BETA dengan fitur **COLLI**. Backend shared dengan legacy Purchase Inbound.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | draft |

**PM sources:** `purchase-inbound-requirement.md` v1.0 · COLLI BETA v2.0/v2.1  
**3 layer version:** 2.3 · **User-guide:** v1.1 · `source_version` 2.3 · **Last updated:** 2026-07-23

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft AS-IS |
| 2.0 | 2026-07-05 | Full PM merge: standard GRN + COLLI, journal, import, gaps |
| 2.1 | 2026-07-05 | Service (no stock) + Fix Asset (Assets debit) by Product COA Group type |
| 2.2 | 2026-07-17 | Compliance qa-docs-standard (5-file); technical invariants/failure modes; tambah user-guide v1.0 |
| 2.3 | 2026-07-23 | Cross-ref Rounding SoT PO; GRN amount = price before VAT; VAT only at PI; UG v1.1 |

## Related menus

| Menu | Link |
|------|------|
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) — sumber outstanding |
| Purchase Inbound (legacy) | [../supplychain-mutation-inbound/](../supplychain-mutation-inbound/) — API sama, UI lama |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — tagihan + PPN |

**Maintenance owner:** QA — Yemima
