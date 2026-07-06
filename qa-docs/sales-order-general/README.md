# Sales Order General (Internal) — Dokumentasi

Menu terkait sales order internal, platform, dan view gabungan.

| Menu UI | Route | Cakupan doc |
|---------|-------|-------------|
| Dev - Sales Order | `/businessdevelopment/sales-order-general` | SO internal (general) |
| **All Sales Order** | `/businessdevelopment/all-sales-order` | View gabungan general + platform |
| **Dev - Sales Platform** | `/omni/sales-order` | SO marketplace |

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

**Latest:** §11 Benchmark COGS detail order (2026-07-05) · §10 Bundle proporsi · §8–§9 Failed Process

## Legacy sources

- [_legacy/old_sales-order-general-requirement.md](../_legacy/old_sales-order-general-requirement.md)
- [_legacy/old_sales-order-import-bulk-improvement.md](../_legacy/old_sales-order-import-bulk-improvement.md) — merged ke [technical.md](./technical.md) §5 (TO-BE)

## Route & code

- FE: `/businessdevelopment/sales-order-general`
- BE: `Modules/BusinessDevelopment/` + `Modules/OmniChannel/` (sales order controllers)
