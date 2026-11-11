# Test Plan: ETM-16035 — Export Excel kolom nominal bertipe Number (gap-only)

- **Origin Card:** [ETM-16035](https://erpintegration.atlassian.net/browse/ETM-16035) — `[Product Profit Loss] - Export Excel kolom nominal bertipe teks`
- **Jira Test Case:** [ETM-16051](https://erpintegration.atlassian.net/browse/ETM-16051) — `SC-PPL-16035-01`
- **Tipe:** Error / Gap-only (GREEN TC)
- **Menu:** Product Profit Loss (`accounting-product-profit-loss` / `/accounting/product-profit-loss`)
- **Request ID:** `recvuwsLhHaGar`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — gap vs [ETM-15995](https://erpintegration.atlassian.net/browse/ETM-15995) / `TC-PPL-15857-15995-06` (selaras tiga permukaan, FAILED di tipe cell teks+IDR)

## Tujuan

Memastikan kolom **Gross Sales**, **Total COGS**, dan **Net Profit** pada Export Excel bertipe **Number/Numeric murni** (SUM-able), tanpa suffix mata uang di dalam cell yang memaksa tipe teks.

## Anti-dupe

| Existing | Coverage | Gap ini |
|---|---|---|
| `TC-PPL-15857-15995-06` / ETM-15995 | Nilai Export/Detail/Refresh selaras datalist | **Tipe cell Number** + tanpa suffix IDR di cell |
| `TC-PPL-003` | Export+Refresh (era Price Before VAT) | Tidak assert cell Number type |

## Matriks (1 NEW)

| Kode | Type | Fokus | Jira TC |
|---|---|---|---|
| SC-PPL-16035-01 | happy | Export Excel Gross Sales / Total COGS / Net Profit = Number murni | [ETM-16051](https://erpintegration.atlassian.net/browse/ETM-16051) |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-PPL-16035-01 | `test-cases/TC-PPL-16035-01.md` | TC-PPL-16035-01 |

**Checklist:** 1 skenario → 1 TC. Jangan sentuh ETM-16044 / ETM-15984.
