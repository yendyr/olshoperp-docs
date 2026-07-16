# All Sales Order — Dokumentasi QA

Menu **All Sales Order** — view gabungan SO **general** + SO **platform**.  
Route: `/businessdevelopment/all-sales-order`

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Version:** 1.2 · **Last updated:** 2026-07-15

## Peran vs dua menu sumber

| Menu | Doc | Peran |
|------|-----|-------|
| [Dev - Sales Platform](../omni-sales-platform/) | Marketplace sync | Sumber perilaku tipe **platform** |
| [Dev - Sales Order](../sales-order-general/) | SO internal CRUD/import | Sumber perilaku tipe **general** |
| **All Sales Order** (folder ini) | Gabungan + konsistensi UI | Lihat, filter, edit terbatas, Failed Process, **Recheck failed process** |

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-07-15 | Recheck AS-IS verified (GAP-ASO-01 partial); residual O-01…O-03 |
| 1.1 | 2026-07-15 | KB: booking unmatched ≠ Instant Settlement (pointer GAP-BOOK-01) |
| 1.0 | 2026-07-15 | Split dari sales-order-general; sintesis perilaku platform + general |

**Maintenance owner:** QA — Yemima
