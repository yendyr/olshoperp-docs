# Opening Stock — Dokumentasi QA

Menu **Opening Stock** (Accounting / FA) — saldo awal stok & nilai inventory.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |

**UI route:** `/accounting/opening-stock`  
**SoT:** [`_meta/sot/accounting-opening-stock-source-of-truth.md`](../_meta/sot/accounting-opening-stock-source-of-truth.md) v1.0  
**3 layer version:** 1.0 · **User-guide:** v1.1 · **Feature Map:** 1.0 · **Last updated:** 2026-08-31 16:05

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| stub | 2026-07-09 | Placeholder KB + relasi Benchmark COGS |
| 1.0 | 2026-08-31 15:55 | Full 5-file dari SoT: saldo awal stok, COA Assets/Equity, Generated Trx, Item Stock job, GAP-OS-01..10 |
| 1.0b | 2026-08-31 16:05 | Feature Map + 5 Lingo cards (SF-OS-01..05); UG v1.1 SF tags |

## Related menus

| Menu | Link |
|------|------|
| Stock Addition / Deduction | Generated Trx setelah detail |
| Stock Opname | Engine & UI shared (filter beda) |
| Journal / Balance Sheet | Jurnal opening setelah Approve |
| Benchmark COGS | [../accounting-product-benchmark-price/](../accounting-product-benchmark-price/) — sumber harga addition |
| Stock Remapping | [../accounting-stock-remapping/](../accounting-stock-remapping/) — remap variant terpisah |

**Maintenance owner:** QA — Yemima
