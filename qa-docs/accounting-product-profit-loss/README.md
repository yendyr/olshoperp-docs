# Product Profit Loss — Dokumentasi

Menu **Product Profit Loss** (Accounting) — laporan profit & loss per SKU.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Ringkasan cepat

- **Path UI:** `/accounting/product-profit-loss`
- **Sumber data:** [Dev - Sales Order](../sales-order-general/), [Dev - Sales Platform](../omni-sales-platform/), [Outbound External](../supplychain-mutation-outbound/)
- **Import file:** Tidak ada (report-only)
- **Gap utama:** modal 14 kolom (G-01 dev backlog), Advanced Filter (G-02 dev backlog)
- **Next MVP:** summary chart, Sales Return / Failed Ship / Settlement
- **AS-IS by design:** snapshot lazy + cleanup hourly; filter `wh_process_id`

## Related menus (sumber baca data)

| # | Menu | Doc |
|---|------|-----|
| 1 | Sales Order General | [sales-order-general](../sales-order-general/) |
| 2 | Sales Platform (`omni/sales-order`) | [omni-sales-platform](../omni-sales-platform/) |
| 3 | Outbound External | [supplychain-mutation-outbound](../supplychain-mutation-outbound/) |

Detail peran masing-masing: [requirement.md §6](./requirement.md) · [knowledge-base.md §7](./knowledge-base.md)
