---
doc_type: e2e-test-case
tc_code: TC-MTIN-012
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: negative
title: "Validasi Pembatasan 1 Colli untuk 1 Location Destination"
summary: "Memastikan sistem memblokir pembuatan atau penggabungan item ke dalam satu colli destination jika item-item tersebut memiliki inline location destination yang berbeda."
status: draft
owner: QA - Yemima
last_updated: 2026-08-30
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login ke OlshopERP."
  - "Company aktif: DEV-STG (13)."
  - "SKU-COLLI01 dan SKU-COLLI02 berada di colli origin COL-6A912EB5."
  - "SKU-COLLI03 dan SKU-COLLI05 tidak terikat colli (loose)."
test_data:
  - field: "Transaction Code"
    value: "TFI-5U9LS05R"
  - field: "Location Origin"
    value: "seruni drop ff"
  - field: "Location Destination Default"
    value: "rak-s-1-a-1"
steps:
  - "Buka dokumen Transfer Internal baru (Draft/Open) atau gunakan TFI-5U9LS05R."
  - "Kasus A (SKU terikat Colli Origin):"
  - "  - Bulk use produk SKU-COLLI01, SKU-COLLI02, dan SKU-COLLI03."
  - "  - Ubah inline location destination SKU-COLLI01 dari 'rak-s-1-a-1' menjadi 'shelf1'."
  - "  - Centang SKU-COLLI01 dan SKU-COLLI02 (memiliki location destination berbeda)."
  - "  - Di pilihan colli type, pilih New Colli (ukuran CT-QA-001) lalu klik Create Colli."
  - "  - Amati keberhasilan pembuatan colli dan kode colli tujuan."
  - "Kasus B (SKU Loose / Tanpa Colli Origin):"
  - "  - Bersihkan detail."
  - "  - Bulk use SKU-COLLI03 dan SKU-COLLI05."
  - "  - Ubah location destination SKU-COLLI03 ke 'shelf1' dan SKU-COLLI05 biarkan 'rak-s-1-a-1'."
  - "  - Centang kedua SKU, masukkan ke existing colli, lalu klik Create Colli."
  - "  - Amati keberhasilan penggabungan."
expected_result: |
  Sistem harus mendeteksi perbedaan location destination pada item yang dicentang dan memblokir pembuatan colli destination. 1 Colli secara logis hanya boleh berada di 1 location destination (tidak boleh 1 colli tersebar di beberapa lokasi sekaligus).
test_result:
  status: failed
  started_at: "2026-08-30T14:00:00+07:00"
  finished_at: "2026-08-30T15:00:00+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "FAIL — Sistem meloloskan pembuatan colli destination COL-6A94365C untuk SKU-COLLI01 (dest: shelf1) dan SKU-COLLI02 (dest: rak-s-1-a-1) meskipun lokasinya berbeda. Hal yang sama terjadi untuk loose SKU-COLLI03 dan SKU-COLLI05 di mana penggabungan colli tetap sukses dilakukan meskipun lokasi tujuannya berbeda."
  report_url: null
test_data_used:
  - "TFI-5U9LS05R"
run_history:
  - at: "2026-08-30"
    status: failed
    environment: staging
    note: "FAIL — Logical bug: 1 colli berada di 2 location destination berbeda."
origin_jira: ETM-15553
last_execution:
  at: "2026-08-30"
  jira: "ETM-15553"
  status: failed
  via: "manual:p"
  notes: "Verifikasi pengujian manual: status tersimpan, respon validasi dan datalist sesuai expected."
first_execution:
  at: "2026-08-30"
  via: "manual:p"
  jira: "ETM-15553"
---

# TC-MTIN-012

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi kendali integritas lokasi satu colli.
- **Relasi JIRA:** Terkait dengan card `ETM-15553`.
