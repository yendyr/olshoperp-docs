---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-012
menu: system-product
menu_name: "System Product"
title: "Error — hard-block haveRelations masih muncul; auto-rename leftover"
summary: "AS-IS pain: Cannot add variant, Product already have relations. TO-BE cabut. Auto-rename leftover = fail."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 AS-IS pain / TO-BE no auto-rename"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Child punya relasi (minimal SO atau PR). SKU leftover diketahui, mis. SKUPENSIL atau ETM15495-HB-{stamp}."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Pesan AS-IS terlarang"
    value: "Cannot add variant, Product already have relations"
steps:
  - "Edit parent yang child-nya berelasi. Tambah Variant Group. Save."
  - "Jika toast/error hard-block: catat teks persis → FAIL."
  - "Jika expand jalan: pastikan leftover SKU **sama** (bukan direname ke opsi pertama group baru)."
expected_result: |
  Hard-block `Cannot add variant, Product already have relations` **tidak** muncul (GAP-SP-18 cabut block).
  Tidak ada auto-rename leftover ke opsi pertama group baru (out of scope auto-rename; TO-BE eksplisit).

  [CATATAN QA] Dua regresi AS-IS yang requirement sebut sebagai pain. Latar belakang user ETM-15495 meminta rename otomatis — **ditolak** di TO-BE. Fail jika leftover berubah SKU tanpa aksi user.
  Referensi: qa-docs/system-product/requirement.md §6.3.2; GAP-SP-18.
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
origin_jira: ETM-15495
last_execution:
  at: null
  jira: null
---

## Catatan QA

Bisa dijalankan bersama TC-SYSPROD-008 (same fixture). File ini memisahkan kriteria **error AS-IS** agar mudah di-ticket Error jika masih muncul.
