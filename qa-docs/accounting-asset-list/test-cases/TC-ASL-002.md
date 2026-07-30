---
doc_type: e2e-test-case
tc_code: TC-ASL-002
menu: accounting-asset-list
menu_name: "Asset List"
title: "FILTER — pilih warehouse → kolom Asset Code + Unit Price"
summary: "Pilih warehouse; datalist load; kolom Asset Code, System Product, Unit Price, Latest Calculation."
status: pass
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-list/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-list/asset-list-view.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Login + company lumicharmsid."
  - "Warehouse seed: Gayungsari (atau opsi pertama jika tidak ketemu)."
test_data:
  - "Warehouse search: Gayungsari"
steps:
  - "Buka Asset List."
  - "Pilih Warehouse (Gayungsari); Apply jika perlu."
  - "Verifikasi kolom Asset Code, System Product, Unit Price."
  - "Verifikasi Latest Calculation tampil."
expected_result: |
  Datalist render; kolom asset + harga + banner Latest Calculation.
test_result:
  status: pass
  environment: staging
  log_summary: "5/5 PASS · TC-ASL-002 · company lumicharmsid"
---

# TC-ASL-002

## Catatan automation

- Spec: `@TC-ASL-002`
