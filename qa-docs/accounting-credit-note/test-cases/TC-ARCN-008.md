---
doc_type: e2e-test-case
tc_code: TC-ARCN-008
menu: accounting-credit-note
menu_name: "Credit Note"
title: "E2E — Complete Sales Return billed → auto-generate Credit Note type COA"
summary: "E2E General: SO → SI billed → Sales Return billed → klik Complete → auto CN Approved type COA (Sales COA bukan Master Cash/Bank)."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 dual path; §6.6 Auto dari Sales Return Billed (fund type COA); §6.7 journal Dr fund / Cr Deposit; §7.3b skip reconcile jika semua fund COA"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-sales-return
  - accounting-customer-invoice
  - accounting-customer-payment
  - omni-sales-order-report
  - supplychain-mutation-outbound
card_ref: "ETM-15537 (relates ETM-15442 QA Review + ETM-15534; sumber TC berbeda)"
preconditions:
  - "Company lumicharmsid (id 153). Login punya privilege SO, wave/skip processing, Outbound, Sales Invoice, Account Receive, Sales Return (Complete), Credit Note."
  - "Customer General aktif (bukan Platform — invert billed platform out of scope). COA tagging lengkap termasuk Deposit COA."
  - "Store processed (without_processing = false) dengan warehouse process aktif. Jangan pakai store non-processed untuk jalur skip processing di TC ini."
  - "Product aktif, unit jual, Sales COA leaf Income yang TIDAK terikat Master Cash/Bank (supaya auto-CN dari SR billed = type COA, bukan Cash/Bank)."
  - "Stok cukup di warehouse process / 3PL sesuai jalur packing. Shipper aktif jika Skip Processing memakai collecting/shipping DO ke 3PL."
  - "Warehouse destination Sales Return punya scrap setup (has_scrap). Location Checking Area valid. Jangan pilih warehouse tanpa scrap — create SR ditolak Location has no scrap setup."
  - "Periode fiskal terbuka untuk tanggal SO / OT / SI / AR / SR."
  - "Sales Order Processing Date (SCM Setting, field sales_order_processing_date) HARUS >= tanggal transaksi SO yang akan di-wave. Jika processing date belum di-set ke tanggal order, atau lebih kecil dari tanggal order, SO stuck di wave/process karena dianggap process order dengan future date. Processing date tidak boleh di-set ke masa depan vs waktu sekarang (now)."
  - "Account Receive untuk SI: status harus Open (bukan Draft) sebelum Approve; amount fund = total SI."
  - "Jangan reuse SO leftover packed tanpa OT/SI. Fixture skip: SO-5U45Y9MD (id 2515556) — packed/DO, tidak ada OT/SI, 2 baris SKU duplikat."
test_data:
  - field: "Company"
    value: "lumicharmsid (id 153)"
  - field: "Customer"
    value: "Buyer Umum Offline Store (id 176)"
  - field: "Store"
    value: "Offline Store LUMI (id 71), WH process 72927 WH Gayungsari"
  - field: "Product"
    value: "CHARM-BEAR-BEADS-Green (id 58479), unit Pieces, Sales COA 5378 / 4-40104 (Income, bukan Master Cash/Bank)"
  - field: "Shipper"
    value: "Automation Test Shipper (id 1121)"
  - field: "VAT"
    value: "tax 25, 12%, included"
  - field: "SO date"
    value: "12-08-2026 10:00:00 (harus <= processing date)"
  - field: "Processing date (set before wave)"
    value: ">= SO date dan <= now; run 13 Aug 2026: 13-08-2026 20:02:27"
  - field: "Qty / price"
    value: "1 × 10.000 after VAT"
  - field: "Description marker"
    value: "ETM-15442 E2E billed SR → CN type COA"
  - field: "SR dest"
    value: "72954 WH Return GSB (RETURN-GSB), location_id 17 Checking Area"
  - field: "3PL origin after Skip Processing"
    value: "105287 SHIPPER AUTOMATION"
steps:
  - "PATH A — from scratch. PATH B — start from existing billed SI / Open SR di section Catatan QA. Keduanya wajib bisa diulang."
  - "Precondition Processing Date (WAJIB sebelum create/approve SO dan Send to Wave). Buka SCM Setting → Sales Order Processing Date (API GET/PATCH /api/supplychain/settings field sales_order_processing_date)."
  - "Catat nilai processing date sekarang. Tentukan tanggal SO yang akan dipakai (contoh 12-08-2026 10:00:00)."
  - "Jika processing date kosong, belum sama dengan tanggal SO, atau < tanggal SO: set processing date ke tanggal SO atau ke waktu sekarang (harus >= tanggal SO DAN <= now). Jangan set future vs now — API menolak."
  - "Jika processing date < tanggal SO lalu tetap Send to Wave / process: SO stuck (dianggap process order dengan future date). Ini bukan FAIL AC Credit Note — stop, perbaiki processing date, baru lanjut. Jangan pakai SO yang sudah stuck sebagai fixture SI."
  - "PATH A step 1: Buka /businessdevelopment/sales-order-general (company lumicharmsid). Create SO baru: customer Buyer Umum Offline Store, store Offline Store LUMI, date = tanggal yang sudah dicover processing date, 1 baris CHARM-BEAR-BEADS-Green qty 1 price 10000 after VAT, description ETM-15442 E2E billed SR → CN type COA. Jangan duplicate SKU di 2 baris."
  - "PATH A step 2: Approve SO. Send to Wave (POST /api/omnichannel/unassign-wave/{soId}/send-to-wave). Pastikan wave tidak gagal karena future date."
  - "PATH A step 3: Skip Processing SO (UI /omni/skip-processing atau POST /api/omnichannel/transfer-summary/bulk-skip-processing { data_ids: [soId] }). Setelah ETM-10761, Skip Processing TIDAK membuat Outbound Transfer / Sales Invoice. Stock pindah ke warehouse 3PL (SHIPPER AUTOMATION). Catat DO + TFI shipping do."
  - "PATH A step 4: Create Outbound Transfer dari origin 3PL (105287 SHIPPER AUTOMATION) — bukan WH Gayungsari. Tanggal OT harus >= datetime proses warehouse terakhir (bukan date-only; kalau OT date < last process datetime → ditolak outbound date must be on / after the transaction date of previous process). Qty 1, ref SO detail. Approve OT → SI auto-generated."
  - "PATH A step 5: Buka Sales Invoice hasil OT. Status Approved, customer General, amount = total SO, processed_to_payment_amount masih 0."
  - "PATH A step 6: Account Receive terhadap SI. Fund Cash/Bank, amount = total SI (jangan lebih). Status harus Open (bukan Draft) lalu Approve. SI menjadi billed (processed_to_payment_amount = total)."
  - "PATH A step 7: Create Sales Return billed: sales_order_code = SO, warehouse_destination yang has_scrap (WH Return GSB), location Checking Area, date >= OT datetime, accounting_type billed, restock qty 1. Jangan dest WH tanpa scrap."
  - "PATH A step 8: Di halaman edit Sales Return Accounting, klik tombol **Complete** (label UI: Complete; API POST /api/accounting/sales-returns/{id}/approve)."
  - "PATH A step 9: Cek Credit Note Auto Generate From SR: status Approved, Receiving Destination type COA (bukan Cash/Bank), GL Acc = Sales COA produk (4-40104), journal Dr Sales COA / Cr customer Deposit (General, non-invert)."
  - "PATH B — start from existing data (tanpa create master baru). Reuse customer/store/SKU di atas. Opsi 1: SI billed existing General + Sales COA bukan bank → lanjut dari step 7 (create SR billed). Opsi 2: SR Open billed existing https://staging.olshoperp.com/accounting/sales-return/edit/130292 → klik **Complete** (step 8–9). Opsi 3: SO approved yang processing date-nya sudah >= SO date dan belum stuck → lanjut dari wave/skip. Jangan mulai dari SO-5U45Y9MD."
expected_result: |
  Complete Sales Return billed sukses. Sistem auto-generate Credit Note (requirement §6.6): 1 CN per invoice, fund per Sales COA produk, status langsung Approved + jurnal.
  Karena Sales COA produk bukan Master Cash/Bank, fund type = COA (bukan Cash/Bank) — requirement §5.2 / §6.6 TO-BE.
  Journal default General (requirement §6.7): Debit COA fund (Sales COA) / Kredit Customer's Deposit COA. Platform invert out of scope.
  CN yang seluruh fund-nya type COA tidak kena cash bank reconcile lock (requirement §7.3b). Complete return tidak gagal hanya karena tidak ada baris Cash/Bank.
test_result:
  status: failed
  started_at: "2026-08-13 19:30"
  finished_at: "2026-08-13 21:10"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "lumicharmsid. Processing date awal 2026-08-04 (< SO 13 Aug) → SO stuck future date; set processing date 13-08-2026 20:02:27 lalu SO-5U46819A (12 Aug) wave+skip OK. Skip Processing tidak buat OT/SI (ETM-10761). OT-5U46CMZ4 dari 105287 date 13-08-2026 23:59:00 approve → SI-5U46GE92. AR RC-5U46IGC2 (Open, fund 10000) → SI billed. SR-5U46JLS9 billed dest 72954. Complete POST /api/accounting/sales-returns/130292/approve → 422 Chart of account ID is required for reconciliation validation. SR tetap Open. CN tidak persist (rollback). Gejala sama ETM-15534 tapi sumber TC = E2E billed SR auto-CN, bukan FAT manual CN Free COA."
  report_url: null
test_data_used:
  - field: "SO"
    value: "SO-5U46819A / id 2515560 / detail 3188592 / date 12-08-2026 10:00:00"
  - field: "OT"
    value: "OT-5U46CMZ4 / id 130291 / origin 105287 / date 2026-08-13 23:59:00"
  - field: "SI"
    value: "SI-5U46GE92 / id 9870 / billed 10.000"
  - field: "AR"
    value: "RC-5U46IGC2 / id 3183"
  - field: "SR"
    value: "SR-5U46JLS9 / id 130292 / platform SRP-5U46JLTN / dest 72954 WH Return GSB"
  - field: "endpoint"
    value: "POST /api/accounting/sales-returns/130292/approve"
  - field: "Sales COA"
    value: "5378 / 4-40104 (bukan Master Cash/Bank)"
  - field: "Processing date"
    value: "13-08-2026 20:02:27 (set dari 2026-08-04)"
run_history:
  - at: "2026-08-13 21:10"
    status: fail
    by: "QA - Yemima (Playwright MCP)"
last_execution:
  at: "2026-08-13"
  jira: null
  status: failed
  via: "legacy:test_result"
---

## Catatan QA

AC ETM-15442 yang diuji: baris fund CN otomatis dari **Sales Return billed** yang memakai Sales COA (bukan Master Cash/Bank) harus `type = COA`, CN **Approved** + jurnal langsung.

Fixture run 13 Aug 2026 (staging, lumicharmsid, login Yemima Staging):

| Dokumen | Kode / URL |
|---------|------------|
| SO | [SO-5U46819A](https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2515560) |
| Outbound | [OT-5U46CMZ4](https://staging.olshoperp.com/supplychain/mutation-outbound/edit/130291) |
| SI | [SI-5U46GE92](https://staging.olshoperp.com/accounting/customer-invoice/edit/9870) |
| AR | [RC-5U46IGC2](https://staging.olshoperp.com/accounting/customer-payment/edit/3183) |
| SR | [SR-5U46JLS9](https://staging.olshoperp.com/accounting/sales-return/edit/130292) — status **Open** (Complete rollback) |

**Jangan reuse:** SO-5U45Y9MD id 2515556 (packed/DO, tidak ada OT/SI).

### Precondition — Sales Order Processing Date (step-by-step)

Ditemukan saat run: processing date company masih **2026-08-04** sementara SO bertanggal **13 Aug / 12 Aug**. Wave `SOApproveToWave` menolak SO jika `transaction_date > processing_date` → order **stuck** (dianggap process future date).

1. Buka **SCM Setting → Sales Order Processing Date** (bukan setting store).
2. Bandingkan nilai dengan **tanggal SO** yang akan di-wave.
3. Jika processing date **belum di-set ke tanggal order** atau **lebih kecil** dari tanggal order → set ke tanggal SO atau ke waktu sekarang.
4. Syarat set: **>= tanggal SO** dan **<= now** (future vs `now()` ditolak).
5. Setting ini **company-wide** untuk lumicharmsid — cek dampak SO lain sebelum mengubah di staging bersama.
6. Baru Approve SO / Send to Wave / Skip Processing.

Ini **precondition alur**, bukan FAIL AC Credit Note.

### PATH B — start from existing data

Tanpa create customer/SKU baru:

1. **SR Open billed** https://staging.olshoperp.com/accounting/sales-return/edit/130292 (`SR-5U46JLS9`) → klik **Complete** untuk retest finding.
2. Atau **SI billed** `SI-5U46GE92` jika masih ada qty yang bisa di-return → create SR billed baru lalu Complete.
3. Master yang boleh dipakai ulang: customer 176, store 71, SKU 58479, shipper 1121, dest return 72954.

### Actual result (13 Aug 2026)

| Langkah | Hasil |
|---------|--------|
| Set processing date 13-08-2026 20:02:27 | Lolos; SO 12 Aug bisa di-wave |
| SO-5U46819A approve + skip processing | Packed/DO; stock di 105287; **tidak** ada OT/SI |
| OT dari 105287, date 13-08-2026 23:59:00 | Approve → SI-5U46GE92 |
| AR Open amount 10.000 approve | SI billed |
| Create SR billed dest WH Return GSB | SR-5U46JLS9 Open |
| Klik **Complete** | **Gagal.** `POST /api/accounting/sales-returns/130292/approve` HTTP **422** |
| Toast / API message | Title: `Failed to process your request`. Message: `Chart of account ID is required for reconciliation validation.` |
| Status SR | Tetap **Open** |
| Credit Note | **Tidak terbentuk** (transaksi rollback) |
| Journal | **Tidak terbit** |

**Expected vs actual:** expected CN Auto Generate Approved type **COA** + journal Dr 4-40104 / Cr Deposit. Actual: klik **Complete** ditolak reconcile lock, tidak ada CN.

Gejala API sama dengan [ETM-15534](https://erpintegration.atlassian.net/browse/ETM-15534) (manual CN Free COA FAT `CN-5U43L1SR`). Card Error baru: [ETM-15537](https://erpintegration.atlassian.net/browse/ETM-15537) — sumber TC berbeda: E2E billed SR auto-CN vs FAT create+approve manual. Relates ETM-15534 + ETM-15442. Kedua card harus bisa di-retest terpisah.
