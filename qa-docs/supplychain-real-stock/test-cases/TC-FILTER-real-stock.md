---
doc_type: e2e-test-case
tc_code: TC-FILTER-real-stock
menu: supplychain-real-stock
menu_name: "Real Time Stock"
title: "Pilih warehouse → By Location datalist + kolom On Hand/ATS"
summary: "Select warehouse MultiselectPrime; verifikasi GET by-location?warehouse_id=; kolom System Product/On Hand/ATS/Availability; Manual Calculate + Log."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-real-stock/requirement.md"
automated: true
automated_spec: "tests/specs/real-stock/real-stock-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Minimal 1 Building di select2-warehouse."
test_data: []
steps:
  - "Buka Real Time Stock (By Location)."
  - "Pilih opsi pertama warehouse Multiselect."
  - "Tunggu GET real-stock/by-location?warehouse_id=."
  - "Verifikasi kolom: System Product, Unit, On Hand, ATS, Availability."
  - "Verifikasi Manual Calculate + Log Data visible."
  - "Opsional: switch tab By SKU visible."
expected_result: |
  Datalist load per warehouse; metrik stok terlihat.
test_result:
  status: pass
  started_at: "2026-07-15T09:20:25Z"
  finished_at: "2026-07-15T09:20:46Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER warehouse → GET by-location · On Hand/ATS/Availability · Manual Calculate+Log · company lumicharmsid"
  report_url: null
---

# TC-FILTER-real-stock

## Catatan automation

- Spec: `@TC-FILTER-real-stock`
- API: `GET supplychain/real-stock/by-location?warehouse_id=`
- Filter UI: PrimeVue MultiSelect (bukan vueform).
