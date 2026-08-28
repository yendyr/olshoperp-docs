---
doc_type: e2e-test-case
tc_code: TC-PI-004
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Validasi SKU di luar Purchase Order tidak bisa ditambahkan ke colli / detail inbound"
summary: "Coba masukkan SKU yang tidak ada di PO outstanding → sistem menolak penambahan."
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
  - "Purchase Inbound Draft/Open terikat satu PO (Supplier A)."
  - "SKU X **tidak** ada di PO inbound tersebut (boleh SKU active di company tapi tidak di PO itu)."
  - "URL edit inbound tersedia."
test_data:
  - field: "PO inbound"
    value: "(catat PO code)"
  - field: "SKU valid di PO"
    value: "(untuk kontrol — harus bisa ditambah)"
  - field: "SKU invalid (bukan di PO)"
    value: "(catat SKU X)"
steps:
  - "Buka edit Purchase Inbound; catat PO referensi."
  - "Available Purchase Order / Select Product: cari SKU X (bukan di PO)."
  - "Verifikasi SKU X **tidak** bisa ditambahkan ke detail (tidak muncul, disabled, atau error saat dipilih)."
  - "Jika ada alur manual assign ke colli (New Colli / modal): coba masukkan SKU X — harus ditolak."
  - "Kontrol positif: tambahkan SKU yang memang ada di PO → harus berhasil."
expected_result: |
  Import validation §9.3 #2 (SKU in PO) dan ETM-15528 re-test guidance #4:
  SKU yang **tidak** terdaftar di Purchase Order yang sedang diproses **tidak boleh** ditambahkan ke detail inbound maupun ke dalam colli.

  Sistem menampilkan validasi/error dan mencegah penambahan.
  SKU dari PO yang sama tetap bisa ditambahkan (kontrol positif).

  [CATATAN QA] Copy pesan error exact belum terdokumentasi di requirement Colli V2 — catat verbatim saat run.
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
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-PI-DRAFT-20260820091827

## Catatan QA

Random product tetap blocked terpisah (`Cannot add stock random product` — requirement §6). TC ini fokus SKU non-PO.
