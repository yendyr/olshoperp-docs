# Trial Balance — Dokumentasi QA

Menu **Trial Balance** (Finance & Accounting → Report) — neraca saldo debit/kredit per COA per periode.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v1.4) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v1.4) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v1.4) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v1.4) | Publish | review |

**UI route:** `/accounting/trial-balance`  
**Staging:** https://staging.olshoperp.com/accounting/trial-balance  
**Improvement aktif:** [ETM-17077](https://erpintegration.atlassian.net/browse/ETM-17077) Balance · [ETM-17078](https://erpintegration.atlassian.net/browse/ETM-17078) Column Show & Hide · [ETM-17079](https://erpintegration.atlassian.net/browse/ETM-17079) export Period header  
**3 layer:** 1.4 · **Last updated:** 2026-11-09 08:59

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial AS-IS |
| 1.1 | 2026-11-05 | TO-BE ETM-17077 kolom Balance; UG ditambah; README sync |
| 1.2 | 2026-11-06 | AS-IS ETM-17079 export header Period; GAP-TB-01 closed |
| 1.3 | 2026-11-06 | AS-IS ETM-17078 Column Show & Hide Debit/Credit/Balance × 3 grup |
| 1.4 | 2026-11-09 08:59 | Kolom Balance di tiap grup Beginning, In-Period, dan Ending mengikuti tipe akun; angka minus tetap minus. Reset tampilan kolom mengembalikan semua kolom angka (ETM-17077, ETM-17078, ETM-17079) |

## Related

- [General Ledger](../general-ledger/README.md) — detail transaksi
- [Journal](../journal/README.md) — sumber Approved
- [Chart of Account](../accounting-chart-of-account/README.md) — baris + position class

**Maintenance owner:** QA — Yemima
