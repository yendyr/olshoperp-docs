---
doc_type: knowledge-base
menu: omni-picking-list
menu_name: "Picking List"
version: 1.1
last_updated: 2026-07-05
owner: QA - Yemima
status: draft
audience: operator
---

# Picking List (Omni) — Knowledge Base

> Dokumentasi Omni Picking List masih dalam penyusunan. Bagian perbandingan dengan Manual PL sudah diverifikasi codebase.

## Ringkasan

Menu **Picking List** (Omni) — picking otomatis dari Wave / Sales Order. Route: `/omni/picking-list`.

## Manual Picking List vs Omni Picking List

| Aspek | Omni Picking List | [Manual Picking List](../supplychain-manual-picking-list/knowledge-base.md) |
|-------|-------------------|---------------------------------------------|
| Menu | Omni → Picking List | SCM → Manual Picking List |
| Trigger | Auto dari Wave/SO | User create manual |
| Prefix kode | `PL-*` | `PL-*` (sama) |
| `process_type` | `'picking'` | `'manual picking'` |
| Create form | Tidak ada | SCM Form + detail |
| Complete side-effect | + checking list / SO jobs | TF + deduction + new MPL |
| Picking UI | Shared Omni components | Shared Omni components |

Engine picking & complete logic shared: `PickingListController` — Manual PL memakai `approveManualPicking()`.

**Detail Manual PL:** [requirement §1.3](../supplychain-manual-picking-list/requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (partial)
- Requirement: **pending**
- Technical: **pending**
