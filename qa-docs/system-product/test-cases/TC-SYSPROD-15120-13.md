---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-13
menu: system-product
menu_name: "System Product"
test_type: happy
title: "T13: Proteksi Permanen Primary Unit (Ketiadaan Opsi Delete)"
summary: "Memastikan bahwa Primary Unit bersifat permanen dan tidak dapat dihapus dalam kondisi apapun: pada baris Primary Unit hanya tersedia tombol Edit, dan sama sekali tidak disediakan tombol atau aksi Delete."
status: draft
owner: QA - Yemima
last_updated: 2026-09-27
requirement_ref: "qa-docs/system-product/requirement.md"
card_ref: "ETM-15120"
automated: false
automated_spec: null
execution_company:
  id: null
  code: null
related_menus: []
preconditions:
  - "User login ke OlshopERP Staging dengan hak akses menu System Product"
  - "Buka form produk apapun (misal: SKU-COLLI01)"
test_data:
  - field: "Sample SKU"
    value: "SKU-COLLI01"
steps:
  - "1. Buka form edit untuk produk SKU-COLLI01 (/supplychain/product)"
  - "2. Scroll ke section Unit Configuration"
  - "3. Periksa baris Primary Unit yang tampil sebagai inline row"
  - "4. Verifikasi bahwa hanya terdapat tombol Edit pada baris Primary Unit"
  - "5. Verifikasi bahwa tidak ada tombol Delete (ikon tempat sampah) maupun aksi penghapusan apapun untuk Primary Unit"
expected_result: |
  1. Primary Unit tampil inline row dengan tombol Edit.
  2. Tidak ada tombol Delete untuk Primary Unit (Primary Unit permanen).
test_result:
  status: passed
  started_at: "2026-09-25T16:15:00+07:00"
  finished_at: "2026-09-25T16:17:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Primary Unit tampil sebagai inline row yang hanya memiliki tombol Edit, tidak disediakan tombol maupun opsi delete."
  report_url: "https://app.betterbugs.io/session/6ab634659a0216b8a623b248"
first_execution:
  at: "2026-09-25"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-25"
  jira: "ETM-15120"
  status: passed
  via: "manual:resty"
  notes: "Primary Unit tampil sebagai inline row yang hanya memiliki tombol Edit, tidak disediakan opsi delete."
---

# TC-SYSPROD-15120-13: T13: Proteksi Permanen Primary Unit (Ketiadaan Opsi Delete)

## Konteks Pengujian (Card ETM-15120 — T13)

Memvalidasi bahwa setiap System Product wajib memiliki tepat 1 Primary Unit sebagai pondasi dasar kuantitas stok dan konversi. Primary Unit tidak boleh dan tidak dapat dihapus dalam kondisi apapun.
