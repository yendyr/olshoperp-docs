---
doc_type: e2e-test-case
tc_code: TC-SPLG-060
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: negative
title: "Negative: klik Void dan Closed di halaman edit SO yang sudah punya outbound Approved diblokir validasi dengan notifikasi"
summary: "Walau ikon Void Doc dan Close Doc masih tampil di halaman edit, klik Void pada SO Approved atau Closed pada SO Processed yang sudah punya Mutation Outbound Approved harus ditolak sistem dengan notifikasi validasi dan status SO tidak berubah."
status: draft
owner: QA - Yemima
last_updated: 2026-10-19
requirement_ref: "qa-docs/omni-sales-platform/requirement.md §6.9 V-VR-06 (guard Void existing: outbound/invoice tetap); card ETM-16623, turunan ETM-16429"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses menu 'Dev - Sales Platform' dan izin approval; company aktif FAT (112)"
  - "Ada SO Platform berstatus Approved yang sudah punya Mutation Outbound Approved (SO-6905AB66)"
  - "Ada SO Platform berstatus Processed yang sudah punya Mutation Outbound Approved (SO-5UL11G0I)"
  - "Catat status SO di database sebelum test sebagai pembanding (read-only)"
test_data:
  - field: so_approved_outbound
    value: "SO-6905AB66 (id 453449, Approved, outbound OT-69153770)"
  - field: so_processed_outbound
    value: "SO-5UL11G0I (id 2524805, Processed, outbound OT-5UMDSIVO)"
steps:
  - "Login https://staging.olshoperp.com/login, ganti company ke 'FAT' (avatar profil → 'Switch Company' → 'FAT' → 'Proceed')"
  - "Buka https://staging.olshoperp.com/omni/sales-order/edit/453449; pastikan Transaction Status 'Approved | COMPLETED'"
  - "Hover ikon di toolbar kanan atas — tooltip 'Void Doc'; klik ikon tersebut"
  - "Pada dialog 'Are you sure want to void this transaction?' isi Description lalu klik tombol 'Void Only' (JANGAN 'Void & Copy')"
  - "Catat notifikasi yang muncul (toast merah), status panggilan POST /api/omnichannel/sales-order/453449/approve, dan Transaction Status SO setelahnya"
  - "Buka https://staging.olshoperp.com/omni/sales-order/edit/2524805; pastikan Transaction Status 'Processed | COMPLETED'"
  - "Hover ikon di toolbar kanan atas — tooltip 'Close Doc'; klik ikon tersebut"
  - "Pada dialog 'Are you sure want to closed this transaction?' isi Description lalu klik tombol 'Closed'"
  - "Catat notifikasi yang muncul, status panggilan POST /api/omnichannel/sales-order/2524805/approve, dan Transaction Status SO setelahnya"
  - "Bandingkan status kedua SO di database dengan catatan sebelum test (harus identik)"
expected_result: |
  1. Pada SO Approved yang sudah punya outbound Approved, klik Void ditolak sistem: muncul notifikasi validasi yang menjelaskan alasannya (terkait Outbound/Sales Invoice), status SO tetap Approved, dan halaman tidak berpindah.
  2. Pada SO Processed yang sudah punya outbound Approved, klik Closed ditolak sistem dengan notifikasi validasi yang menjelaskan alasannya, status SO tetap Processed.
  3. Jika aksi berhasil (status SO berubah menjadi Void atau Closed), itu temuan bug.

  [CATATAN QA] requirement.md §6.9 V-VR-06 hanya menyebut guard Void existing (outbound/invoice) tetap dan belum merinci pesan validasinya, apalagi untuk aksi Closed. Expected di atas mengacu pada deskripsi card ETM-16623. Konfirmasi ke QA lead jika requirement perlu dilengkapi.
test_result:
  status: passed
  started_at: "2026-10-19T11:51:30+07:00"
  finished_at: "2026-10-19T11:53:21+07:00"
  executed_by: "Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "Void SO-6905AB66: ikon Void Doc ada, Void Only ditolak HTTP 422, toast merah 'This transaction cannot be voided because it is already related to Sales Invoice and Outbound.', status tetap Approved. Closed SO-5UL11G0I: ikon Close Doc ada, Closed ditolak HTTP 422 dengan pesan yang sama, status tetap Processed. DB sebelum dan sesudah identik."
  report_url: "https://drive.google.com/drive/folders/1ZHsktToshEkvQoSW4RxpMFE5t0sUtFam"
test_data_used:
  - "SO-6905AB66"
  - "SO-5UL11G0I"
run_history: []
origin_jira: ETM-16623
first_execution:
  at: "2026-10-19"
  via: "manual:Bugsy"
  jira: ETM-16623
last_execution:
  at: "2026-10-19"
  jira: ETM-16623
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 19-10-2026 11:51-11:53 WIB, staging, company FAT (112), login playwright@gmail.com lewat UI crawl otomatis. Actual: klik Void pada SO-6905AB66 dan Closed pada SO-5UL11G0I sama-sama ditolak HTTP 422 dengan toast merah 'This transaction cannot be voided because it is already related to Sales Invoice and Outbound.'; status SO tidak berubah dan database sebelum serta sesudah identik. Temuan sampingan: pesan Closed berbunyi voided (ETM-16625) dan Approver Name kosong di dialog Void (ETM-16626)."
---

# TC-SPLG-060 — Void/Closed di halaman edit diblokir validasi

Card: [ETM-16623](https://erpintegration.atlassian.net/browse/ETM-16623) (Test Case, negative) · turunan [ETM-16429](https://erpintegration.atlassian.net/browse/ETM-16429) · konteks [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

## Retest cepat
1. Staging, company **FAT (112)**, buka halaman edit SO yang sudah punya outbound Approved.
2. Klik ikon **Void Doc** (SO Approved) atau **Close Doc** (SO Processed) → konfirmasi **Void Only** / **Closed**.
3. Harus muncul toast merah penolakan, status SO tetap, tidak ada redirect.

## Catatan QA

### Data uji (FAT, 112)
| SO | Status | Outbound | URL edit |
|---|---|---|---|
| SO-6905AB66 | Approved | OT-69153770 | https://staging.olshoperp.com/omni/sales-order/edit/453449 |
| SO-5UL11G0I | Processed | OT-5UMDSIVO | https://staging.olshoperp.com/omni/sales-order/edit/2524805 |

Status database sebelum dan sesudah test identik (status dan tanggal ubah sama; outbound tetap Approved).

### Observasi
- Ikon Void Doc dan Close Doc tetap tampil di halaman edit walau datalist menyembunyikannya (feedback tim atas ETM-16429). Perlindungan data ada di penolakan sistem saat diklik.
- Pesan penolakan untuk Closed berbunyi cannot be voided karena dialog Closed memakai jalur void: [ETM-16625](https://erpintegration.atlassian.net/browse/ETM-16625).
- Dialog Void menampilkan Approver Name kosong dan memicu TypeError di console untuk approval sistem: [ETM-16626](https://erpintegration.atlassian.net/browse/ETM-16626).
- Evidence (teks): https://drive.google.com/drive/folders/1ZHsktToshEkvQoSW4RxpMFE5t0sUtFam
