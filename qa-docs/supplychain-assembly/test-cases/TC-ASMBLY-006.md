---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-006
menu: supplychain-assembly
menu_name: "Assembly"
test_type: cross-menu
title: "Isolasi — filter Building Origin Assembly tidak bocor ke Transfer Internal / Transfer External"
summary: "Selector gudang TI dan TE tidak memakai filter Assembly (level 20 + exclude WIP/FG khusus Assembly)."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/supplychain-assembly/requirement.md A-11, §4.5; qa-docs/supplychain-mutation-transfer-internal/requirement.md; qa-docs/supplychain-mutation-transfer-external"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-mutation-transfer-internal
  - supplychain-mutation-transfer-external
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Role punya akses Assembly, Transfer Internal, Transfer External."
  - "Ada sampel WH: (a) level 20 drop off, (b) WH yang di Assembly tidak muncul karena WIP/FG belum set atau Inactive — untuk bandingkan selector."
test_data:
  - field: "Assembly"
    value: "https://staging.olshoperp.com/supplychain/assembly"
  - field: "Transfer Internal"
    value: "https://staging.olshoperp.com/supplychain/mutation-transfer-internal"
  - field: "Transfer External"
    value: "https://staging.olshoperp.com/supplychain/mutation-transfer-external"
steps:
  - "Catat di Assembly Create: WH mana yang muncul / tidak di Building Origin (pakai sampel dari checklist 15519)."
  - "Buka https://staging.olshoperp.com/supplychain/mutation-transfer-internal → Create. Buka selector warehouse origin (label UI persis di form)."
  - "Bandingkan: filter Assembly (wajib WIP+FG, boleh level 20, hide WIP/FG sebagai origin) tidak boleh jadi syarat yang sama di TI."
  - "Buka https://staging.olshoperp.com/supplychain/mutation-transfer-external → Create. Ulangi cek selector origin."
  - "Catat WH yang di Assembly disembunyikan tetapi di TI/TE tetap muncul (atau sebaliknya) di test_data_used."
expected_result: |
  Filter Building Origin Assembly (level 20 drop off + WIP/FG configured + exclude WH yang di-state WIP/FG) hanya berlaku di menu Assembly.
  Transfer Internal dan Transfer External memakai selector AS-IS menu itu — tidak diwajibkan WIP+FG seperti Assembly, dan tidak mewarisi hide-list Assembly.

  [CATATAN QA] Latar belakang [ETM-15519](https://erpintegration.atlassian.net/browse/ETM-15519): validasi khusus Assembly; jangan diimplementasi ke Transfer Internal / Transfer External / transaksi lain.
  Relasi menu Master Barang / laporan inventaris di deskripsi card = jejak AC COLLI — di luar TC ini.
  Referensi: qa-docs/supplychain-assembly/requirement.md A-11, §4.5; qa-docs/supplychain-mutation-transfer-internal/requirement.md.
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
origin_jira: ETM-15519
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Pakai label field **persis di UI** TI/TE (bukan mengarang "Building Origin" jika form itu memakai nama lain).
