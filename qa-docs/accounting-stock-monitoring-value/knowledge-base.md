---
doc_type: knowledge-base
menu: accounting-stock-monitoring-value
menu_name: "Stock Monitoring Value"
version: 1.1
last_updated: 2026-08-11
owner: QA - Yemima
status: draft
audience: operator
---

# Stock Monitoring Value — Knowledge Base

Menu **FA → Report → Stock Monitoring Value** menampilkan stok per warehouse **plus kolom nilai** (Currency, Unit Price, Price in Primary Unit). UI memakai komponen yang sama dengan Dev - Stock Monitoring.

| Atribut | Nilai |
|---------|-------|
| Route | `/accounting/stock-monitoring-value` |
| API | `GET accounting/stock-monitoring-value` |
| Bedanya dengan SCM Stock Monitoring | `show_unit_value=1` — kolom harga tampil |

## Export All

Sama pipeline export dengan Stock Monitoring. **TO-BE:** Excel harus mirror UI — termasuk pecah **Last Move Ref** jadi Transaction + Warehouse, dan urutan kolom konsisten. Detail kanonik: [Stock Monitoring requirement §8](../supplychain-stock-monitoring/requirement.md#8-export-all--ui-parity-to-be--gap-stmon-exp-01) (`GAP-STMON-EXP-01`).

## Related

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| SCM Stock Monitoring | [../supplychain-stock-monitoring/](../supplychain-stock-monitoring/) |
