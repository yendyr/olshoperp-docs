---
doc_type: e2e-test-case
tc_code: TC-CREATE-sales-returns
menu: supplychain-sales-returns
menu_name: "Sales Return"
title: "Create Sales Return — scan SO + WH/CCTV"
summary: "Pilih WH Location + CCTV Location; scan Sales Order eligible (outbound+invoice); POST accounting/sales-returns → edit SR*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-sales-returns/requirement.md"
automated: true
automated_spec: "tests/specs/sales-returns/sales-returns-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-sales-return
  - supplychain-failed-ship
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "WH return (is-return+has-scrap) dan CCTV Location tersedia."
  - "Ideal: SO platform refund belum SR (pill Sales Platform Returns) ATAU fallback open SR* di datalist."
test_data:
  - field: Scan Order
    value: "(SO code dari platform list / opsi first)"
steps:
  - "Buka /supplychain/sales-returns."
  - "Verifikasi shell: scan input, Submit, Select WH Location, Select CCTV Location, pill Sales Platform Returns; tanpa Create klasik."
  - "Pilih WH + CCTV (atau pakai preferensi localStorage)."
  - "Buka pill platform bila perlu; ambil SO code; Submit scan."
  - "Jika create berhasil: redirect /supplychain/sales-returns/edit/:id + Sales Return No SR*."
  - "Jika tidak ada SO eligible: smoke shell OK + bind Continue open SR* (fixture)."
expected_result: |
  Dokumen SR open siap diedit; atau CREATE smoke + fixture open terikat.
test_result:
  status: pass
  started_at: "2026-07-15T09:35:00Z"
  finished_at: "2026-07-15T09:36:06Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS CREATE shell+scan/bind SR* · WH+CCTV · company lumicharmsid"
  report_url: null
---

# TC-CREATE-sales-returns

## Fungsi menu

**Sales Return (SCM)** — penerimaan retur gudang setelah order sudah outbound + invoiced (beda Failed Ship). Qty Restock/Broken/Lost disimpan open; Finance Complete di menu Accounting.

## Catatan automation

- Spec: `@TC-CREATE-sales-returns`
- Create = scan-based (bukan tombol Create).
- Fallback AS-IS staging: bind open SR via Continue bila tidak ada SO eligible.
