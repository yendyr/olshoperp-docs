---
title: Settlement Upload — Horizon Job Flow
module: Accounting
menu: Settlement Upload
status: documented
artifact: https://claude.ai/artifact/X8Lz3madDjKjuQdv7taUzh
html: ./settlement-upload.html
source_of_truth: true
---

# Settlement Upload — Alur Job End-to-End (Horizon)

**Modul:** Accounting · **Menu:** Settlement Upload (`SettlementUploadController`)
**Queue:** `import_connection_{branch}` → supervisor Horizon `spv_import_conn_{env}`

**Akses cepat:**
- 🔗 Artifact (live, shareable): https://claude.ai/artifact/X8Lz3madDjKjuQdv7taUzh
- 🖥️ Versi HTML (offline/tim): [`settlement-upload.html`](./settlement-upload.html)
- 🗺️ Peta semua job Horizon: https://claude.ai/artifact/CuKxHnM5uxLeixvHZXw4to · [`index.html`](./index.html)

---

## 📦 Contoh & perumpamaan (buat non-teknis)

Bayangkan kamu upload **1 file settlement dari Shopee berisi 1.000 baris** (1.000 pesanan yang sudah dibayar Shopee ke toko). Sistem memprosesnya seperti **ban berjalan pabrik** — tiap pos kerja punya tugasnya sendiri:

| Pos | Status | Yang terjadi (perumpamaan) |
|-----|--------|-----------------------------|
| 1 | `validating` | Petugas cek 1.000 baris satu per satu, dicocokkan ke pesanan aslinya. Yang tak cocok ditandai error. |
| 2 | `generating` | Tiap baris dibuatkan **tagihan (invoice)** + **surat barang keluar (outbound)**. Jadi ±1.000 invoice + 1.000 outbound. |
| 3 | `approving` | Sistem otomatis cap "disetujui" ke semua invoice & outbound. |
| 4–5 | `journals` | Semua dicatat ke **pembukuan (jurnal)** lalu di-posting. |
| gate | manual | Kamu klik tombol **Approve** → sistem membuat **bukti penerimaan uang (AR)** dari Shopee. |
| 6–7 | `receives` | Penerimaan uang di-approve → jurnal penerimaan ter-posting. **Selesai.** |

> 🔔 **Peran "Observer" = mandor.** Tiap pekerja yang selesai lapor "1 selesai". Begitu mandor melihat **semua 1.000 selesai** di satu pos, dia baru meniup peluit untuk pindah ke pos berikutnya. Jadi tahap tidak pernah lompat sebelum tahap sebelumnya benar-benar tuntas.

---

## 🔑 Konsep inti — digerakkan Observer, bukan job-manggil-job

Rantai job Settlement Upload **tidak** memanggil job tahap berikutnya secara langsung. Polanya:

1. Setiap job hanya **menambah counter** di record `SettlementUpload` (mis. `generated_invoice_count`, `approved_outbound_count`).
2. `SettlementUploadObserver::updated()` mengawasi **kolom counter mana yang berubah** (`isDirty([...])`).
3. Begitu counter sebuah tahap mencapai target, observer **menaikkan `progress`** dan **men-dispatch job tahap berikutnya**.
4. `Cache::lock("settlement:after-...:{id}", 10)` mencegah transisi naik dua kali saat banyak worker selesai bersamaan (race condition).

> Ini beda dengan `Bus::chain`. Estafetnya diatur state machine berbasis event model, bukan urutan chain yang hard-coded.

**File kunci:** `Observers/SettlementUploadObserver.php` (otak state machine), `Entities/SettlementUpload.php` (`processSettlement()`, `approve()`), `Entities/Traits/SettlementUploadCounter.php` (semua `addXxx()`), `Constants/SettlementUploadStatus.php` (daftar status).

---

## Entry point — Upload file

`SettlementUploadController::store()`:
- Validasi: `store_id` wajib, `file_attachment` wajib (mimes: txt/csv).
- `Excel::import(SettlementImport | SettlementSheet, $file)` (Laravel Excel, `WithChunkReading`, chunk 200 baris).
- `SettlementSheet` **membuat record `SettlementUpload`** (progress = `validating`), set `total_rows`, lalu per chunk dispatch `ImportSettlementJob` (umum) atau `ImportLazadaSettlementJob` (Lazada).

---

## Pipeline utama (7 tahap)

### Tahap 1 — Validasi `validating`
- **Job:** `ImportSettlementJob` / `ImportLazadaSettlementJob` (per chunk)
- **Kerja:** buat baris `Settlement`, cocokkan ke Sales Order / Invoice, validasi.
- **Counter:** `addValidated()` → `validated_rows++`
- **Observer `afterValidation()`:** saat `validated_rows >= total_rows` & `isSuccess()` → `progress = generating` + `processSettlement()`. Gagal → `failed`.

### Tahap 2 — Generate Invoice & Outbound `generating`
- **Job:** `SettlementGenerateInvoiceJob` → `chunkById(500)` → `SettlementGenerateInvoiceSingleJob`; `SettlementGenerateOutboundJob` → `SettlementGenerateOutboundSingleJob`
- **Counter:** `addInvoice()` / `addOutbound()` + `addProcessed()`
- **Observer `afterGenerating()`:** saat `processing_attempted` memenuhi `(validated − skipped)` → `progress = approving` + dispatch job Approve.

### Tahap 3 — Approve Invoice & Outbound (auto) `approving`
- **Job:** `SettlementApproveInvoiceJob` → `SettlementApproveInvoiceSingleJob`; `SettlementApproveOutboundJob` → `SettlementApproveOutboundSingleJob`
- **Counter:** `addApprovedInvoice()` / `addApprovedOutbound()`; `approving_attempted`
- **Observer `onApproved()`:** saat `approving_attempted ≥ generated_invoice + generated_outbound` → `progress = generating journals` + dispatch job Generate Jurnal.

### Tahap 4 — Generate Jurnal `generating journals`
- **Job:** `SettlementGenerateInvoiceJournalJob` + `SettlementGenerateOutboundJournalJob`
- **Counter:** `addInvoiceJournal()` / `addOutboundJournal()`; `generating_journal_attempted`
- **Observer `afterJournalGenerate()`:** → `progress = approving journals` + dispatch job Approve Jurnal.

### Tahap 5 — Approve Jurnal `approving journals`
- **Job:** `SettlementApproveInvoiceJournalJob` + `SettlementApproveOutboundJournalJob`
- **Counter:** `addApprovedInvoiceJournal()` / `addApprovedOutboundJournal()`; `approving_journal_attempted`
- **Observer `afterJournalApprove()`:** semua jurnal ter-approve → `progress = journals approved`. **Bagian otomatis selesai, menunggu approve user.**

### ✋ Gerbang manual — user klik **Approve**
`SettlementUploadController::approve()`. Guard: `can_approve` & COA penerimaan (`store.cash_bank_account_id`) di-set; tanggal AR + COA belum dipakai di Cash/Bank Reconcile approved; semua invoice dalam satu hari yang sama; bukan `failed`; tidak semua invoice sudah dibayar. Lolos → `SettlementUpload::approve()` set `progress = generating receives` + dispatch `SettlementGenerateCustomerPaymentJob`.

### Tahap 6 — Generate AR / Penerimaan `generating receives`
- **Job:** `SettlementGenerateCustomerPaymentJob` (buat `Payment` "Payment from Customer" + detail + fund)
- **Counter:** `addReceive()`; `attempted_receive_count`
- **Observer `afterReceiveGenerated()`:** saat `attempted_receive_count ≥ approved_invoice_count` → `progress = approving receives` + dispatch job Approve AR.

### Tahap 7 — Approve AR & Jurnal Penerimaan `receive journals approved` ✓
- **Job:** `SettlementApproveCustomerPaymentJob` → `approveReceive()` → `PaymentController::approve()`
- **Hasil:** sukses → `progress = receive journals approved` = **SELESAI penuh**. Gagal → `failed`.

---

## Jalur cabang

| Aksi | Method | Job | Keterangan |
|------|--------|-----|-----------|
| Export | `export()` | `SettlementUploadExportJob` | Tulis file Excel export dari list settlement. |
| Re-read | `reread()` | `Excel::import` ulang | Ulang validasi (hanya upload belum approve). |
| Retry | `retry()` / `SettlementUploadRetryController` | `Settlement…Job` sesuai tahap gagal | Lanjut dari tahap `failed`. |
| Delete | `delete()` | `DeleteSettlementJob` | `progress = deleting` + force-delete Settlement, Invoice+jurnal, Outbound+jurnal, Payment, upload. |

---

## Referensi status (`progress`)

`validating` → `generating` → `approving` → `generating journals` → `approving journals` → `journals approved` → *(approve manual)* → `generating receives` → `approving receives` → **`receive journals approved`** (selesai). Status khusus: `failed` (bisa retry), `deleting`.

---

## Infrastruktur queue

- Semua job: `onQueue(getQueueName('import'))` → `import_connection_{branch}`, supervisor Horizon `spv_import_conn_{env}` (lihat `config/horizon.php`).
- Semua extend `BaseJob` + implement `WithCompanyContext` → konteks company terbawa ke worker.
- Job per-baris (`*SingleJob`) pakai `afterCommit()` + `retryUniqueConstraint()`.

---

## Routing — dokumentasi menu terkait (qa-docs)

- 📁 Hub aturan Horizon Jobs: [`../../horizon-jobs/README.md`](../../horizon-jobs/README.md)
- 📁 [`accounting-settlement-upload`](../../accounting-settlement-upload/README.md) — dokumen utama menu (fungsi, aturan, test case)
- 📁 [`accounting-settlement-mapping`](../../accounting-settlement-mapping/README.md) — mapping kolom settlement per platform
- 📁 [`accounting-customer-invoice`](../../accounting-customer-invoice/README.md) — invoice hasil tahap generate
- 📁 [`accounting-customer-payment`](../../accounting-customer-payment/README.md) — penerimaan (AR) hasil tahap approve manual

---

## Daftar job class (18)

`ImportSettlementJob`, `ImportLazadaSettlementJob`, `SettlementGenerateInvoiceJob`, `SettlementGenerateInvoiceSingleJob`, `SettlementGenerateOutboundJob`, `SettlementGenerateOutboundSingleJob`, `SettlementApproveInvoiceJob`, `SettlementApproveInvoiceSingleJob`, `SettlementApproveOutboundJob`, `SettlementApproveOutboundSingleJob`, `SettlementGenerateInvoiceJournalJob`, `SettlementGenerateOutboundJournalJob`, `SettlementApproveInvoiceJournalJob`, `SettlementApproveOutboundJournalJob`, `SettlementGenerateCustomerPaymentJob`, `SettlementApproveCustomerPaymentJob`, `SettlementUploadExportJob`, `DeleteSettlementJob`.

---

*Sumber kode (branch `dev`): `SettlementUploadController.php`, `SettlementUploadRetryController.php`, `Entities/SettlementUpload.php`, `Observers/SettlementUploadObserver.php`, `Jobs/Settlement*Job.php`, `Import/SettlementSheet.php`, `Constants/SettlementUploadStatus.php`.*
