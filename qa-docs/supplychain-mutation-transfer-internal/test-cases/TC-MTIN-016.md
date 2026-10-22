---
doc_type: e2e-test-case
tc_code: TC-MTIN-016
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "Edit QTY langsung di tabel detail Transfer Internal tersimpan tanpa muat ulang seluruh tabel"
summary: "Mengubah QTY satu baris di tabel detail dokumen Transfer Internal draft menyimpan nilai ke server tanpa meminta ulang seluruh daftar detail, tanpa loading overlay, tanpa tabel berkedip atau scroll berpindah, dan sel QTY siap diedit lagi sebelum 150 ms setelah simpan selesai."
status: draft
owner: QA - Yemima
last_updated: 2026-10-19
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md §5 (A-TFI-12/A-TFI-15, edit detail sebelum Approve); card ETM-16361 (perubahan UX edit QTY inline, perilaku performa sebelum perbaikan ±1.400 ms per edit)"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses menu Transfer Internal (akun default E2E playwright@gmail.com); company aktif Lumi Charms.id (153)"
  - "Ada dokumen Transfer Internal berstatus draft (belum Approve) dengan minimal 15 baris detail (syarat card) dan stok gudang asal cukup untuk menaikkan QTY tiap baris, supaya server tidak menolak karena stok"
  - "Peramban terbuka di tab Network dan Console agar request dan error terbaca"
test_data:
  - field: dokumen_uji
    value: "TFI-6984535F (id 46329, draft, 39 baris detail aktif, QTY sekitar 5.000-10.000) — https://staging.olshoperp.com/supplychain/mutation-transfer-internal/edit/46329"
  - field: jumlah_edit
    value: "4 putaran x 10 baris pertama halaman 1 = 40 edit (turun 1, lalu kembali ke angka awal)"
steps:
  - "Login https://staging.olshoperp.com/login, lalu pastikan company aktif Lumi Charms.id (153): klik avatar profil di topbar, pilih Switch Company, pilih Lumi Charms.id, klik Proceed"
  - "Buka https://staging.olshoperp.com/supplychain/mutation-transfer-internal/edit/46329 (dokumen draft); tunggu tabel detail selesai dimuat dan pastikan dokumen punya minimal 15 baris detail"
  - "Siapkan pemantauan: tab Network (filter Fetch/XHR) dan Console; catat posisi scroll tabel sebelum mengedit"
  - "Klik sel QTY baris pertama sampai berubah menjadi kolom input, ubah nilainya turun 1 dari angka semula, tekan Enter"
  - "Segera setelah Enter, amati: apakah muncul loading overlay atau tabel berkedip, apakah posisi scroll berubah, apakah muncul notifikasi sukses, dan berapa lama sampai sel QTY bisa diklik dan diedit lagi"
  - "Di tab Network periksa: ada satu request PUT .../mutation-transfer-middle-detail/{id} berstatus 200; tidak ada request GET .../primevue (ambil ulang daftar detail) setelah PUT itu"
  - "Ulangi langkah 4-6 untuk 10 baris pertama, lalu kembalikan setiap QTY ke angka semula (kenaikan 1) dan ulangi pengukuran; lakukan 4 putaran (40 edit)"
  - "Muat ulang halaman penuh (reload) dan bandingkan QTY 10 baris tadi dengan angka yang terakhir diketik"
  - "Jika ada edit yang ditolak server (toast merah), catat pesannya dan pastikan nilai sel kembali ke angka lama; akhiri dengan memastikan semua QTY sama seperti sebelum uji"
expected_result: |
  1. Setelah Enter, QTY baru tersimpan lewat satu request PUT berstatus 200 dan notifikasi sukses muncul.
  2. Tidak ada request ambil ulang daftar detail (GET .../primevue) setelah simpan; tidak ada loading overlay; baris tabel tidak diganti dan tidak berkedip; posisi scroll tidak berubah.
  3. Sel QTY siap diedit lagi paling lambat 150 ms (median) setelah simpan selesai.
  4. Setelah reload, nilai QTY sama dengan yang terakhir tersimpan.
  5. Bila server menolak (mis. 'Insufficient product stock.'), UI menampilkan toast error dan mengembalikan nilai sel ke angka lama tanpa membuat tabel macet.

  [CATATAN QA] requirement.md belum memuat kriteria khusus untuk perilaku edit QTY inline (A-TFI-12/15 hanya soal Select Product dan Available Product). Expected diambil dari deskripsi card ETM-16361; konfirmasi ke QA lead bila requirement perlu dilengkapi.
test_result:
  status: passed
  started_at: "2026-10-19T17:04:31+07:00"
  finished_at: "2026-10-19T17:16:00+07:00"
  executed_by: "Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "40 edit pada TFI-6984535F (company 153): GET primevue setelah simpan 0/40, overlay 0/40, tbody diganti 0/40, scroll berubah 0/30; PUT p50 284 ms p95 537 ms; sel siap diedit lagi sejak simpan selesai p50 20 ms p95 32 ms max 37 ms (target 150 ms); 37 edit sukses dan cocok setelah reload; 3 edit ditolak 422 'Insufficient product stock.' dengan UI mengembalikan nilai lama. Data dipulihkan. Koreksi 20-10-2026 (cek tim QA): rata-rata 306,9 ms dan median 341,5 ms per edit, tetapi 2 request simpan 25,8 dan 25,1 detik yang tidak terlihat di 40 edit ini."
  report_url: "https://drive.google.com/drive/folders/1pHtMM34cIEDtKuCa1XT_FZbc9aDoHTze"
test_data_used:
  - "TFI-6984535F"
run_history:
  - at: "2026-10-19"
    status: passed
    environment: staging
    note: "Passed dengan catatan: 3 dari 40 edit ditolak server 'Insufficient product stock.' (termasuk saat QTY diturunkan 1; tim QA tidak pernah melihat ini, penyebab belum terbukti) dan UI menanganinya benar. Dikoreksi 20-10-2026 oleh feedback tim QA: 2 request simpan 25,8 dan 25,1 detik tidak terdeteksi di run ini; catatan 15 baris per halaman dan Availability dicabut."
origin_jira: ETM-16361
first_execution:
  at: "2026-10-19"
  via: "manual:Bugsy"
  jira: ETM-16361
last_execution:
  at: "2026-10-19"
  jira: ETM-16361
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 19-10-2026 17:04-17:16 WIB, staging, company Lumi Charms.id (153), login playwright@gmail.com, dokumen TFI-6984535F. Actual: 40 edit QTY tanpa ambil ulang daftar detail, tanpa overlay, sel siap diedit lagi median 20 ms setelah simpan selesai, 37 edit tersimpan dan cocok setelah reload; 3 edit ditolak server Insufficient product stock dan UI mengembalikan nilai lama. Data uji dipulihkan. Ditutup passed dengan catatan; dikoreksi 20-10-2026 setelah feedback tim QA (dua request simpan 25 detik dari cek tim tidak muncul di run ini, catatan 15 baris per halaman dan Availability dicabut)."
---

# Edit QTY inline di detail Transfer Internal tanpa muat ulang tabel

Card: [ETM-16361](https://erpintegration.atlassian.net/browse/ETM-16361) (Test Case, happy)

## Retest cepat
1. Staging, company **Lumi Charms.id (153)** → **Supply Chain → Transfer Internal** → buka dokumen draft dengan banyak baris detail.
2. Klik sel **QTY** satu baris, ubah angkanya, tekan **Enter**.
3. Pastikan: tidak ada loading overlay/kedipan, scroll tidak berpindah, tab Network hanya ada satu **PUT** (tanpa **GET primevue** sesudahnya), dan sel bisa diedit lagi segera.
4. Reload halaman: nilai harus sama. Kembalikan QTY ke angka awal bila memakai data bersama.

## Catatan QA

### Data uji (Lumi Charms.id, 153)
| Dokumen | Status | Baris aktif | URL edit |
|---|---|---|---|
| TFI-6984535F | Draft | 39 | https://staging.olshoperp.com/supplychain/mutation-transfer-internal/edit/46329 |

Dokumen draft lama dipakai sebagai data uji (tidak membuat data baru). QTY 10 baris pertama diubah turun 1 lalu dikembalikan; kondisi akhir diverifikasi di database staging (read-only) cocok dengan kondisi awal. ID baris detail berubah karena server membuat ulang baris detail pada tiap edit; `updated_at` dokumen ikut berubah.

### Hasil ukur (n = 40 edit, diukur di dalam halaman)
| Ukuran | Hasil | Target |
|---|---|---|
| Ambil ulang daftar detail (GET primevue) setelah simpan | 0 dari 40 | 0 |
| Loading overlay | 0 dari 40 | 0 |
| Baris tabel diganti | 0 dari 40 | 0 |
| Posisi scroll berubah | 0 dari 30 yang terukur | 0 |
| Request PUT simpan | p50 284 ms, p95 537 ms, max 753 ms | baseline sebelum perbaikan ±1.400 ms |
| Sel QTY siap diedit lagi sejak Enter | p50 19 ms, p95 30 ms | - |
| Selisih sel siap diedit lagi vs simpan selesai | p50 20 ms, p95 32 ms, max 37 ms | median ≤ 150 ms |
| Toast sukses muncul | 37 dari 40 (3 ditolak server) | - |

### Observasi
- 3 dari 40 edit ditolak server dengan HTTP 422 `Insufficient product stock.`, termasuk saat QTY hanya diturunkan 1 (10.000→9.999 dan 4.998→4.997; dua dari tiga baris itu QTY 10.000 = seluruh stok fisik produknya). UI menangani benar: toast merah dan nilai sel kembali ke angka lama; console mencatat error resource 422 untuk request itu, tanpa error JavaScript. Tim QA menyatakan 422 hanya muncul bila input melebihi stok dan tidak pernah saat QTY dikurangi 1; penyebab perbedaan belum terbukti dan belum diuji ulang (dokumen uji sudah berubah karena edit tim).
- Elemen input di sel QTY dibuat ulang tiap simpan (40 dari 40), tetapi hanya di level sel: tabel dan baris tidak diganti dan tidak ada kedipan.
- Cek tim QA 20-10-2026 pagi (DevTools Network): rata-rata per edit 306,9 ms (median 341,5 ms), tetapi 2 request simpan sangat lambat: 25,8 detik (edit ke-4) dan 25,1 detik (edit ke-6). Lonjakan ini tidak muncul di 40 edit run Claude (terlama 753 ms) dan belum diuji ulang; dugaan staging lambat sporadis pagi itu belum terbukti.
- Angka 284 ms di tabel hasil adalah median (p50), bukan rata-rata.
- Dikoreksi 20-10-2026: catatan 'card menyebut 15 baris per halaman' dicabut (itu syarat data dokumen minimal 15 baris, bukan pagination) dan catatan Availability dicabut (tabel detail tidak punya kolom Availability).
- Evidence (teks): https://drive.google.com/drive/folders/1pHtMM34cIEDtKuCa1XT_FZbc9aDoHTze
