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
| 6 | `TC-PR-001.md` / TC-PR-001 | Default sorting detail PR tidak kembali ke LIFO (Last-In-First-Row) setelah reset / reopen | draft | ❌ | 2026-08-26 |
| 7 | `TC-PR-002.md` / TC-PR-002 | Fitur sorting kolom Availability tidak berfungsi di default screen UI dan print screen | draft | ❌ | 2026-08-26 |
| 8 | `TC-PR-003.md` / TC-PR-003 | Urutan print screen berbeda dengan UI saat sorting Request Qty yang bernilai sama | draft | ❌ | 2026-08-26 |
| 9 | `TC-PR-004.md` / TC-PR-004 | Urutan print screen tidak sama dengan UI setelah sorting dinonaktifkan (kembali ke default) | draft | ❌ | 2026-08-26 |
| 10 | `TC-PR-005.md` / TC-PR-005 | Fitur sorting kolom PO Status tidak berfungsi dan urutan print screen tidak sinkron | draft | ❌ | 2026-08-26 |
| 11 | `TC-PR-006.md` / TC-PR-006 | Fitur sorting kolom Receiving Status tidak berfungsi dan urutan print screen tidak sinkron | draft | ❌ | 2026-08-26 |
| 12 | `TC-PR-16256-01.md` / TC-PR-16256-01 | Edit unit ke Alt Unit '1KOLI5600PCS' (setting System Product) status PR tetap Open | **pass** | ❌ | 2026-10-06 |
| 13 | `TC-PR-16256-02.md` / TC-PR-16256-02 | Edit unit ke Alt Unit '1Koli5600Pieces' (setting Master Unit rate) status PR tetap Open | **pass** | ❌ | 2026-10-06 |
| 14 | `TC-PR-16256-03.md` / TC-PR-16256-03 | Multi-item gabungan Base Unit dan kedua Alt Unit konversi besar dalam 1 dokumen PR | **pass** | ❌ | 2026-10-06 |
| 15 | `TC-PR-16256-04.md` / TC-PR-16256-04 | Tarik PR satuan Pieces ke PO lalu ubah ke Alternative Unit 1KOLI5600PCS secara penuh | **pass** | ❌ | 2026-10-06 |
| 16 | `TC-PR-16256-05.md` / TC-PR-16256-05 | Tarik PR parsial dengan konversi Alternative Unit di PO dan verifikasi sisa Outstanding PR | **pass** | ❌ | 2026-10-06 |


