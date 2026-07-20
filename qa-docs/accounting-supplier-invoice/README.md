# Purchase Invoice — Dokumentasi QA

Menu **Purchase Invoice** (Accounting / Account Payable).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | draft |

**SoT:** `purchase-invoice-source-of-truth.md` v3.0 (15 Jul 2026)  
**User-guide:** v1.0 · `source_version` 3.0 · pilot golden reference (3 layer sumber masih draft — exception disetujui)  
**Version (3 layer):** 3.0 · **Last updated:** 2026-07-17

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.2 | 2026-07-11 | Compliance qa-docs-standard (baseline; Void docs outdated) |
| 3.0 | 2026-07-15 | Rewrite SoT v3.0: Void→Pending; gaps PI-01/02/03; currency lock; cost stuck risk; return Billed+DN; print Resolved per SoT |
| ug-1.0 | 2026-07-17 | Tambah `user-guide.md` v1.0 (pilot golden ref); rules 5-file + gate review/final |

## Related menus

| Menu | Link |
|------|------|
| Purchase Inbound | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) — eligible SKU |
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) — harga, tax, cost/disc |
| Account Payment | [../accounting-supplier-payment/](../accounting-supplier-payment/) — pelunasan |
| Master Other Cost / Discount | [../omni-other-cost/](../omni-other-cost/) · [../omni-other-discount/](../omni-other-discount/) |
| COA | [../accounting-chart-of-account/](../accounting-chart-of-account/) — override COA |

**Maintenance owner:** QA — Yemima
