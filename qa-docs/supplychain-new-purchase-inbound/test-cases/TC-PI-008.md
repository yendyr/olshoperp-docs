---
doc_type: e2e-test-case
tc_code: TC-PI-008
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Choose Colli Type — Colli Type Active OFF tidak muncul di New Colli"
summary: "Saat New Colli, dropdown Choose Colli Type hanya menampilkan type Active ON; type Inactive tidak bisa dipilih."
status: draft
owner: QA - Cursor
last_updated: 2026-08-20
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-colli-type
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Ada Colli Type A dengan **Active ON** (contoh BOX)."
  - "Ada Colli Type B dengan **Active OFF** (create khusus TC atau set inactive — type B belum dipakai colli code)."
  - "Purchase Inbound Draft/Open; SKU outstanding sudah di detail."
  - "URL Colli Type: https://staging.olshoperp.com/supplychain/colli-type"
  - "URL inbound: https://staging.olshoperp.com/supplychain/new-purchase-inbound"
test_data:
  - field: "Colli Type Active"
    value: "BOX / Box (Active ON)"
  - field: "Colli Type Inactive"
    value: "(Code/Name type B — Active OFF)"
steps:
  - "Verifikasi di Colli Type: type A Active ON, type B Active OFF."
  - "Buka Purchase Inbound Draft/Open; pilih baris SKU → **New Colli**."
  - "Buka dropdown **Choose Colli Type**."
  - "Verifikasi type A (Active) **muncul** dan bisa dipilih."
  - "Verifikasi type B (Inactive) **tidak muncul** di dropdown (atau tidak bisa dipilih)."
  - "Pilih type A; selesaikan New Colli → Save All → colli code tergenerate."
expected_result: |
  Colli Type requirement §6.4 kasus 8 (konsumen ETM-15528): type dengan **Active OFF** **tidak muncul** di **Choose Colli Type** saat **New Colli** di Purchase Inbound.

  Hanya type **Active ON** yang bisa dipilih untuk colli baru.

  [CATATAN QA] File `qa-docs/supplychain-colli-type/requirement.md` belum ada di repo; aturan §6.4 kasus 8 dirujuk dari TC-CT README + card ETM-15543. Konfirmasi ke QA lead jika perilaku berbeda di staging.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15528
last_execution:
  at: null
  jira: null
---

# TC-PI-DRAFT-20260820091831

## Catatan QA

Sengaja belum di-TC di folder Colli Type (README TC-CT) — scope konsumen inbound ETM-15528.
