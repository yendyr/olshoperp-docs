---
doc_type: technical
menu: accounting-account-payable-report
menu_name: "Account Payable Report"
version: 1.0
last_updated: 2026-09-02
owner: QA - Yemima
status: draft
---

# Account Payable Report — Technical Documentation

**Behavior (partial):** [requirement.md](./requirement.md) v1.0  
**Supplier display:** parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721) · child [ETM-15728](https://erpintegration.atlassian.net/browse/ETM-15728)

> File map / API penuh: **pending**.

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-02 | QA - Yemima | Stub + `SUPPLIER_DISPLAY_MODE` wiring note |

---

## 1. Supplier display mode (ETM-15721 / ETM-15728)

| Item | Rule |
|------|------|
| Flag | `SUPPLIER_DISPLAY_MODE=code_only` (rollback: `code_and_name`) |
| Helpers | Shared FE/BE export helpers dari foundation ETM-15721 — jangan hardcode |
| Select2 / filter | Search name+code; label/grid = code; no hover name |
| ColVis / datalist | Code only; no Supplier Name option |
| Export | Omit name |
| Print | Keep name (jika ada print) |
