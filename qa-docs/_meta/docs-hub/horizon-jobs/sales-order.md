---
doc_type: docs-hub-horizon-job
title: "Sales Order — Horizon Job Flow"
subtitle: "Approve SO (sync MoveSOToWaveMix), sync/export/import catalogs and queues."
summary: "Approve SO (sync MoveSOToWaveMix), sync/export/import catalogs and queues."
group: "Job flows"
group_order: 1
sort: 20
module: "OmniChannel"
status: review
version: "1.0"
last_updated: 2026-09-28
source_type: derived
source_ref: "_meta/horizon-jobs/sales-order.md"
visual_slug: "sales-order"
---

# Sales Order — Alur Job End-to-End (Horizon)

**Modul:** OmniChannel · **Menu:** Sales Order (`SalesOrderController`, `OmniCallbackController`, `OmniChannelController`)

**Akses cepat:**
- 🔗 Artifact (live, shareable): https://claude.ai/artifact/1EU2utNEMhgBkj7mvU2CfC
- 🖥️ Versi HTML (offline/tim): [`sales-order.html`](./sales-order.html)
- 🗺️ Peta semua job Horizon: https://claude.ai/artifact/CuKxHnM5uxLeixvHZXw4to · [`index.html`](./index.html)

---

## 🛒 Contoh & perumpamaan (buat non-teknis)

Bayangkan pelanggan di Shopee memesan **2 barang**. Perjalanannya:

1. **Order masuk (sync).** Sistem menarik pesanan dari Shopee → jadi 1 record Sales Order di OlshopERP (seperti "menyalin" pesanan dari lapak ke buku pesanan gudang).
2. **Approve SO.** Petugas cek: stok cukup? alamat & kurir valid? Kalau ya → setujui.
3. **Langsung masuk "gelombang" (Wave Mix).** Begitu disetujui, pesanan **saat itu juga** ditaruh ke keranjang besar berisi pesanan siap diambil barangnya. Dikerjakan **langsung** (bukan nitip antrian) — makanya kalau berat, klik Approve terasa agak lama.
4. **Di belakang layar.** Sistem mengecek flag order & menghitung ulang stok — ini **nitip antrian** (Horizon), jadi tidak bikin approve menunggu.

> 🚪 **Analogi Wave:** Approve = "pesanan lolos pemeriksaan, masuk keranjang packing gelombang berikutnya". Dari keranjang inilah tim gudang lanjut ke **Picking → Packing → Shipping**.
>
> 🎫 **Analogi antrian (queue):** Horizon seperti kantor dengan **beberapa loket** — loket "tarik order", "cek flag", "export", "import" — masing-masing punya barisan sendiri. Kalau satu loket ramai, yang lain tetap jalan.

---

## 🔑 Konsep inti — banyak alur, satu jembatan ke fulfillment

Berbeda dengan Settlement (satu pipeline observer state-machine), **Sales Order punya beberapa alur job independen**. Yang terpenting = **Approve SO**:

- Setelah lolos validasi, SO langsung dimasukkan ke Wave lewat `MoveSOToWaveMixJob`.
- Job ini dipanggil `dispatchSync` → **jalan inline di dalam request approve, BUKAN antrian**. Konsekuensi QA: kalau berat, approve terasa lambat.
- Job lain (flags, stok, export, sync, import) berjalan **async** di antrian Horizon.
- Wave = jembatan ke **Picking / Packing / Shipping**.

---

## Alur utama — Approve Sales Order

Method: `SalesOrderController::CheckApproveSoPlatform()` (varian lama `CheckApproveSoGeneral()`).

| # | Langkah | Sifat | Job | Keterangan |
|---|---------|-------|-----|-----------|
| 1 | Validasi awal | — | — | Cek batal platform (opsional), `validateBundleComponents()`, generate random detail + cek *Insufficient Stock*, `validateOrderDetails()` (stok/FIFO), validasi shipping (berat/dimensi/binding). Gagal → **ValidationException**, `error_info` diisi. |
| 2 | firstStepApprove | — | — | Jika `config('omni.approve_so.approve_with_validation')` aktif → status SO = **approved** (DB transaction). |
| 3 | Siapkan Wave | — | — | `createTransferWave()` semua WH process, lalu `Wave::getDefaultWave()` (Mix). |
| 4 | Masukkan SO ke Wave | **INLINE (sync)** | `MoveSOToWaveMixJob` | `dispatchSync()` → `WaveService::addToDefaultWave()`. Jembatan ke fulfillment. |
| 5 | Ship ke platform (opsional) | — | — | Jika `config('omni.shipped_at.default_wave')` & SO platform → `OmniService::shipSalesOrder()`. Gagal → rollback + WarningException. |
| 6 | Cek flag order | **async** (`salesorder`) | `CheckOrderFlagsJob` | Evaluasi flag/label order. |
| 7 | Recompute stok berbasis SO | **async** (default) | `StoreSOBasedStockJob`, `StoreSOBasedStockPerWarehouseJob` | Hitung ulang stok berbasis SO (global + per warehouse). |

**Hasil:** SO masuk Wave *Mix* → siap fulfillment.

---

## Katalog alur job lain

### ① Sync ingress — tarik order dari platform · queue `sales_order_sync`
- **Pemicu:** OmniChannel **Get Order** / store-bind callback (`OmniCallbackController`) / manual sync (`OmniChannelController`)
- **Rantai:** `SalesOrderSynchronizeJob` → `OmniService` (Shopee/Lazada/TikTok) → create/update `SalesOrder`
- **Paralel:** `WarehouseSyncJob`
- **Webhook status:** `SalesOrderStatusNotificationJob` → `GetCancellationReasonJob` + `UpdateSalesOrderFieldsJob`; `SalesBookingStatusNotificationJob`

### ② Revalidate flag (bulk) · queue `salesorder`
- **Pemicu:** tombol **Revalidate Flag** (`revalidateFlag()`)
- **Rantai:** `RecheckOrderFlagsJob` → `Bus::batch([CheckOrderFlagsJob × N SO])` → `finally()` broadcast websocket + lepas lock
- **Catatan:** `Cache::lock` per company & nomor batch, `allowFailures()`.

### ③ Stok berbasis SO saat SO berubah · queue default
- **Pemicu:** SO diubah / void → `UpdateSoBasedStockOnSoChangeJob`
- **Rantai:** `UpdateSoBasedStockOnSoChangeJob` → `StoreSOBasedStockJob` + `StoreSOBasedStockPerWarehouseJob`

### ④ Sync update (rentang tanggal) · queue `sales_order_sync_list`
- **Pemicu:** manual sync rentang **from–to** per store
- **Rantai:** `SalesOrderSynchronizeUpdateJob` (+ `SalesOrderSynchronizeUpdateBookingJob`) → `SalesOrderSynchronizeUpdateCleanupJob`
- **Catatan:** `ShouldBeUnique` + `WithCompanyContext` — cegah sync ganda.

### ⑤ Export Excel · queue `import`
- **Pemicu:** Export **Platform Details** / **Without Details** / **General**
- **Rantai:** `Bus::batch([SalesOrderExportExcelJob × chunk])` → `SalesOrderPlatformMergeExcelFilesJob` → `SalesOrderPlatformCleanupTempFilesJob`
- **Catatan:** versi **General** pakai `SalesOrderGeneralExportExcelJob` di `then()`.

### ⑥ Import Excel · queue `import`
- **Pemicu:** Upload Excel (`uploadExcel()`) → catat `SalesOrderImportHistory`
- **Rantai:** `Excel::import(SalesOrderImport)` → `SalesOrderImportJob × chunk` (dari `SalesOrderImportSheet1`) → `SalesOrderImportFinalizeJob`

---

## Peta queue Horizon

Nama lengkap = `{queue}_{branch}`. Berbeda dengan Settlement (satu queue), Sales Order tersebar:

| Queue | Job |
|-------|-----|
| `salesorder_connection` | CheckOrderFlagsJob, RecheckOrderFlagsJob, WarehouseSyncJob, SalesOrderStatusNotificationJob, SalesBookingStatusNotificationJob, GetCancellationReasonJob, UpdateSalesOrderFieldsJob |
| `salesorder_sync_connection` | SalesOrderSynchronizeJob |
| `salesorder_sync_list_connection` | SalesOrderSynchronizeUpdateJob, SalesOrderSynchronizeUpdateBookingJob, SalesOrderSynchronizeUpdateCleanupJob |
| `import_connection` | SalesOrderExportExcelJob, SalesOrderGeneralExportExcelJob, SalesOrderPlatformMergeExcelFilesJob, SalesOrderPlatformCleanupTempFilesJob, SalesOrderImportJob, SalesOrderImportFinalizeJob |
| (default / inline) | **MoveSOToWaveMixJob → `dispatchSync` (inline)**, StoreSOBasedStockJob, StoreSOBasedStockPerWarehouseJob, UpdateSoBasedStockOnSoChangeJob |

---

## Catatan penting untuk QA

1. **`dispatchSync` vs `dispatch`.** `MoveSOToWaveMixJob` jalan inline saat approve — bukan di Horizon. Approve lambat/timeout → tersangka utama `WaveService::addToDefaultWave`, bukan antrian.
2. **Approve = pintu ke Wave.** Setelah approve sukses, SO otomatis di Wave *Mix* → lanjut Skip Wave Process / Picking / Packing / Shipping.
3. **Sync order** tidak lewat menu SO langsung — dipicu dari OmniChannel (Get Order) & callback platform.
4. **Export & Import** pakai queue `import` yang sama dengan Settlement — jika `import` padat, ikut antri.

---

## Routing — dokumentasi menu terkait (qa-docs)

- 📁 Hub aturan Horizon Jobs: [`../../horizon-jobs/README.md`](../../horizon-jobs/README.md)
- 📁 [`all-sales-order`](../../all-sales-order/README.md) — daftar & lifecycle Sales Order
- 📁 [`omni-sales-order-report`](../../omni-sales-order-report/README.md) — laporan / ekspor SO
- 📁 [`omni-waves-management`](../../omni-waves-management/README.md) — Wave (tujuan SO setelah approve)
- 📁 [`omni-skip-wave-process`](../../omni-skip-wave-process/README.md) — Skip Wave Process (lanjutan fulfillment) · pipeline kanonik: [`../../horizon-jobs/pipelines/skip-wave-process.md`](../../horizon-jobs/pipelines/skip-wave-process.md)
- 📁 [`omni-picking-list`](../../omni-picking-list/README.md) · [`omni-packing-list`](../../omni-packing-list/README.md) — Picking & Packing

---

*Sumber kode (branch `dev`): `Modules/OmniChannel/Http/Controllers/SalesOrderController.php`, `OmniCallbackController.php`, `OmniChannelController.php`, `Modules/OmniChannel/Jobs/*.php`, `Modules/OmniChannel/Services/ProcessingService.php`, `Modules/OmniChannel/Import/SalesOrderImport*.php`, `Modules/SupplyChain/Jobs/StoreSOBasedStock*.php`, `app/Helpers/MainHelper.php` (getQueueName), `config/horizon.php`.*
