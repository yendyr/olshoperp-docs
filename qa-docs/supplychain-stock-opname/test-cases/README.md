# Test Cases — Stock Opname

Card terkait printout: [ETM-15479](https://erpintegration.atlassian.net/browse/ETM-15479).

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-SOPNAME-001 | Create Stock Opname header (Building Origin) | draft | ✅ | 2026-07-15 |
| TC-SOPNAME-002 | Update Stock Opname header (Description / status Open) | draft | ✅ | 2026-07-15 |
| TC-SOPNAME-003 | Add Available Product + Adjustment Qty on existing Opname | draft | ✅ | 2026-07-15 |
| TC-SOPNAME-004 | Clear Opname Detail (delete all products) | draft | ✅ | 2026-07-15 |
| TC-SOPNAME-005 | Print Detail — dokumen Stock Opname sesuai layout template user | **pass** | ❌ | 2026-08-14 |
| TC-SOPNAME-006 | Print Detail — dokumen tanpa baris detail tetap generate | **pass** | ❌ | 2026-08-14 |
| TC-SOPNAME-007 | Print opsi detail — COLLI DEV muncul di action Print | **pass** | ❌ | 2026-08-14 |

**Ringkas ETM-15479 (FAT, 2026-08-14):** Print Detail dokumen baru ada (header + 8 kolom + Approved By). Empty detail → No data available. COLLI DEV tampil di print detail. Upload template .docx/.jrxml (AC AI di card) **tidak ada** di app — print hardcoded blade, bukan user-upload.
