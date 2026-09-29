---
doc_type: technical
menu: omni-picking-list
menu_name: "Picking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: developer
---

# Picking List — Technical Documentation

**UI:** `/omni/picking-list` · **SoT:** `_meta/sot/omni-picking-list-source-of-truth.md` v1.0

---

## 1. Entity & process type

| Item | Nilai |
|------|--------|
| Model | `PickingList` extends stock mutation / picking entity |
| `process_type` | `picking` (bukan `manual picking`) |
| Prefix kode | `PL-*` |
| Relasi | Detail lines + SO refs; SO↔PL M:N via detail / pivot |

Manual PL: `process_type` = `manual picking`; controller method approve terpisah (`approveManualPicking`) — shared engine pick/complete sebagian.

---

## 2. Backend map

| Area | Lokasi (orientasi) |
|------|---------------------|
| Controller | `Modules/.../PickingListController` (Omni / picking-list routes) |
| Routes API | `omnichannel/picking-list*` (index, show, start, pick/unpick, complete, export, filters) |
| Job / side-effect Complete | Checking list / SO process jobs (bukan TF Manual PL) |

Pastikan filter index membatasi `process_type = picking` agar Manual PL tidak tercampur datalist ini.

---

## 3. Frontend map

| Area | Path |
|------|------|
| Datalist | `src/.../Omni/Processing/PickingList/DataList.vue` (atau setara) |
| Process form | `.../PickingList/FormComponent.vue` (shared pola dengan Manual) |
| Route FE | `/omni/picking-list`, `/omni/picking-list/edit/:id` |
| Omni scan entry | `/omni/picking-process` — redirect ke edit PL (TO-BE wiring) |

---

## 4. Status fields

| Field UI | Field / turunan |
|----------|-----------------|
| Trx Status | Draft / Open / Approved |
| Picking Status | Derived: no `start` → `-`; `start` tanpa `end` → In Progress (+ Paused flag jika ada); `end` → Complete |
| Time Duration | Pre-start `-`; in-progress picked/unpicked counts; post-complete duration |
| Start / End | Timestamp `start` / `end` |

---

## 5. Datalist building / store (AS-IS gap)

| Field | Behavior AS-IS (verified intent) | Target |
|-------|----------------------------------|--------|
| Store Name | Dari store terkait PL / order | Multi-store: 1 cell + tooltip; export CSV comma |
| Building | Masih dari **default store warehouse**, bukan WH **process** order | Building dari WH process order |

Implementasi fix building = alignment query join ke warehouse process order, bukan default WH store master saja.

---

## 6. Process rules (enforce)

| Rule | Enforce di |
|------|------------|
| Location options same warehouse structure | API location list + FE filter |
| Location editable only if unpicked | FE + API update location |
| Complete blocked if unpicked unresolved | Review Unpicked flow (Lost / New PL TO-BE ETM-16131) |
| Incomplete SO = order POV | Filter payload SO-centric, bukan trx_status PL |

---

## 7. ETM-16131 touchpoints

| Screen | FE focus | BE focus |
|--------|----------|----------|
| Process | Qty default full; location+stock UI; Incomplete SO slideover | Location same-structure; save picked payload |
| Review Unpicked | Lost / New PL only; qty read-only | Auto-create New PL; no quantity edit API |
| Yay / Summary | Copy + Orders block + Print Packing List | Summary payload SO/qty/status |
| Incomplete SO count | Pill badge | Fix empty count query |

---

## 8. Testing notes

- Index hanya `process_type=picking`  
- Start → Open + `start`; Complete → Approved + `end`  
- Multi-SO one PL; multi-PL one SO (generate upstream)  
- Regression Manual PL create/approve tidak rusak  
- Building/store setelah GAP-PL-01/02  

---

## 9. Related code_globs (manifest)

Isi saat sync: backend `PickingList*`, routes picking-list; frontend `Omni/Processing/PickingList/**`, route `omni/picking-list`.
