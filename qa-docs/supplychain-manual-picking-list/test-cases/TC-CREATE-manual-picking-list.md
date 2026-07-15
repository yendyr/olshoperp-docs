---
doc_type: e2e-test-case
tc_code: TC-CREATE-manual-picking-list
menu: supplychain-manual-picking-list
menu_name: "Manual Picking List"
title: "Create Manual Picking List header (PL-*)"
summary: "Membuat dokumen PL ad-hoc; Building Origin wajib; code auto PL-*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-manual-picking-list/requirement.md"
automated: true
automated_spec: "tests/specs/manual-picking-list/manual-picking-list-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-location
  - supplychain-adjustment-deduction
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Building Origin + Outrack Picking sudah di Warehouse Setting."
test_data:
  - field: "Description"
    value: "MPL automation create {stamp}"
steps:
  - "Datalist Manual Picking List → Create."
  - "Pastikan Building Origin terisi (auto dari last PL atau pilih)."
  - "Isi Description → Save All / auto-create."
  - "Verifikasi code PL* di form + datalist."
expected_result: |
  Header tersimpan dengan code PL-*; tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-15T04:45:00Z"
  finished_at: "2026-07-15T04:48:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS manual-picking-list-create-update.spec.ts · CREATE PL-* · company lumicharmsid"
  report_url: null
---

# TC-CREATE-manual-picking-list

## Fungsi menu

Transaksi gudang **ad-hoc picking** (bukan dari Wave/SO): buat PL, alokasi rack FIFO,
reserve stok, proses picking. Complete → Transfer Internal + Stock Deduction (+ PL baru jika Qty New PL).

## Catatan automation

- Spec: `@TC-CREATE-manual-picking-list`
- Helper: `tests/helpers/manual-picking-list.ts`
- AS-IS: `fetchDefaultValues()` sering auto POST → langsung edit.
