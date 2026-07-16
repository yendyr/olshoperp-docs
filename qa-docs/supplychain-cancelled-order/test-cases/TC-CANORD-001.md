---
doc_type: e2e-test-case
tc_code: TC-CANORD-001
menu: supplychain-cancelled-order
menu_name: "Cancelled Order"
title: "Buka Cancelled Order + verifikasi kolom read-only"
summary: "Memastikan list SO Void/Rejected load; kolom monitoring tampil; tanpa Create."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-cancelled-order/requirement.md"
automated: true
automated_spec: "tests/specs/cancelled-order/cancelled-order-view-search.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - sales-order
  - sales-order-general
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses viewAny CancelledOrder."
test_data: []
steps:
  - "Buka /supplychain/cancelled-order."
  - "Verifikasi breadcrumb Cancelled Order."
  - "Verifikasi tidak ada tombol Create."
  - "Verifikasi kolom: TRX CODE, Customer, Payment/Deadline, TRX Status, Processing Status, Void Notes."
  - "Jika ada baris: status Void|Rejected + link ke SO edit."
expected_result: |
  Datalist HTTP 200; shell read-only; kolom monitoring tampil.
test_result:
  status: pass
  started_at: "2026-07-15T03:29:30Z"
  finished_at: "2026-07-15T03:31:18Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS cancelled-order-view-search.spec.ts · VIEW OK · 2 Void rows (SO-69AD8DB2 dkk) · lumicharmsid"
  report_url: null
---

# TC-CANORD-001

## Fungsi menu

Monitoring **Sales Order yang sudah dibatalkan** (`void` / `rejected`) — investigasi platform order,
tanggal void, catatan, dan tahap gudang terakhir. **Bukan** tempat void/reject order.

## Catatan automation

- Spec: `@TC-CANORD-001`
- Helper: `tests/helpers/cancelled-order.ts`
- Registry: `tests/pom-registry/cancelled-order.yaml`
