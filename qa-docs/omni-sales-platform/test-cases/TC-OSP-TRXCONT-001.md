---
doc_type: e2e-test-case
tc_code: TC-OSP-TRXCONT-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Filter Trx. Code Contains potongan pendek/panjang dan paste 500 kode"
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
  - "SO-GKZZSPOV"
  - "KZZSP"
  - "SO-GKZZS"
  - "500 code terbaru FAT"
  - "Label QA: QA-AUTO ETM-16384, 16-10-2026 (read-only, tidak ada data dibuat/dihapus)"
steps:
  - "Advanced Filter → Trx. Code → Contains → potongan pendek (4–5 karakter tengah kode)"
  - "Ganti nilai dengan potongan panjang (awalan SO- + beberapa karakter, bukan kode penuh)"
  - "Ganti kondisi = (equals), paste 500 kode, catat waktu"
expected_result: |
  1. SO yang mengandung potongan pendek tampil.
  2. SO yang mengandung potongan panjang tetap tampil.
  3. Tidak timeout/error/hang; bila cap 100 kode, hasil sesuai kode yang diproses.
test_result:
  status: passed
  executed_at: "2026-10-16"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "KZZSP → 1 (SO-GKZZSPOV); SO-GKZZS → 1; paste 500 → cap 100, 100/100 sesuai 100 kode pertama, network ~1,2 dtk"
  report_url: "https://drive.google.com/drive/folders/1DQmVMwPrcvubqee5UT34UF2vy0oUbd7D"
origin_jira: ETM-16384
---

# TC-OSP-TRXCONT-001 — Filter Trx. Code Contains potongan pendek/panjang dan paste 500 kode ([ETM-16384](https://erpintegration.atlassian.net/browse/ETM-16384))

**Hasil 16-10-2026:** PASSED ✅ · Company FAT (112) · Staging · Evidence: [ETM-16384](https://drive.google.com/drive/folders/1DQmVMwPrcvubqee5UT34UF2vy0oUbd7D)

| Langkah | Aksi | Hasil | Status |
|---|---|---|---|
| 2 | Contains `KZZSP` | 1 entry SO-GKZZSPOV (2,1 dtk) | ✅ |
| 3 | Contains `SO-GKZZS` | 1 entry SO-GKZZSPOV (2,5 dtk) | ✅ |
| 4 | = paste 500 kode | Pesan cap 100; 100 entries = 100 kode pertama; 1,2 dtk; tanpa error | ✅ |

Catatan minor: teks cap menyarankan "Please use 'equals' condition" padahal sudah equals.

## Cara retest cepat (tanpa riset ulang)

1. Buka `https://staging.olshoperp.com/omni/sales-order` (breadcrumb: Omni Channel → Dev - Sales Platform).
2. Klik **Reset Filter** bila ada sisa filter (filter tersimpan antar reload), lalu **Advanced Filter** (komponen *Advanced Filter V2 (Experimental)*, apply otomatis 700 ms setelah input berubah).
3. Pilih kolom (dropdown kiri) → kondisi (dropdown tengah) → isi nilai. Paste banyak nilai (satu per baris) di kondisi `= (equals)` akan memecah jadi banyak input; maks 100 nilai diproses (muncul pesan *"Search is capped at maximum 100 IDs (N detected)"*).
4. Logika AND/OR ada di dropdown kanan baris pertama. **Ganti AND→OR tidak memicu filter ulang** — ketik ulang salah satu nilai agar request jalan.
5. Kolom UI → key API `searchBuilder.criteria`: Trx. Code = `code_formatted_so`, Platform Order ID = `platform_order_id`, Customer = `store_name_formatted` (yang difilter nama toko). Kondisi: `=`, `!=`, `starts with`, `does not start with`, `contains`, `does not contain`, `ends with`, `does not end with`, `null` (Is empty), `is not null`.
6. Endpoint: `POST https://api.staging.olshoperp.com/api/omnichannel/sales-order/get?type=platform` (body JSON DataTables + `advanced_filter_version: 2`).
7. Script crawl: `/workspace/etm-sofilter/{lib,api,ui,verify}.mjs` di box Bugsy (UI per step + verifikasi API: semua baris memenuhi predikat, starts+not starts = total, contains+not contains = total, OR = A + B − (A∩B)).
