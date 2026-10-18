---
doc_type: e2e-test-case
tc_code: TC-OSP-POIDCONT-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Filter Platform Order Id Contains potongan pendek/panjang dan paste 500 ID"
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
  - "584316776549418264 (SO-5TDO5VXY)"
  - "77654"
  - "4316776549"
  - "500 Platform Order ID terbaru FAT"
  - "Label QA: QA-AUTO ETM-16356, 16-10-2026 (read-only, tidak ada data dibuat/dihapus)"
steps:
  - "Platform Order ID Contains 5 digit tengah"
  - "Contains 10 digit (bukan ID penuh)"
  - "= (equals) paste 500 ID, catat waktu"
expected_result: |
  1. SO yang mengandung potongan tampil.
  2. Potongan 10 digit tetap tampil.
  3. Semua SO dari daftar tampil, tanpa timeout/error/hang.
test_result:
  status: failed
  executed_at: "2026-10-16"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "Contains OK; paste 500 → hanya 100 (cap 100), expected semua 500"
  report_url: "https://drive.google.com/drive/folders/1YF9gOz2N3ZyUZI8vf5q2YtORVs4K29T_"
origin_jira: ETM-16356
first_execution:
  at: "2026-10-16"
  via: "manual:Bugsy"
  jira: ETM-16356
last_execution:
  at: "2026-10-16"
  jira: ETM-16356
  status: failed
  via: "manual:Bugsy"
  notes: "Staging, company FAT (112), 16-10-2026, dijalankan Bugsy. Yang diuji: Filter Platform Order Id Contains potongan pendek/panjang dan paste 500 ID. Yang teramati: Contains OK; paste 500 → hanya 100 (cap 100), expected semua 500. Bukti lengkap di folder Drive https://drive.google.com/drive/folders/1YF9gOz2N3ZyUZI8vf5q2YtORVs4K29T_"
---

# TC-OSP-POIDCONT-001 — Filter Platform Order Id Contains potongan pendek/panjang dan paste 500 ID ([ETM-16356](https://erpintegration.atlassian.net/browse/ETM-16356))

**Hasil 16-10-2026:** FAILED ❌ · Company FAT (112) · Staging · Evidence: [ETM-16356](https://drive.google.com/drive/folders/1YF9gOz2N3ZyUZI8vf5q2YtORVs4K29T_)

| Langkah | Aksi | Hasil | Status |
|---|---|---|---|
| 2 | Contains `77654` | 35 entries incl. SO-5TDO5VXY (2,4 dtk) | ✅ |
| 3 | Contains `4316776549` | 1 entry SO-5TDO5VXY | ✅ |
| 4 | = paste 500 ID | 100 entries (cap 100, pesan muncul), 1,4 dtk, tanpa error; expected semua 500 | ❌ |

Perlu putusan: cap 100 kelihatannya disengaja (ETM-16384 menerima cap) — Expected TC atau cap yang diubah?

## Cara retest cepat (tanpa riset ulang)

1. Buka `https://staging.olshoperp.com/omni/sales-order` (breadcrumb: Omni Channel → Dev - Sales Platform).
2. Klik **Reset Filter** bila ada sisa filter (filter tersimpan antar reload), lalu **Advanced Filter** (komponen *Advanced Filter V2 (Experimental)*, apply otomatis 700 ms setelah input berubah).
3. Pilih kolom (dropdown kiri) → kondisi (dropdown tengah) → isi nilai. Paste banyak nilai (satu per baris) di kondisi `= (equals)` akan memecah jadi banyak input; maks 100 nilai diproses (muncul pesan *"Search is capped at maximum 100 IDs (N detected)"*).
4. Logika AND/OR ada di dropdown kanan baris pertama. **Ganti AND→OR tidak memicu filter ulang** — ketik ulang salah satu nilai agar request jalan.
5. Kolom UI → key API `searchBuilder.criteria`: Trx. Code = `code_formatted_so`, Platform Order ID = `platform_order_id`, Customer = `store_name_formatted` (yang difilter nama toko). Kondisi: `=`, `!=`, `starts with`, `does not start with`, `contains`, `does not contain`, `ends with`, `does not end with`, `null` (Is empty), `is not null`.
6. Endpoint: `POST https://api.staging.olshoperp.com/api/omnichannel/sales-order/get?type=platform` (body JSON DataTables + `advanced_filter_version: 2`).
7. Script crawl: `/workspace/etm-sofilter/{lib,api,ui,verify}.mjs` di box Bugsy (UI per step + verifikasi API: semua baris memenuhi predikat, starts+not starts = total, contains+not contains = total, OR = A + B − (A∩B)).
