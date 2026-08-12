---
doc_type: gemini-generation-brief
target_menu: "Debit Note"
menu_slug: accounting-debit-note
source_of_truth: docs/qa-docs/accounting-debit-note/ (repo olshoperp — dibaca 2026-08-12)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Debit Note" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v1.0 (132 baris); requirement review v1.0 (305); technical review v1.0 (112);
  user-guide review v1.1 (120); feature-map review v1.0 (50); 5 capability cards (≈270).
  Total ≈1.025 baris → brief PROPORSIONAL, semua section standar relevan.
  Sudah ada feature-map.md + capability cards (SF-DN-01..04, SF-DET-01).
  Sudah ada user-guide.md v1.1 (boleh acuan tone). Brief = bahan draft Help Center pertama.
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Debit Note"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Tiga jalur pembuatan — bukan satu form standar.** Debit Note bisa muncul dari: (a) manual di menu ini, (b) otomatis dari Purchase Return billed, (c) Import Account Payment Adjustment. Ketiga jalur menghasilkan status awal yang sama (**Open**), tapi detail isinya beda (Payment Source kas/bank vs Return Deposit). Dokumen harus menjelaskan ketiga jalur **secara terstruktur**, bukan disisipkan acak.

2. **Dua jenis detail yang tidak boleh dicampur.** DN manual punya section **Payment Source** (kas/bank). DN dari Purchase Return punya **Return Deposit** (read-only, tanpa kas/bank). Pembaca harus paham kapan melihat mana, dan kenapa section lainnya kosong — ini **bukan error**.

3. **Tujuan utama = dipakai di menu lain (Account Payment).** DN bukan dokumen final; nilainya "dihabiskan" sebagai potong hutang di Account Payment. Pembaca butuh section jelas tentang eligibility (supplier & currency sama, tanggal DN sebelum AP, outstanding > 0) dan bagaimana Paid/Outstanding berubah.

4. **Mirror Credit Note (sisi AR).** Debit Note = sisi supplier (Account Payable); Credit Note = sisi customer (Account Receivable). Rujuk singkat — jangan duplikasi detail Credit Note di sini. Perbedaan kunci: DN dari Purchase Return **tidak** auto-approved (berbeda dari sebagian jalur CN dari Sales Return).

5. **Void / Closed belum tersedia.** Siklus status hanya sampai **Approved** (final). Belum ada definisi Void atau Closed untuk DN. Tandai konsisten di setiap tempat status lifecycle disebut.

6. **Bug export diketahui.** Export With Details hanya membaca data Payment Source (kas/bank) — DN dari Purchase Return bisa **tanpa baris detail** di file Excel. Ini keterbatasan yang perlu disebut di section export, troubleshooting, dan keterbatasan.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran kamu (Gemini)

Kamu technical writer bergaya dokumentasi pentaho.com untuk OlshopERP:
- Definisi dulu, lalu prosedur, lalu tabel referensi lengkap.
- Langkah bernomor yang actionable; label UI **tebal**.
- Callout **Note** / **Tip** / **Warning** di tempat yang tepat.
- Tanpa bahasa marketing.
- **Sumber kebenaran HANYA Part 2.** Dilarang mengarang fakta, angka, pesan error, atau perilaku di luar Part 2. Kalau Part 2 bertanda `[NEEDS SOURCE]`, jangan mengisi tebakan.

## 1.2 Bahasa & tone

- Bahasa Indonesia; istilah teknis Inggris boleh (Debit Note, Payment Source, Outstanding, Approved, Purchase Return, Account Payment, Cash/Bank, Return Deposit).
- Definisikan istilah di glossary sebelum dipakai.
- Kalimat pendek di bagian prosedur.
- **Nol toleransi** di body dokumen akhir: path file, nama class/controller/job, nama tabel/kolom database mentah, ID internal validasi/gap/AC (`V-01`, `GAP-DN-…`, `DN-01`, dll.). Reframe ke bahasa fungsional/awam.
- Menu **sudah punya feature-map** — boleh referensi Label UI dari Feature Map secara natural ("lihat _How DN is created_"), tapi **jangan** tampilkan ID `SF-…` mentah di body teks. Cukup sebut nama fitur/label.
- Tone boleh mengikuti gaya user-guide Finance yang sudah ada di Part 2 (onboarding AP clerk), tapi lengkapi field reference + validasi + gap lebih detail dari requirement.

## 1.3 Struktur dokumen WAJIB (urut tetap)

1. Judul & Ringkasan Singkat
2. Istilah Kunci
3. Kapan & Kenapa Dipakai
4. Prasyarat
5. Posisi dalam Alur Bisnis (`flowchart LR` + keterangan + fallback teks)
6. Lokasi Menu (+ placeholder gambar)
7. Siklus Status (`stateDiagram-v2` + tabel status + tombol per status) — **sertakan note Void/Closed belum tersedia**
8. Tiga Jalur Pembuatan DN (tabel pembanding: Manual vs Purchase Return vs Import AP — masing-masing dengan sub-langkah)
9. Langkah-Langkah Penggunaan Manual (create → Payment Source → Open → Approve → pakai di AP)
10. DN dari Purchase Return (alur terpisah + penjelasan Return Deposit vs Payment Source)
11. DN dari Import Account Payment (ringkas)
12. **Warning: Auto-save saat Create** (redirect otomatis ke edit jika ada DN terakhir; gagal → tetap di create + pesan error)
13. Cara Pakai DN di Account Payment (eligibility + langkah + contoh angka)
14. Total / Paid / Outstanding (cara baca di datalist + kapan berubah)
15. Referensi Field Lengkap — **semua** field form sumber (header + Payment Source + Return Deposit)
16. Fitur Daftar (datalist) — kolom, toolbar, action per status, export
17. Aturan Bisnis & Validasi — **semua** baris validasi di Part 2, format "Kalau kamu…, maka…"
18. Dampak Akuntansi / Jurnal saat Approve (manual vs PR — arah berbeda)
19. Yang Belum Tersedia / Keterbatasan (gap, framing netral; pisahkan Void/Closed deferred)
20. Hubungan dengan Menu Lain (`flowchart TB` + tabel singkat)
21. Troubleshooting
22. FAQ
23. Lihat Juga / Referensi

## 1.4 Standar Diagram Mermaid

- Fence: ` ```mermaid ` di baris sendiri tanpa indent; tutup ` ``` `. Baris pertama = tipe diagram (`flowchart TD/LR/TB`, `stateDiagram-v2`). Hindari `classDiagram`, `gantt`, `pie`.
- Label node: `\n` untuk baris baru (bukan `<br/>`). Jangan unicode arrow (`→`/`←`) di label. Label berkoma/spasi → kutip: `A["teks, koma"]`.
- Edge label berkoma/spasi → kutip: `A -->|"label, text"| B`. Dotted aman: `A -.->|"label"| B`.
- Subgraph: judul berkutip jika ada spasi/`/`/`-`.
- Warna (`classDef`): **hex only** (contoh `#4a90d9`) — jangan `oklch()`, `rgb()`, variabel CSS.
- Pola tiap diagram: (1) judul + 1–2 kalimat konteks, (2) Mermaid happy-path ≤5–10 node, (3) heading **"Keterangan langkah:"**, (4) **fallback teks** numbered list yang berdiri sendiri tanpa diagram (Notion/Lark).

**Diagram wajib di dokumen ini:**
- Section 5: `flowchart LR` — tiga sumber → DN → Approve → Journal → Account Payment → potong hutang PI.
- Section 7: `stateDiagram-v2` — Draft → Open → Approved (final); Open → Rejected → Draft/Open; Draft/Open/Rejected → Delete. Note: Void/Closed belum ada.
- Section 20: `flowchart TB` — hubungan ringkas ke Purchase Invoice, Purchase Return, Account Payment, Journal, General Company, Cash/Bank, Fiscal Period, Credit Note (mirror).

## 1.5 Placeholder Gambar

Format persis:

```text
> 🖼️ **[PLACEHOLDER GAMBAR]** — <deskripsi singkat apa yang harus di-screenshot>
```

Titik wajib (6):
1. Lokasi menu Debit Note di sidebar / daftar transaksi.
2. Form Create — header (supplier, tanggal, currency, rate).
3. Section **Payment Source** di form edit (baris kas/bank + amount).
4. Section **Return Deposit** di DN dari Purchase Return (read-only).
5. Badge status di datalist (Draft / Open / Approved / Rejected) + kolom Paid / Outstanding.
6. Pemilihan DN sebagai sumber di form Account Payment (contoh pemakaian downstream).

## 1.6 Checklist sebelum mengakhiri output

- [ ] Hanya fakta dari Part 2; tidak ada path/class/kolom-DB/ID internal di body.
- [ ] Glossary mencakup semua istilah utama (Payment Source, Return Deposit, Outstanding, Paid, Trx Ref, auto-save last trx).
- [ ] `stateDiagram-v2` lengkap + catatan Void/Closed **belum tersedia** (konsisten di section status, keterbatasan, dan FAQ).
- [ ] Tiga jalur pembuatan dipisah jelas — masing-masing punya sub-langkah dan tabel pembanding.
- [ ] Payment Source (kas/bank) vs Return Deposit (PR) dibedakan konsisten — pembaca tidak bingung kenapa satu section kosong.
- [ ] Section "Cara Pakai di Account Payment" menjelaskan eligibility (supplier sama, currency sama, tanggal DN sebelum AP, outstanding > 0).
- [ ] Semua field form + semua aturan validasi/pesan di Part 2 punya padanan.
- [ ] Dampak jurnal Approve dibedakan: manual (Debit Deposit to Supplier / Credit Cash/Bank) vs PR (Debit Deposit of Purchase Return / Credit Inventory).
- [ ] Export With Details bug untuk DN PR disebutkan di section export, troubleshooting, dan keterbatasan.
- [ ] Auto-save saat Create ada Warning tersendiri.
- [ ] Mirror Credit Note dirujuk singkat — tidak duplikasi detail CN.
- [ ] Setiap Mermaid punya keterangan langkah + fallback teks.
- [ ] 6 placeholder gambar sesuai §1.5.

### Framing sensitif (wajib)

- **Void/Closed belum tersedia:** tandai konsisten dengan penanda (mis. 🔜 atau "belum tersedia") di **setiap** tempat lifecycle status disebut (section status, langkah, FAQ, keterbatasan) — pembaca tidak boleh mengira ada tombol Void yang belum ditemukan.
- **Bug export With Details (DN PR):** framing "keterbatasan yang diketahui"; bukan janji perbaikan.
- **Store legacy di list/export:** kondisi sistem saat ini; supplier pilihan di Create = General Company only.
- **Validasi saldo kas/bank saat approve:** kondisi sistem saat ini (validasi balance di add fund, tapi belum re-validate di approve) — framing netral.
- **Reject → Save tanpa ubah status = kembali Draft:** ini perilaku yang sudah dikonfirmasi, bukan bug — jelaskan clear di langkah + FAQ.

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> Dikompilasi dari `docs/qa-docs/accounting-debit-note/` (repo `olshoperp`, KB/requirement/technical/user-guide/feature-map **v1.0–1.1 status review**, 5 capability cards, per **2026-08-12**). Nama menu: **Debit Note**. Modul: Finance & Accounting / Account Payable. Prefix: `DN`. Route UI: `/accounting/debit-note`.

## §A. Ringkasan & Posisi Bisnis

- **Debit Note (DN)** = dokumen klaim/deposit ke **supplier** — nilai yang supplier "berutang" balik ke perusahaan.
- Setelah **Approved**, DN dipakai di **Account Payment** untuk **memotong hutang** Purchase Invoice tanpa/kurangi kas keluar.
- DN bukan tagihan baru; ini "saldo kredit" ke supplier.
- Secara internal DN adalah subtype Payment dengan prefix `DN`.
- **Mirror:** Credit Note = sisi customer (Account Receivable). Debit Note = sisi supplier (Account Payable).

## §B. Tiga Jalur Pembuatan

| Jalur | Hasil status | Detail isi | Trx Ref |
|-------|--------------|------------|---------|
| **Manual** (form menu DN) + Payment Source Cash/Bank | Open — approve manual | Payment Source (kas/bank) | Kosong atau Reference Doc bebas |
| **Purchase Return billed** ke PI | Open — approve manual | Return Deposit (read-only) — bukan kas/bank | Kode Purchase Return |
| **Import Account Payment** — Adjustment baris `DEBIT NOTE` | Open — approve manual | Fund Deposit to Supplier | Kode Account Payment |

Perbedaan kunci: DN dari Purchase Return **tidak** auto-approved (beda dari sebagian jalur Credit Note dari Sales Return billed).

## §C. Prasyarat

| Prasyarat | Sumber | Catatan |
|-----------|--------|---------|
| Supplier aktif + pengaturan akun supplier lengkap | General Company | Select **hanya** General Company yang ditandai supplier — bukan toko marketplace |
| Minimal satu rekening Cash/Bank aktif dengan mata uang sama | Cash Bank Account | Wajib untuk create/update header manual |
| Mata uang aktif; mata uang utama ter-set | Currency / Company | Kurs dipaksa 1 jika mata uang utama (IDR) |
| Fiscal period terbuka untuk tanggal transaksi | Fiscal Period | Blok create / update tanggal / approve |
| Pengaturan akun Deposit to Supplier (manual) / Deposit of Purchase Return + Inventory (PR) | Company Accounting / Product COA | Wajib saat approve agar journal sukses |
| Privilege menu Debit Note | Gate Role | create / update / delete / approval |

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **Payment Source** | Baris kas/bank yang "mendanai" DN manual |
| **Return Deposit** | Baris nilai DN dari barang retur ke PI — read-only |
| **Outstanding** | Sisa DN belum dipakai di Account Payment |
| **Paid** | Nilai DN yang sudah dipakai di Account Payment yang sudah di-approve |
| **Trx Ref** | Link ke dokumen sumber (Purchase Return atau Account Payment) |
| **Reference Doc** | Catatan teks bebas (manual) — beda dari Trx Ref |
| **Auto-save last trx** | Saat Create, sistem isi dari DN terakhir lalu simpan header otomatis; redirect ke edit |

## §E. Siklus Status

Alur status:

- Create → **Draft** (default) atau langsung **Open** jika auto-save dari DN terakhir berhasil
- Draft → **Open**: pilih radio Open + Save
- Open → **Approved**: Approve
- Open → **Rejected**: Reject
- Rejected → **Draft**: Save edit tanpa ubah status
- Rejected → **Open**: Save edit + pilih radio Open
- **Approved** = final; tidak ada jalur balik
- Delete hanya dari Draft / Open / Rejected

| Status | Editable? | Tombol baris (privilege-aware) |
|--------|-----------|-------------------------------|
| **Draft** | Ya | Edit, Delete, Print |
| **Open** | Ya | Edit, Delete, Print, Approve / Reject |
| **Approved** | Tidak (hanya lihat) | Show, Print — tanpa Delete / Approve |
| **Rejected** | Ya | Edit, Delete, Print |

**Reject → Save:** jika user **tidak** ubah status (hanya edit field lain) → kembali **Draft**; jika user pilih radio **Open** lalu Save → **Open**.

**Void / Closed:** belum didefinisikan untuk DN — **tidak tersedia** saat ini.

**Field kritikal terkunci:** Supplier, Currency, Rate, Date terkunci jika sudah ada baris fund/deposit — hapus detail dulu untuk ubah.

## §F. Create + Auto-save

1. Create → sistem ambil default dari DN terakhir (supplier, currency, rate).
2. Jika ada DN terakhir: prefill + tanggal = sekarang → **simpan otomatis** → redirect ke halaman edit.
3. Jika validasi gagal (fiscal period, currency/bank, dll.): **tetap di create** + pesan error field — tidak redirect.
4. Belum pernah ada DN: user isi manual + Save.

## §G. Generate dari Luar Menu

### G.1 Purchase Return (billed)

- Purchase Return ke PI yang sudah billed disetujui → DN **Open** otomatis.
- Supplier/currency/rate mengikuti PI.
- Description otomatis: `Auto generated from Purchase Return {kode}`.
- Detail = Return Deposit (read-only) — **bukan** Payment Source kas/bank.
- User **tetap harus Approve manual**.

### G.2 Import Account Payment — Adjustment `DEBIT NOTE`

- Import file AP dengan baris Adjustment bertipe DEBIT NOTE → DN **Open**.
- Supplier/currency/rate mengikuti AP.
- Fund = Deposit to Supplier.
- Trx Ref = kode Account Payment.

## §H. Payment Source (manual & AP-import)

- Pilih rekening Cash/Bank (aktif, mata uang sama dengan header).
- Info akun terisi otomatis.
- Field bank jika tipe rekening = bank.
- Amount > 0; validasi **sisa saldo** rekening saat tambah/update baris.
- Satu rekening akun tidak boleh duplikat dalam DN yang sama.

## §I. Return Deposit (sumber Purchase Return)

- Read-only; total mengikuti nilai retur (`grand_total`).
- **Tanpa** Payment Source Cash/Bank.
- Trx Ref menunjuk kode Purchase Return.

## §J. Total / Paid / Outstanding

- **Total (manual):** jumlah semua baris Payment Source (foreign-aware).
- **Total (PR):** nilai retur.
- **Paid:** jumlah pemakaian DN di Account Payment yang **sudah di-approve**. AP draft/open belum menambah Paid.
- **Outstanding:** Total dikurangi Paid (sisa yang masih bisa dipakai).
- Outstanding = 0 → DN tidak bisa dipakai lagi di AP.

## §K. Pemakaian di Account Payment

Setelah DN **Approved** dan masih punya Outstanding > 0:

1. Buka Account Payment → buat/edit pembayaran untuk **supplier yang sama**.
2. Di Payment Source AP, tambah sumber **Debit Note** — pilih DN (currency cocok).
3. Isi amount ≤ sisa Outstanding DN.
4. Alokasi ke PI, pastikan balancing, lalu Approve Account Payment.
5. Kembali ke DN: Paid naik, Outstanding turun.

**Eligibility:** DN Approved + supplier sama + currency sama + tanggal DN sebelum tanggal AP + outstanding > 0.

DN Draft / Open / Rejected **tidak** bisa dipakai sebagai sumber di AP.

Boleh gabung Cash/Bank + Debit Note di satu Account Payment (multi-source).

Contoh:
- DN Approved outstanding 2 jt, PI 10 jt → AP: DN 2 jt + kas 8 jt → Approve → Outstanding DN → 0; PI lunas.
- DN Outstanding 2 jt, input 3 jt di AP → ditolak (melebihi sisa DN).

## §L. Approve — Dampak Jurnal

| Sumber DN | Arah jurnal |
|-----------|-------------|
| Manual (Cash/Bank) | Debit: Deposit to Supplier · Credit: rekening Cash/Bank fund |
| Purchase Return | Debit: Deposit of Purchase Return · Credit: akun Inventory produk |

Setelah approve: DN eligible sebagai deposit di Account Payment (same supplier, same currency, tanggal DN < tanggal AP, outstanding > 0).

## §M. Datalist

**Route:** `/accounting/debit-note`.

### M.1 Kolom

| Kolom | Default tampil | Catatan |
|-------|----------------|---------|
| Trx Code / Trx Date | Ya | Link ke edit; PR ref bisa tampil tanggal dokumen ref |
| Supplier | Ya | General Company supplier; defensif nama Store jika data legacy |
| Description | Ya | Excerpt + tooltip |
| Trx Ref | Ya | Kode PR / AP / kosong — klikable |
| Curr / Rate | Ya | |
| Total Amount | Ya | Manual: jumlah funds; PR: nilai retur |
| Paid | Ya | Jumlah pemakaian DN di AP approved |
| Outstanding | Ya | Total − Paid |
| Trx Status | Ya | Badge |
| Journal | Ya | Kode setelah approve atau kosong |
| Created by / Created at | Ya | Standar |
| Action | Ya | Per status (lihat §E) |

### M.2 Toolbar

Global search, Advanced filter, Create, Show deleted, Column show/hide, Export (Without/With Details, Active Page), Bulk delete, Bulk approve, Multi-select.

### M.3 Export

| Mode | Isi |
|------|-----|
| Without Details | Satu baris per DN — kolom header standar |
| With Details | Satu baris per Payment Source fund + kolom fund |
| Active Page | Subset halaman aktif |

**Keterbatasan export:** With Details hanya membaca data Payment Source (kas/bank) — DN dari Purchase Return (yang hanya punya Return Deposit) bisa **tanpa baris detail** di file Excel.

## §N. Aturan Bisnis & Validasi

Semua baris harus punya padanan "Kalau kamu…, maka…" di dokumen Gemini:

| Kondisi | Perilaku |
|---------|----------|
| Tanggal di luar fiscal period | Blok create / update / approve |
| Supplier kosong atau pengaturan akun supplier tidak eligible | Blok |
| Mata uang tanpa rekening Cash/Bank yang cocok | Blok create / update |
| Kurs ≤ 0 | Blok |
| Approve tanpa Payment Source dan tanpa Return Deposit | Blok |
| Amount Payment Source ≤ 0 | Blok |
| Rekening akun duplikat di Payment Source | Blok |
| Amount melebihi sisa saldo kas/bank | Pesan: `Entered amount exceeds…` / `Insufficient balance…` |
| Delete saat Approved | Blok |
| Approve bukan Open / tidak eligible | Blok |
| Supplier = toko marketplace (bukan General Company supplier) | Tidak muncul di pilihan |

## §O. Referensi Field Form Lengkap

### O.1 Basic Information (header)

| Field | Wajib | Catatan |
|-------|-------|---------|
| Transaction Code | Unik; auto prefix DN | Disabled setelah create |
| Transaction Date | Ya | Default sekarang; min ≈ 6 bulan; max sekarang; fiscal period |
| Supplier | Ya | General Company supplier + pengaturan akun lengkap |
| Reference Doc | Tidak | Teks bebas max 150 — hanya sumber manual |
| Transaction Reference | — | Disabled jika dari PR; hyperlink ke PR / AP |
| Transaction Currency | Ya | Harus ada Cash/Bank match |
| Exchange Rate | Ya, > 0 | Mata uang utama dipaksa 1 + disabled |
| Description | Tidak | Max 150; format otomatis untuk DN dari PR |
| Attachment | Tidak | Editable jika status memungkinkan update |

### O.2 Payment Source (manual & AP-import)

Pilih Cash/Bank (aktif, mata uang sama), info akun otomatis, field bank (jika tipe bank), Amount > 0, validasi sisa saldo saat add/update.

### O.3 Return Deposit (sumber PR)

Read-only; total = nilai retur; **tanpa** Payment Source Cash/Bank.

### O.4 Lainnya

Approval Log & Audit Log: slideover standar. Radio status Draft/Open sticky, tombol Save All, Approve jika eligible.

## §P. Contoh Kasus

| # | Situasi | Hasil |
|---|---------|-------|
| 1 | Create, ada DN terakhir, fiscal OK | Auto-create → redirect edit |
| 2 | Create, fiscal tidak ada | Auto-save gagal + pesan error tanggal |
| 3 | Manual: amount fund > sisa saldo kas/bank | Error sisa tidak cukup |
| 4 | Import AP Adjustment DEBIT NOTE | DN open + fund + trx ref AP |
| 5 | Reject lalu Save **tanpa** ubah status | Status → **Draft** |
| 5b | Reject lalu Save + radio **Open** | Status → **Open** |
| 6 | DN Approved | Show + print; dipakai di AP |
| 7 | Retur billed Rp 2 jt → DN open → approve → bayar PI 10 jt di AP | Potong Rp 2 jt pakai DN, sisanya kas |

## §Q. Keterbatasan yang Diketahui (framing netral)

Tulis sebagai kondisi sistem saat ini. **Jangan** janjikan perbaikan atau tanggal rilis.

### Q.1 Void / Closed belum tersedia

Siklus status DN saat ini berakhir di **Approved** (final). Belum ada definisi Void atau Closed dari sisi end-user. Tandai di **setiap tempat** lifecycle disebut.

### Q.2 Keterbatasan yang diketahui

| Ringkasan (tanpa kode ID) | Arti untuk pembaca |
|---------------------------|--------------------|
| Export With Details hanya membaca data Payment Source (kas/bank) — DN dari Purchase Return bisa tanpa baris detail di Excel | Pakai export Without Details jika butuh laporan DN retur |
| Pilihan supplier di daftar/export bisa menampilkan nama toko (Store) dari data lama; pembuatan DN baru = hanya General Company supplier | Wording legacy di tampilan, bukan di create baru |
| Validasi saldo kas/bank dilakukan saat menambah/update baris Payment Source, tapi belum ada re-validasi saat approve | Saldo bisa berubah antara isi baris dan approve — baseline saat ini |
| Reject → Save tanpa ubah status = kembali Draft | Ini perilaku yang dikonfirmasi — bukan bug; pilih Open eksplisit jika mau approve lagi |

## §R. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Create gagal / auto-save error | Fiscal period / currency / bank | Cek tanggal di period Open; pastikan ada Cash/Bank currency sama |
| Tidak bisa approve | Bukan Open; belum ada fund/deposit | Isi Payment Source atau pastikan Return Deposit dari PR ada |
| Cash/Bank tidak muncul | Currency beda atau tidak aktif | Sesuaikan currency header; aktifkan rekening |
| Amount ditolak | Melebihi sisa saldo kas/bank | Kurangi amount atau pilih rekening lain |
| Tidak bisa potong di AP | DN belum approved / beda supplier / outstanding 0 | Approve DN dulu; cek supplier & currency sama |
| Export With Details kosong untuk DN PR | Export hanya baca Payment Source | Pakai Without Details |
| Langsung ke edit setelah Create | Auto-save dari DN terakhir | Normal — cek pesan error jika ada masalah |

## §S. FAQ

**Q: Kenapa langsung masuk halaman edit setelah Create?**
A: Sistem auto-save dari DN terakhir supaya cepat. Kalau gagal, tetap di form create dengan pesan error.

**Q: Bisa pakai supplier toko marketplace?**
A: Tidak — supplier DN = General Company yang ditandai sebagai supplier.

**Q: Beda Reference Doc vs Trx Ref?**
A: Reference Doc = catatan bebas (manual). Trx Ref = link otomatis ke Purchase Return atau Account Payment.

**Q: Kapan DN bisa potong hutang?**
A: Setelah **Approved**, di Account Payment sebagai sumber Debit Note. Supplier dan currency harus sama, tanggal DN sebelum tanggal AP, outstanding > 0.

**Q: Setelah Reject?**
A: Save edit tanpa ubah status → kembali **Draft**; pilih radio **Open** → siap approve lagi.

**Q: Bisa Void atau Close DN?**
A: Belum tersedia. Siklus saat ini berakhir di Approved.

**Q: Mirror Credit Note?**
A: Credit Note = sisi customer (piutang). Debit Note = sisi supplier (hutang). Perbedaan kunci: DN dari PR tidak auto-approved.

**Q: Kenapa Payment Source kosong di DN dari Purchase Return?**
A: DN PR pakai Return Deposit (read-only), bukan kas/bank. Ini normal, bukan error.

## §T. Menu Terkait

| Menu | Peran |
|------|-------|
| Purchase Invoice | Hutang yang dilunasi via Account Payment; hulu Purchase Return billed |
| Purchase Return | Sumber DN billed retur — Return Deposit |
| Account Payment | Konsumen DN approved; Import AP bisa spawn DN |
| Journal | Hasil approve DN |
| General Company | Master supplier (harus General Company, bukan Store) |
| Cash/Bank Account | Payment Source manual (rekening kas/bank) |
| Fiscal Period | Gate tanggal transaksi |
| Credit Note | Mirror sisi AR — bukan scope DN |

Setelah DN Approved: pastikan masih ada Outstanding > 0 jika ingin pakai di AP; cek kolom Paid di datalist.
