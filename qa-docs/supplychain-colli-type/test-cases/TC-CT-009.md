---
doc_type: e2e-test-case
tc_code: TC-CT-009
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Delete Colli Type yang belum dipakai — soft delete dan Show deleted already deleted"
summary: "Type tanpa Multisku Colli bisa dihapus; Show deleted menampilkan baris already deleted."
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
  - "Ada Colli Type yang belum dipakai Colli code (boleh create type khusus untuk TC ini)."
  - "User punya privilege delete Colli Type."
  - "URL list: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Colli Type (belum dipakai)"
    value: "(isi Code + URL edit saat run)"
steps:
  - "Buka datalist https://staging.olshoperp.com/supplychain/colli-type"
  - "Pastikan type target belum dipakai Colli code."
  - "Klik Delete pada baris tersebut."
  - "Pastikan type hilang dari list default."
  - "Aktifkan Show deleted."
  - "Cari type yang baru dihapus."
expected_result: |
  Soft delete berhasil (requirement §3, §6.2, §6.4 kasus 6, AC CT-04).
  **Show deleted** menampilkan baris dengan keterangan *already deleted*.
  Audit soft delete → TC-CT-015.
test_result:
  status: failed
  started_at: "2026-08-14 12:40"
  finished_at: "2026-08-14 12:41"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    FAIL copy Show deleted — soft delete unused CT-QA-01 (edit/1) sukses. Toast "The data has been success deleted". Hilang dari list default.
    Show deleted ON: CT-QA-01 muncul; kolom Action = link "Deleted" → /supplychain/colli-type/edit/1.
    Expected keterangan: already deleted.
    Error card: ETM-15547. Relates ETM-15543 (RE-OPEN). Assignee Faisal Bahari.
  report_url: null
test_data_used:
  - field: "Colli Type (belum dipakai)"
    value: "CT-QA-01 / Box Persist Check — edit/1 (soft deleted)"
  - field: "Error card"
    value: "ETM-15547"
run_history:
  - at: "2026-08-14 12:41"
    status: pass
    by: "QA - Yemima (Playwright MCP) — soft delete OK; label Deleted vs already deleted"
  - at: "2026-08-14 14:41"
    status: fail
    by: "QA - Yemima — filed ETM-15547 (copy Show deleted), ETM-15543 RE-OPEN"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 14:41"
  jira: "ETM-15547"
  status: failed
  via: "legacy:test_result"
---

# TC-CT-009

## Catatan QA

Card improvement: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) (RE-OPEN).
Error Show deleted: [ETM-15547](https://erpintegration.atlassian.net/browse/ETM-15547) — assign Faisal Bahari.
Jangan pakai type Default ON satu-satunya kecuali sudah ada default pengganti.
