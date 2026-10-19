---
doc_type: e2e-test-case
tc_code: TC-SPLG-059
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Happy: datalist Sales Order muat cepat dan tombol Void tetap tersedia untuk SO tanpa outbound Approved"
summary: "Datalist Dev - Sales Platform termuat normal dengan waktu muat jauh lebih cepat setelah optimasi pengecekan outbound Approved, dan tombol Void tetap muncul dan aktif untuk SO Approved tanpa outbound Approved (datalist dan halaman detail)."
status: draft
owner: QA - Yemima
last_updated: 2026-10-19
requirement_ref: "card ETM-16428, card asal ETM-16276 (PR olshoperp#6475); requirement.md §6.9 V-VR-06 (guard Void existing: outbound/invoice tetap)"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "Login staging https://staging.olshoperp.com dengan akun yang punya akses menu 'Dev - Sales Platform' dan izin approval; company aktif FAT (112)"
  - "Datalist FAT berisi banyak data (±586 ribu SO) sehingga waktu muat bermakna"
  - "Ada SO Platform berstatus Approved tanpa Mutation Outbound Approved (SO-KKZ7DSRO, SO-HTX52D7U)"
test_data:
  - field: so_eligible_void_a
    value: "SO-KKZ7DSRO (id 2526909, Approved, tanpa outbound Approved)"
  - field: so_eligible_void_b
    value: "SO-HTX52D7U (id 2529017, Approved, tanpa outbound Approved)"
  - field: ukuran_datalist
    value: "586.288 SO tanpa filter, 20 baris per halaman"
steps:
  - "Login https://staging.olshoperp.com/login, lalu ganti company: klik avatar profil di topbar → 'Switch Company' → 'FAT' → 'Proceed'; pastikan company aktif FAT (112)"
  - "Buka sidebar 'Omni Channel' → 'Dev - Sales Platform' (https://staging.olshoperp.com/omni/sales-order) tanpa filter; tunggu baris datalist tampil penuh"
  - "Ukur waktu muat: DevTools Network, request POST /api/omnichannel/sales-order/get (kolom Time) sampai respons selesai; muat ulang halaman penuh total 3 kali dan catat median"
  - "Periksa datalist normal: 20 baris tampil, teks 'Showing 1 to 20 of 586.288 entries', klik halaman 2 → baris berubah ('Showing 21 to 40 ...') tanpa error"
  - "Isi kotak 'find something ...' dengan SO-KKZ7DSRO, Enter → 1 baris; geser tabel ke kolom 'Action' paling kanan — tombol 'Void' (tooltip-void) ada dan tidak disabled; ulangi dengan SO-HTX52D7U"
  - "Buka halaman detail https://staging.olshoperp.com/omni/sales-order/edit/2526909 (dan /2529017) — ikon 'Void Doc' ada di toolbar kanan atas; JANGAN diklik"
  - "Selama langkah di atas pantau console browser (error/warn) dan status panggilan API (tidak ada status 4xx/5xx)"
expected_result: |
  1. Datalist tampil normal: baris, total entries, filter, dan pagination berfungsi tanpa error.
  2. Waktu muat datalist (request POST /api/omnichannel/sales-order/get, tanpa filter, median 3 kali muat ulang) jauh lebih cepat daripada baseline slow-log sebelum optimasi (maksimal ±113 detik di Merdian). Dev mengklaim di bawah ±1 detik.
  3. Tombol Void tetap muncul dan aktif untuk SO Approved tanpa Mutation Outbound Approved, di kolom Action datalist maupun di halaman detail.

  [CATATAN QA] Target waktu resmi belum ditetapkan di requirement.md maupun card (card meminta konfirmasi Lead). Pada run 19-10-2026 median 1.049 ms (run 1) dan 2.210 ms (run 2) belum di bawah 1 detik; Lead memutuskan card ditutup dengan catatan. Konfirmasi ke QA lead jika target resmi perlu ditetapkan di requirement.
test_result:
  status: passed
  started_at: "2026-10-19T12:52:47+07:00"
  finished_at: "2026-10-19T12:54:37+07:00"
  executed_by: "Bugsy (Claude, login playwright@gmail.com)"
  environment: staging
  log_summary: "6 kali muat datalist: request /get 1.024, 1.049, 1.649 ms (median 1.049) dan 2.210, 2.402, 1.085 ms (median 2.210); gabungan median 1.367 ms. Pagination halaman 2 OK (200, 20 baris). SO-KKZ7DSRO dan SO-HTX52D7U punya tombol Void aktif di datalist dan ikon Void Doc di detail. Console 0 error/warn, 0 panggilan API gagal."
  report_url: "https://drive.google.com/drive/folders/1edfEYaFide37Nvj5uPoaWMKo2HNQRJko"
test_data_used:
  - "SO-KKZ7DSRO"
  - "SO-HTX52D7U"
run_history: []
origin_jira: ETM-16428
first_execution:
  at: "2026-10-19"
  via: "manual:Bugsy"
  jira: ETM-16428
last_execution:
  at: "2026-10-19"
  jira: ETM-16428
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 19-10-2026 12:52-12:54 WIB, staging, company FAT (112), login playwright@gmail.com lewat UI crawl otomatis. Actual: median waktu request datalist 1.049 ms (run 1) dan 2.210 ms (run 2), gabungan enam sampel 1.367 ms, belum di bawah 1 detik tetapi jauh lebih cepat dari baseline sekitar 113 detik; datalist dan pagination normal; tombol Void aktif di datalist dan detail untuk dua SO eligible; console tanpa error. Ditutup passed dengan catatan atas keputusan Yemima."
---

# TC-SPLG-059 — Datalist cepat + Void tetap tersedia

Card: [ETM-16428](https://erpintegration.atlassian.net/browse/ETM-16428) (Test Case, happy) · card asal: [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

## Retest cepat
1. Staging, company **FAT (112)** → **Omni Channel → Dev - Sales Platform**, tanpa filter.
2. DevTools Network: catat waktu `POST /api/omnichannel/sales-order/get`, muat ulang 3×, ambil median.
3. Cari SO Approved tanpa outbound Approved → tombol **Void** harus ada dan aktif (datalist) dan ikon **Void Doc** ada di halaman edit. Jangan klik.

## Catatan QA

### Hasil ukur 19-10-2026 (request /get, ms)
| Muat | Run 1 | Run 2 |
|---|---|---|
| 1 | 1.024 | 2.210 |
| 2 | 1.049 | 2.402 |
| 3 | 1.649 | 1.085 |
| Median | **1.049** | **2.210** |

Gabungan 6 sampel: median 1.367 ms; tidak ada sampel di bawah 1.000 ms. Waktu sampai baris tampil: median 1.535 ms (run 1) dan 2.546 ms (run 2). Waktu bervariasi 1,0–2,4 detik; disarankan dipantau lagi setelah deploy ke Merdian.

### Data uji (FAT, 112)
| SO | Status | Outbound Approved | URL edit |
|---|---|---|---|
| SO-KKZ7DSRO | Approved | tidak ada | https://staging.olshoperp.com/omni/sales-order/edit/2526909 |
| SO-HTX52D7U | Approved | tidak ada | https://staging.olshoperp.com/omni/sales-order/edit/2529017 |

Data uji tidak diubah (Void tidak diklik).

### Observasi
- Panggilan `pill-count` (endpoint lain, di luar optimasi) mencapai 1.884 ms.
- Baseline 113 detik berasal dari Merdian (produksi), jadi tidak dapat dibandingkan satu lawan satu dengan staging.
- Evidence (teks): https://drive.google.com/drive/folders/1edfEYaFide37Nvj5uPoaWMKo2HNQRJko
