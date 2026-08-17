---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-005
menu: system-product
menu_name: "System Product"
title: "OFF Enable Variations — form create Default ON, belum persist, zero relation"
summary: "Baru created di form (belum Save / belum ada child di DB). OFF wajib confirm; Cancel tetap Variant; Confirm jadi Single dengan SKU user."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-02"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON (GAP-VAR-01). Form create System Product; Enable Variations sudah ON karena Default. Belum klik Save."
  - "Belum ada child/parent di DB untuk SKU ini — zero relation, zero stok."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Toggle"
    value: "Enable Variations"
  - field: "SKU"
    value: "ETM15495-OFF-NEW-{stamp}"
steps:
  - "Isi SKU + field wajib. Jangan Save dulu. Pastikan Enable Variations ON + Default group tampil."
  - "Matikan Enable Variations. Amati confirmation popup (V-02)."
  - "Cancel / tutup popup → Variations tetap ON; Default group masih di section."
  - "Ulangi OFF → Confirm. Cek form jadi Single (bukan parent/child). SKU di field = kode user, bukan `{sku}-(PARENT)`."
  - "Save. Datalist: satu baris tipe Single; tidak ada ghost `{sku}-(PARENT)` dan tidak ada child terpisah."
expected_result: |
  OFF Enable Variations memunculkan confirmation popup (V-02).
  Cancel: tetap Variant Default path (parent/child belum persist).
  Confirm + Save: tersimpan **Single** dengan **SKU user** (existing Single rules).
  Tidak boleh tersisa baris `{sku}-(PARENT)` atau child orphan.

  [CATATAN QA] Ini cabang **baru / belum relasi**. Jangan pakai case ini untuk produk yang sudah Save + child di DB — itu DRAFT TC-SYSPROD-013+.
  Label tombol popup = teks UI staging (jangan mengarang Yes/No).
  Referensi: qa-docs/system-product/requirement.md §6.3.1; supplychain-variant §6.6.
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

Port ETM-15512 TC-02, dipersempit ke **unsaved create**. Family OFF Variations: `TC-SYSPROD-013` dst.
