---
name: olshoperp-testcase-authoring
description: >-
  Membuat card Jira Test Case (ETM) dari origin: gap vs AC, minimal set per test_type
  (happy/negative/edge/permission/regression/cross-menu), relasi antar menu, Expected hanya
  dari requirement, data uji bertanda QA ETM-… (jangan hapus), terbitkan + Relates. Jira saja
  (bukan TC-*.md). Pakai saat "buatkan test case", "cek TC kurang", "TC untuk ETM-xxxxx".
  Menjalankan test = skill olshoperp-card-testing.
---

# OlshopERP — Membuat Test Case (Jira saja)

**Baca file ini dulu** untuk tugas buat/cek kelengkapan TC. Jangan load banyak rules —
aturan authoring sudah di sini. Detail field/alat: [reference.md](reference.md).  
Menjalankan test / isi Actual / Telegram → skill **`olshoperp-card-testing`**.

Bahasa: Indonesia sehari-hari, non-teknis; label tombol/field = teks di aplikasi.

**Sejak 22 Okt 2026:** dokumentasi TC **hanya di Jira**. Jangan buat/update/renumber `TC-*.md`.

---

## 0. Prinsip mutlak

1. **Expected Result tidak boleh dikarang.** Wajib punya rujukan requirement yang jelas (§2).
2. **Data uji tidak boleh dihapus** setelah disiapkan/dijalankan (kecuali skenario memang menguji hapus).
3. **Jejak data wajib:** nomor card Jira (`QA ETM-xxxxx`) **atau**, jika uji tanpa card, teks skenario yang jelas (§4).
4. Skill ini **hanya membuat/memperbarui isi card TC**. Status Testing Progress / Actual / Test Result / Done = skill testing.
5. Hemat token: `fields=` seperlunya; tulis banyak TC dalam **satu** file data → `tools/tc_lib.py`.

---

## 1. Cek TC yang kurang (gap vs AC)

1. Origin: `GET issue/{key}?fields=summary,description,comment,issuelinks,customfield_10495,customfield_10429`.
2. TC existing: issuelinks + JQL `issuetype = "Test Case" AND (summary ~ "…" OR text ~ "ETM-xxxxx")` — cegah duplikat.
3. Baca `qa-docs/{menu}/requirement.md` — status harus **review** atau **approved** (§2).
4. Petakan **tiap AC → TC** (penuh / sebagian / tidak ada). Laporkan: requirement bilang X · kode/UI melakukan Y · TC kurang Z.
5. Prioritas: High = alur utama + celah yang pernah gagal; sisanya Medium.
6. Konflik requirement vs perilaku kode → **tanya Yemima sekali**. Sementara itu Expected tetap dari **requirement**, dengan catatan di Additional Context: “perilaku staging saat ini diperkirakan berbeda”.

### Sebelum buat card baru (pohon singkat)

| Situasi | Aksi |
|---------|------|
| Belum ada TC yang cover AC | **Buat** TC baru (wajar untuk Improvement/CR) |
| Ada TC, Expected & langkah sama | **Reuse** — jangan duplikat; sebut key TC existing |
| Ada TC, Expected berubah menurut requirement baru | **Update** description TC existing (bukan kembaran) |
| Expected lama masih berlaku untuk kondisi lain | **TC baru** + bedakan kondisi di judul keduanya |
| Ragu duplikat | Tandai di laporan; lanjut setelah klarifikasi singkat |

---

## 2. Expected Result — anti-ngarang (WAJIB)

| Sumber Expected | Boleh? |
|-----------------|--------|
| `qa-docs/{menu}/requirement.md` (status **review** / **approved**) — sebut § / judul section | **Ya** — default |
| Acceptance Criteria di description card origin, **setelah** dicek selaras requirement | Ya, dengan catatan “sesuai AC origin + requirement §…” |
| Pesan error / guard backend (FormRequest) | Hanya sebagai **bentuk penolakan yang diverifikasi**; norma bisnis tetap dari requirement |
| Asumsi agent, “biasanya ERP…”, tebak dari kode tanpa requirement | **Tidak** |
| Requirement **draft**, kosong, atau tidak ketemu menu | **STOP** — jangan terbitkan TC; laporkan gap ke Yemima |

Di setiap card TC, Additional Context / notes **wajib** memuat baris rujukan, contoh:

```text
Rujukan Expected: qa-docs/{menu}/requirement.md §… (status: review)
```

Kalau AC card origin **bertentangan** dengan requirement: Expected = requirement; catat selisih AC di Additional Context; jangan diam-diam ikut AC yang salah.

---

## 2A. `test_type` — wajib per card + minimal set (dari rule 13 §3A)

Tanpa tipe yang disiplin, produksi TC condong **happy-only**. Satu card Jira = **satu** `test_type`. Label Jira: `test-type-{nilai}`.

| `test_type` | Untuk apa | Contoh |
|-------------|-----------|--------|
| `happy` | Alur normal yang diharapkan berhasil | Create PR 2 produk → status Open |
| `negative` | Sistem **harus menolak** — input invalid, syarat tak terpenuhi, guard | Approve tanpa COA → ditolak; qty > outstanding → ditolak |
| `edge` | Batas/varian tak lazim yang tetap benar | Qty = outstanding persis; fallback VAT; status boundary |
| `permission` | Hak akses & visibilitas per role/company | Tombol Approve hilang untuk non-approver |
| `regression` | Perilaku lama tetap jalan setelah perubahan | Template import lama tetap diterima |
| `cross-menu` | Dampak di **menu lain** (side-effect) — bukan cuma “klik di menu A sukses” | Outstanding PR turun setelah PO; journal muncul setelah payment approve |

### Minimal set sebelum bilang “TC origin sudah cukup”

| Jenis origin / menu | Minimal kandidat (dari requirement/AC yang relevan — jangan ngarang) |
|---------------------|------------------------------------------------------------------------|
| Menu **transaksional** (stok / GL / status machine / dokumen berantai) | **Bukan** happy saja. Minimal: **1 `happy` + 1 `negative` (guard utama) + 1 `edge` (batas status/qty/aturan)** |
| AC/requirement menyebut dampak menu lain, outstanding, journal, stok, laporan | Tambah **≥1 `cross-menu`** tersendiri (jangan digabung ke Expected happy) |
| Card menyentuh role/akses | Pertimbangkan **`permission`** |
| Card = perbaikan bug / jaga perilaku lama | Pertimbangkan **`regression`** (+ tipe lain yang relevan) |
| Menu master sederhana, AC hanya CRUD tampilan | Happy wajib; negative/edge hanya jika requirement/guard menyebut |

**Pecah skenario — jangan melebur:**
- Item validasi negatif/edge di test plan / AC **bukan** baris tambahan di Expected TC `happy` → **card terpisah** `negative` / `edge`.
- Create + cek dampak menu lain → pecah: happy/edge di menu sumber + **`cross-menu`** untuk assert di menu target.
- Satu skenario test plan bernomor = kandidat satu card (kecuali benar-benar duplikat).

**Negative:** gali dari requirement + guard UI/backend yang **bisa dipicu dari UI**. Pesan error = bentuk penolakan yang diverifikasi; norma bisnis tetap dari requirement. Guard yang mengungkap aturan belum ada di requirement → laporkan **gap docs**, jangan diam-diam jadi Expected.

Laporan ke Yemima wajib tabel singkat: tipe → ada/tidak → key TC (baru/reuse) → defer/gap.

---

## 2B. Relasi antar menu & `cross-menu` (ERP — perhatikan)

OlshopERP sering: aksi di menu A mengubah outstanding / stok / journal / status di menu B–C. Skill ini **wajib** menimbang itu saat gap analysis — bukan setelah happy path saja.

### Kapan wajib ada kandidat `cross-menu`

Tandai di laporan gap jika requirement/AC/card menyebut (atau jelas dari § requirement menu) salah satu:

| Sinyal | Contoh arah cek (hanya yang tertulis di docs) |
|--------|-----------------------------------------------|
| Dokumen sumber → turunan | PR→PO, PO→PI/GR, SO→delivery/invoice, dll. |
| Outstanding / sisa qty / alokasi | Qty di dokumen A berubah setelah aksi di B |
| Stok / warehouse | Mutasi setelah receive, adjust, sales, dll. |
| GL / journal / payment | Journal atau saldo muncul/berubah setelah approve |
| Void / reject / unapprove | Side-effect terbalik di menu terkait |
| Laporan / filter hingga angka di menu lain | Angka di laporan mengikuti transaksi |

### Cara menulis TC `cross-menu` (kedalaman)

1. **Precondition:** data di menu sumber **dan** kondisi awal di menu target (angka/status sebelum aksi) — supaya assert punya baseline.
2. **Steps:** aksi di menu sumber → **pindah/buka menu target** → Cek: field/status/angka eksak.
3. **Expected:** hanya side-effect yang ada di requirement (sebut § menu sumber **dan/atau** menu terkait). Jangan tebak “harusnya journal muncul” tanpa docs.
4. **Satu dampak utama per card** bila memungkinkan (mis. outstanding saja vs journal saja) supaya Failed mudah dilacak; gabung hanya jika requirement mengikat keduanya sebagai satu AC.
5. Chain sangat panjang (≥3 menu, banyak status) → di laporan usulkan set TC bertingkat / tanya Yemima mana yang High dulu; **jangan** satu card raksasa “E2E semua modul”.
6. Tanpa rujukan requirement untuk side-effect → **gap / defer**, bukan TC `cross-menu` karangan.

Selaras anti-ngarang §2. Detail contoh & checklist: [reference.md](reference.md) §G.

---

## 3. Isi satu card TC

- **Judul:** `[Nama Menu] - deskripsi singkat (tipe)` — nama menu persis di app; satu fokus gejala/skenario.
- **Section (urut):** Summary → Environment → Precondition Data (+ tabel) → Steps to Reproduce → Expected Result → catatan penguji → Additional Context (rujukan requirement **wajib** di sini).
- **Environment:** default **Staging**; company ikuti urutan skill testing bila tidak disebut: **153 → 112 → 13**. Cantumkan URL list/edit bila ada.
- **Steps:** label UI persis; langkah penting diikuti “Cek: …” + angka eksak.
- **Tone:** non-teknis di Summary/Steps/Expected; nama tabel/class/controller hanya di Additional Context bertanda “Catatan teknis”.
- Baca FE (modal/form) sebelum menulis langkah isian — jangan tebak mata uang kolom, nama tombol, dll.
- Hitung angka dengan hati-hati (pembulatan/kurs); hindari nilai tepat di batas (mis. 0,005) kecuali requirement menguji batas itu.
- Cek fixture tidak sedang di-reserve (draft/open) sebelum dijadikan data uji bersama.

### Precondition Data — harus bisa dijalankan (WAJIB)

Di Precondition / tabel data uji, sebutkan identitas yang bisa dipakai penguji. **Dilarang** kalimat kabur seperti “siapkan data yang sesuai” / “pakai transaksi valid” tanpa kode.

| Wajib (bila relevan skenario) | Contoh |
|-------------------------------|--------|
| Company | Dev Staging (153) / sesuai Environment |
| Akun atau role | Jika TC `permission` atau tombol tergantung role |
| Identitas data | Kode PO/SO/SKU/Customer + URL edit **atau** langkah buat baru + tandai `QA ETM-xxxxx` |
| Status / angka awal | Open, outstanding = 10, stok gudang X = … |
| Baseline menu target | Untuk `cross-menu`: angka/status di menu B **sebelum** aksi di menu A |

Kalau data belum ada di staging: tulis cara buat bertanda jejak §4 — jangan mengasumsikan fixture “sudah ada” tanpa menyebut kode.

Contoh bentuk lengkap (1 set tipe): [reference.md](reference.md) §H.

---

## 3A. Soft cap jumlah card (bukan approval)

**Boleh create langsung** (tanpa tunggu OK Yemima). Batasi volume supaya tidak banjir:

| Situasi | Panduan |
|---------|---------|
| Origin Improvement/CR biasa | Prefer **≤ 6** card baru per origin di satu batch. Prioritas: High dulu (happy inti + negative guard kritis + cross-menu side-effect kritis bila ada). |
| Butuh > 6 | Boleh, tapi di **laporan chat ke Yemima** sebutkan kenapa; kandidat ekstra yang Medium/Low → **defer** (daftar singkat di laporan, jangan dipaksa create semua). |
| Menu master / AC sempit | 1–3 card sering cukup; jangan memaksa full minimal set transaksi jika requirement tidak menyentuh stok/GL/status. |

Defer ≠ diam: tulis di laporan “belum diterbitkan: … (alasan)”. Relates + field Jira tetap sesuai §5 — **tidak** wajib komentar ekstra di card origin.

---

## 4. Data uji — jejak & larangan hapus

### Jejak (wajib di Precondition / Steps / catatan penguji)

| Situasi | Cara menandai data |
|---------|-------------------|
| Ada card Jira (TC atau origin) | Isi Description / Reference / Name data dengan **`QA ETM-xxxxx`** (boleh + tanggal). Prefix kode **`QA-AUTO-`** bila memungkinkan. |
| **Tanpa** card Jira (eksplorasi / permintaan ad-hoc) | Jangan biarkan data “anonymous”. Tulis jejak jelas, contoh: `QA-AUTO skenario: filter Net Sales kurang dari COGS, 22-10-2026` atau `QA MANUAL: verifikasi tombol Extract bundle — permintaan Yemima chat …`. |

Di description card TC, instruksikan penguji:

- Menandai semua data **buatan** dengan jejak di atas.
- Menyebut **kode data + URL edit** di Actual Result nanti.
- **Jangan menghapus** data setelah uji (kecuali Expected memang menguji hapus / show deleted).

### Larangan

- **Dilarang** menulis di card: “hapus data setelah selesai”, “bersihkan fixture”, “rollback data uji” — kecuali skenario TC = uji delete.
- Data yang menahan fixture bersama: **tetap jangan hapus** dari instruksi TC; pilih fixture QA khusus atau catat di notes bahwa data shared — koordinasi dengan Yemima, bukan auto-delete.
- Tyas/Merdian: authoring default Environment = **Staging**. Jangan susun TC yang mengharuskan create di Tyas/Merdian.

Selaras skill **`olshoperp-card-testing`** § data uji / QA-AUTO.

---

## 5. Menerbitkan card

1. Salin `tools/example_tc_data.py` → isi CFG + TCS (lihat reference §C). Pastikan tiap TC punya `req` (path + § requirement).
2. `python3 tools/tc_lib.py file_data.py create` → issuetype Test Case `10051`, Menu, Request ID (salin origin atau `none`), Story Points 1, labels `[ETM-origin, test-case, test-type-…]`, assignee Yemima (reference), Relates ke origin, jeda ~2,5 dtk.
3. Site: **hanya ETM** (`erpintegration.atlassian.net`).
4. Update isi: ubah file data → `… update`. Verifikasi GET: Not Execute, link ada, description memuat rujukan requirement.
5. Laporan ke Yemima (chat): tabel card → tipe → skenario → rujukan § → data kunci; reuse vs baru; **defer/gap** bila ada (§3A). Tidak wajib komentar di card origin (Relates sudah cukup).

**Jangan:** `#testcase {key} ready` kecuali Yemima mengetik perintah itu.

---

## 6. Setelah card siap

Menjalankan uji, Testing Progress, Actual, Test Result, Telegram, Failed→Error →  
**skill `olshoperp-card-testing`** (bukan skill ini).

---

## 7. Jangan

- Mengarang Expected tanpa requirement review/approved (atau AC yang sudah divalidasi ke requirement).
- Menutup origin dengan **happy-only** padahal menu transaksi / AC punya guard, batas, atau dampak menu lain (§2A–2B).
- Melebur negative/edge/cross-menu jadi baris Expected di TC happy.
- Membuat `qa-docs/.../test-cases/` atau renumber.
- Mengisi Actual / Test Result / Done dari skill ini.
- Menginstruksikan hapus data uji “agar rapi”.
- Menulis langkah UI dari asumsi tanpa buka FE/docs.
- Query DB mutasi untuk “menyiapkan” data TC.

---

## 8. Checklist sebelum bilang “TC siap”

- [ ] Requirement status review/approved; tiap TC punya baris **Rujukan Expected**
- [ ] Tidak duplikat (reuse/update dipertimbangkan)
- [ ] Tiap card satu `test_type` + label `test-type-…`
- [ ] Minimal set §2A terpenuhi **atau** gap/defer tertulis di laporan (bukan diam)
- [ ] Sinyal relasi antar menu (§2B) sudah ditimbang; `cross-menu` punya assert di menu target + baseline
- [ ] Negative/edge tidak melebur ke Expected happy
- [ ] Precondition punya identitas data / baseline (bukan “siapkan data yang sesuai”)
- [ ] Soft cap §3A dihormati atau kelebihan dijelaskan + defer di laporan
- [ ] Precondition/Steps memerintahkan jejak `QA ETM-…` atau teks skenario tanpa Jira
- [ ] **Tidak** ada instruksi hapus data (kecuali TC uji hapus)
- [ ] Environment Staging + company jelas
- [ ] Relates + Request ID + Menu terisi; status Not Execute
- [ ] Laporan chat ke Yemima: tabel tipe → cover/reuse/baru/defer/gap
