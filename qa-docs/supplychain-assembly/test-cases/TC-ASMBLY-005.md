---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-005
menu: supplychain-assembly
menu_name: "Assembly"
title: "Building Origin — WH level 20 (drop off) yang di-set sebagai WIP atau Finish Goods tidak muncul"
summary: "Drop off level 20 yang di-state sebagai WIP atau FG tidak boleh dipilih sebagai Building Origin."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/supplychain-assembly/requirement.md V-20, §4.5; qa-docs/supplychain-setting/requirement.md (WIP/FG)"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-setting
  - supplychain-warehouse-structure
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Ada WH level 20 (drop off) yang di Warehouse Setting di-set sebagai WIP, dan/atau sebagai Finish Goods."
  - "Role punya akses Assembly + Warehouse Setting."
test_data:
  - field: "UI fixture"
    value: "https://staging.olshoperp.com/supplychain/assembly"
  - field: "Field UI"
    value: "Building Origin"
  - field: "Warehouse Setting"
    value: "https://staging.olshoperp.com/supplychain/setting"
steps:
  - "Di Warehouse Setting, catat WH level 20 yang dipakai sebagai WIP dan/atau Finish Goods (nama + URL setting)."
  - "Buka https://staging.olshoperp.com/supplychain/assembly → Create."
  - "Buka dropdown Building Origin. Cari WH level 20 yang barusan di-set sebagai WIP."
  - "Ulangi untuk WH level 20 yang di-set sebagai Finish Goods (jika beda WH)."
  - "Jangan pilih WH itu. Catat muncul / tidak muncul di test_data_used."
expected_result: |
  WH level 20 yang di-state sebagai WIP warehouse atau Finish Goods warehouse tidak muncul di Building Origin.

  [CATATAN QA] Skenario 11 Jeiniffer = WH WIP/FG (level tidak disebut). TC ini = delta: **level 20 drop off** yang juga di-set sebagai WIP atau FG. Latar belakang [ETM-15519](https://erpintegration.atlassian.net/browse/ETM-15519): drop off yang bisa dipilih tidak boleh warehouse yang di-state sebagai WIP / finish goods.
  Requirement terdekat: V-20 Origin ≠ WIP; §4.5 WIP/FG bukan field user. Level 20 sebagai origin = TO-BE card; exclude WIP/FG tetap berlaku.
  Referensi: qa-docs/supplychain-assembly/requirement.md V-20, §4.5; qa-docs/supplychain-setting/requirement.md (mapping WIP/FG per building).
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
last_execution:
  at: null
  jira: null
---

## Catatan QA

Bukan duplikat skenario 11: 11 = WH yang *adalah* lokasi WIP/FG (umum). TC ini = **drop off level 20** yang di-assign sebagai WIP atau FG.
