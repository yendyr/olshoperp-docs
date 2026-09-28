---
doc_type: technical
menu: omni-skip-wave-process
menu_name: "Skip Wave Process"
version: 1.4
last_updated: 2026-09-28
owner: QA - Yemima
status: review
aliases: [skip wave process API, SkipWaveProcessJob, SkipWaveLogic, processing order date, processing date, skip wave horizon jobs]
---

# Skip Wave Process — Technical Documentation

**API prefix:** `omnichannel/transfer-summary/skip-wave-process`  
**Module:** `Modules/OmniChannel`  
**UI:** `/omni/skip-wave-process` · FE `@Omni/Processing/SkipWaveProcess/`  
**Behavior SoT:** [requirement.md](./requirement.md) v1.4  
**Batch codes:** `SW-` import · `WV-` wave · `SP-` processing

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `Modules/OmniChannel/Http/Controllers/SkipWaveProcessController.php` |
| Import class | `Modules/OmniChannel/Import/SkipWaveProcessImport.php` |
| Import job | `Modules/OmniChannel/Jobs/SkipWaveProcessImportJob.php` |
| Export | `Modules/OmniChannel/Exports/SkipWaveProcessExport.php` + `SkipWaveProcessExportJob` |
| Wave job | `Modules/OmniChannel/Jobs/SkipWaveProcessJob.php` |
| Orchestrator | `Modules/OmniChannel/Logics/SkipWave/SkipWaveLogic.php` |
| Processing | `Modules/OmniChannel/Services/ProcessingService.php` (+ Skip/DO traits) |
| Optimized skip stages | `Modules/SupplyChain/Logics/Processing/{Picking,Checking,Packing,Collecting,Shipping,DeliveryOrder}ListLogic.php` + `Traits/ManagesProcessingDetail.php` (ETM-16006) |
| Skip approve path | `app/Helpers/SupplyChain/ItemStockMutation::approveSkipTransfer()` |
| Dispatch cron | `app/Console/Commands/SalesOrder/SkipWaveDispatchCommand.php` (`skip-wave:dispatch`) |
| Shared wave | `Modules/OmniChannel/Jobs/SOApproveToWave.php` |
| Shared skip | `Modules/OmniChannel/Jobs/SkipProcessingJob.php` (+ DO jobs, RetryJob) |
| PL / stock date | `Modules/OmniChannel/Services/PicklistService.php`; `SalesOrderValidationLogic::getStockDate()` |
| Entities | `SkipWaveProcess`, `SkipWaveProcessUploadLog`, `SkipWaveProcessUploadLogDetail` |
| Wave log flag | `omni_unassign_wave_logs.error_retriable` — filter retry wave (ETM-15963 / redispatch) |
| **Processing Date setting** | `ScmSetting.sales_order_processing_date` · `ScmSettingController@update` · `validate_fiscal_period` |
| **Batch snapshot** | `omni_skip_wave_process.processing_date` diisi saat upload dari setting atau `now()` |

### Frontend

| Path | Role |
|------|------|
| `…/SkipWaveProcess/DataList.vue` | Main list + Echo ETA + Processing Date picker |
| `SkipWaveProcessLogTable.vue` | Import logs + detail modal + Audit Log |
| `SkipProcessingTransferLogTable.vue` / `SkipProcessingDoLogTable.vue` | Stage / DO drilldown |
| Shared date picker | `pages/SCM/Setting/components/SalesOrderProcessingDate.vue` (juga Unassign Wave + Skip Processing readonly) |
| Reuse | `UnassignWave/LogTables.vue`, `SkipProcessing/SkipProcessingLogTable.vue` |

---

## 2. API Routes (utama)

| Method | Path | Action |
|--------|------|--------|
| GET | `…/skip-wave-process` | Index (eligible batches + progress aggs) |
| POST | `…/skip-wave-process/upload` | Upload + enqueue ImportJob |
| GET | `…/skip-wave-process/log` | Import logs |
| GET | `…/skip-wave-process/log-detail` | Detail per Order No |
| GET | `…/skip-wave-process/log-detail-summary` | Counts |
| GET | `…/skip-wave-process/export-*` | Export |

Wave/processing drilldown memakai API Unassign Wave / Skip Processing (bukan method `waveLog`/`processingLog` yang undeclared body).

---

## 3. Database & Locks

| Table | Role |
|-------|------|
| `omni_skip_wave_process` | Batch: codes, `total_sales_order`, `is_eligible`, `skip_wave_status` |
| `omni_skip_wave_process_upload_logs` | Import summary message / is_error |
| `omni_skip_wave_process_upload_log_details` | Per Order No result |
| `omni_unassign_wave_logs` | Fase wave (`WV-`) |
| `scm_skip_processing_logs` | Fase skip (`SP-`) |

| Lock | TTL | Purpose |
|------|-----|---------|
| `SKIP_WAVE_BATCH_LOCK_PREFIX{soId}` | 3600s | Import success lock; owner = batch |
| `skip_processing_locked_so_{id}` | 12h | Processing phase |
| WH process / DO create | 120s / 60s | Shared Skip Processing |

---

## 4. Import → Dispatch flow (jobs)

**Kanonik lengkap (primary + derived + dead-code DO + observasi Horizon):**  
[horizon-jobs/pipelines/skip-wave-process.md](../horizon-jobs/pipelines/skip-wave-process.md)

```mermaid
sequenceDiagram
  participant FE as DataList upload
  participant API as SkipWaveProcessController
  participant Imp as SkipWaveProcessImportJob
  participant Cron as skip-wave:dispatch
  participant Wave as SkipWaveProcessJob
  participant Proc as SkipProcessingJob

  FE->>API: POST upload
  API->>API: pre-check header/rows; create SW/WV/SP; log In Progress
  API->>Imp: dispatch queue import
  Imp->>Imp: validate rows; write details; is_eligible; lock SOs
  Note over Imp: Does NOT dispatch Wave job
  Cron->>Cron: gate no pending/processing global
  Cron->>Wave: in_queue + eligible → pending + SkipWaveProcessJob
  Wave->>Wave: Bus batch SOApproveToWave → cleanupSkipWave
  Wave->>Proc: chunk 10 → skip stages incl skipShipping DO
  Note over Proc: Create/Approve DO jobs dead in runBatchFinally
```

| Job | Queue | Fan-out (1.000 SO) |
|-----|-------|---------------------|
| `SkipWaveProcessImportJob` | import | 1 |
| `SkipWaveProcessJob` | SalesOrder | 1 |
| `SOApproveToWave` | SalesOrder | 1.000 |
| `SkipProcessingJob` | SalesOrder | 100 (10/SO) |
| `SkipProcessingRetryJob` | SalesOrder | hanya retry |

Hard cap: **1000** data rows. Chunks: 10 SO / `SkipProcessingJob`. DO = **inline** `skipShipping` (bukan Create/Approve DO job batch). Retry transient max 5 · delay 5/10/15s.

---

## 5. Progress formulas (index)

| Metric | Formula |
|--------|---------|
| `wave_progress` % | `processed_so_count / log_total_so` — SO dengan `unassign_wave_status=processed` |
| `processing_progress` % | `(sum 5 stage successes) / (total×5)` |
| UI Skip Processing count | `shipped_success / total` |
| `overall_progress` | `(wave + 5 stages) / (total×6)` |
| Wave Failed | failed log tanpa success |
| Wave Retried | success + failed Savepoint |
| ETA Echo | Weighted `ESTIMATE_STAGE_WEIGHTS` |

### 5.1 Datalist performance (ETM-15972 · ETM-15985)

Hotspot: `SkipWaveProcessController@index`.

| Teknik | Detail |
|--------|--------|
| Defer aggregates | Agregasi upload / wave / processing **hanya untuk baris halaman aktif** (`start`/`length`), bukan seluruh eligible batch |
| Cache keys | `skip_wave_agg_upload_{SW}`, `skip_wave_agg_wave_{WV}`, `skip_wave_agg_proc_{SP}` |
| TTL selesai | Status batch `completed`/`failed` → cache **7 hari** |
| TTL in-flight | Status lain → cache **30 detik** (refresh progress) |
| Inject column | `_inject_aggregates` lazy-load via closure sekali per response page |

Tanpa pola ini, index bisa ~20s karena N× aggregate heavy joins.

---

## 5b. Reliability & pipeline optim (Sep 2026)

| ETM | Area | Perilaku teknis |
|-----|------|-----------------|
| [ETM-15963](https://erpintegration.atlassian.net/browse/ETM-15963) / [ETM-16002](https://erpintegration.atlassian.net/browse/ETM-16002) | Redispatch | `SkipWaveLogic::redispatch` — wave incomplete via `error_retriable`; API `POST …/redispatch/{batchCode}` |
| [ETM-16032](https://erpintegration.atlassian.net/browse/ETM-16032) | Wave retry filter | Error **Processing Date &lt; SO trx date** **tidak** di-flag `error_retriable` (hindari 5× auto-retry sia-sia) |
| [ETM-15988](https://erpintegration.atlassian.net/browse/ETM-15988) | DO kosong | Guard eksistensi DO di `skipShipping` + command temp `FixDuplicateSkipWaveDoCommand` |
| [ETM-15999](https://erpintegration.atlassian.net/browse/ETM-15999) | Retry idempotency | `ProcessingService`: SO yang sudah punya DO Approved → **skip** stage ulang (cegah redispatch 1000 SO penuh) |
| [ETM-16006](https://erpintegration.atlassian.net/browse/ETM-16006) | Optimized skip flow | Stage Picking→Shipping memakai `*ListLogic` + `ItemStockMutation::approveSkipTransfer` (jalur terpisah dari approve transfer reguler) |
| [ETM-16037](https://erpintegration.atlassian.net/browse/ETM-16037) | Deadlock / DO corrupt | `SkipProcessTrait` — retry deadlock + perbaikan race `skipShipping` (DO tanpa detail) |

Detail shared stages: [omni-skip-processing/technical.md](../omni-skip-processing/technical.md) §4b.  
Fan-out Horizon: [horizon-jobs/pipelines/skip-wave-process.md](../horizon-jobs/pipelines/skip-wave-process.md).

---

## 6. Invariants

| ID | Assertion |
|----|-----------|
| INV-SW-01 | Max 1 batch `pending`/`processing` at a time (AS-IS global — GAP-SW-02) |
| INV-SW-02 | `is_eligible=true` hanya jika semua baris valid **dan** semua SO locked |
| INV-SW-03 | Terminal `completed`/`failed` tidak kembali ke pending/processing |
| INV-SW-04 | ≤1000 data rows per file |
| INV-SW-05 | DO count ≤ unique shippers in successful set (grouping) |

---

## 7. Validation Highlights

### Upload (controller sync)

| Check | Rule |
|-------|------|
| MIME | `required\|mimes:xlsx,xls,csv` — **no** `max:` file size in FormRequest |
| Header | First column / header must resolve to **Order No** |
| Rows | ≥1 data row; Import class hard cap **1000** data rows |
| Processing Date snapshot | `ScmSetting.sales_order_processing_date` → parse; if empty/`null` → **`now()`** (full datetime) stored on batch |

### Import screening (R1–R5 · all-or-nothing)

- Order found by `code` **or** `platform_order_id`
- No duplicate Order No in file
- Same company as uploader
- Tx status Approved or Processed
- Wave status not already processed (Must be Unassigned / in queue)
- Lock conflict → release locks, `is_eligible=false`, completed

**Summary messages (job):** `Import Success: …` · `Import Failed: Validation complete. {ok} valid, {fail} issues…` · lock / incomplete variants.

### Wave phase (not Import)

`SOApproveToWave`: if batch/setting processing date is set and `sales_order.transaction_date > processing_date` → `WarningException`: *The Processing Date must be on or after the Sales Order transaction date.*  
ETM-16032: error ini **tidak** `error_retriable` (hindari auto-retry sia-sia).

### Stage 2

Shared Skip Processing validations.

---

## 8. Frontend Behaviors

- Echo `ProcessStatus` + toast refresh.
- Main list filter `is_eligible=1` — failed import hanya di Log Data.
- File download tooltip 24h.
- `SalesOrderProcessingDate.vue` tooltip (EN): whole-process date; empty → current date & time; order trx must be on or before date (else cannot process to wave). Shared with Unassign Wave / Skip Processing readonly.

---

## 9. Failure Modes & Retry

| Mode | Behavior |
|------|----------|
| Baris invalid (Import) | Entire batch completed; no stage 2 (GAP-SW-01) |
| Lock conflict | Release all; completed |
| Import exception | completed + generic Import Failed message |
| SO trx date > Processing Date | Import may succeed; **Wave** fails that SO (POD3) — not Import Failed |
| Wave/processing/DO retry | Auto max 5, delay 5/10/15s; patterns savepoint/deadlock/lock/… — hanya log `error_retriable=true` |
| Stuck &gt;60 menit | UI **Redispatch** → `SkipWaveLogic::redispatch` (bukan re-upload file) |
| SO sudah punya DO | Skip Processing job **no-op** untuk SO itu (ETM-15999) |

---

## 10. Data Lifecycle

| Data | Hulu | Skip Wave | Hilir |
|------|------|-----------|-------|
| Upload details | File | Eligibility gate | — |
| `processing_date` batch | `ScmSetting` or `now()` at upload | Snapshot for Wave + skip stages | Audit |
| `unassign_wave_status` | Wave job | Wave Progress | Skip Processing eligibility |
| Skip logs / DO | ProcessingService | Skip Processing column | Failed Ship / CI |
| Transfer trx dates | Skip generate | PL / stock = batch processing date; cascade +10s; GAP-SW-05 superseded | Audit/report |
| `sales_order_processing_date` | `scm_settings` | Shared UW + SW + SP readonly | Wave FIFO + stock date |

---

## 11. Tests & QA Notes

- Cover: all-or-nothing, lock conflict, cron gate global, 1000 cap, progress aggs, Echo ETA.
- Cover Processing Date: empty→`now()`, persist, fiscal/future reject, company isolation, late-stock SO, **POD3** (Import OK / Wave fail).
- Regresi GAP-SW-01/02; GAP-SW-05 superseded.
- Related docs Unassign/Skip Processing harus tetap konsisten saat ubah shared jobs / shared date component.

---

## 12. Known Issues

| GAP | Technical note |
|-----|----------------|
| GAP-SW-01 | ImportJob sets `is_eligible=false` if any failed row |
| GAP-SW-02 | `SkipWaveDispatchCommand` `exists()` tanpa filter company |
| GAP-SW-05 | **Superseded** — batch `processing_date` + `ScmSetting` |
| — | ImportJob imports `SkipWaveProcessJob` but does not dispatch it |
| — | `runBatchFinally` early-return: Create/Approve DO jobs dead code; DO di `skipShipping` |
| — | Job turunan (audit/ending stock/sync) — lihat horizon-jobs pipeline § Derived |

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.4 | 2026-09-28 | AS-IS Processing Date (`ScmSetting` + batch snapshot `now()`); POD3 Wave fail; export headings; mime without max size; FE tooltip note |
| 1.3 | 2026-09-25 | Perf datalist (defer + cache agg ETM-15972/15985); reliability: redispatch, DO guard, retry idempotency, optimized skip flow, deadlock (ETM-15963…16037) |
| 1.2 | 2026-09-20 | Link kanonik Horizon jobs pipeline; tabel fan-out; dead-code DO path |
| 1.1 | 2026-07-28 | Processing Order Date; GAP-SW-05 superseded; PicklistService wire note |
| 1.0 | 2026-07-20 | Initial dari SoT + ImportJob/cron map |
