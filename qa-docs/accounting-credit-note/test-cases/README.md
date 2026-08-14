# Test Cases — Credit Note

Card terkait: [ETM-15442](https://erpintegration.atlassian.net/browse/ETM-15442) Free COA Receiving Destination.

Prefix folder: `ARCN`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-ARCN-001 | EDIT — tambah Receiving Destination via Free COA Equity (modal) | draft | ❌ | 2026-08-13 |
| TC-ARCN-002 | EDIT — Free COA picker exclude COA terikat Master Cash/Bank | draft | ❌ | 2026-08-13 |
| TC-ARCN-003 | EDIT — campur baris Cash/Bank dan Free COA dalam satu CN | draft | ❌ | 2026-08-13 |
| TC-ARCN-004 | APPROVE — ditolak jika amount fund masih 0 (termasuk Free COA) | draft | ❌ | 2026-08-13 |
| TC-ARCN-005 | EDIT header — currency tanpa Cash/Bank aktif ditolak | draft | ❌ | 2026-08-13 |
| TC-ARCN-006 | CREATE+APPROVE — CN hanya Free COA (tanpa baris Cash/Bank) berhasil di-approve | draft | ❌ | 2026-08-13 |
| TC-ARCN-007 | IMPORT — Excel tetap bank-only; Free COA di GL Acc ditolak | draft | ❌ | 2026-08-13 |
| TC-ARCN-008 | E2E — Complete Sales Return billed → auto-generate Credit Note type COA | **failed** | ❌ | 2026-08-13 |
| TC-ARCN-009 | EDIT — Free COA picker exclude Customer's Deposit COA | **pass** | ❌ | 2026-08-13 |

E2E billed SR type COA: `TC-ARCN-008` — **FAILED** (klik **Complete** → 422 reconcile). Error: [ETM-15537](https://erpintegration.atlassian.net/browse/ETM-15537) (relates [ETM-15534](https://erpintegration.atlassian.net/browse/ETM-15534) + [ETM-15442](https://erpintegration.atlassian.net/browse/ETM-15442)).

Deposit COA exclude picker: `TC-ARCN-009` — **PASSED** (FAT, CN-5U43L1SR; Deposit `2-104` #4465 tidak di Select Free COA; control `3-102` muncul).
