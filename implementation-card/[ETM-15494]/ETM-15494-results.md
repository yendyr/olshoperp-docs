# ETM-15494 — Summary automation (Sales Platform)

**Card:** [Dev - Sales Platform] Implementasi Benchmark COGS snapshot based on Manual COGS effective value  
**Environment:** Staging · Company **Dev Staging (id 13)**  
**Run:** 14 Aug 2026  
**SKU expired:** `SKU-ManualCOGSWithExpirationDate-4` (Manual 55.000, expiry 13-08-2026 23:59:59)

Expected docs: snapshot = COGS efektif saat bind / ganti `product_id` (`qa-docs/omni-sales-platform/requirement.md` §6.6 · Benchmark §3.5). Effective memakai **now(Asia/Jakarta)** vs expiry. Datalist SP read-only — tidak ada Create/Import Excel (Create redirect SO General).

## Ringkasan

| # | Skenario (paritas ETM-15493) | Metode SP | Hasil | Actual |
|---|------------------------------|-----------|-------|--------|
| 1 | Master Benchmark COGS — Manual expired | — | **PASS** | Description **Last Inbound**. COGS (Efektif) **51.900**. Manual tetap **55.000**. |
| 2 | Create line SKU expired | **Bind System SKU** (PUT detail) | **PASS** | Snapshot **51.900**. [SO-67A0626C](https://staging.olshoperp.com/omni/sales-order/edit/22465) · juga [SO-5T8MR0QS](https://staging.olshoperp.com/omni/sales-order/edit/2403549) |
| 3 | Import trx date 01-08-2026 | Import Excel | **N/A** | Tidak ada tombol Import di Dev - Sales Platform. Order platform dari sync marketplace. |
| 4 | SKU **KKTOR** (tanpa Manual / rumus murni) | Bind System SKU | **PASS** | Master Highest Price **72.000**. Snapshot **72.000**. [SO-67A0626C](https://staging.olshoperp.com/omni/sales-order/edit/22465) line 1065 |
| 5 | Trx date lalu bind SKU expired | PUT trx date (gagal, field locked) + bind | **PASS** | Trx date existing **30 Jan 2025** (jauh sebelum expiry). Snapshot **51.900**, bukan Manual 55.000. [SO-679B1FF5](https://staging.olshoperp.com/omni/sales-order/edit/22194) |
| 6 | SKU bundle **BUNDLE-CINCIN-KALUNG-White** | Bind System SKU | **PASS** | Header COGS **0**. Child **CINCIN 1.000**, **KALUNG 2.000**. [SO-679B1FF5](https://staging.olshoperp.com/omni/sales-order/edit/22194) |

## Temuan kunci

**Lock snapshot = waktu bind / now(), bukan transaction date.**  
Order platform trx date **30 Jan 2025** / **19 Mei 2026** (sebelum expiry 13 Agustus 2026). Kalau lock memakai trx date, Manual 55.000 masih aktif. Actual **51.900** = rumus Last Inbound saat bind (14 Agustus, sudah expired). Sesuai Benchmark §3.5.

**Import Excel:** tidak ada di menu ini (SoT datalist). Trigger setara AC card = bind/sync/`product_id`.

**PUT trx date:** ditolak `The sales order type cannot be changed, because there is already detailed data` — Transaction Date header SP read-only (dari platform).

**Bundle:** sama pola ETM-15493 — COGS per `product_id` line, bukan satu nilai parent untuk semua child.
