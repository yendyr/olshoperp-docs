---
doc_type: technical
menu: horizon-jobs
menu_name: "Horizon Jobs"
version: 1.4
last_updated: 2026-10-11
owner: QA - Yemima
status: review
aliases: [horizon jobs technical, Bus::batch finally, queue connection salesorder, scheduler dump window, night schedule stagger]
---

# Horizon Jobs — Technical

**Audience:** Developer, QA automation  
**Index:** [README](./README.md) · Skip Wave: [pipelines/skip-wave-process.md](./pipelines/skip-wave-process.md) · Job-flow visual: [`../_meta/horizon-jobs/`](../_meta/horizon-jobs/)  
**Aturan QA:** [requirement.md](./requirement.md) v1.3 (HJ-01…HJ-08, PROP-HJ-01) · Night schedule: [§9](#9-night-schedule--mariadb-dump-window)

---

## 1. File Map (pola lintas menu)

| Layer | Contoh path | Peran |
|-------|-------------|-------|
| Menu jobs | `Modules/*/Jobs/*` | Primary dispatch |
| Logic / service | `Modules/*/Logics/*`, `Services/*` | Orchestrate `Bus::batch` + `finally` |
| Scheduler | `app/Console/Commands/*`, `app/Console/Kernel.php` | Gate / cron |
| Observers | `Modules/*/Observers/*` | Derived fan-out |
| Stock after approve | `app/Helpers/SupplyChain/StockAfterApproveHandler.php` | Ending stock / balance |
| Auditing | `owen-it/laravel-auditing` → `ProcessDispatchAudit` | Derived audit jobs |
| Queue helper | `getQueueName('SalesOrder'|'import'|…)` | Connection naming |

---

## 2. Pola arsitektur

### 2.1 Primary vs derived

```mermaid
sequenceDiagram
  participant UI as Menu API
  participant Prim as Primary Job
  participant Dom as Domain write
  participant Obs as Observer or Handler
  participant Der as Derived Job

  UI->>Prim: dispatch / Bus::batch
  Prim->>Dom: approve transfer / update stock
  Dom->>Obs: saved / after approve
  Obs->>Der: StoreEndingStock SyncStock Audit
```

### 2.2 `Bus::batch` + `finally`

- Banyak pipeline Skip Wave memakai `allowFailures()` + `finally` untuk cleanup / fase berikutnya.
- **Fragility:** jika `pending_jobs` tidak pernah 0 (job hilang dari Redis, stall worker), `finally` tidak jalan → status batch UI bisa macet.
- Satu job dalam satu batch (pola `ItemStockObserver`) menambah baris `job_batches` tanpa manfaat callback grup.

### 2.3 Queue names (AS-IS Skip Wave)

| Job family | Queue helper |
|------------|--------------|
| Import Excel | `getQueueName('import')` |
| Wave + Skip Processing + retry | `getQueueName('SalesOrder')` |

---

## 3. Invariants (lintas pipeline)

| ID | Assertion |
|----|-----------|
| INV-HJ-01 | Primary job list untuk suatu menu harus bisa dilacak dari controller/command tanpa menebak observer. |
| INV-HJ-02 | Derived job list harus punya trigger class (observer/handler/package) yang terverifikasi di repo. |
| INV-HJ-03 | Dead code path (ada `return;` sebelum dispatch) wajib dilabel di pipeline doc. |
| INV-HJ-04 | Observasi Horizon wajib menyebut env + tanggal sample. |

---

## 4. Index pipelines

| Slug / lokasi | Menu | Primary entry |
|---------------|------|---------------|
| [skip-wave-process.md](./pipelines/skip-wave-process.md) | omni-skip-wave-process | Upload → ImportJob → `skip-wave:dispatch` → SkipWaveProcessJob |
| [`_meta/…/settlement-upload.md`](../_meta/horizon-jobs/settlement-upload.md) | accounting-settlement-upload | Observer state machine (validating → … → receive journals) · queue `import` |
| [`_meta/…/sales-order.md`](../_meta/horizon-jobs/sales-order.md) | all-sales-order / Omni SO | Approve (`MoveSOToWaveMixJob` sync) + sync/export/import catalogs |
| [`_meta/…/index.html`](../_meta/horizon-jobs/index.html) | (peta) | Zoom-out ~260 job / 39 menu |

---

## 5. Failure modes (umum)

| Mode | Efek | Mitigasi AS-IS |
|------|------|----------------|
| Redis tanpa persistence / eviction | Job pending hilang | Infra Redis AOF + `noeviction` (proposal) |
| `finally` tidak fire | Status menu macet; gerbang menahan antrean | Redispatch UI (Skip Wave, >60 menit) |
| Derived storm | Worker penuh setelah UI completed | Throttle / unique (proposal) |

---

## 6. Tests & QA Notes

- Assert jumlah primary job per N SO (formula tetap): import 1 + orch 1 + N wave + ceil(N/10) processing.
- Jangan hardcode jumlah derived di automated AC.
- Regresi: dead-code DO jobs tetap tidak di-dispatch dari `runBatchFinally` (DO di `skipShipping`).

---

## 7. Known Issues

| Ref | Note |
|-----|------|
| PROP-HJ-01 | Proposal remediasi — lihat requirement §8 / pipeline § Proposal |
| GAP-SW-02 | Gerbang Skip Wave global — lihat menu Skip Wave |
| Dead DO jobs | Create/Approve DO job path unreachable dari `runBatchFinally`; DO di `skipShipping` |

---

## 9. Night schedule / MariaDB dump window

**Source of truth:** `app/Console/Kernel.php` (timezone **Asia/Jakarta**).

| Window | Policy |
|--------|--------|
| **22:30–01:30** | MariaDB full dump — heavy scheduled commands **skip** via `unlessBetween('22:30','01:30')` |
| **21:30** | `product-platform:push-stocks` (sebelum dump) |
| **02:05–02:50** | Post-dump stagger: `horizon:terminate` → storage/settlement cleanup → `queue:flush` / prune-batches → SO detail cleanup → status check; hourly jobs resume with minute offsets |
| **03:00–04:35** | Benchmark COGS, sync-log cleanup, P/L snapshot cleanup, import cleanup, screening, file cleanups |

### Hourly offsets (hindari pile-up 02:00)

| Command | Schedule |
|---------|----------|
| `stock:calculate-ending-balance` | `hourlyAt(5)` + skip dump |
| `ending-stock:manual-calculate` | `hourlyAt(20)` + skip dump |
| `product-platform:sync` | `hourlyAt(35)` + skip dump |
| `sales-order:sync-update` / `booking:sync-update` (malam) | `hourlyAt(50)` · `between('18:00','05:59')` + skip dump |

Menu-level narrative: [omni-store-binding §4.5](../omni-store-binding/requirement.md) · [Stock History §6.4](../supplychain-product-mutation-stock/requirement.md) · [MPP technical §3.7](../manage-platform-product/technical.md).

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.4 | 2026-10-11 | §9 Night schedule / dump window 22:30–01:30 + stagger table (selaras Kernel) |
| 1.3 | 2026-09-28 | Index Settlement Upload + Sales Order + peta `_meta`; rujuk requirement v1.3 |
| 1.2 | 2026-09-28 | Promote ke **review**; index tetap 1 pipeline (Skip Wave) |
| 1.1 | 2026-09-20 | Rujuk HJ-01…08 + PROP-HJ-01 dari requirement v1.1 |
| 1.0 | 2026-09-20 | Initial pola + index Skip Wave pipeline |
