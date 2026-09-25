---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-02
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Tampilan Layout dan Persona Mode Sales Platform pada Order Lifecycle"
summary: "Memastikan panel Order Lifecycle pada order Sales Platform menampilkan chip Platform order, identitas platform (Order ID, Booking No, Store, Buyer), status rail platform, card Marketplace Connection, dan tidak menampilkan elemen milik General order."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-24
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15893
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - all-sales-order
test_data:
  - field: "Sales Order Platform Code"
    value: "SO-5TBW8NFJ"
steps:
  - "1. Buka form Edit dokumen Sales Platform SO-5TBW8NFJ"
  - "2. Klik menu 'Order Lifecycle' di navigasi kanan"
  - "3. Periksa chip tipe order dan identitas header pada panel"
  - "4. Periksa status rail di bagian atas timeline"
  - "5. Periksa section ke-5 untuk memastikan kehadiran card 'Marketplace Connection'"
  - "6. Periksa seluruh panel dan pastikan tidak ada card 'Customer & Terms' atau rail 'Approval Level' (milik General)"
expected_result: |
  1. Header menampilkan chip 'Platform order'.
  2. Identitas menampilkan: Platform Order ID, Booking Number / No Resi, Store Name, dan Buyer Name.
  3. Status rail menampilkan tahapan alur platform: Platform · Booking · Failed Ship · Invoice (+ Internal).
  4. Section ke-5 menampilkan card 'Marketplace Connection' yang berisi rincian sinkronisasi toko/channel.
  5. Elemen khusus General order (seperti Customer PO, Customer & Terms, dan Approval Level) disembunyikan secara rapi (tidak muncul).
test_result:
  status: passed
  started_at: "2026-09-24T10:45:00+07:00"
  finished_at: "2026-09-24T10:56:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Panel Order Lifecycle pada SO Platform (SO-5TBW8NFJ) berhasil menampilkan chip Platform order, identitas marketplace, alur timeline platform, dan card Marketplace Connection. Elemen khusus General order tersembunyi dengan benar."
  report_url: "https://app.betterbugs.io/session/6ab4a37e587953ccdcfdaee6"
test_data_used:
  - trx_code: "SO-5TBW8NFJ"
    type: "Platform order"
    verified_elements:
      - "Chip 'Platform order'"
      - "Detail Sales Order Platform"
      - "Timeline alur marketplace"
      - "Card 'Marketplace Connection (platform order only)'"
run_history:
  - run_at: "2026-09-24T10:56:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
first_execution:
  at: "2026-09-24T10:56:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T10:56:00+07:00"
  jira: "ETM-15893"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-02: Tampilan Layout dan Persona Mode Sales Platform pada Order Lifecycle

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5TBW8NFJ` (Sales Platform)
- Environment: Staging

### Actual Result:
1. Header berhasil menampilkan chip **Platform order** dan judul **Detail Sales Order Platform** ✅.
2. Timeline memuat tahapan alur marketplace: *Order arrives from marketplace ➔ Warehouse process ➔ Shipping ➔ Failed ship ➔ Settlement & payment ➔ Return after settlement* ✅.
3. Muncul card integrasi **Marketplace Connection** (*Platform order only*) ✅.
4. Elemen khusus General order (seperti Customer & Terms) tidak muncul pada panel platform ✅.
5. **Kesimpulan:** **PASSED 🟢**. Persona layout khusus Sales Platform telah terisolasi dan tampil sesuai spesifikasi AC-6.
