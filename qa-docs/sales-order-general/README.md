# Sales Order General (Internal) — Dokumentasi

Menu **Sales Order General** — sales order internal (bukan platform marketplace).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Legacy sources

- [_legacy/old_sales-order-general-requirement.md](../_legacy/old_sales-order-general-requirement.md)
- [_legacy/old_sales-order-import-bulk-improvement.md](../_legacy/old_sales-order-import-bulk-improvement.md) — merged ke [technical.md](./technical.md) §5 (TO-BE)

## Route & code

- FE: `/businessdevelopment/sales-order-general`
- BE: `Modules/BusinessDevelopment/` + `Modules/OmniChannel/` (sales order controllers)
