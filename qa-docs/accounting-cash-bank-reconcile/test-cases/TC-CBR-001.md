---
doc_type: e2e-test-case
tc_code: TC-CBR-001
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "CREATE — Period + Bank BCA 001 + Open (warm-up W3)"
summary: "Create header CBR; isi Period (hari journal AR); Cash Bank Account Bank BCA 001; Save & Next; set Open; search datalist."
status: executed
owner: QA - Cursor
last_updated: 2026-07-23
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/knowledge-base.md"
card_ref: "ETM-15298-warmup"
automated: true
automated_spec: "tests/specs/cash-bank-reconcile/cash-bank-reconcile-create-open.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - journal
  - accounting-customer-payment
preconditions:
  - "Cash/Bank Bank BCA 001 aktif."
  - "Fiscal period tanggal transaksi Open."
  - "Tidak ada CBR draft/open overlapping period untuk Bank BCA 001 (automation dihapus di awal)."
  - "Ideal: journal AR Approved di tanggal Period (W1/W2: RC-5TWBHOUX / GL-5TWBI5XV 23-07-2026)."
test_data:
  - cash_bank: "Bank BCA 001"
  - period_day: 23
  - description: "automation playwright"
steps:
  - "Datalist Cash/Bank Reconcile → Create."
  - "Period: pilih tanggal (hari journal AR) via datepicker range."
  - "Cash Bank Account: Bank BCA 001."
  - "Description automation playwright → Save & Next → land edit."
  - "Set status Open → search kode BR di datalist."
expected_result: |
  Dokumen BR Open; Cash/Bank Bank BCA; siap import bank statement (W4).
test_result:
  status: pass
  started_at: "2026-07-23"
  finished_at: "2026-07-23"
  executed_by: "Cursor Auto"
  environment: staging
  log_summary: "BR-6A617F12 Open; Bank BCA 001; Period 23-07-2026; ready for W4 import"
  report_url: null
---

# TC-CBR-001

## Catatan

- Warm-up W3 sebelum W4 import dan suite TC-CBRAM.
- Period tidak boleh overlap dokumen reconcile lain untuk akun yang sama.
- Create = halaman `/create` (bukan auto-POST seperti SI/AR).
- Datepicker multi-calendars: pilih hari di **table bulan pertama** saja.
- Cash Bank Multiselect `:delay=700` — tunggu search sebelum klik opsi.
