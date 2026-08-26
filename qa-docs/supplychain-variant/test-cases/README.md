# Test Cases — Master Variant

Card terkait: [ETM-15511](https://erpintegration.atlassian.net/browse/ETM-15511) — toggle Default Variant di Master Variant.

Prefix folder: `VAR`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-VAR-001 | Create new Variant Group | draft | ✅ | 2026-07-14 |
| TC-VAR-002 | Update Variant Group | draft | ✅ | 2026-07-14 |
| TC-VAR-003 | Form toggle Default Variant + kolom list Default | **fail** (label + kolom) | ✅ | 2026-08-14 |
| TC-VAR-004 | Create Default Variant ON + 1 opsi — save tanpa inject random | **pass** | ❌ | 2026-08-14 |
| TC-VAR-005 | Create Default Variant OFF + 1 opsi — tetap inject random | **pass** | ❌ | 2026-08-14 |
| TC-VAR-006 | Create/Edit Default Variant ON + opsi > 1 — save ditolak | **pass** | ❌ | 2026-08-14 |
| TC-VAR-007 | Mutual exclusive Default Variant — ON baru men-OFF yang lama | **pass** | ❌ | 2026-08-14 |
| TC-VAR-008 | Edit — hapus opsi random unused tidak di-re-inject | **fail** | ✅ | 2026-08-14 |

**Ringkas ETM-15511 (FAT, 2026-08-14):** toggle ada dengan label **Default Variant** (bukan Set as Default System Product); kolom list **Default** belum ada. Create ON skip `random` OK; Create OFF inject `random` OK; reject opsi > 1 OK; mutual exclusive OK. Hapus `random` di edit: FE bisa remove, BE tetap menyimpan `random`.
