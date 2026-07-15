---
doc_type: e2e-test-case
tc_code: TC-UPDATE-tagging
menu: supplychain-tagging
menu_name: "Tagging"
title: "Update Tagging"
summary: "Mengubah Code dan Tagging Name pada data Tagging yang sudah dibuat sebelumnya."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: null
automated: true
automated_spec: "tests/specs/tagging/tagging-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Tagging dari TC Create tersedia — automation serial memakai state create."
  - "User memiliki akses update."
test_data:
  - field: "Source"
    value: "TG-AT-{stamp} / Promo Seasonal {stamp}"
  - field: "Code (updated)"
    value: "TG-UP-{stamp}"
  - field: "Name (updated)"
    value: "Promo Updated {stamp}"
steps:
  - "Klik action show/edit pada Tagging hasil create."
  - "Update field Code dan/atau Name."
  - "Klik tombol Save All."
  - "Verifikasi datalist menampilkan Code/Name terbaru."
expected_result: |
  Perubahan data Tagging berhasil tersimpan dan langsung terbarui pada halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~33s) — update setelah create di lumicharmsid.
    TG-AT-* → TG-UP-{stamp} / Promo Updated {stamp}, Save All, datalist OK.
  report_url: null
test_data_used:
  - field: "Code (updated)"
    value: "TG-UP-{stamp}"
  - field: "Name (updated)"
    value: "Promo Updated {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-UPDATE-tagging — chain setelah create"
---

# TC-UPDATE-tagging

## Catatan automation

- Spec tag: `@TC-UPDATE-tagging`
- Draft title "Update Dimension & Weight Label" diabaikan (copy-paste).
