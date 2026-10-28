# Agent Runbook — Eksekusi Test OlshopERP

Halaman rujukan cepat untuk **agent yang menjalankan test** (Antigravity, Cursor, Claude Code).
Isinya **routing + aturan mutlak**, bukan salinan rules — detail tetap di sumbernya supaya
tidak ada dua sumber kebenaran.

> Hemat konteks: baca halaman ini dulu. Buka rule/dokumen lain **hanya** saat baris
> "Baca" di bawah menyuruhnya.

---

## Decision tree — kamu diminta apa?

### A. "Jalankan TC X" (satu menu, spec sudah ada)

```bash
npm run test:tc -- "@TC-PR-RAINCOAT"        # by tag
npx playwright test tests/specs/{menu}/{file}.spec.ts --retries=0
```

Spec ada + `automated: true` → **mode RUN docs-only**: jangan buka repo `olshoperp` /
`olshoperp-frontend`. Cukup `qa-docs` + `tests/`. → Baca: rule `15` § Dua mode.

### B. "Jalankan flow E2E antar menu" (PR→PO→PI, dll.)

```bash
npm run flow:preflight -- scm-inbound       # WAJIB dulu — kalau ❌ JANGAN lanjut
npx playwright test tests/specs/flows/scm-inbound.spec.ts
```

Preflight ❌ = chain belum lengkap (TC origin/scenario hilang, requirement menu masih
draft). **Laporkan gap-nya ke user, jangan eksekusi, jangan "akali".**
Daftar flow + override test data → Baca: `tests/flows/README.md`.

### C. "Buat TC baru"

**TC hanya di Jira sejak 22 Okt 2026.** Jangan buat file `TC-*.md` / `TC-*-DRAFT-*.md`, jangan
`#renumber-tc`, jangan isi `test-queue.yaml`. File TC lama = **arsip read-only**.

Buat / perbarui card Test Case di Jira → **baca dulu**
`.cursor/skills/olshoperp-testcase-authoring/SKILL.md` (+ `reference.md`): gap vs AC,
minimal set per `test_type`, Expected hanya dari requirement / `feature-map.md`
(status review/approved), data uji bertanda `QA ETM-…`, terbitkan + Relates ke origin.
Requirement `draft`/tidak ada → **lempar balik ke prompter**, jangan mengarang Expected.

### D. "Automate TC yang belum ada spec-nya" (mode BUILD)

```bash
npm run component:sync    # cek dulu: katalog komponen masih sinkron dgn frontend?
```

Urutan lookup **sebelum** buka repo app (hemat token, hindari salah selector):

1. `tests/ui-components.md` — perilaku komponen + pola interaksi benar
2. `tests/helpers/shared/` lalu `tests/helpers/{menu}.ts`
3. `tests/pom-registry/{menu}.yaml`
4. Spec existing berpola serupa
5. **Baru** buka `olshoperp-frontend` untuk elemen yang belum tercover

→ Baca: rule `14` §8A, rule `15` § BUILD.

### E. "Verifikasi UI / telusuri menu baru / reproduksi bug"

Boleh pakai **Browser MCP**. Tapi hasilnya **bukan** status test — lihat aturan #2 di bawah.

Kalau perlu menulis **script sekali pakai** (dump DOM, cek API, reproduksi bug):
- **Hanya** di `tests/scratch/` (gitignored) atau hapus setelah dipakai
- Prefix diagnostic: `check-`/`inspect-`/`probe-`/`debug-`/`diag-`/`find-`/`get-`/`read-`/`log-`/`verify-`
- **Jangan** beri tag `@TC-`/`@FLOW-`/`@ETM-` — jangan ikut `npm test`
- **DILARANG** membuat / menambah file di `tests/scripts/` (folder terkunci + gitignored)

> **Konsekuensinya:** spec resmi **wajib** bertag (`@TC-*`, `@FLOW-*`, atau `@ETM-*`
> untuk regression per card) di `tests/specs/`. Spec tanpa tag = scratch.
>
> Data seed (menyiapkan data, bukan menguji) diberi nama berprefix `seed-` dan memang
> tidak bertag — dijalankan manual saat dibutuhkan.

### I. "Tolong testing card ETM-xxxxx"

**Baca dulu (wajib):** `.cursor/skills/olshoperp-card-testing/SKILL.md`  
Itu buku lengkap (UI valid, data uji, DB, credential, Jira, Telegram, log).  
Jangan load banyak rules — skill sudah ringkas.

Ringkas:
- TC dokumentasi = **Jira saja** (sejak 22 Okt 2026); jangan buat `TC-*.md` baru untuk ini
- Dilarang `tests/scripts/` → probe di `tests/scratch/` / `check-*` tanpa tag; regresi → `@ETM-xxxxx`
- Data tidak ada → STOP + tanya prompter; jangan fallback diam-diam
- Hasil resmi di Jira (Actual → Test Result) + Telegram; DB hanya supporting

Detail ID/template: skill `reference.md`.

### G. "Card Jira sudah Done tapi file TC belum ke-update"

**Tidak ada lagi.** Sejak 22 Okt 2026 hasil TC (Test Result + Actual Result) hanya di Jira —
tidak disalin ke file TC. Trigger `#sync-jira-done` / `#syncjiradone` **nonaktif**
(rule `18-sync-jira-done.mdc` tinggal catatan). Jangan jalankan `npm run tc:jira-sync -- --apply`
dan jangan tulis `last_execution` / `first_execution` ke file TC.

---

### F. "TC mana yang belum ada hasil / mau kejar ke tim"

Hasil TC resmi = **Jira** (status + Test Result). `tc:pending` hanya memindai **arsip** file TC
(snapshot sebelum 22 Okt 2026) — jangan jadikan sumber status terkini.

```bash
npm run tc:pending            # arsip file TC; JANGAN hitung sendiri via grep/skrip
```

**Jangan parsing frontmatter sendiri** — hasilnya beda dari tool, dan status **dokumen**
(`draft`/`review`) ≠ **hasil eksekusi** (`last_execution`). `tc:pending` sudah benar.
Detail cara membaca hasil + menindaklanjuti → § "Kalau TC-nya dijalankan manual" di bawah.

### H. "Cek data di DB" (staging / tyas / merdian)

Precondition, forensik FAIL, atau audit trail — **bukan** pengganti assert UI.

```bash
# Direct POST ke webhook n8n; kredensial dari .env (jangan hardcode key / jangan pakai .mjs)
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-db-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $DB_DEBUG_API_KEY" \
  -d '{"db":"staging_olshoperp","query":"SELECT id, sku FROM scm_products WHERE owned_by = 153 LIMIT 5"}'
# Tyas: ganti "db":"tyas_olshoperp" (URL sama)
# Merdian: URL https://n9n.olshoperp.com/webhook/agent-db-merdian + "db":"merdian_olshoperp"
```

- **Tyas + Staging** → webhook **shared** (`n8n…/agent-db-tyas`) · **Merdian** → **`n9n…/agent-db-merdian`** (host terpisah)
- Hasil DB = **supporting evidence** saja — **dilarang** jadi `last_execution: passed`
  untuk TC UI-crawling
- **Dilarang** `agent-db-query.mjs` / `.php`

→ Baca: `tests/DATA-VERIFICATION.md` · rule docs `19-database-data-verification.mdc` ·
SoT teknis `olshoperp/.cursor/rules/19-database-debugger.mdc`

---

## Kalau TC-nya dijalankan manual (bukan Playwright)

Sebagian besar TC dijalankan orang, bukan mesin. Sejak 22 Okt 2026 hasilnya dicatat **hanya di Jira**
(card Test Case: Actual Result → Test Result → Done), **bukan** di file `TC-*.md` / YAML `last_execution`.

- Mau tahu hasilnya → buka card Jira TC-nya (Done + Test Result Passed/Failed).
- Tidak ada jejak card / tidak jelas siapa yang menguji → **tanyakan ke prompter/penguji**. Jangan menebak.
- Penguji manual mengisi Actual Result + Test Result di Jira sendiri; agent tidak menulis hasil ke file TC.

**Yang tidak boleh:** mengisi Test Result Passed tanpa Actual Result yang rinci, atau
menganggap card origin yang sudah *Done* sebagai bukti TC lulus.

---

## Gate — apa yang dijaga mesin, apa yang tidak

Sebelum menyerahkan pekerjaan, **wajib hijau**:

```bash
npm run docs:drift     # sinkron dua arah dgn repo developer? (requirement ditarik, TC didorong)
npm run tc:selftest    # apakah gate-nya sendiri masih bekerja?
npm run tc:lint        # apakah dokumenmu lolos gate?
```

`docs:drift` merah → `npm run docs:sync` dulu, **sebelum** menulis TC apa pun, dan
lagi **sesudah** selesai membuat TC — mirror TC ke repo developer wajib, karena Help Center
Documentation dibangun dari sana. TC yang tak termirror tidak muncul bersama requirement-nya.
Dokumen sistem (requirement/technical/knowledge-base/user-guide/capabilities) **dimiliki
repo developer**; yang ada di sini cuma salinan. Mengeditnya di sini percuma dan berbahaya —
suntinganmu hilang saat sync, atau malah ikut menimpa aslinya. Perlu ubah requirement?
Laporkan sebagai temuan (rule `12`), jangan kerjakan sendiri.

`tc:selftest` menjalankan `tc-lint` di atas repo tiruan berisi pelanggaran buatan dan
memastikan tiap pelanggaran benar-benar ditangkap. Gunanya: **aturan yang tidak punya
case di `tests/tools/tc-selftest.mjs` tidak dijaga siapa pun** — anggap imbauan, dan
jangan berasumsi agent lain mematuhinya. Menambah aturan baru = menambah case di sana,
kalau tidak aturan itu lahir sudah mati.

Yang **tidak** bisa dijaga mesin (di sinilah review manusia masih perlu):
`expected_result` benar-benar berasal dari `requirement.md`, `test_type` cocok dengan
isi TC, dan langkah TC benar-benar menguji yang dimaksud.

---

## 7 aturan mutlak (paling sering dilanggar)

| # | Aturan | Kenapa |
|---|---|---|
| 1 | **Eksekusi test = Playwright CLI.** MCP hanya eksplorasi/diagnosa | MCP mem-bypass preflight, storageState, reporter, history → hasil tidak reproducible |
| 2 | **Tiap hasil wajib menyebut asalnya.** `passed`/`failed` harus punya `via:` — path spec (run CLI) **atau** `manual:{Nama}` + `notes` berisi actual result. `via` bermuatan "MCP" ditolak | Run manual itu sah dan wajib tercatat; yang dilarang adalah hasil tanpa penanggung jawab. Verifikasi lewat MCP bukan hasil test — catat sebagai observasi |
| 2b | **Status card Jira tidak pernah menulis hasil TC.** Card *Done* = pekerjaan selesai; TC `passed` = pengujian terbukti. Card Done + TC `not_run` → laporkan, jangan tambal | Rule `12` |
| 3 | **TC hasil crawling wajib format rule 13** (`tc_code`, `menu`, `steps`, `expected_result`) | Skema lain (`id:`, `menu_slug:`) invisible bagi `tc:lint`, tak bisa di-recall flow, jadi duplikat tak terdeteksi |
| 4 | **Jangan duplikasi langkah TC.** Langkah hidup di `tests/scenarios/` (1 fungsi = 1 TC origin); flow me-*recall*, tidak menyalin | Kalau UX berubah, cukup update 1 tempat — bukan berburu salinan |
| 4b | **Dokumen sistem milik repo developer.** requirement/technical/knowledge-base/user-guide/capabilities di sini = salinan. Jangan diedit; `docs:drift` sebelum kerja | Salinan tertinggal pernah bikin 15 TC Purchase Inbound divalidasi ke requirement v2.3 padahal developer sudah v2.4 |
| 5 | **Selector dari source Vue, bukan DOM scraping**, dan mendarat di `pom-registry`/`helpers` — bukan hardcoded di spec | Fondasi stabilitas; selector scraping pecah tiap re-render |
| 6 | **Temuan UX baru wajib dipropagasi** ke helper + `ui-components.md` + TC origin | Kalau tidak, spec lain diam-diam jadi stale |
| 6b | **Sync mirror ke `olshoperp`: salin FILE, jangan `cp -r` folder.** Sesudahnya wajib `git -C ../olshoperp status --short docs/qa-docs/` | `cp -r` bisa menimpa versi backend yang lebih baru; tanpa verifikasi kamu tidak tahu apa yang tersentuh (rule `15`) |
| 7 | **Web UI crawling untuk act & assert.** API testing hanya jika user eksplisit minta | Rule `13`/`14` §8 |
| 8 | **Satu TC dipakai di banyak tempat.** Card baru → **cek dulu TC existing di Jira** (Relates / label `ETM-origin`): belum ada TC = bikin baru · expected sama = reuse · expected berubah = **update card TC existing** (jangan bikin kembarannya) | Skill `olshoperp-testcase-authoring` |
| 9 | **Cek DB (webhook) ≠ TC passed.** L3 DB hanya supporting; Tyas/Staging shared webhook, Merdian terpisah; read-only + `company_id` | `tests/DATA-VERIFICATION.md` · rule docs `19` |
| 10 | **Testing card → skill `olshoperp-card-testing` dulu.** Jangan `tests/scripts/`; data/DB/Jira/Telegram ikut skill | Decision tree **I** |
| 11 | **TC baru = Jira saja (22 Okt 2026).** Jangan markdown `TC-*.md` + renumber untuk dokumentasi card baru | Skill card-testing § header |

---

## Data uji: simpan, jangan hapus (berlaku 15-10-2026)

Keputusan Rachy 15-10-2026. Data uji hasil crawl/eksekusi TC di staging **tidak dihapus** setelah run.

1. Kode tetap prefix `QA-AUTO-` (mis. `QA-AUTO-VPDEC-266983`).
2. **Name** atau **Description** wajib menyebut jejaknya, berisi key TC/card dan tanggal run. Contoh Description: `QA-AUTO ETM-16502 langkah 3, 15-10-2026`. Kalau form tidak punya Description, pakai Name.
3. Draft yang otomatis terbentuk saat buka halaman create PO/SO juga dibiarkan, dengan jejak yang sama bila bisa diedit.
4. Pengecualian: hapus data hanya kalau langkah TC itu sendiri menguji hapus (delete / show deleted).
5. Laporan run dan Actual Result Jira menyebut kode data yang dibuat, supaya bisa dipakai ulang atau dicari.

Catatan transisi: run ETM-16502 (15-10-2026 13:20 WIB) masih menghapus `QA-AUTO-VPDEC-266983` dan `QA-AUTO-VPDECW-266983` sebelum aturan ini berlaku.

## Kalau test FAIL

1. Baca error + `error-context.md` di `test-results/{...}/` (ada page snapshot — sering langsung ketahuan).
2. Cek apakah penyebabnya **komponen UI** → `tests/ui-components.md` (multiselect, dialog headlessui, numeric-mask, radio detach — semua jebakan umum ada di sana).
   Jalankan `npm run component:sync` — kalau ada drift, berarti frontend berubah dan katalog/helper perlu disesuaikan.
3. Kalau ternyata **UX aplikasi berubah**: perbaiki helper/scenario + update TC origin + catat di `ui-components.md`. Jangan tambal di spec.
4. Retry maksimal sesuai rule `14` §5 — kalau tetap merah, laporkan dengan bukti, jangan paksa hijau.

---

## Peta dokumen (buka sesuai kebutuhan)

| Butuh | Baca |
|---|---|
| Perilaku komponen UI & pola interaksi | `tests/ui-components.md` |
| Daftar flow, fixture override, summary/history | `tests/flows/README.md` |
| Selector per field per menu | `tests/pom-registry/{menu}.yaml` |
| Membuat / memperbarui TC (Jira saja) | `.cursor/skills/olshoperp-testcase-authoring/SKILL.md` (rule `13` = arsip file TC) |
| SOP eksekusi lengkap, tooling MCP/CLI (§6B) | rule `14-playwright-e2e.mdc` |
| BUILD vs RUN, repo mana yang boleh dibuka | rule `15-playwright-multi-repo.mdc` |
| Aturan flow cross-menu (recall, gate, fresh data) | rule `17-e2e-cross-menu-flow.mdc` |
| Sync Jira Done → file TC | **nonaktif** sejak 22-10-2026 (rule `18-sync-jira-done.mdc`) |
| Cek data DB (L1/L2/L3, env Tyas/Staging/Merdian) | Skill card-testing §8 · `tests/DATA-VERIFICATION.md` (SoT panjang) |
| Testing card ETM (buku lengkap) | `.cursor/skills/olshoperp-card-testing/SKILL.md` |
| Akun uji khusus role/izin (mis. user tanpa izin Void/Approve — staging & tyas saja) | `tests/TEST-ACCOUNTS.md` |
| Apa yang boleh ditulis di `qa-docs/` | rule `03-qa-docs-immutable.mdc` |

## Perintah lengkap

```bash
npm run tc:lint                              # anti-duplikat TC (wajib sebelum tambah TC)
npm run tc:coverage                          # matrix cakupan menu x test_type + prioritas gap
npm run tc:refs                              # peta rujukan kode TC (arsip; #renumber-tc nonaktif sejak 22-10-2026)
npm run guard:scan                           # guard backend -> kandidat negative TC per menu
npm run flow:preflight -- {flow-id}          # gate kelengkapan chain (wajib sebelum flow)
npm run test:tc -- "@TC-XXX"                 # jalankan TC by tag
npm run test:smoke                           # smoke 4 menu
npm run test:report                          # buka HTML report
npm run component:sync                       # cek drift katalog komponen vs source frontend
npm run tc:pending                              # TC belum punya hasil eksekusi
npm run tc:jira-drift                           # drift Jira vs repo (kandidat sync)
npm run tc:jira-sync -- --apply payload.json    # tulis last/first_execution dari Jira
OLSHOP_RUN_JIRA=ETM-15647 npm run test:tc -- "@TC-XXX"   # run CLI (tier bukti tertinggi)
```

## Repo app = READ-ONLY

`olshoperp` (backend) & `olshoperp-frontend` boleh **dibaca** — selector dari source Vue,
validasi/error backend untuk menyusun expected result. **Dilarang menulis apa pun** ke
sana; perbaikan yang perlu di repo app dilaporkan sebagai temuan, bukan dikerjakan.
→ Baca: rule `15` § Kontrak read-only repo app.
