---
doc_type: e2e-test-case
tc_code: TC-CT-008
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Delete ditolak jika Colli Type sudah dipakai Colli code dari New Colli inbound"
summary: "Setelah New Colli di Purchase Inbound memakai type ini, Delete type ditolak selama Colli code masih ada."
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
    note: "Sumber Colli code (Multisku Colli) yang memakai Colli Type — precondition sudah dipakai"
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Ada Colli Type yang sudah dipakai Colli code lewat **New Colli** di Purchase Inbound (boleh lanjutan TC-CT-007). Inbound jangan di-Approve."
  - "User punya privilege delete Colli Type."
  - "URL list: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Colli Type (sudah dipakai)"
    value: "(isi Code + URL edit saat run)"
  - field: "Purchase Inbound"
    value: "(isi code + URL edit saat run)"
  - field: "Colli code"
    value: "(isi code yang masih ada di Multisku Colli)"
steps:
  - "Pastikan Colli code masih ada di https://staging.olshoperp.com/supplychain/multisku-colli (belum dihapus)."
  - "Buka datalist https://staging.olshoperp.com/supplychain/colli-type"
  - "Pada baris type yang sudah dipakai, klik Delete (kolom Action)."
expected_result: |
  Delete ditolak. Pesan EN (requirement §7, §6.4 kasus 5, AC CT-03):
  *This Colli Type cannot be deleted because it is already used by one or more Colli codes.*
  Type tetap ada di datalist (bukan *already deleted*).
  Lanjutan setelah inbound + Colli code dihapus → TC-CT-014.
test_result:
  status: fail
  started_at: "2026-08-14 12:38"
  finished_at: "2026-08-14 12:40"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    FAIL copy — delete memang ditolak dan type tetap di datalist, tapi pesan bukan sentence Colli Type.
    Delete PLT (dipakai COL-6A7EA8FB / IN-5U4F3GSR) → modal "Are you sure?" → Delete.
    Toast: "This data already have relations". Type masih tampil (Default No, Active Yes).
    Expected EN: "This Colli Type cannot be deleted because it is already used by one or more Colli codes."
    Error card: ETM-15546. Relates ETM-15543 (RE-OPEN). Assignee Faisal Bahari.
  report_url: null
test_data_used:
  - field: "Colli Type (sudah dipakai)"
    value: "PLT / Pallet — edit/3"
  - field: "Purchase Inbound"
    value: "IN-5U4F3GSR — edit/130307"
  - field: "Colli code"
    value: "COL-6A7EA8FB"
  - field: "Pesan UI aktual"
    value: "This data already have relations"
  - field: "Error card"
    value: "ETM-15546"
run_history:
  - at: "2026-08-14 12:40"
    status: fail
    by: "QA - Yemima (Playwright MCP)"
  - at: "2026-08-14 14:41"
    status: fail
    by: "QA - Yemima — filed ETM-15546, ETM-15543 RE-OPEN"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 14:41"
  jira: ETM-15546
---

# TC-CT-008

## Catatan QA

Card improvement: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) (RE-OPEN).
Error copy Delete: [ETM-15546](https://erpintegration.atlassian.net/browse/ETM-15546) — assign Faisal Bahari.
Relasi harus dari transaksi inbound, sama seperti TC-CT-007. Jangan Approve inbound.
Code type saat run Delete = **PLT**; setelah TC-CT-010 jadi **PLT-QA** (URL tetap edit/3).
