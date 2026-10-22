---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-023
menu: supplychain-assembly
menu_name: "Assembly"
test_type: regression
title: "Kolom lama export Assembly (With dan Without Details) dan This Page Only tetap sama setelah penyesuaian format export"
summary: "Kolom lama export Assembly (Trans. Code sampai Unit, Transaction Status, dan kolom audit) tetap berisi data dan format yang sama setelah penambahan kolom komponen dan outbound; Qty tetap format angka dengan pemisah ribuan dan rata kanan, FG tanpa detail menampilkan '-', dan opsi This Page Only tetap terunduh tanpa error dengan isi sesuai kolom datalist."
status: draft
owner: QA - Yemima
last_updated: 2026-10-20
requirement_ref: "qa-docs/supplychain-assembly/requirement.md §7.4a (Without Details tanpa kolom 13–18; format tanggal dd-mm-yyyy hh:mm:ss; ETM-16645); card ETM-16654"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses export Assembly; company aktif Dev Staging (13)"
  - "PR backend ETM-16645 (#6558 dan #6559) sudah merge dan server update backend Staging selesai (20-10-2026 11:21 WIB)"
  - "File export With Details dan Without Details yang dibuat sebelum server update ETM-16645 (atau perbandingan dengan data database bila file lama tidak tersedia)"
test_data:
  - field: dokumen_perbandingan_lama_baru
    value: "AS-6AB493FC (Approved; 5 FG) — data sebelum update hanya menampilkan header BOM, setelah update diulang per komponen"
  - field: cakupan_cross_check
    value: "Seluruh 244 dokumen company 13 (Approved, Draft, Open, Rejected; termasuk multi-FG dan tanpa FG)"
steps:
  - "Login https://staging.olshoperp.com/login, lalu pastikan company aktif Dev Staging (13): klik avatar profil di topbar, pilih Switch Company, pilih Dev Staging, klik Proceed"
  - "Buka Assembly → Export → Export → With Details dan Without Details setelah update; unduh keduanya"
  - "Bandingkan kolom Trans. Code, Warehouse Name, Type, Transaction Date, Transaction Ref, Start Date, Progress Status, Description, System Product SKU, System Product Name, Qty, Unit, Transaction Status, Created At, Created By, Updated By, Updated At dengan file sebelum update (atau dengan data database) untuk dokumen yang sama"
  - "Periksa format tanggal (dd-mm-yyyy hh:mm:ss), format Qty (angka dengan pemisah ribuan, rata kanan), dan baris FG tanpa detail (Qty '-' bukan 0)"
  - "Di datalist Assembly pilih Export → Export → This Page Only; buka file yang terunduh dan bandingkan dengan kolom datalist yang tampil"
expected_result: |
  1. Isi kolom lama sama dengan file sebelum update (kecuali baris FG kini diulang per komponen di With Details).
  2. Format tanggal tetap dd-mm-yyyy hh:mm:ss; Qty tetap format angka dengan pemisah ribuan dan rata kanan.
  3. FG tanpa detail menampilkan '-' di kolom Qty (bukan 0).
  4. This Page Only tetap bisa diunduh tanpa error dan isinya sesuai kolom datalist yang tampil.

  [CATATAN QA] AC "Active Page konsisten dengan pilihan with/without details" belum diubah di kode (This Page Only berdiri sendiri); konfirmasi ke Lead QA apakah perlu perubahan.
test_result:
  status: passed
  started_at: "2026-10-20T13:28:33+07:00"
  finished_at: "2026-10-20T13:47:44+07:00"
  executed_by: "Firda Siska (manual, Jira ETM-16654); cross-check Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "Firda Siska: kolom lama AS-6AB493FC sama antara data sebelum dan sesudah update (sebelum hanya header BOM, sesudah diulang per komponen), format tanggal, Qty, FG tanpa detail dan This Page Only sesuai (Passed, Done 13:47). Cross-check Bugsy: Without Details 2.928 nilai dan With Details 12.324 nilai + 984 baris FG sama dengan database, 0 berbeda; Qty angka #,##0.00 rata kanan; 43 dokumen tanpa FG berisi '-'; This Page Only 260 nilai sama dengan datalist."
  report_url: "https://drive.google.com/drive/folders/16oOFbfctSRNQbd_QWUWhlzb9-DDJDNpj"
test_data_used:
  - "AS-6AB493FC"
run_history:
  - at: "2026-10-20"
    status: passed
    environment: staging
    note: "Passed oleh Firda Siska (perbandingan data sebelum dan sesudah update untuk AS-6AB493FC); cross-check Bugsy terhadap database untuk 244 dokumen sejalan (0 berbeda). AC Active Page vs with/without menunggu konfirmasi Lead QA."
origin_jira: ETM-16654
first_execution:
  at: "2026-10-20"
  via: "manual:Firda Siska"
  jira: ETM-16654
last_execution:
  at: "2026-10-20"
  jira: ETM-16654
  status: passed
  via: "manual:Firda Siska"
  notes: "Dieksekusi Firda Siska 20-10-2026 13:28-13:47 WIB di staging company Dev Staging 13 dengan membandingkan export sebelum dan sesudah update untuk AS-6AB493FC: kolom lama sama, format tanggal dan Qty sesuai, FG tanpa detail berisi strip, This Page Only terunduh tanpa error. Cross-check oleh Claude (Bugsy) terhadap database untuk 244 dokumen sejalan dengan nol perbedaan. Ditutup passed."
---

# Kolom lama export Assembly tetap sama (With/Without Details dan This Page Only)

Card: [ETM-16654](https://erpintegration.atlassian.net/browse/ETM-16654) (Test Case, regression) · card asal: [ETM-16645](https://erpintegration.atlassian.net/browse/ETM-16645)

## Retest cepat
1. Staging, company **Dev Staging (13)** → **Assembly** → Export → **With Details**, **Without Details**, dan **This Page Only**.
2. Bandingkan kolom lama dengan file sebelum update (atau database): Trans. Code s/d Updated At sama; tanggal dd-mm-yyyy hh:mm:ss; Qty angka ribuan rata kanan.
3. FG tanpa detail: Qty "-" (bukan 0). This Page Only: kolom dan baris sama dengan datalist.

## Catatan QA

### Hasil 20-10-2026
- **Eksekusi utama (Firda Siska):** perbandingan data sebelum dan sesudah update untuk AS-6AB493FC: sebelum hanya header BOM (5 baris FG), sesudah diulang per komponen (11 baris); kolom lama sama; semua poin Expected (kolom, format tanggal, Qty, FG tanpa detail, This Page Only) sesuai. Test Result Passed, Done 13:47.
- **Cross-check Bugsy** (tanpa file lama; pembanding database dan perbandingan kode):
| Pemeriksaan | Hasil |
|---|---|
| Without Details: 13 kolom, nilai kolom lama vs DB | ✅ 2.928 nilai, 0 berbeda |
| With Details: 12 kolom header dokumen vs DB | ✅ 12.324 nilai, 0 berbeda; kolom FG 984 dari 984 baris sama |
| Qty angka, pemisah ribuan (#,##0.00), rata kanan | ✅ 984 sel |
| FG tanpa detail | ✅ 43 dokumen: SKU, Name, Qty, Unit "-"; 0 baris Qty 0 (kode lama menulis 0, kini "-") |
| This Page Only | ✅ 13 kolom = kolom datalist (tanpa Error Flag dan Action), 20 baris, 260 nilai sama |

### Observasi
- Aturan Updated By tidak berubah: pengubah, jika kosong atau 0 maka pembuat, jika tidak ada "System" (7 dokumen updated_by = 0 tampil nama pembuat).
- AC "Active Page konsisten dengan with/without details" belum diubah di kode; menunggu konfirmasi Lead QA.
- Unit FG berunit Box tampil Pieces (sudah begitu sebelum perubahan; ETM-16659).
- Pada 13:53 update Actual Result oleh Claude sempat menimpa Actual Result Firda di Jira dan sudah dipulihkan dari riwayat; hasil resmi tetap milik Firda.
- Evidence cross-check (teks): https://drive.google.com/drive/folders/16oOFbfctSRNQbd_QWUWhlzb9-DDJDNpj
