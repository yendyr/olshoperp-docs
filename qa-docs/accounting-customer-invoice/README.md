# Sales Invoice — Dokumentasi QA

Menu **Sales Invoice** (Accounting / Account Receivable) — faktur penjualan / piutang usaha (AR).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |

**UI route:** `/accounting/customer-invoice`  
**SoT:** [`_meta/sot/accounting-customer-invoice-source-of-truth.md`](../_meta/sot/accounting-customer-invoice-source-of-truth.md) v1.0  
**Help Center overview:** [`_meta/docs-hub/menus/accounting-customer-invoice/`](../_meta/docs-hub/menus/accounting-customer-invoice/) (`source_type: authored` — tidak di-overwrite)  
**3 layer version:** 2.0 · **User-guide:** v1.1 · **Feature Map:** 1.0 · **Last updated:** 2026-08-31 16:10

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0–1.1 | 2026-06 | Draft AS-IS codebase + Instant Settlement cross-ref |
| 2.0 | 2026-08-24 | Full 5-file dari SoT v1.0: status cycle, partial per SKU, import Open-only, journal on Approve, GAP-SI-01..05 |
| 2.1 | 2026-08-25 | Help Center overview authored: end-user guide, lifecycle matrix, partial invoice rules, and troubleshooting |
| 2.1b | 2026-08-31 16:10 | Feature Map + 6 Lingo cards; UG v1.1 SF tags |

## Related menus

| Menu | Link |
|------|------|
| Sales Order General | Sumber outstanding invoice manual |
| Instant Settlement | Generate SI platform |
| Account Receive | [../accounting-customer-payment/](../accounting-customer-payment/) — pelunasan |
| Credit Note | [../accounting-credit-note/](../accounting-credit-note/) — koreksi AR |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — cermin AP |

**Maintenance owner:** QA — Yemima
