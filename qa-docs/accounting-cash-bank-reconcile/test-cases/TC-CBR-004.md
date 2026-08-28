---
doc_type: e2e-test-case
tc_code: TC-CBR-004
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
test_type: edge
title: 'CBR APPROVE — fiscal Open, lock Account A aktif, tidak bisa undo'
summary: 'Semua tanggal Period fiscal Open → Approve berhasil; lock COA+Period aktif; tidak ada Void.'
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
  - accounting-fiscal-period
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Ada dua Master Cash/Bank aktif: Account A (akan di-lock) dan Account B (tidak di-lock)."
  - "Semua tanggal di Period uji punya fiscal Open."
  - "Tidak ada CBR Draft/Open/Approved overlapping Account A di Period yang sama."
  - "Siap import minimal 1 baris Bank Statement (syarat Approve)."
test_data:
  - field: "Cash Bank Account"
    value: "Account A"
  - field: "Period"
    value: "P_start–P_end (semua tanggal fiscal Open)"
  - field: "UI create"
    value: "https://staging.olshoperp.com/accounting/cash-bank-reconcile/create"
steps:
  - "Create Cash/Bank Reconcile: Period P_start–P_end, Cash Bank Account Account A → Save & Next."
  - "Set status Open."
  - "Import Bank Statement minimal 1 baris tanggal dalam Period."
  - "Klik Approve. Baca teks modal konfirmasi (lock permanen / tidak bisa undo bila ada)."
  - "Konfirmasi Approve. Catat kode BR dan URL edit."
  - "Pastikan status Approved di datalist. Coba cari aksi Void/Unmatch — tidak tersedia."
expected_result: |
  Setelah Approve: status Approved; dokumen terkunci (knowledge-base: setelah Approved tidak bisa unmatch/edit; requirement: tidak ada Void).
  TO-BE ETM-15522 / GAP-CBR-08: lock Account A aktif untuk setiap tanggal di Period (startOfDay–endOfDay).
  Modal Approve menyebut lock permanen bila sudah diimplementasi (GAP-CBR-12 early warning).
  Tidak ada tombol Void.

  [CATATAN QA] Requirement AS-IS GAP-CBR-08 lock belum ada; TC ini menguji TO-BE ETM-15522.
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
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-CBR-004

## Skenario

Precondition untuk semua TC lock berikutnya. Simpan kode **BR** + URL `.../cash-bank-reconcile/edit/{id}`.

### Langkah detail
1. Create → isi **Period** + **Cash Bank Account** Account A → **Save & Next**.
2. Status **Open** → **Import** template Bank Statement.
3. **Approve** → baca modal → konfirmasi.
4. Datalist: Trx Status **Approved**.


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-001–014 untuk card ini.

