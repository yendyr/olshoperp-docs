---
doc_type: e2e-test-case
tc_code: TC-CREATE-item-category
menu: supplychain-item-category
menu_name: "Item Category"
title: "Create Item Category"
summary: "Create new Item Category (Code + Name + Active) lalu verifikasi tampil di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-item-category/requirement.md"
automated: true
automated_spec: "tests/specs/item-category/item-category-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Sudah di halaman datalist Item Category (`/supplychain/item-category`)."
  - "User memiliki akses create Item Category."
test_data:
  - field: "Code"
    value: "CAT029"
  - field: "Name"
    value: "Baterai AAA"
  - field: "Active"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Item Category."
  - "Input data pada field Code dan Name sesuai test data."
  - "Catatan AS-IS: TC menyebut dropdown Unit Class — field tersebut tidak ada di form Item Category (yang ada: Parent Group Name, opsional). Automation tidak memilih Parent."
  - "Klik toggle Active hingga aktif."
  - "Klik Save & Next (UI create; TC menyebut Save All)."
  - "Verifikasi Code/Name tampil di datalist Item Category."
expected_result: |
  Item Category berhasil disimpan ke sistem.
  Setelah Save & Next, redirect ke halaman edit.
  Data tampil di datalist Item Category.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~30s) — create Item Category di lumicharmsid.
    Code TC CAT029 (fallback CAT029-AT-{stamp} jika sudah exists),
    Name Baterai AAA, Active ON, Save & Next → tampil di datalist.
    Parent / Unit Class di-skip (AS-IS UI tanpa Unit Class).
  report_url: null
test_data_used:
  - field: "Code"
    value: "CAT029 atau CAT029-AT-{stamp}"
  - field: "Name"
    value: "Baterai AAA (+ stamp jika perlu)"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-CREATE-item-category"
---

# TC-CREATE-item-category

## Catatan automation

- Spec: `tests/specs/item-category/item-category-create-update.spec.ts` (tag `@TC-CREATE-item-category`)
- Helper: `tests/helpers/item-category.ts`
- Registry: `tests/pom-registry/item-category.yaml`
- Chain: hasil create dipakai test update berikutnya dalam `describe.serial`.
