---
doc_type: e2e-test-case
tc_code: TC-PINV-003
menu: accounting-supplier-invoice
menu_name: "Purchase Invoice"
test_type: cross-menu
title: "Inbound yang belum approved TIDAK muncul di modal Inbound Transaction"
summary: "Purchase Inbound berstatus Open (belum approved) tidak boleh bisa ditarik ke Supplier Invoice — mencegah pengakuan hutang atas barang yang penerimaannya belum disahkan."
status: draft
owner: QA - Yemima
last_updated: 2026-08-26
requirement_ref: "qa-docs/accounting-supplier-invoice/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-invoice/si-unapproved-inbound-not-selectable.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-new-purchase-inbound
  - supplychain-purchase-order
preconditions:
  - "PO Approved tersedia untuk supplier yang dipakai."
  - "Purchase Inbound dari PO tersebut sudah dibuat tapi status masih **Open** (BELUM di-approve)."
test_data:
  - field: "PO code"
    value: "{kode PO approved dari precondition}"
  - field: "Status inbound"
    value: "Open (belum approved)"
steps:
  - "Buka /accounting/supplier-invoice → Create; simpan header dengan supplier yang sama."
  - "Klik Inbound Transaction untuk membuka modal."
  - "Cari berdasarkan kode PO dari precondition."
expected_result: |
  Inbound yang belum approved TIDAK muncul di modal (requirement §1: "eligible to
  invoice hanya barang yang punya inbound approved"; §5: "Modal menampilkan SKU dari
  PO yang inbound-nya sudah approved").
  Konsekuensi bisnis: hutang ke supplier tidak bisa diakui atas barang yang
  penerimaannya belum disahkan.
test_result:
  status: passed
  started_at: "2026-08-26"
  finished_at: "2026-08-26"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — inbound status Open dari PO approved TIDAK muncul di modal Inbound
    Transaction Supplier Invoice. Gerbang antar menu terbukti bekerja.
  report_url: null
test_data_used: []
run_history: []
origin_jira: null
first_execution:
  at: "2026-08-26"
  via: "legacy:test_result"
  jira: null
last_execution:
  at: "2026-08-26"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-PI-003

## Catatan

- **Jenis `cross-menu` + negatif**: yang diuji adalah *gerbang antar menu* — kondisi di
  Purchase Inbound (belum approved) harus memblokir aksi di Supplier Invoice.
  Ini kebalikan dari jalur happy path yang sudah dicakup TC-PI-001.
- Melengkapi flow `scm-ap-full` yang selalu meng-approve inbound: flow membuktikan
  jalur yang **boleh**, TC ini membuktikan jalur yang **tidak boleh**.
