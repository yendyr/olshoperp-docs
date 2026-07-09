---
doc_type: e2e-test-case
tc_code: TC-PR-UPDATE-001
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
title: "Update Request Qty SKU-SPIDOL-hitam menjadi 25 lalu Approve PR-6A4E067D"
summary: "Buka PR Open dari datalist, ubah qty SKU-SPIDOL-hitam ke 25, pastikan status Open, klik ikon ceklis biru Approve, verifikasi status Approved."
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
  - "Sudah berada di menu Purchase Requisition."
  - "Purchase Requisition dengan code PR-6A4E067D sudah ada dan berstatus Open."
test_data:
  - field: "Transaction Code"
    value: "PR-6A4E067D"
  - field: "Select Product / System Product SKU"
    value: "SKU-SPIDOL-hitam"
  - field: "Request Qty Product"
    value: "25"
steps:
  - "Klik button ikon yang menuju show/edit pada kolom action di baris data code PR-6A4E067D (button#updateButton; URL target ada di atribut value)."
  - "Pada halaman edit, scroll ke section Purchase Requisition Detail lalu ubah Request Qty SKU-SPIDOL-hitam menjadi 25."
  - "Pastikan status Purchase Requisition masih Open (radio Open ter-check, bukan Draft)."
  - "Klik button ikon ceklis berwarna biru untuk Approve (bukan tombol berteks Approve)."
  - "Verifikasi di datalist bahwa PR-6A4E067D tampil dengan status Approved."
expected_result: |
  Purchase Requisition PR-6A4E067D tersimpan dengan Request Qty SKU-SPIDOL-hitam = 25.
  Data tampil di halaman datalist dengan status Approved.
test_result:
  status: passed
  started_at: 2026-07-08T15:41:00+07:00
  finished_at: 2026-07-08T16:16:00+07:00
  executed_by: "Cursor Agent (Playwright)"
  environment: staging
  log_summary: |
    PASS (hasil bisnis). Expected tercapai: qty SKU-SPIDOL-hitam = 25 dan status Approved setelah klik ikon ceklis biru.
    Catatan evaluasi automation: beberapa attempt Playwright tercatat FAIL karena (1) navigasi awal salah diasumsikan <a href> padahal button#updateButton + value, (2) locator Approve awal mencari teks "Approve" padahal TC meminta ikon ceklis biru, (3) rerun setelah approve sukses gagal di assertion halaman edit karena data sudah Approved/read-only — itu false FAIL reporting, bukan expected result gagal.
  report_url: null
test_data_used:
  - "PR-6A4E067D"
  - "SKU-SPIDOL-hitam | qty 25"
run_history:
  - run_at: 2026-07-08T15:45:00+07:00
    status: failed
    executor: "Cursor Agent (Playwright)"
    notes: "Timeout navigasi edit — salah asumsi link <a href>; seharusnya button#updateButton dengan URL di atribut value (trim spasi)."
  - run_at: 2026-07-08T16:01:00+07:00
    status: failed
    executor: "Cursor Agent (Playwright)"
    notes: "Masuk edit berhasil setelah fix updateButton; gagal locator tombol berteks Approve. TC mensyaratkan ikon ceklis biru."
  - run_at: 2026-07-08T16:16:00+07:00
    status: passed
    executor: "Cursor Agent (Playwright) + konfirmasi QA"
    notes: "Hasil bisnis tercapai: qty hitam 25 + status Approved. Rerun automation setelah itu tampak FAIL karena PR sudah read-only — dikoreksi sebagai false FAIL automation, bukan fail expected result."
---
