---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-006
menu: system-product
menu_name: "System Product"
title: "Import New — Single-eligible + Default ON → parent -(PARENT) + child = SKU file"
summary: "Happy path Import New (bukan Update). Row tanpa variant eksplisit, bukan parent row lain, jadi Variant Default sama create manual."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Import create V-03"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON (GAP-VAR-01). Dropdown Import → **New Product**. Download template New."
  - "SKU di file belum ada di company. Skip/explicit/Type=single/Default OFF → DRAFT TC-SYSPROD-022+."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "New Product"
  - field: "SKU row"
    value: "ETM15495-IMPNEW-{stamp}"
  - field: "Variant Type / Option / Parent"
    value: "kosong (kandidat Single)"
steps:
  - "Import → New Product. Isi 1 row: SKU + kolom wajib. Jangan isi Variant Type/Option. Jangan pakai Type `single` jika kolom Type ada — biarkan blank atau path Single-eligible sesuai template staging."
  - "Jangan jadikan SKU ini Parent di row lain. Submit. Tunggu progress + cek import log."
  - "Datalist + edit: catat parent SKU, child SKU, Enable Variations, Default group."
expected_result: |
  Import sukses (bukan blank / bukan ditolak sebagai Single invalid karena Default).
  Parent = `{sku}-(PARENT)`. Child = `{sku}` tanpa suffix opsi Default. Variations ON + Default group terpasang.
  Sama pola create manual (DRAFT TC-SYSPROD-004 / V-01).

  [CATATAN QA] TO-BE §6.3.1 tabel **Import create**. AS-IS Type `single` ditolak (lihat DRAFT TC-SYSPROD-024). Jangan campur skip explicit/parent-used di file ini.
  Referensi: requirement §6.3.1; [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495) AC Import Single-eligible.
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
origin_jira: ETM-15495
jira_key: ETM-15556
last_execution:
  at: null
  jira: null
---

## Catatan QA

Port ETM-15512 TC-03. Family Import New: `TC-SYSPROD-022` dst. Import Update = `TC-SYSPROD-027` dst.
