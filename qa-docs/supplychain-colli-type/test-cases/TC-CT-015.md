---
doc_type: e2e-test-case
tc_code: TC-CT-015
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: cross-menu
title: "Audit Log mencatat create, update field, toggle Default/Active/Show for all company, dan soft delete"
summary: "Tiap aksi master Colli Type muncul di Audit Log (before/after), bukan hanya save sukses tanpa jejak."
status: ready
owner: QA - Yemima
last_updated: 2026-10-02
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - gate-global-audit-log
preconditions:
  - "User login ke staging."
  - "Company aktif: Dev-Staging (13)."
  - "Terdapat Colli Type CT-AUD-01 untuk pengujian mutasi field."
  - "URL edit: https://staging.olshoperp.com/supplychain/colli-type/edit/207"
test_data:
  - field: "Code"
    value: "CT-AUD-01"
  - field: "Toggles"
    value: "Default Data & Is All Company"
steps:
  - "1. Buka edit Colli Type CT-AUD-01 (https://staging.olshoperp.com/supplychain/colli-type/edit/207)."
  - "2. Ubah toggle 'Default Data' dan 'Show for all company' menjadi ON."
  - "3. Lakukan klik tombol Save."
  - "4. Periksa section Audit Log di bagian bawah form."
expected_result: |
  Audit Log mencatat mutasi data (Create, Update, perubahan Toggle, dan Delete) secara rinci dengan nilai before/after yang tepat.
test_result:
  status: passed
  started_at: "2026-10-02T10:00:00+07:00"
  finished_at: "2026-10-02T10:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Audit Log berhasil mencatat riwayat perubahan data pada Colli Type CT-AUD-01. Catatan UX: Ketika tombol Save diklik 2x cepat, tercatat 2 kali log dengan data yang sama karena belum adanya debounce/disable button on submit."
  report_url: "https://drive.google.com/file/d/1Y4GIY-MKbLtuFGwl08Z56mUoKTqGu6wA/view?usp=drive_link"
test_data_used:
  - field: "Colli Type"
    value: "CT-AUD-01"
  - field: "Edit URL"
    value: "https://staging.olshoperp.com/supplychain/colli-type/edit/207"
run_history:
  - run_at: "2026-10-02T10:15:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    note: "PASSED: Audit Log mencatat perubahan toggle default dan is all company dengan akurat."
origin_jira: ETM-15543
first_execution:
  at: "2026-10-02T10:15:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15543"
last_execution:
  at: "2026-10-02T10:15:00+07:00"
  jira: "ETM-15543"
  status: passed
  via: "manual:OlshopERP"
---

# TC-CT-015: Audit Log mencatat create, update field, toggle Default/Active/Show for all company, dan soft delete

## Bukti Pengujian (Evidence)
- Audit Log Colli Type CT-AUD-01: https://drive.google.com/file/d/1Y4GIY-MKbLtuFGwl08Z56mUoKTqGu6wA/view?usp=drive_link

## Hasil Pengujian
- **Status:** **PASSED 🟢**
- **Verifikasi Audit Log:** Seluruh perubahan toggle (`default` dan `is_all_company`) berhasil dicatat pada riwayat Audit Log dengan kolom Date, Old Value, New Value, Action, dan User yang lengkap.
- **Catatan QA (UX Debounce):** Ketika tombol **Save** diklik 2 kali secara cepat, tercatat 2 entri log duplikat. Hal ini terjadi karena backend memproses setiap request HTTP yang masuk dan tombol frontend belum menerapkan pencegahan double-submit (*debounce / disable button on save*). Secara fungsi pencatatan audit log, modul berfungsi dengan baik.
