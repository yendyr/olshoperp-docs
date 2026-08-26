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
Itu decision tree + 8 aturan mutlak + peta dokumen. Jangan memuat semua file di
.cursor/rules/ (±12k kata); runbook akan menyuruhmu membuka dokumen tertentu HANYA
saat memang dibutuhkan.

ATURAN YANG PALING SERING DILANGGAR — patuhi sejak awal:
1. Eksekusi test = Playwright CLI (`npx playwright test`). Browser MCP hanya untuk
   EKSPLORASI/diagnosa. Hasil MCP TIDAK boleh dipakai menandai TC `passed` atau
   `automated: true`, dan flow cross-menu DILARANG dijalankan lewat MCP.
2. Spec resmi WAJIB bertag `@TC-*` / `@FLOW-*` / `@ETM-*`. Tanpa tag, spec tidak akan
   pernah jalan di `npm test`. Script sekali pakai justru jangan diberi tag.
3. TC WAJIB format rule 13: frontmatter lengkap (`tc_code`, `menu`, `test_type`,
   `steps`, `expected_result`). TC tanpa frontmatter invisible bagi tooling, tidak bisa
   di-recall flow, dan `last_execution`-nya tidak terisi.
4. `test_type` WAJIB salah satu: happy | negative | edge | permission | regression |
   cross-menu. Menu transaksional tidak dianggap tercakup kalau isinya happy semua.
5. JANGAN menyalin langkah TC antar spec. Langkah hidup di `tests/scenarios/`
   (1 fungsi = 1 TC origin); spec dan flow memanggil scenario yang sama.
6. Repo `olshoperp` (backend) & `olshoperp-frontend` READ-ONLY — boleh dibaca, dilarang
   diubah. Perbaikan di sana dilaporkan sebagai temuan, bukan dikerjakan.
7. Kalau `requirement.md` menu masih `draft` atau tidak ada: JANGAN mengarang expected
   result. Lempar balik ke yang meminta.
8. Satu TC dipakai di banyak tempat. Card Jira = asal-usul (`origin_jira`), bukan
   kepemilikan. Card baru → cek dulu: belum ada TC = bikin baru · expected sama = reuse ·
   expected berubah = UPDATE TC existing (jangan bikin kembarannya).

PERINTAH GATE — jalankan sesuai konteks, jangan dilewati:
  npm run docs:drift                   # salinan requirement masih sama dgn repo developer?
  npm run tc:selftest                  # gate-nya sendiri masih bekerja? (wajib 20/20 hijau)
  npm run tc:lint                      # sebelum & sesudah menambah/mengubah TC (wajib 0 error)
  npm run tc:coverage                  # lihat gap coverage sebelum menulis TC baru
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

**Menjalankan renumber:**

```
Tugas: jalankan #renumber-tc.
Wajib berurutan: (1) `npm run tc:lint` harus 0 error, (2) `npm run tc:refs` untuk memetakan
rujukan tiap kode PENDING, (3) renumber + UPDATE SEMUA RUJUKAN dari peta itu
(rule 13 §9 langkah 8), (4) `npm run tc:lint` lagi harus tetap 0 error.
```

---

## Kenapa prompt ini perlu

Perkakas di repo ini menegakkan aturan secara otomatis (lint, preflight, filter tag),
jadi pelanggaran akan ketahuan. Tapi ketahuan **setelah** kerja selesai itu mahal —
contoh nyata: 68 TC pernah harus diselaraskan ulang karena dikerjakan sebelum aturan
`test_type` dan format frontmatter diberlakukan. Prompt ini memindahkan aturan ke depan,
sebelum agent mulai menulis.
