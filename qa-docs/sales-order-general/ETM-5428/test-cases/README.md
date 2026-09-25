# Test Cases — Dev - Sales Order (ETM-5428)

Card origin: [ETM-5428](https://erpintegration.atlassian.net/browse/ETM-5428) — `[Sales Order General - Print] watermark VOIDED on print when status VOID`.

Test plan: [../test-plan.md](../test-plan.md) · Request ID: `none` · Owner: QA - Rachmatulloh Yendy · Intent: **new** (0 reuse)

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| PENDING-20260918111407 | Print SO Void menampilkan watermark VOIDED | draft | ❌ | 2026-09-18 |
| PENDING-20260918111408 | Print SO Approved tidak menampilkan watermark VOIDED | draft | ❌ | 2026-09-18 |
| PENDING-20260918111409 | Print SO Closed tidak menampilkan watermark VOIDED (Closed bukan Void) | draft | ❌ | 2026-09-18 |

| Skenario | File | `tc_code` | `test_type` |
|---|---|---|---|
| SC-SOG-5428-01 | [TC-SOG-DRAFT-20260918111407.md](./TC-SOG-DRAFT-20260918111407.md) | PENDING-20260918111407 | happy |
| SC-SOG-5428-02 | [TC-SOG-DRAFT-20260918111408.md](./TC-SOG-DRAFT-20260918111408.md) | PENDING-20260918111408 | negative |
| SC-SOG-5428-03 | [TC-SOG-DRAFT-20260918111409.md](./TC-SOG-DRAFT-20260918111409.md) | PENDING-20260918111409 | edge |

Print / watermark **belum** di `requirement.md` (status review) — expected print di ketiga TC = `[MENUNGGU REQUIREMENT]`. Company default: FAT (112). Card fixture PT KOMI = catatan saja.
