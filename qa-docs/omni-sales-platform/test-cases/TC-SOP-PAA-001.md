---
doc_type: e2e-test-case
tc_code: TC-SOP-PAA-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: regression
title: "Prevent Auto Approve jadi YES saat detail SO Platform OPEN diedit (Unit Price / System SKU) + Audit Log old/new"
summary: "Edit Unit Price atau System SKU pada Sales Order Platform berstatus OPEN dengan Prevent Auto Approve awal NO; flag harus otomatis YES dan Audit Log mencatat old/new."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-16
requirement_ref: "qa-docs/omni-sales-platform/requirement.md §6.8 / V-ED-08; regresi ETM-16073"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
  label: "Lumi Charms.id"
preconditions:
  - "Login staging playwright@gmail.com, company Lumi Charms.id (153)"
  - "Ada SO Platform transaction_status=open, prevent_auto_approve=0 (NO), can_update=true"
  - "Fixture card FAT SO-5UJG3O8J boleh diganti SO OPEN setara di company uji"
test_data:
  - field: so_scenario_a
    value: "SO-5TIG7RSL / 2476013 (OPEN, Prevent NO → edit Unit Price)"
  - field: so_scenario_b
    value: "SO-5THPVOVY / 2475072 (OPEN, Prevent NO → ganti System SKU)"
  - field: qa_label
    value: "QA-AUTO ETM-16115, 16-10-2026 — jangan hapus data"
steps:
  - "Buka Omni Channel → Dev - Sales Platform (/omni/sales-order); filter/cari SO OPEN dengan Prevent Auto Approve = NO"
  - "Buka edit SO; catat prevent_auto_approve awal (API/list = 0 / NO)"
  - "Skenario A: ubah kolom Price (Unit Price) pada 1 baris detail, Tab/blur agar inline save jalan"
  - "Reload; cek prevent_auto_approve = 1 (YES); buka Audit Log — old/new Each Price & Total/Amount"
  - "(Opsional) Skenario B pada SO OPEN lain masih Prevent NO: ganti System SKU, Save/commit; cek flag YES + Audit SKU"
expected_result: |
  1. Setelah edit detail SO Platform OPEN, Prevent Auto Approve = YES (prevent_auto_approve=1).
  2. Order tidak eligible auto-approve worker/jadwal karena flag YES.
  3. Audit Log mencatat field yang diubah dengan nilai lama dan nilai baru (contoh Each Price 3.500 → 3.501; SKU - → GLTAR-100ML).
test_result:
  status: passed
  started_at: "2026-10-16T08:54:00+07:00"
  finished_at: "2026-10-16T09:03:00+07:00"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "A: SO-5TIG7RSL Price 3500→3501, prevent 0→1, audit old/new OK. B: SO-5THPVOVY SKU -→GLTAR-100ML, prevent 0→1, audit OK."
  report_url: "https://drive.google.com/drive/folders/15b1U7kas9USdR9gFE0ZOkFskTVrTFUec"
test_data_used:
  - "SO-5TIG7RSL"
  - "SO-5THPVOVY"
  - "SKU GLTAR-100ML"
run_history: []
origin_jira: ETM-16115
first_execution:
  at: "2026-10-16"
  via: "manual:Bugsy"
  jira: "ETM-16115"
last_execution:
  at: "2026-10-16"
  jira: "ETM-16115"
  status: passed
notes: |
  - Card fixture menyebut company FAT; eksekusi user: Lumi Charms.id (153). SO OPEN setara dipakai.
  - Edit detail di UI Sales Platform bersifat inline (Tab/blur) — tombol Save header tidak selalu ada; yang ada Approve.
  - Kedua SO uji platform_order_status=CANCELLED tetapi transaction_status=open dan can_update=true; valid untuk TC flag.
  - Data uji tidak dihapus.
---

# TC-SOP-PAA-001 — Prevent Auto Approve on OPEN detail edit

## Retest cepat
1. Cari SO Platform **OPEN** + **Prevent Auto Approve = NO** di company 153 (atau FAT).
2. Edit **Price** detail → commit inline → flag harus **YES**; Audit Log old/new.
3. Opsional: SO lain, ganti **System SKU** → flag **YES** + audit.

## Evidence run 16-10-2026
Folder: https://drive.google.com/drive/folders/15b1U7kas9USdR9gFE0ZOkFskTVrTFUec

Jira: https://erpintegration.atlassian.net/browse/ETM-16115
