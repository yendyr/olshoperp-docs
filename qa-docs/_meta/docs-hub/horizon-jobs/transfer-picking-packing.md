---
doc_type: docs-hub-horizon-job
title: "Transfer Picking / Packing — Horizon Job Flow"
subtitle: "Picking/packing transfer jobs and shared skip-processing machine with Skip Wave."
summary: "Picking/packing transfer jobs and shared skip-processing machine with Skip Wave."
group: "Job flows"
group_order: 1
sort: 30
module: "OmniChannel"
status: review
version: "1.0"
last_updated: 2026-09-28
source_type: derived
source_ref: "_meta/horizon-jobs/transfer-picking-packing.md"
visual_slug: "transfer-picking-packing"
---

# Transfer Picking & Packing — Alur Job End-to-End (Horizon)

**Modul:** OmniChannel · **Menu:** Transfer Picking, Transfer Checking, Transfer Packing, Transfer Summary

**Akses cepat:**
- 🔗 Artifact (live, shareable): https://claude.ai/artifact/Tau3aYZfWnv2h1vHt3aM2s
- 🖥️ Versi HTML (offline/tim): [`transfer-picking-packing.html`](./transfer-picking-packing.html)
- 🗺️ Peta semua job Horizon: https://claude.ai/artifact/CuKxHnM5uxLeixvHZXw4to · [`index.html`](./index.html)
- 🧩 Pipeline kanonik mesin Skip Processing: [`../../horizon-jobs/pipelines/skip-wave-process.md`](../../horizon-jobs/pipelines/skip-wave-process.md)

---

## 📦 Contoh & perumpamaan (buat non-teknis)

Bayangkan gudang dengan 50 pesanan yang sudah masuk "gelombang" (Wave) dan siap diproses fisik:

1. **Picking** — petugas ambil barang dari rak. Sistem mencetak **daftar ambil (picking list)**.
2. **Checking** — QC: cek barang sesuai pesanan.
3. **Packing** — barang dibungkus.
4. **Collecting** — dikumpulkan di titik serah kurir.
5. **Shipping** — terbit **surat jalan (Delivery Order)**, diserahkan ke kurir → status **Shipped**.

> 🪄 **Skip Processing = tombol sakti.** Untuk pesanan yang sudah pasti, sistem **melompati** tahap-tahap di atas otomatis (approve sendiri) tanpa scan manual satu-satu — cocok memproses banyak order sekaligus. Ini **mesin yang sama** dengan menu **Skip Wave Process** (bedanya: Skip Wave mulai dari upload file, ini dari pilih order di daftar / approve menu).

---

## 🔑 Konsep inti — tahap fisik gudang, dengan tombol "loncat"

Setelah SO di-approve dan masuk **Wave**, barang diproses fisik: `Picking → Checking → Packing → Collecting → Shipping` → terbit **Delivery Order**. Ada dua gaya proses:

1. **Manual per tahap** — approve di menu Transfer Picking/Checking/Packing.
2. **Skip Processing** — melompat otomatis beberapa tahap sekaligus. Engine-nya (`SkipProcessingJob` / `ProcessingService`) **identik** dengan Skip Wave Process — hanya beda sumber pemicu.

---

## Alur / tahap fulfillment

`SO di Wave` → **Picking** (picking list) → **Checking** → **Packing** → **Collecting** → **Shipping + Delivery Order** → **Shipped**.

Jalur "Skip Processing" melompati Picking→Shipping secara otomatis (lihat alur ② & ③).

---

## Katalog alur job

### ① Generate Picklist (Picking) · queue default
- **Pemicu:** Menu **Transfer Picking** → Generate Picklist (per wave / order terpilih)
- **Rantai:**
  - `generatePicklist()` single wave → `PicklistService::generatePicklist()` **inline** (tanpa job)
  - Bulk per wave → `GeneratePicklistByWaveJob::dispatch($wave_id)` (async)
  - Bulk per SO terpilih → `GeneratePicklistByWaveAndSOJob::dispatch([...])` (async)
- **Hasil:** membuat `StockMutation` `process_type = PICKING` + `transfer_mutation_details`; notifikasi user sukses/gagal.

### ② Skip per tahap (menu individual) · queue `salesorder`
- **Pemicu:** tombol **Approve** di menu Transfer Picking / Checking / Packing (`approve(Request, $transfer_process)`)
- **Rantai:** controller membangun `process_groups` dari posisi SO → `SkipProcessingIndividualMenuJob::dispatch($sales_order, $process_groups)->onQueue('salesorder_connection_{branch}')`
- **Isi job (per SO):**
  - `skipPicking()` → generate + approve picking (`PicklistService`), set item `picked`, buat `SalesOrderDuration` PICKING
  - `skipChecking()` → approve picking list (`PickingListController::approve`) → naik ke checking
  - `skipPacking()` → approve checking list (`CheckingListController::approve`) → naik ke packing
- Tahap yang dijalankan tergantung isi `process_groups`.

### ③ Bulk Skip Processing (Transfer Summary) · queue `salesorder`
- **Pemicu:** pilih banyak order → **Skip Processing**
- **Rantai:** lock per SO (cegah duplikat) → `Bus::batch([SkipProcessingJob × chunk 10])` (`ProcessingService::CHUNK_SIZE_PER_JOB`) → `finally: runBatchFinally()` → DO dibuat di `skipShipping`
- **Batch code:** `SP-…`
- **Penting:** ini **mesin yang sama** dengan pipeline Skip Wave Process. Detail teknis lengkap (retry, lock 12 jam, DO inline, job turunan audit/ending-stock/balance) ada di pipeline kanonik → [`../../horizon-jobs/pipelines/skip-wave-process.md`](../../horizon-jobs/pipelines/skip-wave-process.md).

### ④ Export Skip Processing · queue `import`
- **Pemicu:** Menu Transfer Summary → Export
- **Rantai:** `Bus::batch(...)` → `SkipProcessingExportExcelJob` → `GenerateExcelPartJob` → `MergeExcelFilesJob` → `SalesOrderPlatformCleanupTempFilesJob`
- **Pola:** export → batch → part → merge → cleanup.

---

## Peta queue Horizon

| Queue | Job |
|-------|-----|
| `salesorder_connection` | SkipProcessingIndividualMenuJob · SkipProcessingJob (bulk, chunk 10) |
| (default) | GeneratePicklistByWaveJob · GeneratePicklistByWaveAndSOJob |
| `import_connection` | SkipProcessingExportExcelJob · GenerateExcelPartJob · MergeExcelFilesJob · SalesOrderPlatformCleanupTempFilesJob |
| (inline / sync) | `generatePicklist()` single wave → `PicklistService` (tanpa job) |

---

## Catatan penting untuk QA

1. **Skip Processing = engine Skip Wave.** Bug/observasi di `SkipProcessingJob` (DO di skipShipping, retry, batch macet) berlaku sama di sini — rujuk pipeline kanonik.
2. **Individual vs Bulk.** Menu Picking/Checking/Packing approve → `SkipProcessingIndividualMenuJob` (1 SO). Transfer Summary "Skip Processing" → `Bus::batch(SkipProcessingJob)` (banyak SO, chunk 10).
3. **Generate Picklist punya 2 mode.** Single wave inline (langsung), bulk via job async — kalau bulk terasa lambat itu antrian, kalau single lambat itu request.
4. **Hulu:** tahap ini hanya jalan untuk SO yang sudah masuk Wave (lihat [`sales-order.md`](./sales-order.md) — Approve SO → Wave).

---

## Routing — dokumentasi terkait

- 🧩 Pipeline kanonik: [`../../horizon-jobs/pipelines/skip-wave-process.md`](../../horizon-jobs/pipelines/skip-wave-process.md) — detail mesin Skip Processing
- 🔗 Hulu: [`sales-order.md`](./sales-order.md) — Approve SO → Wave
- 📁 [`omni-picking-list`](../../omni-picking-list/README.md) · [`omni-picking-process`](../../omni-picking-process/README.md) — menu Picking
- 📁 [`omni-packing-list`](../../omni-packing-list/README.md) · [`omni-packing-process`](../../omni-packing-process/README.md) — menu Packing
- 📁 [`omni-skip-wave-process`](../../omni-skip-wave-process/README.md) — menu Skip Wave (mesin skip yang sama)

---

*Sumber kode (branch `dev`): `Modules/OmniChannel/Http/Controllers/TransferPickingController.php`, `TransferCheckingController.php`, `TransferPackingController.php`, `TransferSummaryController.php`, `Modules/OmniChannel/Jobs/GeneratePicklistByWaveJob.php`, `GeneratePicklistByWaveAndSOJob.php`, `SkipProcessingIndividualMenuJob.php`, `SkipProcessingJob.php`, `SkipProcessingExportExcelJob.php`, `GenerateExcelPartJob.php`, `MergeExcelFilesJob.php`, `Modules/OmniChannel/Services/PicklistService.php`, `ProcessingService.php`.*
