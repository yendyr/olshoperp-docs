# Test Cases — Account Payment

Konvensi penamaan: **`TC-APAY-NNN.md`**. DRAFT: `TC-APAY-DRAFT-{timestamp}.md`.

Card terkait Summary: [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643) (sibling Account Receive: ETM-16644).

Prefix folder: `APAY`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-APAY-001 | CREATE — Payment Unbilled Goods + Bank BCA 001 + PI-6960CB30 | approved | ✅ | 2026-07-20 |
| TC-APAY-002 | APPROVE — Form detail Open → Approve | approved | ❌ | 2026-07-20 |
| TC-APAY-SUM-001 | SUMMARY — Summary AP IDR balance tampil benar dengan Total 0.00 (ETM-16680) | approved | ❌ | 2026-10-21 |
| TC-APAY-SUM-002 | SUMMARY — Summary AP belum balance menampilkan Total orange (ETM-16681) | approved | ❌ | 2026-10-21 |
| TC-APAY-SUM-003 | SUMMARY — Summary AP multi-currency & pembulatan (ETM-16682, Failed) | approved | ❌ | 2026-10-21 |
| TC-APAY-SUM-004 | SUMMARY — Konversi full amount PI beda currency (ETM-16683, Failed) | approved | ❌ | 2026-10-21 |
| TC-APAY-SUM-005 | SUMMARY — Summary & Debit Note terbit dari import AP (ETM-16684, Failed) | approved | ❌ | 2026-10-21 |
| TC-APAY-003 | Summary AP USD yang bayar PI USD (currency sama dengan header) tampil benar, Total 0.00 (happy) (ETM-16707) | draft | ❌ | 2026-10-22 |
| TC-APAY-004 | Summary Total dibulatkan 2 desimal: selisih kecil tidak orange dan tanpa tanda minus nol, selisih 0,01 orange (edge) (ETM-16708) | draft | ❌ | 2026-10-22 |
| TC-APAY-005 | Summary AP: Kurs header terkunci saat ada detail; setelah detail dikosongkan, Utang memakai kurs baru (edge) (ETM-16709) | draft | ❌ | 2026-10-22 |
| TC-APAY-006 | Summary AP: Utang Summary untuk PI valas (USD dan EUR) pada AP IDR dengan Allocate Full Amount memakai kurs header (edge) (ETM-16710) | draft | ❌ | 2026-10-22 |
| TC-APAY-007 | Summary AP USD dengan beberapa Adjustment Debit dan Credit dalam USD (edge) (ETM-16711) | draft | ❌ | 2026-10-22 |
| TC-APAY-008 | Summary AP: Debit Note USD sebagai source masuk baris Debit Note dalam USD pada AP USD (cross-menu) (ETM-16712) | draft | ❌ | 2026-10-22 |
| TC-APAY-009 | Summary tampil di dokumen Approved (IDR dan USD) dan belum tampil saat Create (regression) (ETM-16713) | draft | ❌ | 2026-10-22 |
| TC-APAY-010 | Summary ikut berubah setelah tiap aksi tambah, ubah, hapus detail, source, dan adjustment tanpa reload (regression) (ETM-16714) | draft | ❌ | 2026-10-22 |

Format crawl plan menu lain: `tests/CRAWL-PLAN.md`.
