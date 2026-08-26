# Hasil Automate Testing — ETM-15550

**Tanggal run:** 2026-08-20T10:04:12.517Z
**Environment:** https://staging.olshoperp.com
**Company:** DEV-STG (id 13)
**Spec:** `tests/specs/filter-field-sizing/etm-15550-filter-field-size.spec.ts`
**Perintah:** `OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/filter-field-sizing/etm-15550-filter-field-size.spec.ts -g "@ETM-15550"`

---

## Ringkasan

**FAIL.** PASS=2, FAIL=12, N/A=1, BLOCKED=0.

Kartu: [ETM-15550](https://erpintegration.atlassian.net/browse/ETM-15550)

## Baseline

| Kontrol | Ukur (px) | Acuan kartu (Lumielle) |
|---|---|---|
| Global Search | 167×38 | tinggi **38** |
| Choose Store (Platform Product) | 384×38 | lebar **539** |
| Tolerance | ±2px | |

## Detail per halaman

| Halaman | Path | Status | Filter (W×H) | Width OK | Height OK |
|---|---|---|---|---|---|
| Pricelist Product | `/businessdevelopment/pricelist` | **PASS** | Select Pricelist Category: 384×38 | ✅ | ✅ |
| Instant Settlement | `/accounting/settlement-upload` | **FAIL** | Choose Store: 176×38 | ❌ | ✅ |
| Waves Management | `/omni/waves-management` | **FAIL** | Choose warehouse: 414×36<br>Choose Warehouse: 416×38 | ❌ ❌ | ✅ ✅ |
| Stock Monitoring | `/supplychain/stock-monitoring` | **FAIL** | Choose Warehouse: 537×36 | ❌ | ✅ |
| Product Mutation History | `/supplychain/product-mutation` | **FAIL** | Choose Product: 331×36 | ❌ | ✅ |
| Stock History | `/supplychain/stock-history` | **FAIL** | Choose Product: 239×38 | ❌ | ✅ |
| Real Time Stock | `/supplychain/real-stock` | **FAIL** | Show data as: 350×38 | ❌ | ✅ |
| Department Structure | `/hr/org-structure` | **FAIL** | Choose Company: 539×38 | ❌ | ✅ |
| Attendance List | `/hr/attendance-calculated` | **FAIL** | Choose Date: 539×38 | ❌ | ✅ |
| Platform Product | `/omni/platform-product` | **PASS** | Choose Store: 384×38 | ✅ | ✅ |
| Settlement Mapping | `/accounting/settlement-mapping` | **FAIL** | Choose COA: 284×36<br>Choose Value Type: 91×38 | ❌ ❌ | ✅ ✅ |
| General Ledger | `/accounting/general-ledger` | **N/A** | Sesuai kartu: hanya Global Search, tidak ada field filtering | - | - |
| Profit Loss | `/accounting/profit-loss` | **FAIL** | p-datepicker p-component p-inputwrapper : 516×38 | ❌ | ✅ |
| Trial Balance | `/accounting/trial-balance` | **FAIL** | p-datepicker p-component p-inputwrapper : 539×38 | ❌ | ✅ |
| Balance Sheet | `/accounting/balance-sheet` | **FAIL** | p-datepicker p-component p-inputwrapper : 539×38 | ❌ | ✅ |

## Catatan QA

- Baseline DEV-STG: Global Search 167×38, Choose Store 384×38
- Kartu ETM-15550 (baseline lama Lumielle): tinggi 38, lebar Choose Store 539 — bandingkan juga di HASIL.
- **general-ledger:** Sesuai kartu: hanya Global Search, tidak ada field filtering
- Expected kartu: tinggi filter = Global Search; lebar filter = Choose Store Platform Product.
- Run di **DEV-STG (13)** sesuai instruksi user (kartu original pretest di Lumielle).
- **Catatan ukur:** baseline Choose Store di DEV-STG = **384px** (bukan 539px di kartu/Lumielle) — AC dibanding ke baseline live company yang sama. Instant Settlement sempat terukur 176px via fallback selector; kemungkinan under-measure, tapi tetap ≠ 384 → FAIL lebar.
- Tinggi hampir seragam 38px; yang gagal tinggi: beberapa kontrol 36px (masih dalam/di luar tolerance ±2 tergantung kasus) — Pricelist sudah 384×38 PASS di re-run.
- Lebar masih tidak seragam antar menu → gejala kartu **belum fixed**.

## Isi folder

| File | Isi |
|---|---|
| `HASIL.md` | Ringkasan ini |
| `measurements.json` | Metrik + verdict |
| `screenshots/` | Screenshot tiap halaman |