---
doc_type: e2e-test-case
tc_code: TC-TIB-001
menu: supplychain-transfer-inbound
menu_name: "Transfer Inbound"
title: "Receive Transfer Inbound — Broken/Lost + Approve"
summary: "Search TFE-5TU41QH5, Show, set Broken/Lost, Approve receive."
status: draft
owner: QA - Cursor
last_updated: 2026-07-17
requirement_ref: "qa-docs/supplychain-transfer-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/transfer-inbound/transfer-inbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-mutation-transfer-external
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Transfer External TFE-5TU41QH5 sudah Approve ship (in transit) dan tampil di Transfer Inbound."
  - "SKU AUTO-SKU001 dan AUTO-SKU002 ada di detail transfer."
  - "Description fields diisi 'automation playwright' (standing rule)."
test_data:
  - field: "Trx code Transfer External"
    value: "TFE-5TU41QH5"
  - field: "Broken Items (AUTO-SKU002)"
    value: "2"
  - field: "Lost Items (AUTO-SKU001)"
    value: "1"
  - field: "Description"
    value: "automation playwright"
steps:
  - "Masuk ke menu Transfer Inbound"
  - "Search by trx code Transfer External TFE-5TU41QH5"
  - "Klik action \"show\" untuk melihat detail dokumen"
  - "Pada SKU \"AUTO-SKU002\" inputkan di field broken items = 2"
  - "Pada SKU \"AUTO-SKU001\" inputkan di field lost items = 1"
  - "Klik button Approve — dokumen Transfer Inbound sudah berhasil terbuat"
expected_result: |
  Broken/Lost tersimpan; setelah Approve inbound dokumen berhasil diterima
  (stok destination ter-update; broken → scrap WH jika applicable).
test_result:
  status: pass
  started_at: "2026-07-17T01:30:00Z"
  finished_at: "2026-07-17T01:30:46Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS TFE-5TU41QH5 Show → Broken=2 AUTO-SKU002 · Lost=1 AUTO-SKU001 → Approve · description automation playwright · company lumicharmsid"
  report_url: null
---

# TC-TIB-001

## Fungsi menu

**Transfer Inbound** — penerimaan barang dari Transfer External: isi Broken/Lost lalu Approve receive agar stok masuk gudang tujuan.

## Alur detail (skenario user)

1. Masuk ke menu Transfer Inbound
2. Search by trx code Transfer External TFE-5TU41QH5
3. Klik action "show" untuk melihat detail dokumen
4. Pada SKU "AUTO-SKU002" inputkan di field broken items = 2
5. Pada SKU "AUTO-SKU001" inputkan di field lost items = 1
6. Klik button Approve — dokumen Transfer Inbound sudah berhasil terbuat

## Catatan automation

- Spec: `@TC-TIB-001` (satu TC penuh — bukan pecah Show vs Approve)
- Helper: `tests/helpers/transfer-inbound.ts`
- Fixture TE: `TFE-5TU41QH5` (menu terdampak: External Transfer) — Trx Status Approved = ship sudah approve; receive masih In transit
- Description (standing rule): `automation playwright`
