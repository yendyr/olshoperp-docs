---
doc_type: source-of-truth
menu: omni-checking-list
menu_name: "Checking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
aliases: [checking list, CL, replace defective, tf scrap]
related_jira: [ETM-16138]
---

# Checking List — Source of Truth v1.0

**UI:** `/omni/checking-list` · process `/omni/checking-list/edit/:id` · set-location `/omni/checking-list/set-location/:id`  
**Bukan:** Checking Process scan-only (Transfer Checking) — pintu berbeda.

Verified: codebase `CheckingListController` / `CheckingListDetailController` + Yemima + handoff ETM-16138 (2026-09-29).

---

## 1. Ringkasan

Checking List (CL) = QC gudang setelah pick: set station location → check/uncheck SKU → optional Replace defective → Complete. Relasi ke SO; generate dari picking. Check = informational (tidak memblok Complete). Replace = modal terpisah → TF Scrap + TF Replace (generate di change, approve di Complete).

---

## 2. Generate header (AS-IS)

CL Internal TF: origin = picking `warehouse_destination` (outrack pick); destination = WH check; `process_type` = checking; ref = Sales Order.

---

## 3. Process UI (AS-IS vs TO-BE)

| Area | AS-IS | TO-BE (ETM-16138) |
|------|-------|-------------------|
| Table headers | Banyak `header: ''` (broken) | Status / Product / Qty / QC Steps / Action |
| Check | Per product row (bool) | Sama: **per-row penuh**; informational |
| Replace | `change-product` + pause | Modal Artifact + preview 2 TF + history |
| Complete | approve; auto-approve scrap/replace TF | + Completion Summary; cancel/void prompt (manual only) |

---

## 4. Replace defective (AS-IS verified)

Trigger: pause + change / `changeProduct`.

| TF | Origin | Destination | process_type | Kapan |
|----|--------|-------------|--------------|-------|
| Scrap (`TFS`) | CL `warehouse_origin` (outrack pick) | Scrap WH (`getScrapWHParent`) | scrap | **Saat change** (Open) |
| Replace (`CL`) | Rack dipilih (`item_stock`) | CL `warehouse_destination` (check outrack) | checking | **Saat change** (Open) |

Saat **approve CL**: auto-approve TF scrap + TF replace; inject replace lines ke CL sebagai checked.

**Keputusan Yemima:** Check ≠ Replace. Replace selalu modal terpisah. Partial replace = partial; beda lokasi → pisah row (dev OK selalu split row). Continue (cancel/void order) tetap generate/approve TF; **Void** → tidak generate TF scrap/replace (stok terakhir = PL di outrack).

---

## 5. Cancel / Void on Complete (TO-BE)

Hanya **manual** checking (bukan Skip Processing / Skip Wave).  
Platform status contains `cancel` OR internal `void` → Continue to Packing **vs** Void only **vs** Void & Recreate SO (Sales Platform flow).

---

## 6. Gap / verify

| ID | Catatan |
|----|---------|
| GAP-CL-01 | Lookup TF replace di approve vs create (`getReplaceMutation` / dest process group) — verify staging |
| GAP-CL-02 | FE table headers kosong — ETM-16138 |
| GAP-CL-03 | Completion summary + history API — TO-BE |
| GAP-CL-04 | Status/source flag untuk cancel prompt — TO-BE |

---

## 7. Relasi

Picking List (upstream) · Packing List (downstream) · Skip Wave / Skip Processing · Sales Platform Void & Recreate · Instant Settlement (CL belum selesai → belum shipped).

---

## 8. Technical pointer

FE: `Omni/Processing/CheckingList/*` · BE: `CheckingListController`, `CheckingListDetailController` · Artifact: https://claude.ai/artifact/WokXLb4E1JMVEvNAKgKjKk · Card: ETM-16138
