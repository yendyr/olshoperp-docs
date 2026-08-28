---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-015
menu: system-product
menu_name: "System Product"
test_type: edge
title: "OFF Enable Variations — child punya haveRelations (PR/PO/inbound/outbound/WO/binding/BOM/bundle)"
summary: "Child sudah dipakai transaksi. OFF tidak boleh menghapus child atau merusak line trx. V-02 diam; sibling leftover melarang hancurkan SKU berelasi."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-02 + §6.3.2 relasi pengunci"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
  - supplychain-purchase-order
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Child Default punya **minimal 1** relasi dari daftar leftover: PR, PO, inbound, outbound, WO, platform binding, BOM header/detail, bundle header/detail. (SO / assembly / TI → DRAFT TC-SYSPROD-021, karena technical.md beda lock.)"
  - "Catat document number + line SKU/product_id sebelum OFF."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Relasi pengunci (§6.3.2)"
    value: "PR, PO, inbound, outbound, transfer, SO, WO, binding, BOM, bundle"
steps:
  - "Buka dokumen relasi. Catat SKU line = child (bukan parent `-(PARENT)`)."
  - "Edit parent System Product. Cek apakah toggle Enable Variations masih bisa di-OFF (`disable_variant`)."
  - "Jika toggle hidup: OFF → amati popup vs error vs 500. Cancel jika ada."
  - "Jika Confirm/Save jalan: buka ulang dokumen relasi + datalist child."
expected_result: |
  Line transaksi tetap resolve ke **SKU/product_id child yang sama**. Child **tidak** dihapus (soft/hard) hanya karena OFF Variations.
  Diterima: (a) toggle disabled; (b) confirm lalu BE reject jelas (`Unable to delete` / haveRelations) tanpa 500; (c) struktur Variant **tidak** berubah.
  Tidak diterima: child hilang, parent jadi Single `-(PARENT)`, dokumen relasi error/SKU kosong, hard-crash.

  [CATATAN QA] V-02 hanya “boleh OFF → Single + confirm” — **tidak** membedakan haveRelations. Sibling §6.3.2: child berelasi **tidak** boleh di-soft-delete saat expand (leftover). Infer OFF: jangan hancurkan SKU yang sudah di PR/PO/inbound/dst.
  technical.md: `disable_variant` AS-IS true hanya jika Single **tanpa children** + related trx — parent Variant **dengan** children tetap bisa di-toggle. Itu celah UX; BE harus tetap aman.
  Referensi: requirement §6.3.2 daftar relasi; technical.md `disable_variant` + `checkTransaction`.
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
jira_key: ETM-15565
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

## Catatan QA

Inti “sudah jadi / ada relasi”. Jangan samakan dengan TC-SYSPROD-005 (form baru).
