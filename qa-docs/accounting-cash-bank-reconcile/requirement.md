---
doc_type: requirement
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
version: 1.6
last_updated: 2026-09-10
owner: QA - Yemima
status: review
aliases: [cash bank reconcile, bank reconcile, CBR, rekonsiliasi bank, cash reconcile]
---

# Cash & Bank Reconcile — Requirement Documentation

**Modul:** Finance & Accounting  
**Prefix gap:** `CBR-`  
**Audience:** PM, QA, Finance  
**UI route:** `/accounting/cash-bank-reconcile`  
**Prefix kode:** `BR-`  
**SoT:** `cash_bank_reconcile_requirement.md` v1.1 (16 Jul 2026)  
**TO-BE matching:** ETM-15856 + brief `docs/qa-docs/_meta/sot/cbr-matching-slideover-brief.md` + mockup https://claude.ai/code/artifact/30842e2e-3647-485f-b96c-d54a6000f274

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Placeholder pending |
| 1.2 | 2026-07-17 | QA - Yemima | Rewrite dari SoT v1.1 + AS-IS codebase: matching, import, approve; gap CBR-01..12; matrix implementasi |
| 1.5 | 2026-09-10 | QA - Yemima | TO-BE Matching Slideover 2 arah + Quick Journal (ETM-15856); keputusan terkunci D1–D5; update §5.4 / §6 / gap / matrix |
| 1.6 | 2026-09-10 | QA - Yemima | Promote 3 layer ke review; Feature Map + Lingo; user-guide v1.0 |

---

## 1. Ringkasan Eksekutif

Cash & Bank Reconcile mencocokkan transaksi internal GL (journal detail akun kas/bank) dengan bank statement import, agar saldo buku sama dengan saldo bank. Audience: Finance/Accounting. Setelah Approved, SoT mensyaratkan **period lock** tanpa penerbitan jurnal — **period lock belum terimplementasi** (GAP-CBR-08).

```mermaid
flowchart LR
    GL[GL Journal Approved] --> CBR[Cash Bank Reconcile]
    BS[Bank Statement Import] --> CBR
    CBR --> MATCH[Matching]
    MATCH --> APR[Approved]
    APR -.->|TO-BE SoT| LOCK[Period Locked per Cash/Bank]
```

| Kebutuhan bisnis | Jawaban CBR |
|------------------|------------|
| Cocokkan bank vs GL | Match exact amount (suggestion boleh ±5%) |
| Jejak rekonsiliasi | Status Reconciled / Not Reconciled di kedua sisi |
| Kunci period setelah yakin | SoT: period lock — **AS-IS: belum ada** |
| Tanpa jurnal tambahan | Approve **tidak** create journal — AS-IS sesuai |

---

## 2. Prasyarat

| Prasyarat | Sumber | Catatan |
|-----------|--------|---------|
| Master Cash/Bank aktif | Company Detail Bank | Opsi Cash Bank Account |
| Journal Approved dengan COA cash/bank | GL / Journal | Eligible: dalam Period, Not Reconciled |
| File bank statement | Import template | Kolom: TransactionDate, Received, Spent, Description |

---

## 3. Siklus Status

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Open: Save / set status Open
    Open --> Draft: Set status Draft
    Open --> Approved: Approve
    Open --> Rejected: Reject
    Rejected --> Draft: User set Draft
    Rejected --> Open: User set Open
    Approved --> [*]
```

| Status | Editable? | Tombol / aksi AS-IS | Catatan |
|--------|-----------|---------------------|---------|
| Draft | Ya | Save, Import/Match jika `can_update` | Create default Draft |
| Open | Ya | Save, Import, Match, Unmatch, Approve, Reject | Matching aktif |
| Approved | Tidak | View / Show | Final; unmatch tidak tersedia |
| Rejected | Ya (AS-IS) | Bisa set Draft/Open lagi | GAP-CBR-01 clarified AS-IS: tidak permanen; radio UI bisa remap tampilan ke Draft |

**Approve:** single-level (`approval => 1`). **Tidak** ada early warning period-lock (GAP-CBR-12). Syarat: ada minimal 1 baris bank statement import. Cek “semua harus Reconciled” **di-comment** → partial reconcile boleh di-Approve (GAP-CBR-09).

---

## 4. Datalist

| Kolom | Visible default | Sumber | Keterangan |
|-------|-----------------|--------|------------|
| ID | Tidak | Internal | — |
| Trx Code \| Trx Date | Ya | `BR-` auto / manual | — |
| Cash/Bank Name \| Acc Number | Ya | Master bank | Acc kosong → `-` |
| Period | Ya | period_start–end | `DD-MM-YYYY - DD-MM-YYYY` |
| Statement Balance | Ya | Σ import (debit − credit) | — |
| Internal Balance | Ya | Σ detail **matched** (debit − credit) | — |
| Difference | Ya | Statement − Internal | — |
| Description | Ya | Header | max 150 |
| Trx Status | Ya | Status | — |
| Created by \| Created at | Ya | Audit / default columns | — |
| Action | Ya | — | Edit/Show/Delete sesuai status |

**Fitur:** Global Search, Advanced Filter, Create, Show Deleted, Column Show/Hide, Export with/without details, bulk delete/approve.

---

## 5. Form & Field

### 5.1 Basic Information

| Field | Wajib? | Validasi AS-IS | Catatan |
|-------|--------|----------------|---------|
| Transaction Code | Tidak (auto) | Unique per company | Prefix `BR-`; boleh manual |
| Period | Ya | start ≤ end; **tidak overlap** period CBR lain pada bank yang sama | Error: `The period is overlapping with another reconciliation.` Tidak bisa diubah setelah import |
| Cash Bank Account | Ya | Master aktif | Tidak bisa diubah setelah ada baris matched |
| Description | Tidak | max 150 | — |

### 5.2 Internal Transaction (GL)

Journal detail Approved, COA = cash/bank terpilih, tanggal dalam Period, status Reconciled/Not Reconciled.

| Kolom | Keterangan |
|-------|------------|
| GL Trx Code \| Date | Journal |
| Description | Detail |
| Debit / Credit | Posisi akun cash/bank |
| Status | Reconciled / Not Reconciled |

Sort default: tanggal journal ASC. Export: active page (bukan export-all list ini).

### 5.3 Bank Statement (import only)

| Kolom | Keterangan |
|-------|------------|
| Date / Description | Dari file |
| Debit / Credit | Received → Debit; Spent → Credit |
| GL Trx Code \| Date | Terisi setelah match |
| Status | Reconciled / Not Reconciled |

**Template** `Template-Import-Detail-Reconciliation` — kolom: TransactionDate, Received, Spent, Description (tanpa Type). Nature = kolom mana yang terisi.

| Aturan import AS-IS | Behavior |
|---------------------|----------|
| Date wajib `DD/MM/YYYY` | Reject baris + aggregate fail |
| Exactly one of Received/Spent | Reject jika keduanya kosong/terisi |
| Numeric, non-negative | Reject |
| Tanggal dalam Period | Reject di luar period |
| Satu baris gagal | **All-or-nothing** — tidak insert; cek import log (GAP-CBR-07 resolved) |

FE `public/files` saat ini hanya `.csv`; download UI mengarah `.xlsx` (GAP-CBR-11).

### 5.4 Reconcile Process

**AS-IS:** Panel Bank Statement (kiri) + Internal GL (kanan) + Match; Total Bank / Total Internal. Difference strip di tab process **belum ada** (GAP-CBR-12). Modal matching = `Dialog` 3xl; bank terkunci 1 baris; Create → redirect Journal.

**TO-BE (ETM-15856):** matching utama di **Slideover** — lihat §6.5. Difference bar hidup di footer slideover (bukan wajib di header tab process).

---

## 6. How It Works

### 6.1 Suggestion matching (AS-IS — 6 prioritas)

Threshold **hardcoded** `abs(amount) * 0.05` (GAP-CBR-04).

| # | Kondisi | Catatan vs SoT |
|---|---------|----------------|
| 1 | Tanggal sama + amount exact + sisi sama | SoT #1 |
| 2 | Amount exact + sisi sama (tanggal beda) | SoT #2 |
| 3 | Tanggal sama + amount exact + **sisi berlawanan** | Extra vs SoT; flag tip |
| 4 | Tanggal sama + ±5% sisi sama | SoT #3 |
| 5 | Tanggal sama + ±5% sisi berlawanan | Extra |
| 6 | ±5% sisi sama, tanggal beda | SoT #4 |

Multi-kandidat: `"See {n} other matching transactions."` → panel matching. Tanpa kandidat: `"No matching transaction found."` + link **See Other……** (SoT: “Find or Create New” — GAP copy).

**AS-IS modal:** filter period/amount, multi-select bulk match, tombol **Create** → `/accounting/journal/create`.  
**TO-BE:** §6.5 (Slideover + Quick Journal, tanpa redirect).

### 6.2 Validasi Match (final)

SoT: cukup total GL = nominal bank exact. Toleransi ±5% **hanya** untuk suggestion — tidak dipakai saat Match.

| Mode | Rules |
|------|-------------|
| Single Match (AS-IS) | (1) tanggal dalam period (2) **tanggal bank = tanggal GL** (3) sisi debit/credit sama (4) amount exact |
| Bulk / multi-select (AS-IS + TO-BE) | Validasi pada **sum** exact; baris tanggal/sisi beda **di-flag** agar user sadar (GAP-CBR-10 — simetri single vs multi tetap open) |
| POV A (TO-BE) | 1 bank statement ↔ many GL — sum exact |
| POV B (TO-BE) | 1 GL ↔ many bank statements (import-only) — sum exact |

Error amount:  
`Reconciliation cannot proceed. Bank statement amount {bank} is {higher|lower} than the GL amount {gl}. Fix the difference to reconcile.`

Setelah match: baris hilang dari tab process; status Reconciled; GL code terisi di bank statement.

### 6.3 Unmatch

Hanya Draft/Open. Unmatch satu sisi → sisi lain kembali Not Reconciled. Approved: aksi tidak tersedia.

### 6.4 Approve & period lock

| Aspek | SoT | AS-IS |
|-------|-----|-------|
| Jurnal pada approve **CBR** | Tidak | Tidak (sesuai) |
| Period lock COA+tanggal | Wajib | **Tidak ada** — journal/transaksi lain masih bisa (GAP-CBR-08) |
| Early warning lock | Wajib | ApprovalModal generic saja (GAP-CBR-12) |
| Partial reconcile approve | `[VERIFY]` | Diizinkan (cek full match di-comment) (GAP-CBR-09) |
| Overlap period antar CBR | Ya | Ya — hanya antar dokumen CBR, bukan lock GL |

> **Catatan:** Quick Journal di matching (TO-BE) **membuat** journal — itu terpisah dari Approve dokumen CBR.

### 6.5 Matching Slideover + Quick Journal (TO-BE — ETM-15856)

**Status:** planned (belum production). Mockup = SoT visual. Keputusan terkunci 10-09-2026:

| ID | Keputusan |
|----|-----------|
| D1 | Setelah **Save & Approve** journal: hanya **auto-select** di list; **Match tetap klik manual** (tidak auto-Match) |
| D2 | Bank statement **import-only** — tidak create dari panel; hanya Change / multi-select baris import |
| D3 | Quick journal **ringkas** — tanpa attachment, store, transaction reference, rate |
| D4 | Ganti anchor: clear selection + notice di footer picker (*Switching the line/transaction clears…*) — tanpa modal confirm terpisah |
| D5 | Amount kas/bank di quick journal = Σ offset (**read-only**); hanya Description kas/bank editable |

#### Panel matching

| Elemen | Behavior |
|--------|----------|
| Container | **Slideover** (bukan Dialog 3xl); halaman reconcile tetap terlihat |
| POV A (default) | Anchor = 1 bank statement; multi-select = GL Not Reconciled; **Create journal** tersedia |
| POV B (baru) | Anchor = 1 journal detail GL; multi-select = bank statements Not Reconciled; **tanpa** Create journal |
| Change anchor | Picker Not Reconciled (Search + Amount); baris aktif = Current; clear centangan; Match disabled ulang |
| Difference bar | `anchor − selected = difference`; hanya angka selisih berwarna; Match disabled jika ≠ 0 |
| Footer | Cancel · Create journal (POV A) · Match |

#### Contoh case (mockup)

Bank Receive **3.000.000**; pilih GL **2.850.000** → Difference **150.000** (Match disabled). User **Create journal** menutup 150.000 → Save & Approve → GL baru auto-checked → Difference **0** → user klik **Match**.

#### Quick journal (modal di atas slideover)

| Field | Rule |
|-------|------|
| Trx code | Auto, disabled |
| Transaction date | Default = tanggal bank statement; wajib fiscal aktif + dalam period CBR + max backdate 6 bulan |
| Currency | Locked dari cash/bank CBR |
| Cash/bank block | COA fixed; Description wajib; Amount = Σ offset (read-only) |
| Offset accounts | Multi-baris; **exclude** COA cash/bank CBR; baris pertama default = sisa selisih; amount > 0 |
| Preview | Debit/Credit read-only; Receive→debit / Spent→credit kas/bank; Swap boleh jika tetap balance |
| Save as draft | Warning: draft **tidak** masuk matching list sampai approve di Journal Transaction |
| Save & Approve | Confirm recap; butuh permission approve journal; sukses → auto-select di list, Match **tidak** auto |

CBR sudah Approved → panel read-only (`can_update`); Create journal & Match tidak tersedia.

---

## 7. Validasi

| # | Kondisi | Behavior AS-IS | Message / gap |
|---|---------|----------------|---------------|
| 1 | Period overlap bank sama | Save ditolak | `The period is overlapping with another reconciliation.` |
| 2 | Code duplicate | Save ditolak | Unique validation |
| 3 | Match amount tidak exact | Ditolak | Lihat §6.2 |
| 4 | Unmatch saat Approved | Tombol tidak ada | — |
| 5 | Approve | Modal generic | Period-lock warning: GAP-CBR-12 |
| 6–10 | Import date/amount | All-or-nothing | Copy AS-IS beda dari draf SoT §7 (GAP-CBR-06) — contoh: `Row N: Both Received and Spent are empty...` |
| 11 | Partial import | Tidak — seluruh import batal | GAP-CBR-07 resolved |
| 12 | Approve tanpa import | Ditolak | `This reconsiliation doesn't have any detail data.` |
| 13 | Single match tanggal beda | Ditolak | `The Bank Statement date must match the Internal Statement transaction date.` (lebih ketat dari SoT) |

---

## 8. Relasi Menu Lain

```mermaid
flowchart TB
    MCB[Master Cash/Bank] --> CBR[Cash Bank Reconcile]
    GL[Journal / GL Detail Approved] --> CBR
    CBR -->|AS-IS Create redirect / TO-BE Quick Journal| CJ[Journal Transaction]
    CBR -.->|TO-BE period lock| GL
```

| Menu | Peran |
|------|-------|
| Master Cash/Bank | Opsi akun |
| Journal / GL Reports | Sumber Internal Transaction; flag Reconciled |
| Journal Transaction | AS-IS: redirect Create dari modal; TO-BE: Quick Journal di panel (+ draft menunggu approve di menu Journal) |

---

## 9. Gap Registry

| ID | Deskripsi | Dampak | Status |
|----|-----------|--------|--------|
| GAP-CBR-01 | Alur Rejected SoT tidak jelas | AS-IS: Rejected masih editable, bisa kembali Draft/Open | Clarified AS-IS |
| GAP-CBR-02 | Format template import | Final: TransactionDate/Received/Spent/Description | Resolved |
| GAP-CBR-03 | Tidak ada Void/recovery setelah Approved jika ada GL tambahan | Risiko operasional; diperparah karena period lock belum ada | Open |
| GAP-CBR-04 | Threshold 5% config | Hardcoded di controller | Open (AS-IS known) |
| GAP-CBR-05 | Kolom Balance di tab GL | Ditunda / out of scope meeting | Open / deferred |
| GAP-CBR-06 | Copy error import SoT vs kode | String di kode berbeda dari draf SoT §7 | Open |
| GAP-CBR-07 | All-or-nothing vs partial import | AS-IS all-or-nothing | Resolved |
| GAP-CBR-08 | **Period lock setelah Approve belum diimplementasi** | Inti SoT §6.6 tidak jalan | Open |
| GAP-CBR-09 | Approve mengizinkan partial (Not Reconciled tersisa) | Difference bisa non-zero saat Approved | Open |
| GAP-CBR-10 | Single Match wajib tanggal sama; Bulk tidak; SoT hanya exact amount | UX/aturan tidak simetris | Open |
| GAP-CBR-11 | Template download `.xlsx` vs file repo `.csv` | Risiko 404 / mismatch template | Open |
| GAP-CBR-12 | Tidak ada Difference header di tab Reconcile Process + tidak ada early warning period lock | UX kurang dari SoT; Difference **di slideover** ditutup ETM-15856 (TO-BE) — header tab + early warning lock tetap open | Partial / Open |
| GAP-CBR-13 | Matching panel: Dialog 1-arah + Create redirect (kehilangan konteks) | UX matching dua sisi + quick journal | **Planned** ETM-15856 (§6.5) |

---

## 10. FAQ

**Q: Sudah Approve tapi masih ada transaksi bank yang belum masuk?**  
A: Tidak ada Void. Saat ini period lock juga belum mengunci GL lain (GAP-CBR-08) — tetap pastikan matching lengkap sebelum Approve (GAP-CBR-03, GAP-CBR-09).

**Q: Suggestion pakai 5% tapi Match gagal?**  
A: Toleransi hanya untuk suggestion. Match final wajib nominal exact (dan single match: tanggal + sisi sama).

**Q: Bisa unmatch?**  
A: Ya selama Draft/Open. Setelah Approved, tidak bisa.

**Q: Approve CBR menerbitkan jurnal?**  
A: Tidak. Hanya mengubah status rekonsiliasi (dan seharusnya mengunci period — belum AS-IS).

**Q: (TO-BE) Setelah Create journal di matching, apakah otomatis Match?**  
A: Tidak. Journal yang di-approve hanya **tercentang otomatis**; user tetap klik **Match** (D1 / ETM-15856).

**Q: (TO-BE) Bisa buat baris bank statement dari panel matching?**  
A: Tidak — import-only; ganti baris lewat **Change bank statement** (D2).

---

## 11. Implementation Matrix (SoT vs Code)

| Item | Status |
|------|--------|
| CRUD + status Draft/Open/Approved/Rejected | Implemented |
| Datalist balances + Difference | Implemented |
| Period overlap antar CBR | Implemented |
| Import Received/Spent template | Implemented (all-or-nothing) |
| Suggestion ±5% + multi-kandidat modal | Implemented (+ opposite-side extra) |
| Exact match + error higher/lower | Implemented |
| Unmatch Draft/Open | Implemented |
| Create Journal dari modal (redirect) | Implemented (AS-IS) |
| Matching **Slideover** + POV A/B + difference bar | **Planned** ETM-15856 |
| Quick Journal in-panel (draft/approve + auto-select) | **Planned** ETM-15856 |
| Anchor picker + clear selection notice | **Planned** ETM-15856 |
| Approve CBR tanpa jurnal | Implemented |
| Period lock setelah Approve | **Not implemented** |
| Early warning period lock | **Not implemented** |
| Wajib full reconcile sebelum Approve | **Not implemented** (commented) |
| Threshold configurable | **Not implemented** |
| Difference strip di tab Reconcile Process | **Not implemented** (slideover TO-BE) |
| Copy “Find or Create New” | **Partial** (See Other……) |
