---
doc_type: requirement
menu: accounting-supplier-invoice
menu_name: "Purchase Invoice"
version: 3.6
last_updated: 2026-07-27
owner: QA - Yemima
status: review
aliases: [PI, purchase invoice, purchase invoice docs, supplier invoice, faktur beli, tagihan supplier]
---

# Purchase Invoice — Requirement Documentation

**Modul:** Finance & Accounting / Account Payable  
**Prefix:** `PI-`  
**Audience:** PM, Finance, QA  
**UI route:** `/accounting/supplier-invoice`  
**SoT:** `purchase-invoice-source-of-truth.md` v3.0 (15 Jul 2026)  
**Rounding SoT:** [../_meta/dpp-vat-rounding-calculation.md](../_meta/dpp-vat-rounding-calculation.md) (**27 Jul 2026** final) — warisan PO + jurnal  
**Field SoT:** `pi_supplier_invoice_amount_field.md` (22 Jul 2026) — Supplier's Invoice Amount (**TO-BE**)

Downstream: [Account Payment](../accounting-supplier-payment/requirement.md)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.2 | 2026-07-11 | QA - Yemima | Compliance qa-docs-standard (baseline; sebagian perilaku tidak akurat — lihat v3.0) |
| 3.0 | 2026-07-15 | QA - Yemima | Rewrite dari SoT v3.0: Void → Pending Items; gap registry PI-01/02/03; currency lock 1 rule; cost/disc auto-select + stuck risk; return Billed + Debit Note; print Resolved per SoT |
| 3.1 | 2026-07-22 | QA - Yemima | DPP/VAT precision: detail & Totals truncate 4dp × qty (`ETM-15313`); AC konsistensi vs panel Totals |
| 3.2 | 2026-07-23 | QA - Yemima | Rounding SoT lengkap; rantai jurnal Inbound Unbilled → PI (Dr Unbilled+VAT / Cr AP); tie ±1 sen |
| 3.3 | 2026-07-23 | QA - Yemima | **TO-BE:** Supplier's Invoice Amount + Invoice Diff → Cash Diff. COA / AP (§5.1b, §5.6b) |
| 3.4 | 2026-07-24 | QA - Yemima | Pilot **Feature Map** + SF Entry (shared + `capabilities/`); index sub-feature untuk Lingo-style cards |
| 3.5 | 2026-07-27 | QA - Yemima | Feature Map dipindah ke layer/tab `feature-map.md`; label UI = Lingo click; auto-highlight lintas layer |
| 3.6 | 2026-07-27 | QA - Yemima | Rounding SoT **final**: GAP-PI-05 Accepted (UI-only); Invoice Total/jurnal exact; export 4dp TO-BE (GAP-PI-07) |

---

## 1. Ringkasan Eksekutif

Purchase Invoice (PI) adalah dokumen pengakuan **Account Payable** ke supplier atas barang yang sudah diterima (Purchase Inbound approved). Value transaksi bersumber utama dari Purchase Order; eligible to invoice hanya barang yang punya inbound approved. PI memicu pengakuan PPN Masukan dan biaya/diskon tambahan dari PO, lalu menjadi dasar pelunasan di Account Payment.

| Kebutuhan bisnis | Jawaban PI |
|------------------|------------|
| No double invoicing | Outstanding qty = inbound − prepared/processed invoice − prepared/processed return |
| Harga & tax dari PO | Line price/tax di-copy dari PO — tidak edit manual DPP |
| Partial invoicing | Bulk/single per SKU; Additional Cost/Disc bisa ditunda (remove baris) |
| Multi-currency | Max 1 foreign currency + local per PI (satu rule untuk SKU & cost/disc) |
| AP recognition | Approve → jurnal Dr Unbilled Goods + Tax + Cost / Cr AP + Disc |
| Selisih vs invoice fisik supplier | **TO-BE:** field **Supplier's Invoice Amount** → Invoice Diff → Cash Diff. COA + AP (§5.1b) |

### 1.1 Rantai proses

```mermaid
flowchart LR
    PO[Purchase Order] --> INB[Purchase Inbound Approved]
    INB --> PI[Purchase Invoice]
    PI --> PAY[Account Payment]
    PI --> RET[Purchase Return Billed]
    RET --> DN[Debit Note]
```

---

## 2. Prasyarat

| Prasyarat | Sumber | Catatan |
|-----------|--------|---------|
| Purchase Order approved | Menu Purchase Order | SKU, harga, tax, Additional Cost/Disc |
| Purchase Inbound approved | Menu Purchase Inbound | SKU eligible hanya dari inbound approved |
| Supplier | Master General Company | Dropdown filter: supplier yang punya referensi inbound **status apapun** (termasuk draft) — lihat GAP-PI-03 |
| Product COA (Unbilled Goods, Tax, AP) | Product COA Group / Company | Wajib sebelum approve |

---

## 3. Siklus Status

```mermaid
stateDiagram-v2
    [*] --> draft: Create auto/manual
    draft --> open: User pilih Open
    open --> approved: Approve
    open --> rejected: Reject
    rejected --> draft: User edit lalu Save
    approved --> [*]
```

| Status | Kondisi | Editable? | Tombol |
|--------|---------|-----------|--------|
| **Draft** | Default create; juga hasil Rejected setelah edit+Save | Ya | Save & Next / Save All, Delete |
| **Open** | User pilih manual — syarat Approve | Ya | Save All, Approve, Reject, Delete |
| **Rejected** | Approver Reject saat Open | Ya — setelah edit+Save → Draft | Save All, Delete |
| **Approved** | Approve; jurnal terbit | Tidak | Print, Show only |

**Tidak ada** status Void, Processed, atau Closed pada implementasi yang dipakai user. Siklus berhenti di Approved. Lihat §9.1 Pending Items.

**Feature Map (sub-feature / Lingo):** lihat tab **Feature Map** — [feature-map.md](./feature-map.md). Tidak diulang di requirement agar end-user mengakses indeks fitur dari layer yang tepat.

---

## 4. Datalist (kolom & action)

| Kolom | Default visible | Sumber | Keterangan |
|-------|-----------------|--------|------------|
| Trx Code \| Trx Date | Ya | Header | Prefix `PI-` |
| Due Date | Ya | Header | Manual |
| Supplier | Ya | Header | — |
| Supplier's Ref | Ya | Header | Referensi faktur/dokumen supplier |
| Desc | Ya | Header | — |
| Trx Ref | Ya | Detail agregat | Nomor inbound; multi dipisah koma; clickable ke show inbound |
| Curr / Exchange | Ya | Header | — |
| Net Purchase Invoice | Ya | §5.4 Totals · SF-TOT-01 | — |
| Trx Status | Ya | Header | Draft / Open / Rejected / Approved |
| Created by \| at | Ya | Audit | — |
| Action | Ya | — | Edit/Show, Approve/Reject, Delete |

**Action rules (SF-DL-06):** Edit selama unapproved; Show saja jika Approved. Approve/Reject hanya Open. Delete hanya unapproved.

**Create UX / auto-save (SF-HDR-01):** Transaction Date = now; Currency = primary; Exchange Rate = 1 (disabled jika primary). Supplier auto-fill dari PI terakhir user — jika user belum pernah punya PI, autosave gagal dan wajib isi field wajib manual dulu.

---

## 5. Form & Field

### 5.1 Basic Information

| Field | Wajib? | Default | Sumber | Validasi |
|-------|--------|---------|--------|----------|
| Transaction Code | Ya | Auto `PI-` | System | Unique per company |
| Transaction Date | Ya | Now | — | — |
| Due Date | Tidak | Null | — | Manual — belum auto dari TOP supplier (§9.1) |
| Currency | Ya | Primary | Master Currency | — |
| Exchange Rate | Ya | 1 | — | Disabled jika primary; editable jika foreign |
| Supplier | Ya | — | Supplier dengan referensi inbound (status apapun) | Quirk GAP-PI-03 |
| Supplier's Reference | Tidak | Null | — | Label UI = Supplier's Reference |
| **Supplier's Invoice Amount** | Tidak | Null | Input user | **TO-BE** — lihat §5.1b |
| Description | Tidak | Null | — | — |
| Term and Condition | Tidak | Null | — | — |
| Attachment | Tidak | — | — | Upload dokumen pendukung |

Header **locked** jika sudah ada detail item.

### 5.1b Supplier's Invoice Amount (**TO-BE** — belum implementasi)

**Tujuan:** input total **tagihan fisik** dari supplier sebagai pembanding Net Purchase Invoice sistem (sering selisih desimal/koma).

| Item | Spesifikasi |
|------|-------------|
| Label UI | **Supplier's Invoice Amount** (pola *Supplier's Reference*) |
| API / DB | `supplier_invoice_amount` — `decimal` **nullable** |
| Section | Basic Information (Create / Edit) |
| Wajib | **Tidak** |
| Currency | Sama dengan currency header PI |
| Precision | 2 desimal (uang) |
| Helper text | *Optional. Total on the supplier’s physical invoice. If empty, the system uses Net Purchase Invoice (no cash-diff comparison).* |
| Placeholder | e.g. `38.000.000` |

**Perilaku:**

| Kondisi | Perilaku |
|---------|----------|
| Field **NULL / kosong** | Tidak ada pembanding. Hutang & jurnal = Net Purchase Invoice sistem. Tidak post Cash Diff dari field ini. |
| Field **diisi** | Hitung **Invoice Diff** (read-only) = `supplier_invoice_amount − Net Purchase Invoice` |
| Diff = 0 | Tidak post baris Cash Diff |
| Diff **> 0** (tagihan fisik lebih besar) | Saat **approve**: **Dr Cash Diff. COA** = diff · **Cr Account Payable** = diff (tambahan utang). Cash Diff. COA dari Internal Company (`cash_difference_coa_id`) |
| Diff **< 0** (tagihan fisik lebih kecil) | **Open** — tolak / izinkan dengan jurnal terbalik? → **P-PI-SIA-01** |

**Contoh:** Net sistem `37.999.999,96` · Supplier's Invoice Amount `38.000.000` → Invoice Diff `0,04` → Dr Cash Diff `0,04` / Cr AP `0,04`.

**Payment:** pelunasan **tidak** menerima input desimal → user memakai **Allocate Full Amount** agar sisa sen ikut ter-clear (Cash Diff payment path yang sudah ada tetap relevan).

**Bukan Exchange Diff:** field ini untuk selisih **nominal invoice**, bukan selisih **kurs**.

**Prasyarat approve (jika field diisi & diff ≠ 0):** Cash Diff. COA terisi di Internal Company — jika kosong → error konfigurasi.

### 5.2 Detail — Inbound Transaction

Modal menampilkan SKU dari PO yang inbound-nya sudah approved.

**Aksi insert:**
- **Single Use** — modal qty (default = outstanding, editable, tidak boleh melebihi outstanding)
- **Bulk Use** — multi-select; qty default = seluruh outstanding per baris
- Outstanding 0 tapi masih ada Prepared → Action teks **"Already Prepared"**; baris hilang dari modal setelah full Processed

**Outstanding qty (base unit):**

```
Outstanding = Inbound Qty
  − (Invoice Prepared + Invoice Processed)
  − (Return Prepared + Return Processed)
```

Tampilan mengikuti primary unit; validasi selalu di base unit.

**Grid setelah insert:** Inbound Code, Name, PO Code|Date, SKU|Name, Qty, Unit, Unit Price, Discount, DPP, VAT, PO Total, Invoice Total, Exchange Gain, Action (delete).

### 5.3 Additional Cost & Discount

| Field | Wajib? | Default | Catatan |
|-------|--------|---------|---------|
| Select Cost/Disc | Ya | — | Master active ATAU Other Cost/Disc di PO (tampil nomor PO) |
| Nominal | Ya | Dari master/PO | **Disabled** jika sumber PO |
| Description | Tidak | — | — |
| COA | Ya | Master/PO | Editable selama unapproved; opsi active + bukan parent, tanpa batasan class |

**Auto-select dari PO:** begitu SKU dari suatu PO di-insert, **seluruh** Other Cost/Discount PO tersebut otomatis masuk. User remove baris yang tidak ditagih sekarang (partial per baris cost). Risiko stuck: GAP-PI-02.

**Exchange Diff** muncul jika cost/disc dari PO dan currency PO beda dari PI.

### 5.4 Totals

| Baris | Sumber |
|-------|--------|
| Total Products | Σ harga produk (backend / Path B helpers) |
| Disc Products | Σ discount baris |
| Total DPP (tooltip) | Mengikuti akumulasi backend (presisi 4dp) — **bukan** wajib = jumlah manual kolom DPP UI 2dp |
| Total VAT | Mengikuti akumulasi backend (presisi 4dp) |
| Total Additional Cost / Disc | Σ header cost / disc |
| **Net Purchase Invoice / Invoice Total** | Mengikuti **backend exact** (4dp accumulate) — sumber kebenaran hutang & jurnal |
| **Invoice Diff** (TO-BE) | Read-only: `supplier_invoice_amount − Net` jika field diisi; else kosong / 0 |
| Net (IDR) | Net × Exchange Rate header |

**Grid DPP/VAT per baris (UI):** breakdown dibulatkan **2dp** per kolom (display only) — pola Path B / `truncateAndRound`, **bukan** Path A float penuh (pre-ETM-15313).

**AC — kebenaran total (SoT final 27 Jul 2026):**

- **Net / Invoice Total / kredit AP jurnal** = backend exact. **Tidak** boleh menyimpang karena rounding tie UI.
- Σ manual kolom DPP+VAT UI 2dp boleh **+0,01** vs Total baris — **known behavior** (GAP-PI-05 Accepted), selaras [PO §9.2](../supplychain-purchase-order/requirement.md#92-rounding-tie--selisih-tampilan-ui-saja-final--accepted).
- Path A vs Path B (~0,03 detail ≠ tippy) tetap defect (GAP-PI-04 Resolved display).
- Export DPP/VAT **4dp** — GAP-PI-07 TO-BE.

**Warisan dari PO:** PI **tidak menghitung ulang** DPP/VAT dari harga mentah kecuali fallback saat harga PO kosong — lihat [PO §9](../supplychain-purchase-order/requirement.md#91-variable--presisi-sot-27-jul-2026).

Jika baris pajak `coefficient = true`, DPP yang diakumulasi ke Total Products memakai DPP coefficient (lebih kecil) agar total akhir sesuai tarif efektif (mis. 12% dikenakan sebagai 11%).

### 5.5 Approval & Audit

Approval Log: siapa/kapan approve. Audit Log: seluruh perubahan data PI.

### 5.6 Penjurnalan PI & relasi Inbound (AS-IS)

Alur nilai:

```mermaid
flowchart LR
  PO[PO: DPP/VAT unit 4dp; Total exact] --> GRN[Inbound approve]
  GRN -->|"Dr Inventory/Assets/OpEx<br/>Cr Unbilled Goods<br/>= price before VAT × qty"| UB[(Unbilled)]
  GRN --> PI[PI approve]
  PI -->|"Dr Unbilled Goods<br/>Dr VAT COA<br/>Cr Account Payable<br/>(angka backend exact)"| GL[Journal PI]
```

| Tahap | Debit | Credit | Basis amount |
|-------|-------|--------|--------------|
| **Inbound approve** | Inventory / Assets / Op. Expense (by product type) | **Unbilled Goods** | `each_price_before_vat` (dari PO) × qty base — **tanpa VAT** |
| **PI approve** | **Unbilled Goods** (clear) | — | `invoice_qty_base × invoice_each_price_after_discount_before_vat` (+ kurs) |
| **PI approve** | **Tax / VAT COA** (dari tax PO) | — | Prorate `vat_amount` PO × (invoice qty / PO qty) × kurs |
| **PI approve** | Other Cost COA (jika ada) | Other Disc COA (jika ada) | Amount baris cost/disc |
| **PI approve** | — | **Account Payable** (supplier) | Balancing credit (net hutang) |

Detail Inbound: [supplychain-new-purchase-inbound § jurnal](../supplychain-new-purchase-inbound/requirement.md).  
Implementasi: `JournalProcess::supplierInvoiceAutoJournal` — lihat [technical](./technical.md).

**Catatan:** Debit Unbilled di PI mengikuti **harga sebelum VAT**. Debit VAT / kredit AP mengikuti akumulasi **backend** (exact) — **bukan** hasil jumlah manual breakdown UI 2dp. Selisih 1 sen di layar (Σ DPP+VAT UI) **tidak** masuk jurnal. Field §5.1b (**Supplier's Invoice Amount**) untuk selisih invoice **fisik** vs Net sistem — beda kasus dari known behavior UI.
### 5.6b Jurnal Invoice Diff / Cash Diff (**TO-BE**)

Hanya jika `supplier_invoice_amount` terisi dan diff ≠ 0. Kasus **diff > 0** (fase 1):

| Debit | Credit | Amount |
|-------|--------|--------|
| **Cash Diff. COA** (Internal Company `cash_difference_coa_id`) | **Account Payable** (supplier) | Invoice Diff |

Ditambahkan ke jurnal approve PI **di samping** entry Unbilled / VAT / OC / OD standar (§5.6). Total kredit AP = net sistem + diff.

Kasus **diff < 0:** lihat **P-PI-SIA-01** (belum dikunci).

---

## 6. How It Works

### 6.1 SF-PI-01 Partial invoicing per SKU

Eligible qty = qty inbound approved, dikurangi yang sudah/sedang ditagih dan retur. Qty di PI draft = **Prepared**; setelah approve → **Processed**. Sisa outstanding untuk PI berikutnya turun sesuai qty yang sudah diproses.

Card + contoh: [capabilities/sf-pi-01](./capabilities/sf-pi-01-partial-invoicing.md).

### 6.2 SF-PI-02 Multi-unit

Validasi selalu di base unit. Contoh: 1 Box = 10 Pieces; invoice 2 Box → prepared 20 pieces.

### 6.3 SF-PI-03 Currency lock — satu rule, dua mode

Berlaku untuk SKU detail **dan** Additional Cost/Disc: **tidak boleh 2 foreign currency berbeda dalam 1 PI**; local selalu boleh.

| Header PI | Mekanisme |
|-----------|-----------|
| Local (IDR) | Boleh local bebas. Foreign pertama (mis. USD) masuk → foreign lain (EUR) ditolak; selanjutnya hanya IDR atau USD |
| Foreign (USD) | Lock dari awal: hanya local atau currency sama dengan header |

### 6.4 SF-COST-01 Additional Cost/Disc partial & auto-select

Insert SKU PO → semua baris cost/disc PO ikut ter-select. User remove yang ditunda. Trigger opsi lagi di PI berikutnya membutuhkan outstanding SKU dari PO/supplier yang sama — lihat GAP-PI-02.

### 6.5 SF-PI-04 Jurnal saat Approve

Dr Unbilled Goods (balik kredit inbound) + Dr Tax (jika ada, COA dari setting tax PO) + Dr Additional Cost (COA baris) — Cr Additional Discount (COA baris) + Cr Account Payable.

Contoh: Products 8.738,74 + VAT 961,26 + Cost 144,50 − Disc 86,00 = Net **9.758,50** (× kurs → local). Lihat juga [SF-TOT-01](./capabilities/sf-tot-01-net-purchase-invoice.md).

### 6.6 SF-PI-05 Exchange Gain/Loss

Selisih = PO Total (local) − Invoice Total (local). Minus = laba (Cr Exchange Gain); plus = rugi (Dr). Berlaku baris detail dan cost/disc dari PO currency beda.

### 6.7 SF-PI-06 Return setelah PI Approved

Pakai Purchase Return tipe **Billed** (bukan Unbilled). Tidak potong AP langsung; menerbitkan **Debit Note** untuk potong tagihan berikutnya di Account Payment.

---

## 7. Validasi

| # | Kondisi | Behavior |
|---|---------|----------|
| 1 | Edit Basic Info setelah ada detail | Ditolak — header locked |
| 2 | Insert SKU/cost/disc foreign currency kedua yang beda | Ditolak (§6.3) |
| 3 | Qty to Invoice melewati Outstanding | Ditolak |
| 4 | Qty inbound full processed di Invoice | Return Unbilled tidak bisa atas SKU inbound ini |
| 5 | Qty inbound full processed di Return Unbilled | SKU tidak bisa lagi di PI |
| 6 | Approve tanpa ≥1 detail, atau Product COA kosong | Approve gagal |
| 7 | Amount cost/disc sumber PO | Non-editable — tidak bisa over-bill secara struktural |

---

## 8. Relasi Menu Lain

```mermaid
flowchart TB
    PO[Purchase Order] --> INB[Purchase Inbound]
    INB --> PI[Purchase Invoice]
    PI --> PAY[Account Payment]
    PI --> RETB[Purchase Return - Billed]
    RETB --> DN[Debit Note]
    DN --> PAY
    INB --> RETU[Purchase Return - Unbilled]
```

| Menu | Peran |
|------|-------|
| [Purchase Order](../supplychain-purchase-order/requirement.md) | Sumber SKU, harga, tax, cost/disc |
| [Purchase Inbound](../supplychain-new-purchase-inbound/requirement.md) | Eligible SKU; bridge prepared/processed qty |
| [Account Payment](../accounting-supplier-payment/requirement.md) | Pelunasan; PI approved → outstanding |
| Purchase Return Billed | Retur setelah PI; hasilkan Debit Note |
| Purchase Return Unbilled | Mutually exclusive dengan qty full invoiced |
| [Master Other Cost](../omni-other-cost/requirement.md) / [Other Discount](../omni-other-discount/requirement.md) | Label + default COA |
| [Chart of Account](../accounting-chart-of-account/) | Opsi COA override |

---

## 9. Gap Registry

| ID | Deskripsi | Dampak | Status |
|----|-----------|--------|--------|
| GAP-PI-01 | Print PI dulu memuat template PO, bukan PI | Operator tidak bisa cetak dokumen resmi | **Resolved** (per SoT) — `[VERIFY: CODEBASE]` method print masih type-hint PurchaseOrder |
| GAP-PI-02 | Additional Cost/Disc dari PO bisa permanen tidak bisa ditagih jika SKU sumber sudah full invoiced/return sebelum semua baris cost dipilih — trigger opsi terikat outstanding SKU PO yang sama | Sebagian nilai Other Cost/Disc PO "hilang" operasional | **Open** — dikomunikasikan ke end user; verifikasi mekanisme detail `[VERIFY: CODEBASE]` |
| GAP-PI-03 | Filter Supplier header (inbound status apapun) ≠ filter SKU eligibility (harus approved) — modal kosong jika supplier hanya punya inbound draft | Membingungkan operator baru | **Resolved (Accepted)** — konfirmasi lead tech, tidak diperbaiki |
| GAP-PI-04 | (Historis) DPP detail = `qty × each_dpp` float vs Totals = `each_dpp_after_discount` 4dp × qty → selisih ~0,03 | Detail ≠ section Totals | **Resolved display** (ETM-15313) — pastikan data lama / layar outstanding tidak masih Path A |
| GAP-PI-05 | Σ manual DPP+VAT UI 2dp vs Invoice Total — UI round independen → +0,01 pada tie (warisan PO) | Persepsi visual; hutang/jurnal tidak kena | **Accepted — known behavior** (27 Jul 2026); selaras GAP-PO-09 |
| GAP-PI-06 | Field Supplier's Invoice Amount + post Cash Diff / AP | Operator bandingkan invoice fisik vs net sistem | **TO-BE** — §5.1b / §5.6b; implementasi belum ada |
| GAP-PI-07 | Export DPP/VAT pakai 4 desimal (masih 2dp seperti UI) | Audit/rekonsiliasi kurang presisi | **TO-BE** — selaras GAP-PO-10; UI tetap 2dp |

### 9.1 Pending Items — belum matang

Bukan gap teknis fitur existing; user **tidak** bisa memakai fitur ini.

| Item | Status |
|------|--------|
| **Void** | Belum matang (requirement + codebase). Siklus berhenti di Approved — tidak ada jalur void yang bisa dipakai user. Kode sisa (`can_void`, dialog) **deprecated** sebagai dokumentasi perilaku. |
| **Due Date otomatis dari TOP supplier** | Belum — Due Date murni manual |
| **Status Processed / Closed** | Ideal untuk konsistensi modul & relasi Payment; saat ini belum ada |
| **Supplier's Invoice Amount** | TO-BE §5.1b — label dikunci; diff kurang dari Net masih **P-PI-SIA-01** |

### 9.2 Pending — keputusan Supplier's Invoice Amount

| ID | Severity | Owner | Pertanyaan | Default sementara di docs |
|----|----------|-------|------------|---------------------------|
| **P-PI-SIA-01** | Medium | Finance + PM | Jika `supplier_invoice_amount` kurang dari Net sistem: tolak simpan, atau izinkan dengan jurnal terbalik (Dr AP / Cr Cash Diff)? | Fase 1: support **diff ≥ 0**; tolak jika lebih kecil |
| **P-PI-SIA-02** | Low | Dev | Kapan recalc Invoice Diff: on change field / on save / only at approve? | Recalc live di form + final di approve |
| **P-PI-SIA-03** | Medium | Dev + QA | Kolom DB + migrasi + FormRequest + wire FE Basic Information | Belum |

---

## 10. FAQ

**Q: Kenapa supplier tidak muncul di dropdown create?**  
A: Hanya muncul jika punya referensi Purchase Inbound (status apapun, termasuk draft).

**Q: Supplier terpilih tapi modal Inbound Transaction kosong?**  
A: Dropdown boleh draft; SKU baru muncul jika inbound **Approved**. Perilaku accepted (GAP-PI-03), bukan bug.

**Q: Kenapa tidak bisa 2 mata uang asing berbeda dalam 1 PI?**  
A: Aturan sistem — max 1 foreign + local, agar selisih kurs tidak kacau.

**Q: Sebagian Other Cost PO tidak muncul lagi di PI berikutnya?**  
A: Kemungkinan SKU PO sudah full invoice/return. Lihat GAP-PI-02.

**Q: Bisa void PI yang sudah approved?**  
A: Belum. Fitur belum tersedia. Approve keliru → koordinasi manual.

**Q: PPN dijurnal kapan?**  
A: Saat Approve PI, bukan saat inbound.

**Q: Retur setelah PI approved?**  
A: Purchase Return tipe **Billed** → Debit Note → potong tagihan berikutnya (bukan potong AP langsung).

**Q: Total Products lebih kecil dari hitungan manual?**  
A: Jika pajak coefficient true, DPP terakumulasi versi coefficient (lebih kecil) agar total sesuai aturan PPN.

**Q: Total baris beda 0,01 dari Unit×Qty?**  
A: Jika yang beda adalah **jumlah manual DPP+VAT di layar** vs Total/Net → **known behavior UI** (GAP-PI-05 / [PO §9.2](../supplychain-purchase-order/requirement.md#92-rounding-tie--selisih-tampilan-ui-saja-final--accepted)). Jika **Invoice Total / Net** sendiri ≠ harga×qty → escalate (bug). Jurnal mengikuti Net backend.

**Q: Bagaimana mencatat total invoice fisik supplier yang beda sen dengan net sistem?**  
A: **TO-BE** — isi **Supplier's Invoice Amount** di Basic Information (§5.1b). Selisih (Invoice Diff) masuk jurnal Cash Diff. COA + tambahan AP saat approve. Jika field kosong, tidak ada pembanding.

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Capability cards (pilot) | [capabilities/](./capabilities/) |
| Shared capabilities | [../_meta/shared-capabilities/](../_meta/shared-capabilities/) |
| Account Payment | [../accounting-supplier-payment/requirement.md](../accounting-supplier-payment/requirement.md) |
| Purchase Inbound | [../supplychain-new-purchase-inbound/requirement.md](../supplychain-new-purchase-inbound/requirement.md) |
