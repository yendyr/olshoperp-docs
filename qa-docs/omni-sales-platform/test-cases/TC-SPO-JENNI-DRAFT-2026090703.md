---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090703
menu: omni-sales-platform
menu_name: "Sales Platform"
test_type: happy
title: Fitur Re-sync Marketplace pada Order Sales Platform Hasil Void & Clone
summary: "Memastikan fitur re-sync marketplace bekerja dengan baik pada order Sales Platform hasil void & clone."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-07
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15717
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

# TC-SPO-JENNI-DRAFT-2026090703: Fitur Re-sync Marketplace pada Order Sales Platform Hasil Void & Clone

## Objective
Memastikan order Sales Platform hasil Void & Clone yang mempertahankan `platform_order_id` dapat menjalankan fitur re-sync data order dari marketplace tanpa error.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Order Sales Platform baru hasil Void & Clone memiliki `platform_order_id` yang valid dari marketplace.

## Test Steps
1. Masuk ke halaman detail order Sales Platform hasil Void & Clone (`/omni/sales-order/edit/{id}`).
2. Klik tombol **Sync Marketplace / Re-sync Order**.
3. Amati proses eksekusi sync dan respon notifikasi dari sistem.

## Expected Results
1. Proses re-sync berhasil dijalankan karena `platform_order_id` tetap dipertahankan dari order asal.
2. Sistem tidak memicu error *Missing Platform Order ID* atau *Invalid Order Type*.
3. Data status / update terkini dari marketplace berhasil ditarik ke dalam transaksi order baru.
