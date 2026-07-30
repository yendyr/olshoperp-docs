---
doc_type: knowledge-base
menu: accounting-asset-category
menu_name: "Asset Category"
version: 1.1
last_updated: 2026-07-24
owner: QA - Cursor
status: draft
audience: operator
---

# Asset Category — Knowledge Base

## Ringkasan

Master **Asset Category** (FA → Asset) mendefinisikan kategori aset tetap beserta parameter depresiasi default. Dipakai saat membuat Asset List.

**Route:** `/accounting/asset-category`  
**API:** `/accounting/asset-categories`

## Fitur UI

### Datalist
- Create → `/accounting/asset-category/create`
- Search / filter kolom
- Soft delete (bulk delete) + Show deleted data
- Kolom: CODE, NAME, DESCRIPTION, DEPRECIATION METHOD, FREQUENCY, TOTAL DEPRECIATION, SALVAGE VALUE, DEPRECIATION POSTING DATE

### Form (Create / Edit)
| Field | Wajib | Catatan |
|-------|-------|---------|
| Code | ✅ | Unique |
| Name | ✅ | |
| Description | — | Automation: `automation playwright` |
| Depreciation Method | ✅ | straight_line / double_declining_balance / written_down_value / manual |
| Frequency of Depreciation | ✅ | integer ≥ 1 |
| Total Number of Depreciation | ✅ | integer ≥ 1 |
| Salvage Value (%) | ✅ | 0–100 |
| Depreciation Posting Date | ✅ | hari 1–30 |
| Active | ✅ | boolean |

- Tombol: **Save All** (create redirect ke edit)
- Edit: sidenav **Audit Log**

## Status dokumentasi

- Knowledge Base: **draft** (dari FE/BE)
- Requirement: pending
- Technical: pending
- Test cases: lihat `test-cases/`
