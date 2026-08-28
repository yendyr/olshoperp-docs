---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-035
menu: system-product
menu_name: "System Product"
test_type: happy
title: "Create Manual Single dengan Default ON → Auto Variant"
summary: "Membuat produk manual dengan Default ON otomatis mengaktifkan variations dan menghasilkan parent SKU-(PARENT) dan child SKU = kode user."
status: draft
owner: QA - Antigravity
last_updated: 2026-08-21
requirement_ref: "qa-docs/system-product/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-variant
preconditions:
  - "Master Variant memiliki tepat 1 group dengan Set as Default System Product = ON dan tepat 1 opsi (mis. Standard)."
  - "Login menggunakan email playwright@gmail.com / 12345678."
test_data:
  - field: SKU Code
    value: SKU-LAPMEJA
  - field: Product Name
    value: Lap Meja
steps:
  - "Buka menu System Product → Create."
  - "Masukkan SKU SKU-LAPMEJA, nama produk, COA group, dan category wajib."
  - "Jangan aktifkan toggle Enable Variations secara manual."
  - "Klik Save."
expected_result: |
  Sistem otomatis mengaktifkan Enable Variations.
  Parent SKU yang ter-generate adalah SKU-LAPMEJA-(PARENT).
  Child SKU yang ter-generate adalah SKU-LAPMEJA (menggunakan kode user).
test_result:
  status: passed
  started_at: 2026-08-21T14:50:00+07:00
  finished_at: 2026-08-21T14:51:00+07:00
  executed_by: User
  environment: staging
  log_summary: "Tergenerate 2 SKU: SKU-LAPMEJA-(PARENT) dan SKU-LAPMEJA"
  report_url: null
test_data_used:
  - SKU-LAPMEJA
run_history:
  - status: pass
    executed_by: User
    at: 2026-08-21T14:51:00+07:00
    jira: ETM-15512
origin_jira: ETM-15512
first_execution:
  at: "2026-08-21T14:51:00+07:00"
  via: "legacy:test_result"
  jira: "ETM-15512"
last_execution:
  at: "2026-08-21T14:51:00+07:00"
  jira: "ETM-15512"
  status: passed
  via: "legacy:test_result"
---
