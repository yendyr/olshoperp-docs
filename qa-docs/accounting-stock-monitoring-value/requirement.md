---
doc_type: requirement
menu: accounting-stock-monitoring-value
menu_name: "Stock Monitoring Value"
version: 1.1
last_updated: 2026-08-11
owner: QA - Yemima
status: draft
---

# Stock Monitoring Value — Requirement Documentation

> **DRAFT** — Fokus v1.1: Export All parity dengan UI (`GAP-STMON-EXP-01`), shared dengan Dev - Stock Monitoring.

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-08-11 | TO-BE export Last Move split + column order; cross-ref SCM §8 |
| 1.0 | 2026-06-19 | Placeholder |

## 1. Ringkasan

Stock Monitoring Value = Stock Monitoring + unit value columns. Datalist: `StockMonitoringTable` + `with_price_column=true`. Backend: `StockMonitoringValueController` → `StockMonitoringController` dengan `show_unit_value=1`.

## 2. Export All — TO-BE (`GAP-STMON-EXP-01`)

Ikuti aturan kanonik di [Dev - Stock Monitoring §8](../supplychain-stock-monitoring/requirement.md#8-export-all--ui-parity-to-be--gap-stmon-exp-01):

- Urutan selaras UI (product fields early)
- **Last Move Ref (Transaction)** + **Last Move Warehouse**
- N/A parity dengan UI
- Pertahankan Currency / Unit Price / Price in Primary Unit

| ID | Acceptance |
|----|------------|
| SMV-EXP-01 | Last Move 2 kolom di Excel Value export |
| SMV-EXP-02 | Tidak drop kolom harga |
| SMV-EXP-03 | N/A last-move konsisten UI |

## Related

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| SCM Stock Monitoring | [../supplychain-stock-monitoring/requirement.md](../supplychain-stock-monitoring/requirement.md) |
