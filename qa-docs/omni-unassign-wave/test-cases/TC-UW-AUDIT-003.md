---
doc_type: e2e-test-case
tc_code: TC-UW-AUDIT-003
menu: omni-unassign-wave
menu_name: "Unassign Wave"
test_type: negative
title: "Audit Log Unassign Wave: perubahan SO di luar status Unassign Wave dan data company lain tidak ikut tampil"
summary: "Edit SO-1 (company A) di field yang bukan Unassign Wave, lalu cek Log Data > Audit Log company A: perubahan SO-1 tidak muncul, SO-2 milik company B tidak muncul, tabel normal tanpa error."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-20
requirement_ref: "Card ETM-16542 (origin ETM-16275, PR olshoperp#6500). requirement.md menu ini belum merinci tab Audit Log."
automated: false
automated_spec: null
environment: staging
execution_company:
  id: 13
  code: DEV-STG
company_b:
  id: 153
  code: lumicharmsid
related_menus:
  - businessdevelopment-sales-order-general
preconditions:
  - "Login staging playwright@gmail.com (Playwright User, id 74). Company aktif = Dev Staging (13) (company A)"
  - "Company B = Lumi Charms.id (153) punya SO dengan riwayat Unassign Wave dalam 60 hari (SO-5TU4IOKX, dari ETM-16545)"
  - "SO-1 harus bisa diedit (status Draft/Open); SO Approved tidak bisa diedit"
test_data:
  - field: so_1
    value: "SO-5U73Y7H5 (id 2519538, Dev Staging, Draft, dibuat Playwright User 21-08-2026; awalnya data uji ETM-15541 TC-SOG-004)"
  - field: so_2
    value: "SO-5TU4IOKX (id 2505517, Lumi Charms.id) — Unassign Wave Status Processing → Success 15-10-2026 14:14:05"
  - field: edit_so_1
    value: "Buyer Notes + ' | QA ETM-16542 20-10-2026'; Platform Order ID 'QA-ETM-16542-20102026'; Transaction Date 21-08-2026 21:04:08 → 21:05:08"
steps:
  - "Buka Busdev > Dev - Sales Order, klik kode SO-1 (terbuka di tab baru, halaman edit)"
  - "Ubah data yang bukan Unassign Wave lalu Save All. Pakai Transaction Date (geser 1 menit) supaya benar-benar ada riwayat perubahan SO; Buyer Notes & Platform Order ID tidak tercatat di riwayat audit SO"
  - "Cek Audit Log di panel kanan halaman edit SO-1: ada baris 'Transaction Date: lama → baru'"
  - "Buka SCM > Processing > Unassign Wave > Log Data > tab Audit Log (company A)"
  - "Cari SO-1 dan SO-2 di kotak 'find something ...' DAN cek seluruh baris (semua halaman / API length besar), karena search tidak bisa cari kode SO"
expected_result: |
  1. Perubahan SO-1 yang bukan status Unassign Wave tidak muncul di tab Audit Log Unassign Wave.
  2. SO-2 (company B) tidak muncul di Audit Log company A.
  3. Tidak ada error di layar; tabel tampil normal.
test_result:
  status: passed
  started_at: "2026-10-20T10:16:00+07:00"
  finished_at: "2026-10-20T10:23:45+07:00"
  executed_by: "Bugsy (playwright@gmail.com)"
  environment: staging
  log_summary: "3/3 sesuai. Audit Log Dev Staging 992 baris sebelum & sesudah edit, SO-5U73Y7H5 dan SO-5TU4IOKX tidak ada. Search tidak bisa cari kode SO (catatan)."
  report_url: "https://drive.google.com/drive/folders/1Q8YMujfpMIMQq2Y-Rr6mxtGSWHuR8A8D"
test_data_used:
  - "SO-5U73Y7H5"
  - "SO-5TU4IOKX"
run_history: []
origin_jira: ETM-16542
first_execution:
  at: "2026-10-20"
  via: "webhook:/bugsy (Telegram)"
  jira: "ETM-16542"
last_execution:
  at: "2026-10-20"
  jira: "ETM-16542"
  status: passed
  via: "webhook:/bugsy (Telegram)"
  telegram_message_id: 52045
  notes: "Dev Staging (13) vs Lumi Charms.id (153), playwright@gmail.com. Edit SO-5U73Y7H5 (Buyer Notes, Platform Order ID, Transaction Date) tidak muncul di Audits; SO-5TU4IOKX tidak muncul; tabel normal."
---

# TC-UW-AUDIT-003 — Audit Log Unassign Wave tidak menampilkan perubahan SO lain / data company lain

## Konteks

- Card Test Case: [ETM-16542](https://erpintegration.atlassian.net/browse/ETM-16542) (Done, Passed 20-10-2026), origin [ETM-16275](https://erpintegration.atlassian.net/browse/ETM-16275).
- Optimasi query Audits (PR olshoperp#6500): baris Sales Order hanya diambil bila status Unassign Wave baru = in queue / processed (kolom `audits.unassign_wave_status_new`), dan SO harus milik company token (`omni_sales_orders.owned_by`). Baris Scm Setting / Unassign Wave Log / Order Process Setting juga discope per company.
- Sibling: [TC-UW-AUDIT-001](./TC-UW-AUDIT-001.md) (cross-menu, ETM-16545), [TC-UW-AUDIT-002](./TC-UW-AUDIT-002.md) (volume besar, production).

## Catatan teknis untuk retest

- Company aktif disimpan di sisi server (token), bukan di localStorage. File session `tests/.auth/lumicharmsid.json` bisa saja sudah aktif di company lain — cek dari data yang tampil / API, jangan dari localStorage `company`.
- Halaman edit SO general harus dibuka dari tab baru (klik kode di datalist / `window.open`); `goto` langsung ke URL edit kadang tampil "You do not have access to this page". SO milik company lain → 404 "Sales Order General Data not found!".
- Field yang **tidak** menghasilkan baris audit SO: Buyer Notes, Platform Order ID. Field yang menghasilkan baris audit SO: Transaction Date, customer/store/shipper, total, status.
- Enter di input Transaction Date langsung men-submit form; klik Save All sesudahnya → 422 "Duplicate request detected, please wait 3 seconds" (tidak berdampak data).
- API Audits: `GET /api/omnichannel/unassign-wave/audits` (datatables). Full scan: `search[value]=` kosong, `length=500`, naikkan `start`. `recordsTotal` default view di-cache 5 menit per company (`unassign_wave_audits_count_{company}`), jadi hitung baris nyata dari scan.
- Search global tab Audit Log mencocokkan teks user / source / value tapi **tidak** kode SO (kode SO hanya ada di teks tampilan "Unassign Wave Status (SO-…)").

## Hasil run 20-10-2026 10:16–10:23 WIB (staging)

| # | Expected | Hasil |
|---|---|---|
| 1 | Perubahan SO-1 non-Unassign-Wave tidak muncul | ✅ Edit Buyer Notes (10:16:43), Platform Order ID (10:19:52), Transaction Date (10:22:52, tercatat di Audit Log SO-1 sendiri). Audits company A tetap 992 baris, SO-5U73Y7H5 tidak ada. 822 baris Sales Order di Audits semuanya status Unassign Wave; ±6.689 riwayat non-Unassign-Wave dari SO yang sama tidak ikut |
| 2 | SO-2 company B tidak muncul | ✅ SO-5TU4IOKX tidak ada; 23 SO Lumi Charms.id lain dengan riwayat Unassign Wave 60 hari juga tidak ada. Semua 822 SO di Audits owned_by 13; Scm Setting id 1 owned_by 13; 2 baris "Trigger Check Availability Stock" `_company_id` 13 |
| 3 | Tidak ada error, tabel normal | ✅ "Showing 1 to 20 of 992 entries", 50 halaman, tanpa toast error |

Catatan (di luar Expected): kotak search tidak bisa mencari kode SO — SO-5USJP3OJ (baris teratas company A) → "No matching records found"; "Jenni" 712, "Processing" 886, "Scm Setting" 168, "19-10-2026" 2 baris. Belum dibuat card (run via webhook); perlu keputusan QA apakah jadi Error card (menu tanpa Advanced Filter → search harus cocok semua kolom).

## Data uji disimpan

- SO-5U73Y7H5 (Draft, Dev Staging): Buyer Notes "ETM-15541 - TC-SOG-004 | QA ETM-16542 20-10-2026", Platform Order ID "QA-ETM-16542-20102026", Transaction Date 21-08-2026 21:05:08 (awal 21:04:08, tidak dikembalikan).
- SO-5TU4IOKX (Lumi Charms.id) tidak diubah.
- Retest: SO-1 boleh dipakai ulang (masih Draft); geser Transaction Date lagi untuk membuat baris audit baru.

## Bukti

- Folder: https://drive.google.com/drive/folders/1Q8YMujfpMIMQq2Y-Rr6mxtGSWHuR8A8D (screenshot disimpan sebagai .svg)
- Audit Log company A sebelum: https://drive.google.com/file/d/1DSDT9B9m07ygph5wp-3G_yfkbARazD9q/view
- Audit Log SO-1 sendiri (Transaction Date): https://drive.google.com/file/d/1pvyQ4v20DhQt3z5JhPAQ9OzhYI1OFmHP/view
- Audit Log company A sesudah: https://drive.google.com/file/d/1FxUTmIkPQdIYzfJe-OvLMCwd8r0JXwsM/view
- Search SO-2: https://drive.google.com/file/d/1XxmhiKWzvG3pg6hioxqv3pUVI91PBf6a/view
- Search SO sendiri tidak ketemu: https://drive.google.com/file/d/1BXcV9QfeZSpMiwGh2lv9Q4DVPCdXkvoz/view
- Cek silang API + DB: https://drive.google.com/file/d/174Hqa1i4fgsNOMTQD3LNWSfSWzZ3RUwO/view
- Telegram report: message 52045 (topic 51478)
