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
npm run tc:lint                              # sebelum & sesudah
```

1. **Cek TC existing dulu** — kalau sudah ada yang mengcover, reuse/retest, jangan bikin file baru.
2. Format & penamaan `TC-{PREFIX}-DRAFT-{timestamp}.md` → Baca: rule `13`.
3. Expected result **wajib** dari `requirement.md`, bukan karangan.
4. Lint harus bersih (0 error) sebelum selesai.

### D. "Automate TC yang belum ada spec-nya" (mode BUILD)

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
**jangan beri tag `@TC-`/`@FLOW-`** — `npm test` hanya menjalankan spec bertag, jadi
script tanpa tag otomatis tidak ikut run. Beri juga prefix `check-`/`inspect-`/`probe-`/
`debug-`/`diag-`/`find-`/`get-`/`read-`/`log-`/`verify-` sebagai lapis kedua
(`testIgnore` di `playwright.config.ts`). Jalankan manual dengan menyebut path-nya.

> **Konsekuensinya:** spec resmi **wajib** bertag. Spec tanpa tag = scratch, tidak
> akan pernah jalan di suite — termasuk kalau kamu lupa memberi tag pada spec sungguhan.

---

## 7 aturan mutlak (paling sering dilanggar)

| # | Aturan | Kenapa |
|---|---|---|
| 1 | **Eksekusi test = Playwright CLI.** MCP hanya eksplorasi/diagnosa | MCP mem-bypass preflight, storageState, reporter, history → hasil tidak reproducible |
| 2 | **Status `passed`/`automated: true` hanya sah dari CLI run** | Verifikasi via MCP dicatat sebagai observasi (`status: draft` + catatan) |
| 3 | **TC hasil crawling wajib format rule 13** (`tc_code`, `menu`, `steps`, `expected_result`) | Skema lain (`id:`, `menu_slug:`) invisible bagi `tc:lint`, tak bisa di-recall flow, jadi duplikat tak terdeteksi |
| 4 | **Jangan duplikasi langkah TC.** Langkah hidup di `tests/scenarios/` (1 fungsi = 1 TC origin); flow me-*recall*, tidak menyalin | Kalau UX berubah, cukup update 1 tempat — bukan berburu salinan |
| 5 | **Selector dari source Vue, bukan DOM scraping**, dan mendarat di `pom-registry`/`helpers` — bukan hardcoded di spec | Fondasi stabilitas; selector scraping pecah tiap re-render |
| 6 | **Temuan UX baru wajib dipropagasi** ke helper + `ui-components.md` + TC origin | Kalau tidak, spec lain diam-diam jadi stale |
| 7 | **Web UI crawling untuk act & assert.** API testing hanya jika user eksplisit minta | Rule `13`/`14` §8 |

---

## Kalau test FAIL

1. Baca error + `error-context.md` di `test-results/{...}/` (ada page snapshot — sering langsung ketahuan).
2. Cek apakah penyebabnya **komponen UI** → `tests/ui-components.md` (multiselect, dialog headlessui, numeric-mask, radio detach — semua jebakan umum ada di sana).
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
npm run flow:preflight -- {flow-id}          # gate kelengkapan chain (wajib sebelum flow)
npm run test:tc -- "@TC-XXX"                 # jalankan TC by tag
npm run test:smoke                           # smoke 4 menu
npm run test:report                          # buka HTML report
```
