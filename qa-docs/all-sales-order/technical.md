---
doc_type: technical
menu: all-sales-order
menu_name: "All Sales Order"
version: 1.7
last_updated: 2026-09-02
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../sales-order-general/technical.md
---

# All Sales Order — Technical Documentation

**UI:** `/businessdevelopment/all-sales-order`  
**API list:** `businessdevelopment/all-sales-order`  
**Shared Omni:** `omnichannel/sales-order/*` (`type=all` / general endpoints)  
**Behavior:** [requirement.md](./requirement.md) v1.7 · import general → [SOG technical](../sales-order-general/technical.md)

> **1.7 (2026-09-02):** Extract bundle price > 0 — [requirement §5.5](./requirement.md); ETM-15732.  
> **1.6 (2026-08-12):** Verify Auto Add VAT (platform rows) + Benchmark COGS effective snapshot — [requirement §5.2a](./requirement.md#52a-consumer-improvements-to-be); GAP-ASO-04/05.  
> **1.5 (2026-08-11):** Error Flag Below Benchmark COGS must match Platform renderer + filter label — [Benchmark technical §6.6](../accounting-product-benchmark-price/technical.md#66-error-flag-cogs-error-to-be-ux--gap-bm-13); GAP-ASO-03 / GAP-BM-13.

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.7 | 2026-09-02 | Extract bundle: reject when `each_price` ≤ 0; shared `extract-bundle` + `BundleRandomFlag.vue` (ETM-15732) |
| 1.6 | 2026-08-12 | Verify Auto Add VAT (platform) + Benchmark effective snapshot; GAP-ASO-04/05 |
| 1.5 | 2026-08-11 | TO-BE Below Benchmark COGS Error Flag parity; GAP-ASO-03 / GAP-BM-13 |
| 1.2 | 2026-07-22 | TO-BE dual import Processed/Non-Processed parity with SOG |
| 1.1 | 2026-07-15 | Recheck / shared engine notes |
## 1. File Map

| Path | Role |
|------|------|
| `olshoperp-frontend/src/pages/BusinessDevelopment/Report/AllSalesOrder/DataList.vue` | Gabungan datalist + pills; `show-recheck-error` |
| `.../Omni/SalesOrder/components/ActionButtons.vue` | Slot create + optional Recheck |
| `.../Omni/SalesOrder/components/RevalidateFlagButton.vue` | Tombol Recheck + lock poll/echo |
| `.../Omni/SalesOrder/components/ErrorFlag.vue` | Tooltip + optional `Last Checked` dari `lastUpdated` |
| `.../AllSalesOrder/Form.vue` | Wrapper form `from-all-sales-order` — pilih General vs Platform form by tipe |
| `.../Omni/SalesOrder/components/BundleRandomFlag.vue` | Flag bundle + **Extract** → `POST …/extract-bundle` |
| `.../BusinessDevelopment/SalesOrderGeneral/DatalistDetail.vue` | Detail general (dipakai ASO form general) |
| `.../Omni/SalesOrder/DatalistDetail.vue` | Detail platform (dipakai ASO form platform) |
| Shared BE | `SalesOrderController::revalidateFlag` / `checkRevalidateFlag` · `CheckOrderFlagsJob` |
| Shared BE extract | `SalesOrderDetailController::extractBundleDetails` — `bccomp($bundle_header->each_price, '0.0000', 4)` must be > 0 |

FE pills: `PillButtons.vue` dengan `type="all"`.

---

## 2. API Routes

| Method | Path | Notes |
|--------|------|-------|
| GET | `businessdevelopment/all-sales-order` | Datalist gabungan |
| GET | `.../export-file` / `export-progress` | Export ASO |
| GET | `omnichannel/sales-order/get` | Dipakai partial (failed_process filters) |
| GET | `omnichannel/sales-order/filter-process-status?type=all` | Carousel buckets |
| GET | `omnichannel/sales-order/pill-count?type=all` | Pill counters |
| GET | `omnichannel/sales-order/sync-one-so` | Sync baris platform |
| POST | `omnichannel/sales-order/upload?type=general` | Import general — TO-BE dual channel Processed / Non-Processed (same as SOG) |
| GET | `omnichannel/sales-order/revalidate-flags` | Progress/lock status Recheck |
| POST | `omnichannel/sales-order/revalidate-flags` | Dispatch batch Recheck |
| POST | `omnichannel/sales-order/{id}/sales-order-detail/{detailId}/extract-bundle` | Extract SKU bundle; **reject** if header `each_price` ≤ 0 (ETM-15732) |

### 2.1 Recheck pipeline (AS-IS)

```text
ASO button → POST revalidate-flags
  → query Approved + unassign_wave_status ∈ {NOT_IN_QUEUE, IN_QUEUE}
  → chunk 50 → Bus::batch(CheckOrderFlagsJob)
  → SalesOrderSynchronizeLog TYPE_REVALIDATE_ORDER per store
  → Cache lock UniqueJobKey::revalidate_flag + echo revalidate-flag
```

WebSocket channels: `BizdevWebSocketChannel::getAllSalesOrderChannel`.

**Caveat:** `checkRevalidateFlag()` response field `in_progress` currently hardcoded `false` (verify with FE echo path).

---
## 3. Database

Satu header table `omni_sales_orders` dengan `type_sales_order ∈ {general, platform}`. Tidak ada tabel khusus ASO.

---

## 4. Flow — Failed Process di ASO

```mermaid
sequenceDiagram
    participant UI as AllSalesOrder DataList
    participant ASO as all-sales-order API
    participant OMNI as Omni SalesOrderController

    UI->>UI: Pill Failed Process
    UI->>ASO: GET ?failed_process=true
    UI->>UI: Insert error_flags_formatted column
    UI->>UI: ErrorFlag.vue (shared)
    Note over OMNI: Validasi/flag set di approve & CheckOrderFlagsJob\n(lihat SP / SOG technical)
```

---

## 5. Invariants

1. ASO menampilkan kedua tipe tanpa mengubah `type_sales_order`.
2. Semantic error flag & processing icons **identik** dengan Sales Platform renderer.
3. Create path tetap menghasilkan SO **general** (store Others / defaults).
4. Booking field edits allowed via ASO form; Sales Platform list tetap read-oriented.
5. Validasi approve tidak diimplementasikan ulang di ASO — delegate ke ApprovalController per tipe.

---

## 6. Frontend Behaviors

| Behavior | Notes |
|----------|-------|
| `type="all"` pills | Counters gabungan |
| Import history | Shared Omni SO General endpoints |
| `from-all-sales-order` | Form flag untuk breadcrumb/back |

---

## 7. Failure Modes

| Failure | Handling |
|---------|----------|
| Sync one fails | Pesan Omni; row tetap; Failed Synchronize di SP |
| Import fail | Import log (general) |
| Re-check batch fail / lock stuck | Error API / wait lock; GAP-ASO-01 residual UX |

---

## 8. Known Issues

- GAP-ASO-01 Partial — tombol ada; residual Last Checked per-icon + O-01…O-03 + `in_progress` hardcode
- GAP-ASO-03 / GAP-BM-13 — Below Benchmark COGS Error Flag UX + filter
- GAP-APR-01 (dampak baris platform)
- Related: [omni-sales-platform technical §13](../omni-sales-platform/technical.md) · [sales-order-general](../sales-order-general/technical.md) · [Benchmark COGS technical §6.6](../accounting-product-benchmark-price/technical.md)
