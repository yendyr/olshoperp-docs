---
doc_type: e2e-test-case
tc_code: TC-UW-AUDIT-002
menu: omni-unassign-wave
menu_name: "Unassign Wave"
test_type: edge
title: "Audit Log Unassign Wave: batas 60 hari dan performa volume besar (PRODUCTION Merdian, read-only)"
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-15
origin_jira: ETM-16543
environment: production
execution_company:
  id: 4
  code: WNA
preconditions:
  - "Login akun QA production Merdian (kredensial disimpan di env OLSHOPERP_PROD_EMAIL/PASSWORD, jangan ditulis)"
  - "Company WNA (4) = company dengan riwayat Unassign Wave terbanyak (~851 ribu baris / 60 hari)"
steps:
  - "Buka https://merdian.olshoperp.com/omni/unassign-wave > Log Data > tab Audit Log; ukur waktu sampai tabel tampil (3x, median)"
  - "Buka halaman terakhir tabel (atau API start=recordsTotal-20)"
  - "Cek created_at baris tertua: tidak boleh lebih dari 60 hari"
expected_result: |
  1. Tidak ada baris > 60 hari (SO 59 hari tampil, SO 61+ hari tidak).
  2. Tab Audit Log tampil < 3 detik (median), tanpa timeout.
  3. Halaman terakhir terbuka tanpa error.
test_result:
  status: failed
  environment: production
  executed_by: "Bugsy (akun QA production)"
  started_at: "2026-10-15T15:28:00+07:00"
  finished_at: "2026-10-15T15:33:30+07:00"
  log_summary: "Median 14,2 dtk (129,7 / 14,2 / 1,3) > target 3 dtk. 60 hari OK (tertua 18-08-2026). Last page OK 29,8 dtk."
  report_url: "https://drive.google.com/drive/folders/1VVv_DLq9d6AD-_g959gC_cIWP22PC6_V"
last_execution:
  at: "2026-10-15"
  jira: "ETM-16543"
  status: failed
  via: "manual:Bugsy"
  telegram_message_id: 51578
---

# TC-UW-AUDIT-002 — Audit Log Unassign Wave, batas 60 hari & volume besar

> ⚠️ Dijalankan di **PRODUCTION** (Merdian), read-only. Jangan ubah setting / kirim SO di sini.

## Konteks
- Card TC: [ETM-16543](https://erpintegration.atlassian.net/browse/ETM-16543) (origin ETM-16275, optimasi query Audits PR olshoperp#6500).
- Catatan Hazel 14-10-2026: count ~7 dtk, halaman pertama ~22 dtk dari ~827 ribu baris.

## Cara retest cepat
- API: `GET https://api.merdian.olshoperp.com/api/omnichannel/unassign-wave/audits?draw=1&columns[1][data]=created_at_formatted&columns[1][name]=created_at_formatted&order[0][column]=1&order[0][dir]=desc&order[0][name]=created_at_formatted&start=0&length=20&advanced_filter=0&advanced_filter_version=1&show_inactive=false` dengan header `Authorization: Bearer <token dari POST /api/login>`.
- Last page: `start = recordsTotal - (recordsTotal % 20)`.
- Run pertama (cold) jauh lebih lambat; catat ketiganya, pakai median.

## Hasil run 15-10-2026 15:28–15:33 WIB (production)
| Poin | Hasil | Catatan |
|---|---|---|
| Batas 60 hari | ✅ | Tertua 18-08-2026 09:30:40 (58 hari); tidak ada >60 hari. Data 59 hari tidak ada di company 4, jadi SO-A belum bisa dicek persis |
| < 3 detik | ❌ | 129,7 dtk (UI) / 14,2 / 1,3 → median 14,2 dtk; total 851.167 baris |
| Halaman terakhir | ✅ | HTTP 200, 7 baris, 29,8 dtk |

Minor UI: dropdown page size "20" menimpa nomor halaman di pagination.

Evidence: [folder Drive ETM-16543](https://drive.google.com/drive/folders/1VVv_DLq9d6AD-_g959gC_cIWP22PC6_V).
