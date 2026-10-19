---
doc_type: e2e-test-case
tc_code: TC-OSP-SHIPBIND-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: regression
title: "Shipper Service SO platform hanya dari binding company order (tidak bocor lintas company)"
summary: "SO platform menampilkan Shipper Service dari binding milik owned_by SO; konsisten di Edit SO, datalist Sales Platform, dan Process Summary (search & sort Shipper)."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-19
requirement_ref: "ETM-16242 Expected Result"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
preconditions:
  - "Login staging playwright@gmail.com, company FAT (112)"
  - "Platform shipping id 12 (SP-Reguler (Cashless)-PU) punya binding di 2 company: pivot 3 Dev Staging (13) -> Shopee Express Reguler PU; pivot 130 FAT (112) -> SPX-Reg-DO"
  - "Platform shipping id 50 juga dipakai 2 company: Dev Staging pivot 5 -> Shopee Express Reguler PU; FAT -> SPX-INS-PU-4"
test_data:
  - field: so_fat
    value: "SO-3LTN8QXO (id 2525645, FAT, shipping_platform_system_id 12)"
  - field: so_devstg
    value: "SO-QHYW0LVJ (id 2526165, Dev Staging, shipping_platform_system_id 50)"
steps:
  - "Company FAT: buka /omni/sales-order/edit/2525645, cek field Shipper Service"
  - "API GET /api/omnichannel/sales-order/2525645: cek shipping_binding_pivot.id / owned_by / shipping_service.name"
  - "Datalist /omni/sales-order: search SO-3LTN8QXO, cek kolom Shipper"
  - "Company Dev Staging: SO-QHYW0LVJ harus tampil binding Dev Staging (pivot 5)"
  - "Process Summary (/omni/process-summary, API GET /api/omnichannel/transfer-summary): search global 'SPX-Reg-DO' harus menemukan SO-3LTN8QXO; search 'Shopee Express Reguler PU' tidak boleh menemukan SO FAT"
  - "Process Summary: sort kolom Shipper (column 7 shipper_track_formatted) asc/desc, length 100: tidak ada id dobel, tidak error 500"
expected_result: |
  1. Edit SO FAT: Shipper Service = SPX-Reg-DO (binding FAT), bukan Shopee Express Reguler PU.
  2. Datalist FAT: kolom Shipper SO-3LTN8QXO = SPX-Reg-DO.
  3. SO company lain dengan platform shipping sama tampil binding company sendiri.
  4. Search Shipper di Process Summary memakai binding company order.
  5. Sort Shipper di Process Summary tidak menghasilkan baris dobel / error.
test_result:
  status: failed
  started_at: "2026-10-19T10:09:00+07:00"
  finished_at: "2026-10-19T10:20:00+07:00"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "Poin 1-3 PASS. Poin 4 FAIL: search 'SPX-Reg-DO' 195 hasil tanpa SO-3LTN8QXO; search 'Shopee Express Reguler PU' 26.894 hasil termasuk SO-3LTN8QXO (FAT). Poin 5 FAIL: sort desc 100 baris hanya 73 id unik (27 dobel, mis. 686028); asc sekali HTTP 500. Validasi shipping/Skip Processing/Export belum diuji."
  report_url: "https://drive.google.com/drive/folders/1uJiAlRJQYUQ_QEocTRSiG3dFeWY2Tc7E"
test_data_used:
  - "SO-3LTN8QXO (2525645, FAT) dan SO-QHYW0LVJ (2526165, Dev Staging), data existing, tidak ada data baru"
run_history: []
origin_jira: ETM-16242
first_execution:
  at: "2026-10-19"
  via: "manual:Bugsy (/bugsy Telegram)"
  jira: "ETM-16242"
last_execution:
  at: "2026-10-19"
  jira: "ETM-16242"
  status: failed
  via: "manual:Bugsy (/bugsy Telegram)"
  notes: "Staging FAT (112). Tampilan per SO sudah benar; Process Summary search & sort Shipper masih lintas company."
---

# TC-OSP-SHIPBIND-001 — Shipper Service per company (ETM-16242)

## Konteks
- Card: [ETM-16242](https://erpintegration.atlassian.net/browse/ETM-16242) (Error, QA Review). Fix BE: PR #6531 (546dc5a, merge 968274b 16-10-2026) — `SalesOrder::shipping_binding_pivot()` filter owned_by, datalist/show/cache SalesOrderController.
- Sisa gap (screening 19-10-2026 + test ini): `TransferSummaryController` filter search Shipper pakai `MIN(sbp2.id)` tanpa owned_by, dan orderColumn `shipper_track_formatted` leftJoin pivot tanpa owned_by (baris dobel).

## Cara retest cepat
1. Login staging, company FAT.
2. Edit SO 2525645 → Shipper Service harus SPX-Reg-DO.
3. Replay request datalist Process Summary (`GET /api/omnichannel/transfer-summary?...`) dengan `search[value]=SPX-Reg-DO` (length 300) → harus berisi id 2525645; dengan `search[value]=Shopee Express Reguler PU` → tidak boleh ada SO owned FAT.
4. Replay dengan `order[0][column]=7&order[0][dir]=desc&length=100` → jumlah id unik harus = jumlah baris.

## Hasil 19-10-2026
| # | Poin | Hasil |
|---|------|-------|
| 1 | Edit SO FAT Shipper Service = SPX-Reg-DO (pivot 130, owned_by 112) | ✅ |
| 2 | Datalist FAT SO-3LTN8QXO = SPX-Reg-DO | ✅ |
| 3 | Dev Staging SO-QHYW0LVJ = Shopee Express Reguler PU (pivot 5, owned_by 13) | ✅ |
| 4 | Process Summary search Shipper per company | ❌ |
| 5 | Process Summary sort Shipper tanpa dobel | ❌ |
| - | Validasi shipping / Skip Processing / Export background | ⏭️ |

Evidence: [Drive ETM-16242](https://drive.google.com/drive/folders/1uJiAlRJQYUQ_QEocTRSiG3dFeWY2Tc7E). Scratch spec (gitignored): `tests/scratch/etm-16242-*.spec.ts`.
