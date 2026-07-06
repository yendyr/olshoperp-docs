# BETA - New Purchase Inbound — QA Documentation

Menu **Purchase Inbound (GRN)** — UI BETA dengan fitur **COLLI**. Backend shared dengan legacy Purchase Inbound.

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |

**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-05 | 2.1 | §11.1 Service (no stock) + Fix Asset (Assets debit) by Product COA Group type |
| 2026-07-05 | 2.0 | Full PM merge: standard GRN + COLLI (Mar/Apr 2026), journal, import, gaps §19–§21 |
| 2026-06-19 | 1.0 | Initial draft AS-IS |

---

## Route & code

| Item | Path |
|------|------|
| UI (BETA) | `/supplychain/new-purchase-inbound` |
| UI (legacy) | `/supplychain/mutation-inbound` |
| API | `supplychain/mutation-inbound` |
| Controller | `StockMutationInboundController.php` |
| COLLI middle | `StockMutationInboundMiddleDetailController.php` |
| Async approve | `ApproveInboundJob.php` |

---

## Key notes (v2.0)

- **PO approved/processed** → outstanding panel → GRN → stok + jurnal Unbilled Goods
- **COLLI:** N koli → N Stock ID via background job after approve
- **VAT** tidak di GRN — di Supplier Invoice
- **Pending major:** Void UI broken (P-PI-01), BETA graduation (P-PI-02)

---

## Related menus

- [Purchase Order](../supplychain-purchase-order/README.md) — source PO
- [Purchase Inbound legacy](../supplychain-mutation-inbound/README.md) — same API
- [Purchase Requisition](../supplychain-purchase-requisition/README.md) — via PO With PR
- [Other Inbound](../supplychain-other-inbound/README.md) — non-PO inbound
