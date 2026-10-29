# Prompt Pembuka untuk AI Agent QA (Antigravity / Cursor / Claude Code)

Repo ini punya aturan dan perkakas yang **wajib diikuti** — kalau agent tidak diberi tahu,
hasil kerjanya akan tertolak lint atau diam-diam tidak ikut suite.

**Cara pakai:** salin blok di bawah, tempel sebagai pesan pertama tiap memulai sesi kerja
di repo `olshoperp-docs`. Setelah itu lanjutkan dengan tugas yang sebenarnya.

---

## Prompt pembuka (salin mulai dari sini)

```
Kamu bekerja di repo olshoperp-docs (QA automation OlshopERP, Playwright + qa-docs).

LANGKAH PERTAMA — baca file ini sekarang sebelum melakukan apa pun:
  tests/AGENT-RUNBOOK.md
Itu decision tree + aturan mutlak + peta dokumen. Jangan memuat semua file di
.cursor/rules/ (±12k kata); runbook akan menyuruhmu membuka dokumen tertentu HANYA
saat memang dibutuhkan.

ATURAN YANG PALING SERING DILANGGAR — patuhi sejak awal:
0. Pagar semua channel: `hazel/universal-agent-guardrails.md`. Overlay IDE:
   `.cursor/rules/26-agent-mandatory-charter.mdc` (hemat token; requirement hanya
   Yemimatifani; OOT tolak singkat; screening QA Review → hazel/qa-review-ac-code-screening.md).
   Bot Merdian: runtime **hanya** `hazel/universal-agent-guardrails.md` +
   `hazel/merdian-telegram-prompt-snippet.md` — **jangan** inject `.cursor/rules/**`
   (termasuk rule 20) / `AGENTS.md` (penyebab lemot). Rule 20 = IDE/red-team saja.
1. Eksekusi test = Playwright CLI (`npx playwright test`). Browser MCP hanya untuk
   EKSPLORASI/diagnosa. Hasil MCP TIDAK boleh dipakai menandai TC `passed` atau
   `automated: true`, dan flow cross-menu DILARANG dijalankan lewat MCP.
2. Spec resmi WAJIB bertag `@TC-*` / `@FLOW-*` / `@ETM-*`. Tanpa tag, spec tidak akan
   pernah jalan di `npm test`. Script sekali pakai justru jangan diberi tag.
3. TC hanya di Jira sejak 26-10-2026 (skill `olshoperp-testcase-authoring`); jangan buat/ubah
   file `TC-*.md` — itu arsip read-only (rule 13 = format arsip).
4. `test_type` WAJIB salah satu: happy | negative | edge | permission | regression |
   cross-menu. Menu transaksional tidak dianggap tercakup kalau isinya happy semua.
5. JANGAN menyalin langkah TC antar spec. Langkah hidup di `tests/scenarios/`
   (1 fungsi = 1 TC origin); spec dan flow memanggil scenario yang sama.
6. Repo `olshoperp` (backend) & `olshoperp-frontend` READ-ONLY — boleh dibaca, dilarang
   diubah. Perbaikan di sana dilaporkan sebagai temuan, bukan dikerjakan.
7. Kalau `requirement.md` menu masih `draft` atau tidak ada: JANGAN mengarang expected
   result. Lempar balik ke yang meminta.
8. Hasil TC dicatat di card TC Jira (Actual Result + Test Result). Non-TC (Error /
   Improvement / CR / Story / Task): hasil di **komentar** Jira (field Actual tidak tampil).
   Tidak ada sync ke file TC (`#sync-jira-done` nonaktif, rule 18).
9. Cek DB via webhook = supporting saja — BUKAN bukti TC Passed. Baca dulu skill
   `.cursor/skills/olshoperp-db-verify/SKILL.md` (bukan load rule 19 penuh). Detail panjang:
   `tests/DATA-VERIFICATION.md`.
10. Testing card ETM-xxxxx: baca dulu skill `.cursor/skills/olshoperp-card-testing/SKILL.md`
    (buku lengkap: UI, data, DB, Jira, Telegram). JANGAN `tests/scripts/`. TC baru = Jira saja
    (bukan file markdown TC), sejak 26 Okt 2026.
11. Q&A menu/aturan (bukan testing): skill `.cursor/skills/olshoperp-qa-menu-ask/SKILL.md`
    — alias → satu layer doc → jawaban ringkas. Jangan load rule 04/06/08/09 penuh.

PERINTAH GATE — jalankan sesuai konteks, jangan dilewati.
(LEGACY: skrip `tc:*` + `dashboard` di bawah membaca file TC arsip — hasilnya bukan status TC terkini,
 yang ada di Jira. Jangan dipakai sebagai gate TC baru.)
  npm run docs:drift                   # sinkron dua arah dgn developer (WAJIB sebelum & sesudah)
  npm run tc:selftest                  # gate-nya sendiri masih bekerja? (wajib 22/22 hijau)
  npm run tc:lint                      # sebelum & sesudah menambah/mengubah TC (wajib 0 error)
  npm run tc:coverage                  # lihat gap coverage sebelum menulis TC baru
npm run tc:pending                   # TC mana belum ada hasil (JANGAN hitung sendiri via grep)
  npm run tc:jira-drift                # (legacy) drift: card Jira vs arsip last_execution
  npm run tc:jira-sync -- --apply …    # apply payload Jira (lihat rule 18)
  npm run guard:scan -- --menu {slug}  # kandidat negative TC dari guard backend
  npm run flow:preflight -- {flow-id}  # WAJIB sebelum menjalankan flow E2E
  npm run component:sync               # sebelum BUILD automation menu baru / saat FAIL karena UI
  npm run tc:refs                      # sebelum #renumber-tc (peta rujukan yang harus ikut diupdate)

Kalau sebuah gate menolak (mis. preflight ❌ karena requirement masih draft):
LAPORKAN gap-nya ke saya dan berhenti. Jangan diakali, jangan dilewati.

Sebelum menulis interaksi UI baru, baca tests/ui-components.md — berisi jebakan
komponen (multiselect, dialog headlessui, input numeric-mask, radio detach) yang sudah
ditangani helper. Jangan menulis interaksi komponen dari nol.

Konfirmasi dulu bahwa kamu sudah membaca tests/AGENT-RUNBOOK.md, lalu tunggu tugas saya.
```

---

## Tambahan per jenis tugas (opsional, tempel setelah prompt di atas)

**Membuat TC dari card Jira:**

```
Tugas: buat/perbarui test case untuk card {ETM-xxxxx}.
Ikuti pohon keputusan rule 13 §5B (TC baru / reuse / update TC existing).
Deskripsi card WAJIB divalidasi silang ke qa-docs/{menu}/requirement.md — deskripsi card
sering dibuat dengan bantuan AI dan belum tentu sesuai requirement asli. Kalau berbeda,
tulis expected versi requirement lalu laporkan selisihnya ke saya.
```

**Menambah negative test coverage sebuah menu:**

```
Tugas: tambah negative/edge test case untuk menu {slug}.
Mulai dari `npm run tc:coverage -- --menu {slug}` lalu
`npm run guard:scan -- --menu {slug}` (ambil kandidat bertanda ★).
PENTING: guard backend BUKAN keberhasilan final — verifikasi dulu apakah kondisinya
benar-benar bisa dipicu dari UI dan bagaimana UI menolaknya (bisa berupa pesan error,
clamp nilai, field disabled, atau tombol hilang). Tulis expected sesuai perilaku
sebenarnya, mengacu requirement.
```

**Menjalankan E2E flow:**

```
Tugas: jalankan flow {flow-id}.
Urutan: `npm run flow:preflight -- {flow-id}` dulu — kalau ❌ laporkan gap dan berhenti.
Kalau ✅, jalankan spec-nya, lalu laporkan hasilnya dari
playwright-report/flow-summary.md (dokumen yang tercipta per phase + status).
Data selalu fresh tiap run; jangan bergantung dokumen run sebelumnya.
```

**Renumber / sync hasil ke file TC — NONAKTIF**

`#renumber-tc` dan `#sync-jira-done` **nonaktif**. Hasil TC hanya di Jira (Actual Result +
Test Result di card TC). File `TC-*.md` = arsip read-only. Skrip `tc:jira-sync` /
`tc:refs` = legacy baca arsip — jangan dipakai untuk TC baru.

**Cek / query data di DB (staging / tyas / merdian):**

```
Tugas: cek data di DB {staging|tyas|merdian} untuk {pertanyaan singkat}.
Baca tests/DATA-VERIFICATION.md + rule 19-database-data-verification.mdc dulu.
WAJIB direct HTTP POST: tyas/staging → n8n…/agent-db-tyas; merdian → n9n…/agent-db-merdian.
DILARANG agent-db-query.mjs / .php.
Read-only + filter owned_by. Hasil DB = supporting evidence saja — JANGAN tandai TC passed.
Jangan paparkan API key di chat.
```

**Testing card Jira tertentu:**

```
Tugas: testing / re-test card ETM-xxxxx.
WAJIB baca dulu: .cursor/skills/olshoperp-card-testing/SKILL.md (buku lengkap).
Jangan load banyak .cursor/rules/ — aturan testing sudah di skill.
DILARANG tests/scripts/. Probe → tests/scratch/ atau check-* tanpa tag; regresi → @ETM-xxxxx.
Data tidak ada → bilang ke saya; jangan ganti data diam-diam.
```

---

## Kenapa prompt ini perlu

Perkakas di repo ini menegakkan aturan secara otomatis (lint, preflight, filter tag),
jadi pelanggaran akan ketahuan. Tapi ketahuan **setelah** kerja selesai itu mahal —
contoh nyata: 68 TC pernah harus diselaraskan ulang karena dikerjakan sebelum aturan
`test_type` dan format frontmatter diberlakukan. Prompt ini memindahkan aturan ke depan,
sebelum agent mulai menulis.
