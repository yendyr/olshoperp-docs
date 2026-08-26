---
doc_type: e2e-test-case
tc_code: TC-CT-004
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Set as Default Data ON pada type baru — default lama otomatis OFF"
summary: "Hanya 1 Default Data ON per company; set PLT Default ON membuat BOX Default OFF."
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
  - "Ada type A dengan Default Data ON (contoh BOX) dan type B dengan Default OFF (contoh PLT)."
  - "URL list: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Type A (default lama)"
    value: "BOX / Box"
  - field: "Type B (akan di-set Default ON)"
    value: "PLT / Pallet"
steps:
  - "Buka datalist https://staging.olshoperp.com/supplychain/colli-type — catat type yang Default Data ON."
  - "Buka edit type B (PLT)."
  - "Nyalakan Set as Default Data."
  - "Simpan form."
  - "Kembali ke datalist; cek Default Data type A dan type B (nilai ON/OFF tampil, bukan null)."
expected_result: |
  Maksimal **1** Default Data ON per company. Type B = ON; type A dipaksa **OFF** (requirement §6.1, §6.4 kasus 3, §7 Set Default ON, AC CT-02).
  Audit toggle Default → TC-CT-015.
test_result:
  status: passed
  started_at: "2026-08-14 12:28"
  finished_at: "2026-08-14 12:29"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    PASS — Type A default lama = CT-QA-01 (bukan BOX; BOX Default sudah No). Type B = PLT.
    Edit PLT (edit/3) nyalakan Set as Default Data → Save All → "The data has been success updated".
    Datalist: PLT default Yes; CT-QA-01 default No (demote); BOX default No. Hanya 1 Default Yes.
  report_url: null
test_data_used:
  - field: "Type A (default lama)"
    value: "CT-QA-01 / Box Persist Check — edit/1 (sebelumnya Yes, sesudah No)"
  - field: "Type B (set Default ON)"
    value: "PLT / Pallet — edit/3 (sesudah Yes)"
  - field: "BOX"
    value: "tetap Default No (bukan type A di run ini)"
run_history:
  - at: "2026-08-14 12:29"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:29"
  jira: "ETM-15543"
  status: passed
  via: "legacy:test_result"
---

# TC-CT-004

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Setelah run, catat URL edit type A dan type B di `test_data_used`.
