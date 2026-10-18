---
doc_type: e2e-test-case
tc_code: TC-OSP-TRXCOND-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: regression
title: "Kondisi filter Trx. Code lain dan logika OR sama seperti sebelum optimasi"
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-16
requirement_ref: "Origin Improvement ETM-16274"
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
  - "SO-GK"
  - "SPOV"
  - "ZZSP"
  - "SO-NEJGN3VT"
  - "Customer: Lumielle Crafts (10 SO)"
  - "Label QA: QA-AUTO ETM-16386, 16-10-2026 (read-only, tidak ada data dibuat/dihapus)"
steps:
  - "Trx. Code Starts with awalan"
  - "Ends with akhiran"
  - "Does not start with awalan"
  - "Does not contain potongan"
  - "Contains 1 potongan pendek"
  - "2 kondisi OR: Trx. Code = kode penuh OR Customer berisi nama customer"
expected_result: |
  Langkah 2–6 sesuai predikat; langkah 7 tampil SO kode itu DAN semua SO customer (gabungan).
test_result:
  status: failed
  executed_at: "2026-10-16"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "Langkah 2–6 OK; langkah 7 OR Customer → 586.096 (semua SO), expected 11"
  report_url: "https://drive.google.com/drive/folders/1OGtM_kvkeWxoDkOHzWlPVaWpTBKt3LvZ"
origin_jira: ETM-16386
first_execution:
  at: "2026-10-16"
  via: "manual:Bugsy"
  jira: ETM-16386
last_execution:
  at: "2026-10-16"
  jira: ETM-16386
  status: failed
  via: "manual:Bugsy"
  notes: "Staging, company FAT (112), 16-10-2026, dijalankan Bugsy. Yang diuji: Kondisi filter Trx. Code lain dan logika OR sama seperti sebelum optimasi. Yang teramati: Langkah 2–6 OK; langkah 7 OR Customer → 586.096 (semua SO), expected 11. Bukti lengkap di folder Drive https://drive.google.com/drive/folders/1OGtM_kvkeWxoDkOHzWlPVaWpTBKt3LvZ"
---

# TC-OSP-TRXCOND-001 — Kondisi filter Trx. Code lain dan logika OR sama seperti sebelum optimasi ([ETM-16386](https://erpintegration.atlassian.net/browse/ETM-16386))

**Hasil 16-10-2026:** FAILED ❌ · Company FAT (112) · Staging · Evidence: [ETM-16386](https://drive.google.com/drive/folders/1OGtM_kvkeWxoDkOHzWlPVaWpTBKt3LvZ)

| Langkah | Aksi | Hasil | Status |
|---|---|---|---|
| 2 | Starts with `SO-GK` | 2 entries, semua diawali SO-GK | ✅ |
| 3 | Ends with `SPOV` | 1 entry SO-GKZZSPOV | ✅ |
| 4 | Does not start with `SO-GK` | 586.093 (= total − 2) | ✅ |
| 5 | Does not contain `ZZSP` | 586.094 (= total − 1) | ✅ |
| 6 | Contains `ZZSP` | 1 entry | ✅ |
| 7 | `= SO-NEJGN3VT` OR Customer contains `Lumielle Crafts` | 586.096 (semua SO); AND = 0; expected 11 | ❌ |

Isolasi: Customer contains sendirian dengan logic OR juga → semua SO. OR Trx. Code + Platform Order ID benar (2). Ganti AND→OR tidak memicu filter ulang.

## Cara retest cepat (tanpa riset ulang)

1. Buka `https://staging.olshoperp.com/omni/sales-order` (breadcrumb: Omni Channel → Dev - Sales Platform).
2. Klik **Reset Filter** bila ada sisa filter (filter tersimpan antar reload), lalu **Advanced Filter** (komponen *Advanced Filter V2 (Experimental)*, apply otomatis 700 ms setelah input berubah).
3. Pilih kolom (dropdown kiri) → kondisi (dropdown tengah) → isi nilai. Paste banyak nilai (satu per baris) di kondisi `= (equals)` akan memecah jadi banyak input; maks 100 nilai diproses (muncul pesan *"Search is capped at maximum 100 IDs (N detected)"*).
4. Logika AND/OR ada di dropdown kanan baris pertama. **Ganti AND→OR tidak memicu filter ulang** — ketik ulang salah satu nilai agar request jalan.
5. Kolom UI → key API `searchBuilder.criteria`: Trx. Code = `code_formatted_so`, Platform Order ID = `platform_order_id`, Customer = `store_name_formatted` (yang difilter nama toko). Kondisi: `=`, `!=`, `starts with`, `does not start with`, `contains`, `does not contain`, `ends with`, `does not end with`, `null` (Is empty), `is not null`.
6. Endpoint: `POST https://api.staging.olshoperp.com/api/omnichannel/sales-order/get?type=platform` (body JSON DataTables + `advanced_filter_version: 2`).
7. Script crawl: `/workspace/etm-sofilter/{lib,api,ui,verify}.mjs` di box Bugsy (UI per step + verifikasi API: semua baris memenuhi predikat, starts+not starts = total, contains+not contains = total, OR = A + B − (A∩B)).
