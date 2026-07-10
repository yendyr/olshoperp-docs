---
doc_type: e2e-test-case
tc_code: TC-PI-CREATE-001
menu: supplychain-new-purchase-inbound
menu_name: "Purchase Inbound"
title: "Membuat dokumen inbound barang dari PO yang sudah di-approve — status Open"
summary: "Create Purchase Inbound dari Available Purchase Order (supplier Lumi), checklist SKU outstanding, isi Inbound Qty 100, Save All, verifikasi di datalist status Open."
status: draft
owner: QA - Cursor
last_updated: 2026-07-10
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-inbound/pi-create-from-po.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-purchase-order
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Fiscal period untuk tanggal transaksi aktif (fallback UI: 09-07-2026)."
  - "Supplier PT. Supplier Lumi 001 Taxable tersedia di select2 Purchase Inbound (hanya supplier dengan PO approved)."
  - "SKU test data masih outstanding di Available Purchase Order (belum terkunci penuh oleh inbound open/draft lain)."
test_data:
  - field: "Supplier (TC wording)"
    value: "PT. Suplier Lumi 00 Texable"
  - field: "Supplier (AS-IS select2)"
    value: "PT. Supplier Lumi 001 Taxable"
  - field: "System Product SKU"
    value: "SKUSINGLE-075"
  - field: "System Product SKU"
    value: "SKU-ForeignCURR004-TAX"
  - field: "Inbound Qty (per SKU)"
    value: "100"
  - field: "Transaction Date fallback"
    value: "09-07-2026 12:00:00"
  - field: "Trx. Status"
    value: "Open"
steps:
  - "Klik menu Purchase Inbound (BETA - New Purchase Inbound)."
  - "Klik Create pada datalist."
  - "Pastikan Transaction Date dan Location Destination terisi otomatis; jika error fiscal period, set tanggal ke 09-07-2026."
  - "Pilih supplier PT. Supplier Lumi 001 Taxable (FE mewajibkan supplier sebelum Save & Next)."
  - "Klik Save & Next; simpan transaction code IN-* yang tergenerate."
  - "Pada section Inbound Detail, klik Available Purchase Order."
  - "Checklist SKU sesuai test data, lalu klik bulk Use."
  - "Isi Inbound Qty 100 untuk masing-masing SKU."
  - "Klik Save All."
  - "Cari transaction code di datalist Purchase Inbound; verifikasi status Open."
expected_result: |
  Purchase Inbound berhasil tersimpan.
  Transaction code IN-* terbentuk setelah Save & Next.
  Detail dari Available Purchase Order masuk ke Inbound Detail.
  Inbound Qty per SKU sesuai input.
  Data tampil di datalist dengan status Open.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — create PI dari Available PO (supplier Lumi 001 Taxable),
    SKUSINGLE-075 + SKU-ForeignCURR004-TAX, inbound qty 100,
    status Open terverifikasi di datalist (~2.2m).
    Catatan: sebelum run final, inbound open automation yang menahan prepared qty
    dirilis agar SKU kembali muncul di outstanding.
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Automation tag"
    value: "@TC-PI-CREATE-001"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-inbound/pi-create-from-po.spec.ts -g @TC-PI-CREATE-001 --retries=0"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "PASS setelah rilis prepared qty dari inbound open automation sebelumnya; fiscal date 09-07-2026; status Open OK"
  - at: "2026-07-10"
    status: failed
    environment: staging
    note: "BLOCKER — SKU target tidak di outstanding (prepared_to_grn penuh oleh inbound open run sebelumnya)"
  - at: "2026-07-10"
    status: failed
    environment: staging
    note: "FAIL — supplier TC typo (Suplier/Texable); AS-IS: PT. Supplier Lumi 001 Taxable"
---
