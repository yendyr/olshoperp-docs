# Purchase Order — Dokumentasi QA

Menu **Purchase Order** (Supply Chain / Procurement).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | draft |

**SoT / PM source:** `purchase_order_requirement.md` v1.0 (2026-07-05)  
**3 layer version:** 2.3 · **User-guide:** v1.0 · `source_version` 2.3 · **Last updated:** 2026-07-17

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft from codebase auto-analysis |
| 2.0 | 2026-07-05 | Full rewrite: PM merge, import/export/print/pricing, UI buttons, gaps |
| 2.1 | 2026-07-05 | GAP clarifications; Pending Items Major; import expanded |
| 2.2 | 2026-07-10 | Cross-ref PI COA override; koreksi posisi jurnal Other Cost/Disc |
| 2.3 | 2026-07-17 | Compliance qa-docs-standard (5-file); trim requirement; technical invariants/failure modes; tambah user-guide v1.0 |

## Related menus

| Menu | Link |
|------|------|
| Purchase Requisition | [../supplychain-purchase-requisition/](../supplychain-purchase-requisition/) — sumber detail With PR |
| Purchase Inbound | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) — penerimaan barang |
| General Company | [../generalsetting-general-company/](../generalsetting-general-company/) — master supplier |
| Other Cost / Discount | [../omni-other-cost/](../omni-other-cost/) · [../omni-other-discount/](../omni-other-discount/) |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — tagihan + Other Cost/Disc |

**Maintenance owner:** QA — Yemima

> Test cases (non-canonical): [test-cases/](./test-cases/)
