# Account Receive — Dokumentasi

Menu **Account Receive** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | End user | review |
| Test Cases | [test-cases/README.md](./test-cases/README.md) | QA, Manual Tester | review |

**Menu terkait:** [Sales Invoice](../accounting-customer-invoice/README.md) (sumber piutang yang dilunasi) · [Credit Note](../accounting-credit-note/README.md) (sumber dana deposit sekaligus hasil kelebihan bayar) · [Instant Settlement](../accounting-settlement-upload/README.md) (Approve settlement membentuk dokumen AR otomatis)

**PM source:** `_meta/sot/accounting-customer-payment-source-of-truth.md` v1.0 — dari raw requirement Import AR v3.0 (April 2026) + verifikasi codebase.

**Maintenance owner:** QA — Yemima

## Navigasi

| Item | Nilai |
|------|-------|
| Sidebar | Accounting → **Account Receive** |
| Route UI | `/accounting/customer-payment` |
| Test Case Library | `/test-case-library?menu=accounting-customer-payment` |

**Open CR:** [ETM-17298](https://erpintegration.atlassian.net/browse/ETM-17298) — jam import AR 23:59:00  
**Open Improvement:** [ETM-17325](https://erpintegration.atlassian.net/browse/ETM-17325) — autosave create default Open · [ETM-17326](https://erpintegration.atlassian.net/browse/ETM-17326) — audit log readable (Qudum, High)  
**Layer version:** requirement **2.13** · user-guide **1.7** · **Last updated:** 2026-11-11 15:20
**Related Jira:** [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) · [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764) · [ETM-16991](https://erpintegration.atlassian.net/browse/ETM-16991) · [ETM-17102](https://erpintegration.atlassian.net/browse/ETM-17102) · [ETM-17198](https://erpintegration.atlassian.net/browse/ETM-17198) · [ETM-17298](https://erpintegration.atlassian.net/browse/ETM-17298) · [ETM-17325](https://erpintegration.atlassian.net/browse/ETM-17325) · [ETM-17326](https://erpintegration.atlassian.net/browse/ETM-17326)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.13 | 2026-11-11 15:20 | Approve validations §6.4.1; jurnal Approve §5.11; audit TO-BE §5.12 / ETM-17326; ETM-17325 autosave Open; Description Adjustment wajib ikut kode |
| 2.12 | 2026-11-11 14:50 | §5.10 Adjustment form manual + contoh Debit/Credit; FE Single Use copywriting Receive |
| 2.11 | 2026-11-11 10:25 | AS-IS sync: Summary ETM-16644, CN-COA ETM-16764, MEM ETM-17198 closed; GAP-AR-09 tetap Open (docs alur manual) |
| 2.10 | 2026-11-11 10:20 | TO-BE ETM-17298: jam import AR 23:59:00 (CN overpayment 23:59:10 same day); GAP-AR-03 → Open TO-BE; GAP-AR-08 closed (bukan gap — relates Instant Settlement) |
| 2.9 | 2026-11-11 10:15 | Locked AS-IS GAP-AR-03..06; GAP-AR-07 closed (copy/lock AR sudah benar); matching amount diperjelas di UG/KB |
| 2.8 | 2026-11-11 10:07 | Locked AS-IS GAP-AR-01 (heading template live) + GAP-AR-02 (CN saat import Open; hapus CN blokir Approve; no regenerate dari edit AR) |
| 2.7 | 2026-11-09 11:40 | TO-BE ETM-17198: datalist maks 50 entries + optimasi memori [yemimadocs] |
| 2.6 | 2026-11-09 08:59 | Setelah memilih tagihan di dokumen yang masih bisa diubah, Receiving Destination terisi sendiri dengan jumlah tagihan itu (ETM-17102) |
| 2.5 | 2026-11-04 09:28 | Daftar Account Receive menampilkan kolom Description per dokumen; bisa dicari dan diurut, dan ikut di file ekspor termasuk Receive per tanggal (ETM-16991) |
| 2.3 | 2026-10-22 | TO-BE ETM-16764: Payment Source CN stamp COA dari asal CN (SR → Deposit of Sales Return) |
| 2.2 | 2026-10-19 | TO-BE ETM-16644: Section Summary (header CCY, CN terpisah, tanda Credit+/Debit−, Total orange jika ≠ 0) |
| 2.1 | 2026-09-01 17:05 | Cross-ref Instant Settlement ETM-15701: AR date/time dari SI + guard same calendar date |
| 2.0 | 2026-08-31 | Split dari SoT v1.0 — Import AR multi-sheet, validasi terverifikasi codebase, Gap Registry GAP-AR-01..09; technical.md & user-guide.md dibuat; 3 layer naik ke review |
| 1.1 | 2026-06-26 | Test cases AR detail insert (single/bulk use, bulk select) |
| 1.0 | 2026-06-23 | Cross-reference Relasi Instant Settlement (Fase 1) |
