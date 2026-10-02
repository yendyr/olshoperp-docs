# Test Plan: ETM-16040 — Cek DO skipShipping per SO cepat (gap-only)

- **Origin Card:** [ETM-16040](https://erpintegration.atlassian.net/browse/ETM-16040) — `[Skip Wave Process] - Cek DO sudah ada di skipShipping membaca seluruh tabel DO (±6 detik per order)`
- **Jira Test Case:** [ETM-16054](https://erpintegration.atlassian.net/browse/ETM-16054) — `SC-SKWP-16040-01`
- **Tipe:** Error / Performance (GREEN TC)
- **Menu:** Skip Wave Process (`omni-skip-wave-process` / `/omni/skip-wave-process`)
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — no existing SKWP TC untuk bentuk query skipShipping DO-exists

## Tujuan

Cek **DO sudah ada** per SO selesai cepat (orde **milidetik**), bukan full-scan seluruh tabel DO (~6 detik/order); regresi anti DO dobel/kosong tetap.

## Anti-dupe

| Existing | Coverage | Gap ini |
|---|---|---|
| TC-SKWP Advanced Filter | Filter UI only | skipShipping DO-exists perf |
| Relates ETM-15988 / ETM-16037 | DO kosong / race DO | Regresi tetap; fokus durasi cek |

## Matriks (1 NEW)

| Kode | Type | Fokus | Jira TC |
|---|---|---|---|
| SC-SKWP-16040-01 | happy | Cek DO per SO milidetik (bukan full-scan) | [ETM-16054](https://erpintegration.atlassian.net/browse/ETM-16054) |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-SKWP-16040-01 | `test-cases/TC-SKWP-16040-01.md` | TC-SKWP-16040-01 |

**Checklist:** 1 skenario → 1 TC.
