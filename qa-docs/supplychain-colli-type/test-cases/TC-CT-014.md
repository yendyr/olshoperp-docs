---
doc_type: e2e-test-case
tc_code: TC-CT-014
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Delete Colli Type boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci"
summary: "Jika Purchase Inbound dihapus dan Colli code ikut hilang (termasuk already deleted), type boleh di-Delete meski ada history di DB."
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
  - "Ada Colli Type yang pernah dipakai New Colli, lalu inbound + Colli code sudah dihapus (boleh lanjutan TC-CT-013, atau ulang alur TC-CT-008 lalu hapus inbound)."
  - "Tidak ada Colli code hidup maupun already deleted yang masih terikat type ini."
  - "User login: playwright@gmail.com / 12345678. Company FAT (112)."
  - "User punya privilege delete Colli Type."
  - "URL list: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Colli Type"
    value: "(Code + URL edit saat run)"
  - field: "Purchase Inbound (sudah dihapus)"
    value: "(catat code inbound yang dihapus)"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/multisku-colli — pastikan tidak ada Colli code (termasuk Show deleted) yang masih terikat type ini."
  - "Buka datalist Colli Type."
  - "Klik Delete pada type tersebut."
  - "Pastikan type hilang dari list default."
  - "Aktifkan Show deleted — baris *already deleted*."
expected_result: |
  Delete **berhasil** (soft delete) karena tidak ada relasi Colli code tersisa, termasuk yang already deleted.
  History/audit di DB **tidak** mengunci Delete.
  Pesan EN §7 **tidak** muncul.
  Show deleted = *already deleted* (requirement §3, AC CT-04).
  [CATATAN QA] Mirror TC-CT-013 untuk aksi Delete. Relates TC-CT-008.
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

# TC-CT-014

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Jangan pakai type Default ON satu-satunya. Jika TC-CT-013 sudah Active OFF, Delete tetap diuji di type yang sama (belum terhapus).
