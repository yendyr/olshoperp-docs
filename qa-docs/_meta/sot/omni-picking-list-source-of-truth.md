---
doc_type: source-of-truth
menu: omni-picking-list
menu_name: "Picking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
aliases: [picking list, PL, incomplete so picklist, scm picking list]
related_jira: [ETM-16131]
---

# Picking List — Source of Truth v1.0

**UI route:** `/omni/picking-list` · edit/process: `/omni/picking-list/edit/:id`  
**Sidebar (aktif):** Supply Chain › Processing › Picking List  
**Bukan:** Manual Picking List (`/supplychain/manual-picking-list`) · Picking Process Omni scan (`/omni/picking-process`)

Verified: Yemima AS-IS (2026-09-29) + `PickingListController` / FE `Omni/Processing/PickingList`.

---

## 1. Ringkasan

Picking List adalah transaksi pick operasional gudang: daftar PL yang digenerate dari Wave/SO, datalist untuk tim gudang, dan halaman process (start → pick/unpick SKU → complete). Satu PL = satu warehouse process; SO↔PL many-to-many.

---

## 2. Relasi dua pintu (konsep)

| Pintu | Route | Peran |
|-------|-------|--------|
| **Picking List (aktif)** | `/omni/picking-list` | Datalist + process penuh |
| **Picking Process (Omni)** | `/omni/picking-process` | TO-BE: scan SO → redirect ke halaman process yang sama |
| Manual Picking List | `/supplychain/manual-picking-list` | Create manual; `process_type` beda — SOT terpisah |

UI process shared sebagian (`FormComponent`); entity/API datalist **tidak** satu jalur dengan Manual PL.

---

## 3. Generate & many-to-many (AS-IS bisnis)

1. Generate dari Default Waves: jika order beda **warehouse process** → auto-split PL per WH process.  
2. WH process sama → boleh digabung 1 PL meski **beda store**.  
3. 1 SO boleh multi PL; 1 PL boleh multi SO.

---

## 4. Datalist — toolbar

Global Search · Advanced Filter · pill **Incomplete SO Picklist** · Show deleted · Column show/hide · Export · Created By/At (default) · Action.

---

## 5. Datalist — kolom visible

| Label | Sumber (ringkas) |
|-------|------------------|
| Trx Code \| Trx Date | `code` + `transaction_date` |
| Trx Ref | kode SO dari detail |
| SO Total | count distinct SO |
| Store Name \| Building | store + building — **GAP:** building masih dari default store WH, bukan WH process order |
| Assignee | picker |
| Start \| End Picking | `start` / `end` |
| Total SKU \| Total Qty | agregat detail |
| Picking Status \| Time Duration | lihat §6 |
| Trx Status | Draft / Open / Approved |

**Hidden:** `transaction_date_sortable`, `name_formatted`, `end`, `total_quantity_formatted`, `picking_duration_formatted`.

---

## 6. Status picking ↔ trx

| Picking Status | Time Duration | Trx Status |
|----------------|---------------|------------|
| `-` (belum start) | `-` | Draft |
| In Progress | `{n} picked \| {m} unpicked` | Open |
| Paused | (in progress + pause) | Open |
| Complete | durasi start→end | Approved |

Start Picking → `start` + Open; Complete → `end` + Approved.

---

## 7. Halaman process (AS-IS)

Kolom: Product · Location (+ stock sub) · Qty · Unit · aksi ikon pick/unpick.  
Location inline edit hanya unpicked; picked read-only. Opsi location harus same warehouse structure (parenthies/building) — **GAP** jika API masih lintas struktur.

Alur: Start → pick/unpick → Review Unpicked → Complete → Yay → Completion Summary. Pill Incomplete SO = POV order.

---

## 8. Gap registry

| ID | Type | Status | Ringkas |
|----|------|--------|---------|
| GAP-PL-01 | Bug/AS-IS wrong | Pending (card ada) | Building di datalist dari store default, bukan WH process order |
| GAP-PL-02 | TO-BE | Pending | Multi-store: 1 cell + tooltip list; export comma-separated |
| GAP-PL-03 | TO-BE | ETM-16131 | UI/UX 5 screen process (handoff) |
| GAP-PL-04 | Bug | In ETM-16131 | Pill Incomplete SO count kosong |

---

## 9. TO-BE — ETM-16131 (handoff)

Screen 1–5: qty default full To Pick; location+stock+same-structure; Review Unpicked Lost-only/New PL auto; Yay sans ignored; Completion Summary Orders block; Incomplete SO slideover redesign. Wireframe: Artifact GEko3V6NJ1WXHywWoKAkbh.

---

## 10. Relasi menu

Waves Management · Unassign Wave · Skip Wave / Skip Processing · Checking/Packing List · Failed Ship · Manual Picking List (terpisah) · Picking Process Omni (entry scan).

---

## 11. Technical pointer (split ke technical.md)

Entity `PickingList` extends `StockMutation`; `process_type` picking; API `omnichannel/picking-list*`; FE `Omni/Processing/PickingList/*`.
