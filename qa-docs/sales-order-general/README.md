# Dev - Sales Order — Dokumentasi

Menu **Dev - Sales Order** — CRUD/import SO **internal** (`type_sales_order = general`).  
Route: `/businessdevelopment/sales-order-general`

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**SoT:** busdev SO General v1.0 + Fulfillment Mode TO-BE  
**User-guide:** v1.2 · `source_version` 3.2  
**Version (3 layer):** 3.2 · **Last updated:** 2026-07-23

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-07-22 | Rewrite SoT v1.0; 5 file + user-guide |
| 3.1 | 2026-07-22 | Dual import **Import Processed** / **Import Non-Processed**; Fulfillment Mode; GAP-SOG-07…12 |
| 3.2 | 2026-07-23 | Sheet 2 Other Cost/Disc code ambiguity → order fail (GAP-SOG-13) |

## Related menus

| Menu | Link |
|------|------|
| Store (Fulfillment Mode) | [../omni-store-binding/](../omni-store-binding/) |
| All Sales Order | [../all-sales-order/](../all-sales-order/) |
| Dev - Sales Platform | [../omni-sales-platform/](../omni-sales-platform/) |
| Skip Wave Process | [../omni-skip-wave-process/](../omni-skip-wave-process/) |

**Maintenance owner:** QA — Yemima
