# All Sales Order — Dokumentasi QA

Menu **All Sales Order** — view gabungan SO **general** + SO **platform**.  
Route: `/businessdevelopment/all-sales-order`

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**User-guide:** v1.5 · `source_version` 1.9  
**Version (3 layer):** 1.9 · **Last updated:** 2026-09-04 14:20

## Peran vs dua menu sumber

| Menu | Doc | Peran |
|------|-----|-------|
| [Dev - Sales Platform](../omni-sales-platform/) | Marketplace sync | Tipe **platform** |
| [Dev - Sales Order](../sales-order-general/) | SO internal + dual import | Tipe **general** (v3.4) |
| [Store](../omni-store-binding/) | Fulfillment Mode · Auto Add VAT Platform | Gate import · VAT platform |
| [Benchmark COGS](../accounting-product-benchmark-price/) | Error Flag + Manual COGS | Shared `cogs-error` · effective snapshot |
| **All Sales Order** | Window | Monitor, Recheck, import dual (paritas SOG) |

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.9 | 2026-09-04 14:20 | Log Data tab **Pending Orders** + pill **Unmatched Bookings** (booking dual-path visibility) — ETM-15798; paritas Dev - Sales Platform |
| 1.8 | 2026-09-03 12:05 | Paritas edit detail SO platform sebelum approve (add/replace SKU, price, VAT; sync lock) — ETM-15748 / ETM-15749 |
| 1.7 | 2026-09-02 16:45 | Extract SKU bundle hanya jika Price > 0 (tolak booking/harga 0) — ETM-15732 |
| 1.6 | 2026-08-12 | TO-BE verify Auto Add VAT (platform) + Benchmark COGS Manual effective snapshot; GAP-ASO-04/05 |
| 1.5 | 2026-08-11 | TO-BE Error Flag **Below Benchmark COGS**; GAP-ASO-03 / GAP-BM-13 |
| 1.4 | 2026-08-05 | Cross-ref Shopee escrow unit price (SP v1.2); KB troubleshooting harga |
| 1.3 | 2026-07-22 | Dual import **Import Processed** / **Import Non-Processed**; user-guide 1.1 |
| 1.2 | 2026-07-15 | Recheck AS-IS; residual O-01…O-03 |
| 1.0 | 2026-07-15 | Split folder |

**Maintenance owner:** QA — Yemima
