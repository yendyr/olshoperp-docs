---
doc_type: e2e-test-case
tc_code: TC-JRN-002
menu: journal
menu_name: "Journal"
title: "CREATE — Journal manual 2 store + debit/credit + Open"
summary: "Create journal; store Store Barang Mahal + Offline Store LUMI; ledger 1-10002 Debit 10000 + 1-10003 Credit 10000; set Description automation playwright; radio Open."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/journal/knowledge-base.md"
automated: true
automated_spec: "tests/specs/journal/journal-manual-create.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-fiscal-period
  - accounting-chart-of-account
preconditions:
  - "Fiscal period Open cover Transaction Date."
  - "COA 1-10002 (Bank) dan 1-10003 tersedia sebagai detail account."
  - "Store: Store Barang Mahal, Offline Store LUMI."
test_data:
  - stores:
      - "store barang mahal"
      - "offline store lumi"
  - ledger:
      - { account: "1-10002", debit: "10000" }
      - { account: "1-10003", credit: "10000" }
  - description: "automation playwright"
steps:
  - "Klik Create → tunggu redirect edit."
  - "Pilih Store: store barang mahal dan offline store lumi."
  - "Ledger: Account 1-10002 | Bank, Debit 10000 → Save row."
  - "Ledger: Account 1-10003, Credit 10000 → Save row."
  - "Isi Description = automation playwright."
  - "Aktifkan radio Open."
expected_result: |
  Journal Open; 2 ledger lines balanced 10000/10000; 2 stores terpasang.
test_result:
  status: pass
  started_at: "2026-07-20T06:30:00Z"
  finished_at: "2026-07-20T06:31:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS journal-manual-create.spec.ts � TC-JRN-002 � company lumicharmsid"
  report_url: null
---

# TC-JRN-002

## Catatan automation

- Spec: `@TC-JRN-002`
- Create auto-POST draft lalu edit; Open auto-PUT status.
