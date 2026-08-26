# Hasil Automate Testing — ETM-15493

**Tanggal run:** 14 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com`)  
**Company:** Dev Staging / DEV-STG (id 13)  
**Menu:** Dev - Sales Order (`/businessdevelopment/sales-order-general`)  
**Spec:** `tests/specs/sales-order-general/etm-15493-benchmark-cogs-snapshot.spec.ts`  
**Perintah:**

```
OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/sales-order-general/etm-15493-benchmark-cogs-snapshot.spec.ts --project=authenticated -g "@ETM-15493"
```

Kartu: [ETM-15493](https://erpintegration.atlassian.net/browse/ETM-15493)

---

## Ringkasan

**PASS** untuk acceptance criteria utama: setelah Manual COGS expired, snapshot **Benchmark COGS** di Dev - Sales Order memakai rumus **Last Inbound**, bukan nilai Manual yang sudah lewat.

SKU uji (sesuai instruksi): `SKU-ManualCOGSWithExpirationDate-4`  
Expiry Manual: **13-08-2026 23:59:59** (hari run = 14-08-2026).

SO yang dibuat: [SO-5U4DRTLT](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515586)

---

## Detail vs acceptance criteria kartu

| AC | Skenario | Hasil | Bukti |
|----|----------|-------|-------|
| AC-expiry | Order baru setelah Manual expired → snapshot rumus Highest Price / Last Inbound / No Inbound | **PASS** — snapshot = **51.900** (Last Inbound). Manual expired **55.000** tidak dipakai | `measurements.json` + `screenshots/02-benchmark-cogs-expired-sku.png` + `screenshots/04-so-line-expired-sku.png` |
| AC-manual-active | Create line saat Manual aktif → Benchmark COGS = Manual (termasuk 0) | **SKIP** | Sibling SKU di DEV-STG tidak punya Description **Manual Input**. `SKU-ManualCOGStanpaExpiredDate-1` Manual=COGS=100.000 rumus Last Inbound — tidak bisa bedakan override vs rumus |
| AC-change-product | Ganti product di line → re-capture effective product baru | **SKIP** | Tidak ada SKU Manual aktif sebagai sumber ganti product |
| AC-master-change | Ubah Manual di master → order lama tidak berubah | **SKIP** | Tidak diotomasi — akan mengubah data master. Snapshot by-design sudah terbukti lewat AC-expiry (order baru setelah expiry) |
| AC-bundle-random | Bundle/random path | **SKIP** | Tidak ada fixture bundle/random di instruksi run |

**AS-IS (docs):** `qa-docs/sales-order-general/requirement.md` §8.2 (status **review**) — snapshot = effective COGS (Manual jika override aktif, else rumus). Kanonik: `qa-docs/accounting-product-benchmark-price/requirement.md` §3.5.

---

## Data master vs snapshot SO

| SKU | Manual COGS | Expiry | Description master | COGS efektif master | Snapshot SO |
|-----|-------------|--------|--------------------|---------------------|-------------|
| `SKU-ManualCOGSWithExpirationDate-4` | 55.000 | 13-08-2026 | Last Inbound | **51.900** | **51.900** |

Manual 55.000 ≠ rumus 51.900 → bukti expiry: sistem **tidak** menyimpan Manual yang sudah lewat.

---

## Catatan QA

- Capture snapshot dibaca dari response API `sales-order-detail/create-select` (`benchmark_cogs` = 51900). Kolom UI **Benchmark COGS.** (ada titik) default hidden; unhide Columns Show/Hide belum berhasil di run ini — nilai UI kolom kosong, API dipakai sebagai actual.
- Label kolom overlay: **Benchmark COGS.** (trailing period).
- SKU di tabel detail terpotong jadi `SKU-ManualCOGSWith...`; atribut `sku=` tetap full.
- **Rekomendasi:** AC-expiry cukup untuk sign-off poin expiry di kartu. AC Manual-aktif / ganti product / bundle perlu fixture SKU dengan Description **Manual Input** jika QA lead minta coverage penuh.

---

## Isi folder

| File | Isi |
|------|-----|
| `HASIL.md` | Ringkasan ini |
| `screenshots/01-benchmark-cogs-list.png` | Menu Benchmark COGS |
| `screenshots/02-benchmark-cogs-expired-sku.png` | Master SKU expired |
| `screenshots/03-so-header-ready.png` | Header SO draft |
| `screenshots/04-so-line-expired-sku.png` | Line SKU expired di Dev - Sales Order |
| `measurements.json` | Master + snapshot + verdict PASS |
| `results.json` | Playwright JSON reporter |
| `test-results/` | Artifact Playwright |
