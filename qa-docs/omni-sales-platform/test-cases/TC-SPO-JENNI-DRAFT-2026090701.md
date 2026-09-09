---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090701
menu: omni-sales-platform
menu_name: "Sales Platform"
test_type: happy
title: Void & Clone Order Sales Platform — Tipe Order Baru Tetap Sales Platform & Mempertahankan Platform Order ID
summary: "Memastikan order hasil void & clone dari Sales Platform tetap bertipe Sales Platform dan mempertahankan Platform Order ID."
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

# TC-SPO-JENNI-DRAFT-2026090701: Void & Clone Order Sales Platform — Tipe Order Baru Tetap Sales Platform & Mempertahankan Platform Order ID

## Objective
Memastikan transaksi Sales Platform yang di-void & clone melalui menu pemrosesan (Picking / Checking / Packing) menghasilkan order baru yang tetap bertipe **Sales Platform** dan mempertahankan `platform_order_id` dari order asal.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Scope Company: `FAT (ID: 112)`.
3. Terdapat transaksi Sales Platform aktif di menu `/omni/sales-order` (contoh Edit ID: `2520401`).
4. Order telah diproses hingga tahap pemrosesan (Picking/Checking/Packing).

## Test Steps
1. Buka menu **Omnichannel → Sales Platform** (`/omni/sales-order`).
2. Pilih transaksi Sales Platform `2520401` yang sedang berada di tahap pemrosesan.
3. Jalankan aksi **Void & Clone** pada order tersebut.
4. Periksa data transaksi order baru hasil duplikasi yang terbentuk di sistem.
5. Periksa atribut tipe transaksi dan keberadaan `platform_order_id`.

## Expected Results
1. Order baru hasil void & clone diterbitkan dengan kode internal `SalesOrder.code` baru.
2. Atribut tipe transaksi order baru **tetap bertipe Sales Platform** (TIDAK berubah menjadi Sales Order Internal/General).
3. Order baru tetap **mempertahankan 100% `platform_order_id`** dari order asal.
