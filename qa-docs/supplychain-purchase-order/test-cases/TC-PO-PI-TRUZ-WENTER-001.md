---
doc_type: e2e-test-case
tc_code: TC-PO-PI-TRUZ-WENTER-001
menu: purchase-order
menu_name: "Purchase Order + Purchase Inbound"
title: PO approve + PI Open — TRUZV1 white/yellow & WENTER 6 warna (8 SKU, 1 dokumen)
summary: PR 8 baris → 1 PO With PR (approve) → 1 PI dari approved PO dengan qty sesuai test data
status: review
owner: QA - Playwright
last_updated: "2026-07-10"
automated: true
automated_spec: tests/specs/purchase-order/po-pi-truz-wenter-8sku.spec.ts
execution_company:
  code: lumicharmsid
  id: 153
preconditions:
  - Akun playwright@gmail.com aktif di lumicharmsid (153).
  - SKU master tersedia (TRUZV1 variant + WENTER 6 warna).
  - Tidak ada draft PO With PR yang mengunci outstanding PR untuk SKU yang sama.
test_data:
  - field: Supplier PO & PI
    value: PT. SUPPLIER IDR
  - field: SKU-TRUZV1-white
    value: "500"
  - field: SKU-TRUZV1-yellow
    value: "500"
  - field: SKU-WENTER-black
    value: "200"
  - field: SKU-WENTER-blue
    value: "200"
  - field: SKU-WENTER-navy
    value: "200"
  - field: SKU-WENTER-maroon
    value: "200"
  - field: SKU-WENTER-yellow
    value: "200"
  - field: SKU-WENTER-purple
    value: "200"
steps:
  - Buat PO Without PR — supplier PT. SUPPLIER IDR — tambah 8 SKU via Select Product.
  - Isi PO Qty per baris → status Open → Save All → Approve dari datalist.
  - Buat PI — supplier sama — header auto-save/create → Available PO filter by PO code.
  - Bulk Use 8 SKU (checkbox tidak di-reset antar baris) → isi Inbound Qty → Save All.
expected_result: |
  - 1 dokumen PO approved dengan 8 baris detail qty 500/200.
  - 1 dokumen PI status Open dengan 8 baris inbound qty sesuai.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "PASS ~8m — PO Without PR 8 SKU approve + PI Open 8 baris (lumicharmsid)"
  report_url: null
---

## Catatan

- Permintaan menyebut "purchase outbound" — **belum ada** automation/menu Purchase Outbound di repo; scope TC ini = **1 PO + 1 PI**.
- TRUZ/WENTER tidak muncul di outstanding PR With PR → PO pakai **Without PR** + Select Product per baris.
- PI create page sering **auto-redirect ke edit** setelah default values — pakai `ensureInboundHeaderSaved()`.
- Available PO modal: filter `poTrxCode` + jangan `clearOutstandingSearch` antar checkbox (bulk Use harus 8 baris sekaligus).
