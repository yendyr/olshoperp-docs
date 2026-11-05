# Sales Order Profit Loss — Dokumentasi QA

Menu **Sales Order Profit Loss** (Finance & Accounting → Report) — laporan P/L berbasis Sales Order (Approved/Processed) + COGS dari Outbound `OT-%`.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v1.0) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v1.0) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v1.0) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v1.0) | Publish | review |

**UI route:** `/accounting/sales-order-profit-loss`  
**Staging:** https://staging.olshoperp.com/accounting/sales-order-profit-loss  
**Improvement aktif:** [ETM-17074](https://erpintegration.atlassian.net/browse/ETM-17074) — kolom Trx. Code Outbound & Trx. Date Outbound di datalist per SO  
**3 layer:** 1.0 · **Last updated:** 2026-11-05

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-11-05 | Initial 5-file dari AS-IS kode + TO-BE ETM-17074 (kolom outbound di tabel per SO) |

## Related

- [Product Profit Loss](../accounting-product-profit-loss/README.md) — P/L per SKU
- [Profit & Loss](../accounting-profit-loss/README.md) — income statement COA
- Sales Order / Outbound External — sumber order & COGS

**Maintenance owner:** QA — Yemima
