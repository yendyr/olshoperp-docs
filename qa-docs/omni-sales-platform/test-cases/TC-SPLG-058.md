---
doc_type: e2e-test-case
tc_code: TC-SPLG-058
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: negative
title: "Negative: tombol Void/Closed tidak tersedia pada SO Platform yang sudah punya Mutation Outbound Approved"
summary: "SO Platform Approved (Void) atau Processed (Closed) yang sudah punya Mutation Outbound Approved tidak boleh menampilkan tombol Void/Closed di datalist maupun halaman detail; SO tanpa outbound Approved tetap menampilkan Void sebagai pembanding."
status: draft
owner: QA - Yemima
last_updated: 2026-10-16
requirement_ref: "qa-docs/omni-sales-platform/requirement.md §6.9 V-VR-06 (guard Void existing: outbound/invoice tetap); card ETM-16429, card asal ETM-16276"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses menu 'Dev - Sales Platform'; company aktif FAT (112)"
  - "Ada SO Platform berstatus Approved yang sudah punya Mutation Outbound berstatus Approved (SO-6905AB66, SO-6870455F)"
  - "Ada SO Platform berstatus Processed yang sudah punya Mutation Outbound berstatus Approved (SO-5UL11G0I)"
  - "Pembanding: SO Platform berstatus Approved tanpa Mutation Outbound Approved (SO-KKZ7DSRO)"
  - "Data uji hanya dilihat — jangan klik Void atau Closed pada SO mana pun"
test_data:
  - field: so_approved_outbound_a
    value: "SO-6905AB66 (id 453449, Approved, outbound OT-69153770, TikTok)"
  - field: so_approved_outbound_b
    value: "SO-6870455F (id 345119, Approved, outbound OT-690DBA8A, Shopee)"
  - field: so_processed_outbound
    value: "SO-5UL11G0I (id 2524805, Processed, outbound OT-5UMDSIVO)"
  - field: so_pembanding_tanpa_outbound
    value: "SO-KKZ7DSRO (id 2526909, Approved, tanpa outbound Approved)"
steps:
  - "Login https://staging.olshoperp.com/login, lalu ganti company: klik avatar profil di topbar → 'Switch Company' → 'FAT' → 'Proceed'; pastikan company aktif FAT (112)"
  - "Buka sidebar 'Omni Channel' → 'Dev - Sales Platform' (https://staging.olshoperp.com/omni/sales-order); tunggu datalist selesai dimuat"
  - "Skenario A: isi kotak 'find something ...' dengan SO-6905AB66, tekan Enter (pencarian dari awal teks); pastikan 1 baris, Trx. Status 'Approved', kolom 'Outbound Code' berisi OT-69153770"
  - "Geser tabel ke kolom 'Action' paling kanan; periksa tombol di baris itu — hanya tombol buka (ikon edit) dan cetak (ikon print), tidak ada tombol 'Void' (tooltip-void) maupun 'Closed'"
  - "Klik tombol buka → halaman https://staging.olshoperp.com/omni/sales-order/edit/453449; periksa seluruh halaman — tidak ada tombol atau teks 'Void'/'Closed'; tombol 'Unapprove' tidak tampil"
  - "Skenario B: ulangi pencarian dan pemeriksaan kolom 'Action' untuk SO-6870455F (Approved, outbound OT-690DBA8A) — tidak ada tombol 'Void'"
  - "Skenario C (sisi Closed): cari SO-5UL11G0I (Processed, outbound OT-5UMDSIVO) — kolom 'Action' hanya tombol buka dan cetak, tidak ada tombol 'Closed'"
  - "Pembanding: cari SO-KKZ7DSRO (Approved, tanpa outbound Approved) — kolom 'Action' memuat tombol 'Void' (tooltip-void); JANGAN diklik"
  - "Selama langkah di atas pantau console browser (error/warn) dan panggilan POST /api/omnichannel/sales-order/get (harus status 200); diagnosa tambahan: respons baris SO berisi action.voidable = false dan action.closedable = false untuk SO yang punya outbound Approved"
  - "Akhiri tanpa mengklik Void/Closed; pastikan status keempat SO tidak berubah"
expected_result: |
  1. Pada SO Platform berstatus Approved yang sudah punya Mutation Outbound berstatus Approved, tombol Void tidak muncul di kolom Action datalist maupun di halaman detail.
  2. Pada SO Platform berstatus Processed yang sudah punya Mutation Outbound Approved, tombol Closed tidak muncul.
  3. Status SO tidak berubah karena aksi Void/Closed memang tidak tersedia.
  4. Pembanding: SO Approved tanpa Mutation Outbound Approved tetap menampilkan tombol Void, sehingga hilangnya tombol terbukti karena guard outbound.

  [CATATAN QA] requirement.md §6.9 V-VR-06 hanya menyebut "Guard void existing (outbound/invoice) tetap" dan belum merinci aturan ini. Expected di atas mengacu pada deskripsi card ETM-16429 dan perilaku yang terverifikasi di backend (tombol Void hanya muncul bila status Approved/Processed dan tidak ada outbound Approved). Konfirmasi ke QA lead jika requirement perlu dilengkapi.
test_result:
  status: passed
  started_at: "2026-10-16T15:45:00+07:00"
  finished_at: "2026-10-16T15:55:00+07:00"
  executed_by: "Bugsy (Claude, login yemimastaging@gmail.com)"
  environment: staging
  log_summary: "A: SO-6905AB66 Approved + OT-69153770 — kolom Action hanya buka+cetak, detail tanpa Void/Closed. B: SO-6870455F Approved + OT-690DBA8A — tanpa Void. C: SO-5UL11G0I Processed + OT-5UMDSIVO — tanpa Closed. Pembanding SO-KKZ7DSRO punya Void. Console 0 error/warn; semua panggilan API 200 (1 permintaan detail dibatalkan browser lalu diulang sukses)."
  report_url: "https://drive.google.com/drive/folders/1Q50AxZ4Id5FV26pBUJlYx3dcPCwVGm9x"
test_data_used:
  - "SO-6905AB66"
  - "SO-6870455F"
  - "SO-5UL11G0I"
  - "SO-KKZ7DSRO"
run_history: []
origin_jira: ETM-16429
first_execution:
  at: "2026-10-16"
  via: "manual:Bugsy"
  jira: ETM-16429
last_execution:
  at: "2026-10-16"
  jira: ETM-16429
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 16-10-2026 15:45-15:55 WIB, staging, company FAT (112), login yemimastaging@gmail.com. Actual: SO-6905AB66 dan SO-6870455F (Approved + outbound Approved) tidak punya tombol Void di kolom Action; halaman detail SO-6905AB66 tanpa Void/Closed. SO-5UL11G0I (Processed + outbound Approved) tidak punya tombol Closed. Pembanding SO-KKZ7DSRO (tanpa outbound) punya tombol Void. Void/Closed tidak diklik; status SO di DB tidak berubah. Console 0 error/warn."
---

# TC-SPLG-058 — Void/Closed tidak tersedia bila outbound Approved

Card: [ETM-16429](https://erpintegration.atlassian.net/browse/ETM-16429) (Test Case, negative) · card asal: [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

## Retest cepat
1. Staging, company **FAT (112)** → **Omni Channel → Dev - Sales Platform**.
2. Cari SO Approved yang punya Mutation Outbound Approved → kolom **Action** tidak boleh punya tombol **Void**; Processed + outbound Approved → tidak boleh ada tombol **Closed**.
3. Bandingkan dengan SO Approved tanpa outbound Approved → tombol **Void** harus ada. Jangan klik Void/Closed.

## Catatan QA

### Data uji (FAT, 112)
| SO | Status | Outbound | Platform | URL edit |
|---|---|---|---|---|
| SO-6905AB66 | Approved | OT-69153770 | TikTok | https://staging.olshoperp.com/omni/sales-order/edit/453449 |
| SO-6870455F | Approved | OT-690DBA8A | Shopee | https://staging.olshoperp.com/omni/sales-order/edit/345119 |
| SO-5UL11G0I | Processed | OT-5UMDSIVO | Platform | https://staging.olshoperp.com/omni/sales-order/edit/2524805 |
| SO-KKZ7DSRO (pembanding) | Approved | tidak ada | Platform | https://staging.olshoperp.com/omni/sales-order/edit/2526909 |

Data uji tidak diubah dan tidak dihapus. Sumber data awal: komentar QA Review pada ETM-16276 (12 Okt 2026); kondisi diverifikasi ulang di DB staging (read-only) sebelum dan sesudah run.

### Observasi
- Tombol Void/Closed di datalist hanya muncul bila respons baris memuat `action.voidable` / `action.closedable` bernilai true. Untuk SO dengan outbound Approved keduanya false (`can_void` dasar bisa true, tetapi hasil akhir tetap false).
- Alamat panggilan API detail SO memuat spasi setelah id (`.../sales-order/453449 /sales-order-detail/...`). Tetap berstatus 200 dan tidak memengaruhi hasil; tidak dibuatkan card.
- Pembanding positif untuk tombol Closed (SO Processed tanpa outbound Approved) tidak ditemukan di datalist Dev - Sales Platform saat run, jadi sisi Closed baru diuji untuk kasus negatif.
- Skenario setara di menu Sales Order General dan All Sales Order (guard yang sama) dicakup card ETM-16430, bukan TC ini.
- Evidence (teks): https://drive.google.com/drive/folders/1Q50AxZ4Id5FV26pBUJlYx3dcPCwVGm9x
