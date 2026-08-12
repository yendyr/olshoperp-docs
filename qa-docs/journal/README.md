# Journal — Dokumentasi QA

Menu **Journal** (Accounting / FA) — jurnal manual & auto-generate; hanya **Approved** yang masuk laporan keuangan.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |

**PM source:** Journal Source of Truth **v1.1** (`_meta/sot/journal-source-of-truth.md`)  
**UI route:** `/accounting/journal`  
**3 layer version:** 1.1 · **User-guide:** 1.0 (`source_version` 1.1)  
**Last updated:** 2026-08-12  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-08-12 15:20 | Promote Tier 1 ke **review**: KB lengkap dari SoT, user-guide v1.0, requirement & technical status draft→review |

## Related menus

| Menu | Link | Relasi |
|------|------|--------|
| Fiscal Period | [../accounting-fiscal-period/](../accounting-fiscal-period/) | Tanggal journal harus di period Open |
| Chart of Account | [../accounting-chart-of-account/](../accounting-chart-of-account/) | Sumber akun detail untuk ledger |
| General Ledger | [../general-ledger/](../general-ledger/) | Konsumen journal Approved |
| Profit & Loss | [../accounting-profit-loss/](../accounting-profit-loss/) | Laporan dari journal Approved |
| Balance Sheet | [../accounting-balance-sheet/](../accounting-balance-sheet/) | Neraca posisi as at dari journal Approved |
