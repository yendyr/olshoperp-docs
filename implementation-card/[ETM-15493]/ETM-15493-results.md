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
| 2 | Create line SKU expired | **Select Product** | **PASS** | Snapshot **51.900**. [SO-5U4FQN4Z](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515616) |
| 3 | Import Sales Order, trx date **01-08-2026** | **Import Processed** | **PASS** | Trx date API `2026-07-31T17:00:00Z` = **01 Aug 2026 00:00 WIB**. Snapshot **51.900**. [SO-5U4G6031](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515632) |
| 4 | SO baru SKU **KKTOR** (tanpa Manual / rumus murni) | Select Product | **PASS** | Master Highest Price **72.000**, Manual 0. Snapshot **72.000**. [SO-5U4FTRDZ](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515620) |
| 5 | Trx date **01-08-2026** lalu insert SKU expired | Select Product (date di-set dulu) | **PASS** | Trx date API `2026-07-31T17:00:00Z` = **01 Aug 2026 00:00 WIB**. Snapshot **51.900** (rumus), **bukan** Manual 55.000. [SO-5U4FXFT5](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515631) |
| 6 | SO SKU bundle **BUNDLE-CINCIN-KALUNG-White** | Select Product | **PASS** (observasi) | Header line COGS **0**. Child **CINCIN 1.000**, **KALUNG 2.000**. [SO-5U4FU8NU](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515623) |

## Kenapa SO import pertama trx date-nya 14 Agustus?

Import pertama ([SO-5U4FWEN4](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515629)) **berhasil** generate order, tapi kolom Excel **Transaction Date** di file automation masih `14-08-2026` (tanggal run). Bukan bug sistem — file yang di-upload memang tanggal itu.

Import ulang memakai `01-08-2026` → [SO-5U4G6031](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515632), `is_import` job `SO-IMP-00IG3DCZ29A1`, Platform Order ID `ETM15493IMP92607559`.

## Temuan kunci

**Lock snapshot = waktu create / now(), bukan transaction date.**  
Berlaku untuk **Select Product** dan **Import**:

- [SO-5U4FXFT5](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515631) — Select Product, trx **1 Agustus**.
- [SO-5U4G6031](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515632) — Import, trx **1 Agustus**.

Kalau sistem memakai trx date, Manual 55.000 masih aktif (expiry 13 Agustus). Actual snapshot **51.900** = rumus Last Inbound → efektif dihitung saat baris dibuat (14 Agustus, sudah expired). Sesuai requirement §3.5 `now(Asia/Jakarta)`.

**SKU tanpa Manual (KKTOR):** sistem tetap ambil rumus master (Highest Price 72.000).

**Bundle:** capture mengikuti `product_id` tiap line. Header 0 = parent No Inbound; komponen CINCIN/KALUNG punya COGS sendiri.

## Dokumen tes

| SO | URL | Keterangan |
|----|-----|------------|
| SO-5U4FQN4Z | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515616 | Select Product SKU expired |
| SO-5U4FWEN4 | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515629 | Import pertama — trx **14 Aug** (Excel `14-08-2026`) |
| SO-5U4G6031 | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515632 | Import ulang — trx **01 Aug**, snapshot 51.900 |
| SO-5U4FTRDZ | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515620 | KKTOR rumus murni |
| SO-5U4FXFT5 | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515631 | Select Product + trx date 01-08-2026 |
| SO-5U4FU8NU | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515623 | Bundle White |
| SO-5U4ENWR2 | https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515608 | Run pertama Select Product |
