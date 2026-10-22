---
doc_type: e2e-test-case
tc_code: TC-CP-003
menu: businessdevelopment-category-price
menu_name: "Category Price"
test_type: edge
title: "Edge: Category Price lama yang punya store Others menampilkan Others kosong, dan Others terlepas otomatis saat Save berikutnya (ETM-16666)"
summary: "Category Price yang dibuat sebelum perbaikan dan punya store Others: datalist (Store List) dan Edit (Applied Store) tidak menampilkan Others; saat disimpan ulang store Others terlepas dari kategori dan tercatat di audit, store platform yang dikirim tetap tersimpan."
status: draft
owner: QA - Yemima
last_updated: 2026-10-21
requirement_ref: "qa-docs/businessdevelopment-category-price/requirement.md §1 (Basic Information, Applied Store tidak berubah) dan A-06 (Update to Pricelist); card ETM-16677, origin ETM-16666 (Improvement: Applied Store hanya store platform)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - businessdevelopment-pricelist-product
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun uji (playwright-user); company aktif Dev Staging (13)"
  - "Perbaikan ETM-16666 sudah ter-deploy di Staging (backend 2278d3b, frontend fcda1bc)"
  - "Ada Category Price lama dengan Applied Store berisi store Others (di run ini QA-AUTO-16650, id 63: Komi dan Cosmetics; tidak ada data campuran platform dan Others)"
test_data:
  - field: data_uji
    value: "Category Price QA-AUTO-16650 (id 63, Dev Staging) dengan store Others Komi (id 11) dan Cosmetics (id 105); store platform yang ditambahkan SH Display Store (id 187)"
steps:
  - "Login staging dan pastikan company aktif Dev Staging (13)"
  - "Buka datalist Category Price, cari QA-AUTO-16650, dan baca kolom Store List"
  - "Buka Edit kategori itu dan baca Applied Store"
  - "Ubah Description, tambahkan satu store platform, lalu klik Save All"
  - "Buka ulang Edit dan datalist; cek Applied Store dan Store List; cek di database tautan store (bd_pricelist_pivots) dan audit"
expected_result: |
  1. Datalist dan Edit hanya menampilkan store platform; store Others tidak tampil (Store List -, Applied Store kosong).
  2. Setelah Save, store Others terlepas dari kategori (tercatat di audit) dan store platform yang dikirim tetap ada.
  3. Pelepasan otomatis store Others saat Save adalah perilaku yang diharapkan (dikonfirmasi Lead QA 21-10-2026).
test_result:
  status: passed
  started_at: "2026-10-21T17:45:00+07:00"
  finished_at: "2026-10-21T18:14:00+07:00"
  executed_by: "Bugsy (Claude) atas permintaan Yemima; login playwright-user"
  environment: staging
  log_summary: "Datalist Store List -, Edit Applied Store kosong; Save 200; setelah reload hanya SH Display Store; tautan Komi dan Cosmetics soft delete 17:49:42, tautan SH Display Store dibuat; audit: Description updated, pivot created SH Display Store, pivot deleted Komi dan Cosmetics; setelah tes Description dikembalikan dan store dilepas."
  report_url: "https://drive.google.com/drive/folders/10sOUeTpCM-SyZNj55rhhl441sIieQAsb"
test_data_used:
  - "QA-AUTO-16650 (Category Price id 63, Dev Staging)"
run_history:
  - at: "2026-10-21"
    status: passed
    environment: staging
    note: "Passed; pelepasan otomatis store Others saat Save dikonfirmasi sesuai harapan oleh Lead QA (21-10-2026). Fixture hanya berisi Others dan tautan Others yang terlepas tidak bisa dipulihkan."
origin_jira: ETM-16677
first_execution:
  at: "2026-10-21"
  via: "manual:Bugsy"
  jira: ETM-16677
last_execution:
  at: "2026-10-21"
  jira: ETM-16677
  status: passed
  via: "manual:Bugsy"
  notes: "Dieksekusi manual oleh Claude (peran Bugsy) 21-10-2026 17:45-18:14 WIB di staging company Dev Staging 13 dengan kategori lama QA-AUTO-16650: Others tidak tampil di datalist dan Edit, terlepas otomatis saat Save dan tercatat di audit, hasil Passed (pelepasan otomatis Others dikonfirmasi Lead QA 21-10-2026)."
---

# Category Price lama dengan store Others (Applied Store)

Card: [ETM-16677](https://erpintegration.atlassian.net/browse/ETM-16677) (Test Case, edge) · card asal: [ETM-16666](https://erpintegration.atlassian.net/browse/ETM-16666)

## Retest cepat
1. Staging, company Dev Staging (13), Category Price, cari QA-AUTO-16650: Store List -.
2. Edit: Applied Store kosong; ubah Description, tambah satu store platform, Save All.
3. Buka ulang: hanya store platform; Others terlepas (cek audit).

## Catatan QA

### Hasil run Bugsy 21-10-2026 (WIB)
| Langkah | Hasil | |
|---|---|---|
| Datalist Store List | - | ✅ |
| Edit Applied Store | kosong (Choose Store) | ✅ |
| Save All (Description + store platform) | HTTP 200 | ✅ |
| Setelah reload | hanya SH Display Store | ✅ |
| Database | tautan Komi (id 58) dan Cosmetics (id 60) soft delete 17:49:42; tautan SH Display Store dibuat | ✅ |
| Audit | Description updated; pivot created SH Display Store; pivot deleted Komi; pivot deleted Cosmetics | ✅ |

### Observasi
- Lead QA mengonfirmasi (21-10-2026): pelepasan otomatis store Others saat Save sesuai harapan di card; dianggap Passed.
- Data lama hanya berisi Others (tanpa campuran); bagian store platform tetap ada diuji dengan menambah store platform di Save yang sama.
- Catatan Description kategori ini berbunyi jangan dihapus (data regresi ETM-16650): Description sudah dikembalikan, tetapi tautan Others yang terlepas tidak bisa dipulihkan dari layar dan kategori kini tanpa store.
- Evidence (teks): https://drive.google.com/drive/folders/10sOUeTpCM-SyZNj55rhhl441sIieQAsb
