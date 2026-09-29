---
doc_type: source-of-truth
menu: omni-packing-list
menu_name: "Packing List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
aliases: [packing list, pack list, shipping handoff]
related_jira: [ETM-16143]
---

# Packing List — Source of Truth v1.0

**UI:** `/omni/packing-list` · edit `/omni/packing-list/edit/:id` · set-location `/omni/packing-list/set-location/:id`  
**Estafet:** Picking → Checking → **Packing** → Collecting → DO → 3PL.

Verified: `PackingListController` / `PackingListLogic` + handoff wireframe (2026-09-29).

Wireframe: https://claude.ai/artifact/JmsKaAYDVR1F67iGj3SV5X

---

## 1. Ringkasan

Packing List (PK) = kemas setelah checking. Set location → pack/unpack (informatif) → Complete. Bundle = 1 row header + modal komponen. Completion TO-BE = **shipping-handoff card** (shipper + AWB), bukan summary generik.

---

## 2. Generate (AS-IS)

Origin = checking `warehouse_destination`; destination = WH pack (`PROCESS_GROUP_PACK`); `process_type` = packing; ref SO.

---

## 3. Process UI

| Area | AS-IS | TO-BE |
|------|-------|-------|
| Table headers | Banyak `header: ''` (broken) | Status / Product(+Bundle) / Qty / Packing Steps / Action |
| Pack | Per detail bool | Sama: informational; Complete tidak diblok |
| Bundle | detail-bundle modal | Bundle badge + ⊞ View items; pack 1× di level bundle |
| Complete | approve → generate Shipping List (Collecting) | + handoff card; cancel/void prompt (manual) |

---

## 4. Approve side-effect (AS-IS)

- Set SO processing → Packed; optional platform `shipped_at.packing_approve`.  
- Jika ada detail `so_voided` → `generateTransferVoid`.  
- Else → `TransferShippingController::generateShippingList` (Collecting). **Tidak** generate outbound di sini (ETM-10761).

---

## 5. Void TF (AS-IS vs TO-BE)

| | AS-IS `generateTransferVoid` | TO-BE handoff |
|--|------------------------------|---------------|
| Origin | Packing `warehouse_destination` | TBD Option A/B |
| Destination | WH `PROCESS_GROUP_VOIDED_ORDER` | **OUTRACK** (post-pick), auto-approved |
| Tujuan bisnis | Voided WH | Jangan stranded di virtual WH |

### OPEN — Option A vs B (wajib putuskan sebelum BE void)

- **A:** Virtual packing WH → OUTRACK (wireframe wording).  
- **B:** Checking / last real loc → OUTRACK (packing TF never “opened”).  
Catatan kode: packing header sudah punya dest pack WH; void AS-IS dari dest packing → voided WH. TO-BE ganti dest ke outrack; origin cenderung **A** jika stok sudah di pack WH.

Void & Clone = Sales Platform Void & Recreate. Skip prompt jika Skip Wave / Skip Processing.

---

## 6. Completion handoff (TO-BE)

Shipper name + service + 3PL WH · AWB/resi (assume exists; fallback Process Summary) · buyer/city/box/weight/items · next: Collecting→DO→3PL · Print Shipping Label. Void variant: return-TF ke outrack, no shipping banner.

OPEN: field mana guaranteed vs optional di packing-complete.

---

## 7. Relasi

Checking List · Collecting/Shipping List · Process Summary (Get Resi/AWB) · Skip Wave/Processing · Instant Settlement · Sales Platform void.
