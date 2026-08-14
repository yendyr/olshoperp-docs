---
doc_type: e2e-test-case
tc_code: TC-CT-011
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Show for all company ON di company A — company B tidak melihat data jika Show Public Data OFF"
summary: "Colli Type public milik A tidak muncul di datalist B selama B tidak allow data dari A di Internal Company Show Public Data."
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
  - menu_slug: generalsetting-internal-company
    menu_name: "Internal Company"
    role: involved
    note: "Section Show Public Data — toggle allow lihat public data company lain"
preconditions:
  - "User login: playwright@gmail.com / 12345678. Bisa switch company A dan company B."
  - "Company A = FAT (id: 112). Company B = internal company lain di allowlist (contoh lumicharmsid id 153) yang playwright bisa akses."
  - "Di Internal Company edit **company B**, section **Show Public Data**: toggle untuk company A = **OFF** (default 0)."
  - "URL Internal Company B: https://staging.olshoperp.com/generalsetting/internal-company/edit/{id-company-B}"
  - "URL Colli Type: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Company A"
    value: "FAT (112)"
  - field: "Company B"
    value: "lumicharmsid (153) — ganti jika playwright tidak bisa switch"
  - field: "Code (milik A)"
    value: "CT-PUB-A (unik)"
  - field: "Name"
    value: "Public Box A"
  - field: "Show for all company"
    value: "ON"
  - field: "Show Public Data (B → A)"
    value: "OFF"
steps:
  - "Login company A (FAT). Buka https://staging.olshoperp.com/supplychain/colli-type/create"
  - "Isi Code + Name unik. Nyalakan Show for all company. Active ON. Simpan."
  - "Di datalist A, pastikan baris tampil: Code/Name/Show for all company sesuai input (bukan null)."
  - "Buka Internal Company edit company B → section **Show Public Data**."
  - "Pastikan toggle untuk company A **OFF**. Jika ON, matikan dulu."
  - "Switch company ke B. Buka https://staging.olshoperp.com/supplychain/colli-type"
  - "Cari Code milik A (CT-PUB-A). Jangan filter Show deleted."
expected_result: |
  Di company A: type tersimpan, **Show for all company** = ON, nilai field after save sama dengan input (requirement §5).
  Di company B, selama **Show Public Data** untuk company A = OFF: baris Colli Type milik A **tidak muncul** di datalist B — meskipun data A sudah public.
  [CATATAN QA] Requirement Colli Type §5 hanya menulis ON = terlihat/bisa dipakai company internal lain. Gate kedua (B harus allow A) mengikuti pola platform Internal Company **Show Public Data** (`gs_internal_company_show_public_data`) + feedback user ETM-15543. Tooltip UI: *Enable this toggle to display all publicity data from {company name} on each related form.*
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
---

# TC-CT-011

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Lanjutan allow ON → TC-CT-012 (pakai type yang sama).
