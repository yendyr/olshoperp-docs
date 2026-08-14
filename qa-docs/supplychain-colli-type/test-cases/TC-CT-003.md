---
doc_type: e2e-test-case
tc_code: TC-CT-003
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Create kedua Colli Type PLT / Pallet tanpa Set as Default Data — Default OFF"
summary: "Create type ke-2 tanpa set default: Default Data tetap OFF."
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
  - "Sudah ada minimal 1 Colli Type di company (hasil TC create pertama atau data existing)."
  - "URL create: https://staging.olshoperp.com/supplychain/colli-type/create"
test_data:
  - field: "Code"
    value: "PLT"
  - field: "Name"
    value: "Pallet"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/colli-type/create"
  - "Isi Code = PLT, Name = Pallet."
  - "Jangan nyalakan Set as Default Data."
  - "Simpan form."
  - "Buka datalist; cek kolom Default Data untuk Code PLT."
expected_result: |
  Type PLT / Pallet tersimpan dengan **Default Data OFF** (requirement §6.1 create ke-2 dst. tanpa set default; §6.4 kasus 2).
  Active tetap default ON kecuali diubah user (requirement §5).
test_result:
  status: pass
  started_at: "2026-08-14 12:23"
  finished_at: "2026-08-14 12:28"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    PASS — FAT sudah punya CT-QA-01 (Default Yes) + BOX. Create PLT / Pallet tanpa Set as Default Data.
    Save sukses → edit/3. Edit: Default OFF, Active ON, Show for all company OFF.
    Datalist: PLT default No / active Yes; BOX default No; CT-QA-01 default Yes (tetap satu default).
  report_url: null
test_data_used:
  - field: "Code"
    value: "PLT"
  - field: "Name"
    value: "Pallet"
  - field: "Set as Default Data"
    value: "OFF"
  - field: "Active"
    value: "ON"
  - field: "Edit URL"
    value: "https://staging.olshoperp.com/supplychain/colli-type/edit/3"
  - field: "Existing default"
    value: "CT-QA-01 Default Yes"
run_history:
  - at: "2026-08-14 12:28"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:28"
  jira: ETM-15543
---

# TC-CT-003

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Jika Code `PLT` sudah ada, pakai code unik lalu catat di `test_data_used` — expected Default OFF tidak berubah.
