---
name: olshoperp-card-testing
description: >-
  Buku lengkap menjalankan test card Jira ETM (Test Case / Error / Improvement / CR)
  di staging/tyas — UI crawl atau Playwright, data uji, kapan cek DB, credential,
  Jira status/hasil, Telegram. Pakai saat user bilang "test card ETM-xxxxx",
  "jalankan test case", "laporkan hasil test", atau minta Bugsy/agent menguji.
  Membuat card Test Case baru = skill terpisah (olshoperp-testcase-authoring) — jangan
  campur di sini kecuali user minta.
---

# OlshopERP — Skill Testing Card (buku lengkap)

**Baca file ini dulu untuk tugas testing.** Jangan load banyak `.cursor/rules/` —
aturan operasional testing sudah diringkas di sini. Detail ID field / template pesan:
[reference.md](reference.md). Alat: [tools/](tools/) (`jira.sh`, `qm.py`).

Bahasa ke Yemima/tim: Indonesia sehari-hari, angka eksak, label UI persis di aplikasi.

**Sejak 22 Okt 2026:** dokumentasi Test Case **hanya di Jira** (bukan file `TC-*.md` di repo).
Jangan buat/update/renumber markdown TC untuk card baru.

---

## 0. Satu kalimat alur

Baca card → pastikan data uji ada → geser status Testing Progress → uji UI sesuai Expected
→ isi Actual lalu Test Result (atau komentar untuk non-TC) → Telegram ringkas → Done / tindak lanjut Failed.

---

## 1. Hemat sesi

- Satu sesi chat ≈ satu card (atau satu batch kecil yang jelas).
- Ambil Jira dengan `fields=` seperlunya — jangan dump changelog penuh.
- Balasan ke user: singkat + keputusan yang dia perlu ambil. Detail panjang → komentar Jira.
- Credential / API key / password: **jangan** cetak di chat, komentar, atau commit.

---

## 2. Jenis card → alur mana

`GET issue/{key}` → lihat issuetype + status + komentar terbaru.

| Jenis | Alur |
|-------|------|
| **Test Case** | §3 |
| **Error / Improvement / Change Requirement** | §4 |

Perintah “test card ini” = izin uji + catat hasil. Tidak perlu minta izin ulang per langkah.

---

## 3. Alur Test Case

1. **TESTING PROGRESS dulu** (sebelum klik uji) — ambil id transisi via `GET .../transitions` (contoh id di reference; jangan hafal buta).
2. Pastikan **data uji** (§5). Tidak ada data → **STOP**, bilang ke prompter; jangan ganti data diam-diam.
3. Uji sesuai **Steps + Expected** di description card (sumber kebenaran = Jira, bukan markdown repo).
4. Isi **Actual Result** (company, akun, data + URL, hasil per Expected, angka eksak) → baru **Test Result** (Passed / Failed / Blocked) → komentar bila perlu → **Done**.
5. **Test Case tidak punya status RE-OPEN** — tetap Done; hasil ada di Test Result.
6. **Failed / Blocked** → wajib card **Error** baru (bukan comment singkat saja):
   - Relates ke **TC ini** + ke **origin** (Improvement/CR/Story yang dilink).
   - Assignee Error = **assignee origin** (bukan tester).
   - Origin Improvement/CR → **RE-OPEN tanpa clone**, lalu Error baru di atas.
   - Jangan Done-kan origin yang masih gagal tanpa tindak lanjut ini.

Site Jira: **hanya ETM** (`erpintegration.atlassian.net`). Jangan eduqat.

---

## 4. Alur non–Test Case (Error / Improvement / CR)

1. Uji sesuai Expected di description. Bukti di **komentar Jira** (bukan field Actual/Test Result).
2. **Lulus** → komentar bukti → transisi ke Done (lewat QA Review bila ada; cek transitions).
3. **Gagal** → jangan Done. Ikuti jalur:
   - **Error / Bug origin:** RE-OPEN origin → **Clone** origin → judul clone `RE-OPEN [Menu] - {desc}`. Copy Request ID / Menu / Story Points / labels. Assignee clone = assignee origin. Retest berikutnya = **clone**, bukan origin yang sudah RE-OPEN.
   - **Improvement / Change Requirement / Story / Task:** RE-OPEN origin **tanpa** clone → buat card **Error baru** (format lengkap: Summary, Environment, Precondition, Steps, Expected, Actual, Additional Context) → Relates ke origin (+ TC penemu jika ada) → assignee = assignee origin.
4. Expected bersyarat data → uji **kedua** kondisi (ada / tidak ada) dan sebut data per kondisi.
5. Scope E2E / cross-menu sangat panjang & ragu: tanya Yemima dulu sebelum automasi RE-OPEN massal.
6. Selalu `GET .../transitions` sebelum RE-OPEN/clone — nama/id bisa berubah.

---

## 5. Data uji (wajib sebelum create/ubah transaksi)

**Urutan sumber:** instruksi prompter → description/komentar card → requirement menu (`qa-docs/.../requirement.md`, status review/approved) → cek data nyata (UI atau DB baca-saja).

```
Prompter / card sebut data konkret?
  YES → cek data ADA di company + server yang benar
        Ada → pakai; tandai jejak QA ETM-xxxxx di Description/Reference bila buat/ubah data
        Tidak ada → STOP + bilang prompter (jangan pakai SKU/fixture lain diam-diam)
  NO  → tanya: (A) pakai contoh di card? (B) reuse data existing company X? (C) tunggu skill/buat data?
```

- **Reuse data existing boleh** (staging/tyas sesuai izin). Hormati catatan “jangan dihapus”.
- Ada card Jira: sebut **nomor card** (`QA ETM-xxxxx`) di Description/Reference bila buat/ubah data.
- **Tanpa card Jira** (uji ad-hoc / permintaan chat): tetap jangan biarkan data anonymous — tulis jejak skenario di Name/Description, contoh `QA-AUTO skenario: filter Net Sales < COGS, 22-10-2026`. Di Actual/Telegram jelaskan skenario yang diuji.
- Hitung angka kritis dengan hati-hati (pembulatan/kurs); jangan tebak.
- Assert / Expected saat run: ikut description card; kalau Expected card mencurigakan (tidak nyambung requirement) → **STOP**, laporkan ke prompter/Yemima — jangan “perbaiki” Expected diam-diam saat run.
- **Membuat master/data dari nol** secara massal = skill khusus nanti; tanpa izin/skill itu, kalau data tidak ada → laporkan saja.

### Data uji staging: simpan, jangan hapus (Rachy 15-10-2026)

Setelah run di **staging**, data yang dibuat untuk uji **tidak dihapus** (kecuali Expected card memang menguji hapus).

1. Kode / SKU / nama: prefix **`QA-AUTO-`** bila memungkinkan (contoh `QA-AUTO-VPDEC-266983`).
2. **Name** atau **Description** wajib jejak: key card + tanggal (contoh `QA-AUTO ETM-16502 langkah 3, 15-10-2026`). Form tanpa Description → pakai Name. Tanpa Jira → teks skenario + tanggal (§ di atas).
3. Draft otomatis saat buka create PO/SO juga dibiarkan, beri jejak yang sama bila bisa diedit.
4. Actual Result Jira + Telegram menyebut **kode data** yang dipakai/dibuat (+ skenario bila tanpa card).
5. Tyas/Merdian tetap **no create** (§6) — aturan simpan ini terutama untuk staging.

---

---

## 6. Server, credential, company

Perintah singkat dari Yemima:
- **“test di staging”** (default) → host staging, boleh create/ubah data uji (hati-hati fixture bersama).
- **“test di tyas”** → login dengan credential di bawah, **dilarang create / ubah / hapus data**. Hanya uji baca/verifikasi tampilan/filter/export/read API. Kalau Expected card mengharuskan create data → **STOP**, bilang ke prompter.
- **“test di merdian”** → **WAJIB ada kode approval** di pesan prompter (lihat gate di bawah). Tanpa kode → **dilarang** buka Merdian. Dengan kode → sama seperti Tyas: login OK, **no create/ubah/hapus**.

### Gate Merdian (wajib — hati-hati production)

Siapa pun (termasuk agent lain) yang minta uji di Merdian **harus** menulis kode approval di pesan yang sama:

```text
yemimamerdian
```

| Kondisi | Aksi agent |
|---------|------------|
| Minta “test di merdian” / buka `merdian.olshoperp.com` **tanpa** kode `yemimamerdian` di pesan | **TOLAK.** Jangan login, jangan Playwright, jangan DB UI crawl. Balas: butuh kode approval dari Yemima. |
| Ada kode `yemimamerdian` di pesan (boleh di baris sendiri atau bersama instruksi) | Boleh lanjut **read-only** dengan credential Merdian di tabel bawah |
| Kode salah / mirip tapi tidak exact | Anggap **tidak ada** → tolak |

Jangan simpan “izin permanen” antar chat: tiap permintaan Merdian baru harus bawa kode lagi.

### Credential login UI (jangan cetak ulang ke chat/Telegram)

| Server | Host | Email | Password | Catatan |
|--------|------|-------|----------|---------|
| **Staging** | staging.olshoperp.com | `playwright@gmail.com` | `12345678` | Default E2E (sama rule `13` §4). Override: `OLSHOP_TEST_EMAIL` / `OLSHOP_TEST_PASSWORD` |
| **Tyas** | tyas.olshoperp.com | `playwright@gmail.com` | `12345678` | Sama akun E2E bila akses ada. Akun khusus izin: `tests/TEST-ACCOUNTS.md` (staging+tyas). **No create data.** |
| **Merdian** | merdian.olshoperp.com | `yemimamerdian@gmail.com` | `12345678` | Akun yang dipakai Bugsy historis. **No create data.** Override: env `OLSHOP_MERDIAN_EMAIL` / `OLSHOP_MERDIAN_PASSWORD` bila di-set di `.env` |

Jira / DB webhook / Telegram bot token: dari `.env` repo `olshoperp` (`OLSHOP_ENV_FILE` boleh override path). Jangan hardcode API key.

### Urutan company di **Staging** (kecuali prompter sebut spesifik)

Coba / pakai berurutan: **153 (lumicharmsid)** → **112 (FAT)** → **13 (DEV-STG)**.

- Kalau prompter bilang company tertentu (mis. “Dev Staging” / Lumielle / TANRISE) → **ikuti itu**, jangan ikut urutan di atas.
- Allowlist lain (bila diminta): Lumielle `810`, TANRISE `3`, HUAWEI `915` — lihat [reference.md](reference.md) §D.
- Selalu **switch company eksplisit** (`switchCompanyByCode`). Gejala salah company: API 404 / “You do not have access…”.

### Tyas & Merdian — boleh vs tidak

| Boleh | Tidak boleh |
|-------|-------------|
| Buka menu, filter, datalist, detail, export/download baca, cek tampilan/angka | Create / Approve yang menulis / Void / hapus / ubah master atau transaksi |
| Cek DB read-only | Mutasi SQL |
| Login agent dengan credential di tabel **setelah** gate Merdian lolos (kode `yemimamerdian`) | Uji Merdian tanpa kode approval; create data di Tyas/Merdian; cetak password ke chat/TC |

---

## 7. Uji UI agar valid (jangan keliru komponen)

**Tujuan:** hasil tes bisa dipercaya — bukan asal klik.

1. Baca **Expected di Jira** dulu; tiap assert harus nyambung ke Expected (bukan screenshot-only tanpa cek).
2. Interaksi UI: **helper / POM dulu** (`tests/helpers/`, `tests/helpers/shared/`, `tests/pom-registry/`).  
   Kontrak komponen (multiselect, dialog, numeric-mask, dll.): `tests/ui-components.md` — **jangan tulis selector dari nol**.
3. Kalau UI berubah / helper gagal: catat di komentar Jira; perbaiki helper + `ui-components.md` bila sesi BUILD, jangan “tambal sekali jalan” tanpa jejak.
4. Label tombol/field di langkah = **persis** teks di aplikasi.

### Browser MCP vs Playwright CLI

| | Browser MCP / pane | Playwright CLI (`npx playwright test`) |
|---|-------------------|----------------------------------------|
| Boleh | Eksplorasi UI, cek selector, reproduksi cepat | Jalur resmi jika pakai spec bertag / regresi |
| **Dilarang** | Menandai Test Result **Passed** hanya dari MCP; jadi satu-satunya “bukti lulus” tanpa langkah Actual yang jujur | — |

- Hasil resmi ke Jira = apa yang benar-benar diverifikasi di UI (crawl CLI atau manual + catatan). Observasi MCP saja = **catatan**, bukan Passed otomatis.
- Headless default; headed hanya jika prompter minta demo.
- Jangan spam login / retry tanpa batas saat debug selector — perbaiki helper, laporkan blocker.
- Spec yang mengubah data: `retries=0`.

### Di mana file Playwright boleh hidup

| Tempat | Pakai untuk | Simpan next run? |
|--------|-------------|------------------|
| `tests/scripts/` | **DILARANG** | — |
| `tests/scratch/` | Probe sekali pakai, screenshot | **Tidak** — hapus setelah selesai |
| `tests/specs/check-*.spec.ts` (tanpa tag `@ETM`/`@FLOW`) | Probe sementara | Hapus / pindah scratch setelah selesai |
| `tests/specs/…` + tag `@ETM-xxxxx` (atau `@FLOW-`) | Regresi yang akan diulang | **Ya** — commit hanya jika worth retest |

- Spec **tidak membaca** description Jira sendiri. Cocokkan manual Expected card vs assert di spec sebelum klaim lulus.
- Otomasi baru: tag **`@ETM-xxxxx`**. Tag `@TC-*` lama boleh dibiarkan sampai diganti pelan-pelan.
- Satu card sekali uji → cukup crawl/probe; **jangan** commit spec baru kecuali kasus kritis/sering diulang.
- Reuse yang benar = **helper/POM**, bukan satu spec generik untuk semua card.
- `prepareSession` + `switchCompanyByCode`; spek yang ubah data: `retries=0`.
- Input kosong: `fill('')` (di Mac, Ctrl+A sering salah = ke awal baris).
- Tes negatif di data bersama: `page.route` abort endpoint **sebelum** aksi; hitung request.

---

## 8. Kapan cek DB (jangan selalu)

Banyak test **cukup UI**. DB hanya:

| Pakai DB | Jangan pakai DB |
|----------|-----------------|
| Precondition: “SKU/dokumen X ada di company Y?” | Mengklaim **Passed** hanya karena baris DB “kelihatan benar” |
| Forensik FAIL: status UI ≠ dugaan | Exploratory sweep besar di Merdian |
| Audit: siapa ubah / soft-delete | Mutasi SQL (UPDATE/DELETE/…) |

**Aturan DB (wajib):**

- Read-only: `SELECT` / `SHOW` / `DESCRIBE` / `EXPLAIN` / `WITH` saja.
- Filter **company** (`owned_by` / `company_id` sesuai tabel).
- SoftDeletes: kalau “tidak ketemu”, cek `deleted_at`.
- **Staging + Tyas** = webhook shared (`agent-db-tyas`); **Merdian** = webhook terpisah (`agent-db-merdian` di host n9n).
- Alat: `tools/qm.py` **atau** HTTP POST langsung (lihat reference §B). Jangan hardcode API key.
- Query join berat sering kosong/timeout → pecah query lebih sederhana.
- Hasil DB = **supporting** di komentar/Actual — **bukan** pengganti assert UI.

---

## 9. Log Laravel / Horizon (bila perlu)

Pakai hanya jika gejala = error server, job gagal, atau user minta cek log — bukan tiap test happy path.

- Fetch: `node ../olshoperp/scripts/agent-log-fetch.mjs --server=staging|tyas|merdian --file=laravel-YYYY-MM-DD.log --level=error` (dari mesin yang punya akses; path sibling `olshoperp`).
- Staging/Tyas webhook log shared-ish; Merdian terpisah (detail di rule log backend bila perlu dalam).
- Horizon: pantau job failed di server yang sedang diuji; jangan “perbaiki” queue production tanpa instruksi.
- Temuan log → ringkas di komentar Jira (waktu, exception, korelasi request), bukan paste stack penuh ke Telegram.

---

## 10. Pelaporan & bukti

- **Jira = detail.** Actual/komentar: waktu, server, company, akun, data (kode + URL), hasil per Expected.
- **Bukti utama = data di environment** bertanda `QA ETM-xxxxx` — bukan Drive (Drive hanya jika Yemima minta).

### Telegram (wajib)

| | Nilai |
|---|---|
| Grup | OlshopERP — chat id `-1001931573603` (dari `t.me/c/1931573603`) |
| Topik / thread | `51478` |
| Bot | token dari `.env` → `TELEGRAM_BOT_TOKEN` |
| Format | HTML, mention `@yemimatifani` |

Isi mengikuti ringkasan Bugsy:

1. **Judul** — `ETM-xxxxx — [Menu] …` + server/company singkat  
2. **Hasil** — LULUS / GAGAL / sementara  
3. **✅ / ❌ per poin** Expected (3–5 baris)  
4. **Catatan singkat**  
5. **Kode data uji** (dan URL bila ada)  
6. **Link evidence** (Jira browse + status)  
7. Penutup: dijalankan agent atas permintaan Yemima · `cc @yemimatifani`

- Batch ≥3 card: **satu** pesan ringkasan (jumlah ✅/❌/⏸ + satu baris per card); edit pesan yang sama untuk update sementara → final.
- Jangan kirim password / API key di Telegram.

---

## 11. Bukan tugas skill ini

- Membuat banyak card Test Case baru dari AC → skill **`olshoperp-testcase-authoring`** (rapikan terpisah).
- Edit `requirement.md` / KB / technical → hanya Yemima lewat alur resmi.
- Webhook `#testcase … ready` → hanya jika Yemima ketik perintah itu.

---

## 12. Jebakan yang sudah terjadi (jangan ulangi)

- Testing Progress digeser **setelah** tes → salah.
- Telegram ditahan sampai “sempurna” → kirim sementara dulu.
- Ubah fixture “jangan dihapus” tanpa baca catatan.
- Ctrl+A di Mac → nilai lama tersimpan lagi.
- Langkah isian dari asumsi, bukan dari UI/FE helper.
- Probe di `tests/scripts/` atau assert harga/bug tanpa ganti unit / tanpa `expect`.
- Fallback diam-diam ke SKU di description card padahal prompter sudah kasih data lain.
- Test / login Merdian tanpa kode approval `yemimamerdian` di pesan.
- Hapus data `QA-AUTO-` staging setelah run “biar rapi”.
- RE-OPEN pada card Test Case, atau clone Improvement (salah jalur).
- Tandai Passed hanya karena MCP/screenshot tanpa cocokkan Expected.

---

## 13. Checklist sebelum bilang “selesai”

- [ ] Status Jira benar (Progress → Actual → Result → Done / atau komentar non-TC)
- [ ] Expected di card tercakup di Actual (angka eksak)
- [ ] Data jejak `QA-AUTO-` / `QA ETM-…` bila buat di staging; **tidak dihapus**
- [ ] Failed → Error + Relates + assignee origin (+ RE-OPEN jalur benar)
- [ ] Passed bukan dari MCP-only
- [ ] Telegram terkirim
- [ ] Probe/scratch dibersihkan; tidak ada file di `tests/scripts/`
- [ ] Tidak ada secret di chat/komentar
- [ ] Merdian: ada kode `yemimamerdian` bila diuji di situ
