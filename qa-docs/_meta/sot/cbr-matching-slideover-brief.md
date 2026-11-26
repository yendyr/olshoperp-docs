# Brief — Matching with Bank Statement: Slideover + Quick Journal

**Menu:** Cash &amp; Bank Reconcile (`accounting/cash-bank-reconcile/edit/{id}`) — panel matching pada tab **Reconcile Process**
**Status dokumen:** TO-BE (usulan requirement) + AS-IS (verifikasi codebase `olshoperp-frontend` &amp; qa-docs `accounting-cash-bank-reconcile`)
**Mockup interaktif:** https://claude.ai/code/artifact/30842e2e-3647-485f-b96c-d54a6000f274 (3 screen: Entry Point · Matching Slideover · Mapping)
**Dibuat:** 10-09-2026 · **Revisi terakhir:** 10-09-2026 (cash line di atas + anchor picker) · Author: QA - Yemima

---

## 1. Ringkasan perubahan

| # | Perubahan | Alasan |
|---|---|---|
| 1 | Modal `Dialog size="3xl"` → **Slideover** | Area kerja lebih tinggi; halaman reconcile tetap terlihat di belakang; konten tidak lagi mentok `max-h-[80vh]` |
| 2 | **POV switch** dua arah | Sekarang hanya bisa 1 bank statement → banyak GL. Kasus nyata juga sebaliknya: 1 jurnal GL ditutup oleh beberapa baris bank statement |
| 3 | **Difference bar** di bawah panel | Menutup gap "difference strip belum ada"; jadi penentu aktif/tidaknya tombol Match |
| 4 | Tombol **Create** tidak lagi redirect | Sekarang `toJournal()` melempar ke `/accounting/journal/create` dan seluruh konteks reconcile hilang. Diganti **modal create journal** di atas panel |
| 5 | **Save &amp; Approve** langsung dari panel | Journal langsung posted, otomatis muncul &amp; tercentang di daftar internal, selisih jadi 0 — tanpa pindah halaman |
| 6 | Dua **confirmation modal** | Draft tidak bisa dimatch (perlu peringatan), dan approve bersifat final (perlu konfirmasi) |
| 7 | **Anchor row bisa diganti dari dalam slideover** | Sekarang untuk pindah ke bank statement / GL lain harus tutup panel dan klik dari baris lain di tab process |
| 8 | Baris kas/bank **naik ke atas** form journal | Hanya kode COA + deskripsi yang perlu dilihat user; nominalnya toh mengikuti total offset, jadi tidak perlu jadi input terpisah di preview |

---

## 2. Slideover — Matching with Bank Statement

### 2.1 Header

`BR-2609-0021 · Period 01-09-2026 – 30-09-2026 · Account: Bank BCA — 1-1201 · A/C 8290-1122-33 · IDR`

Sumber: header Cash &amp; Bank Reconcile (transaction code, period, cash bank account, currency).

### 2.2 POV switch (pill kiri-kanan)

| POV | Anchor (atas) | Daftar multi-select (bawah) | Create journal |
|---|---|---|---|
| **A — 1 bank statement → many GL** (default, existing) | 1 baris bank statement | Journal detail GL pada COA cash/bank tsb, status *Not Reconciled*, dalam period | ✅ tersedia |
| **B — 1 GL → many bank statements** (baru) | 1 baris journal detail GL | Baris bank statement hasil import yang belum reconciled | ❌ tidak ditawarkan — sisi internal sudah ada |

Keduanya punya filter **Select Period** dan **Amount** (perilaku sama seperti AS-IS: debounce, memfilter daftar bawah).

### 2.2.1 Ganti anchor tanpa menutup slideover

Di kanan judul section anchor ada tombol:

| POV | Tombol | Modal picker berisi |
|---|---|---|
| A | **Change bank statement** | Baris bank statement hasil import pada CBR ini, status **Not Reconciled**. Kolom: Date · Description · Receive (Debit) · Spent (Credit) · tombol Select |
| B | **Change internal transaction** | Journal detail GL pada COA cash/bank CBR ini, status **Not Reconciled**, dalam period. Kolom: GL Trx Code + tanggal · Description · Receive (Debit) · Spent (Credit) · tombol Select |

Perilaku:

- Baris yang sedang dipakai ditandai (highlight) dan tombolnya berubah jadi **Current** (disabled)
- Modal punya filter **Search** dan **Amount**, pola sama dengan filter tabel lain
- Setelah memilih baris lain:
  1. Tabel anchor di slideover diganti
  2. Angka anchor di difference bar ikut berubah
  3. **Seluruh centangan sebelumnya dibersihkan** — supaya seleksi tidak terbawa ke transaksi lain
  4. Selisih dihitung ulang, tombol Match kembali disabled
  5. Khusus POV A: default **Transaction date** di form create journal ikut tanggal statement baru, dan posisi debit/kredit kas/bank menyesuaikan arah statement (Receive → debit, Spent → credit)
- Journal yang sudah terlanjur dibuat untuk anchor sebelumnya **tidak** dihapus — hanya keluar dari daftar seleksi anchor yang baru

### 2.3 Difference bar (posisi: paling bawah panel, di atas tombol)

```
BANK STATEMENT 3.000.000  −  SELECTED 2.850.000 (1 transaction selected)  =  DIFFERENCE 150.000
```

- Tampilan **minimalis satu baris**, teks kecil, background abu tipis
- **Hanya angka selisih yang berwarna**: merah bila ≠ 0, hijau bila = 0
- Tombol **Match** disabled selama selisih ≠ 0
- Di POV B, label pertama berubah jadi *Internal transaction*

### 2.4 Footer

`Cancel` · `Create journal` (hanya POV A) · `Match` (primary, disabled sampai selisih 0), plus catatan kiri yang ikut berubah sesuai kondisi.

---

## 3. Modal Create Journal

Dibuka dari tombol **Create journal** di footer slideover. **Modal**, bukan section inline — muncul di atas slideover dengan scrim gelap.

### 3.1 Field header

| Field | Wajib | Perilaku | Placeholder |
|---|---|---|---|
| Transaction code | Tidak | Disabled, digenerate saat save | `Auto-generated` |
| Transaction date | Ya | Default = tanggal bank statement anchor | `dd-mm-yyyy` |
| Currency | — | Disabled, ikut currency akun cash/bank | `Taken from the cash/bank account` |

### 3.2 Baris kas/bank — di atas offset accounts

Satu blok tipis di atas tabel offset, berisi tiga bagian sejajar:

| Bagian | Isi | Editable |
|---|---|---|
| **Cash/bank account** | `1-1201 · Bank BCA` + keterangan *Fixed by this reconciliation* | ❌ |
| **Description** | Deskripsi baris kas/bank, placeholder `Add description or notes....` | ✅ |
| **Amount** | Angka read-only + keterangan *follows the offset total* | ❌ — selalu = total offset accounts |

Alasan ditaruh di atas: user cukup melihat **kode COA + deskripsi**; nominalnya toh turunan dari offset, jadi tidak perlu jadi input terpisah. Di journal preview, baris ini tampil **read-only sepenuhnya** — tidak ada dua tempat input untuk hal yang sama.

### 3.3 Offset accounts — bisa multiple

Tabel baris dengan tombol **+ Add offset account** dan tombol hapus per baris (nonaktif kalau tinggal satu baris).

| Kolom | Keterangan |
|---|---|
| **Account Code** | Dropdown COA. **Akun cash/bank milik reconcile ini di-exclude dari opsi** — supaya debit &amp; kredit tidak mungkin memakai akun yang sama |
| **Description** | Bebas per baris, placeholder `Add description or notes....` |
| **Amount** | Nominal per baris |

Baris pertama otomatis terisi nominal **sisa selisih** saat modal dibuka.

### 3.4 Journal preview

Kolom: **Account Code · Description · Debit · Credit** (sebelumnya "COA" dan "Memo").

Preview bersifat **read-only** — semua baris hanya mencerminkan input di atasnya.

| Baris | Account Code | Description | Amount |
|---|---|---|---|
| Cash/bank (1-1201 Bank BCA) | Terkunci | Mengikuti blok kas/bank di atas | = total offset accounts |
| Offset accounts | Mengikuti tabel offset | Mengikuti tabel offset | Mengikuti tabel offset |

Perilaku:

- Nominal cash/bank **selalu sama dengan total offset accounts** — tidak ada input manual, jadi journal otomatis balance selama nominal offset terisi
- Posisi debit/kredit cash/bank mengikuti arah bank statement anchor: **Receive → debit**, **Spent → credit**
- Tombol **Swap debit / credit** untuk kasus terbalik — bebas, asal akhirnya balance
- Indikator live: `Balanced — debit X = credit Y` (hijau) atau `Not balanced — debit X vs credit Y` (merah)

### 3.5 Footer modal

Catatan sisa selisih di kiri, lalu `Cancel` · `Save as draft` · `Save & Approve`.
**Tidak ada icon close (✕)** di pojok modal — sudah ada tombol Cancel. Berlaku juga untuk kedua modal konfirmasi.

---

## 4. Modal konfirmasi

### 4.1 Save as draft — warning modal

Judul: **"Save as draft — it cannot be matched yet"**

Isi peringatan:

- Draft journal **tidak akan muncul** di daftar matching ini
- Hanya tersimpan di menu **Journal Transaction**, menunggu di-approve di sana
- Hanya journal **approved** yang bisa dimatch dengan bank statement
- Baris bank statement ini tetap *Not Reconciled*, selisih tetap terbuka (nominalnya disebutkan)
- Saran: pakai **Save &amp; Approve** kalau ingin menyelesaikan rekonsiliasi sekarang

Tombol: `Back to the form` · `Save as draft anyway`
Setelah lanjut → toast oranye di panel yang mengingatkan lokasi journal-nya dan bahwa baris bank belum bisa dimatch.

### 4.2 Save &amp; Approve — confirmation modal

Judul: **"Approve this journal?"** · subjudul: *Approving posts it to the general ledger straight away*

Isi:

1. **Recap semua baris** yang akan diposting: tanggal, tiap account code + description + posisi debit/kredit + nominal, ditutup baris **Total** debit vs credit
2. Peringatan: *"Have you checked the preview?"* — pastikan tanggal, nominal, akun offset, dan posisi debit/kredit benar; journal yang sudah approved **tidak bisa diedit**, koreksinya lewat reversal di menu Journal Transaction

Tombol: `Back to review` · `Yes, approve and post`
**Approval baru dieksekusi setelah tombol kedua ditekan.**

Setelah approve berhasil: journal baru masuk ke tabel Internal transactions dengan flag `new` + `approved`, otomatis tercentang, difference bar jadi 0, tombol Match aktif.

---

## 5. Catatan UI — placeholder

**Aturan: placeholder ditulis di dalam field input, bukan sebagai teks bantu di luar/di bawah field.**

Ini konsisten dengan pola yang sudah dipakai di OlshopERP, contoh nyata:

| Lokasi | Placeholder |
|---|---|
| Journal — Transaction Code | `Auto-generated` |
| Journal — Description | `Add description or notes....` |
| Reconcile modal — Amount filter | `Amount` |
| Reconcile modal — Period filter | `Choose Period Date` |
| Multiselect umum | `Choose {Entity}` (mis. `Choose Rack`, `Choose Store`, `Choose Currency`) |

Turunannya untuk panel ini:

| Field | Placeholder |
|---|---|
| Transaction code | `Auto-generated` |
| Transaction date | `dd-mm-yyyy` |
| Currency (disabled) | `Taken from the cash/bank account` |
| Offset account | `Choose Account` |
| Description (offset &amp; cash/bank) | `Add description or notes....` |
| Amount | `0` |

Keterangan tambahan yang **bukan** placeholder (aturan bisnis, batasan, tooltip) tetap ditaruh sebagai **tooltip `Tippy` + ikon info** di samping label — pola yang sudah dipakai di form Journal (`Transaction Code`, `Transaction Date`) — bukan sebagai teks abu di bawah field.

---

## 6. Sumber data &amp; endpoint

### 6.1 Yang sudah ada (AS-IS)

| Kebutuhan | Endpoint / sumber |
|---|---|
| Anchor bank statement + daftar GL (POV A) | `GET accounting/cash-bank-reconcile/{id}/reconcile-process/{statementId}?period=&amount=` |
| Daftar bank statement &amp; GL di tab process | `GET accounting/cash-bank-reconcile/{id}/reconcile-process` |
| Eksekusi match | `PUT accounting/cash-bank-reconcile-detail/{id}` body `{ id_statement, journal_detail_id }` |
| Header CBR (period, cash bank account, can_update) | Basic Information CBR |
| Master COA | Chart of Account |

### 6.2 Yang perlu ditambah (TO-BE)

| Kebutuhan | Usulan |
|---|---|
| Daftar bank statement belum reconciled untuk 1 GL (POV B) | `GET accounting/cash-bank-reconcile/{id}/reconcile-process-gl/{journalDetailId}?period=&amount=` |
| Match POV B (1 GL ↔ banyak statement) | `PUT accounting/cash-bank-reconcile-detail/{id}` menerima `journal_detail_id` tunggal + `id_statement[]` |
| Opsi COA untuk offset account | Select2 COA dengan parameter exclude akun cash/bank milik CBR ini |
| Daftar bank statement Not Reconciled (picker anchor POV A) | `GET accounting/cash-bank-reconcile/{id}/bank-statements?status=not_reconciled&q=&amount=` |
| Daftar GL Not Reconciled (picker anchor POV B) | `GET accounting/cash-bank-reconcile/{id}/gl-transactions?status=not_reconciled&q=&amount=` |
| Quick journal + approve | `POST accounting/cash-bank-reconcile/{id}/quick-journal` |

### 6.3 Payload quick journal

```json
POST accounting/cash-bank-reconcile/{id}/quick-journal

{
  "statement_id": 88213,
  "transaction_date": "2026-09-12",
  "cash_bank": {
    "description": "Cash/bank side of this reconciliation",
    "position": "debit"
  },
  "offsets": [
    { "coa_id": 4410, "description": "Interest income September - unrecorded in GL", "amount": 120000 },
    { "coa_id": 6621, "description": "Bank admin fee September",                     "amount": 30000  }
  ],
  "approve": true
}
```

```json
// response
{
  "journal": {
    "code": "JR-2609-00431",
    "transaction_date": "2026-09-12",
    "status": "approved",
    "details": [
      { "coa": "1-1201 Bank BCA",                 "debit": 150000, "credit": 0 },
      { "coa": "4-4100 Other Income",             "debit": 0,      "credit": 120000 },
      { "coa": "6-6210 Bank Administration Expense", "debit": 0,   "credit": 30000 }
    ]
  },
  "journal_detail_id": 99231,
  "selectable": true
}
```

`journal_detail_id` adalah **baris cash/bank** dari journal tersebut — itulah yang langsung diseleksi di daftar matching.

Nominal baris cash/bank **tidak dikirim** — backend menghitungnya dari total `offsets`, sehingga journal dijamin balance. Kalau frontend tetap mengirim `amount` dan nilainya berbeda dari total offset, request ditolak.

---

## 7. Validasi

### 7.1 Matching

| Aturan | Keterangan |
|---|---|
| Match aktif hanya saat selisih **= 0** | Tanpa toleransi saat save (toleransi ±5% hanya untuk *suggestion*) |
| Single match | Tetap: tanggal dalam period, tanggal bank = tanggal GL, sisi debit/kredit sama, amount exact |
| Multi-select (POV A &amp; B) | Validasi pada **sum**; baris yang tanggal/sisinya berbeda diberi flag agar user sadar apa yang diterima |
| Setelah match | Baris hilang dari tab process, status jadi Reconciled di kedua sisi, GL code terisi di bank statement |
| Unmatch | Hanya saat CBR masih Draft/Open |
| Ganti anchor | Membersihkan seluruh centangan sebelumnya; tombol Match kembali disabled sampai selisih 0 lagi |
| Daftar picker anchor | Hanya menampilkan baris berstatus **Not Reconciled** milik CBR ini; baris yang sedang jadi anchor ditandai Current dan tidak bisa dipilih ulang |

### 7.2 Quick journal

| Aturan | Keterangan |
|---|---|
| Akun cash/bank CBR ini **wajib di-exclude** dari opsi offset account | Cegah debit &amp; kredit memakai akun yang sama |
| Akun cash/bank lain masih boleh dipilih | Tapi tampilkan warning: akan memunculkan item rekonsiliasi baru di CBR akun tersebut |
| Transaction date | Harus di **fiscal period aktif**, di dalam period CBR, dan maksimal backdate 6 bulan |
| Balance | Total debit harus = total kredit sebelum tombol save aktif. Karena nominal kas/bank = total offset, ketidakseimbangan hanya mungkin terjadi kalau ada baris offset beramount kosong |
| Deskripsi kas/bank | Wajib diisi — jadi memo baris kas/bank di journal |
| Minimal 1 baris offset | Baris terakhir tidak bisa dihapus |
| Amount > 0 per baris | Baris beramount 0 ditolak |
| Approve | Butuh permission approve journal. Tanpa permission → hanya tombol **Save as draft** yang muncul |
| Draft | Tidak masuk daftar matching sampai di-approve di menu Journal Transaction |
| CBR sudah approved | Panel read-only; tombol Create journal &amp; Match tidak muncul (ikut `can_update`) |

---

## 8. File frontend

| File | Perubahan |
|---|---|
| `src/pages/Accounting/CashBankReconcile/ModalFindAndMatch.vue` | Rename → `SlideoverFindAndMatch.vue`; ganti `Dialog` → `Slideover`; tambah POV switch + difference bar; hapus `toJournal()` |
| `src/pages/Accounting/CashBankReconcile/ReconcilleProcess.vue` | Trigger sama, komponen baru; props tetap (`ModalBankId`, `selectedBankBalance`, `can_update`) |
| `src/pages/Accounting/CashBankReconcile/QuickJournalForm.vue` | **Baru** — modal create journal + tabel offset accounts + preview |
| `src/pages/Accounting/CashBankReconcile/QuickJournalConfirm.vue` | **Baru** — dua modal konfirmasi (draft warning &amp; approve confirmation), pola `ConfirmationModal` / `ApprovalDialog` existing |
| `src/pages/Accounting/CashBankReconcile/AnchorPickerModal.vue` | **Baru** — modal pilih anchor (bank statement / internal transaction), dipakai kedua POV dengan props berbeda |

Komponen tabel tetap memakai `PrimeDataTables` (anchor) dan `DataTablesV3` (daftar multi-select) seperti sekarang.

---

## 9. QA test notes

| # | Skenario | Ekspektasi |
|---|---|---|
| 1 | Klik See more / See Other…… | Slideover terbuka, bukan modal; halaman reconcile masih terlihat |
| 2 | Switch POV A ↔ B | Anchor dan daftar bawah bertukar; tombol Create journal hilang di POV B |
| 3 | Centang beberapa baris | Difference bar update realtime; hanya angka selisih yang berwarna |
| 4 | Selisih = 0 | Tombol Match aktif, teks catatan footer berubah |
| 5 | Selisih ≠ 0 | Match disabled |
| 6 | Selected melebihi anchor | Selisih tampil negatif dengan tanda kurung, Match tetap disabled |
| 7 | Klik Create journal | Muncul **modal**, bukan section inline; tanpa icon ✕; nominal baris offset pertama = sisa selisih |
| 8 | Dropdown offset account | Akun cash/bank CBR (1-1201 Bank BCA) **tidak ada** di opsi |
| 9 | Add offset account | Baris bertambah; total offset ter-refleksi di nominal cash/bank |
| 10 | Hapus baris offset | Bisa, kecuali saat tinggal 1 baris (tombol disabled) |
| 11 | Edit nominal cash/bank manual | Auto-sync berhenti; indikator balance berubah sesuai |
| 12 | Edit account code baris cash/bank | Tidak bisa — hanya description &amp; amount yang editable |
| 13 | Swap debit / credit | Posisi nominal berpindah kolom di semua baris; balance tetap dihitung ulang |
| 14 | Journal tidak balance | Indikator merah; save diblokir |
| 15 | Save as draft | Muncul warning modal berisi 4 poin konsekuensi; setelah lanjut, journal **tidak** muncul di daftar matching |
| 16 | Save &amp; Approve | Muncul confirmation modal berisi recap semua baris + total debit/kredit; approve baru jalan setelah tombol konfirmasi |
| 17 | Setelah approve | Baris journal baru muncul dengan flag new + approved, tercentang otomatis, selisih 0, Match aktif |
| 18 | Tanggal di luar fiscal period / period CBR | Ditolak dengan pesan jelas |
| 19 | User tanpa permission approve journal | Tombol Save &amp; Approve tidak muncul, hanya Save as draft |
| 20 | CBR sudah approved | Panel read-only; Create journal &amp; Match tidak tersedia |
| 21 | Placeholder | Semua teks bantu berada **di dalam** field, bukan di luar |
| 22 | Klik Change bank statement (POV A) | Modal picker terbuka; hanya baris Not Reconciled yang tampil; baris aktif bertanda Current dan disabled |
| 23 | Pilih bank statement lain | Anchor table &amp; angka anchor di difference bar berubah; centangan sebelumnya hilang; Match kembali disabled |
| 24 | Pilih statement bertipe Spent | Posisi debit/kredit kas/bank di preview journal otomatis terbalik |
| 25 | Klik Change internal transaction (POV B) | Perilaku sama, daftarnya journal detail GL Not Reconciled |
| 26 | Ganti anchor setelah membuat journal | Journal yang sudah approved tetap ada di menu Journal Transaction, hanya keluar dari daftar seleksi anchor baru |
| 27 | Blok kas/bank di form journal | Hanya Description yang bisa diketik; Account Code dan Amount read-only |
| 28 | Ubah nominal offset | Amount kas/bank ikut berubah otomatis, indikator balance tetap hijau |

---

## 10. Keputusan terkunci (PM/QA — 10-09-2026)

| # | Keputusan | Detail |
|---|---|---|
| 1 | **Match klik manual** | Setelah Save & Approve, journal hanya **auto-selected**. Tombol Match tetap terpisah — user klik manual. |
| 2 | **Bank statement import-only** | Tidak ada create bank statement dari panel. Hanya **Change** (picker) / multi-select baris import yang sudah ada. |
| 3 | **Quick journal ringkas** | **Tanpa** attachment, store, transaction reference, rate. (Mockup tab Mapping: AS-IS full form vs PROPOSED ringkas.) |
| 4 | **Ganti anchor = clear + notice di picker** | Bukan modal konfirmasi terpisah. Footer picker: *Switching the line/transaction clears the current selection below.* |
| 5 | **Amount kas/bank read-only** | Ikuti form Create journal mockup (*follows the offset total*). Hanya Description editable. Abaikan QA notes #11–#12 yang bertentangan. |

---

## 11. Catatan

- Semua kode dokumen dan nominal di mockup adalah **contoh**, bukan data produksi.
- Endpoint quick journal dan daftar POV B **belum ada** — masih TO-BE.
- Referensi requirement: qa-docs `accounting-cash-bank-reconcile` §5.4 (reconcile process), §6.1 (6 prioritas suggestion, threshold ±5%), §6.2 (validasi match single vs bulk), §6.3 (unmatch), §6.4 (approve &amp; period lock), serta gap difference strip; dan form Journal (`src/pages/Accounting/Journal/Form.vue`, `DatalistDetail.vue`) untuk acuan field &amp; placeholder.
