---
name: olshoperp-card-testing
description: >-
  Alur menjalankan test card Jira ETM (Test Case, Error, Improvement) di staging lewat crawl/manual
  (Playwright probe atau browser pane) dan mencatat hasilnya (Jira + Telegram ringkas, bukti = data bertanda
  nomor card). Pakai saat user bilang "test card ETM-xxxxx", "jalankan test case ini", "laporkan hasil test",
  atau minta Bugsy menguji. Untuk MEMBUAT card Test Case pakai skill olshoperp-testcase-authoring.
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
- **Tingkat pelaporan** (default = Jira + Telegram ringkas). Drive dan dokumen TC di repo tidak dipakai. Lihat §6.

## 1. Tentukan jenis card
`GET issue/{key}` lalu lihat `issuetype`, status, komentar terbaru (screening Hazel, tester lain), dan `changelog` ringkas (ada yang sedang menguji? status baru berubah?).
- **Test Case** → alur §2. **Error / Improvement / Change Requirement** → alur §3.
- Minta izin per card hanya jika Yemima belum menyuruh jelas. Perintah "test card ini" = izin menguji + mencatat sesuai alur di bawah.

## 2. Alur card Test Case
1. **Geser ke TESTING PROGRESS SEBELUM tes** (bukan saat mencatat hasil).
2. Tes sesuai Steps/Expected di card (data uji dari card; cek dulu di DB baca-saja bahwa datanya masih ada).
3. Isi **Actual Result** (ADF: company, akun, data, hasil per Expected) → baca ulang → isi **Test Result** (Passed/Failed/Blocked) → komentar bukti → **Done**. Jangan isi Test Result sebelum Actual Result.
4. Bukti dan laporan sesuai §6 (data uji bertanda nomor card, komentar Jira, Telegram ringkas).
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

## 6. Pelaporan & bukti
- **Jira = tempat detail.** Komentar/Actual Result memuat waktu, company, akun, data uji (kode dokumen + URL), hasil per Expected (angka eksak), catatan ketidakpastian.
- **Bukti = data di environment yang diuji**, bukan Drive. Beri tanda nomor card: awali nama/kode data buatan sendiri atau isi Description/Reference Doc dengan `QA ETM-xxxxx` (mis. `QA ETM-16707 TC1`). Catat kode dokumen + URL-nya di komentar Jira.
  - **Perlu data tersimpan:** test yang membuat/mengubah dokumen atau transaksi, hasil **Failed** (supaya dev bisa membuka kasusnya), dan angka hitungan yang bisa berubah.
  - **Cukup angka di komentar:** tes baca-saja, kasus negatif yang ditolak (0 request simpan), cek tampilan tanpa mengubah data. Warna/tata letak ditulis sebagai teks ("Total 0,01 berwarna orange").
  - Kalau data bukti menahan fixture bersama (PI/CN/DN/saldo yang di-reserve) dan menghalangi penguji lain: catat angka dan kode di komentar dulu, baru hapus; atau pakai fixture khusus QA.
- **Telegram** (grup `-1001931573603`, thread `51478`): tetap dikirim.
  - Test satu card: pesan ringkas (hasil, 3–5 poin Expected, link Jira).
  - **Batch** (≥3 card/TC): SATU pesan ringkasan saja: judul batch, jumlah ✅/❌/⏸, satu baris per card (key + hasil + hal terpenting), card Error baru bila ada, "detail di komentar tiap card". Kirim juga hasil sementara; edit pesan yang sama saat final.
- **Drive: tidak dipakai** kecuali Yemima menyuruh.
- **Dokumen TC di repo tidak dipakai lagi** (semua TC hidup di Jira; tanpa mirror dan tanpa renumber, keputusan Yemima 22 Okt 2026).
- Setelah selesai, simpan pelajaran penting ke memory/dokumen agar sesi berikutnya tidak mengulang.

## 7. Membuat card Test Case baru
Bukan tugas skill ini. Pakai skill **`olshoperp-testcase-authoring`** (cek gap, data uji, terbitkan card dan relasi).

## 8. Jebakan yang sudah terjadi
- Menggeser TC ke Testing Progress terlambat → ditegur.
- Menahan laporan Telegram sampai lengkap → minta hasil sementara.
- Mengubah fixture bertanda "jangan dihapus" tanpa membaca catatan.
- Probe memakai Ctrl+A → input tidak terhapus, nilai lama tersimpan ulang.
- Menulis langkah isian dari asumsi, bukan dari kode FE.
- Satu query join besar ke DB baca-saja kadang kosong/timeout → ulangi dengan query lebih sederhana.

## Rujukan
`olshoperp/.cursor/rules` 16, 17, 23 · `olshoperp-docs/.cursor/rules` 12, 22, 24 · `qa-docs/{menu}/requirement.md`.
