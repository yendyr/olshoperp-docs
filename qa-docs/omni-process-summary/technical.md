---
doc_type: technical
menu: omni-process-summary
menu_name: "Order Process"
version: 1.2
last_updated: 2026-07-20
owner: QA - Yemima
status: draft
aliases: [order process API, transfer summary, get resi log, print awb technical]
---

# Order Process — Technical Documentation

**API hub:** `omnichannel/transfer-summary` (+ `transfer-picking`, `sales-order/.../awb`)  
**Module:** `Modules/OmniChannel`  
**UI:** `/omni/process-summary` · FE `@Omni/Processing/Summary/`  
**Behavior SoT:** [requirement.md](./requirement.md) v1.2

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Index / counts / logs | `Modules/OmniChannel/Http/Controllers/TransferSummaryController.php` |
| Policy / entity alias | `TransferSummaryPolicy.php`, `Entities/TransferSummary.php` |
| Bulk PL / Get AWB | `Modules/OmniChannel/Http/Controllers/TransferPickingController.php` |
| Print Internal AWB | `Modules/OmniChannel/Http/Controllers/SalesOrderAwbController.php` |
| Picklist | `Modules/OmniChannel/Services/PicklistService.php` |
| Ship / AWB | `Modules/OmniChannel/Services/OmniService.php`, `OmniBaseService.php` (`createGetResiLog`) |
| Models | `SalesOrder`, `SalesOrderOtherInfo`, `GetResiLog`, `OrderProcessActionLog`, `WaveDetailSO` |
| Auto download | `Modules/OmniChannel/Jobs/SalesOrderDownloadAwbJob.php` + status observers |
| Cleanup 7d | `app/Console/Commands/Cleanup/CleanupAwbCommand.php` (Kernel daily) |

### Frontend

| Path | Role |
|------|------|
| `olshoperp-frontend/src/pages/Omni/Processing/Summary/DataList.vue` | Main list |
| `Counter.vue` | Status cards |
| `LogGetResi.vue` | Get Resi slideover |
| `BulkActionLog.vue` | Bulk Action Log |
| `DatalistDefectProduct.vue` | Broken Products |
| `DataTablesV3.vue` | Bulk Generate Pick List (`x_class` = TransferSummary) |

---

## 2. API Routes (utama)

Prefix `/api/omnichannel/` · `auth:sanctum` + `auth_verified`

| Method | Path | Action |
|--------|------|--------|
| GET | `transfer-summary` | `TransferSummaryController@index` |
| GET | `transfer-summary/count-status` | `getCountSummary` |
| GET | `transfer-summary/index-defect-product` | Defect products |
| GET | `transfer-summary/bulk-action-logs` | Bulk Action Log |
| GET | `transfer-summary/get-resi-logs` | Log Get Resi |
| GET | `transfer-summary/get-resi-logs-count` | Badge Success/Failed |
| POST | `transfer-summary/retry-get-awb` | Retry single |
| POST | `transfer-summary/bulk-get-awb` | Bulk Get AWB (delegates picking ctrl) |
| POST | `transfer-picking/bulk-generate-picklist` | Bulk PL (`x_class` → BySO) |
| GET | `sales-order/{id}/awb/print` | Print Internal AWB |
| GET | `file/{path}` | Raw platform AWB file `[VERIFY: route module]` |

Query list: `process_status` = pick/check/pack/outbound/shipping_ready (dll).

---

## 3. Database — Key Fields / Tables

| Item | Notes |
|------|-------|
| `omni_sales_orders.ready_to_process` | = 1 untuk list + counts |
| `omni_sales_orders.post_complete` | = 0 untuk tetap di populasi |
| `has_outbound` | `withExists` detail `processed_to_out_quantity > 0` |
| `can_print` | Computed: TYPE_PLATFORM + `unassign_wave_status = processed` + cancel check |
| `omni_sales_order_other_infos.shipping_document_path` | File lokal; di-null cleanup |
| `shipping_document_url` / `_created_at` | URL platform + jam simpan |
| `omni_get_resi_logs` | Attempt Get Resi; model plain (lihat GAP-OP-10) |
| `omni_order_process_action_logs` | Bulk job aggregates |
| `omni_wave_detail_s_os` | Membership untuk Bulk PL BySO |

---

## 4. Services / Jobs

| Component | Role |
|-----------|------|
| `bulkGeneratePicklistBySO` | Group selected SO by `WaveDetailSO`; skip instant; `PicklistService`; write `OrderProcessActionLog` |
| `getAwb` / `bulkGetAwb` | Platform gates + ship; write `GetResiLog` |
| `SalesOrderDownloadAwbJob` | Auto download; early-return jika sudah punya file |
| `CleanupAwbCommand` | Hapus file path setelah 7 hari; keep created_at/url |
| Observers status | Trigger auto AWB (Lazada/TikTok + masuk wave context) |

---

## 5. Flow utama

```mermaid
sequenceDiagram
  participant FE as Summary/DataList
  participant TS as TransferSummaryController
  participant TP as TransferPickingController
  participant PS as PicklistService
  participant Log as OrderProcessActionLog

  FE->>TS: GET transfer-summary (+ process_status)
  FE->>TS: GET count-status
  FE->>TP: POST bulk-generate-picklist x_class=TransferSummary
  TP->>TP: WaveDetailSO ∩ selected; skip instant
  TP->>PS: generatePicklist per wave
  TP->>Log: success / partial / failed
```

**Print eligibility (FE):** hide jika no path & no created_at, atau `!can_print`, atau `has_outbound`; tippy expired jika created_at set & path empty.

---

## 6. Invariants

| ID | Assertion |
|----|-----------|
| INV-OP-01 | Index: `ready_to_process = 1` AND `post_complete = 0` |
| INV-OP-02 | Satu bulk job → satu baris `OrderProcessActionLog` |
| INV-OP-03 | Tiap Get Resi attempt → baris baru `GetResiLog` (tidak overwrite) |
| INV-OP-04 | Instant processing SO tidak ikut Bulk PL BySO |
| INV-OP-05 | Print tombol tidak tampil jika `has_outbound` true |
| INV-OP-06 | Kartu `complete` tidak punya branch query (selalu empty/0) |

---

## 7. Validation Highlights

- Get AWB: general / Tokopedia / cancel (`platform_order_status`) / already has URL / platform logistic gates.  
- `can_print` cancel: **`platform_order_id` vs cancel codes** — GAP-OP-03 (beda dari getAwb).  
- Print Internal: path on disk; expire check field mismatch — GAP-OP-09.  
- Count Complete: FE hardcode 0 — GAP-OP-02.

---

## 8. Frontend Behaviors

- Cards: `all|pick|check|pack|outbound|shipping_ready`; `complete` no API.  
- Export Active Page Only; skip Availability column.  
- Log Get Resi badges dari `get-resi-logs-count` (global risk — GAP-OP-10).  
- Bulk PL via DataTablesV3 floating bar.

---

## 9. Failure Modes & Transaction Boundary

| Mode | Behavior |
|------|----------|
| Partial Bulk PL | Message `X out of Y`; log partially success |
| Get AWB fail in bulk | Log failed per attempt; lanjut order lain |
| Download job early-return | Soft skip (sudah punya file / store) |
| Cleanup | Null path only; URL/created_at tetap → tippy expired + shipping_ready masih mungkin |
| Print Internal expire | Baca field di SO model (salah sumber vs OtherInfo) — GAP-OP-09 |

---

## 10. Data Lifecycle

| Data | Hulu | Order Process | Hilir |
|------|------|---------------|-------|
| `WaveDetailSO` | Unassign / Waves | Eligible Bulk PL | Picking List |
| AWB path/url | Get Resi / auto job | Action print + Shipping Ready card | Cleanup 7d |
| `processed_to_out_quantity` | Outbound detail | `has_outbound` gate print + Outbound card | — |
| Instant processing setting | Order Process Setting | Exclude Bulk PL | Skip Processing paths |

---

## 11. Tests & QA Notes

- Regresi: Complete card, cancelled SO masih `can_print`, Internal vs Platform print setelah cleanup, silent skip non-wave bulk PL, badge Get Resi multi-company.  
- Ubah response Action flags → update mock FE Summary.

---

## 12. Known Issues

| GAP | Technical note |
|-----|----------------|
| GAP-OP-02 | `Counter.vue` hardcode 0; BE no `complete` branch |
| GAP-OP-03 | `in_array(platform_order_id, cancel_codes)` |
| GAP-OP-04/05 | Uniform 7d cleanup; no countdown UI |
| GAP-OP-06 | Auto job abort if timestamp set; triggers ≠ “ever got before” |
| GAP-OP-08 | Non-wave SO omitted without per-id errors |
| GAP-OP-09 | Internal print uses `$sales_order->shipping_document_url_created_at` |
| GAP-OP-10 | `GetResiLog` tanpa company scope eksplisit di count |

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-07-20 | Initial dari SoT v1.2 + TransferSummary map |
