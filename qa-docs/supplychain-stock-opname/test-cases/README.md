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
| PENDING-20260918155501 | Input Unit Price Desimal Minimal 2 Angka Dibelakang Koma pada Detail Stock Opname Surplus | draft | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) | Faisal Bahari | ❌ | 2026-09-18 |
| PENDING-20260918155502 | Approval Dokumen Stock Opname dengan Unit Price Desimal pada Menu Stock Opname Approval | draft | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) | Faisal Bahari | ❌ | 2026-09-18 |
| PENDING-20260918155503 | Import Detail Stock Opname via Excel dengan Nilai Unit Price Desimal | draft | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) | Faisal Bahari | ❌ | 2026-09-18 |
| PENDING-20260918155504 | Validasi Penolakan Input Nilai Qty Manual Desimal pada Detail Stock Opname | draft | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) | Faisal Bahari | ❌ | 2026-09-18 |
| PENDING-20260918155505 | Approval Stock Opname dengan Fallback Harga Desimal dari Master Benchmark COGS | draft | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) | Faisal Bahari | ❌ | 2026-09-18 |
| PENDING-20260918155506 | Verifikasi Regresi Input dan Approval Unit Price Desimal pada Menu Opening Stock | draft | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) | Faisal Bahari | ❌ | 2026-09-18 |
