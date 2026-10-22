---
name: olshoperp-card-testing
description: >-
  Alur lengkap menguji card Jira ETM (Test Case, Error, Improvement) di staging lewat crawl/manual
  (Playwright probe atau browser pane), mencatat hasil (Jira, Telegram, Drive, dokumen TC), dan membuat
  card Test Case baru. Pakai saat user bilang "test card ETM-xxxxx", "cek test case yang kurang",
  "buatkan test case", "laporkan hasil test ke Telegram", atau minta Bugsy menjalankan test.
---

# OlshopERP — Testing Card Jira (Bugsy)

Detail teknis (ID Jira, snippet, template) ada di [reference.md](reference.md). Baca hanya bagian yang dibutuhkan.
Bahasa ke Yemima/tim: Indonesia sehari-hari, non-teknis, angka eksak (rule `24-plain-language-team-comms`).

## 0. Hemat token (WAJIB)
- Satu sesi = satu card besar. Setelah hasil dicatat, sesi baru untuk tugas lain.
- Ambil card dengan `fields=` seperlunya (summary, status, issuetype, description, issuelinks, comment). Jangan dump changelog penuh.
- Rule/requirement besar: `grep -n "^## "` dulu, baca bagian relevan saja (mis. rule `13` hanya §2, §3, §3A, §5B).
- Kerja massal (banyak TC/card) = satu file data + generator, bukan mengetik per card.
- Probe Playwright: satu spec yang merekam semua kasus ke JSON, bukan satu run per kasus. Baca JSON, bukan seluruh log.
- Balasan ke user: recap singkat + keputusan yang perlu dia ambil. Detail teknis ke komentar Jira/dokumen, bukan chat.

## 1. Tentukan jenis card
`GET issue/{key}` lalu lihat `issuetype`, status, komentar terbaru (screening Hazel, tester lain), dan `changelog` ringkas (ada yang sedang menguji? status baru berubah?).
- **Test Case** → alur §2. **Error / Improvement / Change Requirement** → alur §3.
- Minta izin per card hanya jika Yemima belum menyuruh jelas. Perintah "test card ini" = izin menguji + mencatat sesuai alur di bawah.

## 2. Alur card Test Case
1. **Geser ke TESTING PROGRESS SEBELUM tes** (bukan saat mencatat hasil).
2. Tes sesuai Steps/Expected di card (data uji dari card; cek dulu di DB baca-saja bahwa datanya masih ada).
3. Isi **Actual Result** (ADF: company, akun, data, hasil per Expected) → baca ulang → isi **Test Result** (Passed/Failed/Blocked) → komentar bukti → **Done**. Jangan isi Test Result sebelum Actual Result.
4. Telegram laporan (format di reference), Drive evidence, dokumen TC (`TC-{PREFIX}-DRAFT-{timestamp}.md` + README + mirror ke repo `olshoperp` `dev`).
5. **Failed → wajib card Error baru** (Relates ke TC + origin, assignee = assignee origin); origin → RE-OPEN. Ikuti rule `22-reopen-defect-flow`.

## 3. Alur card non-Test Case
1. Tes sesuai Expected di description. Hasil bukti **di komentar Jira** (bukan Actual/Test Result).
2. **Lulus** → komentar bukti lalu transisi QA Review → Done (ambil id lewat `GET .../transitions`). Tanpa Telegram/Drive/TC-doc kecuali diminta.
3. **Gagal** → jangan Done. Error origin: RE-OPEN + clone; Improvement origin: RE-OPEN tanpa clone + card Error baru. Lapor ke Yemima dulu bila ragu.
4. Kalau expected bersyarat data, uji KEDUA kondisi (ada/tidak ada) dan jelaskan data per kondisi.

## 4. Data uji — requirement dulu
Urutan: description card → komentar card (screening) → `qa-docs/{menu}/requirement.md` (status harus review/approved) → kode (BE controller + FE komponen) → data nyata (DB baca-saja). Sajikan sebagai "requirement bilang X, kode melakukan Y, data Z".
- Baca kode FE form/modal sebelum menulis langkah isian (contoh: isian "to be Paid Amount" di AP/AR selalu mata uang header, bukan mata uang invoice).
- Pilih data milik sendiri/QA; **baca catatan fixture** ("jangan dihapus") sebelum mengubah; jangan mengubah data tim.
- Hitung angka kritis dengan skrip (pembulatan, kurs), jangan menebak; hindari nilai tepat di batas (mis. 0,005).

## 5. Eksekusi (crawl aman)
- Pakai Playwright probe di repo `olshoperp-docs` (`tests/specs/check-*.spec.ts`, tanpa tag `@TC`), atau browser pane. Hapus probe + `test-results` setelah selesai.
- Company: panggil `switchCompanyByCode` eksplisit; `prepareSession` bisa percaya localStorage padahal server masih company lain (gejala: API 404 / "You do not have access to this page").
- **Tes negatif di data bersama**: pasang `page.route('**/endpoint', r => r.abort())` SEBELUM kasus pertama, hitung request via `page.on('request')`. Kosongkan input dengan `fill('')` (Ctrl+A di Mac = awal baris). Spec yang mengubah data: `retries=0`.
- Cek DB sebelum dan sesudah; kalau ada perubahan tak sengaja, tulis jujur di komentar (nilai, log, siapa).
- **Production (Merdian)**: baca-saja. Jangan mengetik password production; Yemima login sendiri di browser pane.
- Rekam bukti (screenshot ke scratchpad, JSON hasil, angka eksak). Jangan menyimpan token/password di file, komentar, atau chat.

## 6. Pelaporan
- Jira: komentar/Actual Result memuat waktu, company, akun, data uji, hasil per Expected (angka eksak), catatan ketidakpastian.
- Telegram: kirim juga hasil sementara ("hasil sementara"), jangan menahan sampai lengkap. Edit pesan yang sama saat hasil final.
- Drive: folder `Temuan Bugsy/{KEY}/`; tool Drive hanya bisa membuat file baru (tidak mengubah isi).
- Setelah selesai, simpan pelajaran penting ke memory/dokumen agar sesi berikutnya tidak mengulang.

## 7. Membuat card Test Case baru
Gap dulu: bandingkan AC card vs TC yang ada vs kode vs data; tanyakan hanya keputusan yang memang milik Yemima. Lalu satu file data → generator ADF Jira + dokumen TC. Field dan format di reference (§C). Jeda 2,5 dtk antar operasi Jira. Jangan kirim webhook `#testcase … ready` kecuali Yemima mengetik perintahnya.

## 8. Jebakan yang sudah terjadi
- Menggeser TC ke Testing Progress terlambat → ditegur.
- Menahan laporan Telegram sampai lengkap → minta hasil sementara.
- Mengubah fixture bertanda "jangan dihapus" tanpa membaca catatan.
- Probe memakai Ctrl+A → input tidak terhapus, nilai lama tersimpan ulang.
- Menulis langkah isian dari asumsi, bukan dari kode FE.
- Satu query join besar ke DB baca-saja kadang kosong/timeout → ulangi dengan query lebih sederhana.

## Rujukan
`olshoperp/.cursor/rules` 15, 16, 17, 18, 23 · `olshoperp-docs/.cursor/rules` 12, 13, 16, 22, 24 · `qa-docs/{menu}/requirement.md`.
