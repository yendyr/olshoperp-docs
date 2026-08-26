---
doc_type: e2e-test-case
tc_code: TC-PI-003
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Validasi qty inbound melebihi sisa outstanding PO ditolak (termasuk alokasi per colli)"
summary: "Isi Inbound Qty atau total qty SKU di colli > sisa PO → error max outstanding; proses tidak boleh selesai."
status: draft
owner: QA - Cursor
last_updated: 2026-08-20
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "PO Approved dengan SKU masih outstanding (catat sisa qty PO)."
  - "Purchase Inbound Draft/Open dengan SKU tersebut sudah masuk detail (Bulk Use atau Single Use)."
  - "URL edit inbound tersedia."
test_data:
  - field: "SKU"
    value: "(dari PO — catat sisa outstanding PO = N)"
  - field: "Inbound Qty (invalid)"
    value: "N + 1 (atau total di dua colli > N)"
steps:
  - "Buka edit Purchase Inbound Open; pastikan satu SKU dengan sisa outstanding PO = N."
  - "Kasus A — qty manual: isi **Inbound Qty** = N + 1 (atau melebihi N setelah konversi unit) → Save All atau blur field."
  - "Verifikasi error muncul; qty tidak tersimpan melebihi N."
  - "Kasus B — colli (jika UI mendukung split qty): alokasikan SKU ke dua colli sehingga **total qty SKU** di semua colli > N → Save All / coba **Approve**."
  - "Verifikasi sistem menolak; pesan error tampil; inbound tidak boleh Approved dengan qty over."
expected_result: |
  AS-IS requirement §6: `compareUnitQty` — error EN:
  `Input Quantity exceeds Outstanding PO. Max allowed: {n}`

  ETM-15528 re-test guidance #3: total kuantitas SKU di **semua colli** tidak boleh melebihi kuantitas PO; sistem menampilkan error dan mencegah penyelesaian (Approve/save invalid).

  Qty yang disimpan tetap ≤ sisa outstanding PO.
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

# TC-PI-DRAFT-20260820091826

## Catatan QA

Kasus B perlu fixture PO dengan sisa cukup untuk split ke dua colli. Catat pesan error verbatim jika copy berbeda dari requirement §6.
