<!-- AGENT: Copy ke docs/qa-docs/{menu-slug}/test-cases/TC-XXXX.md. Update test-cases/README.md menu terkait. -->

---
doc_type: e2e-test-case
tc_code: TC-XXXX-001
menu: {menu-slug}
menu_name: "{Menu Name}"
title: Judul lengkap testcase
summary: Ringkasan satu baris untuk datalist
status: draft
owner: QA - Yemima
last_updated: YYYY-MM-DD
requirement_ref: "§..."
automated: false
automated_spec: null
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: {menu-slug}
    menu_name: "{Menu Name}"
    role: primary
    note: Menu utama yang diuji
  - menu_slug: {other-menu-slug}
    menu_name: "{Other Menu}"
    role: involved
    note: Alasan menu ini terlibat
preconditions:
  - Kondisi awal 1
test_data:
  - field: Nama field
    value: Nilai di staging
steps:
  - Langkah 1
  - Langkah 2
expected_result: |
  Hasil yang diharapkan (bullet atau paragraf).
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
---

## Catatan QA

Opsional — penjelasan tambahan untuk manual tester.
