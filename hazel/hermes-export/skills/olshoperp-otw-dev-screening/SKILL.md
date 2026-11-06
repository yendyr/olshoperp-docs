---
name: olshoperp-otw-dev-screening
description: >-
  Use when an ETM card (Improvement, Change Requirement, Story, Task, or Error)
  is moved into OTW DEV and needs codebase screening against AC/Expected/TO-BE
  plus mandatory performance (Dampak performa), UI consistency, regression, docs
  update (yemimadocs), and Improvement→Test Case create. PASS stays OTW DEV
  (ledger awaitingDeploy). Also: reopen-flow dry-run / cek QA review.
---

# Reopen Flow — OTW DEV screening (notify-only; PASS menunggu server update)

## SoT playbook

Sebelum screen, baca dan ikuti `hazel/qa-review-ac-code-screening.md`.  
Playbook menang jika konflik — **kecuali** section **Dampak performa**, **PASS policy**, hard gate, dan locked policies di skill ini.

Ringkas playbook:
1. Map tiap butir AC → PASS / GAP / NOT VERIFIED dari **diff** commit/PR ber-key (bukan tebakan pesan commit).
2. Laporkan terpisah: happy path | reject/negatif + pesan jelas | asset ikut.
3. **Define ≠ Enforce ≠ Message.**
4. Verdict: PASS | REWORK | NEED MANUAL QA + confidence tinggi|sedang|rendah.
5. Pesan manusia non-teknis; path/class/commit di lampiran.
6. Card performa: bot ukur before/after sendiri — jangan jadikan “belum ada angka” sebagai gap Dev.

**Lesson ETM-16058:** jangan frame “kolom tidak dicek” bila yang benar “Define ya, Enforce/Message belum”.

## Hard gate INTO OTW DEV (wajib sebelum screen)

SKIP + ledger `skipped` bila gagal. Skip = no screen, no Telegram, no Jira write.

Webhook valid hanya jika changelog relevan:
1. `field === "status"`
2. `toString === "OTW DEV"` (case-insensitive; dari status apa pun). `QA Review` = false.
3. `enteredAt` = timestamp changelog INTO itu.
4. Tidak ada event lebih baru keluar dari OTW DEV / noise field (kecuali Due Date Test Dev/Stagging beberapa detik setelah INTO).
5. Status “kebetulan OTW DEV” tanpa INTO event = **bukan** trigger.

Issuetype: Improvement | Change Requirement | Story | Task | Error.  
Test Case → SKIP modul ini.

Regresi false-trigger: ETM-16041, ETM-16040/16044/16039, ETM-15887.

## Race-safe claim

Ledger `reopen-flow-ledger.json` + `fcntl.flock` LOCK_EX.  
Dedupe = `issueKey` + `enteredAt`.

1. Fetch issue + changelog → `enteredAt`; false → skipped.
2. Claim: jika sudah di `notified`/`screening`/`skipped` untuk key+enteredAt → STOP.
3. Else append `screening` → flush → screen.
4. Sebelum Telegram: re-read; jika sudah ada `telegramMessageId` → skip duplicate.
5. Setelah kirim: satu `notified`; hapus dari `screening`.
Target: **maks 1 Telegram hidup** per key+enteredAt.

## Screening steps

1. Hard gate + claim. Jika screening terakhir card = REWORK → **delta** (§ Masuk ulang), bukan full.
2. Fetch description, fields, issuetype, assignee, reporter, links.
3. Daftar AC/Expected/TO-BE; baca `qa-docs/{slug}/requirement.md` bila dirujuk.
4. Fresh-basis: refresh tip `dev` backend `yendyr/olshoperp` + frontend `yendyr/olshoperp-frontend`. Catat sha7 + waktu WIB.
5. Cari commit/PR ber-key; baca **diff**; verifikasi di tip `dev`.
6. **Fix nebeng (2026-10-29):** jika key tidak menutup AC — `list_commits` sejak min(created, OTW DEV) + path modul; kandidat tanpa key / key lain / author = assignee GitHub (`githubLogins` di ledger). Baca 3–6 diff; hanya hitung menutup gap jika jelas. Cache `scannedShas`.
7. Map AC → PASS/GAP/NOT VERIFIED (Define/Enforce/Message).
8. **Dampak performa (wajib)** — rating Aman | Perlu perhatian | **Risiko tinggi → REWORK + create TC performa**.
8b. **Konsistensi UI (wajib)** — inkonsistensi apa pun → **REWORK** (Rachy 2026-10-14).
8c. **Potensi regresi (wajib)** — Aman | Perlu dicek | Risiko tinggi. Regresi **tidak** membuat REWORK; tapi Perlu dicek/Risiko tinggi → PASS tidak boleh tinggi/awaitingDeploy (pakai template sedang) + mention `@Jeiniiii @dapirdaa` tanpa tombol `rgc:`.
9. Verdict + confidence. Rendah ≠ PASS.
10. Risiko tinggi performa → create TC performa sebelum Telegram.
10b. **Docs Requirement (wajib, Improvement/CR/Story/Task + Error yang ubah perilaku)** — § Docs.
11. **Improvement → TC create** — § TC matrix (setelah hard gate).
12. PASS → § PASS policy. REWORK/NEED MANUAL QA → comment + Telegram + ledger. Koreksi → deleteMessage lama dulu.

## PASS policy (locked 2026-10-12/13)

Syarat: bukan Test Case; status **masih OTW DEV** saat tulis (re-check).  
Confidence jujur: tinggi hanya jika jalur kode tiap Expected terbukti di tip `dev` (+ dampak lain) dan bila mungkin data read-only. Baca kode tanpa jalur lengkap = **sedang**.

1. Comment bukti (tinggi & sedang) — template di skill asli / non-teknis BI.
2. **Tanpa transition.** Card tetap OTW DEV.
3. Tinggi: Telegram “menunggu server update”; ledger `passHigh` + `awaitingDeploy` + `repos`.
4. Sedang: Telegram “Perlu cek QA”; tetap OTW DEV.
5. **Catch-up deploy (2026-10-21):** setelah PASS tercatat, cek `server-update-ledger.json` deploys — jika semua repo card sudah ter-deploy (commit ancestor tip deploy) → jalankan seperti server-update (OTW DEV→QA Review; tinggi lanjut Done). REWORK/NEED MANUAL QA → jangan catch-up.

**Jangan pernah langsung ke Done dari screening.**

## Dampak performa (locked 2026-10-08)

Cek N+1, get/all tanpa batas, where tanpa index, COUNT/LIKE '%x%', proses sinkron berat; FE list tanpa pagination, fetch loop tanpa debounce.  
EXPLAIN opsional read-only (Merdian).  
Risiko tinggi → REWORK + 1 TC performa (`test-type-regression` + `performance`), rotasi assignee, Relates, dedupe `perfTcKey`.

## Konsistensi UI (locked 2026-10-14)

Bandingkan layar berubah vs 1–2 menu acuan sejenis. Tidak konsisten = REWORK. Tidak ada “catatan saja”.

## Docs Requirement (locked 2026-11-04, code `yemimadocs`)

Acuan = AC/Expected/TO-BE card (final), apa pun verdict kode.  
Verdict docs: UP-TO-DATE | OUTDATED | MISSING.  
OUTDATED → update SoT `olshoperp` `dev` `docs/qa-docs/` lalu mirror `olshoperp-docs` `main` `qa-docs/`. Commit: `docs(qa): {Menu} … (ETM-xxxx) [yemimadocs]`.  
Lapor 1 baris: `📄 Docs: …` di Telegram + comment. Jangan buat docs menu yang belum punya layer.

## Improvement → Test Case create (locked 2026-09-29)

Hanya **Improvement** (+ hard gate lulus). Error/CR/Story/Task: no auto TC kecuali TC performa Risiko tinggi.

1. Create Test Case `10051` per type — matrix minimal: happy, negative, edge, permission, regression, cross-menu (skip + alasan jika N/A).
2. Format: rule 12 + skill `olshoperp-testcase-authoring`. Summary `[Menu] - …`, sections `---`, Expected dari `requirement.md` / feature-map.
3. Fields: Menu, Request ID (HARD `rec…`|`none`), SP, labels `test-case` + origin key + `test-type-{type}`, assignee rotasi Jein↔Firda.
4. Label `need-data` bila butuh fixture (Yemima 2026-11-02).
5. Relates ke origin. No transition.
6. **Jeda ≥ 3 detik antar create.**
7. Verify GET setelah create.

## Masuk ulang OTW DEV setelah REWORK (delta)

Ledger last verdict REWORK untuk key sama:
1. Ambil gap + basis lama.
2. Tip sama → Telegram singkat “Belum ada commit baru…” (reply screening asal); tetap REWORK.
3. Tip beda → diff saja; gap ✅/❌; UI/perf/regresi hanya file tersentuh; full hanya jika modul baru atau >~15 file.
4. Output “Screening Ulang (masuk ulang OTW DEV)”.

## Manual dry-run

`reopen-flow dry-run ETM-xxxxx` / `cek QA review ETM-xxxxx` → cetak + draft Telegram; jangan kirim/Jira kecuali diminta “kirim”.

## Output chat agent

```
Verdict: {PASS|REWORK|NEED MANUAL QA|SKIP} · Confidence: …
{KEY}: {Summary}
Sudah oke: … / Masih gap: … / Rekomendasi: …
Dampak performa: … · TC performa: …
Konsistensi UI: …
Telegram: {tidak dikirim | msg id}
Jira: comment {id} · transition none
```

Templates Telegram: `../../reference/telegram-templates.md`.  
IDs: `../../reference/ids-ledgers.md`.
