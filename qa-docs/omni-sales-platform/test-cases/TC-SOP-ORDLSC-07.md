---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-07
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Fungsionalitas Print Order Lifecycle dan Keselarasan Data Cetak"
summary: "Memastikan tombol Print pada panel Order Lifecycle berhasil membuka halaman/tampilan cetak dengan format rapi dan data yang identik 100% dengan tampilan di layar Slideover."
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
  - businessdevelopment-sales-order-general
  - all-sales-order
test_data:
  - field: "Sales Order Test"
    value: "SO-5TBW8NFJ"
steps:
  - "1. Buka form Edit dokumen Sales Platform SO-5TBW8NFJ"
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
  status: failed
  started_at: "2026-09-24T14:00:00+07:00"
  finished_at: "2026-09-24T14:25:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED: Fitur Print Summary terbuka tanpa error 500 namun mengalami multiple defect layout & rendering: (1) Tidak membuka di tab baru melainkan me-replace tab aktif, (2) Konten cetak terpotong dan terduplikasi menjadi 2 halaman dengan informasi yang sama terpotong, (3) Broken UI pada section 'Money -' di mana teks/komponen nilai keluar dari batas card (overflow), dan (4) Layout print terlalu sempit dan rata kanan dengan banyak whitespace kosong di sebelah kiri (tidak responsif pada Chrome print preview)."
  report_url: "https://app.betterbugs.io/session/6ab4d3b1587953ccdcfdb2be"
test_data_used:
  - trx_code: "SO-5TBW8NFJ"
    actual_defects:
      - "Tab navigasi: Tidak membuka di tab baru (_blank), tetap di tab aktif form edit."
      - "Data terpotong: Hanya menampilkan Header, Quantity, dan Order Lifecycle Timeline (terpotong pula), terduplikasi ke halaman 2 dengan data terpotong yang sama."
      - "Broken UI: Pada section 'Money -', komponen teks kartu (order amount, invoiceable value, sales invoice, dll) overflow/keluar dari batas space card."
      - "Print stylesheet alignment: Tampilan print preview Chrome terlalu sempit dan rata kanan, menyisakan space kosong besar di sebelah kiri."
    expected: "Printout membuka di tab baru, data lengkap 100% tanpa kepotong (memenuhi AC-3), layout rapi proporsional, dan tidak ada komponen overflow."
run_history:
  - run_at: "2026-09-24T14:25:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-3 (Print Layout): Konten terpotong & duplikat 2 halaman, broken UI text overflow section Money, print styling rata kanan sempit, tidak buka di tab baru."
first_execution:
  at: "2026-09-24T14:25:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T14:25:00+07:00"
  jira: "ETM-15893"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-07: Fungsionalitas Print Order Lifecycle dan Keselarasan Data Cetak

## Objective
Menguji fungsionalitas cetak dokumen *Order Lifecycle* melalui tombol Print pada Slideover, memastikan tata letak cetak rapi dan data angka yang tercetak sinkron dengan antarmuka web.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5TBW8NFJ` (Sales Platform).

### Temuan Defect Hasil Pengujian:
1. **Navigasi Tab:**
   - *Actual:* Halaman cetak terbuka di tab yang sama (tidak membuka tab baru `_blank`), mengganggu alur kerja pengguna pada form edit yang sedang dibuka ❌.
   - *Expected:* Tombol print seharusnya membuka window/tab baru atau memicu `window.print()` tanpa me-replace tab form aktif.
2. **Data Terpotong & Duplikasi Halaman:**
   - *Actual:* Konten pada print preview terpotong parah, hanya memuat Header, Quantity, dan Order Lifecycle Timeline (yang juga terpotong). Print preview menghasilkan 2 halaman dengan data terpotong yang sama secara berulang ❌.
   - *Expected:* Sesuai kriteria AC-3, seluruh section panel (Header, Quantity, Timeline, Related Transactions, Marketplace Connection, Money Trail, dan What Held This Order Up) harus tercetak utuh dan berkesinambungan.
3. **Broken UI Komponen (Section Money):**
   - *Actual:* Pada section *Money -*, komponen teks di dalam kartu (seperti `order amount`, `invoiceable value`, `sales invoice`, dsb) mengalami *overflow* dan keluar dari batasan kotak kartu ❌.
   - *Expected:* Komponen kartu memiliki *print stylesheet* yang aman dan teks menyesuaikan lebar kartu tanpa meluap keluar batas (*overflow*).
4. **Layout Print View Terlalu Sempit & Rata Kanan:**
   - *Actual:* Pada Chrome print preview, seluruh dokumen menciut sempit dan condong rata kanan (*right-aligned*), menyisakan area kosong putih (*whitespace*) yang sangat luas di sisi kiri ❌.
   - *Expected:* Layout cetak responsif dan proporsional memanfaatkan lebar kertas cetak (A4/Portrait atau Landscape) secara seimbang (*centered / full width*).

### Kesimpulan:
**FAILED ❌ (Defect AC-3 — Print Layout & CSS Print Media broken).**  
Fitur cetak ringkasan belum siap digunakan karena layout cetak terpotong, styling kartu uang meluap (*broken UI*), serta alignment media cetak belum proporsional.

