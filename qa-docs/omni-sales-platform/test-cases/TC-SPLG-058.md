---
doc_type: e2e-test-case
tc_code: TC-SPLG-058
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: negative
title: "Negative: tombol Void/Closed tidak tersedia pada SO Platform yang sudah punya Mutation Outbound Approved"
summary: "SO Platform Approved (Void) atau Processed (Closed) yang sudah punya Mutation Outbound Approved tidak menampilkan tombol Void/Closed di datalist; ikon Void Doc/Close Doc di halaman edit tetap tampil dan diterima selama klik ditolak sistem (TC-SPLG-060); SO tanpa outbound Approved tetap menampilkan Void sebagai pembanding."
status: draft
owner: QA - Yemima
last_updated: 2026-10-19
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
  - "Klik tombol buka → halaman https://staging.olshoperp.com/omni/sales-order/edit/453449; periksa toolbar ikon di kanan atas (hover tiap ikon untuk tooltip) — ikon 'Void Doc' tampil; JANGAN diklik di TC ini (uji klik ada di TC-SPLG-060)"
  - "Skenario B: ulangi pencarian dan pemeriksaan kolom 'Action' untuk SO-6870455F (Approved, outbound OT-690DBA8A) — tidak ada tombol 'Void'"
  - "Skenario C (sisi Closed): cari SO-5UL11G0I (Processed, outbound OT-5UMDSIVO) — kolom 'Action' hanya tombol buka dan cetak, tidak ada tombol 'Closed'"
  - "Buka https://staging.olshoperp.com/omni/sales-order/edit/2524805 (SO-5UL11G0I) — ikon 'Close Doc' tampil di toolbar kanan atas; JANGAN diklik di TC ini"
  - "Pembanding: cari SO-KKZ7DSRO (Approved, tanpa outbound Approved) — kolom 'Action' memuat tombol 'Void' (tooltip-void); JANGAN diklik"
  - "Selama langkah di atas pantau console browser (error/warn) dan panggilan POST /api/omnichannel/sales-order/get (harus status 200); diagnosa tambahan: respons baris SO berisi action.voidable = false dan action.closedable = false untuk SO yang punya outbound Approved"
  - "Akhiri tanpa mengklik Void/Closed; pastikan status keempat SO tidak berubah"
expected_result: |
  1. Datalist, kolom Action: pada SO Platform Approved yang sudah punya Mutation Outbound Approved, tombol Void tidak muncul.
  2. Datalist, kolom Action: pada SO Platform Processed yang sudah punya Mutation Outbound Approved, tombol Closed tidak muncul.
  3. Halaman edit: ikon Void Doc (SO Approved) dan Close Doc (SO Processed) tetap tampil untuk SO tersebut. Ini diterima (keputusan Lead, 19-10-2026) selama klik ikon ditolak sistem dengan notifikasi validasi dan status SO tidak berubah; hal itu diverifikasi di TC-SPLG-060.
  4. Pembanding: SO Approved tanpa Mutation Outbound Approved tetap menampilkan tombol Void di datalist, sehingga hilangnya tombol terbukti karena guard outbound.

  [CATATAN QA] requirement.md §6.9 V-VR-06 hanya menyebut "Guard void existing (outbound/invoice) tetap" dan belum merinci aturan ini. Expected mengacu pada deskripsi card ETM-16429 dan perilaku yang terverifikasi di backend. Poin 3 direvisi 19-10-2026 setelah feedback tim QA (semula: tombol tidak muncul di halaman detail); konfirmasi ke QA lead jika requirement perlu dilengkapi.
test_result:
  status: passed
  started_at: "2026-10-16T15:45:00+07:00"
  finished_at: "2026-10-16T15:55:00+07:00"
  executed_by: "Bugsy (Claude, login yemimastaging@gmail.com)"
  environment: staging
  log_summary: "Datalist: SO-6905AB66 (Approved + OT-69153770) dan SO-6870455F (Approved + OT-690DBA8A) kolom Action hanya buka+cetak, tanpa Void; SO-5UL11G0I (Processed + OT-5UMDSIVO) tanpa Closed; pembanding SO-KKZ7DSRO punya Void. Halaman edit: ikon Void Doc dan Close Doc TETAP TAMPIL (dikoreksi 19-10-2026 setelah feedback tim QA; run awal salah melaporkan tidak ada). Klik ikon diuji di TC-SPLG-060: ditolak HTTP 422, status tidak berubah. Tidak ada SO diubah."
  report_url: "https://drive.google.com/drive/folders/1Q50AxZ4Id5FV26pBUJlYx3dcPCwVGm9x"
test_data_used:
  - "SO-6905AB66"
  - "SO-6870455F"
  - "SO-5UL11G0I"
  - "SO-KKZ7DSRO"
run_history:
  - at: "2026-10-19"
    status: revised
    environment: staging
    note: "Hasil run 16-10-2026 dikoreksi setelah feedback tim QA: ikon Void Doc dan Close Doc tampil di halaman edit (sebelumnya dilaporkan tidak ada). Expected poin halaman edit direvisi: ikon diterima selama klik ditolak sistem (TC-SPLG-060). Keputusan Yemima (Lead), passed dengan catatan."
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
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 16-10-2026 15:45-15:55 WIB, staging, company FAT (112), login yemimastaging@gmail.com; dikoreksi 19-10-2026. Actual: di datalist SO-6905AB66 dan SO-6870455F (Approved + outbound Approved) tidak punya tombol Void dan SO-5UL11G0I (Processed + outbound Approved) tidak punya tombol Closed; pembanding SO-KKZ7DSRO punya Void. Di halaman edit ikon Void Doc dan Close Doc tetap tampil (temuan tim QA, run awal salah melaporkan tidak ada); klik ikon ditolak sistem HTTP 422 di TC-SPLG-060. Tidak ada SO diubah. Ditutup passed dengan catatan atas keputusan Yemima."
---

# TC-SPLG-058 — Void/Closed tidak tersedia bila outbound Approved

Card: [ETM-16429](https://erpintegration.atlassian.net/browse/ETM-16429) (Test Case, negative) · card asal: [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

## Retest cepat
1. Staging, company **FAT (112)** → **Omni Channel → Dev - Sales Platform**.
2. Cari SO Approved yang punya Mutation Outbound Approved → kolom **Action** tidak boleh punya tombol **Void**; Processed + outbound Approved → tidak boleh ada tombol **Closed**.
3. Bandingkan dengan SO Approved tanpa outbound Approved → tombol **Void** harus ada. Jangan klik Void/Closed.
4. Di halaman edit ikon **Void Doc** / **Close Doc** tampil (diterima); klik-nya diuji di TC-SPLG-060.

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
- **Koreksi 19-10-2026:** run awal (16-10-2026) melaporkan halaman edit tanpa tombol Void/Closed. Itu keliru: ikon Void Doc dan Close Doc tampil di toolbar kanan atas halaman edit (ikon tanpa teks, tooltip baru muncul saat hover). Ditemukan tim QA. Perlindungan data ada di penolakan sistem saat ikon diklik (TC-SPLG-060).
- Tombol Void/Closed di datalist hanya muncul bila respons baris memuat `action.voidable` / `action.closedable` bernilai true. Untuk SO dengan outbound Approved keduanya false (`can_void` dasar bisa true, tetapi hasil akhir tetap false).
- Alamat panggilan API detail SO memuat spasi setelah id (`.../sales-order/453449 /sales-order-detail/...`). Tetap berstatus 200 dan tidak memengaruhi hasil; tidak dibuatkan card.
- Pembanding positif untuk tombol Closed (SO Processed tanpa outbound Approved) tidak ditemukan di datalist Dev - Sales Platform saat run, jadi sisi Closed baru diuji untuk kasus negatif.
- Skenario setara di menu Sales Order General dan All Sales Order (guard yang sama) dicakup card ETM-16430, bukan TC ini.
- Evidence (teks, ada file koreksi): https://drive.google.com/drive/folders/1Q50AxZ4Id5FV26pBUJlYx3dcPCwVGm9x
