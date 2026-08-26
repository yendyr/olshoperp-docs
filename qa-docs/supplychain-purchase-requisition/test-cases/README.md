# Test Cases — Purchase Requisition

Konvensi penamaan file: **`TC-PR-[CREATE|READ|UPDATE|DELETE]-NNN.md`**

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

| # | File / TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|---|
| 1 | `TC-PR-CREATE-001.md` / TC-PR-CREATE-001 | Membuat Purchase Requisition dengan 2 produk WENTER00 dan verifikasi status Open | draft | ❌ | 2026-07-08 |
| 2 | `TC-PR-CREATE-002.md` / TC-PR-CREATE-002 | Membuat Purchase Requisition dengan 3 produk SPIDOL dan verifikasi status Open | draft | ❌ | 2026-07-08 |
| 3 | `TC-PR-UPDATE-001.md` / TC-PR-UPDATE-001 | Update Request Qty SKU-SPIDOL-hitam menjadi 25 lalu Approve PR-6A4E067D | draft | ❌ | 2026-07-08 |
| 4 | `TC-PR-UPDATE-002.md` / TC-PR-UPDATE-002 | Approve PR-6A4F0A91 dari datalist | draft | ✅ | 2026-07-09 |
| 5 | `TC-PR-DELETE-001.md` / TC-PR-DELETE-001 | Delete PR-6A4DF63B dari datalist | draft | ✅ | 2026-07-09 |
| 6 | `TC-PR-DRAFT-20260826150601.md` / PENDING-20260826150601 | Default sorting detail PR tidak kembali ke LIFO (Last-In-First-Row) setelah reset / reopen | draft | ❌ | 2026-08-26 |
| 7 | `TC-PR-DRAFT-20260826150602.md` / PENDING-20260826150602 | Fitur sorting kolom Availability tidak berfungsi di default screen UI dan print screen | draft | ❌ | 2026-08-26 |
| 8 | `TC-PR-DRAFT-20260826150603.md` / PENDING-20260826150603 | Urutan print screen berbeda dengan UI saat sorting Request Qty yang bernilai sama | draft | ❌ | 2026-08-26 |
| 9 | `TC-PR-DRAFT-20260826150604.md` / PENDING-20260826150604 | Urutan print screen tidak sama dengan UI setelah sorting dinonaktifkan (kembali ke default) | draft | ❌ | 2026-08-26 |
| 10 | `TC-PR-DRAFT-20260826150605.md` / PENDING-20260826150605 | Fitur sorting kolom PO Status tidak berfungsi dan urutan print screen tidak sinkron | draft | ❌ | 2026-08-26 |
| 11 | `TC-PR-DRAFT-20260826150606.md` / PENDING-20260826150606 | Fitur sorting kolom Receiving Status tidak berfungsi dan urutan print screen tidak sinkron | draft | ❌ | 2026-08-26 |
