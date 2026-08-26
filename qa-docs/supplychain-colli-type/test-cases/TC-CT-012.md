---
doc_type: e2e-test-case
tc_code: TC-CT-012
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: permission
title: "Show Public Data ON di company B — Colli Type public milik A muncul dengan owner A"
summary: "Jika B allow data dari A, type public milik A tampil di datalist B; owner tetap company A."
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
  - generalsetting-internal-company
    menu_name: "Internal Company"
    role: involved
    note: "Section Show Public Data — toggle allow lihat public data company A"
preconditions:
  - "Lanjutan TC-CT-011: company A punya Colli Type Show for all company ON (contoh CT-PUB-A)."
  - "User login: playwright@gmail.com / 12345678. Bisa switch A (FAT 112) dan B (contoh lumicharmsid 153)."
  - "URL Internal Company B: https://staging.olshoperp.com/generalsetting/internal-company/edit/{id-company-B}"
  - "URL Colli Type: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Company A"
    value: "FAT (112)"
  - field: "Company B"
    value: "lumicharmsid (153) — ganti jika perlu"
  - field: "Code (milik A)"
    value: "CT-PUB-A (sama dengan TC-CT-011)"
  - field: "Show Public Data (B → A)"
    value: "ON"
steps:
  - "Di company B, buka Internal Company edit B → section **Show Public Data**."
  - "Nyalakan toggle untuk company A (tooltip: Enable this toggle to display all publicity data from {nama A} on each related form)."
  - "Tetap di company B. Buka https://staging.olshoperp.com/supplychain/colli-type"
  - "Cari Code milik A."
  - "Cek kolom datalist: Code/Name/Description/Default Data/Active sama dengan data A, bukan null."
  - "Cek owner: data milik company A (bukan B) — dari kolom owner jika ada, atau dari form edit (owned_by / company A)."
  - "Buka edit baris tersebut dari company B (jika bisa dibuka)."
  - "Opsional: matikan lagi Show Public Data B→A, reload datalist B — baris A hilang kembali (konsisten TC-CT-011)."
expected_result: |
  Setelah B allow A di **Show Public Data**: Colli Type public milik A **muncul** di datalist B.
  Owner tetap **company A**. Code/Name/Description/Default Data/Active sama dengan yang diinput di A, bukan null / bukan ter-copy jadi milik B.
  [CATATAN QA] Requirement Colli Type §5 tidak merinci kolom owner di datalist. Identity owner = company A mengikuti feedback user ETM-15543 + pola master SCM + Internal Company Show Public Data.
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

# TC-CT-012

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Relates TC-CT-011. Setelah tes, kembalikan toggle Show Public Data B→A ke OFF agar tidak mengotori datalist B.
