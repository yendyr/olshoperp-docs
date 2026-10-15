---
doc_type: e2e-test-case
tc_code: TC-SSM-DATA-001
menu: omni-stock-shortage-monitoring
menu_name: "Stock Shortage Monitoring"
test_type: data-validation
title: "Validasi data Stock Shortage Monitoring (Per SKU) vs SO, BoM bundle, dan Real Time Stock"
summary: "Filter store Garment Marts - Seruni, cocokkan Total Qty Order / Avail / Qty Kurang / Coverage / summary dengan SO sumber, modal Order Count, dan Real Time Stock SERUNI-ST. Fokus: komponen bundle tidak terhitung 2x."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-15
requirement_ref: "ETM-16583 (bug duplikasi Total Qty Order komponen bundle)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-real-stock
  - businessdevelopment-sales-order-general
  - omni-unassign-wave
preconditions:
  - "Login staging playwright@gmail.com (session tests/.auth/DEV-STG.json), company Dev Staging (13). Card memakai tim_dev@mail.com, company sama."
  - "SO approved di Unassign Wave untuk store Garment Marts - Seruni (id 5, WH SERUNI-ST 2488) berisi bundle + single SKU"
test_data:
  - field: sales_order
    value: "SO-5UR312DM (id 2528733), 15-10-2026 11:35 WIB, approved, unassign_wave_status not in queue"
  - field: bundle
    value: "SH-BUNDLE-LIPS-BEDAK-NEW (45581) qty 5 → komponen LIPS (45583) 10 dan BEDAK (45582) 10 (rasio 2)"
  - field: single_sku
    value: "SKU-Z (94731) qty 3, avail 0; SKU-W (94732) qty 2, avail 10"
  - field: sampel_tambahan
    value: "SKU-V (SO-5UR3T7YL), SKU-STOCK-SHORTAGE (SO-5UNUGW6K), GANT-ASTRONOIT (100 SO)"
steps:
  - "Buka /omni/stock-shortage-monitoring, Store = Garment Marts - Seruni, Order Date default 30 hari (15-09-2026 s/d 15-10-2026)"
  - "Cari LIPS, BEDAK, SKU-Z, SKU-W, SH-BUNDLE; catat Order Count, Total Qty Order, Avail, Inbound Count, Qty Kurang, Coverage"
  - "Klik Order Count LIPS: cek SO, label From Bundle, total qty, info Consistency"
  - "Buka SO-5UR312DM (Sales Order General edit 2528733): cek qty bundle dan qty komponen anak"
  - "Real Time Stock > By SKU > Building SERUNI-ST > cari tiap SKU: bandingkan kolom Available dengan Avail report"
  - "Hitung ulang Qty Kurang & Coverage semua baris (API list length=500) dan summary card"
  - "Nyalakan toggle Show only SKU with shortage: cek jumlah baris, header jumlah SKU, footer pagination"
expected_result: |
  1. LIPS Total Qty Order = 10 (5 bundle × 2), bukan 20. BEDAK = 10. Header bundle tidak tampil.
  2. Modal Order Count LIPS: SO-5UR312DM, From Bundle SH-BUNDLE-LIPS-BEDAK-NEW, total 10.
  3. SKU-Z: qty 3, avail 0, inbound 0, kurang 3, coverage 0%. SKU-W: qty 2, avail 10, kurang 0, coverage 100%.
  4. Avail = Available di Real Time Stock untuk gudang induk store.
  5. Qty Kurang / Coverage / summary konsisten dengan rumus.
  6. Toggle shortage hanya menampilkan SKU kurang, counter ikut berubah.
test_result:
  status: passed_with_note
  started_at: "2026-10-15T14:25:00+07:00"
  finished_at: "2026-10-15T14:45:00+07:00"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "Data valid: LIPS 10, BEDAK 10, SKU-Z/W sesuai, Avail = Real Time Stock untuk 6 SKU, rumus 0 selisih di 110 baris, summary cocok. Catatan: toggle shortage 14 baris tapi counter tetap 110."
  report_url: "https://drive.google.com/drive/folders/187fsezDKuXJdtMD6YnEP9OPbyH_3ipil"
test_data_used:
  - "SO-5UR312DM"
run_history: []
origin_jira: ETM-16583
first_execution:
  at: "2026-10-15"
  via: "manual:Bugsy"
  jira: "ETM-16583"
last_execution:
  at: "2026-10-15"
  jira: "ETM-16583"
  status: passed_with_note
  via: "manual:Bugsy"
  notes: "Read-only, tidak membuat data baru. Status card ETM-16583 tidak diubah (sudah Done). Telegram message 51563 di thread 51478."
---

# TC-SSM-DATA-001 — Validasi data Stock Shortage Monitoring

## Konteks

- Card: [ETM-16583](https://erpintegration.atlassian.net/browse/ETM-16583) (Error, Highest, Done, dev Ahmad Heri Efendi). Bug: Total Qty Order komponen bundle 2x (20 dari seharusnya 10).
- Permintaan 15-10-2026: hanya cek validitas data, status card tidak diubah, laporan ke Telegram.
- Penyebab yang diperbaiki di kode: detail SO komponen (anak tree) ikut dihitung bersama hasil explode BoM. Sekarang anak tree diabaikan (`NOT EXISTS sales_order_detail_trees.parent_id`), komponen dihitung dari BoM saja.

## Hasil run 15-10-2026 ±14:25–14:45 WIB

Filter: Garment Marts - Seruni, 15-09-2026 s/d 15-10-2026.

| SKU | Total Qty Order | Modal Order Count | Avail report | Real Time Stock SERUNI-ST (Available) | Qty Kurang | Coverage | Hasil |
|---|---|---|---|---|---|---|---|
| LIPS (komponen A) | 10 | 10 · SO-5UR312DM · from bundle | 98 | 98 (on hand 2.591, reserved 2.493) | 0 | 100% | ✅ |
| BEDAK | 10 | 10 · SO-5UR312DM · from bundle | 195 | 195 | 0 | 100% | ✅ |
| SKU-Z | 3 | 3 | 0 | tidak ada stok | 3 | 0% | ✅ |
| SKU-W | 2 | 2 | 10 | 10 | 0 | 100% | ✅ |
| SKU-V | 2 | 2 (SO-5UR3T7YL) | 4 | 4 | 0 | 100% | ✅ |
| SKU-STOCK-SHORTAGE | 2 | 2 (SO-5UNUGW6K) | 1 | 1 | 1 | 50% | ✅ |
| GANT-ASTRONOIT | 3.064 | 3.064 / 100 SO | 110.163 | 110.163 | 0 | 100% | ✅ |

- Header bundle SH-BUNDLE-LIPS-BEDAK-NEW tidak muncul (search "SH-BUNDLE" → No matching records). ✅
- Rumus Qty Kurang & Coverage dihitung ulang untuk 110 baris: 0 selisih. ✅
- Summary: SKU in demand 110, SKU short 14, Qty short 16, Orders waiting 105 → SKU/qty cocok dengan hitung ulang. ✅

## Temuan

1. ⚠️ Toggle **Show only SKU with shortage**: tabel 14 baris, tapi header "110 SKU" dan footer "Showing 1 to 20 of 110 entries" (pagination 6 halaman). API `shortage_only=true` mengembalikan `recordsTotal`/`recordsFiltered` 110. Di luar AC ETM-16583, belum dibuat card (menunggu keputusan).
2. ℹ️ Avail SERUNI-ST ikut menghitung gudang anak SERUNI-DEFECT / SERUNI-FAILED-SHIP / SERUNI-RETURN / SERUNI-RETUR-BELI (sama perilakunya dengan Real Time Stock). Perlu konfirmasi bisnis apakah stok di gudang itu memang dianggap tersedia.

## Catatan teknis (untuk retest)

- API list bisa dipanggil dengan `store_id=5&date_from=...&date_to=...&length=500` untuk ambil semua baris sekaligus.
- Real Time Stock By SKU: pilih dulu Building (dropdown "You can choose up to 5 Buildings"), baru cari SKU. Kolom `..._stock_formatted` = Available.
- Angka pakai pemisah ribuan titik (3.064 = 3064).
- Cache dataset 5 menit: SO baru bisa belum muncul.
- SO-5UR312DM tetap di Unassign Wave dan bisa dipakai lagi selama belum dikirim ke wave.

## Bukti

- Folder: https://drive.google.com/drive/folders/187fsezDKuXJdtMD6YnEP9OPbyH_3ipil
- Report store Seruni: https://drive.google.com/file/d/1aQU3F0CtXJH52wDbZEn0OLgdxqIyyacD/view
- Baris LIPS: https://drive.google.com/file/d/1quN6Zy8moZmxyz-KAMeni9jIFcgFud5X/view
- Modal Order Count LIPS: https://drive.google.com/file/d/1wean5iHjKRq6ZVCttZKvsRM-6vV2CYbn/view
- Counter toggle shortage: https://drive.google.com/file/d/1fArMSmPGZzyIVXv0bGHNisgpwi9nj91W/view
- Real Time Stock SERUNI-ST: https://drive.google.com/file/d/1KFrAzCRx_J7o8yniGuFzb5r3Vw11EvDX/view
- SO-5UR312DM: https://drive.google.com/file/d/1bs3vOsRvLEdtnYNRClCZeEKfjT88Fz8A/view
- Tabel cross-check: https://drive.google.com/file/d/1iFaxnxLPFhewFDdDfcCYxeH_hJXZu8i_/view
