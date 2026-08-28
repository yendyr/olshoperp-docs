---
doc_type: e2e-test-case
tc_code: TC-PI-007
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: happy
title: "Modal inbound — remove SKU dari colli dan move SKU ke colli lain"
summary: "SKU yang sudah di colli bisa dikeluarkan (colli code kosong) atau dipindah ke colli code berbeda lewat modal inbound."
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
  - "Purchase Inbound Draft/Open dengan minimal dua colli (COL-A dan COL-B), masing-masing punya ≥1 SKU."
  - "Inbound belum Approve."
  - "URL edit inbound tersedia."
test_data:
  - field: "Colli A"
    value: "COL-A (≥2 SKU atau 1 SKU untuk move test)"
  - field: "Colli B"
    value: "COL-B"
  - field: "SKU under test"
    value: "(satu SKU di COL-A)"
steps:
  - "Buka edit inbound; pastikan SKU X ada di colli COL-A."
  - "Buka modal inbound untuk SKU X (Single Use / modal detail sesuai UI)."
  - "Kasus remove: gunakan field/aksi **remove SKU from colli** (atau kosongkan colli code) → Save."
  - "Verifikasi SKU X: **Colli code kosong** — tidak lagi di colli manapun."
  - "Assign SKU X kembali ke COL-A; ulangi modal → **move SKU to another colli** pilih COL-B → Save."
  - "Verifikasi SKU X sekarang di COL-B; COL-A tidak lagi memuat SKU X."
expected_result: |
  ETM-15528 catatan dev poin 8:
  User dapat **remove SKU dari colli** **atau** **move SKU ke another colli code** lewat modal inbound.

  Setelah remove: colli code baris kosong = SKU tidak dimasukkan ke colli (selaras poin 9).
  Setelah move: hanya colli target yang memuat SKU; colli asal tidak lagi memuat SKU tersebut.

  [CATATAN QA] Label field/aksi exact dari UI — catat verbatim saat run.
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

# TC-PI-DRAFT-20260820091830
