---
doc_type: technical
menu: omni-unassign-wave
menu_name: "Unassign Wave"
version: 1.0
last_updated: 2026-07-20
owner: QA - Yemima
status: draft
aliases: [unassign wave API, SOApproveToWave, send wave logs technical]
---

# Unassign Wave — Technical Documentation

**API prefix:** `omnichannel/unassign-wave`  
**Module:** `Modules/OmniChannel`  
**Behavior SoT:** [requirement.md](./requirement.md) v1.0  
**Default wave:** `Wave::getDefaultWave()` → wave `id = 1` (cache `default_wave_1`)

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Routes | `Modules/OmniChannel/Routes/api.php` (prefix `unassign-wave`) |
| Controller | `Modules/OmniChannel/Http/Controllers/UnassignWaveController.php` |
| Log controller | `Modules/OmniChannel/Http/Controllers/UnassignWaveLogController.php` |
| Policy | `Modules/OmniChannel/Policies/UnassignWavePolicy.php` |
| Entity (SO alias) | `Modules/OmniChannel/Entities/UnassignWave.php` |
| Log entity | `Modules/OmniChannel/Entities/UnassignWaveLog.php` |
| Log export entity | `Modules/OmniChannel/Entities/UnassignWaveLogExportFile.php` |
| Core logic | `Modules/OmniChannel/Logics/UnassignWave/MoveToDefaultWaveLogic.php` |
| Service | `Modules/OmniChannel/Services/WaveService.php` (`addToDefaultWave`) |
| Wave model | `Modules/OmniChannel/Entities/Wave.php` |
| Job send | `Modules/OmniChannel/Jobs/SOApproveToWave.php` |
| Job attach | `Modules/OmniChannel/Jobs/MoveSOToWaveMixJob.php` (`dispatchSync`) |
| Export jobs | `UnassignWaveExportExcelJob`, `UnassignWaveLogExportJob` |
| Setting gate | `Modules/GeneralSetting/Entities/OrderProcessSetting.php` (`process_to_wave`) |

### Frontend

| Layer | Path |
|-------|------|
| Route | `olshoperp-frontend/src/router/index.ts` → `unassign-wave` |
| List | `olshoperp-frontend/src/pages/Omni/UnassignWave/DataList.vue` |
| Logs | `olshoperp-frontend/src/pages/Omni/UnassignWave/LogTables.vue` |
| Progress | `olshoperp-frontend/src/pages/Omni/UnassignWave/ProgressChecker.vue` |
| Bulk/single actions | `olshoperp-frontend/src/components/project/DataTables/DataTablesV3.vue` |

Tidak ada Pinia store khusus — axios di page + DataTablesV3.

### Cross-module (Skip Wave reuse)

| Path | Role |
|------|------|
| `Modules/OmniChannel/Jobs/SkipWaveProcessJob.php` | Dispatch `SOApproveToWave` + batch_code skip |
| `Modules/OmniChannel/Logics/SkipWave/SkipWaveLogic.php` | Cleanup `in queue` |
| `olshoperp-frontend/.../SkipWaveProcess/DataList.vue` | Embed `UnassignWave/LogTables.vue` |

---

## 2. API Routes (utama)

Prefix: `/api/omnichannel/` · middleware `auth:sanctum` + `auth_verified`

| Method | Path | Action |
|--------|------|--------|
| POST | `unassign-wave` | `UnassignWaveController@index` |
| POST | `unassign-wave/{sales_order_id}/send-to-wave` | `processSOtoWave` |
| POST | `unassign-wave/bulk-send-to-wave` | `bulkProcessSOtoWave` (`data_ids` CSV) |
| GET | `unassign-wave/count-failed-process` | `getCountFailedProcess` |
| GET | `unassign-wave/count-on-process` | `getCountOnProcess` |
| GET | `unassign-wave/refresh-stock` | `refreshStock` |
| GET | `unassign-wave/processing` | `processing` |
| GET | `unassign-wave/check-progress` | `checkProgress` (`ids` query) |
| GET | `unassign-wave/data-logs` | `UnassignWaveLogController@index` |
| GET | `unassign-wave/data-logs/export-*` | Log export |
| GET | `unassign-wave/export-*` | List export |

Query list: `failed_process=true`, `on_process_queue=true`.

---

## 3. Database — Key Tables

### `omni_sales_orders` (via `SalesOrder` / `UnassignWave`)

| Column / rule | Notes |
|---------------|-------|
| `unassign_wave_status` | `not in queue` \| `in queue` \| `processed` (constants di `SalesOrder`) |
| `transaction_status` | List: `approved` **atau** `processed` |
| `type_sales_order` | `platform` \| `general`; filtered by `process_to_wave` |
| Detail qty | Tidak boleh ada detail dengan `prepared_to_out_quantity` / `processed_to_out_quantity` > 0 |

### `omni_unassign_wave_logs`

| Column | Notes |
|--------|-------|
| `sales_order_id`, `sales_order_number` | FK order |
| `batch_code` | Prefix `WV-…` (atau batch skip wave) |
| `status_progress` | in progress / success / failed |
| `error_message`, `processed_at` | Hasil attempt |
| Audit | `created_by` = processed by |

### Related

| Table | Role |
|-------|------|
| `omni_sales_order_errors` / detail errors | Failed Process flags; force-delete on success |
| `omni_waves` + `omni_wave_detail_s_os` | Membership default wave setelah sukses |
| `omni_sales_order_export_files` | Export list (`menu` = Unassign Wave) |
| `omni_unassign_wave_log_export_files` | Export logs |

---

## 4. Services / Jobs

| Component | Responsibility |
|-----------|----------------|
| `SOApproveToWave` | Job per SO; create log in progress; acquire WH lock; call logic; update log |
| `MoveToDefaultWaveLogic` | Validasi stock/random; `createTransferWave`; sync mix job |
| `MoveSOToWaveMixJob` | `WaveService::addToDefaultWave` |
| `WaveService::addToDefaultWave` | Mutations + `WaveDetailSO`; set `unassign_wave_status = processed` |
| Bus batch `so_approve_to_wave` | `allowFailures()`; `finally` reset sisa `in queue` → `not in queue` |
| Lock | `lock:wh_process:{wh_process_id}` TTL 120s, wait 30s |

Optional AWB: `OmniService::shipSalesOrder` jika config `omni.shipped_at.default_wave` + platform SO — boundary rollback lihat §7.

---

## 5. Flow utama

```mermaid
sequenceDiagram
  participant FE as DataList/DataTablesV3
  participant API as UnassignWaveController
  participant Batch as Bus batch so_approve_to_wave
  participant Job as SOApproveToWave
  participant Logic as MoveToDefaultWaveLogic
  participant Mix as MoveSOToWaveMixJob
  participant WS as WaveService
  participant Log as UnassignWaveLog

  FE->>API: POST send-to-wave / bulk-send-to-wave
  API->>API: validateBundleComponents; set in queue
  API->>Batch: Bus::batch SOApproveToWave allowFailures
  Batch->>Job: handle
  Job->>Log: create in progress
  Job->>Job: Cache lock wh_process
  Job->>Logic: handle
  Logic->>Mix: dispatchSync
  Mix->>WS: addToDefaultWave
  WS->>WS: mutations + WaveDetailSO; status processed
  Job->>Log: success; forceDelete SalesOrderError
  Note over Batch: finally: sisa in queue direset ke not in queue
  FE->>API: check-progress
```

---

## 6. Invariants

| ID | Assertion |
|----|-----------|
| INV-UW-01 | SO dengan `unassign_wave_status = processed` tidak muncul di index Unassign Wave |
| INV-UW-02 | Index hanya SO dengan status wave ∈ {not in queue, in queue} dan tanpa detail outbound qty > 0 |
| INV-UW-03 | Send single hanya jika `unassign_wave_status = not in queue` |
| INV-UW-04 | Sukses path: `processed` + `WaveDetailSO` ke default wave |
| INV-UW-05 | Batch `finally` mereset SO batch yang masih `in queue` → `not in queue` |
| INV-UW-06 | Jika `process_to_wave = 0`, General SO tidak masuk list/bulk dan ditolak di single send |
| INV-UW-07 | Satu baris `omni_unassign_wave_logs` per job attempt (per SO), bukan per UI bulk click |
| INV-UW-08 | Sukses send force-delete `SalesOrderError` untuk SO tersebut |

---

## 7. Validation Highlights

- Bundle: `validateBundleComponents()` sebelum dispatch (bulk: failure return error untuk seluruh request).
- Job-level: `SalesOrderValidationLogic` + stock/random di `MoveToDefaultWaveLogic`.
- Failed Process list: `error_info` OR `detail_error_flags` OR `store_id` in warehouse-error stores.
- Count Failed Process: filter `transaction_status = approved` **saja** (beda dari index — GAP-UW-02).

---

## 8. Frontend Behaviors

- Pills Failed / On Process: query flag ke API; toggle eksklusif.
- ProgressChecker: poll `processing` + `check-progress`; success = `processed`, fail = kembali `not in queue`.
- Refresh stock: `GET refresh-stock` tanpa selection id (server-side scan eligible + stock errors).
- Skip Wave Process page reuse `LogTables.vue`.

---

## 9. Failure Modes & Transaction Boundary

| Mode | Behavior |
|------|----------|
| Validasi / stock / store inactive di job | Log `failed`; SO tidak `processed`; batch lanjut (`allowFailures`) |
| Lock timeout | `Lock wait timeout acquiring warehouse process lock` di log |
| Partial bulk | Independent per-SO jobs |
| Bundle fail di entry bulk | Seluruh dispatch dibatalkan (return error) |
| `refreshStock` exception | Full DB rollback |
| Batch finally | Selalu clear leftover `in queue` untuk SO ids batch |
| AWB fail setelah attach wave | `[VERIFY: CODEBASE]` scope rollback vs reserve yang sudah commit |

---

## 10. Data Lifecycle (lintas dokumen)

| Flag / status | Hulu | Unassign Wave | Hilir |
|---------------|------|---------------|-------|
| `unassign_wave_status` | Set `not in queue` saat approve | → `in queue` → `processed` | Guard Waves / Picking / Checking / Packing |
| Error flags SO | Shared dengan Failed Process SO Platform/General | Ditulis saat gagal send; dihapus saat sukses | Muncul di SO list Failed Process |
| Send Wave Logs | Trigger UW atau Skip Wave | Tulis `omni_unassign_wave_logs` | Dibaca kedua menu |

---

## 11. Tests & QA Notes

- Feature coverage disarankan: eligibility filter, `process_to_wave` gate, single/bulk send, batch finally reset, refresh stock hanya clear stock errors, log per SO.
- Regresi GAP-UW-02: bandingkan `count-failed-process` vs `POST index?failed_process=true` untuk SO `transaction_status = processed`.
- Setelah ubah response shape / status wave: update mock FE di `olshoperp-frontend` jika ada.

---

## 12. Known Issues

| GAP | Technical note |
|-----|----------------|
| GAP-UW-01 | Failed filter `orWhereIn(store_id, warehouseErrorStoreIds)` tanpa wajib `error_info` → UI Error Flag kosong |
| GAP-UW-02 | `getCountFailedProcess` pakai `TS_APPROVED` only; `index` pakai `approved` + `processed` |
| GAP-UW-03 | UI disable vs API reject — pastikan DataTablesV3 menonaktifkan action saat `in queue` |

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-20 | Initial dari SoT + codebase map |
