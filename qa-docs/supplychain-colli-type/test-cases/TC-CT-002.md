---
doc_type: e2e-test-case
tc_code: TC-CT-002
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: happy
title: "Create pertama Colli Type BOX — Default ON, Active ON, Show for all company OFF"
summary: "Jika company belum punya Colli Type, create Code BOX / Name Box tersimpan dengan Set as Default Data ON."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "User punya privilege create Colli Type."
  - "Company belum punya Colli Type sama sekali (atau pakai company/scope kosong) — requirement §6.1 create pertama."
  - "URL create: https://staging.olshoperp.com/supplychain/colli-type/create"
test_data:
  - field: "Code"
    value: "BOX"
  - field: "Name"
    value: "Box"
  - field: "Description"
    value: "(kosong / opsional)"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/colli-type/create"
  - "Isi Code = BOX, Name = Box. Description boleh kosong (opsional)."
  - "Jangan ubah Active dan Show for all company dari default (OFF)."
  - "Simpan form."
  - "Buka datalist https://staging.olshoperp.com/supplychain/colli-type — cari Code BOX."
  - "Cek kolom Default Data, Active, Code, Name sesuai input (bukan null)."
  - "Buka edit; cek Set as Default Data ON, Active ON, Show for all company OFF."
expected_result: |
  Type tersimpan. **Set as Default Data** / kolom **Default Data** = ON (create pertama, requirement §6.1 + §6.4 kasus 1).
  **Active** = ON; **Show for all company** = OFF (requirement §5, AC CT-01).
  Code + Name tampil di datalist dan edit sesuai input, bukan null (AC CT-01).
  Audit create → TC-CT-015.
test_result:
  status: blocked
  started_at: "2026-08-14 12:22"
  finished_at: "2026-08-14 12:23"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    BLOCKED — precondition create pertama tidak terpenuhi: FAT sudah punya CT-QA-01 dari TC-CT-001 (Default Yes).
    First-create auto Default ON sudah terbukti di TC-CT-001 (CT-QA-01).
    Tetap dijalankan steps: create Code BOX / Name Box, Default dibiarkan OFF, Active ON, Show for all company OFF.
    Save sukses → edit/2. Edit: Default OFF, Active ON, Show for all company OFF. Datalist BOX | Box | default No | active Yes.
    Perilaku sesuai SOT §6.1 create ke-2 (Default OFF), bukan expected TC ini (Default ON karena first create).
  report_url: null
test_data_used:
  - field: "Code"
    value: "BOX"
  - field: "Name"
    value: "Box"
  - field: "Set as Default Data"
    value: "OFF (form) → OFF after save"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "OFF"
  - field: "Edit URL"
    value: "https://staging.olshoperp.com/supplychain/colli-type/edit/2"
  - field: "Existing default (bukan BOX)"
    value: "CT-QA-01 Default Yes (edit/1)"
run_history:
  - at: "2026-08-14 12:23"
    status: blocked
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:23"
  jira: "ETM-15543"
  status: blocked
  via: "legacy:test_result"
---

# TC-CT-002

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). FAT mungkin sudah punya data — jika create pertama tidak memungkinkan, catat di log dan pakai company kosong / data unique, tanpa mengubah expected (requirement: first create = Default ON).

**Show for all company ON** + cek company B → TC-CT-011 / TC-CT-012.
