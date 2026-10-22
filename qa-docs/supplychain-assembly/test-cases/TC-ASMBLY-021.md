---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-021
menu: supplychain-assembly
menu_name: "Assembly"
test_type: happy
title: "Export All With Details Assembly menghasilkan 23 kolom dengan 1 baris per finished good × komponen BOM"
summary: "Export All With Details di menu Assembly memakai 23 kolom dengan nama dan urutan persis format Request Final, 1 baris per FG × komponen (kolom header dan FG diulang), Total Qty Need = qty BOM × qty FG, serta Outbound Code dan Outbound Date terisi dengan format dd-mm-yyyy hh:mm:ss."
status: draft
owner: QA - Yemima
last_updated: 2026-10-20
requirement_ref: "qa-docs/supplychain-assembly/requirement.md §7.4a (TO-BE With Details 23 kolom; ETM-16645); card ETM-16651"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-mutation-outbound
  - bill-of-material
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses menu Assembly dan Export (akun default E2E playwright@gmail.com); company aktif Dev Staging (13)"
  - "PR backend ETM-16645 (#6558 dan #6559) sudah merge dan server update backend Staging selesai (20-10-2026 11:21 WIB)"
  - "Ada dokumen Assembly Approved dengan 1 FG yang BOM-nya punya 2 komponen dan Other Outbound komponennya sudah terbentuk"
test_data:
  - field: dokumen_a
    value: "AS-69C1F60D (company 13): FG BOM-TUMBLR qty 2 Pieces; komponen TTP-BTL 3 per FG dan BTL-PLS 1 per FG; Other Outbound OT-69C1F71A (24-03-2026 09:25:33)"
  - field: dokumen_b
    value: "AS-6A475993 (company 13): FG SKUHEADERBOM-EARPHONE qty 1 Pieces; komponen SKUDETAILBOM-Earphone-1 10 dan -2 5 per FG; Other Outbound OT-6A475BAA (05-06-2026 13:41:42)"
  - field: catatan_data
    value: "Data persis di card (FG qty 10, komponen X 2 per FG dan Y 1 per FG) tidak ada di staging; dipakai dokumen dengan struktur sama"
steps:
  - "Login https://staging.olshoperp.com/login, lalu pastikan company aktif Dev Staging (13): klik avatar profil di topbar, pilih Switch Company, pilih Dev Staging, klik Proceed"
  - "Buka sidebar Supply Chain Management → Assembly (https://staging.olshoperp.com/supplychain/assembly); klik tombol Export, lalu tombol Export di slideover, pilih 'With Details'"
  - "Tunggu status riwayat export menjadi 'Ready to Download', lalu klik ikon unduh pada baris tersebut"
  - "Bandingkan baris 1 file dengan daftar 23 kolom: Trans. Code, Warehouse Name, Type, Transaction Date, Transaction Ref, Start Date, Progress Status, Description, System Product SKU, System Product Name, Qty, Unit, System Product SKU Component, System Product SKU Name Component, Total Qty Need, Unit Component, Outbound Code, Outbound Date, Transaction Status, Created At, Created By, Updated By, Updated At"
  - "Cari baris dokumen AS-69C1F60D dan AS-6A475993: periksa jumlah baris per FG, kolom header dan FG yang diulang, Total Qty Need, Unit Component, Outbound Code dan Outbound Date"
  - "Bandingkan dengan halaman Other Outbound (Stock Mutation → Other Outbound) dan BOM dokumen: kode, tanggal transaksi, OUT QTY per SKU, dan qty komponen per FG"
expected_result: |
  1. Header 23 kolom dengan urutan dan nama persis seperti daftar di atas.
  2. FG muncul 1 baris per komponen; kolom header dokumen dan FG diulang di tiap baris.
  3. Total Qty Need = qty BOM × qty FG (AS-69C1F60D: 6 dan 2; AS-6A475993: 10 dan 5); Unit Component sesuai satuan komponen.
  4. Outbound Code dan Outbound Date terisi kode Other Outbound (OT-…) dokumen tersebut; format tanggal dd-mm-yyyy hh:mm:ss.

  [CATATAN QA] Untuk dokumen yang FG-nya berunit non-dasar (Box), Total Qty Need (qty BOM × qty dokumen) tidak sama dengan qty Other Outbound; itu dicakup TC ETM-16655 dan card Error ETM-16659.
test_result:
  status: passed
  started_at: "2026-10-20T13:25:20+07:00"
  finished_at: "2026-10-20T13:27:00+07:00"
  executed_by: "Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "Header 23 kolom persis; 323 grup FG multi-komponen, 0 yang kolom header/FG-nya berbeda antar baris; Total Qty Need = qty BOM × qty FG di 984 dari 984 baris, Unit Component sesuai 984 dari 984; Outbound Code terisi 612 baris (semua pola OT-), semua kolom tanggal dd-mm-yyyy hh:mm:ss, 415 baris tanpa outbound berisi '-'; AS-69C1F60D dan AS-6A475993 cocok dengan Other Outbound-nya."
  report_url: "https://drive.google.com/drive/folders/1FiRHXzj6plZOi2013lXV1vPSmyXgTsEI"
test_data_used:
  - "AS-69C1F60D"
  - "AS-6A475993"
run_history:
  - at: "2026-10-20"
    status: passed
    environment: staging
    note: "Passed: 23 kolom, grain FG × komponen, Total Qty Need = qty BOM × qty FG (984/984 baris), Outbound Code/Date terisi. Data persis di card tidak ada di staging, dipakai dokumen berstruktur sama."
origin_jira: ETM-16651
first_execution:
  at: "2026-10-20"
  via: "manual:Bugsy"
  jira: ETM-16651
last_execution:
  at: "2026-10-20"
  jira: ETM-16651
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 20-10-2026 13:25-13:27 WIB, staging, company Dev Staging 13, login playwright@gmail.com, dokumen AS-69C1F60D dan AS-6A475993. Actual: header 23 kolom persis, satu baris per FG dan komponen dengan header FG diulang, Total Qty Need sama dengan qty BOM dikali qty FG di 984 dari 984 baris, Outbound Code dan Date terisi dengan format yang benar. Data persis di card tidak ada di staging sehingga dipakai dokumen berstruktur sama. Ditutup passed."
---

# Export Assembly With Details — 23 kolom, 1 baris per FG × komponen

Card: [ETM-16651](https://erpintegration.atlassian.net/browse/ETM-16651) (Test Case, happy) · card asal: [ETM-16645](https://erpintegration.atlassian.net/browse/ETM-16645)

## Retest cepat
1. Staging, company **Dev Staging (13)** → **Assembly** → Export → Export → **With Details** → unduh xlsx.
2. Cek 23 kolom; cari AS-69C1F60D (2 baris: Total Qty Need 6 dan 2, OT-69C1F71A) dan AS-6A475993 (10 dan 5, OT-6A475BAA).
3. Tiap FG: 1 baris per komponen, kolom 1–12 dan 19–23 sama di semua barisnya.

## Catatan QA

### Hasil 20-10-2026 (file 1.027 baris, 244 dokumen)
| Pemeriksaan | Hasil |
|---|---|
| Header 23 kolom, nama dan urutan | ✅ persis |
| Kolom header/FG identik antar baris satu FG | ✅ 323 grup multi-komponen, 0 berbeda; jumlah baris per FG = jumlah komponen di database |
| Total Qty Need = qty BOM × qty FG; Unit Component | ✅ 984 dari 984 baris |
| Outbound Code / Date | ✅ 612 baris terisi (OT-xxxxxxxx), tanggal dd-mm-yyyy hh:mm:ss di semua kolom tanggal; 415 baris tanpa outbound berisi "-" |

### Observasi
- Data persis di card (FG qty 10, komponen 2 dan 1 per FG) tidak ada di staging; dipakai dua dokumen approved berstruktur sama. Contoh Merdian (AS-6ABF820B) tidak diuji.
- FG berunit Box: Total Qty Need dan Unit FG tidak sejalan dengan Other Outbound (ETM-16655, card Error ETM-16659).
- Evidence (teks): https://drive.google.com/drive/folders/1FiRHXzj6plZOi2013lXV1vPSmyXgTsEI
