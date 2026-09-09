# Hasil Automate Testing — ETM-15550

**Tanggal run:** 2026-08-30T13:38:22.241Z
**Environment:** https://staging.olshoperp.com
**Company:** DEV-STG (id 13)
**Spec:** `tests/specs/filter-field-sizing/etm-15550-filter-field-size.spec.ts`
**Perintah:** `OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/filter-field-sizing/etm-15550-filter-field-size.spec.ts -g "@ETM-15550"`

---

## Ringkasan

**FAIL.** PASS=11, FAIL=3, N/A=1, BLOCKED=0.

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
| Instant Settlement | `/accounting/settlement-upload` | **FAIL** | Choose Store: 221×38 | ❌ | ✅ |
| Waves Management | `/omni/waves-management` | **PASS** | Choose warehouse: 382×36<br>Choose Warehouse: 384×38 | ✅ ✅ | ✅ ✅ |
| Stock Monitoring | `/supplychain/stock-monitoring` | **PASS** | Choose Warehouse: 382×36 | ✅ | ✅ |
| Product Mutation History | `/supplychain/product-mutation` | **PASS** | Choose Product: 382×36 | ✅ | ✅ |
| Stock History | `/supplychain/stock-history` | **PASS** | Choose Product: 384×38<br>Show data as: 384×38 | ✅ ✅ | ✅ ✅ |
| Real Time Stock | `/supplychain/real-stock` | **FAIL** | Show data as: 221×38 | ❌ | ✅ |
| Department Structure | `/hr/org-structure` | **PASS** | Choose Company: 384×38 | ✅ | ✅ |
| Attendance List | `/hr/attendance-calculated` | **PASS** | Choose Date: 384×38 | ✅ | ✅ |
| Platform Product | `/omni/platform-product` | **PASS** | Choose Store: 384×38 | ✅ | ✅ |
| Settlement Mapping | `/accounting/settlement-mapping` | **FAIL** | Choose COA: 382×36<br>Choose Value Type: 221×38 | ✅ ❌ | ✅ ✅ |
| General Ledger | `/accounting/general-ledger` | **N/A** | Sesuai kartu: hanya Global Search, tidak ada field filtering | - | - |
| Profit Loss | `/accounting/profit-loss` | **PASS** | p-datepicker p-component p-inputwrapper : 384×38 | ✅ | ✅ |
| Trial Balance | `/accounting/trial-balance` | **PASS** | p-datepicker p-component p-inputwrapper : 384×38 | ✅ | ✅ |
| Balance Sheet | `/accounting/balance-sheet` | **PASS** | p-datepicker p-component p-inputwrapper : 384×38 | ✅ | ✅ |

## Catatan QA

- Baseline DEV-STG: Global Search 167×38, Choose Store 384×38
- Kartu ETM-15550 (baseline lama Lumielle): tinggi 38, lebar Choose Store 539 — bandingkan juga di HASIL.
- **general-ledger:** Sesuai kartu: hanya Global Search, tidak ada field filtering
- Expected kartu: tinggi filter = Global Search; lebar filter = Choose Store Platform Product.
- Run di **DEV-STG (13)** sesuai instruksi user (kartu original pretest di Lumielle).

## Isi folder

| File | Isi |
|---|---|
| `HASIL.md` | Ringkasan ini |
| `measurements.json` | Metrik + verdict |
| `screenshots/` | Screenshot tiap halaman |