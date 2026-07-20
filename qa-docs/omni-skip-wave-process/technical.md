---
doc_type: technical
menu: omni-skip-wave-process
menu_name: "Skip Wave Process"
version: 1.0
last_updated: 2026-07-20
owner: QA - Yemima
status: draft
aliases: [skip wave process API, SkipWaveProcessJob, SkipWaveLogic]
---

# Skip Wave Process — Technical Documentation

**API prefix:** `omnichannel/transfer-summary/skip-wave-process`  
**Module:** `Modules/OmniChannel`  
**UI:** `/omni/skip-wave-process` · FE `@Omni/Processing/SkipWaveProcess/`  
**Behavior SoT:** [requirement.md](./requirement.md) v1.0  
**Batch codes:** `SW-` import · `WV-` wave · `SP-` processing

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `Modules/OmniChannel/Http/Controllers/SkipWaveProcessController.php` |
| Import class | `Modules/OmniChannel/Import/SkipWaveProcessImport.php` |
| Import job | `Modules/OmniChannel/Jobs/SkipWaveProcessImportJob.php` |
| Wave job | `Modules/OmniChannel/Jobs/SkipWaveProcessJob.php` |
| Orchestrator | `Modules/OmniChannel/Logics/SkipWave/SkipWaveLogic.php` |
| Processing | `Modules/OmniChannel/Services/ProcessingService.php` (+ Skip/DO traits) |
| Dispatch cron | `app/Console/Commands/SalesOrder/SkipWaveDispatchCommand.php` (`skip-wave:dispatch`) |
| Shared wave | `Modules/OmniChannel/Jobs/SOApproveToWave.php` |
| Shared skip | `Modules/OmniChannel/Jobs/SkipProcessingJob.php` (+ DO jobs, RetryJob) |
| Entities | `SkipWaveProcess`, `SkipWaveProcessUploadLog`, `SkipWaveProcessUploadLogDetail` |

### Frontend

| Path | Role |
|------|------|
| `…/SkipWaveProcess/DataList.vue` | Main list + Echo ETA |
| `SkipWaveProcessLogTable.vue` | Import logs + detail modal |
| `SkipProcessingTransferLogTable.vue` / `SkipProcessingDoLogTable.vue` | Stage / DO drilldown |
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

## 4. Import → Dispatch flow

```mermaid
sequenceDiagram
  participant FE as DataList upload
  participant API as SkipWaveProcessController
  participant Imp as SkipWaveProcessImportJob
  participant Cron as skip-wave:dispatch
  participant Wave as SkipWaveProcessJob

  FE->>API: POST upload
  API->>API: pre-check header/rows; create SW/WV/SP; log In Progress
  API->>Imp: dispatch queue import
  Imp->>Imp: validate rows; write details; is_eligible; lock SOs
  Note over Imp: Does NOT dispatch Wave job
  Cron->>Cron: gate no pending/processing
  Cron->>Wave: in_queue + eligible → pending + SkipWaveProcessJob
  Wave->>Wave: SOApproveToWave batch → SkipWaveLogic → SkipProcessing…
```

Hard cap: **1000** data rows. Chunks processing: 10 SO/job; DO create 100; approve 10.

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

- Controller sync: file mime, header, empty rows.  
- Import: R1–R5 eligibility; all-or-nothing.  
- Lock conflict → release acquired locks, `is_eligible=false`, completed.  
- Stage 2: shared Skip Processing validations.

---

## 8. Frontend Behaviors

- Echo `ProcessStatus` + toast refresh.  
- Main list filter `is_eligible=1` — failed import hanya di Log Data.  
- File download tooltip 24h.

---

## 9. Failure Modes & Retry

| Mode | Behavior |
|------|----------|
| Baris invalid | Entire batch completed; no stage 2 (GAP-SW-01) |
| Lock conflict | Release all; completed |
| Import exception | completed + generic Import Failed message |
| Wave/processing/DO retry | Auto max 5, delay 5/10/15s; patterns savepoint/deadlock/lock/… — no UI Retry button |

---

## 10. Data Lifecycle

| Data | Hulu | Skip Wave | Hilir |
|------|------|-----------|-------|
| Upload details | File | Eligibility gate | — |
| `unassign_wave_status` | Wave job | Wave Progress | Skip Processing eligibility |
| Skip logs / DO | ProcessingService | Skip Processing column | Failed Ship / CI |
| Transfer trx dates | Skip generate | AS-IS now+10s — GAP-SW-05 | Audit/report |

---

## 11. Tests & QA Notes

- Cover: all-or-nothing, lock conflict, cron gate global, 1000 cap, progress aggs, Echo ETA.  
- Regresi GAP-SW-01/02/05.  
- Related docs Unassign/Skip Processing harus tetap konsisten saat ubah shared jobs.

---

## 12. Known Issues

| GAP | Technical note |
|-----|----------------|
| GAP-SW-01 | ImportJob sets `is_eligible=false` if any failed row |
| GAP-SW-02 | `SkipWaveDispatchCommand` `exists()` tanpa filter company |
| GAP-SW-05 | Trx date logic di Skip Processing traits — basis eksekusi |
| — | ImportJob imports `SkipWaveProcessJob` but does not dispatch it |

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-20 | Initial dari SoT + ImportJob/cron map |
