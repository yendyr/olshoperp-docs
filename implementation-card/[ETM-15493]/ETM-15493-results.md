# ETM-15493 — Snapshot Benchmark COGS setelah Manual COGS expired

**Card:** [Dev - Sales Order] Implementasi Benchmark COGS snapshot based on Manual COGS effective value  
**Environment:** staging.olshoperp.com · Company **Dev Staging (DEV-STG, id 13)**  
**Credentials:** playwright@gmail.com  
**Run:** 14 Aug 2026 · Playwright scoped (2 tes, 2 passed, 35.2s)  
**SKU:** `SKU-ManualCOGSWithExpirationDate-4`  
**Expiry Manual COGS:** 13 Aug 2026 23:59:59 (sudah lewat pada tanggal run)

**Expected (AS-IS docs):** setelah Manual COGS expired, COGS efektif kembali ke rumus Highest Price / Last Inbound / No Inbound. Snapshot line Dev - Sales Order = nilai efektif itu, **bukan** Manual yang sudah expired.  
Sumber: `qa-docs/accounting-product-benchmark-price/requirement.md` §3.5 · `qa-docs/sales-order-general/requirement.md` §8.2

## Ringkasan hasil

| # | Skenario | Hasil | Actual |
|---|----------|-------|--------|
| 1 | Master Benchmark COGS — SKU expired | **PASS** | Description = **Last Inbound**. COGS (Efektif) = **51.900**. Manual COGS tetap **55.000** dengan expiry **13-08-2026**. |
| 2 | Create line Dev - Sales Order | **PASS** | Snapshot `benchmark_cogs` = **51900** (= Last Inbound). Bukan Manual 55000. SO **SO-5U4ENWR2**. |

## Data aktual

| Field | Nilai |
|-------|--------|
| SKU | SKU-ManualCOGSWithExpirationDate-4 |
| Manual COGS (master) | 55.000 |
| Manual COGS Expiry | 13-08-2026 |
| COGS (Efektif) master | 51.900 |
| Description master | Last Inbound |
| SO | [SO-5U4ENWR2](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515608) (draft) |
| Snapshot API `benchmark_cogs` | 51900.0000 |

## Automation

- **Spec:** `tests/specs/sales-order-general/etm-15493-benchmark-cogs-snapshot.spec.ts` (`@ETM-15493`)
- **Helpers:** `tests/helpers/product-benchmark-price.ts`, `tests/helpers/sales-order-general.ts`
- **Registry:** `tests/pom-registry/product-benchmark-price.yaml`

```
OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/sales-order-general/etm-15493-benchmark-cogs-snapshot.spec.ts --project=authenticated --retries=0
```

## Catatan QA / automation

- Kolom **Benchmark COGS** di detail SO hidden default. Overlay Columns Show/Hide tidak menampilkan opsi dengan label itu pada run ini, jadi nilai snapshot di-assert dari response **create-select** (field `benchmark_cogs`) — itu sumber capture saat create line sesuai requirement §8.2.
- Baris UI memotong SKU jadi `SKU-ManualCOGSWith...`; helper match prefix.
- Draft sisa di DEV-STG: `SO-5U4ENWR2` (run PASS) dan `SO-5U4EMP3S` (run sebelumnya).
- Screenshot: `01-benchmark-cogs-sku-search.png` … `05-so-benchmark-column.png`. JSON: `master-row.json`, `create-select-response.json`, `etm-15493-comparison.json`.
