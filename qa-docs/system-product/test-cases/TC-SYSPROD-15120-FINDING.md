---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-15120-FINDING
menu: system-product
menu_name: "System Product"
test_type: negative
title: "FINDING: Validasi Nilai 0 / Null dan Label Kosong Lolos pada Modal Dimension & Weight Configurations"
summary: "Ditemukan bahwa modal Dimension & Weight Configurations meloloskan penyimpanan data yang tidak valid: ketika field L, W, H, dan Weight diisi dengan angka '0' atau sengaja dikosongkan (null), serta D&W Label dihapus (klik silang), sistem tetap menampilkan notifikasi sukses 'Dimension & Weight configurations saved successfully' dan menyimpan nilai invalid tersebut saat modal dibuka kembali."
status: draft
owner: QA - Yemima
last_updated: 2026-09-27
requirement_ref: "qa-docs/system-product/requirement.md"
card_ref: "ETM-15120"
automated: false
automated_spec: null
execution_company:
  id: null
  code: null
related_menus: []
preconditions:
  - "User login ke OlshopERP Staging dengan hak akses menu System Product"
  - "Buka form edit produk (URL: https://staging.olshoperp.com/supplychain/product/edit/94470)"
test_data:
  - field: "URL Edit Product"
    value: "https://staging.olshoperp.com/supplychain/product/edit/94470"
  - field: "Alternative Unit"
    value: "box"
steps:
  - "1. Buka form edit produk melalui URL https://staging.olshoperp.com/supplychain/product/edit/94470"
  - "2. Scroll ke section Unit Configuration pada tabel Alternate Unit"
  - "3. Klik ikon D&W pada baris alternate unit 'box' untuk membuka modal 'Dimension & Weight Configurations'"
  - "4. Pada baris profil D&W aktif, hapus D&W Label dengan mengklik tanda silang (x) hingga field kosong"
  - "5. Ubah nilai field Length (L), Width (W), Height (H), dan Weight menjadi '0' atau sengaja dikosongkan (null)"
  - "6. Klik tombol 'Save' di dalam modal Dimension & Weight Configurations"
  - "7. Periksa apakah sistem memblokir dan memunculkan pesan validasi error"
  - "8. Buka kembali modal D&W untuk unit 'box' dan periksa apakah nilai invalid tersebut tersimpan"
expected_result: |
  1. Sistem di modal harus memblokir penyimpanan jika D&W Label kosong atau field L, W, H, Weight bernilai 0 / kosong (karena aturan sistem adalah required dan min: 1).
  2. Muncul notifikasi / pesan validasi error yang jelas dan modal tidak menyimpan data invalid.
test_result:
  status: failed
  started_at: "2026-09-27T22:00:00+07:00"
  finished_at: "2026-09-27T22:05:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED (FINDING): Modal Dimension & Weight Configurations tidak melakukan validasi. Mengisi nilai 0 atau mengosongkan L/W/H/Weight serta menghapus D&W Label tetap lolos saat klik Save dengan notifikasi sukses 'Dimension & Weight configurations saved successfully', dan nilai 0/null tetap tersimpan saat modal dibuka kembali."
  report_url: "https://app.betterbugs.io/session/6ab930889a0216b8a623cee5"
first_execution:
  at: "2026-09-27"
  via: "manual:resty"
  jira: "ETM-15120"
last_execution:
  at: "2026-09-27"
  jira: "ETM-15120"
  status: failed
  via: "manual:resty"
  notes: "FINDING: Modal D&W meloloskan nilai 0 atau null pada field L, W, H, Weight serta D&W label kosong. Klik save memunculkan notifikasi sukses dan nilai 0/null tetap tersimpan saat modal dibuka kembali."
---

# TC-SYSPROD-15120-FINDING: Validasi Nilai 0 / Null dan Label Kosong Lolos pada Modal Dimension & Weight Configurations

## Deskripsi Bug / Finding

Saat melakukan pengujian konfigurasi dimensi dan bobot pada modal **Dimension & Weight Configurations**:
1. Default value untuk L, W, H, dan Weight awalnya memang benar terisi `1`, dan D&W Label wajib diisi.
2. Namun ketika user sengaja mengosongkan **D&W Label** (klik silang pada multiselect), serta mengubah nilai **Length, Width, Height, Weight menjadi `0` atau dikosongkan (null)**:
   * Frontend modal **tidak melakukan validasi pencegahan**.
   * Ketika tombol **Save** di dalam modal diklik, sistem tetap meloloskan penyimpanan dengan memunculkan toast/notifikasi sukses:
     > *"Dimension & Weight configurations saved successfully."*
   * Ketika modal dibuka kembali, data profil D&W tersebut tetap tersimpan dalam kondisi `0` / null tanpa label.

## Dampak Risiko (Severity: Major)
* **Inkonsistensi & Kegagalan Integrasi:** Dimensi 0 cm dan berat 0 gram melanggar aturan kurir logistik dan platform marketplace (kalkulasi volumetrik ongkir akan menjadi 0 atau gagal sinkron).
* **Bypass Validasi:** Menghilangkan integritas aturan backend `min:1` dan `required` di level interaksi form modal.
