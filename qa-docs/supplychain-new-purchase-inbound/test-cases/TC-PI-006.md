---
doc_type: e2e-test-case
tc_code: TC-PI-006
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: edge
title: "Import inbound — nomor urut colli: kosong = tanpa colli; nomor sama = satu colli"
summary: "Import template: kolom colli/nomor urut kosong → SKU tidak masuk colli; nomor urut identik → auto-generate satu colli code untuk semua baris tersebut."
status: draft
owner: QA - Cursor
last_updated: 2026-08-20
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Purchase Inbound Draft/Open; header lengkap."
  - "Template import inbound colli V2 tersedia (kolom nomor urut colli — catat nama kolom exact dari template UI)."
  - "PO Approved dengan minimal tiga SKU outstanding."
  - "Tidak ada import lain sedang berjalan (`Please wait, other import is being process` — requirement §9.3 #7)."
test_data:
  - field: "Baris 1 — SKU A"
    value: "Nomor urut colli = 1"
  - field: "Baris 2 — SKU B"
    value: "Nomor urut colli = 1 (sama dengan baris 1)"
  - field: "Baris 3 — SKU C"
    value: "Nomor urut colli = kosong"
steps:
  - "Buka edit Purchase Inbound Draft/Open."
  - "Siapkan file Excel import: SKU A dan SKU B nomor urut **1**; SKU C nomor urut **kosong**; qty/unit valid ≤ outstanding."
  - "Import file; tunggu selesai; cek import log jika ada baris gagal."
  - "Save All bila perlu; buka detail grid."
  - "Verifikasi SKU A dan SKU B: **Colli code sama** (auto-generate setelah import sukses)."
  - "Verifikasi SKU C: kolom **Colli code kosong** → SKU **tidak** dimasukkan ke colli."
expected_result: |
  ETM-15528 catatan dev poin 9:
  - Kolom kode/nomor urut **kosong** → SKU dianggap **tidak** dimasukkan ke colli.
  - Input **nomor urut** → setelah import sukses sistem **auto-generate colli code** untuk SKU yang diinput nomor urutnya.
  - **Nomor urut sama** di beberapa baris → dijadikan **satu colli** (multi-SKU).

  Validasi import PO/SKU/qty tetap berlaku (requirement §9.3 #1–3).

  [CATATAN QA] Template import Colli V2 belum terdetail di requirement §9.2 (masih model colli qty × isi). Verifikasi nama kolom dari template UI staging.
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
origin_jira: ETM-15528
last_execution:
  at: null
  jira: null
---

# TC-PI-DRAFT-20260820091829
