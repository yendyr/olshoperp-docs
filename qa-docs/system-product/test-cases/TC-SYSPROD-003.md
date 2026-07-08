---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-003
menu: system-product
menu_name: "System Product"
title: "Membuat SKU Variant 6 warna di datalist System Product (SKU-WENTER)"
summary: "Create parent SKU → Enable Variations → pilih Warna + 6 opsi warna → Save All → 7 baris SKU di datalist"
status: draft
owner: QA - Codex
last_updated: 2026-07-07
requirement_ref: "qa-docs/system-product/requirement.md"
automated: false
automated_spec: null
execution_company:
 id: 153
 code: lumicharmsid
related_menus:
 - "gate-user"
 - "sidebar-menu"
 - "accounting-product-coa-group"
preconditions:
 - "Akun playwright@gmail.com aktif dan dapat login ke staging."
 - "User memiliki akses company lumicharmsid (id 153)."
 - "User memiliki privilege create/update pada menu System Product."
 - "SKU SKU-WENTER belum memiliki variant child; jika parent sudah terbentuk single, lanjut dari halaman edit parent SKU."
test_data:
 - field: "Website"
   value: "https://staging.olshoperp.com"
 - field: "Menu"
   value: "/supplychain/product"
 - field: "System Product SKU"
   value: "SKU-WENTER"
 - field: "System Product Name"
   value: "Pewarna Tekstil"
 - field: "Enable Variations"
   value: "Active"
 - field: "Variant"
   value: "Warna"
 - field: "Option Variation"
   value: "black, blue, maroon, navy, yellow, purple"
steps:
 - "Klik tombol Create di halaman datalist System Product."
 - "Input System Product SKU = SKU-WENTER dan System Product Name = Pewarna Tekstil."
 - "Pilih salah satu opsi acak yang tersedia pada dropdown Product Coa Group."
 - "Verifikasi field Sales Category sudah terisi otomatis (auto-fill)."
 - "Klik tombol Save."
 - "Setelah tersimpan, scroll ke section Product Details."
 - "Klik toggle Enable Variations hingga status aktif."
 - "Klik field dropdown di bawah toggle Enable Variations (placeholder e.g: Flavour), lalu pilih Warna."
 - "Klik field di sebelahnya (placeholder Choose Option), lalu pilih black, blue, maroon, navy, yellow, purple."
 - "Klik tombol Save All."
 - "Kembali ke datalist dan cari SKU-WENTER."
expected_result: |
 Berdasarkan requirement `qa-docs/system-product/requirement.md` §6.3 (Variant Configuration):
 - Saat Enable Variations aktif dan variant option dipilih, sistem membentuk child SKU dengan pola `{parent}-{option}`.
 - Parent SKU `SKU-WENTER` tersimpan dan tetap bisa dibuka pada mode edit.
 - Pada datalist dengan filter SKU-WENTER, muncul total 7 baris:
   - SKU-WENTER
   - SKU-WENTER-black
   - SKU-WENTER-blue
   - SKU-WENTER-maroon
   - SKU-WENTER-navy
   - SKU-WENTER-yellow
   - SKU-WENTER-purple
test_result:
 status: passed
 started_at: null
 finished_at: null
 executed_by: "Playwright local (olshoperp-docs)"
 environment: staging
 log_summary: "Run scoped SKU-WENTER (company lumicharmsid) PASS; parent + 6 variant child terverifikasi di datalist."
 report_url: null
test_data_used:
 - field: "Runner email"
   value: "playwright@gmail.com"
 - field: "Company"
   value: "lumicharmsid (id 153)"
 - field: "Run command"
   value: "npm run test:system-product:qa:tc -- \"SKU-WENTER\""
 - field: "Expected SKU rows"
   value: "SKU-WENTER, SKU-WENTER-black, SKU-WENTER-blue, SKU-WENTER-maroon, SKU-WENTER-navy, SKU-WENTER-yellow, SKU-WENTER-purple"
run_history:
 - at: "2026-07-07"
   status: passed
   environment: staging
   note: "Scoped run SKU-WENTER PASS (QA video mode)."
---
