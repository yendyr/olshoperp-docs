---
doc_type: gemini-generation-brief
target_menu: "Fiscal Period"
menu_slug: accounting-fiscal-period
source_of_truth: docs/qa-docs/accounting-fiscal-period/ (repo olshoperp — dibaca 2026-08-07)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Fiscal Period" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v1.0 (93 baris); requirement review v1.0 (267); technical review v1.0 (124);
  user-guide review v1.0 (115); README 40. Total ~639 baris → brief RINGKAS, jangan paksa
  section kosong. Belum ada feature-map.md. Sudah ada user-guide.md (boleh acuan tone).
  Brief ini = bahan draft Help Center konsolidasi pertama dari qa-docs yang sudah review.
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Fiscal Period"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Master dengan siklus bermakna (bukan Active/Inactive biasa).** Fiscal Period punya status **Open → Closed** yang **tidak bisa dibuka lagi**. Pakai `stateDiagram-v2` + tabel status — ini gerbang tanggal hampir seluruh OlshopERP, bukan sekadar master config.
2. **Dua “pintu” yang sering disalahpahami.** (a) Aturan di menu Fiscal Period sendiri (create/edit/delete/close). (b) **Gate global tanggal** yang menolak transaksi di Accounting / Supply Chain / Omni kalau tanggal tidak di period Open atau lebih tua dari 6 bulan. Dokumen harus menjelaskan keduanya tanpa mengulang detail tiap menu konsumen.
3. **Close berurutan + Close menghasilkan jurnal otomatis.** Close period yang berakhir lebih akhir ditolak jika masih ada Open yang berakhir lebih awal. Saat Close berhasil, sistem membuat jurnal auto-approved yang memindahkan saldo Current Profit/Loss ke Retained Profit/Loss — ini dampak akuntansi yang wajib ada section sendiri.
4. **Fiscal Period ≠ period Cash Bank Reconcile.** Period CBR hanya untuk rekonsiliasi rekening; Fiscal Period mengunci tanggal hampir seluruh sistem. Create CBR tetap harus lolos Fiscal Period dulu. Rujuk singkat ke menu CBR — jangan tulis panduan CBR penuh di sini.
5. **Keterbatasan AS-IS yang perlu framing netral.** Ada beberapa kondisi sistem yang beda dari ekspektasi bisnis umum (cek hapus hanya melihat Journal; arah jurnal Close tergantung tanda saldo; panel Learn more di form menggambarkan closing klasik multi-akun sementara sistem hanya transfer Current ↔ Retained; tidak ada validasi start ≤ end). Tulis sebagai **cara kerja sekarang**, bukan janji perbaikan. Beberapa item masih menunggu keputusan bisnis — section terpisah, tetap netral.
6. **Tidak ada feature-map.** Jangan sebut ID `SF-…`. Acuan tone boleh dari user-guide yang sudah ada (onboarding Finance), tapi dokumen Gemini harus lebih lengkap di field, validasi, gate, dan keterbatasan.

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

- Bahasa Indonesia; istilah teknis Inggris boleh (Open, Closed, Journal, Fiscal Period, Current Profit/Loss, Retained Profit/Loss).
- Definisikan istilah di glossary sebelum dipakai panjang.
- Kalimat pendek di bagian prosedur.
- **Nol toleransi** di body dokumen akhir: path file, nama class/controller/job, nama tabel/kolom database mentah, ID internal validasi/gap/AC (`V-01`, `GAP-FP-…`, `FP-01`, dll.). Reframe ke bahasa fungsional/awam.
- **Jangan** sebut ID `SF-…` (menu belum punya feature-map).
- Tone boleh mengikuti gaya user-guide Finance yang sudah ada di Part 2, tapi lengkapi referensi field + validasi + gate yang lebih lengkap dari requirement.

## 1.3 Struktur dokumen WAJIB (urut tetap)

1. Judul & Ringkasan Singkat  
2. Istilah Kunci  
3. Kapan & Kenapa Dipakai  
4. Prasyarat  
5. Posisi dalam Alur Bisnis (`flowchart LR` + keterangan + fallback teks)  
6. Lokasi Menu (+ placeholder gambar)  
7. Siklus Status (`stateDiagram-v2` + tabel status + tombol yang muncul)  
8. Fiscal Period vs Period Cash Bank Reconcile (tabel pembanding singkat)  
9. Langkah-Langkah Penggunaan (buat period → pakai tanggal transaksi → close berurutan)  
10. **Warning: Close bersifat final & harus berurutan**  
11. **Gate tanggal transaksi (aturan 6 bulan + Open)** — Warning/Note untuk operator yang kena error di menu lain  
12. Referensi Field Lengkap  
13. Fitur daftar (datalist) — ringkas  
14. Aturan Bisnis & Validasi — **semua** pesan/perilaku di Part 2, format "Kalau kamu…, maka…"  
15. Dampak Akuntansi saat Close (jurnal otomatis + reset saldo period)  
16. Yang Belum Selaras / Keterbatasan yang Diketahui (framing netral; pisahkan item yang menunggu keputusan bisnis)  
17. Hubungan dengan Menu Lain (`flowchart TB` + tabel singkat)  
18. Troubleshooting  
19. FAQ  
20. Lihat Juga / Referensi  

## 1.4 Standar Diagram Mermaid

- Fence: buka ` ```mermaid ` di baris sendiri tanpa indent; tutup ` ``` `. Baris pertama = tipe diagram (`flowchart TD/LR/TB`, `stateDiagram-v2`). Hindari `classDiagram`, `gantt`, `pie`.
- Label node: `\n` untuk baris baru (bukan `<br/>`). Jangan unicode arrow (`→`/`←`) di label. Label berkoma/spasi → kutip: `A["teks, koma"]`.
- Edge label berkoma/spasi → kutip: `A -->|"label, text"| B`. Dotted aman: `A -.->|"label"| B`.
- Subgraph: judul berkutip jika ada spasi/`/`/`-`.
- Warna (`classDef`): **hex only** (contoh `#4a90d9`) — jangan `oklch()`, `rgb()`, variabel CSS.
- Pola tiap diagram: (1) judul + 1–2 kalimat konteks, (2) Mermaid happy-path ≤5–10 node, (3) heading **"Keterangan langkah:"**, (4) **fallback teks** numbered list yang berdiri sendiri tanpa diagram (Notion/Lark).

**Diagram wajib di dokumen ini:**
- Section 5: `flowchart LR` — COA P/L → Fiscal Period Open → transaksi → Close → jurnal + lock.
- Section 7: `stateDiagram-v2` — Create→Open; Edit/Delete di Open (syarat); Close→Closed permanen.
- Section 17: `flowchart TB` — hubungan ringkas ke Internal Company, Journal, CBR, transaksi lain (node generik, jangan daftar puluhan menu).

## 1.5 Placeholder Gambar

Format persis:

```text
> 🖼️ **[PLACEHOLDER GAMBAR]** — <deskripsi singkat apa yang harus di-screenshot>
```

Titik wajib (5):
1. Lokasi menu Finance Accounting → Master → Fiscal Period / daftar period.
2. Form Create (Name, Start Date, End Date, Description).
3. Badge status Open vs Closed di daftar.
4. Aksi **Close** pada period Open.
5. Contoh pesan error overlap atau "earlier open periods" (opsional jika ada screenshot QA).

## 1.6 Checklist sebelum mengakhiri output

- [ ] Hanya fakta dari Part 2; tidak ada path/class/kolom-DB/ID internal/`SF-…`.
- [ ] Glossary + stateDiagram Open/Closed + penekanan Close **irreversible**.
- [ ] Close berurutan dijelaskan di Warning + langkah + validasi.
- [ ] Gate tanggal (Open + ≤6 bulan + pesan error) ada section sendiri — pembaca yang error di menu lain paham kenapa.
- [ ] Perbandingan Fiscal Period vs period CBR ada, singkat, tidak menduplikasi panduan CBR.
- [ ] Semua field form + semua aturan validasi/pesan di Part 2 punya padanan.
- [ ] Dampak jurnal Close (arah tergantung tanda saldo Current P/L, 2 baris, auto-approved, saldo period jadi 0) lengkap dan netral.
- [ ] Keterbatasan/gap: framing "kondisi sistem saat ini"; item menunggu keputusan bisnis dipisah; **bukan** janji perbaikan / timeline.
- [ ] Setiap Mermaid punya keterangan langkah + fallback teks.
- [ ] 5 placeholder gambar sesuai §1.5.

### Framing sensitif (wajib)

- **Keterbatasan / gap:** tulis sebagai kondisi sistem saat ini, apa adanya — bukan janji perbaikan.
- **Menunggu keputusan bisnis:** tulis netral — baseline sampai ada keputusan lebih lanjut; jangan seolah roadmap.
- **Panel Learn more vs perilaku Close nyata:** jelaskan bahwa teks bantuan di form menggambarkan closing klasik multi-akun, sementara sistem saat ini hanya memindahkan Current ↔ Retained — bisa jadi belum selesai dikembangkan atau memang disederhanakan; jangan label "bug" absolut.
- **Pesan error update yang memakai kata "delete":** sebut sebagai wording sistem saat ini yang bisa membingungkan — tanpa mengarang penyebab teknis.

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> Dikompilasi dari `docs/qa-docs/accounting-fiscal-period/` (repo `olshoperp`, KB/requirement/technical/user-guide **v1.0 status review**, per **2026-08-07**). Nama menu: **Fiscal Period**. Modul: Finance Accounting → Master. Route UI: `/accounting/fiscal-period`.
>
> PM source disebut di README/requirement: Fiscal Period Source of Truth v1.0 (7 Agustus 2026). Brief ini **hanya** memakai layer qa-docs folder menu (bukan file SOT `_meta/sot/`).

## §A. Ringkasan & Posisi Bisnis

- **Fiscal Period** = master rentang tanggal pembukuan per perusahaan (company login).
- Selama status **Open**, transaksi boleh dibuat/diubah pada tanggal di dalam rentang itu.
- Setelah **Closed**, tanggal tersebut terkunci **permanen** (tidak bisa dibuka lagi). Hampir semua modul (Accounting, Supply Chain, Omni) menolak transaksi baru di tanggal itu.
- Saat Close, sistem otomatis memindahkan saldo laba/rugi berjalan (**Current Profit/Loss**) ke laba ditahan (**Retained Profit/Loss**) lewat jurnal yang langsung **approved**, lalu menolkan saldo Current P/L pada period itu.
- Tanpa minimal satu Fiscal Period **Open** yang mencakup tanggal transaksi, hampir semua penulisan transaksi ditolak oleh gate global tanggal.

## §B. Kapan & Kenapa Dipakai

- Menentukan kapan buku boleh dicatat (tanggal dokumen).
- Menutup buku period: mengunci tanggal + memindahkan laba/rugi berjalan ke laba ditahan.
- Operator Finance/Accounting yang mengatur periode pembukaan dan penutupan.

## §C. Prasyarat

| Prasyarat | Sumber | Catatan |
|-----------|--------|---------|
| COA **Current Profit/Loss** | Internal / General Company (Accounting Setting) | Wajib untuk create & close |
| COA **Retained Profit/Loss** | Internal / General Company | Sama; salah satu kosong → ditolak |
| Privilege Fiscal Period | Gate Role | create / update / delete / approval (Close) |
| Konteks perusahaan | Login / token | Data milik company yang sedang login |

Rencanakan rentang tanggal yang **tidak overlap** dengan period lain (non-deleted, company sama).

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **Open** | Periode masih terbuka — transaksi boleh di tanggal dalam rentang |
| **Closed** | Periode terkunci permanen — tidak bisa dibuka lagi |
| **Current Profit/Loss** | Akun laba/rugi berjalan di setting Internal Company |
| **Retained Profit/Loss** | Akun laba ditahan di setting Internal Company |
| **Auto journal Close** | Jurnal otomatis saat tutup periode (langsung approved) |
| **Gate tanggal** | Cek sistem: tanggal transaksi harus di period Open (plus aturan 6 bulan) |
| **Overlap** | Rentang tanggal bentrok dengan period lain |

## §E. Siklus Status

Alur status:

- Create → status **Open**
- Di Open: boleh Edit (jika belum ada Journal di rentang tanggal period); boleh soft-delete (syarat sama); boleh **Close**
- Close → **Closed** (permanen; tidak ada jalur reopen)
- Closed: tidak editable; tombol Edit / Delete / Close disembunyikan; hanya Show

| Status | Editable? | Tombol di daftar |
|--------|-----------|------------------|
| **Open** | Name, dates, description — kecuali sudah ada Journal di rentang | Edit, Close, Delete |
| **Closed** | Tidak | Hanya Show |

**Close berurutan (perilaku sistem sekarang):** ditolak jika masih ada period **Open** lain yang **tanggal berakhirnya lebih awal**.

## §F. Daftar (datalist)

Fitur: Global search, Create, Show deleted, Column show/hide, Export, Bulk delete.

| Kolom | Default tampil | Catatan |
|-------|----------------|---------|
| Name | Ya | Judul period |
| Period | Ya | Format tampilan rentang: `DD-Mmm-YYYY - DD-Mmm-YYYY` |
| Description | Ya | |
| Status | Ya | Badge Open / Closed |
| Active | Ya | Aktif setelah create |
| Created By / At | Ya | Standar |
| Data Owner | Tidak | Pemilik data company |
| Action | Ya | Closed → aksi ubah disembunyikan |

## §G. Referensi Field Form

| Field | Wajib | Aturan | Catatan |
|-------|-------|--------|---------|
| Name | Ya | wajib, maks 50 karakter | |
| Start Date | Ya | wajib, tanggal | Ada panel Learn more di form |
| End Date | Ya | wajib, tanggal | Ada panel Learn more di form |
| Description | Tidak | opsional, maks 150 karakter | |

- **Audit Log:** tersedia sebagai slideover di layar edit.
- Tidak editable setelah Closed.
- Edit diblokir sistem jika ada **Journal** perusahaan bertanggal di dalam rentang period. Pesan yang muncul memakai kata *delete* (bisa membingungkan saat user sedang update — lihat § keterbatasan).
- **Tidak ada** validasi eksplisit bahwa Start Date harus ≤ End Date (kondisi sistem saat ini — lihat § keterbatasan).

## §H. Langkah penggunaan

### H.1 Create

1. Pastikan COA Current & Retained Profit/Loss sudah diisi di Internal Company / Accounting Setting.
2. Create → isi Name, Start Date, End Date (Description opsional).
3. Sistem cek overlap tanggal dengan period lain (non-deleted, company sama).
4. Sukses: status transaksi period = **Open**, period aktif.

Contoh overlap: sudah ada period **1–10 Jul**; create **9–31 Jul** → ditolak: `The selected date is already in use.`

### H.2 Edit

- Hanya period **Open**.
- Ada Journal di rentang → ditolak.
- Overlap dengan period lain (kecuali dirinya sendiri) → ditolak.
- Update sukses: tetap Open.

### H.3 Delete

- Soft-delete.
- Ditolak jika ada Journal di rentang.
- UI menyembunyikan Delete untuk Closed.
- **Lingkup cek hapus/edit saat ini = Journal saja** (bukan seluruh dokumen Supply Chain/Omni) — lihat § keterbatasan.

### H.4 Close Period (tidak bisa dibatalkan)

1. Butuh privilege approval; status tujuan Closed (description maks 150 jika diisi).
2. Cek COA Current & Retained P/L masih configured.
3. Cek tidak ada period Open lain yang berakhir lebih awal.
4. Dalam satu proses penutupan:
   - Sistem membuat Journal (awal status Open) dengan tanggal = akhir hari pada **End Date** period, mata uang utama, rate 1.
   - Detail jurnal dari saldo Current Profit/Loss period saat close:
     - Jika saldo **&lt; 0:** Credit Current P/L, Debit Retained P/L (nilai absolut).
     - Jika saldo **≥ 0** (termasuk 0): Debit Current P/L, Credit Retained P/L (nilai absolut).
   - Jurnal langsung di-approve; saldo Current P/L period diset **0**; status period jadi **Closed**.
5. Pesan sukses: `The document has been successfully closed.`

Catatan: beberapa ekspektasi bisnis selalu Debit Current / Credit Retained; perilaku sistem sekarang **bergantung tanda saldo** — lihat § keterbatasan.

## §I. Gate global tanggal transaksi (konsumen hampir semua modul)

Dipakai hampir semua penulisan transaksi. Urutan/kondisi dan pesan:

| # | Kondisi | Pesan |
|---|---------|-------|
| 1 | Perusahaan tidak ditemukan | `Company not found.` |
| 2 | Belum ada fiscal period sama sekali | `To create any transaction in OlshopERP, an active fiscal period must exist.` |
| 3 | Format tanggal tidak valid | `Invalid transaction date format.` |
| 4 | Tanggal lebih tua dari 6 bulan ke belakang | `Transaction date must be within the past 6 months.` |
| 5 | Tanggal jatuh di period **Open** (dan lolos 6 bulan) | Lolos |
| 6 | Tanggal jatuh di period **Closed** | `Fiscal period {date} is already closed.` |
| 7 | Tanggal di luar semua period | `Date must be in an active fiscal period.` |

Aturan **6 bulan** berlaku di **semua** pemanggil gate.

## §J. Urutan vs Cash Bank Reconcile

- Saat **create** Cash Bank Reconcile: cek Fiscal Period (start & end) **lebih dulu**, baru cek overlap period CBR.
- Saat **approve Journal**: cek Fiscal Period **lebih dulu**, baru cek kunci rekonsiliasi cash bank.
- Kunci period CBR setelah Approve = urusan terpisah (dokumentasikan di menu Cash Bank Reconcile, bukan di sini).

**Pembanding singkat:**

| | Fiscal Period | Period Cash Bank Reconcile |
|--|---------------|----------------------------|
| Lingkup | Mengunci tanggal hampir seluruh OlshopERP | Rekonsiliasi rekening tertentu |
| Create CBR | Harus lolos gate Fiscal dulu | — |
| Reopen setelah tutup | Tidak (Closed final) | [NEEDS SOURCE untuk detail CBR di brief ini — rujuk docs CBR] |

## §K. Aturan bisnis & validasi (menu Fiscal Period)

Semua baris harus punya padanan "Kalau kamu…, maka…" di dokumen Gemini:

| Kondisi | Pesan / behavior |
|---------|------------------|
| Name / Start / End / Description tidak valid | Validasi form standar (Name wajib maks 50; tanggal wajib; Description opsional maks 150) |
| COA Current atau Retained P/L belum di-set | `Please configure your Profit/Loss COA accounts in Accounting Settings first.` |
| Rentang overlap period lain | `The selected date is already in use.` (terkait field tanggal) |
| Update atau delete padahal ada Journal di rentang | `Cannot delete fiscal period data because there are existing transactions within this period's date range.` (teks memakai kata delete juga saat update) |
| Close padahal masih ada Open yang berakhir lebih awal | `Cannot close this fiscal period because there are earlier open periods. <br> Please close all previous open periods first.` |
| Close ditolak karena data sudah tidak boleh dimodifikasi (pesan sistem) | `This fiscal perios and it's properties already closed, you can't modify this data anymore.` (ada typo *perios* di sistem — sebut apa adanya) |
| Close sukses | Status Closed + jurnal otomatis |

Ditambah seluruh pesan gate konsumen di §I.

## §L. Dampak akuntansi / jurnal saat Close

- Tepat **2 baris** detail; total Debit = total Credit = nilai absolut saldo Current P/L sebelum di-reset.
- Tanggal jurnal = akhir hari End Date period.
- Setelah Close: status period Closed; saldo Current P/L period = 0; tidak ada API/jalur reopen.
- Soft-delete Fiscal Period **tidak** menghapus jurnal historis.

## §M. Fitur & perilaku yang perlu penanda hati-hati (bukan TO-BE fitur terpisah)

Tidak ada fitur "belum aktif" besar yang diiklankan di UI sebagai TO-BE. Yang ada = **keterbatasan / ketidakselarasan AS-IS** (lihat §N).  
Panel **Learn more** di form Start/End menggambarkan closing klasik multi-akun; perilaku Close nyata hanya transfer Current ↔ Retained — tandai konsisten di section field, Close, dan keterbatasan agar pembaca tidak mengira closing multi-akun sudah jalan.

## §N. Keterbatasan yang diketahui (framing netral)

Tulis sebagai kondisi sistem saat ini. **Jangan** janjikan perbaikan atau tanggal rilis.

### N.1 Menunggu keputusan bisnis

| Ringkasan (tanpa kode ID) | Arti untuk pembaca |
|---------------------------|--------------------|
| Hapus/edit diblokir hanya jika ada **Journal** di rentang; requirement bisnis sering mengartikan "ada transaksi apa pun" | Bisa masih bisa menghapus period yang sudah punya dokumen non-Journal di rentang tanggal — baseline sampai keputusan bisnis |
| Arah jurnal Close: sistem mengikuti tanda saldo Current P/L (`<0` → Credit Current); ekspektasi lain selalu Debit Current / Credit Retained | Jelaskan perilaku bertanda; catat bahwa keputusan bisnis masih menunggu jika ingin diseragamkan |
| Teks Learn more = closing klasik multi-akun; sistem hanya Current ↔ Retained | Bantuan UI bisa terlihat lebih luas dari yang dijalankan sistem |

### N.2 Keterbatasan / inkonsistensi yang diketahui (open)

| Ringkasan | Arti untuk pembaca |
|-----------|--------------------|
| Pesan blokir **update** memakai copy *Cannot delete…* | Wording bisa membingungkan |
| Typo di pesan: `fiscal perios` | Tampil apa adanya di sistem |
| Pemeriksaan "boleh close" fokus privilege approval; tidak secara ketat menolak ulang Close yang sudah Closed — risiko journal amount 0 jika dipanggil ulang | Baseline teknis; hindari Close berulang |
| Tidak ada validasi Start Date ≤ End Date | User bisa input rentang terbalik tanpa ditolak validasi khusus |

*(Satu item dokumentasi lama tentang QA docs draft sudah ditutup — tidak perlu diulang sebagai keterbatasan produk.)*

## §O. Acceptance / kriteria perilaku (untuk checklist Gemini saja — jangan tampilkan ID di dokumen akhir)

Dokumen akhir harus memastikan pembaca paham bahwa sistem:
- Create wajib Name, Start, End; COA P/L harus configured.
- Overlap rentang ditolak.
- Update/delete ditolak jika ada Journal di rentang.
- Close berurutan; irreversible.
- Close menghasilkan jurnal 2 baris + Current P/L period → 0 + status Closed.
- Gate global: tanggal di Open + dalam 6 bulan terakhir; Closed / luar period / tanpa period ditolak.
- Keterbatasan di atas terdokumentasi netral.

## §P. Troubleshooting

| Gejala | Solusi |
|--------|--------|
| Tidak bisa create period | Isi Current & Retained P/L di Internal Company |
| Date already in use | Ubah start/end agar tidak overlap |
| Tidak bisa Close | Close period Open yang berakhir lebih awal dulu |
| Transaksi: fiscal closed | Pakai tanggal di period Open — Closed tidak bisa dibuka |
| Transaksi: past 6 months | Geser tanggal ke dalam 6 bulan terakhir (tetap di Open) |
| Tidak bisa delete | Biasanya sudah ada Journal di rentang — jangan hapus |
| Please configure your Profit/Loss COA… | Isi di Internal Company dulu |
| …earlier open periods… | Close period sebelumnya dulu |

## §Q. FAQ

**Q: Buka lagi period Closed?**  
A: Tidak. Close bersifat final.

**Q: Beda Fiscal Period vs period Cash Bank Reconcile?**  
A: Fiscal Period mengunci tanggal di hampir seluruh OlshopERP. Period CBR hanya untuk rekonsiliasi rekening — create CBR tetap harus lolos Fiscal Period dulu.

**Q: Apa yang terjadi ke laba rugi saat Close?**  
A: Saldo Current Profit/Loss period dipindah ke Retained Profit/Loss lewat jurnal otomatis (langsung approved), lalu saldo Current P/L period dinolkan. Arah Debit/Credit mengikuti tanda saldo (lihat §L / §N).

**Q: Transaksi ditolak padahal sudah create period?**  
A: Tanggal harus di period Open, tidak lebih tua dari 6 bulan, COA P/L sudah set; cek apakah period untuk tanggal itu sudah Closed.

**Q: Tidak bisa Close Juli, Juni masih Open?**  
A: Wajib tutup Open yang berakhir lebih dulu.

**Q: Tidak bisa hapus period?**  
A: Biasanya sudah ada Journal di rentang (sistem saat ini cek Journal saja).

## §R. Menu terkait

| Menu | Peran |
|------|-------|
| Internal / General Company | Prasyarat COA Current & Retained P/L |
| Chart of Account | COA yang di-mapping ke setting |
| Journal | Gate tanggal; penerima jurnal otomatis Close |
| Supplier Invoice / Purchase Invoice / Credit Note / Debit Note / Payments / Returns / Instant Settlement / IVA (dan sejenis) | Gate tanggal |
| Cash Bank Reconcile | Create cek fiscal dulu; kunci CBR terpisah |
| Trial Balance / Balance Sheet / General Ledger | Baca saldo; Current P/L terkait period |
| Supply Chain (inbound, delivery, mutation, opname, assembly, dll.) | Gate tanggal |
| Omni (sales order, wave, handover, settlement, dll.) | Gate tanggal |

Setelah Close: pastikan minimal satu period Open tetap tersedia untuk tanggal kerja hari ini; uji create Journal/Invoice dengan tanggal di dalam period Open; cek jurnal otomatis muncul saat Close.
