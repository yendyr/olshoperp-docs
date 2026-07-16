---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-001
menu: supplychain-stock-opname
menu_name: "Stock Opname"
title: "Create Stock Opname header (Building Origin)"
summary: "Membuat dokumen Stock Opname baru dengan Building Origin wajib; code auto-generate (SP*)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: true
automated_spec: "tests/specs/stock-opname/stock-opname-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Fiscal period aktif untuk transaction date."
  - "Minimal 1 Building/Warehouse tersedia di select2 warehouse-origin."
  - "User memiliki akses create Stock Opname."
test_data:
  - field: "Transaction Date"
    value: "autofill (sekarang)"
  - field: "Building Origin"
    value: "pilih opsi warehouse tersedia (autofill default jika ada)"
  - field: "Description"
    value: "SO automation create {stamp}"
  - field: "Transaction Code"
    value: "auto-generated setelah save (SP*)"
steps:
  - "Klik Create di halaman datalist Stock Opname."
  - "Amati Transaction Date terisi otomatis."
  - "Pastikan Building Origin terisi (autofill) atau pilih dari dropdown Choose Building."
  - "Isi Description sesuai test data."
  - "Klik Save & Next (jika form masih di create; AS-IS bisa auto-submit)."
  - "Catat Transaction Code yang tergenerate di form edit."
  - "Verifikasi code tampil di datalist Stock Opname."
expected_result: |
  Header Stock Opname tersimpan, code auto-generate, muncul di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~36s) — create header di lumicharmsid.
    Building Origin + Description, code auto-generate, datalist OK.
  report_url: null
test_data_used:
  - field: "Description"
    value: "SO automation create {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-SOPNAME-001 — 2/2 serial PASS (~1.2m)"
---

# TC-SOPNAME-001

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu **SCM → Stock Opname**  
   `https://staging.olshoperp.com/supplychain/stock-opname`
3. Klik **Create**.
4. Pastikan **Transaction Date** terisi; pilih **Building Origin** jika kosong.
5. Isi **Description** (opsional tapi dipakai assert automation).
6. Klik **Save & Next** (atau biarkan autofill+auto-save jika terjadi).
7. Di edit form, catat **Transaction Code** (mis. `SP…`).
8. Kembali datalist → search code → baris harus muncul.

## Catatan automation

- Spec: `tests/specs/stock-opname/stock-opname-create-update.spec.ts`
- Helper: `tests/helpers/stock-opname.ts`
- Scope header saja — **bukan** input Opname Detail / adjustment qty.
- AS-IS `fetchDefaultValues()` bisa auto-submit create.
