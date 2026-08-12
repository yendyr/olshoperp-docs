---
doc_type: gemini-generation-brief
target_menu: "Balance Sheet"
menu_slug: accounting-balance-sheet
source_of_truth: docs/qa-docs/accounting-balance-sheet/ (repo olshoperp — dibaca 2026-08-12)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Balance Sheet" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v1.0 · requirement review v1.0 · technical review v1.0 ·
  user-guide review v1.1 · feature-map review v1.0 · 5 Lingo cards detailed ·
  ~964 baris total · proporsional — section standar dipakai.
  Nol fitur TO-BE; 8 Gap (5 Pending Decision).
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Balance Sheet"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Report read-only, bukan transaksi.** Tidak ada create / edit / delete / approve. Tidak ada siklus status dokumen → **jangan** buat state diagram. Yang ditampilkan = angka agregasi on-read dari journal.
2. **Satu tanggal, bukan rentang.** Filter hanya **As at** + **Apply** — berbeda dari Profit & Loss yang memakai rentang periode. Ini "posisi keuangan pada satu titik waktu".
3. **Dual table layout.** Tabel **kiri = Assets**, **kanan = Liabilities and Equity**. Struktur unik — harus di-visualisasi atau jelaskan posisinya.
4. **Dua path P/L yang bisa beda hasilnya.** Kartu memakai "Ending P/L"; parent Equity memakai "Current P/L" (butuh Fiscal Period Open). Ini **bukan bug** — ini nuansa cut-off yang harus dijelaskan netral sebagai "cara kerja saat ini".
5. **Tidak ada export.** By design. User tidak perlu mencari tombol unduh di menu ini.
6. **Cut-off hari As at beda antar path.** Saldo akun biasa: transaksi **sebelum** hari As at. Current P/L: transaksi **sampai dengan** hari As at. Beda ini perlu section khusus.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber satu-satunya = PART 2** — dilarang mengarang fakta di luar itu.

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN seperlunya (Assets, Liabilities, Equity, Apply, Ending Balance, Current Profit/Loss).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class controller / nama kolom DB / ID internal. Semua sudah di-reframe ke bahasa fungsional di Part 2.
- Boleh sebut ID sub-feature Lingo (SF-BS-01 … 05) karena menu sudah punya feature-map — tampilkan sebagai referensi navigasi, bukan jargon teknis.

## 1.3 Struktur dokumen WAJIB

Buat **satu dokumen** dengan section berikut (nomor urut tetap; hapus section yang tidak relevan **hanya jika** Part 2 benar-benar tidak punya datanya):

1. **Judul & Ringkasan Singkat** — 2–3 kalimat: neraca posisi keuangan pada satu tanggal.
2. **Istilah Kunci** — tabel istilah → definisi awam (paling sedikit: As at, Ending Balance, Current Profit/Loss, Parent akun, Liabilities and Equity).
3. **Kapan & Kenapa Dipakai** — 3–5 poin situasi nyata.
4. **Prasyarat** — apa yang harus sudah ada (COA, journal Approved, privilege, Fiscal Period).
5. **Posisi dalam Alur Bisnis** — `flowchart LR` (Journal Approved → Balance Sheet → kartu + dual table). Ikuti aturan Mermaid §1.4.
6. **Lokasi Menu** — path navigasi + placeholder screenshot.
7. **Langkah-Langkah Penggunaan** — langkah bernomor (buka, pilih As at, Apply, baca kartu, bandingkan tabel).
8. **Membaca Kartu Ringkasan** — penjelasan tiap kartu (Total Assets, Total L&E, sub L/E, Current P/L), rumus awam, contoh angka.
9. **Membaca Dua Tabel (Assets vs Liabilities and Equity)** — layout kiri-kanan, kolom, hierarki parent-child, indent, bold.
10. **Cara Ending Balance Dihitung** — saldo kumulatif journal Approved sebelum As at; akun induk = akumulasi anak.
11. **Current Profit/Loss dan Dampaknya ke Equity** — P/L positif → Equity naik; negatif → turun; mapping company accounting; keterkaitan Fiscal Period Open.
12. **Nuansa Cut-off Hari As at** — tabel: path saldo akun biasa (< As at) vs Current P/L (≤ As at); "bukan bug, ini nuansa cara hitung yang berbeda antar path".
13. **Dua Path P/L (Kartu vs Baris Parent)** — bedanya Ending P/L vs Current P/L; Fiscal Period Open; kapan kartu dan baris bisa beda.
14. **Referensi Field** — tabel filter (As at + Apply) + kolom tabel (Code, Name, Ending Balance).
15. **Aturan Bisnis & Validasi** — setiap baris dari Part 2 §E → kalimat "Kalau kamu …, maka …".
16. **Keterbatasan Saat Ini** — gap dan pending decision, framing netral: "saat ini sistemnya begini …, keputusan belum diambil".
17. **Hubungan dengan Menu Lain** — `flowchart TB`: Journal, COA, P&L, Fiscal Period, Trial Balance, Dev P&L.
18. **Troubleshooting** — tabel gejala → penyebab → solusi.
19. **FAQ** — dari Part 2.
20. **Lihat Juga / Referensi** — link ke menu terkait.

## 1.4 Mermaid

- Fence: ` ```mermaid ` baris sendiri, tanpa indent; baris pertama = tipe diagram.
- Tipe boleh: `flowchart TD/LR/TB`, `stateDiagram-v2`, `sequenceDiagram`, `erDiagram`. Hindari `classDiagram` / `gantt` / `pie`.
- **JANGAN buat `stateDiagram-v2`** — menu ini bukan transaksi, tidak punya siklus status.
- Label: `\n` bukan `<br/>`; jangan unicode arrow di label; label berkoma/spasi → kutip `A["teks, koma"]`.
- Edge label berkoma/spasi → kutip: `A -->|"label, text"| B`.
- Subgraph: judul berkutip jika ada spasi/`/`/`-`.
- `classDef`: **hex only** (`#4a90d9`).
- Pola tiap diagram: (1) judul + 1–2 kalimat, (2) Mermaid ≤ 5–10 node, (3) **"Keterangan langkah:"** numbered list, (4) **fallback teks** numbered list.

**Diagram WAJIB:**

| Section | Diagram |
|---------|---------|
| §5 Alur Bisnis | `flowchart LR` — Journal → BS → kartu + table |
| §17 Menu Lain | `flowchart TB` — relasi BS dengan Journal, COA, P&L, FP |

## 1.5 Placeholder gambar

Format: `> 🖼️ **[PLACEHOLDER GAMBAR]** — <deskripsi screenshot>`

Taruh di minimal **4 titik**:

1. Lokasi menu Balance Sheet di sidebar.
2. Filter As at + tombol Apply.
3. Kartu ringkasan (Total Assets, Total L&E, Current P/L).
4. Dual table Assets (kiri) vs Liabilities and Equity (kanan).

## 1.6 Checklist penutup Gemini

Sebelum selesai, Gemini **wajib** verifikasi mandiri:

- [ ] Semua 20 section di atas tercakup (atau eksplisit dihapus karena tidak ada data).
- [ ] Istilah Kunci mendahului penggunaan pertama istilah itu.
- [ ] Tidak ada state diagram (menu bukan transaksi).
- [ ] Mermaid sesuai aturan §1.4 (hex color, label kutip, fallback teks).
- [ ] Gap/pending decision di-frame netral ("saat ini …") — bukan janji perbaikan.
- [ ] Nuansa cut-off (< vs ≤) dan dual P/L helper punya section sendiri.
- [ ] Tidak ada path file / class / nama kolom DB / ID internal selain SF-BS-xx.
- [ ] Placeholder gambar di 4+ titik.
- [ ] "Tidak ada export" disebutkan minimal 2× (ringkasan awal + keterbatasan/tips).
- [ ] FAQ mencakup: As at, Apply wajib?, Assets harus = L+E?, Export?, Beda P&L/Trial Balance?

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> Dikompilasi dari `docs/qa-docs/accounting-balance-sheet/` — semua layer review v1.0, feature-map v1.0, 5 Lingo cards detailed. Per 2026-08-12.
> Nama: **Balance Sheet**. Modul: Finance & Accounting / Report. Route UI: `/accounting/balance-sheet`.

---

## §A. Ringkasan & Posisi Bisnis

**Balance Sheet (neraca)** menampilkan posisi keuangan perusahaan **pada satu tanggal As at**: berapa aset, utang, dan modal. Layout: kartu ringkasan di atas + dua tabel berdampingan (Assets | Liabilities and Equity).

Menu ini **hanya baca** — tidak ada create, edit, delete, approve, maupun export.

Persamaan dasar yang ditarget: **Total Assets ≈ Total Liabilities + Total Equity**. Sistem tidak memblok jika belum balance.

**Beda singkat:**
- **Profit & Loss** = kinerja dalam **rentang tanggal** (Revenue − Expense).
- **Balance Sheet** = posisi keuangan pada **satu tanggal** (Assets = L + E).
- **Trial Balance** = lebih lebar class / mutasi debit-kredit.

---

## §B. Kapan & Kenapa Dipakai

- Cek posisi keuangan akhir bulan / akhir tahun (neraca bulanan/tahunan).
- Audit apakah aset mendekati utang + modal (keseimbangan neraca).
- Lihat dampak laba/rugi berjalan ke Total Equity sebelum closing fiscal period.
- Membandingkan tanggal cut-off berbeda (satu per satu — tidak multi-period bersamaan).

---

## §C. Prasyarat

| Prasyarat | Penjelasan |
|-----------|------------|
| Chart of Account (COA) aktif | Class Assets, Liabilities, Equity sudah diset. Revenue / Expense / COGS tidak masuk Balance Sheet. |
| Hierarki parent–child COA | Akun induk = agregasi anak; tampil tebal + indent di tabel. |
| Mapping Current Profit/Loss | Sudah di-set di company accounting; menentukan kartu + baris Current P/L. |
| Journal Approved | Hanya journal dengan status **Approved** yang masuk saldo akun biasa. Draft / Open / Rejected tidak dihitung. |
| Akses menu | Privilege `viewAny` untuk Balance Sheet harus diberikan ke role user. |
| Fiscal Period Open | Untuk path Current Profit/Loss di baris parent Equity — jika period tidak Open atau tidak cover tanggal As at, nilainya 0. |

---

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **As at** | Tanggal potong neraca — satu tanggal, bukan rentang. |
| **Apply** | Tombol untuk memuat ulang kartu dan tabel ke tanggal As at yang dipilih. Tanpa Apply, angka belum berubah. |
| **Ending Balance** | Label kolom di tabel. Menampilkan saldo akun kumulatif sampai cut-off tanggal As at. |
| **Current Profit/Loss** | Laba/rugi berjalan yang menambah atau mengurangi Total Equity di neraca. |
| **Parent akun** | Akun induk dalam hierarki COA. Nilainya = jumlah semua anak. Ditampilkan tebal + indent. |
| **Liabilities and Equity** | Sisi kanan neraca: utang + modal. Tabel kanan menampilkan kedua class ini. |
| **Dual table** | Tata letak dua tabel berdampingan: kiri Assets, kanan Liabilities and Equity. |
| **Fiscal Period** | Periode akuntansi yang harus Open agar path Current P/L di parent Equity menghasilkan nilai (bukan 0). |

---

## §E. Filter & Zona UI

### Filter

| Kontrol | Behavior |
|---------|----------|
| **As at** | Single date (`yyyy-MM-dd`, tampil `dd-MM-yyyy`). |
| **Apply** | Hanya bekerja jika tanggal terisi → refresh kartu + kedua tabel. |
| Apply tanpa tanggal | **Tidak terjadi apa-apa** (no-op). |
| First load | Tanggal lokal kosong; sistem default **hari ini**. |

### Zona UI

| Zona | Isi |
|------|-----|
| Filter bar | As at + Apply |
| Kartu ringkasan | Total Assets · Total L&E (sub Total Liabilities / Total Equity) · Current Profit/Loss |
| Tabel kiri | **Assets** — hierarki COA class Assets |
| Tabel kanan | **Liabilities and Equity** — hierarki COA class Liabilities + Equity |

### Kolom tabel

| Kolom | Tampil | Catatan |
|-------|--------|---------|
| CODE | Ya | Urutan numerik |
| NAME | Ya | Induk **tebal** + indent |
| ENDING BALANCE | Ya | Saldo as-of (lihat §F untuk cara hitung) |

Tidak ada Search Builder, pagination tipikal, action per baris, drill-down ke journal, atau tombol export.

---

## §F. Cara Hitung

### Kartu ringkasan

```text
Total Assets              = Σ saldo akun Assets         (tanpa abs di kartu)
Total Liabilities         = |Σ saldo akun Liabilities|   (abs)
Current Profit/Loss       = Ending P/L                   (signed, bisa + atau −)
Total Equity              = |Σ saldo akun Equity|        (abs) + Current P/L
Total Liabilities & Equity = Total Liabilities + Total Equity
```

Current P/L positif → Total Equity naik; negatif → Total Equity turun.

### Ending Balance per baris tabel

| Jenis baris | Cara hitung |
|-------------|-------------|
| Akun biasa (leaf) | Abs saldo kumulatif journal Approved dengan tanggal **sebelum** hari As at |
| Akun induk (parent) | Abs akumulasi semua anak |
| Akun induk Equity | Abs saldo Equity + **Current Profit/Loss** (path yang butuh Fiscal Period Open) |
| Baris mapping Current P/L | Ending P/L signed (kumulatif sampai **termasuk** hari As at) |

### Nuansa cut-off hari As at

| Path | vs tanggal As at (`D`) | Efek |
|------|------------------------|------|
| Saldo akun biasa (beginning) | Transaksi tanggal **sebelum** `D` | Transaksi **pada hari** As at **belum masuk** saldo akun biasa |
| Ending Profit/Loss (kartu & baris P/L) | Transaksi tanggal **sampai dengan** `D` | Transaksi **pada hari** As at **ikut masuk** angka Current P/L |

→ Ini berarti journal Approved yang tanggalnya = As at **tidak** muncul di Ending Balance akun biasa, **tapi bisa** muncul di Current Profit/Loss. Bukan bug — ini nuansa cut-off dua path yang berbeda.

### Dua path P/L helper

| Dipakai di | Helper | Ciri |
|------------|--------|------|
| Kartu ringkasan + baris mapping Current P/L | **Ending P/L** | Kumulatif history ≤ As at; **tanpa** filter Approved (cara kerja saat ini) |
| Baris parent Equity | **Current P/L** | Hanya jika Fiscal Period **Open** dan cover tanggal As at; jika tidak → **0** |

→ Kartu Current P/L bisa menampilkan nilai, sementara baris parent Equity di tabel bisa 0 jika Fiscal Period tidak Open untuk tanggal itu. Ini bukan kesalahan — ini dua path perhitungan berbeda yang masih dalam tinjauan.

---

## §G. Langkah Penggunaan

1. Buka **Balance Sheet** — default menampilkan angka **hari ini**.
2. Pilih tanggal **As at**.
3. Klik **Apply** (kalau As at kosong, Apply tidak bereaksi).
4. Baca **kartu ringkasan**: Total Assets, Total Liabilities & Equity, Current Profit/Loss.
5. Bandingkan **tabel kiri** (Assets) vs **tabel kanan** (Liabilities and Equity).
6. Idealnya Total Assets ≈ Total L + Total E. Jika belum balance, cek journal Approved dan mapping Current P/L.

---

## §H. Contoh Kasus

| # | Situasi | Hasil yang diharapkan |
|---|---------|----------------------|
| 1 | Buka menu tanpa ubah tanggal | Kartu + tabel menampilkan data **hari ini** |
| 2 | Pilih As at 31 Mar → Apply | Refresh ke 31 Mar |
| 3 | Apply tanpa isi As at | Tidak terjadi apa-apa |
| 4 | Current P/L positif (+2 jt) | Total Equity di kartu naik 2 jt |
| 5 | Current P/L negatif (−1 jt) | Total Equity di kartu turun 1 jt |
| 6 | Journal masih Draft, tanggal < As at | Tidak masuk saldo akun biasa |
| 7 | Journal Approved tanggal = As at | Tidak masuk saldo akun biasa; bisa masuk Current P/L |
| 8 | Cari tombol Export | Tidak ada — menu view only |
| 9 | Period closed untuk tanggal As at | Baris parent Current P/L bisa 0 meski kartu ada nilai |

---

## §I. Validasi & Aturan Bisnis

| Kondisi | Behavior |
|---------|----------|
| User tanpa privilege | Ditolak (403) untuk report & datalist |
| Apply dengan As at kosong | Tidak terjadi apa-apa (no-op) |
| As at tidak diisi saat pertama buka | Sistem default hari ini |
| Total Assets ≠ Total L+E | Tetap ditampilkan — sistem tidak memblok |
| Journal Draft / Open / Rejected | Tidak masuk saldo akun biasa |
| Format tanggal tidak standar | Saat ini tidak divalidasi eksplisit di backend |

---

## §J. Sub-Feature (Lingo)

Menu ini memiliki 5 capability card:

| ID | Nama | Ringkasan |
|----|------|-----------|
| SF-BS-01 | **As at & Apply** | Pilih satu tanggal, klik Apply; tanpa tanggal = no-op. Default hari ini. |
| SF-BS-02 | **Summary cards** | Kartu Total Assets, Total L&E (sub L / E), Current P/L. |
| SF-BS-03 | **Dual table Assets vs L&E** | Dua tabel berdampingan: kiri Assets, kanan Liabilities and Equity. Hierarki parent-child. |
| SF-BS-04 | **How Ending Balance is calculated** | Saldo kumulatif journal Approved sebelum hari As at. Transaksi pada hari As at belum masuk path akun biasa. |
| SF-BS-05 | **Current Profit/Loss & Equity** | P/L positif → Equity naik; negatif → turun. Mapping company accounting. Parent Equity butuh Fiscal Period Open. |

Fitur yang **tidak ada** di menu ini: Export, Global Search, Advanced Filter, Create/Edit/Approve, Attachment, Approval Log.

---

## §K. Keterbatasan & Hal dalam Tinjauan

Framing: ini adalah **kondisi sistem saat ini**, bukan janji perbaikan.

| # | Deskripsi | Status |
|---|-----------|--------|
| 1 | **Cut-off beda antar path:** saldo akun biasa memakai "sebelum" hari As at, sedangkan Current P/L memakai "sampai dengan" hari As at. Bisa membuat angka terlihat tidak konsisten pada tanggal cut. | Pending Decision |
| 2 | **Kartu vs baris parent Equity bisa beda:** kartu memakai Ending P/L, baris parent Equity memakai Current P/L (butuh Fiscal Period Open). Risiko visual angka berbeda di dua tempat. | Pending Decision |
| 3 | **History Current P/L tanpa filter Approved:** path Ending dan Current P/L mengambil dari history tanpa memfilter apakah journal sumbernya sudah Approved. | Pending Decision |
| 4 | **Abs tidak seragam di kartu:** Assets di kartu tanpa abs, Liabilities/Equity di-abs dulu. | Didokumentasikan |
| 5 | **Format tanggal tidak divalidasi backend:** jika format tidak standar dikirim ke API, tidak ada penolakan eksplisit. | Catatan untuk developer |
| 6 | **Label "Ending Balance" vs helper "beginning":** label kolom UI menampilkan "Ending Balance", tetapi helper yang dipakai untuk akun biasa sebenarnya menghitung "beginning" (sebelum tanggal). | Sudah dijelaskan di docs |
| 7 | **Tidak ada export:** by design — menu ini hanya untuk melihat, bukan mengunduh. | Sudah diputuskan |
| 8 | **Persamaan Assets = L+E tidak di-enforce:** sistem tetap menampilkan angka meski belum balance. Belum ada keputusan soal soft warning. | Pending Decision |

---

## §L. Menu Terkait

| Menu | Relasi dengan Balance Sheet |
|------|----------------------------|
| **Journal** | Sumber saldo — hanya journal **Approved** yang masuk akun biasa |
| **Chart of Account** | Menentukan baris dan hierarki parent-child di tabel |
| **Profit & Loss** | Sibling — P&L = kinerja dalam rentang tanggal; BS = posisi pada satu tanggal |
| **Fiscal Period** | Path Current P/L di parent Equity; closing → Retained Earnings |
| **Trial Balance / General Ledger** | Sibling report — lebih lebar class / mutasi |
| **Dev - Profit & Loss** | Sibling legacy P&L |

---

## §M. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Angka masih hari ini setelah ganti tanggal | Belum klik Apply | Isi As at → **Apply** |
| Apply tidak bereaksi | As at kosong | Isi tanggal dulu |
| Total Assets ≠ Total L+E | Journal belum Approved; mapping Current P/L belum diset; fiscal period tidak cover tanggal; cut-off hari As at | Cek journal Approved, mapping company, period Open, dan nuansa transaksi di tanggal cut |
| Current P/L di kartu ada nilai, di baris parent Equity = 0 | Fiscal Period closed atau tidak cover tanggal As at | Cek Fiscal Period untuk tanggal yang dipilih |
| Tidak ada tombol Export | By design | Menu view only — salin layar manual atau gunakan laporan lain yang punya export |
| Semua baris 0 padahal ada journal | Journal masih Draft / Open; atau class COA tidak sesuai | Pastikan journal Approved + class Assets/Liabilities/Equity benar |

---

## §N. FAQ

**Q: Apa itu As at?**
A: Satu tanggal potong neraca — posisi keuangan pada titik waktu itu.

**Q: Harus klik Apply?**
A: Ya — ubah tanggal saja belum mengubah angka di layar.

**Q: Total Assets harus sama dengan Total Liabilities + Equity?**
A: Idealnya ya. Tapi sistem tidak memblok jika belum balance — tetap ditampilkan.

**Q: Ada export (unduh Excel/PDF)?**
A: Tidak. Menu ini by design hanya untuk melihat.

**Q: Journal Draft ikut dihitung?**
A: Tidak untuk saldo akun biasa. Hanya journal **Approved**.

**Q: Fiscal Period mempengaruhi?**
A: Ya, untuk path Current P/L di baris parent Equity — period harus Open dan cover tanggal As at. Jika tidak, nilainya 0 di baris itu (meski kartu tetap menampilkan Ending P/L).

**Q: Bedanya dengan Profit & Loss?**
A: P&L = kinerja dalam **rentang tanggal** (pendapatan − beban). BS = posisi pada **satu tanggal** (aset = utang + modal).

**Q: Bedanya dengan Trial Balance?**
A: Trial Balance mencakup lebih banyak class dan menampilkan mutasi debit-kredit. Balance Sheet fokus pada class Assets, Liabilities, Equity saja.
