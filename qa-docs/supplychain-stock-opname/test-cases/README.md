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
| [TC-SOPNAME-PASS-01](./TC-SOPNAME-PASS-01.md) | Input Unit Price Desimal Minimal 2 Angka Dibelakang Koma pada Detail Stock Opname Surplus | pass | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) / ETM-15982 | Faisal Bahari | ❌ | 2026-09-18 |
| [TC-SOPNAME-PASS-02](./TC-SOPNAME-PASS-02.md) | Approval Dokumen Stock Opname dengan Unit Price Desimal pada Menu Stock Opname Approval | pass | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) / ETM-15982 | Faisal Bahari | ❌ | 2026-09-18 |
| [TC-SOPNAME-PASS-03](./TC-SOPNAME-PASS-03.md) | Import Detail Stock Opname via Excel dengan Nilai Unit Price Desimal | pass | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) / ETM-15982 | Faisal Bahari | ❌ | 2026-09-23 |
| [TC-SOPNAME-PASS-04](./TC-SOPNAME-PASS-04.md) | Validasi Penolakan Input Nilai Qty Manual Desimal pada Detail Stock Opname | pass | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) / ETM-15982 | Faisal Bahari | ❌ | 2026-09-18 |
| [TC-SOPNAME-PASS-05](./TC-SOPNAME-PASS-05.md) | Approval Stock Opname dengan Fallback Harga Desimal dari Master Benchmark COGS | pass | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) / ETM-15982 | Faisal Bahari | ❌ | 2026-09-23 |
| [TC-SOPNAME-PASS-06](./TC-SOPNAME-PASS-06.md) | Verifikasi Regresi Input dan Approval Unit Price Desimal pada Menu Opening Stock | pass | [ETM-15968](https://erpintegration.atlassian.net/browse/ETM-15968) / ETM-15982 | Faisal Bahari | ❌ | 2026-09-23 |
| [TC-SOPNAME-16240-02-16250](./TC-SOPNAME-16240-02-16250.md) | [Stock Opname] - Print COLLI ID tidak mencetak label untuk baris dengan Adjustment Qty kurang atau nol | **pass** | [ETM-16240](https://erpintegration.atlassian.net/browse/ETM-16240) / ETM-16250 | Resty | ❌ | 2026-10-05 |
| [TC-SOPNAME-16240-04-16252](./TC-SOPNAME-16240-04-16252.md) | [Stock Opname] - Print SKU, SID, dan print massal COLLI ID tetap berjalan setelah batas 100 halaman | **pass** | [ETM-16240](https://erpintegration.atlassian.net/browse/ETM-16240) / ETM-16252 | Resty | ❌ | 2026-10-05 |
| [TC-SOPNAME-16240-06-16257](./TC-SOPNAME-16240-06-16257.md) | [Stock Opname] - Isi label Print COLLI ID: SKU dan nama produk tanpa barcode | **pass** | [ETM-16240](https://erpintegration.atlassian.net/browse/ETM-16240) / ETM-16257 | Resty | ❌ | 2026-10-05 |

