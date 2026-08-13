# Test Cases — Credit Note

Card terkait: [ETM-15442](https://erpintegration.atlassian.net/browse/ETM-15442) Free COA Receiving Destination.

Prefix folder baru: `ARCN`. File masih DRAFT sampai `#renumber-tc accounting-credit-note`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| PENDING-20260813150410 | EDIT — tambah Receiving Destination via Free COA Equity (modal) | draft | ❌ | 2026-08-13 |
| PENDING-20260813150411 | EDIT — Free COA picker exclude COA terikat Master Cash/Bank | draft | ❌ | 2026-08-13 |
| PENDING-20260813150412 | EDIT — campur baris Cash/Bank dan Free COA dalam satu CN | draft | ❌ | 2026-08-13 |
| PENDING-20260813150413 | APPROVE — ditolak jika amount fund masih 0 (termasuk Free COA) | draft | ❌ | 2026-08-13 |
| PENDING-20260813150414 | EDIT header — currency tanpa Cash/Bank aktif ditolak | draft | ❌ | 2026-08-13 |
| PENDING-20260813154200 | CREATE+APPROVE — CN hanya Free COA (tanpa baris Cash/Bank) berhasil di-approve | draft | ❌ | 2026-08-13 |
| PENDING-20260813162500 | IMPORT — Excel tetap bank-only; Free COA di GL Acc ditolak | draft | ❌ | 2026-08-13 |
| PENDING-20260813211300 | E2E — Complete Sales Return billed → auto-generate Credit Note type COA | **failed** | ❌ | 2026-08-13 |

E2E billed SR type COA: `PENDING-20260813211300` — **FAILED** (klik **Complete** → 422 reconcile). Error: [ETM-15537](https://erpintegration.atlassian.net/browse/ETM-15537) (relates [ETM-15534](https://erpintegration.atlassian.net/browse/ETM-15534) + [ETM-15442](https://erpintegration.atlassian.net/browse/ETM-15442)).
