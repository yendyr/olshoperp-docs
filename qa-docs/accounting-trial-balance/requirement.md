---
doc_type: requirement
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.1
last_updated: 2026-11-05
owner: QA - Yemima
status: review
---

# Trial Balance — Requirement Documentation

**Modul:** Accounting  
**Menu UI:** FA → Report → Trial Balance (`/accounting/trial-balance`)  
**Audience:** PM, QA, Support, Developer  
**TO-BE kolom Balance:** [ETM-17077](https://erpintegration.atlassian.net/browse/ETM-17077)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial AS-IS dari kode |
| 1.1 | 2026-11-05 | QA - Yemima | TO-BE ETM-17077: kolom **Balance** per grup; rumus Activa/Passiva; minus tampil minus |

---

## 1. Ringkasan Eksekutif

Trial Balance adalah laporan **read-only** yang menampilkan saldo debit/kredit per COA untuk periode tanggal. UI memuat **7 tabel DataTables** — satu per COA class. Backend `TrialBalanceController@index` memfilter COA by `className` dan menghitung saldo via `JournalReport`. Entity `TrialBalance` hanya untuk policy; tidak ada tabel transaksi trial balance.

**AS-IS:** tiap grup Beginning / In-Period / Ending hanya Debit + Credit.  
**TO-BE (ETM-17077):** tiap grup menambah kolom **Balance** setelah Credit, dihitung dari position COA class.

---

## 2. Acceptance Criteria

### 2.1 AS-IS

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan permission `accounting/trial-balance` dapat akses | `TrialBalancePolicy` | View |
| A-02 | Default periode = hari ini jika `period` kosong | `now()` start & end | Index |
| A-03 | Filter periode via param `period=start,end` | Parse comma-separated | Apply button FE |
| A-04 | 7 section COA class di UI | 7x `DataTablesV3` | DataList.vue |
| A-05 | Kolom Beginning / In-Period / Ending debit & credit | Controller columns | Datalist |
| A-06 | Parent COA rollup dari children | `getBeginningDebitParent`, dll. | JournalReport |
| A-07 | Current Profit/Loss COA special handling | `getProfitLossCoaIds` | JournalReport |
| A-08 | Hanya journal approved masuk perhitungan | Implicit di JournalReport | Balance |
| A-09 | Tidak ada CRUD endpoint aktif | Resource route commented | api.php |
| A-10 | Footer total per tabel | `trial_balance=true` flag | DataTablesV3 |

### 2.2 TO-BE — ETM-17077 (kolom Balance)

| ID | Kriteria |
|----|----------|
| TB-BAL-01 | Label kolom: **Balance** (bukan "Balanced") |
| TB-BAL-02 | Kolom Balance ada di **3 grup**: Beginning Balance, In-Period, Ending Balance — setelah Debit & Credit grup itu |
| TB-BAL-03 | **Activa** (`chart_of_account_classes.position = Activa`): Balance = Debit − Credit (pasangan grup yang sama) |
| TB-BAL-04 | **Passiva** (`position = Passiva`): Balance = Credit − Debit |
| TB-BAL-05 | Hasil negatif ditampilkan sebagai **angka minus** (tidak dipindah ke kolom lain / tidak diabsolutkan) |
| TB-BAL-06 | Berlaku di semua 7 section tabel COA class |
| TB-BAL-07 | Debit/Credit AS-IS tidak berubah; Balance = kolom turunan dari pasangan Debit/Credit baris tersebut (termasuk parent / Current P/L) |

---

## 3. Validasi & Rules

| ID | Rule | Trigger | Catatan |
|----|------|---------|---------|
| V-01 | `className` required per request | Each table API call | Match `chart_of_account_classes.name` |
| V-02 | `period` format `YYYY-MM-DD,YYYY-MM-DD` | Apply filter | Optional; default today |
| V-03 | Company scope via journal | JournalReport | `getCompany()` context |
| V-04 | COA ordered by code hierarchy | `orderByRaw` on code segments | Visual tree order |

### 3.1 COA class → param `className` + position (seeder)

| Section UI | `className` | Position (sistem) |
|------------|-------------|-------------------|
| Assets | `assets` | **Activa** |
| Liabilities | `liabilities` | **Passiva** |
| Equity | `equity` | **Passiva** |
| Revenues | `revenue` | **Passiva** |
| Other Revenues & Expenses | `other revenue & expenses` | **Passiva** |
| Expenses | `expense` | **Activa** |
| Other Cost of Goods Sold | `cost of goods sold` | **Activa** |

> Spelling DB/sistem: **Passiva** (bukan "Pasiva").

---

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Period picker | VueDatePicker range | Local state `period` |
| F-02 | Apply filter | Button Apply | `committedPeriod` → reload 7 URLs |
| F-03 | COA hierarchy display | `coa_name` column | Indent + bold parent |
| F-04 | Numeric columns for footer | `*_number` hidden columns | Sum in footer |
| F-05 | Read-only | No create route | No mutations |
| F-06 | **TO-BE** kolom Balance × 3 grup | ETM-17077 | §2.2 |

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

### 4.2 Formula saldo Debit/Credit (AS-IS)

| Tipe COA | Beginning debit | Ending debit |
|----------|-----------------|--------------|
| Leaf COA | `getBeginningDebit(coa_id, start)` | beginning debit + in-period debit |
| Parent COA | `getBeginningDebitParent` | rollup children |
| Current P/L COA | `getBeginningProfitLossDebit` | `getEndingProfitLossDebit` |

Kolom **credit** paralel dengan helper `*Credit*`.

### 4.3 Formula kolom Balance (TO-BE ETM-17077)

Untuk setiap grup \(G \in \{\text{Beginning}, \text{In-Period}, \text{Ending}\}\):

| Position | Balance\(G\) |
|----------|----------------|
| **Activa** | Debit\(G\) − Credit\(G\) |
| **Passiva** | Credit\(G\) − Debit\(G\) |

Contoh: Activa Debit=30, Credit=100 → Balance = **−70** (tampil minus).

---

## 5. Permission & Dependencies

| Dependency | Wajib untuk |
|------------|-------------|
| COA master per company | Baris laporan |
| COA Class seeder (7 class + position) | Pemetaan 7 tabel + rumus Balance |
| Journal approved dalam periode | Angka non-zero |
| Company Current Profit/Loss COA config | Baris P/L benar |

---

## 6. Contoh kasus (ETM-17077)

| # | Situasi | Expected Balance (satu grup) |
|---|---------|------------------------------|
| T01 | Assets (Activa), Debit 100, Credit 30 | 70 |
| T02 | Assets (Activa), Debit 30, Credit 100 | −70 |
| T03 | Liabilities (Passiva), Debit 30, Credit 100 | 70 |
| T04 | Liabilities (Passiva), Debit 100, Credit 30 | −70 |
| T05 | Ketiga grup punya Balance sendiri | Beginning/In-Period/Ending masing-masing dari pasangan Debit/Credit grup itu |

---

## 7. QA Test Notes

- Apply periode bulan berjalan → bandingkan total Assets ending dengan ekspektasi manual dari GL
- Parent COA: pastikan tidak double-count saat reconcile dengan child
- COA tanpa mutasi: baris 0 atau tidak muncul (tergantung query `whereHas` class)
- Permission: user tanpa menu link → 403
- Tidak ada tombol Create/Edit di UI
- **ETM-17077:** spot-check 1 akun Activa + 1 Passiva, nilai positif & negatif

---

## 8. Known Gaps / Open Questions

| ID | Deskripsi | Status |
|----|-----------|--------|
| GAP-TB-01 | Tidak ada export Excel di Trial Balance | Open |
| GAP-TB-02 | Entity `TrialBalance` kosong — hanya policy | Note |
| GAP-TB-03 | Footer sum untuk kolom Balance (signed) — pastikan FE `columnWithFooter` ikut indeks baru | Open saat implementasi 17077 |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Card | [ETM-17077](https://erpintegration.atlassian.net/browse/ETM-17077) |
