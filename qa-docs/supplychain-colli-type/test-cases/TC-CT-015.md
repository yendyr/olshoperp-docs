---
doc_type: e2e-test-case
tc_code: TC-CT-015
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: cross-menu
title: "Audit Log mencatat create, update field, toggle Default/Active/Show for all company, dan soft delete"
summary: "Tiap aksi master Colli Type muncul di Audit Log (before/after), bukan hanya save sukses tanpa jejak."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - gate-global-audit-log
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Type under test **belum dipakai** Colli code (supaya Active OFF dan Delete lolos)."
  - "URL create: https://staging.olshoperp.com/supplychain/colli-type/create"
test_data:
  - field: "Code"
    value: "CT-AUD-01 (unik)"
  - field: "Name"
    value: "Audit Box"
  - field: "Description"
    value: "QA audit create"
  - field: "Description (setelah update)"
    value: "QA audit update"
steps:
  - "Create type: isi Code, Name, Description. Active ON, Show for all company OFF, Default sesuai kondisi company. Simpan."
  - "Buka edit → section Audit Log. Cek entri create: Code, Name, Description, default, active, Show for all company. Nilai sama dengan input, bukan null."
  - "Ubah Name dan Description. Simpan. Cek Audit Log before/after Name dan Description."
  - "Toggle Set as Default Data (ON atau OFF yang mengubah state). Simpan. Cek Audit Log toggle Default + efek demote jika ada."
  - "Toggle Show for all company ON lalu simpan. Cek Audit Log. Kembalikan OFF lalu simpan. Cek Audit Log lagi."
  - "Toggle Active OFF lalu simpan (type belum dipakai). Cek Audit Log Active ON→OFF."
  - "Kembalikan Active ON jika perlu, lalu Delete type. Buka Show deleted / edit deleted bila bisa. Cek Audit Log soft delete (siapa/kapan)."
expected_result: |
  Audit Log wajib mencatat (requirement §5.1, AC CT-05):
  - Create: Code, Name, Description, default, active, is_all_company — nilai sesuai input, bukan null.
  - Update field: before/after per field yang berubah.
  - Toggle Default: ON/OFF + demote default lain bila terjadi.
  - Toggle Active: ON/OFF.
  - Toggle Show for all company: ON/OFF.
  - Soft delete: siapa/kapan.
  Tidak cukup “save sukses” tanpa baris audit.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15543
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-CT-015

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Jangan pakai type yang masih terikat Colli code (itu TC-CT-007 / TC-CT-008). GAP-CT-05: implementasi audit belum dicek di workspace.
