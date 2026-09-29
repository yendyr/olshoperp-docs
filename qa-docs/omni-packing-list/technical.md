---
doc_type: technical
menu: omni-packing-list
menu_name: "Packing List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: developer
---

# Packing List — Technical Documentation

**UI:** `/omni/packing-list` · **SoT:** `_meta/sot/omni-packing-list-source-of-truth.md` v1.0  
**Wireframe:** https://claude.ai/artifact/JmsKaAYDVR1F67iGj3SV5X

---

## 1. Entity

| Item | Nilai |
|------|--------|
| Model | `PackingList` |
| `process_type` | `packing` |
| Generate | Origin = CL dest (check); dest = WH `PROCESS_GROUP_PACK` |
| Index group | `PROCESS_GROUP_PACK` |

---

## 2. Backend map

| Area | Lokasi |
|------|--------|
| Controller | `Modules/OmniChannel/Http/Controllers/PackingListController.php` |
| Logic | `Modules/SupplyChain/Logics/Processing/PackingListLogic.php` |
| Downstream | `TransferShippingController::generateShippingList` |
| Void TF | `generateTransferVoid` — AS-IS dest `PROCESS_GROUP_VOIDED_ORDER` |

### API (base `omnichannel/`)

`GET packing-list/{id}` · detail · `POST .../pack` · packing-standarization · detail-bundle · `POST approve` · pause/resume/set-location/bulk-pack · select2-location

### TO-BE

- Header: platform/internal status + `is_manual` / source  
- Void → TF to **OUTRACK** (origin Option A/B — pending) + Sales Platform void hooks  
- `approve` response or `completion-summary`: shipper, service, 3PL WH, AWB, box/weight, buyer, destination, bundle count, return-TF on void  

---

## 3. Frontend map

| Piece | Path |
|-------|------|
| Form | `Omni/Processing/PackingList/Form.vue` |
| Location | `Location.vue` |
| Header | `HeaderInformation.vue` |
| Datalist | `DataList.vue` |
| Table | `PrimeDataTables.vue` |
| NEW | `PackingCompletionSummary.vue` (shipping-handoff card) |

**Bug AS-IS:** `primevue_columns` headers kosong.

---

## 4. Approve flow (AS-IS)

```
approve TF packing
  → update durations + SO PACKED
  → optional platform ship (config)
  → if so_voided details: generateTransferVoid (pack dest → voided WH)
  → else: generateShippingList (Collecting)
  → (outbound generation removed — ETM-10761)
```

---

## 5. Void TF — change required for TO-BE

| Field | AS-IS | TO-BE target |
|-------|-------|--------------|
| `warehouse_origin` | packing `warehouse_destination` | A: pack WH · B: check/last real |
| `warehouse_destination` | voided-order WH | **OUTRACK** (pick process outrack) |
| Auto-approve | Ya | Ya |

Jangan ship `generateShippingList` on void path.

---

## 6. Testing notes

- Pack informational; approve with unpacked OK  
- Bundle pack once; detail-bundle modal  
- Approve → Shipping List created  
- Void AS-IS → voided WH; after TO-BE → outrack + no shipping list  
- Skip-wave: no cancel prompt  
- Completion payload fields null-safe (AWB missing → fallback copy)  

---

## 7. code_globs

Backend: `**/PackingList*` · Frontend: `**/Omni/Processing/PackingList/**`
