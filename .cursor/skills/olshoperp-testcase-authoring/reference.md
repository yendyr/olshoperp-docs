# Referensi — olshoperp-testcase-authoring

Dipakai bersama [SKILL.md](SKILL.md). Jangan diikuti sendirian tanpa skill.

---

## A. Field & konstanta Jira (ETM)

| Item | Nilai |
|------|--------|
| Site / cloudId | `erpintegration.atlassian.net` / `44cc9820-3372-4c12-884c-698b1397173c` |
| Issuetype Test Case | `10051` |
| Status awal | Not Execute |
| Story Points | `1` |
| Assignee (authoring) | Gantian **Firda ↔ Jeiniffer** (QA tester), kecuali user menyebut nama → `CFG["assignee"]`. Rotasi dimulai dari `CFG["assignee_start"]` (default Firda); accountId dicari lewat Jira user search di `tools/tc_lib.py` |
| Request ID | Ikut rule `12`: ID asli atau literal `none`. `-`, kosong, spasi = tidak valid (jangan disalin; origin invalid → ID valid dari relasi origin, else `none`). Layar create TC tidak menampilkan field ini — set lewat API. Setelah create, verifikasi GET (rule `12`) |
| Menu | **Wajib.** Nama menu persis di app = `[Nama Menu]` di judul (`customfield_10429`). Kosong → TC tidak bisa ke TESTING PROGRESS. Setelah create, verifikasi GET (rule `12`) |
| Labels | `ETM-{origin}`, `test-case`, `test-type-{happy\|negative\|…}` |
| Link | Relates → card origin |
| Jeda create | ~2,5 detik antar card |

Jangan isi Testing Progress / Actual Result / Test Result dari skill authoring.

---

## B. Template description (ringkas)

```text
## Judul Card
[Nama Menu] - short desc test case (tipe)

## Description

**Summary**
[Ringkasan skenario + tujuan]

**Environment**
- Menu/Fitur: …
- Environment: Staging
- Company: … (urutan default 153 → 112 → 13 bila tidak disebut)
- URL (retest): …

**Precondition Data**
[Company, akun/role bila perlu, kode data + URL atau cara buat + QA ETM-xxxxx]
[Status/angka awal; untuk cross-menu: baseline di menu target]
[JANGAN: "siapkan data yang sesuai" tanpa identitas]
[JANGAN hapus data setelah uji kecuali skenario uji hapus]

**Steps to Reproduce**
1. …
2. … (Cek: … angka eksak)

**Expected Result**
[Hanya dari requirement.md §… / AC yang sudah divalidasi ke requirement]

**Catatan penguji**
- Tandai data: QA ETM-… / QA-AUTO-…
- Cantumkan kode data + URL edit di Actual Result
- Jangan hapus data uji

**Additional Context**
Rujukan Expected: qa-docs/{menu}/requirement.md §… (status: review)
[Catatan teknis opsional]
```

Tone: rule `12` / `24` — non-teknis di section utama.

---

## C. tools/tc_lib.py

Lokasi: `.cursor/skills/olshoperp-testcase-authoring/tools/`.

`jira.sh` (dan `qm.py`) **tidak** disalin ke folder ini — satu salinan kanonis di `.cursor/skills/olshoperp-card-testing/tools/`; `tc_lib.py` memanggil `jira.sh` dari path itu. Jangan buat salinan baru di sini.

| Perintah | Fungsi |
|----------|--------|
| `python3 tools/tc_lib.py file_data.py create` | Buat card + Relates + keys JSON |
| `python3 tools/tc_lib.py file_data.py update` | Perbarui description dari file yang sama |

Contoh: salin `example_tc_data.py`. Field penting per TC:

| Field | Wajib | Isi |
|-------|-------|-----|
| `req` | **Ya** | Path + § requirement (anti-ngarang) |
| `title` / `summary` / `steps` / `expected` | Ya | Sesuai template |
| `pre` / `data_tables` | Disarankan | Termasuk jejak data |
| `notes` | Disarankan | “Jangan hapus…”, cara tandai QA ETM-… |
| `ttype` | Ya | Satu tipe per card |
| `cleanup` di CFG | — | **Bukan** instruksi hapus data. Pakai teks jejak + larangan hapus (lihat example) |

---

## D. Data uji — jejak cepat

| Ada Jira? | Contoh jejak di Description/Name data |
|-----------|----------------------------------------|
| Ya | `QA ETM-15796` / `QA-AUTO-ETM-15796-sku-alt` |
| Tidak | `QA-AUTO skenario: Net Sales < COGS filter, 22-10-2026` |

Data **tidak dihapus** setelah uji (selaras skill card-testing).

---

## E. Batasan dokumen repo

- **Jangan** create/edit `qa-docs/**/test-cases/TC-*.md` untuk SoT baru (kebijakan 26 Okt 2026).
- File markdown TC lama boleh dibaca untuk konteks historis; SoT aktif = **Jira**.
- Requirement/KB/technical tetap read-only kecuali alur Yemima.

---

## F. Serah ke skill testing

Setelah card Not Execute + Relates OK → penguji / agent memakai **`olshoperp-card-testing`** untuk eksekusi, Actual, Test Result, Telegram, Failed→Error.

---

## G. `test_type` & relasi antar menu (ringkas)

Sumber kanonik historis: rule `13-test-case-format.mdc` §3A / §5C. **Untuk authoring Jira, ikuti SKILL.md §2A–2B** (skill self-contained; rule 13 requestable untuk markdown TC lama / lint).

### Minimal set (salin mental)

- Transaksional → `happy` + `negative` (guard utama) + `edge` (batas) — dari requirement/AC, bukan karangan.
- Ada side-effect docs → tambah card `cross-menu` terpisah.
- Jangan melebur section validasi negatif ke Expected happy.

### Checklist cepat `cross-menu`

- [ ] Menu sumber + menu target disebut di Steps
- [ ] Baseline angka/status di target **sebelum** aksi (Precondition atau langkah Cek awal)
- [ ] Expected mengutip § requirement (sumber dan/atau target)
- [ ] Satu dampak utama per card bila Failed harus mudah dilacak
- [ ] Tanpa § requirement untuk dampak → defer/gap, bukan TC

### Contoh arah relasi (hanya jika docs bilang)

| Aksi | Arah cek tipikal |
|------|------------------|
| PO dari PR | Outstanding PR |
| Receive / PI | Stok, outstanding PO |
| Payment / approve hutang-piutang | Journal / saldo |
| Void dokumen | Side-effect terbalik di dokumen terkait |

Jangan perluas ke kombinasi combinatorial (semua warehouse × unit × role) tanpa AC.

---

## H. Contoh bentuk 1 set (ilustrasi — bukan TC nyata)

Pola untuk origin yang menyentuh PR → PO (ganti menu/§ sesuai requirement asli). Satu card = satu tipe; angka & § diganti saat authoring nyata.

### 1) `happy` — buat PO dari PR

- **Precondition:** Company 153; PR `PR-QA-ETM-xxxxx` status Approved; outstanding line SKU A = 10; URL edit PR: …
- **Steps:** Buka PO → pilih PR → isi qty 5 → Save. Cek: status PO = … ; qty tersimpan 5.
- **Expected:** sesuai `requirement.md` §… (PO tercipta, linked ke PR).
- **Rujukan:** `qa-docs/…/requirement.md` §… (review)

### 2) `negative` — qty di atas outstanding

- **Precondition:** PR yang sama; outstanding SKU A = 10.
- **Steps:** Buat PO qty 11 dari PR. Cek: sistem menolak / pesan UI …
- **Expected:** ditolak sesuai requirement §… (bentuk pesan boleh dari guard UI bila sudah diverifikasi).
- **Jangan** menaruh assert ini di Expected card happy.

### 3) `edge` — qty = outstanding persis

- **Precondition:** outstanding SKU A = 10.
- **Steps:** PO qty 10 → Save. Cek: berhasil; outstanding PR jadi 0.
- **Expected:** requirement §… (batas outstanding).

### 4) `cross-menu` — outstanding PR setelah PO

- **Precondition:** baseline outstanding PR line = 10 (catat sebelum aksi). PO happy di atas sudah / akan dibuat qty 5.
- **Steps:** Setelah PO tersimpan → buka menu PR → buka `PR-QA-ETM-xxxxx` → Cek outstanding line SKU A.
- **Expected:** outstanding = 5 (requirement §… PR dan/atau PO).
- **Bukan** hanya “PO berhasil disimpan” di menu PO.

Soft cap: keempat tipe di atas = 4 card (aman). Kalau menambah permission/regression/void chain, rank High dulu; sisanya defer di laporan chat.
