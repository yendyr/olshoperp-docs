# Test Cases — Category Price

Konvensi penamaan: **`TC-CP-NNN.md`**. DRAFT: `TC-CP-DRAFT-{timestamp}.md`.

Card induk: [ETM-16313](https://erpintegration.atlassian.net/browse/ETM-16313).

Prefix folder: `CP`.

> **Catatan 2026-10-28:** [ETM-16882](https://erpintegration.atlassian.net/browse/ETM-16882) membalik sebagian [ETM-16666](https://erpintegration.atlassian.net/browse/ETM-16666) (Others Active boleh lagi). **TC-CP-002** / **TC-CP-003** = bukti historis Passed terhadap 16666 — **disupersede**; buat TC baru setelah 16882 deploy. Jangan pakai expected 002/003 sebagai SoT TO-BE.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-CP-001 | Retest ETM-16638: snapshot WIB, tier baru tanpa ikon oranye, hapus band/tier langsung hilang, Update from Master tanpa loop/duplikasi | draft | ❌ | 2026-10-20 |
| TC-CP-002 | Negative: store Others tidak bisa dicari… (ETM-16676 / 16666) — **superseded by ETM-16882** | historical | ❌ | 2026-10-21 |
| TC-CP-003 | Edge: Category lama Others terlepas… (ETM-16677 / 16666) — **superseded by ETM-16882** | historical | ❌ | 2026-10-21 |
| TC-CP-004 | Regression: Update to Pricelist tetap menghitung margin Pricelist Product untuk Category Price dengan store platform (ETM-16678) | draft | ❌ | 2026-10-21 |
| TC-CP-005 | Cross-menu: Dropdown Applied Store mengikuti status store dan store yang sudah dipakai tetap tampil walau belum authorized (ETM-16679) | draft | ❌ | 2026-10-21 |

Format crawl plan menu lain: `tests/CRAWL-PLAN.md`.
