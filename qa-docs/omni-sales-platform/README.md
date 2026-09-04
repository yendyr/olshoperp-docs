# Dev - Sales Platform — Dokumentasi QA

Menu **Dev - Sales Platform** (SO marketplace hasil sync). Route: `/omni/sales-order`.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**SoT (6 file):** datalist · order-detail · sync-ingestion · sync-price-mapping · **booking v1.1** · approval-automation  
**Version:** 1.10 · **User-guide:** v1.4 · `source_version` 1.10 · **Last updated:** 2026-09-04 14:20

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.10 | 2026-09-04 14:20 | Log Data tab **Pending Orders** + pill **Unmatched Bookings** (ETM-15798; kanonik ASO) |
| 1.9 | 2026-09-04 11:50 | Booking Shopee dual-path: masuk by Booking Number dulu; tahan Order ID tanpa booking; merge di MATCHED + contoh nyata (anti-duplikat) |
| 1.8 | 2026-09-03 12:05 | Edit detail sebelum approve: add/replace SKU, price, disc, VAT; no delete; sync lock — ETM-15749 / ETM-15748 |
| 1.7 | 2026-09-02 16:45 | Extract SKU bundle hanya jika Price > 0 (tolak booking/harga 0) — ETM-15733 |
| 1.6 | 2026-08-31 17:00 | AS-IS sync ingestion: create vs update, lookback default 10 hari, pecah job per hari/half-day (bahasa operasional §5.4) |
| 1.5 | 2026-08-12 | TO-BE Benchmark COGS snapshot = effective Manual COGS (`GAP-BM-14`); Auto Add VAT tetap 1.4 |
| 1.4 | 2026-08-11 | TO-BE Auto Add VAT dari Store (`GAP-ST-VAT-01`); cross-ref Store §4.9 |
| 1.3 | 2026-08-11 | TO-BE Error Flag **Below Benchmark COGS** (`cogs-error`); cross-ref GAP-BM-13 |
| 1.2 | 2026-08-05 | Shopee unit price dari escrow (`discounted_price + shopee_discount`); GAP-SPR-01; KB/ops note understated price |
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
