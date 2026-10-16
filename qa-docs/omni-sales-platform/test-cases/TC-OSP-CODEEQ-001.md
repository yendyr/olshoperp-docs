---
doc_type: e2e-test-case
tc_code: TC-OSP-CODEEQ-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Filter Trx. Code = (equals) paste 50 kode SO tampil cepat dan lengkap"
summary: "Advanced Filter V2 kolom Trx. Code kondisi = dengan paste 50 kode SO penuh: jumlah entries = 50, semua kode muncul, median waktu tampil < 1 detik."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-16
requirement_ref: "ETM-16274 AC1"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
preconditions:
  - "Login staging playwright@gmail.com, company FAT (112) — Lumi Charms.id hanya ~11 SO platform, tidak cukup untuk 50 kode"
  - "Minimal 50 Sales Order type=platform milik company login"
test_data:
  - field: trx_codes
    value: "50 kode SO penuh (satu per baris / spasi), contoh batch 16-10-2026: SO-683BAF74 … (lihat evidence codes-50.txt)"
steps:
  - "Buka Omni Channel > Dev - Sales Platform (/omni/sales-order)"
  - "Klik Advanced Filter (Advanced Filter V2 Experimental)"
  - "Pilih kolom Trx. Code; pastikan kondisi = (default); paste 50 kode (spasi/newline), tunggu debounce 700ms"
  - "Catat waktu sampai data + Showing … of … entries tampil; ulangi 3×; catat median"
  - "Set page length 50; verifikasi semua 50 kode ada dan tidak ada SO lain"
expected_result: |
  1. Jumlah entries = 50, tidak ada SO lain.
  2. Setiap SO di daftar paste muncul.
  3. Data + total entries tampil < 1 detik (median), tanpa timeout/error.
test_result:
  status: failed
  started_at: "2026-10-16T09:27:00+07:00"
  finished_at: "2026-10-16T09:39:00+07:00"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "Poin 1–2 PASS (recordsFiltered=50, overlap 50/50). Poin 3 FAIL: median wall ~19,3 dtk; median network ~4,3 dtk (target <1 dtk)."
  report_url: "https://drive.google.com/drive/folders/10x0AE24w85zoal4el2RSrlm2WU4hQHcf"
test_data_used:
  - "50 kode platform FAT — lihat ETM-16382-codes-50.txt di Drive"
run_history: []
origin_jira: ETM-16382
first_execution:
  at: "2026-10-16"
  via: "manual:Bugsy"
  jira: "ETM-16382"
last_execution:
  at: "2026-10-16"
  jira: "ETM-16382"
  status: failed
  via: "manual:Bugsy"
  notes: "Staging FAT (112). AF V2 Trx.Code = paste 50. Akurasi OK; performa gagal (<1s)."
---

# TC-OSP-CODEEQ-001 — Filter Trx. Code equals paste 50 kode (ETM-16382)

## Konteks

- Card Test Case: [ETM-16382](https://erpintegration.atlassian.net/browse/ETM-16382) (TESTING PROGRESS per 16-10-2026), origin [ETM-16274](https://erpintegration.atlassian.net/browse/ETM-16274) AC1.
- Menu UI: **Dev - Sales Platform** (`/omni/sales-order`), API `POST …/omnichannel/sales-order/get?type=platform`.
- Advanced Filter = **V2 (Experimental)** (bukan DataTables SearchBuilder klasik): field/condition vue-multiselect, value `input`, auto-apply **700ms** setelah input berubah. Default condition untuk Trx. Code = `=`.

## Cara retest

1. Login staging `playwright@gmail.com` → company **FAT** (bukan Lumi Charms — volume platform SO Lumi ≈ 11).
2. Kumpulkan 50 kode SO platform (export/datalist/`get?type=platform`).
3. Advanced Filter → Trx. Code → `=` → paste 50 kode (pisah spasi atau newline).
4. Ukur 3× waktu sampai hasil + info entries stabil; hitung median.
5. Page length 50 → cek overlap kode vs paste.

## Hasil run 16-10-2026 (WIB)

| Poin | Hasil | Catatan |
|------|-------|---------|
| Entries = 50 | ✅ | `recordsFiltered=50` |
| Semua kode muncul | ✅ | overlap 50/50, 0 extra |
| Median &lt; 1 dtk | ❌ | wall median **19270 ms**; network median **4261 ms** (3 run: 19.5 / 19.1 / 19.3 s) |
| Tanpa error | ✅ | HTTP 200 ×3 |

### Data

- Company: FAT (112)
- Login: playwright@gmail.com
- Sample kode: `SO-683BAF74`, `SO-683BAF75`, `SO-683BAF76`, …
- Condition default UI: `=`

### Evidence

- Folder: https://drive.google.com/drive/folders/10x0AE24w85zoal4el2RSrlm2WU4hQHcf
- AF ready: https://drive.google.com/file/d/1YeO_loOekyw65hfyINFipxBfLcH7c72M/view
- Run median: https://drive.google.com/file/d/1lByNhAFftuPp19cohGT1J6Ww8iDgZ9z2/view
- Final 50: https://drive.google.com/file/d/1iPyndJAMYAU3xaDxaR4OONW3GehrqUJn/view
- Codes list: https://drive.google.com/file/d/1gqWfJNLXAbeWcgb3_LkRb3KWSQJml7qc/view

## Catatan

- Card Jira **tidak** digeser ke Done / Test Result tidak diisi — menunggu keputusan flow Failed (poin performa gagal).
- Volume staging Lumi Charms tidak cukup untuk precondition 50 SO platform; FAT dipakai sesuai spirit card (“bila volume kurang…”).
