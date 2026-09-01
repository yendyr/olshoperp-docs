---
doc_type: e2e-test-case
tc_code: TC-MTIN-005
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: edge
title: "Filter Existing Colli (struktur origin) & kolom Full Trf / Group View"
summary: "TF BETA: dropdown Existing Colli dari struktur WH origin (bukan exact WH dest seperti PI); exclude same loc as origin stock; kolom UI Full Trf hidden & Colli read-only di Group View."
status: draft
owner: QA - Yemima
last_updated: 2026-09-01
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md §7.1, §7.3, GAP-TFI-03"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-new-purchase-inbound
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Dokumen BETA Draft/Open dengan detail minimal 1 baris (loose atau colli-bound) di origin RAK-S-1-A-1."
  - "Di struktur WH origin sudah ada colli terdaftar (mis. COL-DEST-01 atau colli dari inbound) — lokasinya **bukan** persis sama dengan lokasi origin stock baris uji."
  - "Catatan: TF filter Existing dari **struktur origin**, bukan exact WH destination header seperti Purchase Inbound (requirement §7.3)."
test_data:
  - field: "Origin & colli fixture"
    value: |
      * Origin header/detail: RAK-S-1-A-1
      * Destination header: Seruni DropOff (boleh beda level tree)
      * Colli existing contoh: COL-DEST-01 di subtree origin (verify di Multisku Colli / inbound)
steps:
  - "Buka edit dokumen BETA."
  - "Pastikan baris detail punya Location Destination (leaf) dan Colli Origin terisi jika uji colli-bound."
  - "Centang baris → BulkColliAction → Existing Colli — buka dropdown/select2."
  - "Verifikasi opsi colli yang tampil berasal dari struktur WH **origin** (bukan hanya colli yang lokasinya = destination header Seruni DropOff semata)."
  - "Verifikasi colli yang lokasinya **persis sama** dengan lokasi origin stock baris **tidak** muncul di opsi Existing (requirement §7.1 / GAP-TFI-03)."
  - "Detail grid: kolom Full Trf (Full COLLI Transfer) default **tidak visible** (hidden); aktifkan column show jika perlu — nilai Yes/No."
  - "Group View: kolom Colli Code/Destination **read-only** (tidak editable inline)."
expected_result: |
  - Dropdown Existing Colli menampilkan colli valid di struktur WH origin (§7.3 — beda dari PI yang filter exact WH dest header).
  - Colli pada lokasi yang sama persis dengan origin stock baris **excluded** dari opsi.
  - Kolom Full Trf hidden by default di detail grid.
  - Group View: informasi colli read-only.
  - Jika filter same-loc exclude belum ada di UI → FAIL vs GAP-TFI-03 (bukan expected lulus diam-diam).
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history:
  - at: "2026-09-01"
    status: revised
    environment: staging
    note: "Align requirement v2.0 §7.3 — ganti asumsi 'colli di lokasi tujuan' (salah, mirip PI) ke filter struktur origin + exclude same loc."
origin_jira: ETM-15553
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

# TC-MTIN-005

## Catatan QA

**Perbaikan utama vs draft lama:** precondition "colli di Seruni DropOff" = pola PI — **tidak** apply ke TF (requirement §7.3). `test_type: edge` karena verifikasi filter & kolom UI.
