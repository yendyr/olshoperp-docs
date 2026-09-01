---
doc_type: e2e-test-case
tc_code: TC-MTIN-006
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: cross-menu
title: "Approve TFI Colli v2 & verifikasi mutasi stok (Stock Monitoring)"
summary: "Approve dokumen BETA setelah TC-MTIN-004; cek saldo origin/dest per loose vs colli dest; invariant 1 colli = 1 lokasi post-approve."
status: draft
owner: QA - Yemima
last_updated: 2026-09-01
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md §6.6, §7.2, §7.3, V-TFI-09"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-product-mutation-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Dokumen BETA lengkap detail sesuai **TC-MTIN-004** (kasus A/B/C) — status Open."
  - "Stok awal RAK-S-1-A-1: SKU-TFI01 loose 100, COL-6A8BFA70 100; SKU-TFI02 loose 100, COL-6A8BFA83 100."
  - "Tidak ada reserved qty lain pada colli yang dipindah (whole-colli invariant — V-TFI-09)."
test_data:
  - field: "Qty transfer (dari TC-MTIN-004)"
    value: |
      | Kasus | SKU | Qty | Dampak origin | Dampak dest (Seruni DropOff / colli dest) |
      | --- | --- | --- | --- | --- |
      | A | SKU-TFI01 | 15 | COL-6A8BFA70 -15 | +15 under COL-6A8C0379 |
      | B | SKU-TFI02 | 20 | loose -20 | +20 under COL-6A8C0379 |
      | C | SKU-TFI01 | 10 | loose -10 | +10 loose |
  - field: "URL edit (isi setelah create)"
    value: "https://staging.olshoperp.com/supplychain/new-mutation-transfer-internal/edit/{id}"
steps:
  - "Buka dokumen BETA hasil TC-MTIN-004 (Open)."
  - "Klik Approve — tunggu status Approved tanpa error."
  - "Buka Stock Monitoring / mutasi stok — lokasi Origin RAK-S-1-A-1."
  - "Verifikasi saldo: SKU-TFI01 loose 90; COL-6A8BFA70 85; SKU-TFI02 loose 80; COL-6A8BFA83 tetap 100 (tidak ditransfer)."
  - "Verifikasi lokasi Destination / colli COL-6A8C0379: +15 SKU-TFI01, +20 SKU-TFI02; loose dest +10 SKU-TFI01."
  - "Multisku Colli list: COL-6A8C0379 permanen setelah approve (requirement §7.3 lifecycle)."
  - "(Out of scope TC ini) Whole colli relocate + reserved elsewhere — uji terpisah vs V-TFI-09 / GAP-TFI-04."
expected_result: |
  - Approve sukses; reserved detail released; mutasi stok sesuai tabel test_data.
  - Origin: pengurangan akurat per stock ID / colli origin.
  - Destination: loose +10 SKU-TFI01; colli COL-6A8C0379 berisi +15 SKU-TFI01 dan +20 SKU-TFI02 (multi-SKU wadah).
  - COL-6A8BFA83 qty unchanged di origin.
  - Satu code colli dest = satu lokasi setelah approve (invariant §7).
test_result:
  status: passed
  started_at: "2026-08-24T15:15:00+07:00"
  finished_at: "2026-08-24T16:13:45+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS (2026-08-24) TFI-5U848VM3. Re-test setelah TC-MTIN-004 revised (BulkColliAction)."
  report_url: null
test_data_used:
  - "TFI-5U848VM3"
run_history:
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS mutasi stok TFI-5U848VM3."
  - at: "2026-09-01"
    status: revised
    environment: staging
    note: "Align requirement v2.0 §6.6/§7; precondition TC-MTIN-004; catat scope V-TFI-09 terpisah."
origin_jira: ETM-15553
first_execution:
  at: "2026-08-24"
  via: "legacy:test_result"
  jira: ETM-15553
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-MTIN-006

## Catatan QA

Recall TC-MTIN-004 (bukan kode DRAFT lama). Whole colli relocate + reserved block = skenario future (GAP-TFI-04), tidak dicampur expected happy path ini.
