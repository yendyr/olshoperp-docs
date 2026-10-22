---
doc_type: e2e-test-case
tc_code: TC-VP-003
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
test_type: regression
title: "Regression: Audit Log mencatat edit nilai, tambah baris, dan hapus baris Margin Price Configuration dengan nilai lama dan baru, user, waktu, dan record yang benar"
summary: "Pada Variable Price By Weight dengan 2 baris, ubah Value baris 1, tambah baris 3 dan ubah End baris 2, lalu hapus baris 3: Audit Log mencatat Updated baris 1 (hanya field berubah), Updated baris 2 (End Value dan Is Unlimited / Last), baris 3 dengan nilai lama dari baris Unlimited sebelumnya, Deleted baris 3 dengan nilai lamanya, dan Updated baris 2 kembali Unlimited; tiap entri bertanda user login, waktu aksi, dan record yang benar."
status: draft
owner: QA - Yemima
last_updated: 2026-10-21
requirement_ref: "qa-docs/businessdevelopment-variable-price/requirement.md A-13 (Audit Log tier: nilai 0/Unlimited tampil sebagai angka atau Unlimited, Old Value lengkap saat shift baris, slideover; ETM-16565); card ETM-16520 (origin ETM-16312)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses Variable Price (akun uji playwright-user); company aktif Dev Staging (13)"
  - "Perbaikan Audit Log ETM-16565 sudah ter-deploy di Staging (Done 20-10-2026): End Value tanpa batas tampil Unlimited, bukan strip"
  - "Ada Variable Price By Weight dengan 2 baris: baris 1 Start 1, End 10.000, Amount 1.000; baris 2 Start 10.001, Unlimited, Amount 2.000 (di run ini dibuat QA-VP-LOG1B-BUGSY karena QA-VP-LOG1B dari TC sebelumnya tidak ada di staging)"
test_data:
  - field: data_uji
    value: "QA-VP-LOG1B-BUGSY (id 79, By Weight, company 13)"
  - field: nilai_uji
    value: "baris 1 Value 1.000 menjadi 1.500; baris 3 Start 20.001, Unlimited, Amount 3.000; baris 2 End 20.000; lalu hapus baris 3"
steps:
  - "Login https://staging.olshoperp.com/login, lalu pastikan company aktif Dev Staging (13): klik avatar profil di topbar, pilih Switch Company, pilih Dev Staging, klik Proceed"
  - "Buka Business Development → Price → Variable Price, lalu buka Variable Price uji (https://staging.olshoperp.com/businessdevelopment/variable-price/edit/79); jika belum ada, buat dulu dengan 2 baris seperti di precondition"
  - "Ubah Value baris 1 dari 1.000 menjadi 1.500 dan klik di luar field"
  - "Klik tombol + untuk menambah baris 3, pilih Type Amount, isi Value 3.000, lalu ubah End baris 2 menjadi 20.000 (Start baris 3 otomatis 20.001); klik Save All"
  - "Klik ikon hapus (merah) di baris 3; baris 2 kembali Unlimited; klik Save All"
  - "Buka Audit Log (menu samping kanan halaman edit) dan baca seluruh entri"
expected_result: |
  1. Entri Updated baris 1: Margin Value 1.000 → 1.500, hanya field yang berubah.
  2. Entri Updated baris 2: End Value Unlimited → 20.000 dan Is Unlimited / Last Yes → No.
  3. Baris 3 (Start 20.001, End Unlimited, Type Amount, Margin Value 3.000, Is Unlimited / Last Yes) tercatat dengan nilai lama dari baris Unlimited sebelumnya (Start 10.001, Unlimited, Amount, 2.000); End Value tanpa batas tertulis Unlimited, bukan strip.
  4. Langkah 5: entri Deleted baris 3 dengan nilai lamanya, dan entri Updated baris 2 kembali Unlimited (End Value 20.000 → Unlimited, Is Unlimited / Last No → Yes).
  5. Setiap entri: User = akun yang login, waktu = saat aksi (WIB, selisih paling lama 1 menit), dan merujuk record yang benar (baris tier milik Variable Price yang sama).
test_result:
  status: passed
  started_at: "2026-10-21T12:56:00+07:00"
  finished_at: "2026-10-21T12:59:00+07:00"
  executed_by: "Bugsy (Claude) atas permintaan Yemima; login playwright-user"
  environment: staging
  log_summary: "Update baris 1 hanya Margin Value 1.000 ke 1.500; update baris 2 End Unlimited ke 20.000 dan Is Last Yes ke No; baris 3 tercatat updated dengan nilai lama baris Unlimited sebelumnya dan nilai baru sesuai; delete baris 3 dengan nilai lamanya dan baris 2 kembali Unlimited; 8 dari 8 entri bertanda Playwright User, selisih waktu 0-1 detik, cocok dengan 8 baris tabel audits. Dua beda tulisan dari Expected card lama: Unlimited (bukan strip) dan baris 3 updated (bukan created), mengikuti ETM-16565."
  report_url: "https://drive.google.com/drive/folders/1WU4a0kFMt9nA4pBlgwqhNykmB94AU1em"
test_data_used:
  - "QA-VP-LOG1B-BUGSY"
run_history:
  - at: "2026-10-21"
    status: passed
    environment: staging
    note: "Passed dengan catatan: log edit, tambah, dan hapus baris tier benar (nilai lama dan baru, user, waktu, record). Expected card lama memakai strip dan entri Created untuk baris 3; sejak ETM-16565 tampil Unlimited dan baris 3 dicatat Updated dengan nilai lama baris Unlimited sebelumnya."
origin_jira: ETM-16520
first_execution:
  at: "2026-10-21"
  via: "manual:Bugsy"
  jira: ETM-16520
last_execution:
  at: "2026-10-21"
  jira: ETM-16520
  status: passed
  via: "manual:Bugsy"
  notes: "Dieksekusi manual oleh Claude (peran Bugsy) 21-10-2026 12:56-12:59 WIB di staging company Dev Staging 13 dengan data QA-VP-LOG1B-BUGSY: Audit Log mencatat update baris 1, update baris 2, baris 3 dengan nilai lama baris Unlimited sebelumnya, delete baris 3 dan baris 2 kembali Unlimited, tiap entri bertanda user login dan waktu aksi, hasil Passed dengan catatan Expected lama."
---

# Audit Log edit, tambah, dan hapus baris tier (Variable Price)

Card: [ETM-16520](https://erpintegration.atlassian.net/browse/ETM-16520) (Test Case, regression) · card asal: [ETM-16312](https://erpintegration.atlassian.net/browse/ETM-16312) · perbaikan terkait: [ETM-16565](https://erpintegration.atlassian.net/browse/ETM-16565)

## Retest cepat
1. Staging, company **Dev Staging (13)** → **Business Development → Price → Variable Price** → buka Variable Price By Weight 2 baris (Amount 1.000 dan 2.000).
2. Baris 1 Value 1.000 → 1.500; klik di luar field.
3. Tambah baris 3 (Amount 3.000), ubah End baris 2 jadi 20.000, Save All.
4. Hapus baris 3, Save All.
5. Buka **Audit Log**: 1 entri Updated baris 1, 2 entri Updated (baris 2 dan baris 3) pada langkah 3, lalu Deleted baris 3 dan Updated baris 2 pada langkah 4.

## Catatan QA

### Hasil run Bugsy 21-10-2026 (WIB, dari log request dan tabel audits)
| Waktu | Aksi | Entri Audit Log | Hasil |
|---|---|---|---|
| 12:57:21 | Baris 1 Value 1.000 → 1.500 | Updated baris 1: Margin Value 1.000 → 1.500 (hanya field itu) | ✅ |
| 12:57:27 | Baris 2 End 20.000 (baris 3 tersimpan) | Updated baris 2: End Value Unlimited → 20.000, Is Unlimited / Last Yes → No | ✅ |
| 12:57:27 | Baris 3 Start 20.001, Amount 3.000 | Updated baris 3: lama Start 10.001 · Unlimited · Amount 2.000 · Last Yes; baru Start 20.001 · Unlimited · Amount 3.000 · Last Yes | ✅ (Updated, bukan Created) |
| 12:58:53 | Hapus baris 3 | Deleted baris 3: nilai lama Start 20.001 · Unlimited · Amount 3.000 · Last Yes | ✅ |
| 12:58:53 | Baris 2 kembali Unlimited | Updated baris 2: End Value 20.000 → Unlimited, Is Unlimited / Last No → Yes | ✅ |
| — | Seluruh entri | User Playwright User di 8 dari 8 entri; selisih waktu 0-1 detik; ketiga baris tier milik Variable Price id 79 | ✅ |

### Observasi
- Expected di card ETM-16520 (dibuat 13-10-2026 dari kode PR #6489) memakai strip untuk End Value tanpa batas dan entri Created untuk baris 3. Sejak perbaikan ETM-16565 (Done 20-10-2026) tampil Unlimited dan baris hasil geseran tier dicatat Updated dengan nilai lama dari baris Unlimited sebelumnya. Expected di TC ini sudah mengikuti perilaku terbaru; Expected di Jira perlu diperbarui.
- Mengisi Type dan Value baris 3 sebelum End baris 2 terisi memunculkan "End must be greater than Start on row 2" (2 kali) dan belum menyimpan apa pun; baris 3 baru tersimpan saat End baris 2 diisi.
- Save All setelah perubahan yang sudah tersimpan otomatis menampilkan toast "Duplicate request detected, please wait 3 seconds" jika isi kiriman sama dalam 3 detik (terjadi pada langkah hapus); data tidak berubah. Sudah tercatat di ETM-16634.
- Akun login run ini playwright-user; card menyebut tim_dev, sehingga kolom User di log berisi Playwright User.
- Data uji QA-VP-LOG1B-BUGSY (id 79) dibiarkan di staging company 13 (2 baris, baris 3 sudah dihapus).
- Evidence (teks): https://drive.google.com/drive/folders/1WU4a0kFMt9nA4pBlgwqhNykmB94AU1em
