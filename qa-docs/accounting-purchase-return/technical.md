---
doc_type: technical
menu: accounting-purchase-return
menu_name: "Purchase Return"
version: 1.0
last_updated: 2026-09-02
owner: QA - Yemima
status: draft
---

# Purchase Return — Technical Documentation

**Behavior (partial):** [requirement.md](./requirement.md) v1.0  
**Supplier display:** parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721) · child [ETM-15726](https://erpintegration.atlassian.net/browse/ETM-15726)

> File map / API / invariants penuh: **pending**. Section di bawah mengunci wiring display.

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-02 | QA - Yemima | Stub + `SUPPLIER_DISPLAY_MODE` wiring note |

---

## 1. Supplier display mode (ETM-15721 / ETM-15726)

| Item | Rule |
|------|------|
| Flag | `SUPPLIER_DISPLAY_MODE=code_only` (rollback: `code_and_name`) — config/env exposed ke FE |
| Helpers | Shared FE (label, Select2 templates, datalist ColVis, `omitSupplierNameFromExport`) — **wajib** pakai helper, jangan hardcode |
| Select2 | Search **name + code**; option/selection = **code**; no hover name |
| Surfaces | Datalist, detail, modal = code only; ColVis tanpa Supplier Name |
| Export | Omit name |
| Print | Keep name |
| Basic Info | Do **not** add read-only Supplier Name field |
