---
doc_type: e2e-test-case
tc_code: TC-ARCN-006
menu: accounting-credit-note
menu_name: "Credit Note"
test_type: happy
title: "CREATE+APPROVE — CN hanya Free COA (tanpa baris Cash/Bank) berhasil di-approve"
summary: "Create CN, isi Free COA saja (tanpa Cash/Bank), amount > 0, Open, Approve harus lolos."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 dual path; §7.3b skip reconcile jika semua fund COA; §7.5 #5 ada fund, #6 amount > 0"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-chart-of-account
  - accounting-cash-bank-reconcile
card_ref: "ETM-15534 (relates ETM-15442; ETM-15533 duplicate, ignore)"
preconditions:
  - "Company FAT punya Cash/Bank aktif untuk currency IDR (header create lolos)."
  - "Ada COA Equity leaf aktif (Tambahan Modal Disetor)."
  - "User bisa create, update, approve CN."
test_data:
  - field: "Currency"
    value: "IDR"
  - field: "Description"
    value: "ETM-15442 all-Free-COA approve, no Cash/Bank fund"
  - field: "Free COA"
    value: "Tambahan Modal Disetor (FAT: 3-102)"
  - field: "Amount"
    value: "10.000"
  - field: "Cash/Bank row"
    value: "tidak ditambah"
steps:
  - "Create Credit Note baru (currency IDR)."
  - "Isi Description: ETM-15442 all-Free-COA approve, no Cash/Bank fund."
  - "Jangan klik Select Cash/Bank."
  - "Tambah Receiving Destination via Free COA — Tambahan Modal Disetor, amount 10.000."
  - "Set status Open."
  - "Approve."
expected_result: |
  Receiving Destination cukup terisi salah satu jalur: Cash/Bank atau Free COA (atau keduanya). Tidak wajib ada baris Cash/Bank jika Free COA sudah terisi amount > 0.
  Approve sukses; status Approved. Journal auto terbit (Dr fund COA / Cr Deposit COA).
  CN yang seluruh fund-nya type COA tidak kena cash bank reconcile lock (requirement §7.3b).
  Approve tetap ditolak jika tidak ada fund sama sekali, atau amount masih 0 (requirement §7.5 #5 #6).
test_result:
  status: failed
  started_at: "2026-08-13 15:34"
  finished_at: "2026-08-13 15:40"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "CN-5U43L1SR (id 3181) Open, description terisi, 1 baris type COA 3-102 Tambahan Modal Disetor amount 10.000,00, tidak ada baris Cash/Bank. POST /api/accounting/credit-note/3181/approve → 422. Message: Chart of account ID is required for reconciliation validation. Status tetap Open. Journal tidak terbit. Staging FE 15:26, API 15:25. Login Yemima Staging, company FAT."
  report_url: null
test_data_used:
  - field: "CN"
    value: "CN-5U43L1SR / accounting/credit-note/edit/3181"
  - field: "Customer"
    value: "DS-CORNELSTORE (default create FAT)"
  - field: "COA"
    value: "3-102 Tambahan Modal Disetor (coa_id 4469)"
  - field: "endpoint"
    value: "POST /api/accounting/credit-note/3181/approve"
run_history:
  - at: "2026-08-13 15:40"
    status: fail
    by: "QA - Yemima (Playwright MCP)"
first_execution:
  at: "2026-08-13"
  via: "legacy:test_result"
  jira: null
last_execution:
  at: "2026-08-13"
  jira: null
  status: failed
  via: "legacy:test_result"
---

## Catatan QA

Finding dari tes ETM-15442 di staging. Fixture: https://staging.olshoperp.com/accounting/credit-note/edit/3181

**Expected:** Credit Note tetap bisa di-approve tanpa baris Cash/Bank, selama salah satu Receiving Destination sudah terisi (Cash/Bank **atau** Free COA) dengan amount > 0.

**Actual result (13 Aug 2026):**

| Langkah | Hasil |
|---------|--------|
| Create CN IDR | Lolos → `CN-5U43L1SR` |
| Description | `ETM-15442 all-Free-COA approve, no Cash/Bank fund` tersimpan |
| Free COA saja | 1 baris type **COA**, GL `3-102 Tambahan Modal Disetor`, bank/swift `-`, amount **10.000,00**. Tidak ada baris Cash/Bank |
| Open | Lolos; status `open` |
| Approve | **Gagal.** `POST /api/accounting/credit-note/3181/approve` HTTP **422** |
| Toast / API message | Title: `Failed to process your request`. Message: `Chart of account ID is required for reconciliation validation.` Data: `coa_id`: `Chart of account ID is required.` |
| Status akhir | Tetap **Open** (bukan Approved) |
| Journal | **Tidak terbit** (approve gagal sebelum auto journal) |

Di FAT, COA Equity yang dipakai adalah **3-102** Tambahan Modal Disetor (bukan 3-30001 dari sesi CN lain).
