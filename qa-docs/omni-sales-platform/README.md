# Dev - Sales Platform — Dokumentasi QA

Menu **Dev - Sales Platform** (SO marketplace hasil sync). Route: `/omni/sales-order`.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**SoT (6 file, v1.0, 2026-07-15):** datalist · order-detail · sync-ingestion · sync-price-mapping · booking · approval-automation  
**Version:** 1.1 · **Last updated:** 2026-07-15

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-07-15 | GAP-BOOK-01 accepted residual (IS mitigasi); KB booking × tracking × settlement |
| 1.0 | 2026-07-15 | Initial dari 6 SoT PM + verifikasi codebase; gap APR/SPL/SPD/BOOK/SYN; relasi return & failed ship |

## Related menus

| Menu | Alasan |
|------|--------|
| [Dev - Sales Order](../sales-order-general/) | SO internal independen; Create di SP redirect ke sini |
| [All Sales Order](../all-sales-order/) | View gabungan; edit Other Info booking; Failed Process lintas tipe |
| [Instant Settlement](../accounting-settlement-upload/) | Match Platform Order ID; booking unmatched tidak settle |
| [Failed Ship](../supplychain-failed-ship/) | Cabang Return bucket + Failed Ship Status |
| [Sales Returns (SCM)](../supplychain-sales-returns/) | Sales Return platform → Return bucket |
| [Sales Return (Accounting)](../accounting-sales-return/) | Retur keuangan terkait platform |
| [Store Binding](../omni-store-binding/) | Auth store, WH process, auto sync |
| [System Product](../system-product/) | Binding + Benchmark COGS |
| [Benchmark COGS](../accounting-product-benchmark-price/) | Snapshot prevent auto-approve |

**Peran ringkas:** SP = marketplace sync/monitoring ops. Tidak menggantikan Dev Sales Order. All Sales Order = gabungan keduanya.

**Maintenance owner:** QA — Yemima
