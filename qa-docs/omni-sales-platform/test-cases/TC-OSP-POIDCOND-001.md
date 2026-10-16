---
doc_type: e2e-test-case
tc_code: TC-OSP-POIDCOND-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: regression
title: "Kondisi filter Platform Order Id lain dan logika OR sama seperti sebelum optimasi"
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
  - "5843"
  - "8264"
  - "6776"
  - "261016QEYTEN4M (SO-NEJGN3VT)"
  - "Customer: Lumielle Crafts"
  - "Label QA: QA-AUTO ETM-16358, 16-10-2026 (read-only, tidak ada data dibuat/dihapus)"
steps:
  - "Platform Order ID Starts with 4 digit"
  - "Ends with 4 digit"
  - "Does not start with 4 digit"
  - "Does not contain 4 digit"
  - "Is empty"
  - "2 kondisi OR: Platform Order ID = ID penuh OR Customer berisi nama customer"
expected_result: |
  Langkah 2–6 sesuai predikat (Does not contain termasuk SO tanpa ID; Is empty hanya SO tanpa ID); langkah 7 gabungan.
test_result:
  status: failed
  executed_at: "2026-10-16"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "Langkah 2–6 OK; langkah 7 OR Customer → 586.097 (semua SO), expected 11"
  report_url: "https://drive.google.com/drive/folders/1WDvmrNT1kRcqR3J0eVA7jfb5O6aWkh3j"
origin_jira: ETM-16358
---

# TC-OSP-POIDCOND-001 — Kondisi filter Platform Order Id lain dan logika OR sama seperti sebelum optimasi ([ETM-16358](https://erpintegration.atlassian.net/browse/ETM-16358))

**Hasil 16-10-2026:** FAILED ❌ · Company FAT (112) · Staging · Evidence: [ETM-16358](https://drive.google.com/drive/folders/1WDvmrNT1kRcqR3J0eVA7jfb5O6aWkh3j)

| Langkah | Aksi | Hasil | Status |
|---|---|---|---|
| 2 | Starts with `5843` | 199 entries | ✅ |
| 3 | Ends with `8264` | 43 entries | ✅ |
| 4 | Does not start with `5843` | 585.898; starts + not starts = total | ✅ |
| 5 | Does not contain `6776` | 585.602 incl. SO tanpa ID; contains 495 + not contains = total | ✅ |
| 6 | Is empty | 1.764, semua tanpa Platform Order ID | ✅ |
| 7 | `= 261016QEYTEN4M` OR Customer contains `Lumielle Crafts` | 586.097 (semua SO); AND = 0; expected 11 | ❌ |

## Cara retest cepat (tanpa riset ulang)

1. Buka `https://staging.olshoperp.com/omni/sales-order` (breadcrumb: Omni Channel → Dev - Sales Platform).
2. Klik **Reset Filter** bila ada sisa filter (filter tersimpan antar reload), lalu **Advanced Filter** (komponen *Advanced Filter V2 (Experimental)*, apply otomatis 700 ms setelah input berubah).
3. Pilih kolom (dropdown kiri) → kondisi (dropdown tengah) → isi nilai. Paste banyak nilai (satu per baris) di kondisi `= (equals)` akan memecah jadi banyak input; maks 100 nilai diproses (muncul pesan *"Search is capped at maximum 100 IDs (N detected)"*).
4. Logika AND/OR ada di dropdown kanan baris pertama. **Ganti AND→OR tidak memicu filter ulang** — ketik ulang salah satu nilai agar request jalan.
5. Kolom UI → key API `searchBuilder.criteria`: Trx. Code = `code_formatted_so`, Platform Order ID = `platform_order_id`, Customer = `store_name_formatted` (yang difilter nama toko). Kondisi: `=`, `!=`, `starts with`, `does not start with`, `contains`, `does not contain`, `ends with`, `does not end with`, `null` (Is empty), `is not null`.
6. Endpoint: `POST https://api.staging.olshoperp.com/api/omnichannel/sales-order/get?type=platform` (body JSON DataTables + `advanced_filter_version: 2`).
7. Script crawl: `/workspace/etm-sofilter/{lib,api,ui,verify}.mjs` di box Bugsy (UI per step + verifikasi API: semua baris memenuhi predikat, starts+not starts = total, contains+not contains = total, OR = A + B − (A∩B)).
