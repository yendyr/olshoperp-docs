---
doc_type: e2e-test-case
tc_code: TC-FS-002
menu: supplychain-failed-ship
menu_name: "Failed Ship"
test_type: edge
title: "Edge: Export All filter tanpa hasil menampilkan pesan tanpa mengunci user, dan tepat 25.000 baris diterima (ETM-16660)"
summary: "Filter Failed Ship tanpa hasil menampilkan There is no data to export. tanpa membuat record export dan export berikutnya langsung diterima; tepat 25.000 baris diterima (5 file x 5.000 baris dalam ZIP) dibuktikan dari kode karena data tidak ada."
status: draft
owner: QA - Yemima
last_updated: 2026-10-21
requirement_ref: "qa-docs/supplychain-failed-ship/requirement.md; card ETM-16698, origin ETM-16660 (Improvement: Optimize Export All, batas 25.000 baris dan 5.000 baris per file)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-transaction-history
preconditions:
  - "Login staging dengan akun yang punya akses Failed Ship dan Export; company aktif Dev Staging (13)"
  - "Perubahan ETM-16660 sudah ter-deploy di Staging (backend commit 5bc72b9e4, PR 6577)"
test_data:
  - field: data_uji
    value: "Filter kosong: kata cari yang tidak ada (ZZZNODATA99); filter dengan data: tanpa filter (1.431 order)"
steps:
  - "Buka Supply Chain, Failed Ship; isi pencarian dengan kata yang tidak ada hasilnya"
  - "Klik Export lalu Export Without Details; catat pesan dan cek tidak ada record baru"
  - "Kosongkan pencarian dan langsung Export Without Details lagi; catat hasil"
  - "Untuk tepat 25.000 baris: baca FailedShipController::exportAllExcel, FailedShipExportJob, ZipOrMoveExportJob (bukti dari kode)"
expected_result: |
  1. Filter kosong: pesan There is no data to export.; tidak ada record export baru.
  2. Export berikutnya langsung bisa jalan (tidak muncul pesan export sedang berjalan).
  3. Tepat 25.000 baris diterima; hasil ZIP berisi 5 file x 5.000 baris.
test_result:
  status: passed
  started_at: "2026-10-21T17:01:00+07:00"
  finished_at: "2026-10-21T17:26:00+07:00"
  executed_by: "Bugsy (Claude) atas permintaan Yemima; login playwright-user"
  environment: staging
  log_summary: "Staging: filter kosong ditolak There is no data to export. (3 kali) tanpa record baru; export dengan data langsung diterima (200). Tepat 25.000 baris dibuktikan dari kode: penolakan hanya bila lebih dari 25.000; file_count = ceil(25.000 / 5.000) = 5; ZIP dibuat ZipOrMoveExportJob bila lebih dari 1 file."
  report_url: "https://drive.google.com/drive/folders/1_fB8bx7xjgfbfsXOni4OsMiQay0CUZen"
test_data_used:
  - "Dev Staging tanpa filter (1.431 order Failed Ship)"
run_history:
  - at: "2026-10-21"
    status: passed
    environment: staging
    note: "Passed; filter kosong dan export berikutnya teruji di staging, tepat 25.000 baris dibuktikan dari kode atas keputusan QA Lead karena data tidak ada."
origin_jira: ETM-16698
first_execution:
  at: "2026-10-21"
  via: "manual:Bugsy"
  jira: ETM-16698
last_execution:
  at: "2026-10-21"
  jira: ETM-16698
  status: passed
  via: "manual:Bugsy"
  notes: "Dieksekusi manual oleh Claude (peran Bugsy) 21-10-2026 17:01-17:26 WIB di staging company Dev Staging 13: filter kosong menampilkan pesan tanpa record dan export berikutnya diterima, tepat 25000 baris dibuktikan dari kode atas keputusan QA Lead, hasil Passed."
---

# Export All Failed Ship: hasil kosong dan batas tepat 25.000 baris

Card: [ETM-16698](https://erpintegration.atlassian.net/browse/ETM-16698) (Test Case, edge) · card asal: [ETM-16660](https://erpintegration.atlassian.net/browse/ETM-16660)

## Retest cepat
1. Staging, Dev Staging (13), Failed Ship: cari kata yang tidak ada, Export Without Details: There is no data to export.
2. Kosongkan pencarian dan export lagi: diterima.
3. Tepat 25.000 baris: hanya lebih dari 25.000 yang ditolak; 5 file x 5.000 baris dalam ZIP (kode).

## Catatan QA

### Hasil run Bugsy 21-10-2026 (WIB)
| Langkah | Hasil | |
|---|---|---|
| Filter tanpa hasil | There is no data to export.; tanpa record baru (3 kali dicoba) | ✅ |
| Export dengan data langsung sesudahnya | diterima (200), tidak ada pesan export berjalan | ✅ |
| Tepat 25.000 baris | dibuktikan dari kode: diterima, 5 file x 5.000 baris, ZIP oleh ZipOrMoveExportJob | ✅ (kode) |

### Observasi
- Tepat 25.000 baris tidak pernah dijalankan lewat layar; data terbanyak 12.017 order (Merdian).
- Evidence (teks): https://drive.google.com/drive/folders/1_fB8bx7xjgfbfsXOni4OsMiQay0CUZen
