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

## Key notes

- Kalkulasi: **Highest Price** PO inbound 30 hari → fallback **Last Buy** → **0**
- **Bukan** MA30 — legacy `MaPrice30Days()` tidak dipakai job ini
- Konsumen: **Stock Opname** (default surplus price) · **SO detail** (`benchmark_cogs` snapshot + auto-approve)
- **GAP utama:** auto-approve AS-IS bandingkan **price after VAT** vs requirement **Price Before VAT** ([requirement §12](./requirement.md#12-gaps--pm-vs-as-is-codebase))

---

## Related menus

- [sales-order-general](../sales-order-general/) — kolom detail SO + auto-approval §11
- [supplychain-stock-opname](../supplychain-stock-opname/) — default harga surplus
- [random-sku](../random-sku/) — random variant inherit parent COGS
- [system-product](../system-product/) — master SKU structure
