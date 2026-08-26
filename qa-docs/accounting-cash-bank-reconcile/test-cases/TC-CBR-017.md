---
doc_type: e2e-test-case
tc_code: TC-CBR-017
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: 'INSTANT SETTLEMENT APPROVE — fiscal dulu (bukan start import)'
summary: 'Validasi Instant Settlement hanya di Approve. Tanggal AR/settle fiscal Closed → pesan fiscal, bukan lock CBR. Import tidak diuji lock.'
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md §6.4 GAP-CBR-08; qa-docs/accounting-fiscal-period/requirement.md §6.4–6.6"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-settlement-upload
  - accounting-customer-payment
  - accounting-fiscal-period
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Ada dua Master Cash/Bank aktif: Account A (akan di-lock) dan Account B (tidak di-lock)."
  - "Ada dokumen Cash/Bank Reconcile status Approved untuk Account A, Period P_start–P_end (contoh 1 hari: isi saat run). Catat kode BR dan URL edit: https://staging.olshoperp.com/accounting/cash-bank-reconcile/edit/{id}."
  - "Tanggal D_in = tanggal di dalam Period CBR Approved."
  - "Tanggal D_out = tanggal di luar Period CBR, fiscal Open."
  - "Tanggal D_closed = tanggal fiscal Closed (atau tanpa fiscal) — siapkan terpisah dari D_in."
  - "Ada batch Instant Settlement status siap Approve (Import Complete / jurnal siap) dengan tanggal settle/AR = D_closed."
  - "Store Setting: Cash/Bank Receiving terisi (boleh Account A)."
  - "Jangan assert lock di start import."
test_data:
  - field: "Menu"
    value: "Instant Settlement"
  - field: "UI"
    value: "https://staging.olshoperp.com/accounting/settlement-upload"
  - field: "Tanggal AR/settle"
    value: "D_closed"
steps:
  - "Buka /accounting/settlement-upload. Pilih batch yang sudah Import Complete, tanggal settle/AR = D_closed."
  - "Klik Approve (centang). Isi catatan. Konfirmasi Approve."
  - "Harus gagal pesan fiscal §6.4. Bukan pesan CBR lock. Account Receive batch tidak terbentuk."
  - "Tidak ada langkah uji lock pada start import file settlement."
expected_result: |
  Validasi Instant Settlement untuk CBR/fiscal hanya di **Approve** (user-guide: pelunasan Account Receive baru setelah Approve).
  Tanggal AR/settle D_closed: gagal fiscal (`Fiscal period {date} is already closed.` atau `Date must be in an active fiscal period.`).
  Bukan pesan lock CBR.
  Tidak ada Account Receive baru.

  [CATATAN QA] AC Jira ETM-15522 sempat minta cek lock di start import — **dibatalkan**. QA lead 14 Agu 2026: cukup Approve, urutan fiscal lalu CBR lock.
  Referensi: accounting-settlement-upload/user-guide.md Langkah Approve; fiscal-period requirement §6.4.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15522
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-CBR-017

## Skenario

1. Datalist Instant Settlement → batch **Import Complete**.
2. Tombol **Approve** → catatan → **Approve**.
3. Pesan fiscal. AR tidak terbentuk.
4. Skip: start import.


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-001–014 untuk card ini.

