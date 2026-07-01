# Trial Balance — Dokumentasi

Menu **Trial Balance** (Accounting) — laporan neraca saldo per COA dalam periode tertentu.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/accounting/trial-balance` → `olshoperp-frontend/src/pages/Accounting/Report/TrialBalance/DataList.vue` (read-only)
- BE: `Modules/Accounting/Http/Controllers/TrialBalanceController.php` — endpoint `GET /api/accounting/trial-balance/datalist`
- Helper: `app/Helpers/Accounting/JournalReport.php`

## Related menus

| Menu | Relasi |
|------|--------|
| Journal | Sumber data — hanya journal **Approved** |
| COA | Baris per akun, dikelompokkan per COA class |
| General Ledger | Detail transaksi per COA (Trial Balance = agregasi) |
| Balance Sheet / P&L | Laporan turunan dari data jurnal yang sama |
