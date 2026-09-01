# Benchmark COGS — Dokumentasi

Menu **Benchmark COGS** (Finance Accounting → Report) — nilai acuan HPP per System Product.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | End-user (Notion/Lark) | review |

**Maintenance owner:** QA — Yemima  
**PM / card:** Notion Benchmark COGS · [ETM-7029](https://erpintegration.atlassian.net/browse/ETM-7029) · Bundle [ETM-15688](https://erpintegration.atlassian.net/browse/ETM-15688)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-09-01 09:16 | 1.4 | TO-BE **Product Bundle** COGS: Bundle Sum / Highest Bundle Variant; qty × komponen; Manual override; Bundle ≠ BOM; job order — ETM-15688 |
| 2026-09-01 09:16 | UG 1.1 | Sync user-guide ke source 1.4 (Bundle Sum + contoh paket) |
| 2026-08-11 | 1.3 | TO-BE **Manual COGS** + Expiry + import + audit; GAP-BM-14; contoh kasus §3.5; **user-guide v1.0** |
| 2026-08-11 | UG 1.0 | Generate user-guide dari source 1.3 (Manual COGS + rumus + konsumen SO/Opname) |
| 2026-08-11 | 1.2 | TO-BE Error Flag **Below Benchmark COGS** (`cogs-error`) + FX primary; GAP-BM-05 clarify / GAP-BM-13; konsumen 3 menu SO |
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

## Key notes (v1.4)

- Kalkulasi SKU stockable: **Highest Price** 30 hari → fallback **Last Inbound** → **0**
- Sumber (v1.1): **PO Inbound** + **Stock Addition** + **Stock Opname IN** + **Opening Stock**
- **Product Bundle** (TO-BE): **Bundle Sum** / **Highest Bundle Variant** — [requirement §3.6](./requirement.md#36-product-bundle-header-to-be-v14) · ETM-15688
- **Manual COGS** (TO-BE): override + expiry — [requirement §3.5](./requirement.md#35-manual-cogs-override-to-be-v13)
- **Bukan** MA30 — legacy `MaPrice30Days()` tidak dipakai job ini
- Konsumen: **Stock Opname** · **SO** snapshot + auto-approve
- **Pending kode:** allowlist 4 sumber · Manual COGS · Bundle Sum · Error Flag UX — [requirement §12–§13](./requirement.md#12-gaps--pm-vs-as-is-codebase)

---

## Related menus

- [sales-order-general](../sales-order-general/) — snapshot + auto-approval; nilai header bundle setelah v1.4
- [omni-sales-platform](../omni-sales-platform/) — snapshot Platform + prevent auto-approve
- [all-sales-order](../all-sales-order/) — flag lintas tipe
- [system-product](../system-product/) — Product Bundle flag & komponen
- [bill-of-material](../bill-of-material/) — rakitan ≠ Bundle Sum
- [random-sku](../random-sku/) — random non-bundle vs Highest Bundle Variant
- [supplychain-stock-opname](../supplychain-stock-opname/) — default surplus · sumber opname IN
- [supplychain-adjustment-addition](../supplychain-adjustment-addition/) — sumber addition
- [accounting-opening-stock](../accounting-opening-stock/) — sumber opening
- [accounting-stock-remapping](../accounting-stock-remapping/) — addition remap sebagai sumber potensial
