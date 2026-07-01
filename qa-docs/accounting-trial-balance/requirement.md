---
doc_type: requirement
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Trial Balance — Requirement Documentation (AS-IS)

> **DRAFT** — Dokumentasi AS-IS dari codebase (19 Juni 2026). Belum final review QA/PM.

**Modul:** Accounting  
**Menu UI:** FA → Report → Trial Balance (`/accounting/trial-balance`)  
**Audience:** PM, QA, Support, Developer

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft AS-IS dari kode |

---

## 1. Ringkasan Eksekutif

Trial Balance adalah laporan **read-only** yang menampilkan saldo debit/kredit per COA untuk periode tanggal. UI memuat **7 tabel DataTables** — satu per COA class. Backend `TrialBalanceController@index` memfilter COA by `className` query param dan menghitung saldo via `JournalReport`. Entity `TrialBalance` hanya dipakai untuk policy; tidak ada tabel transaksi trial balance.

---

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan permission `accounting/trial-balance` dapat akses | `TrialBalancePolicy` | View |
| A-02 | Default periode = hari ini jika `period` kosong | `now()` start & end | Index |
| A-03 | Filter periode via param `period=start,end` | Parse comma-separated | Apply button FE |
| A-04 | 7 section COA class di UI | 7x `DataTablesV3` | DataList.vue |
| A-05 | Kolom Beginning / In-Period / Ending debit & credit | Controller columns | Datalist |
| A-06 | Parent COA rollup dari children | `getBeginningDebitParent`, dll. | JournalReport |
| A-07 | Current Profit/Loss COA special handling | `getProfitLossCoaIds` | JournalReport |
| A-08 | Hanya journal approved masuk perhitungan | Implicit di JournalReport queries | Balance |
| A-09 | Tidak ada CRUD endpoint aktif | Resource route commented | api.php |
| A-10 | Footer total per tabel | `trial_balance=true` flag | DataTablesV3 |

---

## 3. Validasi & Rules

| ID | Rule | Trigger | Catatan |
|----|------|---------|---------|
| V-01 | `className` required per request | Each table API call | Match `chart_of_account_classes.name` |
| V-02 | `period` format `YYYY-MM-DD,YYYY-MM-DD` | Apply filter | Optional; default today |
| V-03 | Company scope via journal | JournalReport | `getCompany()` context |
| V-04 | COA ordered by code hierarchy | `orderByRaw` on code segments | Visual tree order |

### 3.1 COA class → param `className`

| Section UI | `className` query value |
|------------|-------------------------|
| Assets | `assets` |
| Liabilities | `liabilities` |
| Equity | `equity` |
| Revenues | `revenue` |
| Other Revenues & Expenses | `other revenue & expenses` |
| Expenses | `expense` |
| Other Cost of Goods Sold | `cost of goods sold` |

---

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Period picker | VueDatePicker range | Local state `period` |
| F-02 | Apply filter | Button Apply | `committedPeriod` → reload 7 URLs |
| F-03 | COA hierarchy display | `coa_name` column | Indent + bold parent |
| F-04 | Numeric columns for footer | `*_number` hidden columns | Sum in footer |
| F-05 | Read-only | No create route | No mutations |

### 4.1 Arsitektur data

```mermaid
flowchart TB
    subgraph FE["TrialBalance/DataList.vue"]
        P[Period picker]
        T1["Table: Assets"]
        T2["Table: Liabilities"]
        T7["Table: COGS"]
    end

    subgraph API["TrialBalanceController"]
        I[index / datalist]
    end

    subgraph Helper["JournalReport"]
        B[getBeginningDebit/Credit]
        IP[getInPeriodDebit/Credit]
        PL[Profit/Loss COA helpers]
    end

  subgraph DB[("Journal + JournalDetail\nApproved only")]
    end

    P --> T1 & T2 & T7
    T1 -->|"className=assets"| I
    I --> Helper
    Helper --> DB
```

### 4.2 Formula saldo (AS-IS)

| Tipe COA | Beginning debit | Ending debit |
|----------|-----------------|--------------|
| Leaf COA | `getBeginningDebit(coa_id, start)` | beginning debit + in-period debit |
| Parent COA | `getBeginningDebitParent` | rollup children |
| Current P/L COA | `getBeginningProfitLossDebit` | `getEndingProfitLossDebit` |

Kolom **credit** paralel dengan helper `*Credit*`. Nilai ditampilkan terpisah di kolom debit dan credit (bukan net satu kolom).

---

## 5. Permission & Dependencies

| Dependency | Wajib untuk |
|------------|-------------|
| COA master per company | Baris laporan |
| COA Class seeder (7 class) | Pemetaan 7 tabel |
| Journal approved dalam periode | Angka non-zero |
| Company Current Profit/Loss COA config | Baris P/L benar |

---

## 6. QA Test Notes

- Apply periode bulan berjalan → bandingkan total Assets ending dengan ekspektasi manual dari GL
- Parent COA: pastikan tidak double-count saat reconcile dengan child
- COA tanpa mutasi: baris 0 atau tidak muncul (tergantung query `whereHas` class)
- Permission: user tanpa menu link → 403
- Tidak ada tombol Create/Edit di UI

---

## 7. Known Gaps / Open Questions

- Tidak ada export Excel di Trial Balance (beda dengan GL)
- Position Activa/Passiva tidak di-adjust eksplisit di TB controller (beda dengan sebagian GL export)
- Entity `TrialBalance` kosong — hanya policy placeholder
- Commented legacy routes di `api.php` (`index_expense`, resource) — tidak aktif

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| General Ledger | [../general-ledger/requirement.md](../general-ledger/requirement.md) |
