---
doc_type: technical
menu: omni-checking-list
menu_name: "Checking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: developer
---

# Checking List — Technical Documentation

**UI:** `/omni/checking-list` · **SoT:** `_meta/sot/omni-checking-list-source-of-truth.md` v1.0 · **Card:** ETM-16138

---

## 1. Entity

| Item | Nilai |
|------|--------|
| Model | `CheckingList` (stock mutation / TF internal) |
| `process_type` | `checking` |
| Prefix | `CL-*` (header); scrap child `TFS-*` |
| Generate | Origin = PL `warehouse_destination`; dest = WH check; ref SO |

---

## 2. Backend map

| Area | Lokasi |
|------|--------|
| Controller | `Modules/OmniChannel/Http/Controllers/CheckingListController.php` |
| Detail / replace | `CheckingListDetailController.php` — `changeProduct`, `checkItemDetail` |
| Logic generate | `Modules/SupplyChain/Logics/Processing/CheckingListLogic.php` |
| Scrap WH helper | `getScrapWHParent()` |
| Replace lookup | `StockMutation::getReplaceMutation()` |

### API (existing base `omnichannel/`)

`GET checking-list/{id}` · detail list/show · `POST .../check` · `POST .../change-product` · select2 warehouse · check-available-qty · checking-standarization · `POST approve` · pause/resume/set-location/bulk-check · select2-location

### TO-BE API (ETM-16138)

- Expose platform/internal status + `is_manual` / source on header  
- Replacement history  
- `GET checking-list/{id}/completion-summary`  
- Void / Void & Recreate hooks (Sales Platform)  
- Pastikan scrap WH resolve dari WH-process structure order  

---

## 3. Frontend map

| Piece | Path |
|-------|------|
| Form process | `Omni/Processing/CheckingList/Form.vue` |
| Set location | `Location.vue` |
| Header | `HeaderInformation.vue` |
| Datalist | `DataList.vue` |
| Shared table | `components/project/DataTables/PrimeDataTables.vue` |
| NEW | `CheckingCompletionSummary.vue` (pattern PL CompletionSummary) |

**Bug AS-IS:** `primevue_columns` / `changeColumn()` set `header: ''` — fix di ETM-16138.

Wireframe: https://claude.ai/artifact/WokXLb4E1JMVEvNAKgKjKk

---

## 4. Replace TF rules (enforce)

| Step | Behavior |
|------|----------|
| `changeProduct` | Create/update Scrap: origin CL origin → scrap WH, `PROCESS_TYPE_SCRAP`, ref CheckingList |
| | Create/update Replace: origin `item_stock.warehouse_id` → CL dest, `PROCESS_TYPE_CHECKING`, TF_INTERNAL |
| `approve` | Approve scrap + replace; set picked on replace details; store replace lines onto CL with `checked=1` |
| Void path (TO-BE) | Skip scrap/replace create/approve |

**Verify:** `getReplaceMutation()` filters `transaction_reference_class = CheckingList` + dest `PROCESS_GROUP_CHECK`, while create replace may set SO ref — align lookup with created docs before relying on approve path.

---

## 5. Check rules

- Per product/row boolean — seluruh qty baris  
- Pause blocks modify when duration ended unfinished  
- UI: Check/Uncheck ≠ Replace modal  

---

## 6. Cancel/void gate (TO-BE)

| Flag | Use |
|------|-----|
| `is_manual` / not from skip-wave/skip-processing | Show prompt |
| Platform status contains `cancel` OR internal `void` | Trigger prompt |
| Continue | Normal approve + TFs |
| Void / Void & Recreate | No scrap/replace TF; call Sales Platform void flows |

---

## 7. Testing notes

- Change then approve → scrap + replace Approved; stock moved  
- Partial replace beda rack → multiple rows / history entries  
- Continue on cancelled order → TFs still approved  
- Void → no new scrap/replace TF  
- Skip-wave CL → no cancel prompt  
- FE mock/tests if completion-summary / header flags change shape  

---

## 8. code_globs

Backend: `**/CheckingList*` · Frontend: `**/Omni/Processing/CheckingList/**`
