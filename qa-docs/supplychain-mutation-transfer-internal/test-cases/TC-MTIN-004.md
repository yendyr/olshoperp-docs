---
doc_type: e2e-test-case
tc_code: TC-MTIN-004
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "BulkColliAction — Existing, New Colli, dan loose (null colli)"
summary: "Flow 1/2a BETA: assign colli via toolbar bulk — dari colli origin, loose ke colli dest, dan loose tanpa colli; plus reset colli saat ganti lokasi."
status: draft
owner: QA - Yemima
last_updated: 2026-09-01
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md §7.1, §7.2, V-TFI-10"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-colli-type
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Stok di RAK-S-1-A-1 via PO PO-6A8BF899 + Inbound IN-5U843NDK (Approved) — sama fixture TC-MTIN-003."
  - "Dokumen BETA Draft/Open: Origin RAK-S-1-A-1, Destination header Seruni DropOff."
  - "Minimal satu Colli Type Active (Default ON) untuk opsi New Colli."
test_data:
  - field: "Item Transfer Setup"
    value: |
      | Kasus | SKU | Qty | Colli Origin | Colli Destination | Flow requirement |
      | --- | --- | --- | --- | --- | --- |
      | A | SKU-TFI01 | 15 | COL-6A8BFA70 | COL-6A8C0379 (Existing) | §7.2a assign ke colli existing |
      | B | SKU-TFI02 | 20 | loose | COL-6A8C0379 (same dest) | §7.2a multi-SKU satu colli dest |
      | C | SKU-TFI01 | 10 | loose | null (loose) | §7.1a tanpa colli |
steps:
  - "Buka edit dokumen BETA (new-mutation-transfer-internal)."
  - "Kasus A — colli origin → Existing colli dest: Available Product → Use baris SKU-TFI01 COL-6A8BFA70; set qty 15; Save detail."
  - "Centang baris Kasus A → toolbar BulkColliAction → Existing Colli → pilih COL-6A8C0379 (harus muncul di filter struktur WH origin; tidak boleh colli yang lokasinya persis sama dengan lokasi origin stock baris — requirement §7.1)."
  - "Kasus B — loose → colli dest sama: Select Product SKU-TFI02 qty 20 (loose path); centang baris A+B → BulkColliAction → Existing Colli COL-6A8C0379 → Save."
  - "Kasus C — loose → loose: Select Product SKU-TFI01 qty 10 dari stok loose; jangan assign colli destination."
  - "Save All — verifikasi Group View: Colli Origin/Destination per kasus."
  - "Sub-case V-TFI-10 (GAP-TFI-01): pada baris yang sudah punya Colli Destination, ubah Location Destination baris ke WH lain (beda lokasi colli) → Colli Destination harus NULL; assign ulang jika lokasi cocok."
expected_result: |
  - Kasus A: Colli Origin COL-6A8BFA70, Colli Destination COL-6A8C0379, qty 15.
  - Kasus B: Colli Origin null, Colli Destination COL-6A8C0379, qty 20 — multi-SKU dalam colli dest yang sama dengan A.
  - Kasus C: Colli Origin dan Destination null, qty 10.
  - BulkColliAction Existing tidak menampilkan colli code = origin baris terpilih (anti self — §7.1).
  - Setelah ubah Location Destination sehingga ≠ lokasi colli dest: Colli Destination = NULL (requirement §7.1 / V-TFI-10). Jika sistem belum NULL → catat FAIL vs GAP-TFI-01.
test_result:
  status: passed
  started_at: "2026-08-24T15:15:00+07:00"
  finished_at: "2026-08-24T16:13:45+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS (2026-08-24) TFI-5U848VM3 — sebelum revise steps pakai assign manual. Re-test wajib setelah align BulkColliAction + V-TFI-10."
  report_url: null
test_data_used:
  - "TFI-5U848VM3"
run_history:
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS TFI-5U848VM3 — colli options (run lama, steps manual)."
  - at: "2026-09-01"
    status: revised
    environment: staging
    note: "Align requirement v2.0 §7 BulkColliAction + V-TFI-10 / GAP-TFI-01. Re-test required."
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

# TC-MTIN-004

## Catatan QA

Downstream: TC-MTIN-006 recall fixture dari TC ini. Requirement §7.1 Flow New/loose, §7.2a Existing multi-SKU. Colli Type: sama PI (Active, Default ON).
