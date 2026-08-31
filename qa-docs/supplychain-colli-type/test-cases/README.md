# Test Cases — Colli Type

Card terkait: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) — master jenis wadah Colli (Box, Pallet) untuk New Colli.

Prefix folder: `CT`.

Company default: FAT (112). Akun E2E: `playwright@gmail.com`.

Requirement: `qa-docs/supplychain-colli-type/requirement.md` (saat draft, sumber di repo `olshoperp` — slug belum di manifest olshoperp-docs).

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-CT-001 | Create Colli Type — datalist kolom lengkap dan nilai after save sama dengan input (tidak null) | pass | ❌ | 2026-08-14 |
| TC-CT-002 | Create pertama Colli Type BOX — Default ON, Active ON, Show for all company OFF | blocked | ❌ | 2026-08-14 |
| TC-CT-003 | Create kedua Colli Type PLT / Pallet tanpa Set as Default Data — Default OFF | pass | ❌ | 2026-08-14 |
| TC-CT-004 | Set as Default Data ON pada type baru — default lama otomatis OFF | pass | ❌ | 2026-08-14 |
| TC-CT-005 | Create Colli Type — Code atau Name kosong diblok save | pass | ❌ | 2026-08-14 |
| TC-CT-006 | Create Colli Type — Code duplikat di company yang sama ditolak | pass | ❌ | 2026-08-14 |
| TC-CT-007 | Active OFF ditolak jika Colli Type sudah dipakai Colli code dari New Colli inbound | fail | ❌ | 2026-08-14 |
| TC-CT-008 | Delete ditolak jika Colli Type sudah dipakai Colli code dari New Colli inbound | fail | ❌ | 2026-08-14 |
| TC-CT-009 | Delete Colli Type yang belum dipakai — soft delete dan Show deleted already deleted | fail | ❌ | 2026-08-14 |
| TC-CT-010 | Edit Code dan Name tetap boleh meskipun Colli Type sudah dipakai | pass | ❌ | 2026-08-14 |
| TC-CT-011 | Show for all company ON di company A — company B tidak melihat data jika Show Public Data OFF | draft | ❌ | 2026-08-14 |
| TC-CT-012 | Show Public Data ON di company B — Colli Type public milik A muncul dengan owner A | draft | ❌ | 2026-08-14 |
| TC-CT-013 | Active OFF boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci | draft | ❌ | 2026-08-14 |
| TC-CT-014 | Delete Colli Type boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci | draft | ❌ | 2026-08-14 |
| TC-CT-015 | Audit Log mencatat create, update field, toggle Default/Active/Show for all company, dan soft delete | draft | ❌ | 2026-08-14 |
| TC-CT-016 | Colli Type Active OFF tidak muncul pada pilihan New Colli di Purchase Inbound | draft | ❌ | 2026-08-26 |

**Belum di-TC (sengaja):** requirement §6.4 kasus 8 — Active OFF tidak muncul di **New Colli** inbound — konsumen [ETM-15528](https://erpintegration.atlassian.net/browse/ETM-15528).

Run staging 2026-08-14 (Playwright MCP, FAT 112): 001 pass, 002 blocked, 003–006 pass, 007–009 **fail**, 010 pass. Belum di-run: 011–015.

Error cards (Faisal Bahari): [ETM-15546](https://erpintegration.atlassian.net/browse/ETM-15546) (TC-CT-008), [ETM-15547](https://erpintegration.atlassian.net/browse/ETM-15547) (TC-CT-009). Improvement [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) **RE-OPEN**.
