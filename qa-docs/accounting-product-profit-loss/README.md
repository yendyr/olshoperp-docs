# Product Profit Loss — Dokumentasi

Menu **Product Profit Loss** (Accounting) — laporan profit & loss per SKU.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-11 | 1.4 | TO-BE **Gross Sales** = Price Before VAT (+ tooltip); GAP **G-13** |
| 2026-06-29 | 1.3 | Related menus & draft 3-layer |

## Ringkasan cepat

- **Path UI:** `/accounting/product-profit-loss`
- **Sumber data:** [Dev - Sales Order](../sales-order-general/), [Dev - Sales Platform](../omni-sales-platform/), [Outbound External](../supplychain-mutation-outbound/)
- **Gross Sales (TO-BE):** Price Before VAT setelah disc line — selaras Total COGS tanpa PPN ([requirement §5.1](./requirement.md#51-kolom-datalist--formula))
- **Import file:** Tidak ada (report-only)
- **Gap utama:** **G-13** Gross Before VAT · modal 14 kolom (G-01) · Advanced Filter (G-02)
- **Next MVP:** summary chart, Sales Return / Failed Ship / Settlement
- **AS-IS by design:** snapshot lazy + cleanup hourly; filter `wh_process_id`

## Related menus (sumber baca data)

| # | Menu | Doc |
|---|------|-----|
| 1 | Sales Order General | [sales-order-general](../sales-order-general/) |
| 2 | Sales Platform (`omni/sales-order`) | [omni-sales-platform](../omni-sales-platform/) |
| 3 | Outbound External | [supplychain-mutation-outbound](../supplychain-mutation-outbound/) |

Detail peran masing-masing: [requirement.md §6](./requirement.md) · [knowledge-base.md §7](./knowledge-base.md)
