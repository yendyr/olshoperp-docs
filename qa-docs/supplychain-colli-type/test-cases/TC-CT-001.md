---
doc_type: e2e-test-case
tc_code: TC-CT-001
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: happy
title: "Create Colli Type — datalist kolom lengkap dan nilai after save sama dengan input (tidak null)"
summary: "Create mengisi semua field; setelah save, datalist dan form edit menampilkan nilai yang sama — tidak ada kolom/field yang jadi null."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "User punya privilege view + create menu Colli Type."
  - "URL list: https://staging.olshoperp.com/supplychain/colli-type"
  - "URL create: https://staging.olshoperp.com/supplychain/colli-type/create"
test_data:
  - field: "Code"
    value: "CT-QA-01 (ubah ke unik jika sudah ada)"
  - field: "Name"
    value: "Box Persist Check"
  - field: "Description"
    value: "QA persist — Description wajib tampil after save, jangan null"
  - field: "Set as Default Data"
    value: "OFF (jangan ON kecuali company belum punya default)"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "OFF"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/colli-type"
  - "Cek header kolom datalist (termasuk Columns Show/Hide bila ada): Code, Name, Description, Default Data, Active, Created by | Created at, Action."
  - "Cek toolbar: Global Search, Advanced Filter, Create, Show deleted."
  - "Klik Create → https://staging.olshoperp.com/supplychain/colli-type/create"
  - "Cek field form: Code, Name, Description, Set as Default Data, Active, Show for all company."
  - "Isi Code, Name, dan Description sesuai test_data (Description jangan dikosongkan di TC ini)."
  - "Set Active ON, Show for all company OFF, Set as Default Data sesuai test_data."
  - "Catat semua nilai yang diinput sebelum simpan."
  - "Simpan form."
  - "Buka datalist; cari Code yang baru disimpan."
  - "Bandingkan tiap kolom baris itu dengan nilai yang diinput: Code, Name, Description, Default Data, Active, Created by | Created at."
  - "Buka edit type tersebut (catat URL edit)."
  - "Bandingkan tiap field form dengan nilai yang diinput: Code, Name, Description, Set as Default Data, Active, Show for all company."
expected_result: |
  Datalist punya kolom default: **Code**, **Name**, **Description**, **Default Data**, **Active**, **Created by | Created at**, **Action** (requirement §4.1).
  Toolbar: **Create**, **Show deleted**, Global Search, Advanced Filter, Column show/hide (requirement §4.2).
  Form Create/Edit punya **Code**, **Name**, **Description**, **Set as Default Data**, **Active**, **Show for all company** (requirement §5).
  Setelah save: setiap kolom datalist dan setiap field edit menampilkan **nilai yang sama dengan input**. Tidak ada Code/Name/Description/Default Data/Active/Show for all company yang kosong atau null padahal diisi. Description yang diisi tetap tampil (bukan blank). Created by | Created at terisi (bukan null).
test_result:
  status: passed
  started_at: "2026-08-14 12:16"
  finished_at: "2026-08-14 12:18"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    PASS — FAT (112), playwright@gmail.com. Staging FE Fri Aug 14 11:13:21 2026 +0700, API 2026-08-14 11:15:14.
    Datalist kolom: code, name, description, default data, active, created by|created at, action. Columns Show/Hide extra: ID, data owner (hidden).
    Toolbar: Global Search ("find something ..."), Create, Export, Columns Show/Hide, Show deleted. Tombol Advanced Filter berlabel tidak diklik (overlay); ada control `modal show` di a11y tree.
    Create CT-QA-01 / Box Persist Check / Description terisi; Active ON; Show for all company OFF; Set as Default Data dibiarkan OFF.
    Save & Next → toast "The new data has been successfully saved." → edit/1.
    Edit: Code/Name/Description/Active/Show for all company sama dengan input (bukan null). Default Data jadi ON — sesuai SOT §6.1 first create auto ON (FAT sebelumnya empty).
    Datalist: CT-QA-01 | Box Persist Check | Description lengkap | default Yes | active Yes | Playwright Use... | 14-08-2026 12:17:52.
  report_url: null
test_data_used:
  - field: "Code"
    value: "CT-QA-01"
  - field: "Name"
    value: "Box Persist Check"
  - field: "Description"
    value: "QA persist — Description wajib tampil after save, jangan null"
  - field: "Set as Default Data"
    value: "OFF di form create → ON after save (first create auto, SOT §6.1)"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "OFF"
  - field: "Edit URL"
    value: "https://staging.olshoperp.com/supplychain/colli-type/edit/1"
run_history:
  - at: "2026-08-14 12:18"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
first_execution:
  at: "2026-08-14 12:18"
  via: "legacy:test_result"
  jira: "ETM-15543"
last_execution:
  at: "2026-08-14 12:18"
  jira: "ETM-15543"
  status: passed
  via: "legacy:test_result"
---

# TC-CT-001

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Fail jika save “sukses” tapi Description/Default Data/Active/Show for all company jadi kosong di list atau edit.

**Show for all company ON** + lintas company → TC-CT-011 / TC-CT-012, bukan TC ini.
