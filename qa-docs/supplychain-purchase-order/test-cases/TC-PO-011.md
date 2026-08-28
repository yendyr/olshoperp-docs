---
doc_type: e2e-test-case
tc_code: TC-PO-011
menu: supplychain-purchase-order
menu_name: "Purchase Order"
test_type: cross-menu
title: "Status PO otomatis menjadi Complete setelah seluruh qty diterima via Purchase Inbound"
summary: "Setelah Purchase Inbound yang mencakup seluruh qty PO di-approve, status PO berubah otomatis dari Approved menjadi Complete di datalist — tanpa aksi manual di menu PO."
status: draft
owner: QA - Yemima
last_updated: 2026-08-26
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-new-purchase-inbound
preconditions:
  - "PO Approved dengan qty diketahui tersedia."
  - "Purchase Inbound yang mencakup SELURUH qty PO tersebut sudah dibuat dan di-approve."
test_data:
  - field: "PO code"
    value: "{kode PO approved dari precondition}"
steps:
  - "Buka datalist Purchase Order."
  - "Cari PO berdasarkan transaction code."
  - "Baca kolom Trx. Status pada baris PO tersebut."
expected_result: |
  Status PO otomatis menjadi **Complete** (requirement §Status machine:
  "complete — Otomatis, semua qty PO sudah diterima inbound approved";
  aturan: Σ order_quantity_in_base_unit = Σ processed_to_grn_quantity).
  Perubahan terjadi TANPA aksi manual di menu Purchase Order — murni dampak dari
  approve Purchase Inbound, sehingga membuktikan rantai PO → Inbound tersambung.
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
origin_jira: null
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-PO-011

## Catatan

- **Jenis `cross-menu`**: yang diverifikasi adalah *dampak* aksi di menu lain
  (approve Purchase Inbound), bukan aksi di menu Purchase Order itu sendiri.
  Karena itu TC ini di-`recalls` oleh flow `scm-ap-full` sebagai side-effect
  assertion phase 3 — bukan disalin langkahnya (rule 17 §1).
- Dipilih sebagai bukti side-effect karena **real-time**: status berubah langsung
  saat approve. Laporan stok tidak dipakai untuk keperluan ini — Real Time Stock
  requirement-nya masih `draft`, sedangkan Stock History punya delay kalkulasi
  hingga ~1 jam (lihat `qa-docs/flows/scm-ap-full/testcase.md` § TODO).
- Status **Closed** (manual stop sisa qty) adalah jalur berbeda dan belum ber-TC —
  kandidat TC berikutnya di menu ini.
