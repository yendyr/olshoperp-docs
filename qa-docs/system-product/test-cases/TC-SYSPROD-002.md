---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-002
menu: system-product
menu_name: "System Product"
title: Membuat SKU Variant 4 warna di datalist System Product (SKU-EMBER)
summary: Create parent SKU → enable Warna → 4 opsi warna → Save All → 5 baris SKU di datalist
status: review
owner: QA - Yemima
last_updated: "2026-07-02"
requirement_ref: "requirement.md §3.B Variant Configuration (Logic Parent-Child)"
automated: true
automated_spec: tests/system-product.spec.ts
execution_company:
  code: lumicharmsid
  id: 153
related_menus:
  - menu_slug: system-product
    menu_name: "System Product"
    role: primary
    note: Form create/edit, section Product Details, variant form
  - menu_slug: gate-user
    menu_name: "User (Gate)"
    role: involved
    note: Login akun E2E runner
  - menu_slug: sidebar-menu
    menu_name: "Sidebar Menu (Gate)"
    role: involved
    note: Switch company ke lumicharmsid
  - menu_slug: accounting-product-coa-group
    menu_name: "Product COA Group"
    role: involved
    note: Product Coa Group dipilih manual (opsi acak yang valid)
preconditions:
  - Akun **playwright@gmail.com** aktif dengan akses company **lumicharmsid (id 153)**.
  - User punya privilege **create** dan **update** System Product.
  - Master **Variant** tipe **Warna** dengan opsi **biru**, **hijau**, **hitam**, **merah** tersedia di company.
  - SKU **SKU-EMBER** belum ada, atau parent sudah ada tetapi variant belum lengkap (automation melengkapi jika perlu).
test_data:
  - field: Datalist URL
    value: https://staging.olshoperp.com/supplychain/product
  - field: System Product SKU (parent)
    value: SKU-EMBER
  - field: System Product Name
    value: Ember
  - field: Enable Variations
    value: Active
  - field: Variant type
    value: Warna
  - field: Variant options
    value: biru, hijau, hitam, merah
steps:
  - Login staging dengan akun E2E runner.
  - Switch company ke **lumicharmsid** (label UI **Lumi Charms.id**).
  - Buka datalist **System Product** → klik **Create** (atau buka edit jika `SKU-EMBER` sudah ada).
  - Isi **System Product SKU** = `SKU-EMBER` dan **System Product Name** = `Ember`.
  - Pilih salah satu opsi acak yang valid di dropdown **Product Coa Group** (hindari COA incomplete / fix-asset yang memicu error).
  - Verifikasi **Sales Category** sudah auto-fill.
  - Klik **Save** (basic information).
  - Scroll ke section **Product Details** dan expand accordion jika perlu.
  - Aktifkan checkbox **Enable Variations**.
  - Klik **Add New Variant** jika form variant belum muncul.
  - Pilih variant type **Warna**.
  - Pilih opsi warna **biru**, **hijau**, **hitam**, dan **merah** pada multiselect option.
  - Klik **Save All**.
  - Kembali ke datalist; cari `SKU-EMBER` lewat searchbox.
expected_result: |
  - Parent **SKU-EMBER** tersimpan dan dapat dibuka di mode edit.
  - Setelah Save All, sistem menghasilkan SKU child dengan format `SKU-EMBER-{option}`.
  - Di datalist (filter `SKU-EMBER`), terlihat **5 baris** SKU:
    - SKU-EMBER (PARENT)
    - SKU-EMBER-biru (VARIANT)
    - SKU-EMBER-hijau (VARIANT)
    - SKU-EMBER-hitam (VARIANT)
    - SKU-EMBER-merah (VARIANT)
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "Playwright chromium headed, slowMo 1500ms — create SKU-EMBER + 4 variant passed"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company
    value: lumicharmsid (id 153, label Lumi Charms.id)
  - field: Parent SKU
    value: SKU-EMBER
  - field: Variant SKUs expected
    value: SKU-EMBER-biru, SKU-EMBER-hijau, SKU-EMBER-hitam, SKU-EMBER-merah
  - field: Spec file
    value: tests/system-product.spec.ts
  - field: POM helper
    value: tests/helpers/system-product.ts
run_history:
  - at: "2026-07-02"
    status: passed
    environment: staging
    note: Execute otomatis Playwright repo olshoperp-docs
---

## Catatan QA

- Sesuai requirement §3.B: toggle **Enable Variations** ON → pilih Variant Type + Option → sistem auto-generate SKU child `Prefix Parent + Option`.
- Beberapa **Product COA Group** di staging memicu field **Asset Category** wajib atau error COA incomplete — automation memfilter/retry sampai COA valid.
- Control **Enable Variations** di UI adalah `checkbox`, bukan switch/toggle role.
- Setelah enable variations, klik **Add New Variant** untuk menampilkan dropdown variant (`aria-placeholder="e.g: Flavour"`).
- Automation idempotent: jika kelima SKU sudah ada di datalist, langkah variant dilewati dan hanya verifikasi datalist dijalankan.
- Requirement layer masih **draft** — detail validasi COA/asset category perlu sinkronisasi docs jika aturan bisnis berubah.
