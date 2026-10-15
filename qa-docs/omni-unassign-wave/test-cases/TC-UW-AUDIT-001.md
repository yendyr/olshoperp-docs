---
doc_type: e2e-test-case
tc_code: TC-UW-AUDIT-001
menu: omni-unassign-wave
menu_name: "Unassign Wave"
test_type: cross-menu
title: "Audit Log Unassign Wave: perubahan Processing Date (setting SO) dan riwayat Unassign Wave tampil bercampur urut waktu"
summary: "Ubah Processing Date di toolbar Unassign Wave, kirim 1 SO ke Default Wave, lalu cek Log Data > Audit Log: baris Scm Setting dan baris status Unassign Wave SO tampil bercampur urut waktu tanpa error."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-15
requirement_ref: "yendyr/olshoperp dev docs/qa-docs/omni-unassign-wave/requirement.md §5.1 (Processing Date) + Audit"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - omni-skip-wave-process
preconditions:
  - "Login staging playwright@gmail.com (Playwright User), company Lumi Charms.id (153)"
  - "Ada minimal 1 SO di list Unassign Wave dengan Trx. Date ≤ Processing Date yang akan dipakai"
test_data:
  - field: processing_date_awal
    value: "09-07-2026 16:47:44 (nilai company 153 per 15-10-2026; kembalikan ke nilai ini setelah test)"
  - field: processing_date_uji
    value: "15-10-2026 10:00:00 (harus di masa lalu dan ≥ Trx. Date SO)"
  - field: sales_order
    value: "SO-5TU4IOKX (sudah terkirim ke Default Wave 15-10-2026; untuk retest pakai SO lain di list)"
steps:
  - "Buka SCM > Processing > Unassign Wave (/omni/unassign-wave)"
  - "Catat Processing Date di kiri tombol Refresh Availability Stock, lalu ubah ke tanggal uji. Pastikan muncul pesan 'Sales Order processing date successfully updated'"
  - "Cari 1 SO, klik Send to Default Wave (langsung jalan, tanpa dialog). Pesan: 'Sales order are currently on process to default wave'"
  - "Klik Log Data > tab Send Wave Logs: SO tercatat Success"
  - "Kembalikan Processing Date ke nilai awal"
  - "Klik Log Data > tab Audit Log"
expected_result: |
  1. Perubahan Processing Date tampil sebagai baris Source "Scm Setting" (Old Value → New Value, user).
  2. Riwayat Unassign Wave SO (Source "Sales Order", Unassign Wave Status Processing → Success) tampil bercampur urut waktu (terbaru di atas) dengan baris Scm Setting.
  3. Tidak ada error di layar.
test_result:
  status: passed
  started_at: "2026-10-15T14:13:00+07:00"
  finished_at: "2026-10-15T14:14:30+07:00"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "3/3 poin sesuai. Scm Setting 14:13:51 dan 14:14:20 mengapit status Unassign Wave SO-5TU4IOKX 14:14:05."
  report_url: "https://drive.google.com/drive/folders/1JlXbpbpojPpJICGt7JuZYN-je1xc1UF2"
test_data_used:
  - "SO-5TU4IOKX"
run_history: []
origin_jira: ETM-16545
first_execution:
  at: "2026-10-15"
  via: "manual:Bugsy"
  jira: "ETM-16545"
last_execution:
  at: "2026-10-15"
  jira: "ETM-16545"
  status: passed
  via: "manual:Bugsy"
  notes: "Lumi Charms.id (153), playwright@gmail.com. Processing Date 09-07-2026 16:47:44 → 15-10-2026 10:00:00 → kembali. SO-5TU4IOKX dikirim ke Default Wave (Success). Audit Log: 2 baris Scm Setting + status Unassign Wave SO bercampur urut waktu, tanpa error."
---

# TC-UW-AUDIT-001 — Audit Log Unassign Wave (setting tanggal proses SO + log Unassign Wave)

## Konteks

- Card Test Case: [ETM-16545](https://erpintegration.atlassian.net/browse/ETM-16545) (Done, Passed 15-10-2026), origin [ETM-16275](https://erpintegration.atlassian.net/browse/ETM-16275).
- Optimasi query Audits (PR olshoperp#6500) tidak mengubah cabang Scm Setting / Order Process Setting / Unassign Wave; TC ini memastikan cabang itu tetap tampil.
- Processing Date = setting per company, dipakai juga oleh Skip Wave Process. Ubah lalu **kembalikan** ke nilai awal supaya tim tidak terganggu.

## Catatan teknis UI (untuk retest)

- Processing Date: input PrimeVue `input.p-datepicker-input`, simpan otomatis saat blur (`PATCH supplychain/settings`).
- Tanggal masa depan ditolak: "Sales Order processing date cannot set to future time."
- Tanggal lebih awal dari Trx. Date SO → Send ditolak: "The processing date must be on or after the sales order transaction date."
- Audit Log = `GET omnichannel/unassign-wave/audits`; Send Wave Logs = `GET omnichannel/unassign-wave/data-logs`.

## Hasil run 15-10-2026 14:13–14:14 WIB

| # | Expected | Hasil |
|---|---|---|
| 1 | Perubahan setting tanggal proses SO tampil | ✅ Scm Setting 14:13:51 (09-07-2026 16:47:44 → 15-10-2026 10:00:00) dan 14:14:20 (balik) |
| 2 | Log Unassign Wave bercampur urut waktu dengan status SO | ✅ SO-5TU4IOKX Unassign Wave Status Processing → Success 14:14:05, di antara dua baris Scm Setting |
| 3 | Tidak ada error | ✅ |

## Data uji disimpan

- SO-5TU4IOKX sudah di Default Wave (tidak dikembalikan). Retest berikutnya pakai SO lain dari list Unassign Wave.
- Processing Date company 153 sudah dikembalikan ke 09-07-2026 16:47:44.

## Bukti

- Folder: https://drive.google.com/drive/folders/1JlXbpbpojPpJICGt7JuZYN-je1xc1UF2
- Audit Log sesudah: https://drive.google.com/file/d/12xtXuFj0f38xAlD4b4YN58620xV-5A_H/view
- Send Wave Logs: https://drive.google.com/file/d/1IRTiPvY0NgTWnQgjy6V8y_KWTc7BuwpM/view
