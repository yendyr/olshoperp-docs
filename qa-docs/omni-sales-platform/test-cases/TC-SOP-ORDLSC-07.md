---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-07
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Fungsionalitas Print Order Lifecycle dan Keselarasan Data Cetak"
summary: "Memastikan tombol Print pada panel Order Lifecycle berhasil membuka halaman/tampilan cetak dengan format rapi dan data yang identik 100% dengan tampilan di layar Slideover."
status: ready
owner: "QA - Yemima"
last_updated: 2026-09-30
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15893
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - businessdevelopment-sales-order-general
  - all-sales-order
test_data:
  - field: "Sales Order Test"
    value: "SO-5TBW8NFJ / SO-5UJF5WID"
steps:
  - "1. Buka form Edit dokumen Sales Platform SO-5TBW8NFJ / SO-5UJF5WID"
  - "2. Buka panel Order Lifecycle"
  - "3. Klik tombol 'Print' di bagian atas panel Slideover"
  - "4. Periksa dialog/halaman cetak yang muncul"
  - "5. Bandingkan angka Quantity, Money Trail, dan Status pada cetakan dengan tampilan di layar"
expected_result: |
  1. Halaman atau layout printout Order Lifecycle berhasil di-generate tanpa error 500.
  2. Judul dokumen cetak memuat 'Order Lifecycle' beserta identitas nomor order.
  3. Seluruh nilai pada tabel dan strip ringkasan (Qty, nominal uang, status) identik 100% dengan tampilan di UI Slideover.
  4. Tata letak cetak rapi dan siap untuk dicetak fisik maupun disimpan sebagai PDF.
test_result:
  status: passed
  started_at: "2026-09-30T10:00:00+07:00"
  finished_at: "2026-09-30T10:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Tombol Print Summary membuka tab baru (tidak me-replace tab aktif), layout cetak proporsional (tidak sempit rata kanan di Chrome), data tidak terduplikasi 2 halaman dan teks angka pada section Money tidak overflow keluar card (memenuhi AC-03)."
  report_url: "https://drive.google.com/file/d/1J_n7MK3HOd68ulTzR69GbqG7jbpc_dgU/view?usp=drive_link"
test_data_used:
  - trx_code_platform: "SO-5TBW8NFJ"
    evidence_url: "https://drive.google.com/file/d/1J_n7MK3HOd68ulTzR69GbqG7jbpc_dgU/view?usp=drive_link"
  - trx_code_general: "SO-5UJF5WID"
    evidence_url: "https://drive.google.com/file/d/1oNP_USwQj3HVEsoylaX0Y9zFb_Eg_wW0/view?usp=drive_link"
run_history:
  - run_at: "2026-09-24T14:25:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-3 (Print Layout): Konten terpotong & duplikat 2 halaman, broken UI text overflow section Money, print styling rata kanan sempit, tidak buka di tab baru."
  - run_at: "2026-09-30T10:15:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest PASSED (AC-03): Print Summary buka tab baru, layout proporsional, data utuh tanpa duplikasi, tidak ada text overflow."
first_execution:
  at: "2026-09-24T14:25:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-30T10:15:00+07:00"
  jira: "ETM-16098"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-07: Fungsionalitas Print Order Lifecycle dan Keselarasan Data Cetak

## Objective
Menguji fungsionalitas cetak dokumen *Order Lifecycle* melalui tombol Print pada Slideover, memastikan tata letak cetak rapi dan data angka yang tercetak sinkron dengan antarmuka web.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** dan retest pada **ETM-16098** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16098)).
- Dokumen Uji & Evidence Retest:
  1. SO Platform `SO-5TBW8NFJ`: https://drive.google.com/file/d/1J_n7MK3HOd68ulTzR69GbqG7jbpc_dgU/view?usp=drive_link
  2. SO General `SO-5UJF5WID`: https://drive.google.com/file/d/1oNP_USwQj3HVEsoylaX0Y9zFb_Eg_wW0/view?usp=drive_link

### Hasil Pengujian Retest (ETM-16098):
1. **Navigasi Tab:** Tombol Print Summary membuka tab browser baru (`_blank`) secara mandiri dan tidak lagi me-replace tab aktif ✅.
2. **Kelengkapan & Tampilan Layout:** Layout cetak tampil proporsional, memanfaatkan lebar kertas secara seimbang, tidak lagi condong sempit rata kanan di Chrome preview, dan data tercetak lengkap tanpa terduplikasi 2 halaman ✅.
3. **Komponen UI & Styling Money:** Teks angka pada section Money tertata rapi di dalam kotak card dan tidak mengalami *text overflow* ✅.

### Kesimpulan:
**PASSED 🟢 (AC-03 Terpenuhi).**  
Fitur Print Order Lifecycle telah diperbaiki dan memenuhi standar tampilan cetak dokumen.

