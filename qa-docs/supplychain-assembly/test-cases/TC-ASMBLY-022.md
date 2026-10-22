---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-022
menu: supplychain-assembly
menu_name: "Assembly"
test_type: edge
title: "Export Assembly (With dan Without Details) hanya menampilkan transfer dan outbound aktif, bukan yang sudah dihapus"
summary: "Dokumen Assembly yang transfer atau Other Outbound-nya pernah dihapus lalu dibuat ulang menampilkan hanya kode yang masih aktif di Transaction Ref dan Outbound Code pada export With maupun Without Details; dokumen tanpa outbound menampilkan '-' dengan kolom komponen tetap terisi dari BOM."
status: draft
owner: QA - Yemima
last_updated: 2026-10-20
requirement_ref: "qa-docs/supplychain-assembly/requirement.md §7.4a (Transaction Ref dan Outbound Code, ETM-16645); card ETM-16653 (gap screening: export membaca transfer/outbound terhapus)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-mutation-outbound
  - supplychain-mutation-transfer-internal
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses export Assembly (akun default E2E playwright@gmail.com); company aktif Dev Staging (13)"
  - "PR backend ETM-16645 (#6558 dan #6559) sudah merge dan server update backend Staging selesai (20-10-2026 11:21 WIB)"
  - "Ada dokumen Assembly yang transfer/outbound-nya pernah dihapus (di staging 57 dari 244 dokumen) dan dokumen Draft/Open tanpa Other Outbound"
test_data:
  - field: dokumen_tfi_terhapus
    value: "AS-6A978EFE: 1 TFI aktif (TFI-5UBDRC8C) + 6 TFI terhapus (TFI-5UBBV5SA dst.); OT aktif OT-5UBDRJD8"
  - field: dokumen_ot_terhapus
    value: "AS-6929587D (3 OT aktif: OT-69295908, OT-6929594F, OT-69295991; 5 OT terhapus: OT-692959B1, OT-692FBB85, OT-692FBBA3, OT-692FBBD6, OT-692FBBFD) dan AS-69DDC559 (2 OT aktif: OT-69DDC656, OT-69DE09DA; 12 OT terhapus)"
  - field: dokumen_tanpa_outbound
    value: "AS-6AACD8D8 (Draft, 2 FG) dan AS-6AB20798 (Open, 2 FG)"
steps:
  - "Login https://staging.olshoperp.com/login, lalu pastikan company aktif Dev Staging (13): klik avatar profil di topbar, pilih Switch Company, pilih Dev Staging, klik Proceed"
  - "Buka Assembly → Export → Export → With Details; unduh file setelah status 'Ready to Download'"
  - "Cari baris AS-6A978EFE, AS-6929587D, AS-69DDC559: catat Transaction Ref, Outbound Code, Outbound Date"
  - "Cocokkan kode tersebut di Stock Mutation → Other Outbound dan Transfer Internal: cari tiap kode di datalist (aktif harus muncul, terhapus tidak)"
  - "Ulangi export dengan pilihan 'Without Details' dan cek kolom Transaction Ref untuk dokumen yang sama"
  - "Cek baris dokumen Draft/Open tanpa outbound (AS-6AACD8D8, AS-6AB20798)"
expected_result: |
  1. AS-6A978EFE: Transaction Ref hanya TFI aktif (TFI-5UBDRC8C); Outbound Code OT-5UBDRJD8.
  2. AS-6929587D dan AS-69DDC559: Outbound Code tiap FG = OT yang aktif, bukan OT yang sudah dihapus.
  3. Tidak ada kode TFI atau OT yang sudah dihapus muncul di file (With maupun Without Details).
  4. Dokumen tanpa outbound: Outbound Code dan Outbound Date berisi "-"; kolom komponen tetap terisi dari BOM.

  [CATATAN QA] Contoh Merdian di card (AS-6ABF820B dan AS-6A4DF679) tidak tersedia di staging; dipakai dokumen staging setara.
test_result:
  status: passed
  started_at: "2026-10-20T13:27:49+07:00"
  finished_at: "2026-10-20T13:40:00+07:00"
  executed_by: "Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "Transaction Ref sama dengan transfer aktif di DB untuk 244 dari 244 dokumen di With dan di Without Details, 0 kode terhapus tampil; Outbound Code/Date sama dengan outbound aktif di 374 dari 374 FG; 415 baris tanpa outbound berisi '-' (komponen terisi di 372); di datalist Other Outbound dan Transfer Internal kode aktif 1 baris, kode terhapus 0 baris. 57 dari 244 dokumen punya transfer/outbound terhapus (212 mutasi)."
  report_url: "https://drive.google.com/drive/folders/1FQti9LAqHdzuLBTh0cAZtI97YO2gGBy7"
test_data_used:
  - "AS-6A978EFE"
  - "AS-6929587D"
  - "AS-69DDC559"
  - "AS-6AACD8D8"
  - "AS-6AB20798"
run_history:
  - at: "2026-10-20"
    status: passed
    environment: staging
    note: "Passed: 0 kode TFI/OT terhapus di kedua file (244 dokumen), Outbound Code/Date = outbound aktif (374/374 FG), dokumen tanpa outbound berisi '-'. Merdian tidak dipakai; dipakai dokumen staging setara."
origin_jira: ETM-16653
first_execution:
  at: "2026-10-20"
  via: "manual:Bugsy"
  jira: ETM-16653
last_execution:
  at: "2026-10-20"
  jira: ETM-16653
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 20-10-2026 13:27-13:40 WIB, staging, company Dev Staging 13, login playwright@gmail.com, dokumen AS-6A978EFE AS-6929587D AS-69DDC559 serta dua dokumen tanpa outbound. Actual: tidak ada kode transfer atau outbound terhapus di export With maupun Without Details untuk 244 dokumen, Outbound Code dan Date sama dengan outbound aktif di 374 dari 374 FG, dokumen tanpa outbound berisi strip dengan komponen tetap terisi. Merdian tidak dipakai. Ditutup passed."
---

# Export Assembly hanya menampilkan transfer/outbound aktif

Card: [ETM-16653](https://erpintegration.atlassian.net/browse/ETM-16653) (Test Case, edge) · card asal: [ETM-16645](https://erpintegration.atlassian.net/browse/ETM-16645)

## Retest cepat
1. Staging, company **Dev Staging (13)** → **Assembly** → Export → **With Details** dan **Without Details**.
2. AS-6A978EFE: Transaction Ref hanya TFI-5UBDRC8C. AS-6929587D: hanya OT-69295908, OT-6929594F, OT-69295991. AS-69DDC559: hanya OT-69DDC656 dan OT-69DE09DA.
3. Cari kode terhapus (mis. OT-69DDC5E0, OT-692959B1, TFI-5UBBV5SA) di datalist Other Outbound / Transfer Internal: 0 baris, dan tidak ada di file.

## Catatan QA

### Hasil 20-10-2026
| Pemeriksaan | Hasil |
|---|---|
| Transaction Ref vs transfer aktif di DB | ✅ 244 dari 244 dokumen (With dan Without Details); 0 kode terhapus |
| Outbound Code / Date vs outbound aktif | ✅ 374 dari 374 FG; 0 kode OT terhapus |
| Dokumen tanpa outbound | ✅ 415 dari 415 baris "-"; komponen terisi di 372 baris, "-" di 43 baris (dokumen tanpa FG/BOM) |
| Datalist Other Outbound / Transfer Internal | ✅ OT-69DDC656, OT-69295908, TFI-5UBDRC8C: 1 baris; OT-69DDC5E0, OT-692959B1, TFI-5UBBV5SA: 0 baris |

### Observasi
- 16 baris berstatus Approved tidak punya outbound di data staging (tercatat saja).
- 37 baris di 4 dokumen multi-FG menampilkan satu Outbound Code yang tidak memuat semua SKU komponennya (ETM-16655).
- Dokumen yang sudah dihapus masih bisa dibuka lewat URL langsung, tetapi tidak tampil di datalist.
- Evidence (teks): https://drive.google.com/drive/folders/1FQti9LAqHdzuLBTh0cAZtI97YO2gGBy7
