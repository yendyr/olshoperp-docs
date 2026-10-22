---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-020
menu: supplychain-assembly
menu_name: "Assembly"
test_type: cross-menu
title: "Cross-menu: Outbound Code, Outbound Date, dan Total Qty Need di Export With Details Assembly cocok dengan Other Outbound dan BOM dokumen"
summary: "Export All With Details Assembly menampilkan Outbound Code dan Outbound Date yang sama dengan Other Outbound dokumen, SKU dan nama komponen sama dengan BOM dokumen, dan Total Qty Need sama dengan qty komponen di Other Outbound, termasuk untuk dokumen yang FG-nya berunit non-dasar (Box)."
status: draft
owner: QA - Yemima
last_updated: 2026-10-20
requirement_ref: "qa-docs/supplychain-assembly/requirement.md §7.4a (TO-BE With Details 23 kolom: Total Qty Need, Outbound Code, Outbound Date; ETM-16645); card ETM-16655"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-mutation-outbound
  - bill-of-material
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses menu Assembly (akun default E2E playwright@gmail.com); company aktif Dev Staging (13)"
  - "PR backend ETM-16645 (#6558 dan #6559) sudah merge dan server update backend Staging selesai (20-10-2026 11:21 WIB)"
  - "Ada dokumen Assembly Approved yang sudah membentuk Other Outbound komponen, dengan 1 FG dan 2-3 komponen BOM; sebaiknya ada satu dokumen berunit FG Pieces dan satu dokumen berunit FG Box"
test_data:
  - field: dokumen_unit_pieces
    value: "AS-6A978EFE (company 13): FG ASM-BLND qty 20 Pieces, komponen COMP-BLND-MOTOR/GLASS/BLADE masing-masing 1 per FG; Other Outbound OT-5UBDRJD8 (02-09-2026 09:50:11), OUT QTY 20 per komponen"
  - field: dokumen_unit_box
    value: "AS-6AA25E7F (company 13): FG ASM-TOWEL01 qty 8,9 Box (1 Box = 10 Pieces), komponen SKU-Towel01-merah/kuning/hijau masing-masing 1 Piece per FG; Other Outbound OT-5UEBT8KF (10-09-2026 14:38:55), OUT QTY 89 Pieces per komponen"
steps:
  - "Login https://staging.olshoperp.com/login, lalu pastikan company aktif Dev Staging (13): klik avatar profil di topbar, pilih Switch Company, pilih Dev Staging, klik Proceed"
  - "Buka sidebar Supply Chain Management → Assembly (https://staging.olshoperp.com/supplychain/assembly); klik tombol Export, lalu tombol Export di slideover, pilih 'With Details'; tunggu status riwayat menjadi 'Ready to Download' dan unduh file xlsx"
  - "Di file, filter baris dokumen uji (AS-6A978EFE dan AS-6AA25E7F); catat Outbound Code, Outbound Date, System Product SKU Component, System Product SKU Name Component, Total Qty Need, Unit Component"
  - "Buka halaman edit dokumen Assembly (https://staging.olshoperp.com/supplychain/assembly/edit/383 dan /edit/390): catat qty dan unit FG di tabel detail"
  - "Buka Other Outbound dengan kode dari export (https://staging.olshoperp.com/supplychain/mutation-outbound/edit/131850 dan /edit/132626): catat tanggal transaksi dan OUT QTY tiap SKU komponen"
  - "Buka Bill of Material FG tersebut (Master → Bill of Material, ASM-BLND dan ASM-TOWEL01): catat qty komponen per 1 FG"
  - "Bandingkan: Outbound Code/Date dengan Other Outbound; Total Qty Need dengan qty komponen per FG × qty FG dan dengan OUT QTY; SKU dan nama komponen dengan BOM"
expected_result: |
  1. Outbound Code di export = kode Other Outbound dokumen Assembly tersebut; Outbound Date = tanggal transaksinya.
  2. Total Qty Need tiap komponen = qty komponen per FG × qty FG, dan sama dengan qty SKU itu di Other Outbound (juga untuk dokumen berunit FG Box: 8,9 Box harus tampil sebagai 89 Pieces per komponen).
  3. SKU dan nama komponen di export sama dengan BOM yang dipakai dokumen Assembly.

  [CATATAN QA] Poin 2 untuk FG berunit non-dasar tidak dirinci di card; expected mengikuti kalimat 'sama dengan qty SKU itu di Other Outbound'. Konfirmasi ke QA lead bila Total Qty Need memang dimaksudkan dalam unit dokumen.
test_result:
  status: failed
  started_at: "2026-10-20T12:52:48+07:00"
  finished_at: "2026-10-20T13:08:00+07:00"
  executed_by: "Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "Header 23 kolom sesuai TO-BE. Outbound Code/Date sesuai (0 dari 612 baris tanggal berbeda, 0 outbound terhapus tampil), SKU/nama komponen = BOM 984 dari 984 baris. FAILED di poin 2: AS-6A978EFE (Pieces) 20 = 20 cocok, tetapi AS-6AA25E7F (Box) Total Qty Need 8,9 vs Other Outbound OT-5UEBT8KF 89 (selisih 10 kali); rekap 552 dari 612 baris cocok (90,2%), 13 baris (2,1%) berbeda di 5 dokumen berunit Box, 37 baris (6,0%) SKU tidak ada di outbound yang ditampilkan (4 dokumen multi-FG), 10 baris outbound kosong."
  report_url: "https://drive.google.com/drive/folders/1Mi1EHhJ-JhUHNa7PZ_WFZtOFQWAwdVFs"
test_data_used:
  - "AS-6A978EFE"
  - "AS-6AA25E7F"
run_history:
  - at: "2026-10-20"
    status: failed
    environment: staging
    note: "Failed: Total Qty Need tidak sama dengan qty Other Outbound pada dokumen FG berunit Box (AS-6AA25E7F 8,9 vs 89); 13 baris di 5 dokumen berselisih tepat 10 kali. Poin Outbound Code/Date dan SKU/nama komponen sesuai. Dibuatkan card Error ETM-16659."
origin_jira: ETM-16655
first_execution:
  at: "2026-10-20"
  via: "manual:Bugsy"
  jira: ETM-16655
last_execution:
  at: "2026-10-20"
  jira: ETM-16655
  status: failed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 20-10-2026 12:52-13:08 WIB, staging, company Dev Staging 13, login playwright@gmail.com, dokumen AS-6A978EFE dan AS-6AA25E7F. Actual: header 23 kolom, Outbound Code dan Date serta SKU nama komponen sesuai; Total Qty Need cocok untuk dokumen unit Pieces tetapi berselisih sepuluh kali untuk dokumen unit Box (8,9 vs 89) dan 13 baris di 5 dokumen terdampak; 37 baris dokumen multi FG menampilkan outbound yang tidak memuat SKU komponen. Ditutup failed; dibuatkan card Error ETM-16659 atas keputusan Yemima."
---

# Export Assembly With Details — Outbound dan Total Qty Need cocok dengan Other Outbound dan BOM

Card: [ETM-16655](https://erpintegration.atlassian.net/browse/ETM-16655) (Test Case, cross-menu) · card asal: [ETM-16645](https://erpintegration.atlassian.net/browse/ETM-16645)

## Retest cepat
1. Staging, company **Dev Staging (13)** → **Assembly** → Export → Export → **With Details** → unduh xlsx.
2. Cari AS-6AA25E7F: Total Qty Need harus **89** per komponen (OT-5UEBT8KF, OUT QTY 89 Pieces); sebelum perbaikan tampil 8,9.
3. Cari AS-6A978EFE: Total Qty Need 20 per komponen (OT-5UBDRJD8).
4. Cek ulang rekap: baris dengan Outbound Code vs qty Other Outbound (harus cocok semua), SKU komponen ada di Other Outbound yang ditampilkan.

## Catatan QA

### Hasil 20-10-2026 (file 1.027 baris, 244 dokumen, 612 baris dengan Outbound Code)
| Perbandingan dengan database | Jumlah | Persen dari 612 |
|---|---|---|
| Total Qty Need sama dengan qty di Other Outbound | 552 | 90,2% |
| Total Qty Need berbeda | 13 | 2,1% |
| SKU komponen tidak ada di Other Outbound yang ditampilkan | 37 | 6,0% |
| Kode Other Outbound tanpa baris detail (outbound open kosong) | 10 | 1,6% |

- Outbound Date: 0 dari 612 baris berbeda; outbound terhapus tampil: 0; SKU dan nama komponen sama dengan BOM dokumen: 984 dari 984 baris.
- 13 baris berbeda ada di 5 dokumen berunit FG Box (rate 0,1): AS-68CB710B (1 vs 10), AS-6A9E5664 (20 vs 200; 2,5 vs 25), AS-6A9E7B0A (2,5 vs 25), AS-6A9F66E0 (5 vs 50), AS-6AA25E7F (8,9 vs 89); selisih selalu 10 kali. Dari 10 dokumen berunit non-dasar yang punya Other Outbound, 5 lainnya cocok (AS-69437B5A, AS-69FC3A97, AS-6A013D5C, AS-6A74045A, AS-6A742055); penyebab qty Other Outbound tidak seragam belum diselidiki.

### Observasi
- Dari kode `ProcessWorkOrderDetailsJob`: Total Qty Need = qty BOM × qty FG di dokumen (unit dokumen) tanpa konversi ke unit dasar. Kolom Qty/Unit FG memakai qty dokumen dan unit utama produk (Pieces) sehingga dokumen 8,9 Box tampil 8,9 Pieces; perilaku itu sudah ada sebelum ETM-16645.
- 37 baris di 4 dokumen multi-FG (AS-6852244E, AS-6929587D, AS-692958A8, AS-69DDC559) menampilkan Outbound Code yang tidak memuat SKU komponennya, karena satu baris FG hanya menampilkan satu kode sementara dokumen punya beberapa Other Outbound approved. Terkait catatan screening ETM-16645 tentang FG tanpa outbound sendiri; di luar data uji card (1 FG).
- Screening ETM-16645 menyatakan Total Qty Need sesuai (contoh AS-6ABF820B, 12 × 540 = 6480, unit dasar); kasus unit Box belum tercakup.
- Card Error ETM-16659 (assign Mellyana Tundjung, High, Relates ETM-16655 dan ETM-16645). Keputusan QA lead (Yemima, 20-10-2026): Total Qty Need harus mengikuti detail komponen (Pieces, mis. 89 untuk AS-6AA25E7F) dan kolom Unit di samping Qty harus Box sesuai dokumen. Usulan opsional: kolom Outbound Qty/Unit.
- Tidak diuji: Export Without Details, This Page Only, Merdian.
- Evidence (teks): https://drive.google.com/drive/folders/1Mi1EHhJ-JhUHNa7PZ_WFZtOFQWAwdVFs
