---
doc_type: e2e-test-case
tc_code: TC-ADJADD-001
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
title: "Create Stock Addition header (Location Destination)"
summary: "Membuat dokumen Stock Addition baru dengan Location Destination wajib; code auto-generate (AI*)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-adjustment-addition/requirement.md"
automated: true
automated_spec: "tests/specs/adjustment-addition/adjustment-addition-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Fiscal period aktif untuk transaction date."
  - "Minimal 1 Location Destination di select2 warehouse-destination."
  - "User memiliki akses create Stock Addition (SCM)."
test_data:
  - field: "Transaction Date"
    value: "autofill (sekarang)"
  - field: "Location Destination"
    value: "pilih opsi tersedia (autofill default jika ada)"
  - field: "Description"
    value: "AI automation create {stamp}"
  - field: "Transaction Code"
    value: "auto-generated setelah save (AI*)"
steps:
  - "Klik Create di halaman datalist Stock Addition."
  - "Amati Transaction Date terisi otomatis."
  - "Pastikan Location Destination terisi (autofill) atau pilih dari Choose Location."
  - "Isi Description sesuai test data."
  - "Klik Save & Next (jika form masih di create; AS-IS bisa auto-submit)."
  - "Catat Transaction Code yang tergenerate di form edit (AI*)."
  - "Verifikasi code tampil di datalist Stock Addition."
expected_result: |
  Header Stock Addition tersimpan, code auto-generate prefix AI, muncul di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — create header AI* di lumicharmsid (~37s).
    Location Destination + Description, code AI*, datalist OK.
  report_url: null
test_data_used:
  - field: "Description"
    value: "AI automation create {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-ADJADD-001 — serial 3/3 PASS (~3.5m)"
---

# TC-ADJADD-001

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu **SCM → Stock Adjustment → Stock Addition**  
   `https://staging.olshoperp.com/supplychain/adjustment-addition`
3. Klik **Create**.
4. Pastikan **Transaction Date** terisi; pilih **Location Destination** jika kosong.
5. Isi **Description**.
6. Klik **Save & Next** (atau biarkan autofill+auto-save jika terjadi).
7. Di edit form, catat **Transaction Code** (mis. `AI…`).
8. Kembali datalist → search code → baris harus muncul.

## Catatan automation

- Spec tag: `@TC-ADJADD-001`
- Helper: `tests/helpers/adjustment-addition.ts`
- Registry: `tests/pom-registry/adjustment-addition.yaml`
- AS-IS `fetchDefaultValues()` bisa auto-submit create.
