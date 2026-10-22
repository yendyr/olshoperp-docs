---
name: olshoperp-testcase-authoring
description: >-
  Membuat card Jira Test Case (ETM) yang lengkap untuk sebuah card Improvement/Error/Change Requirement:
  cek TC yang kurang terhadap acceptance criteria, siapkan data uji dari awal sampai akhir, lalu terbitkan
  card dan relasinya. Jira saja (tidak ada dokumen TC di repo). Pakai saat user bilang "buatkan test case",
  "cek test case kurang atau tidak", "TC untuk ETM-xxxxx". Untuk MENJALANKAN test pakai skill olshoperp-card-testing.
---

# OlshopERP — Membuat Test Case (Jira saja)

Detail ada di [reference.md](reference.md). Bahasa: Indonesia sehari-hari, non-teknis, label UI persis seperti di aplikasi (rule `15`, `23`).

## 0. Prinsip
- **Jira adalah satu-satunya tempat TC.** Jangan buat file TC di repo, jangan mirror, jangan renumber (keputusan Yemima, 22 Okt 2026).
- Skill ini hanya **membuat** card. Menjalankan test, mengubah status, dan mengisi Actual/Test Result = skill `olshoperp-card-testing`.
- Hemat token: baca card dengan `fields=` seperlunya, `grep` rule/requirement dulu, tulis semua TC dalam SATU file data lalu terbitkan dengan alat (`tools/tc_lib.py`).

## 1. Cek TC yang kurang (jika diminta menilai)
1. Card origin: description (AC), komentar screening, relasi. `GET issue/{key}?fields=summary,description,comment,issuelinks`.
2. TC yang sudah ada: card terhubung + JQL `issuetype="Test Case" AND summary ~ "{menu}"` (cegah duplikat).
3. Requirement menu `qa-docs/{menu}/requirement.md` (harus status review/approved), lalu kode BE + FE (modal/form yang dipakai tester), lalu data nyata (DB baca-saja, `tools/qm.py`).
4. Petakan **tiap AC → TC yang mencakup** (penuh/sebagian/tidak ada). Sajikan: "requirement bilang X, kode melakukan Y, TC yang kurang Z". Prioritaskan (High untuk alur utama dan celah yang pernah gagal).
5. Keputusan yang milik Yemima (mis. requirement vs kode bertentangan) tanyakan SEKALI; TC tetap ditulis dengan Expected sesuai requirement dan catatan jelas bahwa hasil saat ini diperkirakan berbeda.

## 2. Isi satu card TC
- Judul `[Nama Menu] - deskripsi singkat (tipe)`; tipe: happy, negative, edge, permission, regression, cross-menu. Satu TC = satu tipe.
- Section: **Summary, Environment, Precondition Data (+ tabel data uji), Steps to Reproduce, Expected Result**, lalu catatan untuk penguji, pembersihan data, Additional Context. Pemisah garis antar section.
- Data uji **konkret dari awal sampai akhir**: dokumen/invoice/note nyata (kode + URL edit), master (supplier/customer, bank, akun), nominal yang diketik persis, hasil hitung tiap langkah, saldo/prasyarat, dan cara menyiapkan data yang belum ada (langkah buat dari nol).
- Tiap langkah menyebut label tombol/field persis dari FE; tiap langkah penting diikuti "Cek: …" dengan angka eksak.
- **Tanda bukti:** minta penguji menandai data buatannya dengan nomor card (mis. `QA ETM-xxxxx` di Description/Reference) supaya bukti tinggal di environment; data yang menahan fixture bersama dicatat angkanya lalu dihapus.
- Hitung angka dengan skrip (pembulatan, kurs); hindari nilai tepat di batas (mis. 0,005). Baca kode FE modal sebelum menulis langkah isian (mata uang kolom isian, tombol Allocate/Clearing, filter data per currency).
- Cek fixture bebas dari reservasi (draft/open) sebelum menjadikannya data uji.

## 3. Menerbitkan card
1. Salin `tools/example_tc_data.py`, isi CFG + TCS (struktur: judul, summary, req, pre, data_tables, steps [(teks, [cek…])], expected, notes).
2. `python3 tools/tc_lib.py file_data.py create` → card TC (issuetype `10051`), field Menu, Request ID (salin dari origin), Story Points 1, label `[origin, test-case, test-type-…]`, assignee Yemima, link `Relates` ke origin, jeda 2,5 dtk.
3. Perbaikan isi: ubah file data lalu `... update` (description + judul). Verifikasi dengan `GET` (status harus Not Execute, link ada).
4. Laporan ke Yemima: tabel ringkas card → skenario → data kunci, lalu hal yang perlu keputusan atau hasil yang diperkirakan gagal. Tanpa dokumen/Drive.

## 4. Jangan
- Kirim webhook `#testcase {key} ready` kecuali Yemima mengetik perintahnya (rule `18`).
- Mengubah status TC atau mengisi Actual/Test Result (itu saat testing).
- Membuat file di `qa-docs/.../test-cases/` atau menjalankan renumber.
- Menulis langkah isian dari asumsi tanpa membaca kode/UI.

## Rujukan
`olshoperp/.cursor/rules` 15, 16, 18, 23 · `olshoperp-docs/.cursor/rules` 12 (format card), 24.
