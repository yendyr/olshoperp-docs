# All Sales Order — Dokumentasi QA

Menu **All Sales Order** — view gabungan SO **general** + SO **platform**.  
Route: `/businessdevelopment/all-sales-order`

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**User-guide:** v1.1 · `source_version` 1.2  
**Version (3 layer):** 1.2–1.3 · **Last updated:** 2026-07-22

## Peran vs dua menu sumber

| Menu | Doc | Peran |
|------|-----|-------|
| [Dev - Sales Platform](../omni-sales-platform/) | Marketplace sync | Tipe **platform** |
| [Dev - Sales Order](../sales-order-general/) | SO internal + dual import | Tipe **general** (v3.1) |
| [Store](../omni-store-binding/) | **Fulfillment Mode** | Gate Processed / Non Processed |
| **All Sales Order** | Window | Monitor, Recheck, import dual (paritas SOG) |

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.3 | 2026-07-22 | Dual import **Import Processed** / **Import Non-Processed**; user-guide 1.1 |
| 1.2 | 2026-07-15 | Recheck AS-IS; residual O-01…O-03 |
| 1.0 | 2026-07-15 | Split folder |

**Maintenance owner:** QA — Yemima
