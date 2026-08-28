---
doc_type: e2e-test-case
tc_code: TC-PI-005
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: happy
title: "Bulk Use — insert SKU ke colli existing vs create new colli code"
summary: "Saat inbound sudah punya colli, Bulk Use menawarkan insert ke colli existing atau create new; keduanya valid sesuai pilihan."
status: draft
owner: QA - Cursor
last_updated: 2026-08-20
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-colli-type
    menu_name: "Colli Type"
    role: involved
    note: "Master Choose Colli Type"
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Purchase Inbound Draft/Open dengan minimal satu colli code sudah terbentuk (COL-*)."
  - "Masih ada SKU outstanding di PO yang sama belum masuk inbound."
  - "URL edit inbound tersedia."
test_data:
  - field: "Colli existing"
    value: "(catat COL-* dari langkah setup)"
  - field: "SKU baru"
    value: "(outstanding PO, belum di colli existing)"
steps:
  - "Setup: inbound Open dengan SKU A sudah di colli COL-AAA (New Colli + Choose Colli Type)."
  - "Available Purchase Order → centang SKU B (outstanding) → **Bulk Use**."
  - "Pada prompt/modal colli (detail view atau Available PO modal): pilih **insert ke colli existing** COL-AAA → konfirmasi."
  - "Save All; verifikasi SKU A dan SKU B share Colli code COL-AAA."
  - "Ulangi dengan SKU C outstanding: Bulk Use → pilih **create new colli** → Choose Colli Type → konfirmasi."
  - "Verifikasi SKU C punya Colli code **berbeda** dari COL-AAA."
expected_result: |
  ETM-15528 catatan dev poin 6 dan 10:
  - Jika **belum ada** colli → sistem auto **create new colli code**.
  - Jika **sudah ada** colli dalam trx inbound → user dapat **insert ke existing colli** **atau** **create new colli code**.

  Setelah insert existing: multi-SKU dalam satu colli code.
  Setelah create new: colli code terpisah per kemasan.

  [CATATAN QA] Label tombol/modal exact (insert existing vs create new) ikuti UI staging — jangan parafrase alias.
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
origin_jira: ETM-15528
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

# TC-PI-DRAFT-20260820091828
