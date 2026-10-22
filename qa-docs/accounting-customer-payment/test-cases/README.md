# Test Cases — Account Receive

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-AR-BULK-APPROVE-001 | Bulk approve 10 AR status Open → Approved + notifikasi sukses | draft | ✅ | 2026-07-10 |
| TC-AR-BULK-APPROVE-002 | Bulk approve mix Open + Approved → partial success + error detail | draft | ✅ | 2026-07-10 |
| TC-AR-BULK-APPROVE-003 | Bulk approve Draft — status tidak berubah + tombol tidak aktif | draft | ✅ | 2026-07-10 |
| TC-AR-BULK-APPROVE-004 | Tombol bulk Approve inactive tanpa seleksi, active setelah pilih Open | draft | ✅ | 2026-07-10 |
| TC-ARCP-001 | Single use — insert Sales Invoice dari modal Available Sales Invoice | review | ✅ | 2026-06-26 |
| TC-ARCP-002 | Single use — Save tanpa paid amount ditolak | review | ✅ | 2026-06-26 |
| TC-ARCP-003 | Bulk use — insert beberapa SI dari modal Available (checkbox + Use) | review | ✅ | 2026-06-26 |
| TC-ARCP-004 | Bulk select — insert SI dari dropdown Select Invoice | review | ✅ | 2026-06-26 |
| TC-ARCP-005 | CREATE — Supplier China + Available SI + Bank BCA 001 + Approve (warm-up CBR) | draft | ✅ | 2026-07-23 |
| TC-ARCP-006 | Summary AR USD yang menerima pembayaran SI USD (currency sama dengan header) tampil benar, Total 0.00 (happy) (ETM-16715) | draft | ❌ | 2026-10-22 |
| TC-ARCP-007 | Summary Total dibulatkan 2 desimal: selisih kecil tidak orange dan tanpa tanda minus nol, selisih 0,01 orange (edge) (ETM-16716) | draft | ❌ | 2026-10-22 |
| TC-ARCP-008 | Summary AR: Kurs header terkunci saat ada detail; setelah detail dikosongkan, Piutang memakai kurs baru (edge) (ETM-16717) | draft | ❌ | 2026-10-22 |
| TC-ARCP-009 | Summary AR: Piutang Summary untuk SI valas (USD) pada AR IDR dengan Allocate Full Amount memakai kurs header (edge) (ETM-16718) | draft | ❌ | 2026-10-22 |
| TC-ARCP-010 | Summary AR USD dengan beberapa Adjustment Debit dan Credit dalam USD (edge) (ETM-16719) | draft | ❌ | 2026-10-22 |
| TC-ARCP-011 | Summary AR: Credit Note IDR dan USD sebagai source masuk baris Credit Note bertanda minus, terpisah dari Cash/Bank (cross-menu) (ETM-16720) | draft | ❌ | 2026-10-22 |
| TC-ARCP-012 | Summary tampil di dokumen Approved dan belum tampil saat Create (regression) (ETM-16721) | draft | ❌ | 2026-10-22 |
| TC-ARCP-013 | Summary ikut berubah setelah tiap aksi tambah, ubah, hapus detail, destination, dan adjustment tanpa reload (regression) (ETM-16722) | draft | ❌ | 2026-10-22 |
