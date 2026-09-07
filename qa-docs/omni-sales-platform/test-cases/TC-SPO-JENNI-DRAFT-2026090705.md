---
code: PENDING-JENNI-2026090705
title: End-to-End Processing Order Sales Platform Hasil Void & Clone (Send to Default Waves hingga Shipped)
origin_jira: ETM-15717
first_execution: null
last_execution: null
---

# TC-SPO-JENNI-DRAFT-2026090705: End-to-End Processing Order Sales Platform Hasil Void & Clone (Send to Default Waves hingga Shipped)

## Objective
Memastikan order Sales Platform baru hasil Void & Clone dapat diproses secara penuh melalui alur *processing fulfillment* mulai dari *Send to Default Waves*, *Picking*, *Checking*, *Packing*, hingga status order berubah menjadi *Shipped* tanpa hambatan/error.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Scope Company: `FAT (ID: 112)`.
3. Order Sales Platform baru hasil Void & Clone telah terbentuk di sistem dan berada pada status awal (DRAFT / OPEN).

## Test Steps
1. Buka menu **Omnichannel → Sales Platform** (`/omni/sales-order`).
2. Pilih order Sales Platform hasil Void & Clone.
3. Jalankan aksi **Send to Default Waves** pada order tersebut.
4. Lanjutkan proses ke tahap **Picking List / Picking Process** (`/omni/picking-process`).
5. Lanjutkan proses ke tahap **Checking Process** (`/omni/checking-process`).
6. Lanjutkan proses ke tahap **Packing Process** (`/omni/packing-process`).
7. Selesaikan seluruh tahap pengemasan hingga transaksi terbit sebagai **Shipped**.
8. Verifikasi status akhir transaksi dan log histori pergerakan status order.

## Expected Results
1. Order Sales Platform hasil Void & Clone berhasil diproses melintasi seluruh tahapan fulfillment:
   - Status Wave: Berhasil *Send to Default Waves*.
   - Status Process: Lolos *Picking*, *Checking*, dan *Packing*.
   - Status Akhir Order: Berubah menjadi **`Shipped`**.
2. Tidak terjadi error *Invalid Order Category*, *Missing Wave Binding*, atau *Wrong Transaction Handler* di tengah alur pemrosesan.
