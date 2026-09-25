---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-06
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Humanized Wording pada Section What Held This Order Up"
summary: "Memastikan catatan penahanan pesanan (Holds / Error Flag) pada section What Held This Order Up disajikan dengan bahasa bisnis yang ramah operator dan bebas dari jargon teknis mentah."
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
  - field: "Sales Order Test"
    value: "SO-5TBW8NFJ / Order dengan Hold"
steps:
  - "1. Buka dokumen Sales Order yang memiliki riwayat hold atau error flag (misal kendala stok / hold pembayaran)"
  - "2. Buka panel Order Lifecycle"
  - "3. Gulir ke section 'What Held This Order Up'"
  - "4. Periksa deskripsi teks yang tampil pada daftar hold"
  - "5. Verifikasi ketiadaan kode error mentah backend (seperti 'stock-error', nama cron job, counter sync)"
expected_result: |
  1. Label hold disajikan menggunakan bahasa Indonesia/Inggris yang komunikatif dan ramah operator (humanized).
  2. Tidak ditemukan kode teknis database/backend mentah (seperti 'stock-error', 'order_sync_job', 'failed_attempt_3').
  3. Untuk status hold yang sudah terlepas (released), tercantum informasi waktu pelepasan.
  4. Untuk status hold yang masih aktif (open), tercantum informasi tindakan lanjutan (next action).
test_result:
  status: passed
  started_at: "2026-09-24T13:46:00+07:00"
  finished_at: "2026-09-24T13:53:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Section 'What Held This Order Up' menampilkan informasi penahanan pesanan secara komunikatif dan ramah operator (humanized). Tercantum penjelasan alur bisnis ('Waiting for the second approval level'), status 'released' lengkap dengan timestamp pelepasan ('released 28-05-2026 13:11:28' dan 'Held at 28-05-2026 13:05:28 and subsequently released'), serta tanpa ada jargon/error code mentah backend (memenuhi AC-5 dan AC-15)."
  report_url: null
test_data_used:
  - trx_code: "SO-5TBW8NFJ / SO-5UJDJFG0"
    actual_section_text: |
      Header: "Every point where the order stopped moving, why it stopped, and how it was released — so you can answer \"why is this order late?\" without opening five other menus. Anything still open is what needs your attention now."
      Item: "released 28-05-2026 13:11:28"
      Hold Reason: "Waiting for the second approval level"
      Timeline Note: "Held at 28-05-2026 13:05:28 and subsequently released."
    result: "Passed (Humanized & clean)"
run_history:
  - run_at: "2026-09-24T13:53:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Memenuhi AC-5 & AC-15: Informasi hold humanized, bebas jargon teknis mentah, mencantumkan waktu hold dan release."
first_execution:
  at: "2026-09-24T13:53:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T13:53:00+07:00"
  jira: "ETM-15893"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-06: Humanized Wording pada Section What Held This Order Up

## Objective
Menguji kualitas penyampaian informasi kendala pesanan (*Order Holds*) agar ramah bagi pengguna non-teknis / operator operasional, menghindari kebingungan akibat error code backend.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5TBW8NFJ` / `SO-5UJDJFG0`

### Hasil Pengujian (Actual vs Expected):
1. **Humanized Wording & Bebas Jargon Teknis (AC-5):**
   - *Actual:* Header section menjelaskan: *"Every point where the order stopped moving, why it stopped, and how it was released — so you can answer 'why is this order late?' without opening five other menus. Anything still open is what needs your attention now."* ✅
   - *Reason:* *"Waiting for the second approval level"* disajikan dalam bahasa bisnis yang jelas tanpa kode teknis seperti `approval_error` atau sejenisnya ✅.
2. **Keterangan Released & Waktu (AC-15):**
   - *Actual:* Status *"released 28-05-2026 13:11:28"* dan *"Held at 28-05-2026 13:05:28 and subsequently released."* tertera dengan timestamp yang presisi ✅.

### Kesimpulan:
**PASSED 🟢.**  
Section *What Held This Order Up* telah mengimplementasikan wording yang ramah operator (humanized) dan secara akurat menampilkan riwayat waktu penahanan serta pelepasan hold order sesuai kriteria AC-5 dan AC-15.

