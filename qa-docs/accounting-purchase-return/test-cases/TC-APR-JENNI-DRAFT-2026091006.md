---
doc_type: e2e-test-case
tc_code: PENDING-APR-JENNI-2026091006
menu: accounting-purchase-return
menu_name: "Purchase Return"
test_type: happy
title: Tampilan Unit Price (Before VAT) pada Modal Edit Detail SKU
summary: "Memastikan tampilan Unit Price (Before VAT) pada modal Edit Detail SKU."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-10
requirement_ref: "qa-docs/accounting-purchase-return/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15858
first_execution:
  at: null
  jira: null
  via: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-APR-JENNI-DRAFT-2026091006: Tampilan Unit Price (Before VAT) pada Modal Edit Detail SKU

## Objective
Memastikan saat user membuka modal edit detail SKU di Purchase Return, informasi Unit Price (Before VAT) ditampilkan secara read-only dan konsisten dengan nilai di datalist.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat minimal 1 baris detail pada form Purchase Return.

## Test Steps
1. Buka halaman **Edit Purchase Return**.
2. Pada salah satu baris detail SKU, klik tombol **Edit Detail** (modal edit SKU).
3. Periksa field **Unit Price (Before VAT)** di dalam modal tersebut.
4. Coba ubah nilai pada field tersebut.

## Expected Results
1. Modal Edit Detail SKU menampilkan field / informasi **Unit Price (Before VAT)**.
2. Nilai field bersifat **read-only** (tidak dapat dimanipulasi atau diedit sembarangan).
3. Nilai yang ditampilkan sinkron dengan nilai yang ada pada datalist detail dokumen.
