---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-013
menu: system-product
menu_name: "System Product"
title: "OFF Enable Variations — Default sudah Save, zero relation, cek identitas SKU"
summary: "Parent SKU-(PARENT) + child = SKU user sudah persist, belum stok/trx. OFF+Save tidak boleh meninggalkan Single palsu atau menghapus SKU user."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-02 + parent/child SKU"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Product **sudah Save** sebagai Variant Default: parent `{sku}-(PARENT)`, child `{sku}`. Catat product_id parent + child."
  - "Child **zero** haveRelations dan **zero** stok (beda dengan DRAFT TC-SYSPROD-014/TC-SYSPROD-015)."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "SKU user"
    value: "ETM15495-OFF-SAVED-{stamp}"
  - field: "Parent expected before OFF"
    value: "{sku}-(PARENT)"
steps:
  - "Buka edit parent. Catat SKU parent, SKU child, product_id keduanya, tipe PARENT/VARIANT di datalist."
  - "OFF Enable Variations. Wajib confirmation popup. Cancel → struktur parent/child tidak berubah."
  - "Confirm + Save. Refresh datalist + edit ulang."
  - "Cek: berapa baris SKU tersisa; tipe; kode SKU Single; apakah `{sku}-(PARENT)` masih hidup; apakah child `{sku}` terhapus/soft-delete."
expected_result: |
  V-02: confirm wajib; Cancel tidak commit.
  Setelah Confirm+Save: produk **Single** yang **transactable** memakai **SKU yang user ketik** (`{sku}`), bukan wrapper `-(PARENT)`.
  Tidak boleh: (1) Single tersimpan sebagai `{sku}-(PARENT)` sementara child `{sku}` dihapus; (2) dua baris hidup (parent+child) tanpa relasi tree; (3) kedua SKU hilang.

  [CATATAN QA] V-02 tidak merinci mapping parent wrapper → Single. Infer dari §6.3: hanya **child** transactable; parent Default = `{userSku}-(PARENT)` pembungkus. Collapse ke Single harus mempertahankan identitas jual = child/SKU user.
  Fail/broken khas AS-IS: `ProductSpecificationController` menghapus semua child saat `enable_variant=false` — parent kosong jadi SINGLE dengan kode `-(PARENT)`. Itu pecah identitas SKU.
  Referensi: requirement §6.3 + §6.3.1; technical.md FE confirm OFF→Single.
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
jira_key: ETM-15563
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Cabang **sudah jadi Variant Default, belum relasi**. Worst case: user kehilangan SKU yang diketik, tinggal ghost `-(PARENT)`.
