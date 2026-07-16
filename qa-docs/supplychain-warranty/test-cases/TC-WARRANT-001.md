---
doc_type: e2e-test-case
tc_code: TC-WARRANT-001
menu: supplychain-warranty
menu_name: "Warranty"
title: "Create Master Warranty baru"
summary: "Mendaftarkan label garansi produk (code + name) agar bisa dipakai di Product Configuration dan Purchase Order."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-warranty/requirement.md"
automated: true
automated_spec: "tests/specs/warranty/warranty-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Sudah di halaman datalist Warranty (`/supplychain/warranty`)."
  - "User memiliki akses create."
test_data:
  - field: "Code"
    value: "WRT{stamp}"
  - field: "Name"
    value: "3 Month {stamp}"
  - field: "Description"
    value: "Warranty automation — garansi produk 3 bulan"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Warranty."
  - "Input Code (contoh WRT001) dan Name (contoh 3 Month)."
  - "Opsional: isi Description."
  - "Pastikan toggle Active ON."
  - "Aktifkan toggle Show for all company."
  - "Klik Save & Next."
  - "Verifikasi Code/Name tampil di datalist Warranty."
expected_result: |
  Master Warranty baru berhasil disimpan dan tampil di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~19s) — create di lumicharmsid.
    Code WRT{stamp}, Name 3 Month {stamp}, Active+Show for all company, Save & Next → datalist OK.
  report_url: null
test_data_used:
  - field: "Code / Name"
    value: "WRT{stamp} / 3 Month {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-WARRANT-001 — 2/2 serial PASS (~1.2m)"
---

# TC-WARRANT-001

## Step to reproduce (manual)

1. Login staging → pilih company **Lumi Charms.id**.
2. Menu **SCM → Master Data SCM → Warranty**  
   URL: `https://staging.olshoperp.com/supplychain/warranty`
3. Klik **Create**.
4. Isi **Code** = `WRT{unik}`, **Name** = `3 Month {unik}`, Description opsional.
5. Toggle **Active** = ON, **Show for all company** = ON.
6. Klik **Save & Next**.
7. Kembali ke datalist; search Code → baris harus muncul.

## Catatan automation

- Spec: `tests/specs/warranty/warranty-create-update.spec.ts`
- Helper: `tests/helpers/warranty.ts`
- Registry: `tests/pom-registry/warranty.yaml`
- Validasi: code/name required max 50, unique per company; description max 150.
