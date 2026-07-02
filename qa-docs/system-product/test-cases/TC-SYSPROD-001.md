---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-001
menu: system-product
menu_name: "System Product"
title: Membuat SKU Single di datalist System Product (SKU-BLENDER)
summary: Create SKU single → Sales Category & Product Coa Group auto-fill → Save → SKU muncul di datalist
status: review
owner: QA - Yemima
last_updated: "2026-07-02"
requirement_ref: "requirement.md §3.A Basic Information"
automated: true
automated_spec: tests/system-product.spec.ts
execution_company:
  code: lumicharmsid
  id: 153
related_menus:
  - menu_slug: system-product
    menu_name: "System Product"
    role: primary
    note: Datalist & form create/edit `/supplychain/product`
  - menu_slug: gate-user
    menu_name: "User (Gate)"
    role: involved
    note: Login akun E2E runner sebelum akses menu
  - menu_slug: sidebar-menu
    menu_name: "Sidebar Menu (Gate)"
    role: involved
    note: Switch company ke lumicharmsid (Lumi Charms.id)
  - menu_slug: accounting-product-coa-group
    menu_name: "Product COA Group"
    role: involved
    note: Field Product Coa Group auto-fill dari master COA group
preconditions:
  - Akun **playwright@gmail.com** aktif dengan akses company **lumicharmsid (id 153)**.
  - User punya privilege **create** System Product di company tersebut.
  - SKU **SKU-BLENDER** belum ada di company lumicharmsid, atau test diizinkan melewati create jika SKU sudah ada (idempotent).
test_data:
  - field: Datalist URL
    value: https://staging.olshoperp.com/supplychain/product
  - field: System Product SKU
    value: SKU-BLENDER
  - field: System Product Name
    value: Blender
steps:
  - Login staging dengan akun E2E runner.
  - Switch company ke **lumicharmsid** (label UI **Lumi Charms.id**).
  - Buka halaman datalist **System Product** (`/supplychain/product`).
  - Klik tombol **Create** (link ke `/supplychain/product/create`).
  - Isi field **System Product SKU** dengan `SKU-BLENDER`.
  - Isi field **System Product Name** dengan `Blender`.
  - Verifikasi field **Sales Category** sudah terisi otomatis (auto-fill).
  - Verifikasi field **Product Coa Group** sudah terisi otomatis (auto-fill).
  - Klik tombol **Save**.
  - Kembali ke datalist; cari `SKU-BLENDER` lewat searchbox.
expected_result: |
  - Produk tersimpan tanpa error validasi pada basic information.
  - Halaman redirect ke mode edit (`/supplychain/product/edit/{id}`) setelah save pertama kali.
  - Di datalist System Product, baris dengan link SKU **SKU-BLENDER** terlihat setelah filter/pencarian.
  - Tipe produk di datalist = **SINGLE** (parent tanpa variant).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "Playwright chromium headed, slowMo 1500ms — create SKU-BLENDER passed"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company
    value: lumicharmsid (id 153, label Lumi Charms.id)
  - field: SKU dibuat
    value: SKU-BLENDER
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

- Route staging aktual: `/supplychain/product` (manifest `menu_links: supplychain/product`).
- Selector UI (staging bundle): `#sku`, `#name`, combobox Sales Category & Product Coa Group (auto-fill setelah isi SKU/nama).
- Tombol **Create** di datalist berperan sebagai `link`, bukan `button`.
- Automation idempotent: jika `SKU-BLENDER` sudah ada, test melewati create dan langsung verifikasi datalist.
- Requirement layer masih **draft** — verifikasi auto-fill COA/category perlu konfirmasi PM jika perilaku staging berubah.
