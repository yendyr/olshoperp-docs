---
doc_type: e2e-test-case
tc_code: TC-CT-013
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: edge
title: "Active OFF boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci"
summary: "Jika Purchase Inbound dihapus dan Colli code ikut hilang (termasuk yang already deleted), type bisa di-Inactive meski ada history di DB."
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
    note: "Hapus inbound Draft/Open/Rejected agar Colli code baru ikut hilang (jangan Approve)"
preconditions:
  - "Lanjutan TC-CT-007: type pernah dipakai New Colli di inbound yang **belum Approve**."
  - "User login: playwright@gmail.com / 12345678. Company FAT (112)."
  - "User bisa delete inbound Draft/Open/Rejected."
  - "URL inbound edit (dari TC-CT-007) dan URL Colli Type edit tersedia."
test_data:
  - field: "Colli Type"
    value: "(sama dengan TC-CT-007)"
  - field: "Purchase Inbound"
    value: "(URL edit inbound yang masih Draft/Open/Rejected)"
  - field: "Colli code"
    value: "(code yang akan hilang setelah inbound dihapus)"
steps:
  - "Buka URL edit inbound dari TC-CT-007. Pastikan status bukan Approved."
  - "Hapus inbound (Delete header)."
  - "Buka https://staging.olshoperp.com/supplychain/multisku-colli — pastikan Colli code sudah tidak ada di list default."
  - "Aktifkan Show deleted di Multisku Colli (jika ada). Pastikan tidak ada Colli code hidup yang masih terikat type ini. Relasi soft-deleted tidak dihitung sebagai ‘dipakai’."
  - "Buka edit Colli Type."
  - "Matikan Active (Active OFF) lalu simpan."
  - "Reload edit + datalist: kolom Active = OFF (bukan null)."
expected_result: |
  Setelah inbound dihapus dan **tidak ada Colli code tersisa** (termasuk yang already deleted), type **boleh** Active OFF.
  History/audit di DB **tidak** mengunci Inactive.
  Pesan EN §7 **tidak** muncul.
  [CATATAN QA] Requirement Colli Type §6.2 mendefinisikan “dipakai” = ada Multisku Colli dengan type ini. Feedback user ETM-15543: colli yang sudah terhapus (ikut delete inbound, belum Approve) tidak dihitung relasi. SOT Colli v2: Delete inbound Draft/Open/Rejected menghapus Colli code baru yang belum pernah Approve.
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

# TC-CT-013

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Relates TC-CT-007. Jika inbound sudah Approve, Colli code permanen (SOT Colli v2) — TC ini tidak berlaku; buat inbound baru Draft saja.
