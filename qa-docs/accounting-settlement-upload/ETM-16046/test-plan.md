# Test Plan: ETM-16046 — Outbound SKU bekas parent (withTrashed) (gap-only)

- **Origin Card:** [ETM-16046](https://erpintegration.atlassian.net/browse/ETM-16046) — `[Instant Settlement] - Gagal Outbound "This product is a parent" pada SKU Bekas Parent Akibat Relasi withTrashed`
- **Jira Test Case:** [ETM-16052](https://erpintegration.atlassian.net/browse/ETM-16052) — `SC-SETU-16046-01`
- **Tipe:** Error / Gap-only (GREEN TC)
- **Menu:** Instant Settlement (`accounting-settlement-upload` / `/accounting/settlement-upload`)
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — 0 overlap dengan TC-SETU-001..007 / ETM-15886 (bukan parent/withTrashed)

## Tujuan

Memastikan outbound Instant Settlement **sukses** untuk SKU bekas parent (semua child soft-deleted); validasi parent hanya menghitung **anak aktif** (bukan `withTrashed`).

## Anti-dupe

| Existing | Coverage | Gap ini |
|---|---|---|
| TC-SETU-001..007 | Filter layout, SI same-date approve | Parent / soft-deleted child |
| test-case-plan-etm-15886 | Delete AR eligibility | Bukan withTrashed outbound |

## Matriks (1 NEW)

| Kode | Type | Fokus | Jira TC |
|---|---|---|---|
| SC-SETU-16046-01 | happy | Outbound sukses SKU bekas parent (child soft-deleted) | [ETM-16052](https://erpintegration.atlassian.net/browse/ETM-16052) |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-SETU-16046-01 | `test-cases/TC-SETU-16046-01.md` | TC-SETU-16046-01 |

**Checklist:** 1 skenario → 1 TC.
