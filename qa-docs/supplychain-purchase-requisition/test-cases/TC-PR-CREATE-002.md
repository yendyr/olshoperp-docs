---
doc_type: e2e-test-case
tc_code: TC-PR-CREATE-002
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
title: "Membuat Purchase Requisition dengan 3 produk SPIDOL dan verifikasi status Open"
summary: "Create PR dari datalist, isi 3 SKU SPIDOL, lalu verifikasi status Open di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-08
requirement_ref: "qa-docs/supplychain-purchase-requisition/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login menggunakan credential E2E: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Fiscal period untuk tanggal transaksi dalam kondisi aktif/open."
  - "SKU tersedia dan bisa dipilih di Purchase Requisition Detail: SKU-SPIDOL-biru, SKU-SPIDOL-hitam, SKU-SPIDOL-merah."
test_data:
  - field: "Select Product"
    value: "SKU-SPIDOL-biru"
  - field: "Request Qty Product"
    value: "10"
  - field: "Select Product"
    value: "SKU-SPIDOL-hitam"
  - field: "Request Qty Product"
    value: "10"
  - field: "Select Product"
    value: "SKU-SPIDOL-merah"
  - field: "Request Qty Product"
    value: "10"
steps:
  - "Klik tombol Create di halaman datalist Purchase Requisition."
  - "Pastikan field Transaction Date terisi otomatis."
  - "Klik tombol Save & Next."
  - "Validasi section Purchase Requisition Detail tampil/aktif dan transaction code PR-* tergenerate otomatis."
  - "Tetap di halaman yang sama, pada section Purchase Requisition Detail pilih produk sesuai test data."
  - "Input Request Qty Product sesuai test data."
  - "Klik tombol Save All."
  - "Buka datalist Purchase Requisition, cari berdasarkan transaction code yang didapat."
  - "Verifikasi data PR baru tampil di datalist dengan status Open."
expected_result: |
  Purchase Requisition baru berhasil tersimpan ke sistem.
  Transaction code PR-* terbentuk saat proses save header.
  Data transaksi tampil di datalist Purchase Requisition dengan status Open.
test_result:
  status: passed
  started_at: 2026-07-08T15:08:00+07:00
  finished_at: 2026-07-08T15:10:00+07:00
  executed_by: "Cursor Agent (Playwright)"
  environment: staging
  log_summary: |
    PASS (run kedua — setelah WENTER). Scoped run @TC-PR-DRAFT; 1 passed (~1.1 menit).
    Evaluasi: fiscal period sudah open; fail-fast Save & Next + ambil Transaction Code dari Basic Information membuat verifikasi datalist stabil. PR yang terbentuk dipakai sebagai precondition TC berikutnya (update & approve), termasuk PR-6A4E067D.
  report_url: null
test_data_used:
  - "SKU-SPIDOL-biru | qty 10"
  - "SKU-SPIDOL-hitam | qty 10"
  - "SKU-SPIDOL-merah | qty 10"
run_history:
  - run_at: 2026-07-08T15:10:00+07:00
    status: passed
    executor: "Cursor Agent (Playwright)"
    notes: "Run scoped: npm run test:purchase-requisition:tc -- \"@TC-PR-DRAFT\"; result 1 passed. Section detail aktif; status Open tervalidasi di datalist."
---
