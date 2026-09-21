# Test Plan: ETM-15980 — Info Datalist Entries vs Advanced Filter (Instant Settlement)

- **Origin Card:** [ETM-15980](https://erpintegration.atlassian.net/browse/ETM-15980)
- **Tipe:** Error (QA Review · Approved Test Plan Yemima)
- **Menu:** Instant Settlement (`accounting-settlement-upload` / `/accounting/settlement-upload`)
- **Staging:** `https://staging.olshoperp.com/accounting/settlement-upload`
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — 0 reuse (SETU-001…007 fokus lain)
- **Company default:** FAT (`id: 112`)
- **FE note:** `PrimeDataTables.vue` — `recordsFiltered ?? recordsTotal`

## Tujuan

Memastikan teks pagination/entries Instant Settlement **sinkron** dengan hasil Advanced Filter (bukan tetap menampilkan total unfiltered).

## Validasi vs Requirement

| Sumber | Status | Cukup? |
|---|---|---|
| Card AC ETM-15980 | QA Review | Ya — SoT praktis teks entries |
| `requirement.md` §11.2 PrimeDataTables | review | Pola standar; teks exact *Showing…filtered* belum pasal khusus |

## Matriks (3 NEW)

| Kode | Type | Fokus |
|---|---|---|
| SC-SETU-15980-01 | happy | Filter → tepat 1 baris; entries `1 to 1 of 1 (filtered from N)` |
| SC-SETU-15980-02 | negative | Clear/Reset filter → kembali unfiltered |
| SC-SETU-15980-03 | edge | Filter M > page size → entries pakai recordsFiltered |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-SETU-15980-01 | `test-cases/TC-SETU-DRAFT-20260921210601.md` | PENDING-20260921210601 |
| SC-SETU-15980-02 | `test-cases/TC-SETU-DRAFT-20260921210602.md` | PENDING-20260921210602 |
| SC-SETU-15980-03 | `test-cases/TC-SETU-DRAFT-20260921210603.md` | PENDING-20260921210603 |

**Checklist §5C:** 3 skenario → 3 TC.
