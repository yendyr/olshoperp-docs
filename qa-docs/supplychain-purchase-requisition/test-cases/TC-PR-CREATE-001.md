---
doc_type: e2e-test-case
tc_code: TC-PR-CREATE-001
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
title: "Membuat Purchase Requisition dengan 2 produk WENTER00 dan verifikasi status Open"
summary: "Create PR dari datalist, isi 2 SKU WENTER00, lalu verifikasi status Open di datalist."
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
  - "SKU tersedia dan bisa dipilih di Purchase Requisition Detail: SKU-WENTER00-black, SKU-WENTER00-blue."
test_data:
  - field: "Select Product"
    value: "SKU-WENTER00-black"
  - field: "Request Qty Product"
    value: "20"
  - field: "Select Product"
    value: "SKU-WENTER00-blue"
  - field: "Request Qty Product"
    value: "29"
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
  status: failed
  started_at: 2026-07-08T13:33:00+07:00
  finished_at: 2026-07-08T14:06:00+07:00
  executed_by: "Cursor Agent (Playwright)"
  environment: staging
  log_summary: |
    FAIL (run pertama — paling awal dieksekusi sebelum SPIDOL).
    Evaluasi: (1) Setelah klik Save & Next, implementasi await waitForURL(/edit/) menutup sinyal error API dulu, sehingga gejala yang terlihat timeout navigasi padahal backend bisa sudah menolak. (2) Setelah fail-fast API, error muncul jelas: fiscal period belum aktif. (3) Setelah fiscal period dibuka, flow create/detail/save sempat berhasil, tetapi assertion akhir false-negative karena ambil PR-* dari breadcrumb/URL, bukan field Transaction Code.
  report_url: null
test_data_used:
  - "SKU-WENTER00-black | qty 20"
  - "SKU-WENTER00-blue | qty 29"
run_history:
  - run_at: 2026-07-08T13:45:00+07:00
    status: failed
    executor: "Cursor Agent (Playwright)"
    notes: "Symptom yang terlihat: timeout waitForURL ke /edit/*. Akar: assertion navigation terlalu ketat; bukan karena form create tidak bisa Save & Next."
  - run_at: 2026-07-08T13:50:00+07:00
    status: failed
    executor: "Cursor Agent (Playwright)"
    notes: "Setelah fail-fast: Save PR header ditolak backend — Date must be in an active fiscal period. Ini blocker data/precondition, bukan kegagalan step Create."
  - run_at: 2026-07-08T14:06:00+07:00
    status: failed
    executor: "Cursor Agent (Playwright)"
    notes: "PR berhasil tersimpan (false negative assertion): extractor transaction code salah sumber (breadcrumb/URL), seharusnya field Transaction Code di Basic Information."
---
