---
doc_type: technical
menu: omni-skip-processing
menu_name: "Skip Processing"
version: 1.0
last_updated: 2026-07-20
owner: QA - Yemima
status: draft
aliases: [skip processing API, SkipProcessingJob, ProcessingService skip]
---

# Skip Processing — Technical Documentation

**API hub:** `omnichannel/transfer-summary` (`mode=skip_processing`)  
**Module:** `Modules/OmniChannel` (+ entity log di SupplyChain)  
**UI:** `/omni/skip-processing` · FE `@Omni/Processing/SkipProcessing/`  
**Behavior SoT:** [requirement.md](./requirement.md) v1.0  
**Batch prefix:** `SP-{YmdHisv}-{XX}`

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Entry / datalist | `Modules/OmniChannel/Http/Controllers/TransferSummaryController.php` (`bulkSkipProcessing`, index mode) |
| Log API | `Modules/OmniChannel/Http/Controllers/SkipProcessingLogController.php` |
| Orchestrator | `Modules/OmniChannel/Services/ProcessingService.php` |
| Stages | `Modules/OmniChannel/Traits/Processing/SkipProcessTrait.php` |
| DO / ship | `Modules/OmniChannel/Traits/Processing/DeliveryOrderProcessTrait.php` |
| Helpers / Echo / log | `Modules/OmniChannel/Traits/Processing/ProcessHelperTrait.php` |
| Status const | `Modules/OmniChannel/Constants/SkipProcessingStatus.php` |
| Log entity | `Modules/SupplyChain/Entities/SkipProcessingLog.php` → `scm_skip_processing_logs` |
| Jobs | `SkipProcessingJob`, `SkipProcessingCreateDeliveryOrdersJob`, `SkipProcessingApproveDOJob`, `SkipProcessingApproveDOChunkJob`, `SkipProcessingRetryJob`, `SkipProcessingExportExcelJob` |
| Bridge | Skip Wave (`SkipWaveLogic`) reuse batch/logs; legacy `SkipProcessingIndividualMenuJob` |

### Frontend

| Path | Role |
|------|------|
| `olshoperp-frontend/src/pages/Omni/Processing/SkipProcessing/DataList.vue` | List + Echo progress |
| `SkipProcessingLogTable.vue` | Log slideover |
| `DataTablesV3.vue` | `bulkSkipProcessing` |

---

## 2. API Routes (utama)

Prefix `/api/omnichannel/`

| Method | Path | Action |
|--------|------|--------|
| GET | `transfer-summary?mode=skip_processing` | Index |
| GET | `transfer-summary/count-status?mode=skip_processing` | Cards |
| POST | `transfer-summary/bulk-skip-processing` | Bulk/single skip |
| GET | `transfer-summary/skip-processing-log` | Batch aggregates |
| GET | `transfer-summary/skip-processing-log-detail` | `type=success\|failed\|do_processed` |
| GET | `transfer-summary/skip-processing-transfer-log-detail` | Stage transfer detail |
| GET | `transfer-summary/skip-processing/export-*` | Export file/progress/excel |

Queue: `salesorder_connection_{git_branch}` / SalesOrder queue name.

---

## 3. Database & Locks

### `scm_skip_processing_logs`

`user_id`, `company_id`, `sales_order_id`, `stage` (Picking…Shipped/Wave), `batch_code`, `message`, `is_success`, timestamps. Insert sering raw DB (survive rollback). Entity `$fillable` mungkin omit `stage` — `[VERIFY]`.

### Eligibility / qty

- List: `unassign_wave_status = processed`.
- DO attach: `prepared_to_do_quantity + processed_to_do_quantity < sales_order_quantity_in_base_unit`.
- Shipping approve: `processed += qty`, `prepared -= qty`.

### Cache locks

| Key | Purpose |
|-----|---------|
| `skip_processing_locked_so_{id}` TTL 12h | Duplicate guard; release di finalization |
| `lock:wh_process:{…}` TTL 120 / wait 30 | Serialize stages per WH process |
| `lock:do_create:{owned_by}` | DO find-or-create |
| Batch caches `successful_ids` / DO maps | Merge across chunks |

---

## 4. Flow utama

```mermaid
sequenceDiagram
  participant FE as SkipProcessing/DataList
  participant API as TransferSummaryController
  participant Job as SkipProcessingJob
  participant S as ProcessingService
  participant DOA as CreateDO Job
  participant DOB as ApproveDO Chunk
  participant Log as scm_skip_processing_logs

  FE->>API: POST bulk-skip-processing
  API->>API: lock SO; validateProcessStatus
  API->>Job: Bus batch chunks
  Job->>S: resume from process_type
  S->>S: WH lock; skipPicking…skipCollecting
  S->>Log: stage success/fail
  Job->>DOA: CreateDeliveryOrders
  DOA->>DOB: ApproveDO
  DOB->>S: finalization unlock + Echo ProcessStatus
```

**Resume** (latest `process_type`): wave→full chain; picking→check+pack+collect; checking open→pack+collect; packing open→collect; shipping open/approved→collect/DO; else log completed/no further.

**Retry:** `SkipProcessingRetryJob` delay 5/10/15s max 5 untuk deadlock/lock/SAVEPOINTS/dll; collecting retries ≤3.

---

## 5. Invariants

| ID | Assertion |
|----|-----------|
| INV-SP-01 | Skip list hanya `unassign_wave_status = processed` |
| INV-SP-02 | `Total_SO_Processed == Success + Failed` (tiap submit ≥1 log) |
| INV-SP-03 | Success batch = mencapai stage Shipped (DO approved) |
| INV-SP-04 | `prepared_to_do + processed_to_do <= so_qty_base`; `processed_to_do <= prepared` path setelah move |
| INV-SP-05 | Duplicate lock: miss any SO → release all → error V2 |
| INV-SP-06 | Sequential stages tanpa skip gap pada path sukses |

---

## 6. Validation Highlights

- `validateProcessStatusSalesOrder`: company, void, in-progress PL/CL/PK, DO multi-SO, already finished.
- V3 vs V4 message overlap — GAP-SP-02.
- WH lock timeout → log jelas, retryable jika message match.

---

## 7. Frontend Behaviors

- Echo `ProcessStatus` update progress / icons.
- Default Advanced Filter Data Owner = login company.
- Export jalur khusus skip-processing.
- Status cards share TransferSummary; Complete placeholder seperti Order Process.
- `[VERIFY]` status-pill URL rebuild: pastikan `mode=skip_processing` tidak hilang (GAP-SP-03 related).

---

## 8. Failure Modes & Transaction Boundary

| Mode | Behavior |
|------|----------|
| Duplicate click | Reject V2; no double docs |
| WH process lock timeout | Fail log; retryable |
| Deadlock / SAVEPOINT | Auto retry terbatas → failed log |
| Partial batch | `allowFailures()`; siblings lanjut |
| Mid-fail lock | Lock sampai finalization / TTL 12h — `[VERIFY]` ops |
| Log insert | Raw insert di luar ambient txn |

---

## 9. Data Lifecycle

| Data | Hulu | Skip Processing | Hilir |
|------|------|-----------------|-------|
| `unassign_wave_status` | Unassign / Skip Wave → processed | Eligibility | — |
| Transfer docs per stage | Auto-generate | Icon warna / PL ref | Order Process manual view |
| `prepared/processed_to_do` | Attach/approve DO | Qty bridge | Failed Ship |
| Customer Invoice draft | Attach DO | Auto-approve | Accounting |

---

## 10. Tests & QA Notes

- Cover: lock duplicate, resume mid-stage, deadlock retry, WH contention, DO qty, Echo progress, Retry from failed log.
- GAP-SP-01: cek description string di mutation/DO setelah skip.
- Tidak ada feature test dedicated terdeteksi — `[VERIFY]`.

---

## 11. Known Issues

| GAP | Technical note |
|-----|----------------|
| GAP-SP-01 | Approve merge “Auto approved by system” vs `getSkipProcessingDescription()` |
| GAP-SP-02 | Company vs wave-not-processed message similarity |
| GAP-SP-03 | Column/parity vs Order Process + mode query on card filters |

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-20 | Initial dari SoT + ProcessingService map |
