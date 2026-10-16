---
doc_type: e2e-test-case
tc_code: TC-OSP-POIDEQ-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Filter Platform Order Id = (equals) paste 50/100 ID cepat dan lengkap"
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-16
requirement_ref: "Origin Improvement ETM-16273"
automated: false
execution_company:
  id: 112
  code: fat
  label: "FAT"
preconditions:
  - "Login staging playwright@gmail.com, switch company ke FAT (112) via avatar → Switch Company → FAT → Proceed"
  - "FAT punya ±586.095 SO platform (Lumi Charms.id cuma 11 SO — tidak cukup untuk paste 50/100/500)"
  - "Catatan: company aktif disimpan di server per user — switch company mengubah sesi playwright@ di tab/agent lain"
test_data:
  - "50/100 Platform Order ID terbaru FAT (261016QPCYQY7U, …)"
  - "Label QA: QA-AUTO ETM-16354, 16-10-2026 (read-only, tidak ada data dibuat/dihapus)"
steps:
  - "Advanced Filter → Platform Order ID → = (equals)"
  - "Paste 50 ID, catat waktu sampai entries tampil (3x, median)"
  - "Ulangi dengan 100 ID"
expected_result: |
  Entries = jumlah ID, semua SO muncul, median < 2 dtk tanpa error.
test_result:
  status: passed
  executed_at: "2026-10-16"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "50 → 50 (median network 1,24 dtk); 100 → 100 (median 1,34 dtk); 0 missing/extra"
  report_url: "https://drive.google.com/drive/folders/16WAk74qaflF1pxyMfCo9HFRYtB-Qc0Sc"
origin_jira: ETM-16354
---

# TC-OSP-POIDEQ-001 — Filter Platform Order Id = (equals) paste 50/100 ID cepat dan lengkap ([ETM-16354](https://erpintegration.atlassian.net/browse/ETM-16354))

**Hasil 16-10-2026:** PASSED ✅ · Company FAT (112) · Staging · Evidence: [ETM-16354](https://drive.google.com/drive/folders/16WAk74qaflF1pxyMfCo9HFRYtB-Qc0Sc)

| Langkah | Aksi | Hasil | Status |
|---|---|---|---|
| 3–4 | Paste 50 ID (3x) | of 50 entries; network 1,25/1,24/1,18 dtk (median 1,24) | ✅ |
| 5 | Paste 100 ID (3x) | of 100 entries; network 1,42/1,34/1,30 dtk (median 1,34) | ✅ |

Catatan: wall-clock termasuk debounce 700 ms ≈ 2,8–3,0 dtk. API langsung length 100 baris 5,6–8,9 dtk, 1x HTTP 422 (tidak di UI).

## Cara retest cepat (tanpa riset ulang)

1. Buka `https://staging.olshoperp.com/omni/sales-order` (breadcrumb: Omni Channel → Dev - Sales Platform).
2. Klik **Reset Filter** bila ada sisa filter (filter tersimpan antar reload), lalu **Advanced Filter** (komponen *Advanced Filter V2 (Experimental)*, apply otomatis 700 ms setelah input berubah).
3. Pilih kolom (dropdown kiri) → kondisi (dropdown tengah) → isi nilai. Paste banyak nilai (satu per baris) di kondisi `= (equals)` akan memecah jadi banyak input; maks 100 nilai diproses (muncul pesan *"Search is capped at maximum 100 IDs (N detected)"*).
4. Logika AND/OR ada di dropdown kanan baris pertama. **Ganti AND→OR tidak memicu filter ulang** — ketik ulang salah satu nilai agar request jalan.
5. Kolom UI → key API `searchBuilder.criteria`: Trx. Code = `code_formatted_so`, Platform Order ID = `platform_order_id`, Customer = `store_name_formatted` (yang difilter nama toko). Kondisi: `=`, `!=`, `starts with`, `does not start with`, `contains`, `does not contain`, `ends with`, `does not end with`, `null` (Is empty), `is not null`.
6. Endpoint: `POST https://api.staging.olshoperp.com/api/omnichannel/sales-order/get?type=platform` (body JSON DataTables + `advanced_filter_version: 2`).
7. Script crawl: `/workspace/etm-sofilter/{lib,api,ui,verify}.mjs` di box Bugsy (UI per step + verifikasi API: semua baris memenuhi predikat, starts+not starts = total, contains+not contains = total, OR = A + B − (A∩B)).
