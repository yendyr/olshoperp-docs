# Test Plan: ETM-15999 — Retry hanya redispatch SO gagal (gap-only)

- **Origin Card:** [ETM-15999](https://erpintegration.atlassian.net/browse/ETM-15999) — `[Skip Wave Process] - Retry Loop Skip Wave Me-redispatch Seluruh Chunk (1.000 SO)`
- **Jira Test Case:** [ETM-16053](https://erpintegration.atlassian.net/browse/ETM-16053) — `SC-SKWP-15999-01`
- **Tipe:** Error / Performance (GREEN TC)
- **Menu:** Skip Wave Process (`omni-skip-wave-process` / `/omni/skip-wave-process`)
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — existing TC-SKWP-* = Advanced Filter (ETM-15719) only; zero overlap selective-retry

## Tujuan

Saat retry, hanya **SO gagal (retryable)** yang di-dispatch ulang — bukan seluruh chunk (~1000 SO); SO sukses tetap idempotent (tanpa DO ganda).

## Anti-dupe

| Existing | Coverage | Gap ini |
|---|---|---|
| TC-SKWP-DRAFT / ETM-15719 family | Advanced Filter only | Selective retry / `retryable_ids` |
| horizon-jobs skip-wave pipeline | Pipeline docs | Tidak ada AC selective-retry |

## Matriks (1 NEW)

| Kode | Type | Fokus | Jira TC |
|---|---|---|---|
| SC-SKWP-15999-01 | happy | Retry redispatch hanya SO gagal (bukan full chunk) | [ETM-16053](https://erpintegration.atlassian.net/browse/ETM-16053) |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-SKWP-15999-01 | `test-cases/TC-SKWP-15999-01.md` | TC-SKWP-15999-01 |

**Checklist:** 1 skenario → 1 TC. Uji hati-hati (jangan spam redispatch besar).
