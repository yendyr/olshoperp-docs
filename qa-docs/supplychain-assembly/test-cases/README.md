# Test Cases — Assembly

Prefix folder: `ASMBLY`.

Card terkait: [ETM-15519](https://erpintegration.atlassian.net/browse/ETM-15519) — Building Origin level 20 (drop off). Home folder TC card ini = Assembly.

> Kartu Jira ETM-15525 (Max Qty / unit BOX) → `automate testing jira/ETM-15525/` — bukan daftar wajib 15519.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-ASMBLY-001 | Create Assembly header (Building Origin + Type) | draft | ✅ | 2026-07-15 |
| TC-ASMBLY-002 | Update Assembly description (remain Draft) | draft | ✅ | 2026-07-15 |
| TC-ASMBLY-003 | Add Finish Goods detail + update QTY | draft | ✅ | 2026-07-15 |
| TC-ASMBLY-004 | Building Origin — 11 skenario WH level 19/20, WIP/FG, Inactive (Jeiniffer) | draft | ❌ | 2026-08-17 |
| TC-ASMBLY-005 | Building Origin — WH level 20 (drop off) yang di-set sebagai WIP atau Finish Goods tidak muncul | draft | ❌ | 2026-08-17 |
| TC-ASMBLY-006 | Isolasi — filter Building Origin Assembly tidak bocor ke Transfer Internal / Transfer External | draft | ❌ | 2026-08-17 |
| TC-ASMBLY-007 | Regresi — Single Rack Fulfillment & FIFO: origin bukan Outrack / WIP (menu selain Assembly) | draft | ❌ | 2026-08-17 |
| `TC-ASMBLY-DRAFT-20260827083407.md` / PENDING-20260827083407 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - Assembly | draft | ✅ | 2026-08-27 |

> Kartu Jira ETM-15525 (Max Qty / unit BOX) → `qa-docs/supplychain-assembly/ETM-15525/` 0b6acb1 (docs: reorganize JIRA testing folders and update QA test cases)
