---
doc_type: e2e-test-case
tc_code: TC-PO-002
menu: supplychain-purchase-order
menu_name: "Purchase Order"
test_type: happy
title: "DATALIST — trigger export dari sidebar Export; hasil tercatat di history (Purchase Order)"
summary: "PO: klik Export → pilih This Page Only atau With Details di sidebar; baris history muncul; tanpa tombol CSV/Excel terpisah."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md §3.3 & §13.2"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Role punya akses Purchase Order."
  - "Datalist PO punya minimal 1 baris di halaman aktif (agar This Page Only menghasilkan file)."
test_data:
  - field: "UI fixture"
    value: "https://staging.olshoperp.com/supplychain/purchase-order"
  - field: "Opsi yang di-trigger"
    value: "This Page Only (wajib). Opsional smoke: With Details."
  - field: "Kolom history (UI)"
    value: "Action ; File Name ; Export By / Export At ; Finished At ; Status"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/purchase-order."
  - "Pastikan halaman utama tidak menampilkan **Export Excel** atau **Export CSV**."
  - "Klik tombol **Export**. Slideover judul **Export** terbuka. Catat jumlah baris history sebelum trigger."
  - "Buka dropdown **Export** di dalam slideover. Pilih **This Page Only**."
  - "Tunggu job selesai (teks Export in progress, please wait... hilang / status history tidak in-progress). Refresh tabel history jika perlu."
  - "Baris baru muncul di history (File Name terisi, Status selesai). Ikon Download tersedia jika URL file sudah ada."
  - "Opsional: ulangi untuk **With Details**. Pastikan tidak ada pilihan format CSV vs Excel sebagai button terpisah — satu flow yang sama."
  - "Jangan ubah filter/data transaksi untuk membandingkan isi file vs datalist di luar smoke: file terunduh, bukan verifikasi kolom per field."
expected_result: |
  1. Export datalist PO berjalan async dari opsi **With Details** / **Without Details** / **This Page Only** (requirement §3.3 & §13.2).
  2. Hasil job bisa diunduh dari history di slideover **Export** (requirement: tab Export File).
  3. Tidak ada tombol **Export Excel** / **Export CSV** di halaman utama; CSV dan Excel tidak punya button terpisah (satu mekanisme).
  4. Isi data hasil export tidak berubah dibanding perilaku export advanced yang sudah ada (AC ETM-15469 — smoke: file ter-generate, bukan audit kolom).

  [CATATAN QA] Expected alur = requirement PO §13.2 + TO-BE [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469).
  Requirement masih menyebut "tab Export File"; UI = slideover judul **Export**. Card AC menyebut **History Audit Log Export** dan **Active Page Only**; label opsi UI/requirement = **This Page Only**.
  Referensi: qa-docs/supplychain-purchase-order/requirement.md §3.3 & §13.2.
test_result:
  status: passed
  started_at: "2026-08-17 20:25"
  finished_at: "2026-08-17 20:27"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "PO: tidak ada Export Excel/CSV. Klik Export → slideover. Trigger This Page Only → baris history baru, status Ready to Download, file .xlsx. Action name di history = Export Active Page Only."
  report_url: null
test_data_used:
  - field: "UI fixture"
    value: "https://staging.olshoperp.com/supplychain/purchase-order"
  - field: "History sebelum trigger"
    value: "1 baris (Export Active Page Only 17-08-2026_20.25.41.xlsx)"
  - field: "History setelah This Page Only"
    value: "2 baris — baru: Purchase Order - Export Active Page Only 17-08-2026_20.26.25.xlsx ; Playwright User ; Ready to Download"
run_history:
  - at: "2026-08-17 20:27"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15469
first_execution:
  at: "2026-08-17 20:27"
  via: "legacy:test_result"
  jira: "ETM-15469"
last_execution:
  at: "2026-08-17 20:27"
  jira: "ETM-15469"
  status: passed
  via: "legacy:test_result"
---

## Catatan QA

Card: [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469). Golden flow di **Purchase Order** saja — 11 menu lain cukup UI checklist di `TC-PO-DRAFT-20260817200300`.

Kolom file With Details vs Without Details: requirement §13.2 (With Details termasuk SKU/harga; Without Details header only). Jangan fail TC ini hanya karena tidak membuka file Excel, kecuali user minta verifikasi isi.
