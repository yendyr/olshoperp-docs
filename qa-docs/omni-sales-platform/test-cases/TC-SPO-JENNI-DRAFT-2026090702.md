---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090702
menu: omni-sales-platform
menu_name: "Sales Platform"
test_type: happy
title: Verifikasi Halaman Datalist & Detail Sales Platform untuk Order Hasil Void & Clone
summary: "Memastikan order hasil void & clone muncul di datalist Sales Platform dan detail page sesuai."
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

# TC-SPO-JENNI-DRAFT-2026090702: Verifikasi Halaman Datalist & Detail Sales Platform untuk Order Hasil Void & Clone

## Objective
Memastikan order baru hasil Void & Clone dari Sales Platform hanya muncul di datalist Sales Platform (`/omni/sales-order`) dan halaman detailnya (`/omni/sales-order/edit/{id}`), serta TIDAK masuk ke datalist Sales Order General (`/businessdevelopment/sales-order-general`).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Order Sales Platform baru hasil Void & Clone telah terbentuk di sistem.

## Test Steps
1. Buka datalist **Sales Platform** (`/omni/sales-order`).
2. Cari kode order baru hasil Void & Clone pada datalist Sales Platform.
3. Klik tombol **Edit / Detail** dan amati URL serta struktur halaman detail order (`/omni/sales-order/edit/{id}`).
4. Buka menu **Business Development → Sales Order General** (`/businessdevelopment/sales-order-general`).
5. Cari kode order baru hasil Void & Clone tersebut pada datalist Sales Order General.

## Expected Results
1. Order baru hasil Void & Clone **tampil dengan benar** pada datalist Sales Platform (`/omni/sales-order`).
2. Halaman detail order dibuka melalui route Sales Platform (`/omni/sales-order/edit/{id}`) dengan layout dan badge tipe Sales Platform.
3. Order baru tersebut **TIDAK TERDAFTAR / TIDAK MUNCUL** pada datalist Sales Order General (`/businessdevelopment/sales-order-general`).
