---
doc_type: technical
menu: accounting-stock-monitoring-value
menu_name: "Stock Monitoring Value"
version: 1.1
last_updated: 2026-08-11
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../supplychain-stock-monitoring/technical.md
---

# Stock Monitoring Value — Technical Documentation

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-08-11 | Export TO-BE touchpoints + GAP-STMON-EXP-01 |
| 1.0 | 2026-06-19 | Placeholder |

## 1. Entry points

| Layer | Path |
|-------|------|
| UI | `/accounting/stock-monitoring-value` → `StockMonitoringValue/Datalist.vue` |
| API | `accounting/stock-monitoring-value` → `StockMonitoringValueController` |
| Shared table | `StockMonitoringTable.vue` (`with_price_column=true`) |
| Shared datalist logic | `StockMonitoringController` + `ItemStockChecker` (`show_unit_value=1`) |

## 2. Export (AS-IS → TO-BE)

| File | Role |
|------|------|
| `Modules/Accounting/Jobs/StockMonitoringValueExportJob.php` | Fill `StockMonitoringDataTemp` — AS-IS `last_move_ref` = code only |
| `Modules/Accounting/Exports/StockMonitoringValueExportAll.php` | Headings/map Excel |
| Shared excel job | `StockMonitoringExportExcelJob` type `stock_monitoring_value` |

**TO-BE (`GAP-STMON-EXP-01`):** mirror [SCM technical §5.1](../supplychain-stock-monitoring/technical.md#51-export-column-map--as-is-vs-to-be-gap-stmon-exp-01) — add `last_move_warehouse`, split headings, N/A when last mutation = inbound, keep price columns.

## Related

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| SCM technical | [../supplychain-stock-monitoring/technical.md](../supplychain-stock-monitoring/technical.md) |
