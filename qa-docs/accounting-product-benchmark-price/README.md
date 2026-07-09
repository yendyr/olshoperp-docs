# Benchmark COGS — Dokumentasi

Menu **Benchmark COGS** (Finance Accounting → Report) — nilai acuan HPP per System Product.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-09 | 1.1 | Perluasan sumber: PO + Stock Addition + Opname IN + Opening Stock; pending items §13 |
| 2026-07-05 | 1.0 | Full 3-layer docs from PM Notion + codebase AS-IS; gaps §12 |

---

## Route & code

| Item | Path |
|------|------|
| UI | `/accounting/product-benchmark-price` |
| API | `accounting/product-benchmark-price` |
| BE controller | `Modules/Accounting/Http/Controllers/ProductBenchmarkPriceController.php` |
| Calculation job | `Modules/Accounting/Jobs/ProductBenchmarkPriceJob.php` |
| Schedule | `product-benchmark-price:calculate` — daily 00:00 Asia/Jakarta |
| FE datalist | `olshoperp-frontend/src/pages/Accounting/Report/ProductBenchmarkPrice/Datalist.vue` |

---

## Key notes (v1.1)

- Kalkulasi: **Highest Price** 30 hari → fallback **Last Inbound** → **0**
- Sumber (v1.1): **PO Inbound** + **Stock Addition** + **Stock Opname IN** + **Opening Stock**
- **Bukan** MA30 — legacy `MaPrice30Days()` tidak dipakai job ini
- Konsumen: **Stock Opname** (default surplus) · **SO detail** (`benchmark_cogs` snapshot + auto-approve)
- **Pending kode:** allowlist 4 sumber belum diimplementasi — filter PO di-comment ([requirement §13](./requirement.md#13-hal-yang-perlu-diperhatikan--pending-items))

---

## Related menus

- [sales-order-general](../sales-order-general/) — kolom detail SO + auto-approval §11
- [supplychain-stock-opname](../supplychain-stock-opname/) — default harga surplus · sumber opname IN
- [supplychain-adjustment-addition](../supplychain-adjustment-addition/) — sumber stock addition manual
- [accounting-opening-stock](../accounting-opening-stock/) — sumber opening stock
- [random-sku](../random-sku/) — random variant inherit parent COGS
- [accounting-stock-remapping](../accounting-stock-remapping/) — addition auto dari remap (sumber benchmark potensial)
- [system-product](../system-product/) — master SKU structure
