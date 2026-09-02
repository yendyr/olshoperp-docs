---
doc_type: gemini-generation-brief
target_menu: "General Ledger Report"
menu_slug: general-ledger
source_of_truth: docs/qa-docs/general-ledger/ (repo olshoperp — dibaca 2026-09-01)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "General Ledger Report" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v1.1 · requirement review v1.1 · technical review v1.1 ·
  user-guide review v1.0 · feature-map review v1.0 · 3 Lingo cards detailed ·
  ~900 baris total · hybrid AS-IS + TO-BE (group header, running export, Passiva).
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "General Ledger Report"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Laporan read-only — bukan transaksi.** Tidak ada create/edit/approve di menu GL. Data = baris journal detail yang journal header-nya **Approved**. **Jangan** paksakan siklus status dokumen report — cukup jelaskan prasyarat Approved.

2. **Grouping per COA (Chart of Account).** Baris digroup per akun; header group AS-IS hanya **kode | nama COA** — belum ada total debit/credit/ending (TO-BE). Ini beda dari Purchase Report (group supplier) atau P&L (group class).

3. **Opening/Ending Balance AS-IS = level COA, bukan running per baris.** Semua baris dalam satu COA menampilkan **saldo akhir COA yang sama** — bukan saldo kumulatif per transaksi. Ini poin paling membingungkan user + beda dari TO-BE export. Butuh section khusus + contoh angka + Warning.

4. **Posisi COA Class (Activa vs Passiva)** mempengaruhi formula saldo — tapi AS-IS **tidak konsisten** (Passiva adjustment hanya parsial di export ending & perhitungan hidden). TO-BE wajib position-aware di semua output. Jelaskan 7 class + mapping Activa/Passiva.

5. **Kolom Store (shipped)** — dari **header journal** pivot, bukan langsung dari Invoice/Payment. Gap dev: AR Receive, Credit Note, Debit Note belum selalu tulis pivot → Store `-`. Section Store wajib + cross-ref settlement.

6. **Current Profit/Loss COA** — query UNION khusus agar mutasi laba rugi berjalan tampil di COA tersebut. Edge case terpisah dari COA biasa.

7. **Banyak TO-BE terdokumentasi** — group header totals, running ending balance di export, konsistensi Passiva. Tandai **konsisten** di setiap section terkait — jangan hanya sekali di keterbatasan.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber satu-satunya = PART 2**.

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN (General Ledger, Chart of Account, Opening Balance, Ending Balance, Activa, Passiva, Approved, Export All).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class / kolom DB / ID internal gap di body (GAP-xx, §9, ETM-xxxxx).
- Boleh sebut ID Lingo navigasi: SF-GL-01..03, SF-DL-xx (shared datalist).

## 1.3 Struktur dokumen WAJIB (22 section)

1. Judul & Ringkasan Singkat (read-only; per COA; Approved only)
2. Istilah Kunci (COA, Opening/Ending, Activa/Passiva, pivot store, Current P/L, dll.)
3. Kapan & Kenapa Dipakai
4. Prasyarat
5. Posisi dalam Alur Bisnis (`flowchart LR` — transaksi → Journal Approved → GL)
6. Lokasi Menu + placeholder screenshot
7. **Bukan siklus status report** — read-only; hanya journal Approved masuk
8. Grouping per COA — AS-IS (code | name) vs TO-BE (total debit/credit/ending)
9. Referensi Kolom Grid (Trx Date, Code, Store, Ref, Debit/Credit, Foreign)
10. Kolom Store — sumber header journal (SF-GL-01)
11. Filter Periode, COA & Store (SF-GL-02)
12. Opening & Ending Balance — AS-IS (COA-level, bukan running) + contoh angka
13. Activa vs Passiva — 7 COA class & formula saldo
14. Debit/Credit vs Foreign Currency
15. Current Profit/Loss COA (UNION khusus)
16. Export Excel async (SF-GL-03) — kolom + Opening/Ending export
17. **Fitur TO-BE** — group header totals, running export, Passiva konsisten
18. Aturan Bisnis & Validasi
19. Keterbatasan & Gap (store pivot AR/CN/DN, Passiva partial, TO-BE pending)
20. Hubungan Menu Lain (`flowchart TB`) — Journal, Trial Balance, Settlement, dll.
21. Troubleshooting
22. FAQ + Lihat Juga

## 1.4 Mermaid

- **Wajib:** §5 `flowchart LR`; §20 `flowchart TB`.
- **Jangan** `stateDiagram-v2` untuk siklus transaksi report.
- Boleh `flowchart TD` alur operator (buka → filter → baca group → export).
- Label berkoma/spasi → kutip; `classDef` hex only; tiap diagram + fallback teks.

## 1.5 Placeholder gambar (min 5)

1. Sidebar Accounting → Report → General Ledger
2. Grid dengan row group header COA
3. Kolom STORE + tooltip multi-store
4. Advanced Filter (Trx Date + Store)
5. Export All + tab Export File

## 1.6 Checklist penutup

- [ ] 22 section; tidak ada stateDiagram transaksi
- [ ] Opening/Ending **bukan running** di UI AS-IS — contoh angka jelas
- [ ] Activa/Passiva + 7 class + inkonsistensi AS-IS
- [ ] Store dari header journal; gap AR/CN/DN netral
- [ ] TO-BE ditandai konsisten (group header, running export)
- [ ] Current P/L UNION disebut
- [ ] Bukan Trial Balance; hanya Approved
- [ ] FAQ: transaksi tidak muncul?, Store `-`?, settlement Reject?

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> **General Ledger Report** · Modul Accounting → Report · Route `/accounting/general-ledger`
> Read-only · Group per COA · Hanya journal **Approved**

## §A. Ringkasan

Laporan **buku besar** — menampilkan baris transaksi jurnal per **Chart of Account (COA)** dalam periode terpilih. Data dari **journal detail** yang journal header-nya berstatus **Approved**.

Baris digroup per COA. Kolom **Store** menampilkan store dari **header journal** (bukan langsung dari invoice/payment).

**Gap utama AS-IS:**
- Group header COA = kode | nama saja — **tanpa** total debit/credit/ending
- Opening/Ending Balance di UI = **sama di setiap baris** dalam satu COA (bukan running per transaksi)
- Formula Passiva **tidak konsisten** di semua output
- Export: Opening/Ending COA-level (bukan running) — TO-BE akan ubah export ke running

## §B. Kapan & Kenapa

| Pakai jika | Jangan jika |
|------------|-------------|
| Audit mutasi debit/kredit per akun | Butuh agregasi ringkas per COA saja (pakai Trial Balance) |
| Trace transaksi ke journal sumber | Butuh edit journal (pakai menu Journal) |
| Filter per store via header journal | Expect store langsung dari invoice tanpa pivot journal |
| Export detail baris jurnal | Butuh laporan non-journal (mis. AP aging) |

## §C. Prasyarat

- Privilege view menu General Ledger
- Journal terkait sudah **Approved**
- Company scope — hanya data company login
- Soft-deleted journal tidak tampil
- (Opsional) Pahami rentang tanggal & COA untuk filter

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **COA** | Chart of Account — akun buku besar |
| **Opening Balance (Beginning)** | Saldo sebelum tanggal awal periode — semua transaksi Approved **sebelum** start date |
| **Ending Balance** | Opening + mutasi dalam periode (start–end) |
| **Activa / Passiva** | Posisi COA class — mempengaruhi formula saldo |
| **Running balance** | Saldo kumulatif per baris transaksi — **TO-BE export**, bukan AS-IS UI |
| **Primary currency** | Kolom Debit/Credit selalu mata uang utama |
| **Foreign** | Nilai mata uang asing journal (jika foreign currency) |
| **Current Profit/Loss** | COA khusus — mutasi laba rugi berjalan via UNION query |
| **Pivot store** | Relasi header journal ↔ store (`journal store pivot`) — sumber kolom Store GL |
| **Row group** | Pengelompokan baris per COA di grid |

## §E. Filter AS-IS

| Filter | Default | Catatan |
|--------|---------|---------|
| **Trx. Date (periode)** | **Bulan berjalan** | Advanced Filter SearchBuilder |
| **COA** | Opsional | Filter satu/beberapa akun |
| **Store** | Opsional | Global search + Advanced Filter kolom Store |
| **Company** | Otomatis | Token company login |

Filter tanggal diterapkan via **SearchBuilder** di request API — bukan hardcoded di query utama.

Hanya journal **`Approved`** yang masuk.

## §F. Kolom Grid (AS-IS)

| Kolom | Arti |
|-------|------|
| **TRX. DATE** | Tanggal transaksi journal |
| **TRX. CODE** | Nomor journal — hyperlink ke edit Journal |
| **STORE** | Nama store dari **header journal** pivot; `-` jika kosong; multi-store: teks dipotong + tooltip |
| **JOURNAL TYPE** | Asal journal (manual, sales invoice, payment, dll.) — often hidden |
| **TRX. REF.** | Nomor dokumen sumber (invoice, payment, stock mutation) |
| **DESCRIPTION** | Keterangan baris journal detail |
| **FOREIGN** | Nilai foreign currency (jika ada) |
| **DEBIT / CREDIT** | Nilai **primary currency** — sudah dikonversi saat simpan jika journal foreign |

Urutan visible: TRX. DATE → TRX. CODE → **STORE** → TRX. REF. → DESCRIPTION → FOREIGN → DEBIT → CREDIT

**Export-only (tidak di UI table):** Currency, Foreign numeric, Debit/Credit numeric, Opening Balance, Ending Balance

## §G. Grouping per COA (AS-IS)

- Mekanisme: DataTables RowGroup per COA
- Header group: **`{coa_code} | {coa_name}`** (bold) saja
- **Tidak ada** total debit/credit/ending di header (TO-BE akan tambah)
- Backend menghitung beginning/ending untuk group title tapi **tidak dirender** ke HTML

## §H. Opening & Ending Balance (AS-IS) — PENTING

**Semua perhitungan saldo pakai primary currency** (debit/credit, bukan foreign).

| Konsep | Definisi |
|--------|----------|
| **Opening** | SUM(debit) − SUM(credit) journal Approved, transaksi **sebelum** start date, per COA |
| **Mutasi periode** | SUM dalam rentang start–end |
| **Ending** | Opening + mutasi periode |

**AS-IS UI & export (kecuali partial Passiva di export ending):**
- Opening & Ending **sama di setiap baris** dalam satu COA — **bukan running per transaksi**

**Contoh Activa, opening = 0, Jan 2026:**

| Row | Debit | Credit | Ending (AS-IS — semua baris sama) |
|-----|-------|--------|-----------------------------------|
| Trx 1 | 100.000 | 0 | **115.000** (total COA) |
| Trx 2 | 0 | 30.000 | **115.000** (total COA) |
| Trx 3 | 45.000 | 0 | **115.000** (total COA) |

Bukan 100.000 → 70.000 → 115.000 running per baris.

**TO-BE export:** Ending Balance per baris = **running balance** kumulatif position-aware.

## §I. Activa vs Passiva — 7 COA Class

| # | Class | Position |
|---|-------|----------|
| 1 | Assets (AST) | **Activa** |
| 2 | Liabilities (LBL) | **Passiva** |
| 3 | Equity (EQ) | **Passiva** |
| 4 | Revenue (INC) | **Passiva** |
| 5 | Expense (EXP) | **Activa** |
| 6 | Cost of Goods Sold (COGS) | **Activa** |
| 7 | Other Revenue & Expenses (ORE) | **Passiva** |

**Formula konseptual:**
- **Activa:** balance = debit − credit
- **Passiva:** balance = credit − debit (= (debit − credit) × −1)

**AS-IS:** Passiva adjustment hanya **parsial** (export ending balance & perhitungan hidden coa_title) — **tidak** di kolom UI opening/ending.

**TO-BE:** Position-aware di group header, export opening, export running ending.

## §J. Debit/Credit vs Foreign

Saat journal detail **disimpan:**
- Jika journal **foreign currency:** debit/credit primary = input × exchange rate; foreign column = input asli
- Jika **primary:** debit/credit = input langsung; foreign = 0

**GL report tidak konversi ulang** — pakai nilai persisted.

**Currency code kolom Foreign** tergantung journal type (Supplier Invoice → currency SI; Payment/DN → currency payment; lainnya → currency journal header).

## §K. Kolom Store (ETM-15666 — AS-IS shipped)

**Sumber:** header journal relasi stores via pivot — **bukan** langsung dari transaksi referensi.

| Tampilan | Arti |
|----------|------|
| Nama store | Pivot header journal terisi |
| `-` | Journal tanpa store di header — normal untuk transaksi tanpa konteks store |
| Beberapa nama (koma) | Multi-store per header — hover tooltip daftar lengkap |

**Aturan bisnis:**
- Transaksi referensi **tanpa** store → GL Store = `-` OK
- Transaksi referensi **dengan** store → store **wajus** masuk header journal agar muncul di GL

**Filter Store:**
- Global search match `store_name` pivot
- Advanced Filter kolom Store (contains, equals, is empty, dll.)
- Filter **hanya** baca pivot header — baris tanpa pivot tidak match "contains store name"

**Export:** kolom **Store** = kolom D; nama join koma; `-` jika kosong

### Gap pivot store (AS-IS)

| Sumber journal | Pivot store ke header |
|----------------|----------------------|
| Manual Journal | ✅ multiselect store |
| Customer Invoice (dari SO) | ✅ dari sales order store |
| Settlement SI/OB, Sales Return | ✅ |
| Customer Payment / AR Receive | ⚠️ **Gap** — pivot belum di-insert |
| Credit Note (actor Store) | ⚠️ **Gap** |
| Debit Note (actor Store) | ⚠️ **Gap** |
| Supplier Invoice / Payment (tanpa store transaksional) | `-` sesuai aturan |

**Gejala:** baris journal AR settlement / CN / DN menampilkan Store `-` padahal batch/dokumen punya store.

**SO General vs Platform:** sama untuk pivot SI/OB (dari SO store_id); beda hanya COA receivable.

**Settlement:**
- **Approve** → journal AR terbit (Store AR sering `-` sampai gap diperbaiki)
- **Reject** → **tidak** ada journal AR; journal SI/OB dari upload **tetap** ada di GL

## §L. Current Profit/Loss COA

Jika company punya COA "Current Profit/Loss", query utama di-**UNION** dengan baris dari history laba rugi berjalan — `coa_id` di-replace ke COA Current Profit/Loss agar mutasi tampil di akun tersebut.

TO-BE running balance harus hitung dari baris yang ditampilkan (termasuk union).

## §M. Export Excel (AS-IS)

| Aspek | Detail |
|-------|--------|
| Trigger | Export All — async batch |
| Progress | Tab Export File + export progress |
| Format | Flat list per baris journal detail (COA code/name diulang per baris) |
| Kolom utama | COA Code, COA Name, GL Trx Code, **Store (D)**, Trx Date, Journal Type, Trx Ref, Description, Currency, Foreign, Debit, Credit, Opening Balance, Ending Balance |
| Opening/Ending export | COA-level **sama tiap baris** dalam COA; Ending export Passiva × −1 (partial); Opening export **tanpa** Passiva adjustment |
| Filter | Mengikuti filter aktif saat export |

**TO-BE:** Running ending balance per baris; opening position-aware; group header totals match UI.

## §N. TO-BE Improvements (belum production)

### 1. Group header COA
Tambah di header group: **Total Debit**, **Total Credit**, **Ending Balance** periode — formula position-aware (Activa vs Passiva).

Contoh tampilan TO-BE:
```
1101 | Kas Bank BCA
Total Debit: Rp 145.000 | Total Credit: Rp 30.000 | Ending Balance: Rp 115.000
```

### 2. Export running Ending Balance
Per baris dalam COA (urut tanggal ASC): running balance += debit−credit (Activa) atau += credit−debit (Passiva). Baris terakhir per COA harus = Ending Balance grup UI.

### 3. Konsistensi Passiva
Semua output (UI group, export opening, export ending) position-aware.

## §O. Validasi & perilaku

| Kondisi | Perilaku |
|---------|----------|
| Journal bukan Approved | Tidak tampil di GL |
| Filter tanggal sempit | Hanya baris dalam periode |
| Tanpa privilege | Akses ditolak |
| Company lain | Tidak tampil |
| COA tanpa transaksi di periode | Group tidak muncul (AS-IS) |
| Unapprove journal setelah export | Export async = snapshot saat job jalan |

Tidak ada form create/edit di menu GL.

## §P. Yang Bisa / Tidak Bisa

**Bisa:**
- Lihat baris journal Approved per COA
- Filter periode, COA, Store
- Global search + Advanced Filter
- Columns show/hide
- Export All async + download Export File
- Hyperlink TRX. CODE ke Journal
- Hyperlink TRX. REF. ke dokumen sumber

**Tidak bisa:**
- Create/edit journal dari GL
- Lihat journal non-Approved
- Running balance per baris di UI (AS-IS)
- Total debit/credit di group header (AS-IS — TO-BE)
- Store dari invoice/payment tanpa pivot journal
- Konversi currency ulang di report

## §Q. Menu Terkait

| Menu | Relasi |
|------|--------|
| **Journal** | Sumber data; input store manual di header |
| **Trial Balance** | Agregasi per COA — GL = detail baris |
| **Balance Sheet / P&L** | Report lain dari journal Approved |
| **Customer Invoice** | Auto-journal SI → pivot store ✅ |
| **Customer Payment** | Auto-journal AR — pivot store ⚠️ gap |
| **Credit Note / Debit Note** | Auto-journal — pivot store ⚠️ gap |
| **Instant Settlement Upload** | SI/OB journal ✅; AR saat Approve ⚠️ gap store |
| **Sales Return** | Auto-journal → pivot store ✅ |
| **Cash Bank Reconciliation** | Reuse controller GL dengan flag khusus |

```text
Transaksi → Journal Approved → General Ledger (baris per COA)
Header journal stores pivot → kolom Store GL
```

## §R. Alur operator

1. Buka General Ledger — default periode **bulan berjalan**.
2. Baca baris per group COA (header = kode | nama akun).
3. Klik TRX. CODE → buka journal; TRX. REF. → dokumen sumber.
4. Filter COA / Store / tanggal sesuai kebutuhan.
5. Export All → cek tab Export File untuk download.

**Contoh:** Mutasi Kas store Shopee bulan ini → filter tanggal + Advanced Filter Store contains "Shopee".

## §S. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Transaksi tidak muncul | Journal belum Approved / di luar periode | Cek status journal + filter tanggal |
| Store `-` padahal invoice punya store | Pivot belum di header journal (gap AR/CN/DN) | Cek Journal header; laporkan dev jika seharusnya ada |
| Filter Store tidak ketemu | Pivot kosong | GL hanya baca header journal |
| Saldo "aneh" di COA Passiva | Passiva adjustment partial AS-IS | Bandingkan UI vs export; tunggu TO-BE |
| Ending sama semua baris | AS-IS by design (COA-level) | Bukan bug — lihat §H; TO-BE export running |
| Group header tanpa total | AS-IS | TO-BE improvement |
| Settlement AR Store `-` | Gap pivot AR | SI/OB biasanya terisi — bukan bug filter |

## §T. FAQ

**Q: Dari mana data GL?**  
A: Detail journal Approved, digroup per COA.

**Q: Kenapa transaksi tidak muncul?**  
A: Harus **Approved** + masuk filter periode/company.

**Q: Dari mana kolom Store?**  
A: Store di **header journal** (Basic Information menu Journal), bukan langsung dari invoice/payment.

**Q: Kenapa filter Store tidak menemukan transaksi?**  
A: Pivot header journal kosong — filter GL tidak baca store di menu lain.

**Q: Beda dengan Trial Balance?**  
A: Trial Balance agregasi per COA; GL menampilkan **baris transaksi** detail.

**Q: Opening/Ending kenapa sama di semua baris?**  
A: AS-IS = saldo **level COA**, bukan running per transaksi. TO-BE akan ubah export.

**Q: Settlement Reject — journal hilang?**  
A: Journal AR tidak terbit; journal SI/OB dari upload **tetap** di GL.

**Q: Bisa edit dari GL?**  
A: Tidak — read-only; buka journal via TRX. CODE.

**Q: Multi-store satu journal?**  
A: Ya — nama dipisah koma + tooltip.

**Q: Current Profit/Loss?**  
A: COA khusus — mutasi laba rugi berjalan ditampilkan via mekanisme union.
