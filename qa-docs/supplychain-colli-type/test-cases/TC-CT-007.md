---
doc_type: e2e-test-case
tc_code: TC-CT-007
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Active OFF ditolak jika Colli Type sudah dipakai Colli code dari New Colli inbound"
summary: "Setelah New Colli di Purchase Inbound memakai type ini, Active OFF ditolak selama Colli code masih ada."
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
  - "Ada Colli Type Active (boleh hasil create TC sebelumnya). Catat Code + URL edit."
  - "Ada Purchase Inbound Draft/Open dengan Location Destination terisi — jangan Approve (supaya Colli code masih bisa dihapus di TC lanjutan)."
  - "URL Colli Type: https://staging.olshoperp.com/supplychain/colli-type"
  - "URL inbound: https://staging.olshoperp.com/supplychain/new-purchase-inbound"
test_data:
  - field: "Colli Type"
    value: "(isi Code + URL edit saat run)"
  - field: "Purchase Inbound"
    value: "(isi code + URL edit saat run)"
  - field: "Colli code"
    value: "(isi code setelah New Colli)"
steps:
  - "Buka Purchase Inbound Draft/Open (catat URL edit). Pastikan Location Destination terisi."
  - "Pilih SKU di detail → **New Colli** → **Choose Colli Type** = type under test."
  - "Simpan inbound. Catat Colli code yang tergenerate."
  - "Buka https://staging.olshoperp.com/supplychain/multisku-colli — pastikan Colli code ada dan terikat type tersebut."
  - "Buka edit Colli Type (URL edit)."
  - "Matikan Active (Active OFF) lalu simpan."
expected_result: |
  Relasi “dipakai” terbentuk lewat **New Colli** di Purchase Inbound (requirement Colli Type §6.2; inbound § Choose Colli Type).
  Save Active OFF ditolak. Pesan EN (requirement §7, §6.4 kasus 4, AC CT-03):
  *This Colli Type cannot be set to Inactive because it is already used by one or more Colli codes. Keep it Active, or create a new Colli Type for future use.*
  Type tetap Active ON selama Colli code masih ada.
  Lanjutan setelah inbound + Colli code dihapus → TC-CT-013.
test_result:
  status: fail
  started_at: "2026-08-14 12:32"
  finished_at: "2026-08-14 12:37"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    FAIL — lock “dipakai Colli code” tidak jalan; pesan expected tidak muncul.
    Setup: inbound baru IN-5U4F3GSR (edit/130307), Draft, Location Gudang Tanrise FAT DROPOFF, SKU-ILYASTEST, New Colli + type preselect PLT | Pallet → COL-6A7EA8FB. Multisku Colli: COL-6A7EA8FB | IN-5U4F3GSR | PLT | Pallet. Inbound tidak di-Approve.
    Attempt 1 (PLT masih Default ON): Active OFF → reject "Default Colli Type cannot be inactive." Bukan pesan used-by-colli.
    Attempt 2: BOX di-set Default ON (demote PLT), lalu PLT Active OFF → toast "The data has been success updated". Active jadi OFF padahal COL-6A7EA8FB masih ada.
    Expected EN: "This Colli Type cannot be set to Inactive because it is already used by one or more Colli codes. Keep it Active, or create a new Colli Type for future use."
    Post-run: Active PLT di-ON-kan lagi supaya TC-008/010/013 masih punya type Active yang dipakai.
  report_url: null
test_data_used:
  - field: "Colli Type"
    value: "PLT / Pallet — https://staging.olshoperp.com/supplychain/colli-type/edit/3"
  - field: "Purchase Inbound"
    value: "IN-5U4F3GSR — https://staging.olshoperp.com/supplychain/new-purchase-inbound/edit/130307"
  - field: "Colli code"
    value: "COL-6A7EA8FB (Multisku Colli, type PLT | Pallet)"
  - field: "SKU"
    value: "SKU-ILYASTEST / Testing- Baju"
run_history:
  - at: "2026-08-14 12:37"
    status: fail
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:37"
  jira: ETM-15543
---

# TC-CT-007

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Wajib lewat transaksi **New Purchase Inbound** + **New Colli**, bukan insert DB. Jangan Approve inbound di TC ini.
