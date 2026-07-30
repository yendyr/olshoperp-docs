# BETA - New Purchase Inbound — Dokumentasi QA

Menu **Purchase Inbound (GRN)** — UI BETA dengan fitur **COLLI**. Backend shared dengan legacy Purchase Inbound.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | draft |

**UI route (BETA):** `/supplychain/new-purchase-inbound`  
**Help Center overview:** [`_meta/docs-hub/menus/supplychain-new-purchase-inbound/`](../_meta/docs-hub/menus/supplychain-new-purchase-inbound/)  
**PM sources:** `purchase-inbound-requirement.md` v1.0 · COLLI BETA v2.0/v2.1  
**3 layer version:** 2.3 · **User-guide:** v1.2 · `source_version` 2.3 · **Feature Map:** 1.0 · **Last updated:** 2026-07-28

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft AS-IS |
| 2.0 | 2026-07-05 | Full PM merge: standard GRN + COLLI, journal, import, gaps |
| 2.1 | 2026-07-05 | Service (no stock) + Fix Asset (Assets debit) by Product COA Group type |
| 2.2 | 2026-07-17 | Compliance qa-docs-standard (5-file); technical invariants/failure modes; tambah user-guide v1.0 |
| 2.3 | 2026-07-23 | Cross-ref Rounding SoT PO; GRN amount = price before VAT; VAT only at PI; UG v1.1 |
| 2.3b | 2026-07-28 | Feature Map + 6 capability cards; UG v1.2 (SF tags, status review); Help Center overview en/id |
| 2.3c | 2026-07-29 | Help Center overview id/en v1.1 — expanded end-user landing (glossary, COLLI async, journal by COA type, void/close UI gap, troubleshooting, FAQ) |

## Related menus

| Menu | Link |
|------|------|
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) — sumber outstanding |
| Purchase Inbound (legacy) | [../supplychain-mutation-inbound/](../supplychain-mutation-inbound/) — API sama, UI lama |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — tagihan + PPN |

**Maintenance owner:** QA — Yemima
