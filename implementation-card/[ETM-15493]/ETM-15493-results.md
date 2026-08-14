# ETM-15493 — Summary automation (gabungan)

**Card:** [Dev - Sales Order] Implementasi Benchmark COGS snapshot based on Manual COGS effective value  
**Environment:** Staging · Company **Dev Staging (id 13)**  
**Run:** 14 Aug 2026  
**SKU expired:** `SKU-ManualCOGSWithExpirationDate-4` (Manual 55.000, expiry 13-08-2026 23:59:59)

Expected docs: snapshot = COGS efektif saat create/import line (`qa-docs/sales-order-general/requirement.md` §8.2 · Benchmark §3.5). Effective memakai **now(Asia/Jakarta)** vs expiry, bukan transaction date.

## Ringkasan

| # | Skenario | Metode insert | Hasil | Actual |
|---|----------|---------------|-------|--------|
| 1 | Master Benchmark COGS — Manual expired | — | **PASS** | Description **Last Inbound**. COGS (Efektif) **51.900**. Manual tetap **55.000**. |
| 2 | Create line SKU expired | **Select Product** (bukan import) | **PASS** | Snapshot **51.900**. [SO-5U4FQN4Z](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515616) |
| 3 | Create line SKU expired | **Import Sales Order** | **BELUM TERVERIFIKASI** | File ter-upload & queued. SO hasil import belum terkonfirmasi di datalist (history yang terbaca batch lama). |
| 4 | SO baru SKU **KKTOR** (tanpa Manual / rumus murni) | Select Product | **PASS** | Master Highest Price **72.000**, Manual 0. Snapshot **72.000**. [SO-5U4FTRDZ](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515620) |
| 5 | Trx date **01-08-2026** lalu insert SKU expired | Select Product (date di-set dulu) | **PASS** | Trx date API `2026-07-31T17:00:00Z` = **01 Aug 2026 00:00 WIB**. Snapshot **51.900** (rumus), **bukan** Manual 55.000. |
| 6 | SO SKU bundle **BUNDLE-CINCIN-KALUNG-White** | Select Product | **PASS** (observasi) | Header line COGS **0**. Child **CINCIN 1.000**, **KALUNG 2.000**. [SO-5U4FU8NU](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515623) |

## Temuan kunci

**Lock snapshot = waktu create / now(), bukan transaction date.**  
Order [SO-5U4FXFT5](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515631) trx date **1 Agustus 2026** (sebelum expiry 13 Agustus). Kalau sistem memakai trx date, Manual 55.000 masih aktif. Actual snapshot **51.900** = rumus Last Inbound → efektif dihitung saat baris dibuat (14 Agustus, sudah expired). Sesuai requirement §3.5 `now(Asia/Jakarta)`.

**SKU tanpa Manual (KKTOR):** sistem tetap ambil rumus master (Highest Price 72.000), bukan 0/kosong salah.

**Bundle:** capture mengikuti `product_id` tiap line (bukan satu nilai parent untuk semua child). Header 0 = parent No Inbound; komponen CINCIN/KALUNG punya COGS sendiri. Selaras AC bundle/random + catatan GAP child vs parent di Benchmark §6.3.

**Import Sales Order:** skenario #2 sebelumnya **bukan** import. Run ini berhasil **queue** file Import Processed; verifikasi snapshot di SO hasil import masih outstanding (job/history).

## Dokumen tes

| SO | URL | Description |
|----|-----|-------------|
| SO-5U4FQN4Z | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515616 | Select Product SKU expired |
| SO-5U4FTRDZ | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515620 | ETM-15493 KKTOR: no Manual COGS; snapshot must use formula master |
| SO-5U4FXFT5 | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515631 | ETM-15493 trx_date=01-08-2026 created=14-08-2026 SKU expired Manual. Lock trx vs created_at? |
| SO-5U4FU8NU | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515623 | ETM-15493 bundle BUNDLE-CINCIN-KALUNG-White: capture Benchmark COGS per line |
| SO-5U4ENWR2 | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515608 | Run pertama Select Product (sama SKU expired, snapshot 51900) |
