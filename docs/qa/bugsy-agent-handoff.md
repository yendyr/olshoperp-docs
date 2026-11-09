# Manual operasional handoff penguji OlshopERP (Bugsy)

Manual ini milik tim QA. Isinya cara kerja penguji card Jira ETM dari permintaan sampai hasil tercatat, supaya agent lain bisa meneruskan pekerjaan yang sama.

Dokumen ini ditulis 2026-11-09 dengan membaca file di repo `olshoperp-docs` dan SOP QA yang dipakai Bugsy pada tanggal itu. Penulis **tidak** login ke aplikasi, **tidak** mengubah Jira, **tidak** mengirim Telegram, dan **tidak** menjalankan Playwright. Angka, status, dan komentar di bagian contoh adalah placeholder. Jangan disalin ke Jira sebagai hasil uji.

Kalau file sumber di repo sudah berubah setelah tanggal itu, baca file sumbernya lagi. Jangan mengunci keputusan dari ingatan chat.

## Daftar isi

1. [Tujuan, batas, dan peta kerja](#1-tujuan-batas-dan-peta-kerja)
2. [Input: chat, Telegram, satu card, batch](#2-input-chat-telegram-satu-card-batch)
3. [Bootstrap agent pengganti](#3-bootstrap-agent-pengganti)
4. [Alur end-to-end dan pohon keputusan](#4-alur-end-to-end-dan-pohon-keputusan)
5. [Cek build dan deploy](#5-cek-build-dan-deploy)
6. [Keselamatan environment, company, dan data](#6-keselamatan-environment-company-dan-data)
7. [Output Jira: TC, non-TC, Error, status](#7-output-jira-tc-non-tc-error-status)
8. [Bukti, komentar, Telegram, Drive](#8-bukti-komentar-telegram-drive)
9. [Keputusan domain harga dan UX](#9-keputusan-domain-harga-dan-ux)
10. [Handoff saat kuota atau sesi putus](#10-handoff-saat-kuota-atau-sesi-putus)
11. [Checklist selesai dan contoh](#11-checklist-selesai-dan-contoh)
12. [Sumber, tanggal, dan konflik yang harus dibaca ulang](#12-sumber-tanggal-dan-konflik-yang-harus-dibaca-ulang)

---

## 1. Tujuan, batas, dan peta kerja

### 1.1 Siapa yang memakai manual ini

Bugsy di sini adalah peran **penguji dan perayap UI** OlshopERP. Pekerjaannya: membaca card yang diminta, menyiapkan sesi company yang benar, menjalankan langkah di UI, lalu menulis hasil yang bisa dibaca orang QA di Jira (dan Telegram bila pengiriman memang diizinkan pada sesi itu).

Peran ini bukan developer. Repo aplikasi `olshoperp` dan `olshoperp-frontend` tidak diubah. Cuplikan kode boleh dibaca sempit hanya bila UI dan dokumen tidak cukup untuk memutuskan triase gagal. Tidak ada commit ke repo aplikasi dari peran ini.

Peran ini juga bukan pemilik requirement. File `qa-docs/**/requirement.md`, `knowledge-base.md`, `technical.md`, `user-guide.md`, dan `feature-map.md` tidak diedit. Pengecualian tulis requirement di charter hanya untuk Hazel dengan kode commit `yemimadocs`. Permintaan user 2026-11-09 yang menaruh manual ini di repo **tidak** membuka izin mengedit layer itu.

### 1.2 Apa yang selesai, apa yang belum

Satu pekerjaan uji selesai bila setiap card yang diminta masuk salah satu keadaan ini, dan keadaan itu sudah dibaca kembali dari Jira:

| Keadaan | Arti operasional |
|---------|------------------|
| TC lulus | Actual Result terisi, Test Result = Passed, status Done, baca-ulang cocok |
| TC gagal karena aplikasi | Actual Result terisi, Test Result = Failed, status Done, card Error terbit dan tertaut, origin ditindak sesuai tipenya |
| TC tidak bisa diuji karena hal di luar aplikasi | Status Not Execute, tidak ada Test Result, tidak ada card Error, laporan menyebut siapa yang harus menyiapkan apa |
| Fix belum ter-deploy | Status tetap TESTING PROGRESS, tidak ada Failed, tidak ada Error, laporan menyebut stamp build yang terlihat |
| Non-TC diuji | Bukti di komentar. Status card digeser hanya bila permintaan yang sama menyuruh menggeser |
| Terputus di tengah | Checkpoint di [§10](#10-handoff-saat-kuota-atau-sesi-putus), bukan klaim selesai |

Jangan menulis Passed untuk cakupan sebagian. Jangan mengarang metrik ("kira-kira 80%"). Tulis hitungan eksak: poin Expected mana yang dijalankan, mana yang belum, mana yang gagal.

Anggaran waktu praktik yang disepakati sekitar 20–30 menit untuk satu card atau satu kelompok yang sedang dipegang. Itu bukan timeout buta di Playwright (`playwright.config.ts` memakai timeout uji 180 detik dan retries lokal 1). Kalau anggaran praktik itu habis sementara cakupan belum lengkap: berhenti rapi, catat cakupan eksak, jangan mengulang login dingin atau sampel acak.

### 1.3 Peta skill yang relevan

Hanya jalur di tabel ini. Jangan memuat katalog skill lain.

| Pekerjaan | Baca | Bukan bagian otomatis dari setiap uji |
|-----------|------|----------------------------------------|
| Menguji card yang diminta | Manual ini, lalu [`.cursor/skills/olshoperp-card-testing/SKILL.md`](../../.cursor/skills/olshoperp-card-testing/SKILL.md) dan bagian [reference.md](../../.cursor/skills/olshoperp-card-testing/reference.md) yang disebut di bawah | — |
| Menulis card Error / Improvement / CR | [`.cursor/rules/12-jira-card-format.mdc`](../../.cursor/rules/12-jira-card-format.mdc). Template non-TC ada di [`.cursor/skills/olshoperp-jira-card/SKILL.md`](../../.cursor/skills/olshoperp-jira-card/SKILL.md) | Jangan membuat jenis card yang tidak diminta uji-gagal atau diminta user |
| Membuat Test Case baru | [`.cursor/skills/olshoperp-testcase-authoring/SKILL.md`](../../.cursor/skills/olshoperp-testcase-authoring/SKILL.md) dan [reference.md](../../.cursor/skills/olshoperp-testcase-authoring/reference.md) | Authoring terpisah. Uji yang sedang jalan tidak otomatis menerbitkan TC yang kurang |
| Re-OPEN origin setelah gagal, atau user minta reopen | [`.cursor/rules/22-reopen-defect-flow.mdc`](../../.cursor/rules/22-reopen-defect-flow.mdc) | Bukan langkah pembuka setiap uji. Screening QA Review milik alur Hazel (`hazel/qa-review-ac-code-screening.md`), bukan prolog Bugsy |
| Log server saat ada error 500 / job gagal | [`.cursor/rules/21-log-debugger.mdc`](../../.cursor/rules/21-log-debugger.mdc) | Jangan tarik log pada happy path |
| Cek DB | Skill card-testing §8, [`tests/DATA-VERIFICATION.md`](../../tests/DATA-VERIFICATION.md), rule `19` bila butuh katalog skema | Query bukan bukti lulus |
| Perilaku komponen UI | [`tests/ui-components.md`](../../tests/ui-components.md) sebelum menulis interaksi baru | — |
| Standar tampilan | [`tests/UX-STANDARD.md`](../../tests/UX-STANDARD.md) §2 dan §5 | Poin §5 bukan gagal |
| Otomasi spec tanpa mengisi hasil card | [`tests/AGENT-RUNBOOK.md`](../../tests/AGENT-RUNBOOK.md) | Runbook bukan pengganti hasil Jira |
| Akun izin khusus | [`tests/TEST-ACCOUNTS.md`](../../tests/TEST-ACCOUNTS.md) | Jangan menyalin sandi keluar dari file itu |
| Kunci folder requirement | [`.cursor/rules/03-qa-docs-immutable.mdc`](../../.cursor/rules/03-qa-docs-immutable.mdc) dan [`AGENTS.md`](../../AGENTS.md) | — |

Intake permintaan Improvement, screening Request ID (rule `25`), dan notifikasi screening TC Done (rule `23`) adalah alur lain, sering dikerjakan Hazel. Jangan menjalankannya hanya karena sedang memegang card uji.

### 1.4 Kapan membaca apa

1. Baca manual ini sampai pohon keputusan.
2. Ambil card Jira hidup dengan field minimal ([§4.1](#41-baca-card-hidup)).
3. Buka skill atau rule hanya untuk cabang yang pohon itu sebut.
4. Expected bisnis dibaca dari description card. Bila Expected card tampak tidak nyambung, baca `qa-docs/{slug}/requirement.md` atau `feature-map.md` **sekali**, lalu berhenti dan laporkan. Jangan mengoreksi Expected diam-diam.
5. File `qa-docs/**/test-cases/TC-*.md` bukan sumber langkah uji sejak 26 Oktober 2026. Jangan dibuka untuk mencari Expected, jangan diedit.

SOP Bugsy yang diringkas ke manual ini (isi operasionalnya ada di sini, bukan hanya judul): playbook uji, format card Jira, dan catatan pesan antar-bot yang membatasi pesan handoff agar tetap pendek. Isi panjang tetap di file ini. Pesan ke agent lain hanya menunjuk path ini plus checkpoint.

---

## 2. Input: chat, Telegram, satu card, batch

### 2.1 Dua pintu masuk

| Pintu | Yang dianggap perintah uji | Balasan |
|-------|----------------------------|---------|
| Chat langsung dengan QA (Yemima / Rachy / pengirim yang sama) | Kalimat seperti "test card ini", key `ETM-…`, atau daftar key | Ringkas di chat setelah hasil ada di Jira. Tanpa laporan progres per langkah, kecuali terblokir dan butuh keputusan |
| Telegram perintah `/bugsy` | Pesan di grup dan thread yang disebut [§8.3](#83-telegram) | Laporan di Telegram. Jangan menambah ringkasan kedua di chat webhook |

"Test card ini" sudah izin untuk menguji dan mencatat hasil. Jangan meminta izin ulang untuk setiap klik, setiap isi Actual, atau setiap TC yang gagal lalu perlu card Error. Izin itu **tidak** mencakup: hapus data orang lain, Sync marketplace, uji produksi tanpa kalimat yang diminta di [§6](#6-keselamatan-environment-company-dan-data), atau E2E besar yang tidak disebut.

### 2.2 Jejak pesan untuk dibalas

Simpan sebelum mulai menguji. Ini yang dipakai bila harus membalas pesan asal, atau bila sesi putus.

| Field | Chat langsung | Telegram `/bugsy` |
|-------|---------------|-------------------|
| Pintu | `chat` | `telegram` |
| Identitas percakapan | judul / id sesi bila ada | `chat_id` |
| Id pesan asal | id pesan user bila ada | `message_id` pesan `/bugsy` |
| Thread | — | `message_thread_id` |
| Pengirim | nama yang tertulis di pesan | `@username` |
| Isi permintaan | salinan singkat | salinan singkat |
| Waktu diterima | jam WIB | jam WIB |

Kalau id pesan Telegram tidak tertangkap, jangan mengarang balasan ke pesan lain. Kirim laporan tanpa klaim "ini balasan pesan X", dan tulis di checkpoint bahwa provenance tidak ada.

### 2.3 Kontrak input

| Input | Wajib bila | Bila tidak ada |
|-------|------------|----------------|
| Key `ETM-…` | Selalu, untuk uji card | Tanyakan key. Jangan mencari card "yang barusan" dari tebakan |
| Jenis yang diharapkan | Tidak wajib ditebak user | Baca `issuetype` hidup |
| Environment | Tidak, bila staging | Staging. Tyas/Merdian hanya bila disebut eksplisit ([§6.1](#61-environment)) |
| Company | Tidak, bila user tidak menyebut | Urutan 153 lumicharmsid, lalu 112 FAT, lalu 13 DEV-STG. Company yang disebut user dipakai persis, jangan diganti urutan ini |
| Akun | Wajib kamu yang menjalankan | Akun khusus agent ini lewat env ([§3.3](#33-rahasia-nama-env-saja)). Jangan memakai akun agent lain atau akun Moira |
| Data / kode dokumen | Wajib bila Expected menyebut dokumen tertentu | Cek komentar Moira / precondition. Tidak ada dan kamu tidak diminta membuatnya → berhenti, Not Execute |
| Precondition | Wajib bisa dijalankan | Kalimat "siapkan data SO" tanpa status, company, dan kondisi bukan precondition. Minta yang bisa dicari, atau berhenti |
| AC / Expected | Wajib ada di card | Card tanpa Expected yang bisa diuji → laporkan, jangan mengarang Expected |
| Id pesan untuk dibalas | Wajib untuk Telegram | Lihat §2.2 |

Tanyakan hanya ambiguitas yang mengubah hasil, data, atau keamanan. Contoh yang **perlu** ditanya: dua Expected saling bertentangan, user menyebut dua company tanpa urutan, permintaan E2E banyak menu yang tidak disebut sebagai scope, atau perintah yang akan menekan Sync marketplace.

Contoh yang **tidak** perlu ditanya: company tidak disebut (pakai urutan default dan tulis company yang dipakai), user tidak menyebut "headless" (headless), user tidak menyebut Drive (jangan unggah).

### 2.4 Satu card dan batch

Batch: baca semua card dulu (field minimal), kelompokkan menurut menu, lalu company, lalu akun. Login dan switch company sekali per kelompok. Pakai ulang sesi dan data yang memang milik kelompok itu.

Jangan mencampur:

- dua user OlshopERP pada satu file sesi,
- dua company berbeda secara paralel pada akun yang sama,
- data atau sesi Moira, Hazel, atau agent lain,
- card milik permintaan orang lain yang tidak ada di pesan ini.

E2E atau lintas menu yang panjang dan tidak diminta dengan jelas: berhenti, minta keputusan Yemima, jangan mulai live test "sekalian".

---

## 3. Bootstrap agent pengganti

Menyerahkan file ini **tidak** memindahkan kuota, token, izin Telegram, izin Jira, atau izin produksi. Agent baru harus punya konektornya sendiri. Kode `yemimamerdian` dari permintaan lama tidak berlaku. Sesi chat lama tidak ikut pindah.

### 3.1 Konektor

| Konektor | Untuk apa | Bila tidak ada |
|----------|-----------|----------------|
| Baca repo `olshoperp-docs` | SOP, helper, requirement | Berhenti. Jangan menguji dari ingatan |
| Jira project ETM | Baca card, tulis hasil, buat Error bila gagal | Uji UI boleh dilanjutkan hanya bila user menerima hasil sementara di checkpoint. Jangan mengarang bahwa Jira sudah ter-update |
| Playwright CLI di repo ini | Jalur eksekusi resmi | Browser eksplorasi tidak boleh menjadi satu-satunya dasar Passed |
| Telegram | Hanya bila env bot ada **dan** permintaan sesi ini mengizinkan kirim | Jangan mengirim. Tulis di laporan bahwa Telegram tidak dikirim dan kenapa |
| Google Drive | Hanya bila user pada permintaan ini minta unggah | Lewati. Bukti default adalah teks |
| DB webhook | Precondition atau forensik | UI tetap sumber lulus/gagal |
| Log webhook | Error server | Lewati pada alur yang tidak error |

Site Jira: `https://erpintegration.atlassian.net`. `cloudId` yang tercatat di skill dan rule sampai 2026-11-09: `44cc9820-3372-4c12-884c-698b1397173c`. Pakai bila tool meminta cloud id. Bila panggilan ditolak, baru cek resource yang benar-benar terpasang di sesi itu. Jangan menempel id ini ke site lain. Bukan project Eduqat.

### 3.2 Perintah dan path yang ada di repo ini

Dicek dari isi file pada 2026-11-09, bukan dari percobaan login.

Login dan company, [`tests/helpers/company-access.ts`](../../tests/helpers/company-access.ts):

| Export | Peran |
|--------|--------|
| `login(page, env?)` | Buka `/login`, isi email dan sandi dari env, klik Login, tunggu keluar dari `/login`, topbar terlihat |
| `switchCompanyByCode(page, companyCode, env?)` | Cari company di allowlist env, lalu switch by id |
| `switchCompanyById(page, companyId, companyLabel, env?)` | Buka switcher, pilih label, klik Proceed, tunggu id company di storage halaman |
| `prepareSession(page, { companyCode?, targetPath })` | Butuh `targetPath`. Memakai sesi yang sudah ada, memperbaiki company bila beda, lalu membuka menu |

Setup sesi, [`tests/global-setup.ts`](../../tests/global-setup.ts):

- Folder: `tests/.auth/` (ada di `.gitignore`).
- Path bawaan: `tests/.auth/{companyCode}.json`.
- Company code dari `OLSHOP_COMPANY_CODE`, default `lumicharmsid`.
- Base URL dari `OLSHOP_BASE_URL`, default `https://staging.olshoperp.com`.
- `OLSHOP_REFRESH_AUTH=1` memaksa login ulang. Nilai lain: bila file sudah ada, login dilewati.

[`playwright.config.ts`](../../playwright.config.ts): `globalSetup` file di atas, project `authenticated`, `storageState` = path company itu, `workers: 1`, `fullyParallel: false`, retries `1` di luar CI dan `2` di CI, timeout uji 180 detik. Untuk uji yang mengubah data, jalankan dengan `--retries=0` supaya gagal tidak mengulang mutasi.

Allowlist company ada di [`tests/helpers/env-config.ts`](../../tests/helpers/env-config.ts). `getEnvConfig()` membaca `OLSHOP_ENV` (`staging`, `tyas`, `merdian`), default staging.

Perintah dari [`package.json`](../../package.json), dijalankan di root repo docs:

```bash
npx playwright test tests/specs/{menu}/{file}.spec.ts --project=authenticated --retries=0 --workers=1
npm run test:tc -- "@ETM-12345"
```

Probe sekali pakai hanya di `tests/scratch/` (gitignored) atau `tests/specs/check-*.spec.ts` tanpa tag `@ETM` / `@FLOW` / `@TC`. Hapus file probe setelah selesai. Jangan menambah file di `tests/scripts/`. Jangan commit spec baru kecuali regresi itu memang akan diulang dan user meminta simpan.

Jira dari mesin yang punya env, skrip [`.cursor/skills/olshoperp-card-testing/tools/jira.sh`](../../.cursor/skills/olshoperp-card-testing/tools/jira.sh):

```bash
# OLSHOP_ENV_FILE menunjuk file env yang boleh kamu pakai.
# Default skrip adalah path checkout Mac dan sering tidak ada di mesin lain.
jira.sh GET "issue/ETM-12345?fields=summary,status,issuetype"
# JV=2 bila perlu REST v2. Default skrip adalah v3.
```

Skrip itu membaca `JIRA_EMAIL` dan `JIRA_API_TOKEN` lalu mengirimnya ke curl lewat stdin. Jangan `echo` env, jangan `set -x`, jangan menempel isi file env ke chat.

DB dan log: contoh URL ada di [`tests/AGENT-RUNBOOK.md`](../../tests/AGENT-RUNBOOK.md) bagian H dan H2, serta rule 21. Header memakai nama env, bukan nilai key.

### 3.3 Rahasia: nama env saja

Isi nilai di lingkungan agent ini. Jangan menulis nilainya di manual, chat, Telegram, komentar Jira, commit, atau checkpoint.

| Nama | Dipakai untuk |
|------|----------------|
| `OLSHOP_TEST_EMAIL` | Email akun uji **khusus agent ini** |
| `OLSHOP_TEST_PASSWORD` | Sandi akun itu |
| `OLSHOP_BASE_URL` | Default uji: `https://staging.olshoperp.com` |
| `OLSHOP_COMPANY_CODE` | Code company, mis. `lumicharmsid` |
| `OLSHOP_REFRESH_AUTH` | `1` bila sesi harus dibuat ulang |
| `OLSHOP_ENV` | `staging`, `tyas`, atau `merdian` |
| `OLSHOP_ENV_FILE` | Path file env Jira/DB/Telegram. Jangan cetak isinya |
| `OLSHOP_MERDIAN_EMAIL` | Override email Merdian bila skill menyebut nama ini |
| `OLSHOP_MERDIAN_PASSWORD` | Override sandi Merdian |
| `OLSHOPERP_PROD_EMAIL` | Nama di SOP Bugsy untuk login produksi yang memang diminta |
| `OLSHOPERP_PROD_PASSWORD` | Pasangannya. Jangan cetak |
| `JIRA_EMAIL` | Akun API Jira |
| `JIRA_API_TOKEN` | Token API Jira |
| `DB_DEBUG_API_KEY` | Webhook DB/Redis Staging dan Tyas |
| `DB_DEBUG_API_KEY_MERDIAN` | Webhook DB Merdian. Tetap butuh kode di pesan yang sama |
| `LOG_DEBUG_API_KEY` | Webhook log Staging dan Tyas |
| `LOG_DEBUG_API_KEY_MERDIAN` | Webhook log Merdian |
| `TELEGRAM_OERP_ASSIST_BOT_TOKEN` | Bot yang SOP Bugsy sebut target sementara |
| `TELEGRAM_BOT_TOKEN` | Bot lain, menurut SOP Bugsy. Jangan diasumsikan sama |

`company-access.ts` mengisi email dan sandi dari `OLSHOP_TEST_EMAIL` dan `OLSHOP_TEST_PASSWORD`. Bila env kosong, file itu jatuh ke akun bersama yang tertulis di sumber. **Jangan biarkan jatuh ke situ.** Set kedua env ke akun khusus sebelum `login` atau global-setup. Akun bersama itu dipakai banyak spec lama. Dua agent pada akun yang sama akan saling menimpa company aktif di server.

Sandi akun khusus izin (email `withoutvoid@olshoperp.com`, hanya kasus Void/Approve) tinggal di `tests/TEST-ACCOUNTS.md`. Jangan menyalin sandinya ke mana pun. Jangan menghapus sandi dari file itu. File itu memang tempat sandi akun uji tinggal, dan folder `tests/` tidak dimirror ke Help Center.

### 3.4 Company aktif di server, dan tabrakan file sesi

Company aktif disimpan **per user di server**, bukan hanya di file lokal. Gejala salah company: API 404 atau teks akses ditolak.

Karena itu:

- Jangan menjalankan dua company berbeda secara bersamaan pada akun yang sama, termasuk dua proses di dua mesin.
- Moira (penyiap data), Bugsy, dan agent lain memakai akun terpisah. Jangan login sebagai Moira untuk menguji, jangan menggeser company pada user Moira, jangan memakai file sesi Moira.
- Satu proses Playwright cukup (`workers: 1`). Itu tidak melindungi dua agent yang berbagi akun.

File `tests/.auth/{company}.json` hanya memuat code company, bukan identitas akun. Dua akun yang sama-sama memakai `lumicharmsid` akan menimpa file yang sama. Isi file itu cookie dan token. Jangan dibuka, jangan dicetak, jangan di-commit.

Isolasi yang bisa dilakukan tanpa mengubah helper:

1. Satu checkout atau satu folder kerja per agent, supaya `tests/.auth/` tidak dibagi.
2. Akun OlshopERP berbeda per agent.
3. Di dalam satu checkout, jangan paralel. Bila file `{company}.json` sudah ada dan kamu tidak yakin itu sesimu, jangan memakainya untuk akun lain. Set `OLSHOP_REFRESH_AUTH=1` hanya bila kamu memang akan mengganti file itu dengan login akunmu, dan tidak ada worker lain yang sedang memakainya.
4. Selesai run: hapus file sesi yang **run ini** buat dan yang tidak sedang dipakai worker lain. Jangan menghapus `tests/.auth/` orang lain. Bila kamu terpaksa memakai path bersama dan tidak bisa membuktikan dirimu satu-satunya pemakai, jangan dihapus. Checkpoint hanya menyebut path, bukan isi. Agent berikut membuat sesinya sendiri dengan `OLSHOP_REFRESH_AUTH=1`.

Ada perbedaan di kode yang harus diketahui: `prepareSession` dan global-setup default ke `lumicharmsid` (153). `ENV_CONFIGS.staging.defaultCompany` di `env-config.ts` adalah elemen pertama allowlist, yaitu FAT (112). Jangan mengira company setelah login sudah 153. Selalu `switchCompanyByCode` ke company yang diminta, lalu baca kembali company aktif.

Allowlist staging di `env-config.ts`: 153 `lumicharmsid` (label Lumi Charms.id), 112 `FAT`, 13 `DEV-STG` (label Dev Staging), 810 `Lumielle`, 3 `TANRISE`, 915 `HUAWEI` (label PT Huawei Tech Investment). Yang boleh dipakai tanpa disebut user hanya 153, lalu 112, lalu 13. 810, 3, dan 915 hanya bila permintaan menyebutnya.

Tyas di file yang sama: 3 `TANRISE`, 16 `SOMURAH`. Merdian: 4 `WNA`. Switch ke code di luar allowlist env itu akan dilempar error oleh helper. Jangan memperlebar allowlist di tengah uji.

### 3.5 Akhir sesi

Hapus file sesi dan token yang run ini buat, dengan batas di §3.4. Jangan menghapus sesi worker lain. Jangan mencetak JSON sesi ke log lalu "membersihkan" dengan menempelkannya di chat.

---

## 4. Alur end-to-end dan pohon keputusan

### 4.1 Baca card hidup

`GET` issue dengan field minimal. Jangan mengunduh changelog penuh.

- `summary`, `issuetype`, `status`, `assignee`
- `description`
- `labels`
- `customfield_10429` (Menu Name / Notion Page)
- `customfield_10495` (Request ID)
- `customfield_10043` (Story Points)
- untuk Test Case saja: `customfield_10203` (Actual Result), `customfield_10202` (Test Result)
- komentar terbaru, bukan seluruh histori bila tidak perlu
- `issuelinks`

`GET` tanpa field custom sering terlihat seolah Request ID kosong. Jangan menyimpulkan kosong sebelum membaca `customfield_10495`.

Klasifikasi:

| issuetype | Alur |
|-----------|------|
| Test Case, termasuk Subtask Test Case | [§4.3](#43-test-case) |
| Error, Improvement, Change Requirement, Story, Task | [§4.4](#44-bukan-test-case) |
| Bug (subtask ETM) | Jangan diperlakukan sebagai Error mandiri. Laporkan tipe yang terlihat |

Origin developer: dari link Relates / QA Test Case / parent yang menunjuk Improvement, CR, Story, Task, atau Error asal. Assignee origin dipakai untuk card Error baru **hanya bila orang itu developer**. Jangan menyalin assignee QA pada TC ke card Error. Daftar username developer yang disebut SOP Bugsy 2026-11-09: `alvinn_ardi`, `dlo_meeree`, `Heri_Efendi`, `faisallbhr`, `mellyanat`, `qudumawang`. Repo ini tidak menyimpan `accountId` mereka. Cari di Jira saat membuat card. Bila nama tidak cocok satu orang, berhenti dan tanya. Jangan mengarang id.

### 4.2 Matriks cakupan

Sebelum mengklik, salin setiap poin Expected / AC ke baris. Setelah uji, isi hanya dari yang benar-benar dijalankan.

```text
| # | Poin Expected (kutipan pendek dari card) | Sumber | Data yang dipakai | Hasil | Catatan |
|---|------------------------------------------|--------|-------------------|-------|---------|
| 1 | ... | description card / requirement § | kode atau "belum" | lulus / gagal / belum dijalankan / tidak bisa diuji | ... |
```

Hasil akhir card mengikuti baris ini, bukan kesan umum. "3 lulus, 1 gagal, 1 belum" bukan Passed.

Expected bersyarat ("jika ada data X … jika tidak ada …") diuji kedua cabangnya. Sebut data tiap cabang. Jangan menutup salah satu cabang dengan asumsi.

Expected yang tampak salah terhadap requirement: berhenti, laporkan kutipan Expected dan kutipan requirement. Jangan mengedit Expected kecuali user meminta.

### 4.3 Test Case

Sumber langkah dan Expected adalah card Jira, bukan file markdown.

1. Cek build bila yang diuji adalah sebuah fix ([§5](#5-cek-build-dan-deploy)).
2. Geser ke TESTING PROGRESS **sebelum** uji. Transition id TC: `4`. Bila respons berisi "Tolong Input Field Notion Page Terlebih Dahulu", isi `customfield_10429` dari nama menu di judul, jeda, ulangi transisi. Exit code curl bisa 0 walaupun Jira menolak. Baca isi respons.
3. Data: ikuti [§6.4](#64-data-uji). Tidak ada data dan kamu tidak diminta membuatnya → TC kembali ke Not Execute (`11`). Laporan saja. Tanpa Test Result. Tanpa Error.
4. Catat baseline UI (dan DB hanya bila precondition memang soal angka yang harus ada).
5. Jalankan langkah di UI lewat Playwright CLI atau uji manual yang melihat layar yang sama. Assert tiap poin. API bukan bukti lulus kecuali user meminta uji API.
6. Triase sebelum menyebut bug ([§4.6](#46-triase-sebelum-gagal)).
7. Putuskan dengan pohon di §4.5.
8. Isi field, baca ulang, baru geser status.
9. Laporkan ([§8](#8-bukti-komentar-telegram-drive)).
10. Bersihkan sesi milik run ini. Pulihkan setting bersama bila diubah.

TC tidak punya status RE-OPEN. Lulus dan gagal aplikasi sama-sama berakhir di Done, dibedakan oleh Test Result.

### 4.4 Bukan Test Case

Uji Expected di description. Bukti masuk **komentar**, bukan `customfield_10203`. Field itu tidak dipakai pada tipe ini.

Status card origin tidak digeser kecuali permintaan yang sama menyuruh (misalnya "kalau lulus pindahkan ke Done"). Lulus tanpa perintah status = komentar saja.

Gagal aplikasi pada card yang sedang diuji:

- Origin bertipe Error: RE-OPEN origin, lalu clone. Judul clone `RE-OPEN [Menu] - …`. Salin Menu, Story Points, labels. Request ID ikut [§7.4](#74-request-id). Assignee clone = assignee origin bila orang itu developer. Retest berikutnya memakai clone.
- Origin Improvement, Change Requirement, Story, atau Task: RE-OPEN origin **tanpa** clone. Buat satu card Error baru, Relates ke origin, link QA Test Case ke TC yang menemukan bila ada, assignee = developer origin.

Rule 22 masih menulis bahwa Improvement/CR/Story/Task sebaiknya punya TC dulu. SOP uji Bugsy mengizinkan menguji card non-TC secara langsung bila user meminta uji card itu. Bila TC-nya belum ada, uji yang diminta tetap dijalankan sejauh Expected card bisa diuji, dan laporan menyebut cakupan yang tidak punya TC. Jangan menerbitkan satu set TC di tengah uji kecuali user meminta authoring.

### 4.5 Pohon keputusan

```text
Mulai
  |
  |-- Fix yang diuji belum ada di build yang terlihat? --> TESTING PROGRESS, lapor "belum ke-deploy", stop. Bukan Failed. Bukan Error.
  |
  |-- Tidak bisa mulai karena di luar aplikasi
  |     (data belum ada, antrian mati, env mati, akses yang salah, menunggu Moira)
  |     --> TC: Not Execute. Non-TC: komentar. Tanpa Test Result. Tanpa Error.
  |
  |-- Langkah terhenti karena aplikasi error / hasil UI salah
  |     (setelah triase §4.6, build sudah dicek)
  |     --> ini GAGAL, bukan Not Execute.
  |         TC: Actual + Failed + baca-ulang + Done + Error + tautan + RE-OPEN origin sesuai tipe.
  |         Non-TC: komentar gagal. Status hanya bila user meminta.
  |
  |-- Semua poin Expected yang diminta sudah dijalankan dan cocok
  |     --> TC: Actual + Passed + baca-ulang + Done.
  |         Non-TC: komentar lulus. Status hanya bila user meminta.
  |
  |-- Baru sebagian poin
  |     --> bukan Passed. TC tetap TESTING PROGRESS, Test Result kosong.
  |         Non-TC: komentar menyebut poin yang belum.
  |         User tetap minta Done pada non-TC: geser, tetapi bukti tetap
  |         menyebut apa yang belum tercakup. Jangan diubah menjadi lulus penuh.
  |
  '-- Anggaran ~20–30 menit habis atau sesi akan putus
        --> tulis cakupan eksak + checkpoint §10. Jangan mengulang sampel dingin.
```

Dua makna "blocked" (keputusan Yemima 28 Oktober 2026):

| | Di luar aplikasi | Aplikasi menghentikan uji atau hasilnya salah |
|--|------------------|-----------------------------------------------|
| Contoh | Data Moira belum ada, queue down, company salah karena permintaan tidak lengkap | Toast error, 500, angka UI tidak sesuai Expected pada data yang benar |
| TC | Not Execute | Failed + Done + Error |
| Test Result | Tidak diisi | Failed |
| Card Error | Tidak dibuat | Dibuat |

Status papan BLOCKED (`71` pada TC, `361` pada tipe lain) bukan nilai Test Result. Jangan mengisi Test Result dengan Blocked.

### 4.6 Triase sebelum gagal

Urutan:

1. Baca `test-results/**/error-context.md` bila Playwright yang gagal.
2. Cocokkan dengan jebakan komponen di `tests/ui-components.md` (multiselect, dialog, numeric mask, datepicker, modal outstanding).
3. Cek company aktif, role akun, dan kepemilikan data. 403 atau "You do not have access…" sering berarti company atau role salah, bukan bug produk.
4. Baru bila langkah, data, company, dan role sudah benar dan UI tetap menyimpang dari Expected: itu temuan produk.

Jangan memaksa hasil hijau. Jangan menandai Passed dari tangkapan Browser MCP saja. MCP boleh untuk melihat selector. Hasil resmi adalah UI yang kamu assert, lalu tertulis di Jira.

Uji negatif yang tidak boleh menabrak data bersama: gagalkan request lewat `page.route` sebelum aksi, bila itu yang diminta skenario. Input dikosongkan dengan `fill('')`.

### 4.7 Cara menjalankan UI

- Headless. Headed hanya bila user meminta.
- Helper dan POM yang sudah ada di `tests/helpers/` dan `tests/pom-registry/` lebih dulu. Kontrak komponen di `tests/ui-components.md`.
- Spec tidak membaca description Jira. Kamu yang mencocokkan Expected dengan assert.
- Tag regresi yang disimpan: `@ETM-xxxxx`. Satu card yang diuji sekali tidak wajib di-commit.
- Jangan mengulang login untuk setiap percobaan selector. Satu sesi per kelompok.
- Retries pada spec yang mengubah data: `0`. Berhenti setelah satu gagal yang sudah ditriase. Jangan memutar sampel dingin berkali-kali supaya "mungkin hijau".

---

## 5. Cek build dan deploy

Lakukan sebelum menilai sebuah **fix**. Bukan syarat untuk setiap cek kosmetik yang tidak mengklaim commit tertentu.

### 5.1 Yang dicatat

Catat stamp frontend dan stamp backend **bila terlihat**. SOP Bugsy menyebut stamp backend `last-be-commit`. Pada 2026-11-09 repo docs ini tidak memuat helper yang mengambil field itu. Cara yang sah:

1. Setelah login, catat teks versi atau commit yang benar-benar tampil di UI, atau header respons yang benar-benar kamu baca.
2. Pisahkan FE dan BE. Yang tidak tampak ditulis `tidak tersedia`.
3. Jangan mengisi hash dari dugaan, dari commit yang "seharusnya", atau dari memori chat.

Bandingkan stamp BE yang terlihat dengan commit fix dan dengan branch yang **benar-benar** terpasang hari itu. Jangan memakai asumsi tanggal lama sebagai fakta tetap.

Konteks yang pernah diberikan user pada 2026-10-30, dan harus diperlakukan sebagai konteks waktu itu saja: produksi Tyas dan Merdian saat itu disebut berada di branch `staging`. Host staging biasanya di branch `dev`, dan saat itu sementara di `external-api`. Sebelum menilai "fix belum naik" atau "fix gagal", cek branch dan stamp yang hidup hari ini. Kalau tidak bisa dicek, tulis tidak tersedia. Jangan menyalin nama branch 30 Oktober ke laporan seolah baru saja diverifikasi.

### 5.2 Belum ter-deploy

Bila stamp ada dan commit fix tidak ada di build itu:

- Jangan Failed.
- Jangan buat card Error.
- TC tetap TESTING PROGRESS.
- Laporan: fix belum ke-deploy, sebut stamp yang terlihat.

Nilai yang tersimpan pada saat aksi tetap basi setelah deploy berikutnya. Contoh pelajaran SOP: `coa_id` GL pada baris credit note, kasus ETM-16808 tanggal 26 Oktober 2026, gagal palsu karena diuji sekitar 20 menit sebelum deploy. Setelah fix benar-benar ada di build, uji ulang dengan baris baru.

### 5.3 Stamp tidak ada

"Tidak tersedia" bukan "belum ter-deploy" dan bukan gagal produk. Uji hanya perilaku yang tidak bergantung pada klaim "fix sudah hidup". Bila seluruh card adalah "apakah fix ini sudah benar", berhenti dan laporkan bahwa cek deploy tidak bisa dilakukan. Jangan mengarang stamp supaya pohon keputusan bisa dipilih.

---

## 6. Keselamatan environment, company, dan data

### 6.1 Environment

| Target | Host UI | Kapan | Mutasi data |
|--------|---------|-------|-------------|
| Staging | `https://staging.olshoperp.com` | Default | Boleh membuat data uji yang memang termasuk scope, dengan jejak `QA-AUTO` |
| Tyas | `https://tyas.olshoperp.com` | User menulis ingin uji di Tyas | Baca saja. Tidak create, tidak ubah, tidak hapus |
| Merdian | `https://merdian.olshoperp.com` | User menulis ingin uji di Merdian **dan** pesan yang sama memuat kode persis `yemimamerdian` | Baca saja, termasuk query DB dengan `DB_DEBUG_API_KEY_MERDIAN` |

Kode Merdian yang mirip, kode di chat kemarin, atau kode di manual ini sebagai pengingat, **bukan** izin. Tiap permintaan baru harus membawa kodenya sendiri. Salah atau tidak ada → jangan login, jangan Playwright, jangan DB. Balas bahwa uji Merdian butuh kode dari Yemima di pesan yang sama.

Jangan menolak Tyas atau Merdian hanya karena hostname tidak mengandung kata staging. Jangan meminta host salinan. Jangan membuat data di Tyas atau Merdian walaupun Expected card meminta create. Berhenti dan laporkan.

API staging yang tercatat di `env-config.ts`: `https://api.staging.olshoperp.com/api`. Tyas: `https://api.tyas.olshoperp.com/api`. Merdian: `https://api.merdian.olshoperp.com/api`.

### 6.2 Company

Bila user menyebut company, pakai company itu. Bila tidak: coba 153 lumicharmsid, lalu 112 FAT, lalu 13 DEV-STG. 810, 3, dan 915 hanya bila disebut.

Switch dengan `switchCompanyByCode`. Baca kembali id company sebelum membuat atau mengubah data.

### 6.3 DB dan log

DB hanya baca: `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`, `WITH`. Filter company (`owned_by` atau `company_id` sesuai tabel). Bila "tidak ketemu", cek `deleted_at`. Hasil DB menunjang precondition atau forensik. Lulus dan gagal tetap dari UI, kecuali user meminta uji API atau uji data sebagai scope.

Webhook, dari runbook:

| Env | URL | Body `db` | Key |
|-----|-----|-----------|-----|
| Staging | `https://n8n.olshoperp.com/webhook/agent-db-tyas` | `staging_olshoperp` | `DB_DEBUG_API_KEY` |
| Tyas | URL yang sama | `tyas_olshoperp` | `DB_DEBUG_API_KEY` |
| Merdian | `https://n9n.olshoperp.com/webhook/agent-db-merdian` | `merdian_olshoperp` | `DB_DEBUG_API_KEY_MERDIAN` |

Log, dari rule 21 (bukan skrip `.mjs` yang masih disebut di skill card-testing §9):

| Server | URL | Key |
|--------|-----|-----|
| Staging dan Tyas | `https://n8n.olshoperp.com/webhook/agent-log-tyas` | `LOG_DEBUG_API_KEY` |
| Merdian | `https://n9n.olshoperp.com/webhook/agent-log-merdian` | `LOG_DEBUG_API_KEY_MERDIAN` |

Nama file log: `laravel-YYYY-MM-DD.log`. Jangan menempel stack panjang ke Telegram. Jangan menempel API key.

Redis Horizon hanya operasi baca yang runbook sebut (`get`, `keys`, `info`, `llen`, `zcard`, `zrangebyscore`) bila user atau forensik antrian memang membutuhkan. Bukan bagian setiap uji.

### 6.4 Data uji

Urutan sumber data: kalimat user → description dan komentar card (termasuk komentar Moira) → requirement atau feature-map → baru cek apakah data itu ada. Data yang disebut user dan tidak ada: berhenti. Jangan mengganti SKU lain diam-diam.

Prefix jejak: `QA-AUTO`. Bentuk yang sudah dipakai di repo antara lain `QA-AUTO-…` pada kode, dan `QA ETM-xxxxx` plus tanggal pada nama atau description. Catat setiap kode yang dibuat atau dipakai.

Jangan menghapus data uji setelah run. Pengecualian: TC itu sendiri menguji delete atau show-deleted. Hapus hanya baris yang TC itu buat pada run ini, yang kodenya sudah kamu catat. Draft PO/SO yang otomatis tercipta saat membuka form create juga dibiarkan, dan diberi jejak bila field-nya bisa diedit.

Jangan membuat data di luar scope yang didelegasikan. Tidak ada izin "sekalian buat master supaya bisa lanjut". Menunggu Moira adalah hasil yang sah.

Label `need-data` pada TC berarti penyiap data (Moira) diharapkan menyiapkan atau me-reserve data staging lalu menulis komentar. SOP card menyebut kode `TDB-xxxx`. Skill authoring menyebut pola komentar `TD-xxxx` (contoh yang disebut di skill: ETM-17014). Pakai kode yang **tertulis di komentar**. Jangan mengarang kode. Jangan memanggil webhook Moira sendiri. Belum ada komentar data siap, dan kamu tidak diminta membuat datanya: Not Execute, laporan "menunggu data".

TC yang mengubah setting bersama (konfigurasi, flag, harga acuan yang dipakai orang lain):

1. Baca nilai asli dari UI sebelum diubah. Catat.
2. Jalankan langkah.
3. Kembalikan ke nilai asli.
4. Muat ulang dan baca lagi. Nilai di layar harus sama dengan nilai asli.
5. Tulis nilai asli, nilai sementara, dan nilai setelah dipulihkan di Actual atau komentar.

Gagal pulih: berhenti. Jangan menyembunyikan di catatan kecil. Tulis setting, nilai asli, nilai sekarang, apa yang sudah dicoba, dan siapa atau alur mana yang terdampak. Card tidak boleh Passed. Ini blocker pemulihan, masuk checkpoint bila sesi putus.

### 6.5 Sync marketplace

Jangan mengklik Sync per baris, Sync header, atau Sync All yang mendorong harga atau stok ke marketplace, kecuali pesan yang sama secara eksplisit mengizinkan dorongan itu. Melihat tombolnya bukan izin. Membuka baris, memfilter, dan mengekspor yang tidak mendorong ke toko boleh bila itu isi Expected.

Keputusan domain harga ada di [§9](#9-keputusan-domain-harga-dan-ux).

---

## 7. Output Jira: TC, non-TC, Error, status

### 7.1 Identitas field

| Field | Id | Dipakai pada |
|-------|-----|--------------|
| Menu Name / Notion Page | `customfield_10429` | Semua create. Sama dengan nama di dalam kurung siku judul |
| Request ID | `customfield_10495` | Semua create |
| Story Points | `customfield_10043` | Semua create |
| Actual Result | `customfield_10203` | **Hanya Test Case.** Isi saat uji selesai (lulus atau gagal aplikasi) |
| Test Result | `customfield_10202` | **Hanya Test Case.** `Passed` atau `Failed` |
| Labels | `labels` | Wajib tidak kosong |
| Assignee | `assignee.accountId` | Wajib saat create |

Issuetype yang tercatat: Error `10033`, Change Requirement `10048`, Test Case `10051`, Improvement `10088`. Jangan membuat tipe `Bug`. Di ETM itu subtask.

Test Result diisi dengan nama opsi, bentuk yang ditulis rule dan reference: `{"value":"Passed"}` atau `{"value":"Failed"}`. Rule 12 pada saat dibaca 2026-11-09 juga menyebut id opsi Passed `10343`, Failed `10342`, Blocked `10344`. Utamakan nama opsi. Bila ditolak, baca skema field yang hidup sekali. Jangan mengarang id baru. Jangan mengirim Blocked.

Actual Result pada REST v3 berbentuk dokumen ADF, bukan teks polos, bila kamu menulis lewat REST mentah. Komentar v3 juga ADF. Bila tool menerima markdown dan menolak, baca error-nya sekali lalu pakai bentuk yang diminta tool itu. Jangan menumpuk beberapa bentuk dalam satu payload.

### 7.2 Jeda dan bentuk transisi

Jeda antar panggilan Jira yang mengubah data sekitar 2,5 detik. **Create** (TC, subtask TC, Error, clone, create lain) jeda minimal 3 detik, termasuk create beruntun. Jangan paralel.

Transisi: pakai tabel id di bawah. Jangan `GET transitions` lebih dulu. `GET` sekali hanya bila panggilan transisi gagal, lalu pilih id yang nama status **tujuannya** cocok. Perbaiki catatanmu bila id hidup berbeda. Sebagian id Story, Task, dan CR di tabel non-TC diasumsikan sama dengan Error dan Improvement oleh SOP 28 Oktober 2026. Bila asumsi itu gagal, baru ambil daftar transisi.

Bentuk parameter tidak sama antar tool. Kesalahan yang sudah terjadi: ada pemanggil yang membungkus `transition` bersarang, ada yang mengirim `transitionId` di level atas. Jangan mengunci satu bentuk. Bila gagal, baca skema tool atau teks error sekali, lalu kirim bentuk yang diminta. Id-nya tetap dari tabel ini.

**Test Case dan Subtask Test Case.** Tidak ada RE-OPEN. Dari status mana pun ke status tujuan:

| Ke status | Id |
|-----------|----|
| TESTING PROGRESS | 4 |
| Done | 2 |
| BLOCKED (status papan, bukan Test Result) | 71 |
| Re-Test | 61 |
| Not Execute | 11 |
| Cancelled | 3 |

Jalur uji TC: Not Execute atau status lain → TESTING PROGRESS (`4`) → selesai → Done (`2`), baik Passed maupun Failed. TC yang sudah Done lalu diuji lagi: masuk TESTING PROGRESS (`4`) dulu.

**Error, Improvement, CR, Story, Task:**

| Arah | Id |
|------|----|
| Ke TESTING PROGRESS | 6 |
| Ke RE-OPEN | 10 |
| Ke Cancelled | 12 |
| Ke PENDING DISCUSSION | 351 |
| Ke BLOCKED | 361 |
| QA Review → Done | 291 |
| QA Review → Closed | 5 |
| QA Review → Rejected | 311 |
| OTW DEV → QA Review | 341 |
| In Progress → QA Review | 171 |
| To Do → In Progress | 11 |
| RE-OPEN → Done | 2 |
| TESTING PROGRESS → Done | 7 |
| BLOCKED → QA Review | 391 |

Tidak ada Done langsung dari To Do, In Progress, atau OTW DEV. Lewat QA Review (`341` atau `171`, lalu `291`) hanya bila user meminta status itu. Id `4` dan id `2` tidak boleh ditukar antar tipe: `4` adalah TESTING PROGRESS pada TC, `2` adalah Done pada TC tetapi Done dari RE-OPEN pada tipe lain.

### 7.3 TC lulus

1. Actual Result (`10203`) memakai template [§8.1](#81-template-bukti).
2. Test Result (`10202`) = Passed.
3. `GET` keduanya. Teks Actual memuat company, identitas login (bukan sandi), dan kode data. Test Result terbaca Passed.
4. Baru transisi Done (`2`).
5. `GET` status. Nama status Done, Test Result tetap Passed.

Bila baca-ulang beda, jangan memberi tahu user bahwa card sudah Done.

Cakupan sebagian tidak memakai jalur ini.

### 7.4 TC gagal karena aplikasi

1. Actual Result lalu Test Result Failed.
2. Baca ulang.
3. Done (`2`) pada TC.
4. Buat satu card Error bila penyebabnya sama untuk beberapa TC. Jangan satu Error per TC untuk akar yang sama. Tautkan semua TC yang gagal karena akar itu.
5. Jeda create minimal 3 detik.
6. Isi field wajib, lalu `GET` `customfield_10495`, `customfield_10429`, `customfield_10043`, `labels`, `assignee`. Yang salah diperbaiki sekali, `GET` lagi. Masih salah: berhenti, jangan lanjut ke card berikutnya.
7. Tautan:
   - Tipe **QA Test Case**: Error di sisi inward, TC di sisi outward. Jangan dibalik.
   - **Relates** dari Error ke card origin.
   - Clone Error memakai tipe **Cloners** bila tool menyediakannya: inward = clone, outward = origin (catatan reference card-testing).
8. Assignee Error = developer origin, bukan QA pemilik TC. Bila assignee origin bukan developer: (1) nama yang disebut di permintaan create, (2) developer pada origin yang berelasi, (3) tanya Rachy atau Hazel. Tidak ketemu → jangan membuat card tanpa assignee.
9. Origin Error: RE-OPEN (`10`) lalu clone berjudul `RE-OPEN [Menu] - …`.
10. Origin Improvement, CR, Story, Task: RE-OPEN (`10`) tanpa clone.

Arah "Relates ke TC" yang masih tertulis di skill card-testing §3 dan rule 22 jangan dipakai untuk membalik QA Test Case. Satu hubungan TC–Error lewat QA Test Case dengan arah di atas. Hubungan ke origin lewat Relates. Bila nama link ditolak, ambil daftar tipe link sekali, pilih yang namanya QA Test Case, jangan menebak id.

### 7.5 Di luar aplikasi

TC ke Not Execute (`11`). Kosongkan niat mengisi Test Result. Jangan membuat Error. Laporan menyebut penghambat dan siapa yang bertindak (Moira untuk data, infra untuk antrian, user untuk company atau akun).

Bila Test Result sempat terisi oleh percobaan sebelumnya, baca dulu. Jangan menimpa dengan Passed. Sebut di komentar bahwa uji dikembalikan ke Not Execute dan Test Result lama tidak boleh dibaca sebagai hasil akhir bila masih terisi. Jangan mengarang bahwa field itu kosong.

### 7.6 Non-TC

Hasil uji = komentar dengan template §8.1. Jangan menulis `customfield_10203`.

Geser status hanya bila permintaan yang sama meminta status itu. User meminta Done padahal cakupan belum lengkap: lakukan transisi yang diminta, dan komentar tetap menyebut poin yang belum diuji. Jangan mengubah kalimat itu menjadi lulus penuh.

### 7.7 Isi card Error

Judul: `[Nama Menu] - deskripsi pendek`. Clone reopen: `RE-OPEN [Nama Menu] - deskripsi pendek`.

Description memakai pemisah `---` di antara setiap section. Bahasa section utama untuk QA dan PM. Nama class, job, tabel, dan queue hanya di Additional Context di bawah judul **Catatan teknis**.

```text
**Summary**
Apa yang rusak, di menu apa, kondisi pemicu.

---

**Environment**
- Menu/Fitur: …
- Environment: Staging atau yang dipakai
- URL (retest): …

---

**Precondition Data**
Company, status dokumen, kode data. Bukan "siapkan data".

---

**Steps to Reproduce**
1. …
2. …

---

**Expected Result**
Apa yang seharusnya terlihat di layar, dari requirement atau Expected card yang sudah kamu laporkan sumbernya.

---

**Actual Result**
Apa yang terlihat. Kutip pesan di layar.

---

**Additional Context**
Frekuensi, kode data, link TC.
**Catatan teknis**
Stamp build, kode respons, nama file bila perlu developer. Kosong yang sah ditulis "(tidak ada catatan tambahan)".
```

Story Points menyalin origin bila origin memilikinya. Bila harus mengisi baru karena kosong, angka di tabel rule 12: Error 1 atau 2, TC 1 atau 0,5, Improvement 3 atau 5, CR 3 atau 5. Jangan mengarang angka di luar yang tertulis di rule itu. Labels Error minimal mengandung label yang rule 12 contohkan untuk bug (`bug`) plus key yang menautkan ke asal bila itu praktik card yang sedang kamu salin. Jangan mengosongkan labels.

Kebocoran data: card terpisah, priority Highest. Jangan menaruh data orang lain di komentar publik lebih dari yang dibutuhkan untuk developer memperbaiki.

### 7.8 Request ID

Rule 12 di repo ini, dibaca 2026-11-09, hanya mengizinkan:

1. Id Lark yang cocok `^rec[A-Za-z0-9]+$`, disalin persis dari origin atau Relates, atau
2. Literal `none`.

`REQ-…`, `-`, kosong, spasi, `n/a`, `NONE` tidak disalin. Tidak ada `rec…` yang sah → `none`, dan catat itu di laporan. Layar create TC tidak menampilkan field ini. Tetap di-set lewat API.

SOP card Bugsy bertanggal 2026-11-09 sempat menulis `rec…` atau `REQ-…` sebagai nilai sah. Itu bertentangan dengan rule 12 dan dengan `tc_lib.py`, yang menolak `REQ-…`. Ikuti rule 12 yang hidup saat kamu membuat card. Baca ulang rule-nya. Detail ada di [§12](#12-sumber-tanggal-dan-konflik-yang-harus-dibaca-ulang).

### 7.9 Membuat TC baru

Bukan langkah uji. Bila user meminta buat TC:

- Satu card = satu `test_type`: `happy`, `negative`, `edge`, `permission`, `regression`, atau `cross-menu`.
- Label `test-type-{type}`.
- Tipe yang relevan terhadap AC tidak digabung ke happy. Lewati tipe hanya bila tidak berlaku, dan sebut alasannya.
- Expected dari `requirement.md` atau `feature-map.md` yang statusnya boleh dipakai. Requirement draft: kembalikan ke peminta, jangan mengarang.
- Precondition bisa dijalankan. Bila butuh data khusus, label `need-data`. Ragu → pasang `need-data`.
- Assignee TC digilir **Firda** dan **Jeiniffer** lewat [`.cursor/skills/olshoperp-testcase-authoring/tools/tc_lib.py`](../../.cursor/skills/olshoperp-testcase-authoring/tools/tc_lib.py). Nama di kode: `QA_TESTERS = ["Firda", "Jeiniffer"]`. `accountId` dicari ke Jira pada saat create. Default mulai dari Firda. User menyebut nama lain → pakai nama itu bila orangnya QA. Jangan mengarang `accountId`.
- Username Telegram `Jeiniiii` dan `dapirdaa`, serta file `telegram-jira-mapping.json` dan `/workspace/hazel-tc-assignee-rotation.json`, hanya disebut di SOP card Bugsy. File itu tidak ada di repo ini pada 2026-11-09. Jangan mengarang id dari username itu. Pakai pencarian Jira di `tc_lib.py`. Bila pencarian tidak tepat satu orang, berhenti.
- Perintah: `python3 .cursor/skills/olshoperp-testcase-authoring/tools/tc_lib.py file_data.py create` dari folder skill itu, setelah menyalin contoh data. Jangan create TC lewat MCP mentah. Kasus 30 Oktober 2026: TC terbit tanpa Menu dan tidak bisa masuk TESTING PROGRESS.
- Jeda create minimal 3 detik.

---

## 8. Bukti, komentar, Telegram, Drive

Sumber hasil TC adalah Jira. Bukan file `TC-*.md`. Bukan tangkapan yang tidak ditulis di Actual.

Default bukti: teks dan link. Tidak ada unggah gambar. Lampiran Jira sering gagal. Jangan mengklaim lampiran berhasil sebelum id lampiran terbaca kembali. Drive hanya bila permintaan ini meminta unggah.

### 8.1 Template bukti

Dipakai sebagai Actual Result pada TC, atau sebagai komentar pada non-TC. Ganti tanda kurung. Jangan meninggalkan tanda kurung pada card sungguhan.

```text
Hasil: lulus / gagal / sebagian / tidak bisa diuji / fix belum ke-deploy
Waktu: {YYYY-MM-DD HH:mm} WIB
Environment: {staging|tyas|merdian}
Company: {label} / id {n} / code {code}
Login: {email akun uji}
Build FE: {stamp atau "tidak tersedia"}
Build BE: {stamp atau "tidak tersedia"}
Data: {kode QA-AUTO atau kode yang dipakai} · {URL edit bila ada}
Setting bersama: {tidak diubah | asli → sementara → pulih dan dibaca ulang}
Langkah singkat:
1. …
Cakupan Expected:
- {poin}: lulus | gagal | belum | tidak bisa diuji
Pembersihan: {sesi path yang dihapus, tanpa isi | data tidak dihapus | baris delete TC: kode}
Retest: {tidak perlu | uji ulang dengan baris baru setelah deploy | tunggu Moira}
Catatan: {blocker, 403, atau "tidak ada"}
```

Identitas login adalah email atau nama akun, bukan sandi, bukan token, bukan isi file `.auth`.

### 8.2 Template situasi

Semua blok di bawah ini **contoh bentuk**. Nilai `ETM-00000` dan kode `QA-AUTO-CONTOH` bukan hasil uji.

**Satu card lulus**

```text
Hasil: lulus
Waktu: 2026-11-09 10:00 WIB
Environment: staging
Company: Lumi Charms.id / id 153 / code lumicharmsid
Login: {email akun khusus agent}
Build FE: tidak tersedia
Build BE: {stamp yang terlihat}
Data: QA-AUTO-CONTOH-001
Setting bersama: tidak diubah
Cakupan Expected:
- Poin 1: lulus
- Poin 2: lulus
Pembersihan: file sesi run ini dihapus, isi tidak dicatat
Retest: tidak perlu
```

**Batch**

```text
Batch: 3 card · lulus 1 · gagal 1 · tidak bisa diuji 1
ETM-00001 · lulus · 2/2 poin · data QA-AUTO-CONTOH-001
ETM-00002 · gagal · 1/2 poin · Error ETM-00099 · origin ETM-00088 RE-OPEN
ETM-00003 · tidak bisa diuji · menunggu komentar data Moira · Not Execute
Company: 153 lumicharmsid · satu sesi · tidak ada card yang diuji di company lain
```

**Tidak bisa diuji**

```text
Hasil: tidak bisa diuji
Alasan: precondition "SO Approved, DO Shipped, belum ada Sales Invoice" tidak ada di company 153, komentar Moira belum ada
Yang dibutuhkan: Moira menyiapkan data staging dan menulis kode di komentar TC
Jira: TC dikembalikan ke Not Execute. Test Result tidak diisi. Error tidak dibuat
```

**Belum ter-deploy**

```text
Hasil: fix belum ke-deploy
Build BE yang terlihat: {stamp}
Commit fix yang dibandingkan: {sha dari card}
Jira: tetap TESTING PROGRESS. Bukan Failed. Error tidak dibuat
```

**Gagal aplikasi**

```text
Hasil: gagal
Poin 2: toast menampilkan "{pesan di layar}", Expected card: "{kutipan Expected}"
Triase: company 153, role akun uji, error-context tidak menunjukkan salah selector
Jira TC: Actual diisi, Test Result Failed, status Done, sudah dibaca ulang
Error baru: ETM-00099
Tautan: QA Test Case Error inward / TC outward · Relates ke origin ETM-00088
Origin: Improvement, RE-OPEN tanpa clone
Assignee Error: developer origin, bukan assignee TC
```

### 8.3 Telegram

Kirim hanya bila token bot ada di env agent ini dan permintaan sesi ini memang meminta laporan ke Telegram. Izin yang tersimpan di mesin agent lama tidak pindah bersama manual ini.

Target dari SOP Bugsy:

| Item | Nilai |
|------|--------|
| Grup | chat id `-1001931573603` |
| Thread | `51478` |
| Bot yang disebut target sementara | `@OERPAssistBot`, token env `TELEGRAM_OERP_ASSIST_BOT_TOKEN` |
| Bot lain menurut SOP yang sama | `@OlshopERP_bot` disebut sebagai target, dan `TELEGRAM_BOT_TOKEN` disebut sebagai bot yang berbeda |
| Parse | HTML |
| Bahasa | Indonesia santai |
| Balas ke | `message_id` pesan `/bugsy` bila provenance ada |

Sebelum mengirim, cocokkan bot mana yang sesi ini boleh pakai. Skill card-testing masih menulis `TELEGRAM_BOT_TOKEN` sebagai bot laporan. SOP Bugsy membedakan kedua token. Jangan mengirim dengan token yang tidak kamu pahami pemiliknya. Jangan mencetak token. `getUpdates` yang menjawab 409 karena webhook sedang terpasang: katakan 409, jangan menebak isi balasan orang.

Urutan kirim:

1. Pesan interim lebih dulu ("sedang diuji", sebut key dan company), supaya batch panjang tidak diam.
2. Batch 3 card atau lebih: satu pesan, diperbarui dengan `editMessageText`.
3. Bila teks melewati 4096 karakter, pecah di batas antar card, bukan di tengah satu card.
4. Escape HTML: `&` menjadi `&amp;`, `<` menjadi `&lt;`, `>` menjadi `&gt;`.
5. Pesan akhir memakai bentuk di bawah.
6. Footer persis: `dijalankan agent atas permintaan Yemima · cc @yemimatifani`. Bila pengirim bukan Yemima, cc `@username` pengirim.

Satu card:

```text
🐱 Bugsy Test Report — ETM-00000
https://erpintegration.atlassian.net/browse/ETM-00000
staging · company 153 lumicharmsid · build {stamp atau tidak tersedia} · {jam} WIB
Hasil: lulus (2/2)
- poin 1 lulus
- poin 2 lulus
Data: QA-AUTO-CONTOH-001
Jira: TC Done, Test Result Passed, sudah dibaca ulang
dijalankan agent atas permintaan Yemima · cc @yemimatifani
```

Batch:

```text
🐱 Bugsy Batch Report — 3 card
lulus 1 · gagal 1 · tidak bisa diuji 1
ETM-00001 lulus (2/2) data QA-AUTO-CONTOH-001
ETM-00002 gagal · Error ETM-00099 · origin ETM-00088 RE-OPEN
ETM-00003 tidak bisa diuji · Not Execute · menunggu Moira
dijalankan agent atas permintaan Yemima · cc @yemimatifani
```

Webhook: laporan ada di Telegram. Jangan menyalinnya lagi ke chat. Chat langsung tanpa Telegram: satu kalimat di akhir, detail ada di Jira.

### 8.4 Drive

Folder yang disebut SOP: [Temuan Bugsy](https://drive.google.com/drive/folders/167QtP9hNLYjDibgRL6DVd9nbgEDJ2dgU), subfolder nama key, **hanya** bila user pada permintaan ini meminta unggah. Gagal unggah tetap gagal. Jangan menulis "sudah di Drive" tanpa id file yang terbaca kembali. Bukti yang wajib tetap teks di Jira.

---

## 9. Keputusan domain harga dan UX

Keputusan user 2 November 2026 untuk menilai perilaku, bila card yang diuji menyentuh harga ini. Baca juga requirement hidup sebelum menilai, karena dokumen requirement bisa bergerak. Pada 2026-11-09, [`qa-docs/businessdevelopment-pricelist-product/requirement.md`](../../qa-docs/businessdevelopment-pricelist-product/requirement.md) sudah sejalan dengan keputusan "Manual tidak ditimpa" (changelog 1.3 pada 28 Oktober 2026 dan 1.6 pada 5 November 2026, AC A-07, A-15, §5). Dokumen atau catatan lama yang mengatakan Update to Pricelist menimpa manual margin tidak dipakai.

| Kondisi | Perilaku yang dianggap benar |
|---------|------------------------------|
| Manual Margin = Yes | Update to Pricelist tidak mengganti margin manual. Final mengikuti harga default + margin yang diisi user + tier category |
| Manual Margin = No | Nilai dihitung ulang. Bukan sisa edit manual |
| Edit Final Price atau manual margin | Tidak mensyaratkan produk terikat ke store, dan tidak mensyaratkan tipe store platform. Berlaku juga untuk store Others |
| Platform | Hanya relevan bila ada izin eksplisit untuk mendorong Sync, dan hanya untuk produk yang terikat, dan hanya bila Category Price punya store platform |
| Sync tanpa izin di pesan | Tidak diklik. Lihat [§6.5](#65-sync-marketplace) |

Export mengikuti kolom yang terlihat di layar menu itu. Jangan membuat uji "role A tidak boleh melihat kolom" sebagai syarat lulus export, bila kolom itu memang bukan kolom layar menu tersebut.

| Layar | Unit Price di export |
|-------|----------------------|
| Stock Addition | Tidak ada kolom Unit Price |
| Approval, dan detail Approval | Ada Unit Price |

Bila layar menu yang kamu uji menampilkan kolom lain, export mengikuti kolom yang terlihat di layar itu, bukan daftar role.

UX, dari [`tests/UX-STANDARD.md`](../../tests/UX-STANDARD.md). Yang belum diputuskan di §5 tidak boleh dijadikan gagal atau lulus:

1. Alur create yang langsung menjadi draft lalu edit, versus create lalu kembali ke daftar.
2. Hapus baris detail PO tanpa dialog konfirmasi.

Yang sudah diputuskan dan boleh jadi temuan bila card memang menguji UX atau bila penyimpangannya bagian dari Expected:

| Topik | Keputusan |
|-------|-----------|
| Delete di halaman | Warna primary, bukan merah |
| Delete di modal konfirmasi | Merah `rgb(193, 0, 7)`, teks putih, konsisten antar menu. Beda warna = gagal untuk uji UX ini |
| Sel kode | Bisa diklik ke halaman dokumen. Tidak ada kolom Open kedua untuk tujuan yang sama |
| Menu tanpa Advanced Filter | Pencarian global contains di kolom yang tampil. Prefix-only = gagal untuk uji UX ini |
| Menu dengan Advanced Filter | Prefix ditoleransi |
| Export | Halaman aktif boleh. Header sama dengan datalist. Tipe numerik hanya untuk kolom yang murni angka |
| Show deleted | Teks merah `Deleted` di kolom Action |
| Toast target | `Data has been successfully created.` / `updated.` / `deleted.` |
| Save | Label `Save All` sama di create dan edit. Inline edit tersimpan tanpa Save All |
| Audit Log | Slide-over, bukan section di badan form |

Uji fungsional sebuah card bisnis tidak otomatis menjadi crawl UX penuh. Jalankan pilar UX bila Expected card atau permintaan user mencakupnya. Jangan menggagalkan card harga hanya karena jarak piksel belum dikunci di §2.7.

---

## 10. Handoff saat kuota atau sesi putus

Kuota habis berarti pekerjaan berhenti di mesin ini. Tidak ada runtime yang ikut pindah ke agent lain. Agent berikut mulai dari repo, dari Jira yang hidup, dan dari checkpoint. Ia tidak mewarisi sesi browser, token, atau izin Merdian.

Sebelum mengulang mutasi (create Error, komentar, transisi, kirim Telegram): baca keadaan hidup. Komentar yang sudah ada tidak ditulis lagi. Card Error yang sudah ada untuk akar yang sama tidak dibuat lagi. Pesan Telegram yang sudah terkirim tidak dikirim ulang. Izin produksi yang kedaluwarsa tidak dilanjutkan.

Jangan mengedit `TC-*.md`.

### 10.1 Isi checkpoint

Simpan di pesan ke agent berikut, atau di `tests/scratch/handoff-{key}.md` yang tidak di-commit. Jangan menaruh isi cookie, sandi, atau token.

```text
CHECKPOINT — ganti tanda kurung. Jangan mengarang field yang tidak kamu lakukan.
Waktu WIB: {YYYY-MM-DD HH:mm}
Pintu: {chat|telegram} · chat_id {atau -} · message_id {atau -} · thread {atau -} · pengirim {@atau nama}
Key: {ETM-… URL}
Tipe dan status Jira terakhir yang terbaca: {Test Case · TESTING PROGRESS}
Company: {label / id / code}
Akun: {email saja}
Env: {staging|tyas|merdian}
Build FE: {stamp atau tidak tersedia}
Build BE: {stamp atau tidak tersedia}
Path sesi: {tests/.auth/… path saja, isi tidak disalin} · {dihapus|dibiarkan karena path bersama}
Data yang dibuat: {kode atau "tidak ada"}
Data yang dipakai: {kode}
Setting bersama: {asli, sekarang, sudah dipulihkan atau BELUM}
Cakupan:
- poin 1: {lulus|gagal|belum|tidak bisa}
- poin 2: …
Aksi terakhir yang benar-benar terjadi: {satu kalimat}
Tulisan Jira:
- {transisi / field / comment id} · sudah dibaca ulang: {ya, nilai yang terbaca|belum}
Laporan:
- Telegram message_id {atau tidak dikirim, alasan}
Belum beres:
- {pemulihan setting|data Moira|sisa poin}
Jangan dilakukan agent berikut tanpa izin baru:
- {Merdian, Sync, hapus data, Done paksa}
Langkah minimum berikutnya:
- {satu aksi, setelah membaca status Jira hidup}
```

### 10.2 Pesan pendek ke agent lain

Ini yang dikirim bila kanalnya antar-agent. Jangan menempel manual ini.

```text
NEED: lanjut uji yang terputus
Manual: docs/qa/bugsy-agent-handoff.md
Keys: ETM-00000
Checkpoint: {path tests/scratch atau tempel checkpoint}
Company / akun: 153 / {email}
Jangan: ulang komentar id {…}, jangan ulang Error yang sudah ada, izin Merdian tidak ikut
Report back: ya — status akhir per key
```

`ETM-00000` di blok itu contoh. Ganti dengan key sungguhan saat dipakai.

### 10.3 Prompt awal untuk agent pengganti

Salin, isi kurung, kirim sebagai pesan pertama.

```text
Kamu melanjutkan uji QA OlshopERP yang terputus. Bukan developer.

Baca dulu, di repo olshoperp-docs:
docs/qa/bugsy-agent-handoff.md
Lalu baca card Jira hidup, field minimal seperti manual §4.1. Jangan changelog penuh.

Card: {ETM-…}
Permintaan asal: {chat atau Telegram, message id bila ada}
Checkpoint:
{tempel checkpoint, atau tulis "tidak ada checkpoint"}

Aturan yang tidak boleh dilanggar:
- Akun uji lewat OLSHOP_TEST_EMAIL dan OLSHOP_TEST_PASSWORD milikmu. Jangan memakai fallback akun bersama.
- Staging, kecuali pesan ini secara eksplisit meminta Tyas (baca saja) atau Merdian (kode yemimamerdian harus ada di pesan ini, bukan di pesan lama).
- Company: {yang diminta, atau urutan 153 lalu 112 lalu 13}
- Jangan klik Sync marketplace kecuali pesan ini mengizinkan.
- Jangan hapus data kecuali TC-nya menguji delete dan hanya baris yang TC itu buat.
- Jangan Passed bila masih ada poin yang belum dijalankan.
- Sebelum menulis Jira atau Telegram, baca dulu supaya tidak dobel.
- Jangan cetak sandi, token, atau isi tests/.auth.
- Hasil TC hanya di Jira. Jangan edit TC-*.md.
- Selesai: isi checklist manual §11, sebut apa yang kamu baca ulang dari Jira.

Laporkan cakupan eksak per poin Expected, id komentar atau field yang kamu tulis, dan pemulihan setting bila ada.
```

---

## 11. Checklist selesai dan contoh

Centang hanya bila kamu sudah membaca kembali buktinya.

- [ ] Company yang dipakai sama dengan yang diminta, atau sama dengan urutan default, dan tertulis di bukti
- [ ] Stamp FE dan BE tertulis, atau tertulis tidak tersedia. Tidak ada hash karangan
- [ ] Setiap poin Expected punya hasil lulus, gagal, belum, atau tidak bisa diuji
- [ ] Tidak ada Passed pada cakupan sebagian
- [ ] TC selesai: Actual, Test Result, dan status Done sudah dibaca ulang
- [ ] TC gagal aplikasi: Error tertaut dengan arah QA Test Case yang benar, Relates ke origin, assignee developer, origin RE-OPEN sesuai tipe, satu Error untuk satu akar
- [ ] TC di luar aplikasi: Not Execute, tanpa Test Result baru, tanpa Error
- [ ] Fix belum di build: tetap TESTING PROGRESS, tanpa Error
- [ ] Non-TC: komentar ada. Status berubah hanya bila user meminta, dan bukti tidak menyebut lulus penuh bila cakupan belum lengkap
- [ ] Request ID yang ditulis `rec…` atau `none`, lalu dibaca ulang
- [ ] Data `QA-AUTO` tercatat. Tidak ada hapus di luar TC delete
- [ ] Setting bersama yang diubah sudah dibaca ulang sama dengan nilai asli, atau blocker pemulihan tertulis
- [ ] Sync marketplace tidak diklik, kecuali izin di pesan ini
- [ ] Telegram terkirim hanya bila diizinkan, message id tercatat, atau alasan tidak kirim tertulis
- [ ] File sesi milik run ini beres sesuai §3.4. Isi sesi tidak masuk laporan
- [ ] Tidak ada rahasia di chat, komentar, atau commit

### 11.1 Contoh keputusan

Placeholder. Bukan hasil yang pernah dijalankan untuk menulis manual ini.

**Lulus.** TC Expected dua poin, keduanya terlihat di UI company 153, Actual diisi, Test Result Passed, GET mengembalikan Passed dan status Done. Telegram, bila diizinkan, menyebut 2/2. Data `QA-AUTO-CONTOH-001` tidak dihapus.

**Gagal aplikasi.** Poin kedua menampilkan pesan error di layar pada data dan company yang benar, setelah `error-context` tidak menunjukkan salah klik. Test Result Failed, TC Done, Error `ETM-00099` inward ke TC, Relates ke origin Improvement, origin RE-OPEN tanpa clone. Assignee Error adalah developer origin.

**Di luar aplikasi.** Komentar Moira belum ada, precondition tidak ketemu di UI. TC Not Execute. Tidak ada Test Result. Tidak ada Error. Laporan meminta Moira menulis kode data.

**Error aplikasi yang menghentikan langkah.** Toast 500 saat menyimpan, company dan role sudah benar. Ini Failed, bukan Not Execute. Log boleh diambil lewat rule 21 untuk catatan teknis di Additional Context. Ringkas di Telegram, tanpa stack penuh.

**Belum ter-deploy.** Stamp BE yang terlihat tidak memuat commit fix. TC tetap TESTING PROGRESS. Kalimat laporan "fix belum ke-deploy" plus stamp. Bukan gagal produk.

**Sebagian.** Dua dari empat poin selesai dan cocok, dua belum karena anggaran habis. Test Result tidak diisi. Status tetap TESTING PROGRESS. Checkpoint menyebut dua poin tersisa. Agent berikut tidak mengubah dua poin yang sudah cocok menjadi Passed untuk seluruh card.

**403.** Respons akses ditolak. Cek company aktif dan akun. Bila company-nya salah, perbaiki switch, jangan buat Error. Bila TC memang menguji role tanpa izin dan tombolnya tersembunyi, itu bisa lulus untuk TC permission itu. Bila role dan company sudah benar dan Expected mengatakan aksi boleh, baru itu gagal aplikasi.

**Pulihkan harga atau setting.** Nilai asli margin 2.000. Uji mengubahnya menjadi 2.500. Setelah dikembalikan, reload masih 2.500. Actual dan checkpoint menulis blocker: asli 2.000, sekarang 2.500, pemulihan gagal, dampak ke pemakai company itu. Bukan Passed. Bila reload kembali ke 2.000, bukti menulis asli 2.000, sementara 2.500, pulih 2.000 dan sudah dibaca ulang.

---

## 12. Sumber, tanggal, dan konflik yang harus dibaca ulang

Verifikasi isi file repo untuk manual ini: 2026-11-09. Tidak ada verifikasi live ke Jira, Telegram, atau aplikasi pada penulisan manual.

| Sumber | Path |
|--------|------|
| Playbook uji Bugsy | Dirangkum ke manual ini dari SOP QA 2026-11-09. Upstream yang disebut playbook: skill card-testing, rule 03 dan 22, runbook, UX-STANDARD |
| Format card | SOP QA 2026-11-09, dicocokkan dengan [`.cursor/rules/12-jira-card-format.mdc`](../../.cursor/rules/12-jira-card-format.mdc) |
| Pesan antar-agent | SOP QA 2026-11-09: pesan handoff tetap pendek dan menunjuk file, tidak menempel SOP |
| Uji card | [`.cursor/skills/olshoperp-card-testing/SKILL.md`](../../.cursor/skills/olshoperp-card-testing/SKILL.md), [reference.md](../../.cursor/skills/olshoperp-card-testing/reference.md) |
| Authoring TC | [`.cursor/skills/olshoperp-testcase-authoring/SKILL.md`](../../.cursor/skills/olshoperp-testcase-authoring/SKILL.md) |
| Reopen | [`.cursor/rules/22-reopen-defect-flow.mdc`](../../.cursor/rules/22-reopen-defect-flow.mdc) |
| Log | [`.cursor/rules/21-log-debugger.mdc`](../../.cursor/rules/21-log-debugger.mdc) |
| Login | [`tests/helpers/company-access.ts`](../../tests/helpers/company-access.ts), [`tests/global-setup.ts`](../../tests/global-setup.ts), [`tests/helpers/env-config.ts`](../../tests/helpers/env-config.ts), [`playwright.config.ts`](../../playwright.config.ts) |
| UX | [`tests/UX-STANDARD.md`](../../tests/UX-STANDARD.md) |
| Harga | [`qa-docs/businessdevelopment-pricelist-product/requirement.md`](../../qa-docs/businessdevelopment-pricelist-product/requirement.md) |
| Runbook | [`tests/AGENT-RUNBOOK.md`](../../tests/AGENT-RUNBOOK.md) |

Konflik. Keputusan di kolom "Pakai" berlaku sampai file sumber yang lebih baru mengatakan lain. Baca file itu lagi saat menjalankan, jangan menyalin tabel ini membabi buta.

| Topik | Yang lama atau yang bentrok | Pakai saat manual ini ditulis |
|-------|-----------------------------|-------------------------------|
| Request ID | SOP card Bugsy 2026-11-09 mengizinkan `REQ-…`. Rule 12, reference card-testing, dan `tc_lib.py` menolak `REQ-…` | Rule 12 yang hidup: `rec…` atau `none`. Baca ulang rule sebelum create |
| Non-TC lulus langsung Done | Skill card-testing §4 menggeser non-TC yang lulus ke Done | Komentar saja. Status hanya bila permintaan yang sama meminta. Keputusan untuk manual handoff ini |
| Done padahal cakupan belum lengkap | Mudah tertulis seolah Passed | Geser hanya bila user meminta pada non-TC, dan bukti tetap menyebut yang belum. TC tidak boleh Passed |
| Manual margin ditimpa Update to Pricelist | Catatan lama | Keputusan 2 November 2026 dan requirement pricelist yang dibaca 2026-11-09: Yes bertahan, No dihitung ulang |
| Edit Final / manual margin butuh store atau platform | Syarat yang lebih sempit dari keputusan user | Tidak butuh store terikat dan tidak butuh tipe platform, termasuk Others. Platform hanya untuk Sync yang diizinkan pada produk terikat bila category punya store platform |
| Export menurut role | Uji yang menuntut kolom sesuai role | Export mengikuti kolom yang terlihat di layar menu itu. Stock Addition tanpa Unit Price. Approval dan detailnya dengan Unit Price |
| Repo aplikasi | Runbook mengizinkan baca sibling saat BUILD atau debug | Peran Bugsy tidak mengubah kode aplikasi. Baca sempit hanya untuk triase |
| Edit dokumen | Rule 03 mengunci `qa-docs/` | Permintaan 2026-11-09 hanya mengizinkan manual handoff ini di `docs/qa/`. Bukan izin mengedit requirement atau `TC-*.md` |
| Sandi di skill dan helper | Skill §6 dan fallback `company-access.ts` memuat akun bersama beserta sandi | Set `OLSHOP_TEST_EMAIL` dan `OLSHOP_TEST_PASSWORD` ke akun khusus. Jangan memakai fallback diam-diam. Jangan menyalin sandi ke manual, chat, atau Jira. Jangan menghapus sandi yang sudah ada di `tests/TEST-ACCOUNTS.md` |
| Token Telegram | Reference card-testing menyebut `TELEGRAM_BOT_TOKEN`. SOP Bugsy membedakan `@OERPAssistBot` / `TELEGRAM_OERP_ASSIST_BOT_TOKEN` | Kirim hanya dengan bot yang sesi ini memang diizinkan. Cek nama env sebelum kirim |
| Tautan TC ke Error | Skill §3 dan rule 22 menulis Relates ke TC | QA Test Case: Error inward, TC outward. Relates untuk origin |
| Kode data Moira | SOP card: `TDB-xxxx`. Skill authoring: `TD-xxxx` | Kode yang tertulis di komentar Jira |
| Id transisi Story/Task/CR | Tabel SOP mengasumsikan sama dengan Error/Improvement | Pakai tabel. Bila gagal, GET sekali dan pilih menurut nama status tujuan |
| Id opsi Test Result | Tertulis di rule 12 | Utamakan `{"value":"Passed"}` atau `Failed`. Jangan mengarang id. Jangan Blocked |
| Branch deploy | Konteks user 30 Oktober 2026 | Cek stamp dan branch yang hidup hari itu. Jangan mengunci `staging` / `dev` / `external-api` selamanya |
| Retries Playwright | Config: 1 lokal, 2 di CI | Uji yang mengubah data: `--retries=0`. Jangan mengulang sampel dingin |
| Company default | `env-config.ts` defaultCompany staging = FAT 112. Global-setup dan `prepareSession` default `lumicharmsid` | Switch eksplisit. Urutan bila user tidak menyebut: 153, 112, 13 |
| Log | Skill §9 masih menyebut `agent-log-fetch.mjs` | Rule 21: HTTP webhook, jangan runner `.mjs` |
| Push dokumen | SOP Bugsy lama meminta push lewat checkout Mac ke `main` | File ini masuk lewat branch dan pull request, karena permintaan 2026-11-09 memakai jalur itu. Jangan push langsung ke `main` dari catatan lama itu |
| Prefix | `QA-AUTO` dan `QA-AUTO-…` sama-sama muncul | Keluarga prefix `QA-AUTO`. Catat kode persis yang dibuat |

Selesai satu run, agent melaporkan path bukti di Jira dan, bila Telegram dikirim, message id. Tidak ada angka cakupan yang tidak ada di matriks §4.2.
