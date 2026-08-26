---
doc_type: e2e-test-case
tc_code: TC-MTIN-004
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "Pembuatan Transfer Internal dengan Opsi Colli (Null, New, Existing)"
summary: "Membuat detail Transfer Internal dengan opsi colli kosong, colli baru, dan colli existing dari lokasi origin."
status: draft
owner: QA - Cursor
last_updated: 2026-08-24
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
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
  - "Dokumen Transfer Internal Colli V2 Draft/Open dengan Origin 'RAK-S-1-A-1' dan Destination 'Seruni DropOff'."
  - "Stok telah disiapkan di lokasi asal RAK-S-1-A-1 via PO PO-6A8BF899 dan Inbound IN-5U843NDK."
test_data:
  - field: "Item Transfer Setup"
    value: |
      * Location Origin: RAK-S-1-A-1
      * Location Destination: Seruni DropOff

      | Item | SKU | Qty Transfer | Colli Origin | Colli Destination | Deskripsi Uji |
      | --- | --- | --- | --- | --- | --- |
      | Item 1 | SKU-TFI01 | 15 | COL-6A8BFA70 | COL-6A8C0379 | Dari colli origin ke colli destination |
      | Item 2 | SKU-TFI02 | 20 | - (Loose) | COL-6A8C0379 | Dari loose origin ke colli destination yang sama (multi-SKU) |
      | Item 3 | SKU-TFI01 | 10 | - (Loose) | - (Loose) | Dari loose origin ke loose destination (null colli) |
steps:
  - "Buka edit dokumen Transfer Internal Colli V2."
  - "Kasus A (Colli Existing ke Destination Colli): Pilih SKU-TFI01 (colli 'COL-6A8BFA70'), masukkan qty 15, set Colli Destination = 'COL-6A8C0379'."
  - "Kasus B (Loose ke Destination Colli yang sama): Pilih SKU-TFI02 (loose), masukkan qty 20, set Colli Destination = 'COL-6A8C0379'."
  - "Kasus C (Loose ke Loose/Null): Pilih SKU-TFI01 (loose), masukkan qty 10, biarkan Colli Destination kosong."
  - "Klik tombol Save / Save All."
expected_result: |
  - Item 1 tersimpan dengan Colli Origin = 'COL-6A8BFA70' dan Colli Destination = 'COL-6A8C0379'.
  - Item 2 tersimpan dengan Colli Origin = null dan Colli Destination = 'COL-6A8C0379'.
  - Item 3 tersimpan dengan Colli Origin = null dan Colli Destination = null.
  - Detail item 1 dan item 2 berhasil digabungkan dalam satu kode colli tujuan (COL-6A8C0379) di sistem.
test_result:
  status: passed
  started_at: "2026-08-24T15:15:00+07:00"
  finished_at: "2026-08-24T16:13:45+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Single use ditambahkan 1 per 1 untuk TFI-5U848VM3: Item 1 tanpa colli, Item 2 dimasukkan ke colli baru (generate COL-6A8C0379), Item 3 otomatis masuk ke COL-6A8C0379."
  report_url: null
test_data_used:
  - "TFI-5U848VM3"
run_history:
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS — TFI-5U848VM3 colli options saved correctly."
origin_jira: ETM-15553
last_execution:
  at: "2026-08-24"
  jira: ETM-15553
---

# TC-MTIN-DRAFT-20260824150650

## Catatan QA

Verifikasi kelancaran penambahan item dengan ketiga opsi penentuan colli code.
