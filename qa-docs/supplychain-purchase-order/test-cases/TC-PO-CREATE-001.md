---
doc_type: e2e-test-case
tc_code: TC-PO-CREATE-001
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "Membuat Purchase Order With PR dari available products — status Draft"
summary: "Create PO dengan supplier PT. SUPPLIER IDR, pilih outstanding PR di Available Products, isi PO Qty, simpan sebagai Draft, verifikasi di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-09
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-order/po-create-with-pr.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-purchase-requisition
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Sudah berada di menu Purchase Requisition (tanpa pengecekan kode PR tertentu)."
  - "Fiscal period untuk tanggal transaksi dalam kondisi aktif/open."
  - "Supplier PT. SUPPLIER IDR tersedia di master supplier."
  - "SKU pada test data masih tersedia di Available Products (outstanding PR belum terkunci penuh oleh PO draft/open lain)."
test_data:
  - field: "Supplier"
    value: "PT. SUPPLIER IDR"
  - field: "Purchase Order Type"
    value: "With PR"
  - field: "Select Product (Available Products)"
    value: "SKUSINGLE-001"
  - field: "PO Qty"
    value: "100"
  - field: "Select Product (Available Products)"
    value: "SKU-ALT-UNT-001"
  - field: "PO Qty"
    value: "5"
  - field: "Select Product (Available Products)"
    value: "SKU-SPIDOL-biru"
  - field: "PO Qty"
    value: "10"
  - field: "Select Product (Available Products)"
    value: "SKU-EMBER-merah"
  - field: "PO Qty"
    value: "90"
  - field: "Trx. Status"
    value: "Draft"
steps:
  - "Dari menu Purchase Requisition, buka datalist Purchase Order lalu klik Create."
  - "Pastikan field Transaction Date terisi otomatis."
  - "Pastikan field Payment Type terisi otomatis."
  - "Pilih supplier PT. SUPPLIER IDR."
  - "Pilih radio With PR pada Purchase Order Type."
  - "Klik Save & Next; validasi halaman edit terbuka dan transaction code PO-* tergenerate."
  - "Pada section Purchase Order Detail, klik Available Products."
  - "Centang semua SKU sesuai test data di tabel outstanding, lalu klik bulk Use di atas tabel."
  - "Isi PO Qty per baris detail sesuai test data."
  - "Pilih radio status Draft."
  - "Klik Save All."
  - "Buka datalist Purchase Order, cari berdasarkan transaction code yang didapat."
  - "Verifikasi PO tampil di datalist dengan status Draft."
expected_result: |
  Purchase Order baru berhasil tersimpan ke sistem.
  Transaction code PO-* terbentuk saat proses Save & Next.
  Detail produk dari outstanding PR berhasil ditambahkan ke Purchase Order Detail.
  PO Qty per SKU tersimpan sesuai test data.
  Data transaksi tampil di datalist Purchase Order dengan status Draft.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — create PO With PR (PT. SUPPLIER IDR), 4 SKU dari Available Products,
    bulk Use + isi PO Qty, status Draft terverifikasi di datalist.
    Catatan: sebelum run final, draft PO automation lama dibersihkan via @TC-PO-CLEANUP-DRAFT
    agar SKUSINGLE-001 kembali muncul di outstanding.
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Automation tag"
    value: "@TC-PO-CREATE-WITH-PR"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-order/po-create-with-pr.spec.ts -g @TC-PO-CREATE-WITH-PR --retries=0"
  - field: "Cleanup command (opsional)"
    value: "npx playwright test tests/specs/purchase-order/po-cleanup-draft-playwright.spec.ts -g @TC-PO-CLEANUP-DRAFT --retries=0"
run_history:
  - at: "2026-07-09"
    status: passed
    environment: staging
    note: "PASS setelah cleanup draft PO automation; SKUSINGLE-001 qty 100 + 3 SKU lain; status Draft OK"
  - at: "2026-07-09"
    status: failed
    environment: staging
    note: "BLOCKER — SKUSINGLE-001 tidak muncul di Available Products karena qty terkunci draft PO automation sebelumnya"
  - at: "2026-07-09"
    status: failed
    environment: staging
    note: "BLOCKER — SKU-SPIDOL-hitam tidak tersedia di outstanding; diganti SKUSINGLE-001"
---
