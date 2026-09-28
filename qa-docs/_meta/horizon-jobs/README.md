---
title: Horizon Jobs Documentation
scope: cross-module (Accounting, OmniChannel, SupplyChain, dst)
status: in-progress
source_of_truth: job-flow-visual
complements: ../../horizon-jobs/
---

# Dokumentasi Job Horizon — OlshopERP

Dokumentasi alur **job antrian (Laravel Horizon)** per menu/proses OlshopERP: apa yang di-dispatch sebuah menu, rantai turunan job-nya, queue tempatnya berjalan, dan alur end-to-end-nya. Ditujukan untuk **QA & tim non-teknis** — tiap doc punya bagian *contoh & perumpamaan*.

## Hub QA (aturan & pipeline kanonik)

Folder ini = **job-flow visual / share** (md + html + Artifact).  
Untuk **aturan QA** (primary vs derived, HJ-01…08, gerbang batch, observasi vs AC) dan **pipeline Skip Wave detail**:

→ **[`../../horizon-jobs/README.md`](../../horizon-jobs/README.md)** (status `review`)

## Cara pakai (3 bentuk, 1 sumber per menu di folder ini)

| Bentuk | Untuk apa | Lokasi |
|--------|-----------|--------|
| **`.md`** | **Source of truth alur job menu ini** — diedit & di-review di sini | file `*.md` di folder ini |
| **`.html`** | Versi portable, bisa dibuka offline / dibagikan ke tim tanpa akses Claude | file `*.html` di folder ini |
| **Artifact** | Versi live & shareable via URL (desain sama persis dengan `.html`) | link di tabel bawah |

> `.html` dan Artifact dibangun dari sumber yang sama; kalau `.md` berubah signifikan, perbarui juga `.html` + republish Artifact-nya agar sinkron.

## Peta / overview

- 🗺️ **Peta semua job Horizon** (zoom-out list semua menu → job): [`index.html`](./index.html) · Artifact: https://claude.ai/artifact/CuKxHnM5uxLeixvHZXw4to
- Peta ini men-scan `Modules/**/Jobs` + `Http/Controllers`: **260 job class**, **39 menu** men-dispatch job, 5 modul. Kartu ✓ *done* bisa diklik → buka doc detail menu-nya.

## Menu yang sudah didokumentasikan

| Menu | Modul | Doc (SoT job-flow) | HTML | Artifact / pipeline kanonik |
|------|-------|---------------------|------|------------------------------|
| Settlement Upload | Accounting | [`settlement-upload.md`](./settlement-upload.md) | [`settlement-upload.html`](./settlement-upload.html) | https://claude.ai/artifact/X8Lz3madDjKjuQdv7taUzh |
| Sales Order | OmniChannel | [`sales-order.md`](./sales-order.md) | [`sales-order.html`](./sales-order.html) | https://claude.ai/artifact/1EU2utNEMhgBkj7mvU2CfC |
| Skip Wave Process | SupplyChain/OmniChannel | *(jangan duplikasi panjang)* → pipeline kanonik | — | **Kanonik:** [`../../horizon-jobs/pipelines/skip-wave-process.md`](../../horizon-jobs/pipelines/skip-wave-process.md) · Artifact: https://claude.ai/artifact/M58zF2JXjuVMgHxP8sTSe4 · https://claude.ai/artifact/EQRpX3Pwvj2BRSF9wPzpk6 |

## Kandidat berikutnya

Transfer Picking / Packing (lanjutan Wave), Stock Monitoring Export (pola export→batch→merge→cleanup), Product Platform Sync, Work Order Export.

## Routing ke dokumentasi menu (qa-docs)

Doc job Horizon **melengkapi**, bukan menggantikan, dokumentasi fungsional menu di `docs/qa-docs/{menu-slug}/`. Tiap doc menu punya bagian **Routing** yang menautkan ke slug qa-docs terkait (relatif `../../{slug}/README.md`). Contoh:
- Settlement Upload → `accounting-settlement-upload`, `accounting-settlement-mapping`, `accounting-customer-invoice`, `accounting-customer-payment`
- Sales Order → `all-sales-order`, `omni-sales-order-report`, `omni-waves-management`, `omni-skip-wave-process`, `omni-picking-list`, `omni-packing-list`

## Konsep umum job Horizon di OlshopERP

- **Nama queue:** `getQueueName($name)` (di `app/Helpers/MainHelper.php`) → `{queue}_{branch}`. Contoh: `import` → `import_connection_dev`; `salesorder` → `salesorder_connection_dev`.
- **Supervisor Horizon:** dikonfigurasi di `config/horizon.php` (mis. `spv_import_conn_{env}`) per environment.
- **`WithCompanyContext`:** job yang implement ini membawa konteks company ke worker (multi-tenant tetap benar walau async).
- **`dispatch` vs `dispatchSync`:** `dispatch` = masuk antrian (async); `dispatchSync` = jalan inline dalam request (sinkron). Penting untuk menilai kenapa sebuah aksi terasa lambat.
- **Dua pola estafet antar-job:**
  1. **Observer state machine** — job hanya menambah counter; sebuah Observer menaikkan status & men-dispatch tahap berikutnya (contoh: Settlement Upload).
  2. **Fan-out + Bus::batch / then** — orkestrator memecah pekerjaan jadi banyak job kecil, lalu `then()/finally()` lanjut ke merge/cleanup/notifikasi (contoh: Export Sales Order).

Ringkas aturan QA lintas menu: [`../../horizon-jobs/requirement.md`](../../horizon-jobs/requirement.md).

## Cara menambah doc menu baru

1. Telusuri controller menu → job yang di-dispatch (dan turunannya lewat Observer/Service/Bus).
2. Tulis `{menu-slug}.md` di folder ini (pakai `settlement-upload.md` sebagai contoh struktur): frontmatter, **Contoh & perumpamaan**, konsep inti, alur/pipeline, queue, **Routing**.
3. Bangun versi visual → publish Artifact → salin HTML-nya ke `{menu-slug}.html` (tambahkan banner `.doclinks` + section example + routing agar identik).
4. Update tabel "Menu yang sudah didokumentasikan" di README ini + tandai kartu di peta (`index.html` / Artifact peta).
5. Tambah baris di indeks hub [`../../horizon-jobs/README.md`](../../horizon-jobs/README.md) (dan buat `pipelines/{slug}.md` di hub jika perlu fan-out/observasi Horizon setingkat Skip Wave).

---

*Folder ini di-maintain sebagai bagian dari QA docs. Perubahan di-push langsung ke `dev` (docs), tanpa PR.*
