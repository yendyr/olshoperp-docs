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

```bash
npm run tc:coverage                          # gap apa yang perlu diisi di menu ini?
npm run guard:scan -- --menu {slug}          # kandidat negative TC dari guard backend
npm run tc:lint                              # sebelum & sesudah
```

0. **`test_type` wajib** (rule 13 §3A): `happy` / `negative` / `edge` / `permission` /
   `regression` / `cross-menu`. Menu transaksional tidak dianggap tercakup kalau hanya
   punya `happy` — minimal ada `negative` untuk guard utamanya.
1. **Cek TC existing dulu.** Dari card Jira? Ikuti pohon keputusan rule `13` §5B:
   belum ada TC → **bikin baru** (wajar untuk improvement/change requirement) ·
   expected sama → **reuse/retest** · expected berubah → **update TC existing**
   (+ catat di `run_history` sebagai `revised`) · perilaku lama masih berlaku untuk
   kondisi lain → **TC baru**, perjelas kondisi pembedanya di judul keduanya.
   Ragu apakah duplikat? Tandai `duplicate_candidate: {kode TC}` dan lanjut kerja —
   lint menahannya di gerbang `#renumber-tc`, jadi keraguan tidak memblokir hari ini.
2. Format & penamaan `TC-{PREFIX}-DRAFT-{timestamp}.md` → Baca: rule `13`.
   Lokasi: `qa-docs/{menu}/test-cases/` **atau** `qa-docs/{menu}/{CARD}/test-cases/`
   (pengelompokan per card, sama sahnya) — frontmatter rule 13 tetap wajib di keduanya.
3. **Cek status `requirement.md` menu itu dulu** (rule 13 §5A):
   `review`/`approved` → lanjut · `draft`/tidak ada → **lempar balik ke prompter**,
   jangan mengarang expected result. Pengecualian hanya permintaan dari card Jira —
   itu pun deskripsi card **wajib divalidasi silang** ke requirement repo (deskripsi
   card sering hasil AI dan belum tentu sesuai requirement asli).
4. Expected result **wajib** dari `requirement.md`, bukan karangan.
5. Lint harus bersih (0 error) sebelum selesai.

**Sebelum `#renumber-tc`**:
- `npm run tc:lint` wajib 0 error — begitu DRAFT dapat nomor final, duplikat jadi
  "resmi" dan sulit dicabut (rule `13` § Gate wajib sebelum renumber).
- `npm run tc:refs` — peta semua rujukan ke tiap kode PENDING (flow `recalls:`,
  konstanta scenario, tag spec). **Rujukan ini WAJIB ikut diperbarui** saat renumber,
  kalau tidak jadi rujukan putus (rule `13` §9 langkah 8).
- Sesudah renumber: `npm run tc:lint` lagi, harus tetap 0 error.

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
**jangan beri tag `@TC-`/`@FLOW-`/`@ETM-`** — `npm test` hanya menjalankan spec bertag, jadi
script tanpa tag otomatis tidak ikut run. Beri juga prefix `check-`/`inspect-`/`probe-`/
`debug-`/`diag-`/`find-`/`get-`/`read-`/`log-`/`verify-` sebagai penanda bagi manusia.
Jalankan manual dengan menyebut path-nya (`npx playwright test path/ke/file.spec.ts`).
Setelah selesai dipakai: pindahkan ke `tests/scratch/` atau hapus.

> **Konsekuensinya:** spec resmi **wajib** bertag (`@TC-*`, `@FLOW-*`, atau `@ETM-*`
> untuk regression per card). Spec tanpa tag = scratch, tidak akan pernah jalan di
> suite — termasuk kalau kamu lupa memberi tag pada spec sungguhan.
>
> Data seed (menyiapkan data, bukan menguji) diberi nama berprefix `seed-` dan memang
> tidak bertag — dijalankan manual saat dibutuhkan.

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
| 2 | **Status `passed`/`automated: true` hanya sah dari CLI run** — ditegakkan `tc:lint`: `last_execution.status: passed` wajib punya `via:` ke file spec yang ada; `via` bermuatan "MCP" ditolak | Verifikasi via MCP dicatat sebagai observasi (`status: draft` + catatan) |
| 3 | **TC hasil crawling wajib format rule 13** (`tc_code`, `menu`, `steps`, `expected_result`) | Skema lain (`id:`, `menu_slug:`) invisible bagi `tc:lint`, tak bisa di-recall flow, jadi duplikat tak terdeteksi |
| 4 | **Jangan duplikasi langkah TC.** Langkah hidup di `tests/scenarios/` (1 fungsi = 1 TC origin); flow me-*recall*, tidak menyalin | Kalau UX berubah, cukup update 1 tempat — bukan berburu salinan |
| 4b | **Dokumen sistem milik repo developer.** requirement/technical/knowledge-base/user-guide/capabilities di sini = salinan. Jangan diedit; `docs:drift` sebelum kerja | Salinan tertinggal pernah bikin 15 TC Purchase Inbound divalidasi ke requirement v2.3 padahal developer sudah v2.4 |
| 5 | **Selector dari source Vue, bukan DOM scraping**, dan mendarat di `pom-registry`/`helpers` — bukan hardcoded di spec | Fondasi stabilitas; selector scraping pecah tiap re-render |
| 6 | **Temuan UX baru wajib dipropagasi** ke helper + `ui-components.md` + TC origin | Kalau tidak, spec lain diam-diam jadi stale |
| 6b | **Sync mirror ke `olshoperp`: salin FILE, jangan `cp -r` folder.** Sesudahnya wajib `git -C ../olshoperp status --short docs/qa-docs/` | `cp -r` bisa menimpa versi backend yang lebih baru; tanpa verifikasi kamu tidak tahu apa yang tersentuh (rule `15`) |
| 7 | **Web UI crawling untuk act & assert.** API testing hanya jika user eksplisit minta | Rule `13`/`14` §8 |
| 8 | **Satu TC dipakai di banyak tempat.** `origin_jira` = asal-usul (tidak ditimpa); `last_execution` cukup satu, diperbarui otomatis tiap run termasuk saat flow me-recall-nya. Card baru → **cek dulu**: belum ada TC = bikin baru · expected sama = reuse · expected berubah = **update TC existing** (jangan bikin kembarannya) | Rule `13` §5B pohon keputusan |

---

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
| Format & penamaan TC | rule `13-test-case-format.mdc` |
| SOP eksekusi lengkap, tooling MCP/CLI (§6B) | rule `14-playwright-e2e.mdc` |
| BUILD vs RUN, repo mana yang boleh dibuka | rule `15-playwright-multi-repo.mdc` |
| Aturan flow cross-menu (recall, gate, fresh data) | rule `17-e2e-cross-menu-flow.mdc` |
| Apa yang boleh ditulis di `qa-docs/` | rule `03-qa-docs-immutable.mdc` |

## Perintah lengkap

```bash
npm run tc:lint                              # anti-duplikat TC (wajib sebelum tambah TC)
npm run tc:coverage                          # matrix cakupan menu x test_type + prioritas gap
npm run tc:refs                              # peta rujukan TC PENDING (wajib sebelum #renumber-tc)
npm run guard:scan                           # guard backend -> kandidat negative TC per menu
npm run flow:preflight -- {flow-id}          # gate kelengkapan chain (wajib sebelum flow)
npm run test:tc -- "@TC-XXX"                 # jalankan TC by tag
npm run test:smoke                           # smoke 4 menu
npm run test:report                          # buka HTML report
npm run component:sync                       # cek drift katalog komponen vs source frontend
OLSHOP_RUN_JIRA=ETM-15647 npm run test:tc -- "@TC-XXX"   # run untuk card tertentu (tercatat di last_execution.jira)
```

## Repo app = READ-ONLY

`olshoperp` (backend) & `olshoperp-frontend` boleh **dibaca** — selector dari source Vue,
validasi/error backend untuk menyusun expected result. **Dilarang menulis apa pun** ke
sana; perbaikan yang perlu di repo app dilaporkan sebagai temuan, bukan dikerjakan.
→ Baca: rule `15` § Kontrak read-only repo app.
