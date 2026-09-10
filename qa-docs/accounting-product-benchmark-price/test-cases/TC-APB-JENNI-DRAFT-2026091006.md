---
code: PENDING-JENNI-2026091006
title: Verifikasi Audit Log Tracking untuk Aktivitas Perubahan Manual COGS & Expiry
origin_jira: ETM-15850
first_execution: null
last_execution: null
---

# TC-APB-JENNI-DRAFT-2026091006: Verifikasi Audit Log Tracking untuk Aktivitas Perubahan Manual COGS & Expiry

## Objective
Memastikan setiap aktivitas pengisian, perubahan, maupun penghapusan (clear) pada Manual COGS dan Manual COGS Expiry (baik via Inline UI maupun Import Excel) tercatat secara akurat di Audit Log.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Fitur Audit Log aktif di sistem.

## Test Steps
1. Lakukan perubahan Manual COGS & Expiry via Inline Edit UI pada SKU A.
2. Lakukan perbaikan Manual COGS & Expiry via Import Excel pada SKU B.
3. Buka menu / modal **Audit Log / Activity Log** untuk SKU A dan SKU B.
4. Periksa rincian log yang tercatat.

## Expected Results
1. Setiap transaksi perbaikan (create/update/clear) tercatat secara terpisah dan presisi di Audit Log.
2. Log mencatat informasi lengkap: User executor, Timestamp, Field yang diubah (`manual_price`, `manual_effective_date`), Nilai Lama (*Old Value*), Nilai Baru (*New Value*), dan Sumber Perubahan (*Inline UI* / *Import*).
