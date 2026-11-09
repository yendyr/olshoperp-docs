---
doc_type: requirement
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.4
last_updated: 2026-11-09
owner: QA - Yemima
status: review
---

# Trial Balance — Requirement Documentation

**Modul:** Accounting  
**Menu UI:** FA → Report → Trial Balance (`/accounting/trial-balance`)  
**Audience:** PM, QA, Support, Developer  
**AS-IS kolom Balance:** [ETM-17077](https://erpintegration.atlassian.net/browse/ETM-17077)
**AS-IS export period header:** [ETM-17079](https://erpintegration.atlassian.net/browse/ETM-17079)  
**AS-IS Column Show & Hide:** [ETM-17078](https://erpintegration.atlassian.net/browse/ETM-17078)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial AS-IS dari kode |
| 1.1 | 2026-11-05 | QA - Yemima | TO-BE ETM-17077: kolom **Balance** per grup; rumus Activa/Passiva; minus tampil minus |
| 1.2 | 2026-11-06 | QA - Yemima | **AS-IS** ETM-17079: header export Excel tampilkan Period filter; tutup GAP-TB-01 (export sudah ada) |
| 1.3 | 2026-11-06 | QA - Yemima | **AS-IS** ETM-17078: Column Show & Hide Debit/Credit/Balance × 3 grup |
| 1.4 | 2026-11-09 | QA - Yemima | **AS-IS** ETM-17077: kolom Balance per grup (Activa/Passiva, minus tetap minus); Reset Column Show & Hide mengembalikan semua kolom angka |

---

## 1. Ringkasan Eksekutif

Trial Balance adalah laporan **read-only** yang menampilkan saldo debit/kredit per COA untuk periode tanggal. UI memuat **7 tabel DataTables** — satu per COA class. Backend `TrialBalanceController@index` memfilter COA by `className` dan menghitung saldo via `JournalReport`. Entity `TrialBalance` hanya untuk policy; tidak ada tabel transaksi trial balance.

**AS-IS (ETM-17077):** tiap grup Beginning / In-Period / Ending punya Debit, Credit, lalu **Balance**. Rumus Debit/Credit tidak berubah; Balance turunan dari pasangan grup itu menurut position COA class.
**AS-IS export (ETM-17079):** file Excel export menampilkan periode filter di baris header. Period kosong memakai hari ini (awal = akhir).
**AS-IS Column Show & Hide (ETM-17078):** user bisa tampilkan/sembunyikan Debit, Credit, Balance per grup di semua section tabel. Reset mengembalikan semua kolom angka. Sembunyi kolom tidak mengubah angka.

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

### 2.2 AS-IS — ETM-17077 (kolom Balance)

| ID | Kriteria |
|----|----------|
| TB-BAL-01 | Label kolom: **Balance** (bukan "Balanced") |
| TB-BAL-02 | Kolom Balance ada di **3 grup**: Beginning Balance, In-Period, Ending Balance — setelah Debit & Credit grup itu |
| TB-BAL-03 | **Activa** (`chart_of_account_classes.position = Activa`): Balance = Debit − Credit (pasangan grup yang sama) |
| TB-BAL-04 | **Passiva** (`position = Passiva`): Balance = Credit − Debit |
| TB-BAL-05 | Hasil negatif ditampilkan sebagai **angka minus** (tidak dipindah ke kolom lain / tidak diabsolutkan) |
| TB-BAL-06 | Berlaku di semua 7 section tabel COA class |
| TB-BAL-07 | Debit/Credit AS-IS tidak berubah; Balance = kolom turunan dari pasangan Debit/Credit baris tersebut (termasuk parent / Current P/L) |

### 2.3 AS-IS — ETM-17079 (header periode di export)

| ID | Kriteria |
|----|----------|
| TB-EXP-01 | Export Excel Trial Balance tersedia (Export All / riwayat file) |
| TB-EXP-02 | Baris 1 header (merge, center): `OlshopERP \| Trial Balance Period {dd-mm-yyyy} - {dd-mm-yyyy}` |
| TB-EXP-03 | Tanggal di header = filter **Period** saat export (param `period`); kosong → default hari ini (start = end) |
| TB-EXP-04 | Baris 2 = judul kolom; termasuk Beginning / In Period / Ending **Balance** (selaras rumus 17077) |

### 2.4 AS-IS — ETM-17078 (Column Show & Hide)

| ID | Kriteria |
|----|----------|
| TB-COL-01 | Kontrol **Column Show & Hide** tersedia di toolbar datalist Trial Balance |
| TB-COL-02 | Dapat show/hide **Debit**, **Credit**, **Balance** untuk grup **Beginning Balance**, **In-Period Transaction**, **Ending Balance** |
| TB-COL-03 | Label opsi memakai nama grup + jenis kolom (contoh: `Beginning Balance - Debit`) |
| TB-COL-04 | Perubahan visibilitas diterapkan ke **semua** 7 section tabel COA class di halaman |
| TB-COL-05 | Hanya mengubah tampilan UI — tidak mengubah rumus / nilai perhitungan / isi export |
| TB-COL-06 | Reset / default mengembalikan semua kolom angka (Debit, Credit, Balance di ketiga grup) |

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
| F-06 | **AS-IS** kolom Balance × 3 grup | ETM-17077 | §2.2 |
| F-07 | **AS-IS** Export Excel + header Period | ETM-17079 | §2.3 |
| F-08 | **AS-IS** Column Show & Hide | ETM-17078 | §2.4 |

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

### 4.3 Formula kolom Balance (AS-IS ETM-17077)

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
| GAP-TB-01 | Export Excel Trial Balance | **Closed** — export ada; header Period = ETM-17079. Klaim lama "tidak ada export" sudah tidak berlaku; baris histori changelog tidak dihapus |
| GAP-TB-02 | Entity `TrialBalance` kosong — hanya policy | Note |
| GAP-TB-03 | Footer sum kolom Balance (signed). Backend sudah mengirim angka Balance bertanda untuk Beginning, In-Period, dan Ending. Indeks footer di layar belum dicek ulang pada pembaruan ini | Open — sisa cek tampilan footer |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Card | [ETM-17077](https://erpintegration.atlassian.net/browse/ETM-17077) · [ETM-17078](https://erpintegration.atlassian.net/browse/ETM-17078) · [ETM-17079](https://erpintegration.atlassian.net/browse/ETM-17079) |
