---
doc_type: e2e-test-case
tc_code: TC-CT-010
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: edge
title: "Edit Code dan Name tetap boleh meskipun Colli Type sudah dipakai"
summary: "Type yang sudah punya Colli code masih bisa ganti Code/Name; nilai after save sama dengan input."
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
  - supplychain-new-purchase-inbound
    menu_name: "Purchase Inbound"
    role: involved
    note: "Precondition type sudah dipakai Colli code"
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Ada Colli Type yang sudah dipakai Colli code (requirement §6.2)."
  - "User punya privilege update Colli Type."
  - "URL list: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Code (baru)"
    value: "(isi saat run — unik per company)"
  - field: "Name (baru)"
    value: "(isi saat run)"
steps:
  - "Buka datalist https://staging.olshoperp.com/supplychain/colli-type"
  - "Buka edit type yang sudah dipakai (catat URL edit)."
  - "Ubah Code dan Name (tetap unik / terisi)."
  - "Simpan form."
  - "Cek datalist: Code/Name baru tampil sesuai input (bukan null)."
  - "Cek form edit: Code dan Name sama dengan yang baru diinput."
expected_result: |
  Save sukses. Code dan Name **boleh diubah** meski type sudah dipakai Colli code (requirement §5, §6.2, §6.4 kasus 7, AC CT-03).
  Nilai after save di datalist dan edit sama dengan input, bukan null.
  Audit before/after → TC-CT-015.
test_result:
  status: passed
  started_at: "2026-08-14 12:42"
  finished_at: "2026-08-14 12:54"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    PASS — PLT (edit/3) masih dipakai COL-6A7EA8FB. Ubah Code PLT → PLT-QA, Name Pallet → Pallet QA. Save All → "The data has been success updated". Edit form tetap PLT-QA / Pallet QA (bukan null).
  report_url: null
test_data_used:
  - field: "Code (baru)"
    value: "PLT-QA"
  - field: "Name (baru)"
    value: "Pallet QA"
  - field: "Edit URL"
    value: "https://staging.olshoperp.com/supplychain/colli-type/edit/3"
  - field: "Colli code (masih ada)"
    value: "COL-6A7EA8FB / IN-5U4F3GSR"
run_history:
  - at: "2026-08-14 12:54"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:54"
  jira: "ETM-15543"
  status: passed
  via: "legacy:test_result"
---

# TC-CT-010

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Jangan gabungkan steps Active OFF di TC ini — itu TC-CT-007.
