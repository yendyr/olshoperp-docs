# BETA - New Purchase Inbound — Dokumentasi QA

Menu **Purchase Inbound (GRN)** — UI BETA. **Canonical Colli v2** (wadah multi-SKU). Backend shared dengan legacy Purchase Inbound.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |

**UI route (BETA):** `/supplychain/new-purchase-inbound`  
**Help Center overview:** [`_meta/docs-hub/menus/supplychain-new-purchase-inbound/`](../_meta/docs-hub/menus/supplychain-new-purchase-inbound/) (`source_type: authored` — tidak di-overwrite)  
**SoT Colli v2:** [`_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md`](../_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md)  
**3 layer version:** 2.4 · **User-guide:** v1.3 · `source_version` 2.4 · **Feature Map:** 1.1 · **Last updated:** 2026-08-14 11:45

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft AS-IS |
| 2.0 | 2026-07-05 | Full PM merge: standard GRN + COLLI, journal, import, gaps |
| 2.1 | 2026-07-05 | Service (no stock) + Fix Asset (Assets debit) by Product COA Group type |
| 2.2 | 2026-07-17 | Compliance qa-docs-standard (5-file); technical invariants/failure modes; tambah user-guide v1.0 |
| 2.3 | 2026-07-23 | Cross-ref Rounding SoT PO; GRN amount = price before VAT; VAT only at PI; UG v1.1 |
| 2.3b | 2026-07-28 | Feature Map + 6 capability cards; UG v1.2 (SF tags, status review); Help Center overview en/id |
| 2.3c | 2026-07-29 | Help Center overview id/en v1.1 — expanded end-user landing |
| 2.4 | 2026-08-14 11:45 | Colli v2: satu kode wadah banyak SKU di satu lokasi; Existing/New + Colli Type; parity dengan menu Purchase Inbound lama |

## Related menus

| Menu | Link |
|------|------|
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) — sumber outstanding |
| Purchase Inbound (legacy) | [../supplychain-mutation-inbound/](../supplychain-mutation-inbound/) — API sama; Colli v2 parity |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — tagihan + PPN |
| Colli Type | [../supplychain-colli-type/](../supplychain-colli-type/) — jenis wadah New Colli |

**Maintenance owner:** QA — Yemima
