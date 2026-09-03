# Test Cases — Stock Addition

Prefix folder: `ADJADD`.

### Cards Terkait:
- [ETM-15633](https://erpintegration.atlassian.net/browse/ETM-15633) — [Stock Addition] Implementasi Colli v2 — Multi-SKU per Colli by Location

---

## Baseline & Feature Test Cases

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-ADJADD-001 | Create Stock Addition header (Location Destination) | draft | ✅ | 2026-07-15 |
| TC-ADJADD-002 | Update Stock Addition header (Description / status Open) | draft | ✅ | 2026-07-15 |
| TC-ADJADD-003 | Add product detail + In Qty | draft | ✅ | 2026-07-15 |

---

## Colli v2 (Multi-SKU per Colli by Location) — Origin [ETM-15633](https://erpintegration.atlassian.net/browse/ETM-15633)

| TC Code | Title | Status | Jira | Assignee | Automated | Last Updated |
|---|---|---|---|---|---|---|
| TC-ADJADD-004 | [New Colli: Multi-SKU (≥2 SKU) via Bulk Assign](./TC-ADJADD-004.md) | draft | [ETM-15762](https://erpintegration.atlassian.net/browse/ETM-15762) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-005 | [New Colli: Single SKU](./TC-ADJADD-005.md) | draft | [ETM-15763](https://erpintegration.atlassian.net/browse/ETM-15763) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-006 | [Assign ke Existing Colli (Same WH Destination)](./TC-ADJADD-006.md) | draft | [ETM-15764](https://erpintegration.atlassian.net/browse/ETM-15764) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-007 | [Pencarian Kode Colli pada Dropdown Existing Colli](./TC-ADJADD-007.md) | draft | [ETM-15765](https://erpintegration.atlassian.net/browse/ETM-15765) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-008 | [Validasi Mismatch Warehouse pada Existing Colli](./TC-ADJADD-008.md) | draft | [ETM-15766](https://erpintegration.atlassian.net/browse/ETM-15766) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-009 | [Kombinasi Baris Ber-Colli dan Tanpa Colli (NULL OK)](./TC-ADJADD-009.md) | draft | [ETM-15767](https://erpintegration.atlassian.net/browse/ETM-15767) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-010 | [Aturan Integritas 1 Baris Maksimal 1 Colli](./TC-ADJADD-010.md) | draft | [ETM-15768](https://erpintegration.atlassian.net/browse/ETM-15768) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-011 | [Remove SKU dari Colli (Pelepasan ke NULL)](./TC-ADJADD-011.md) | draft | [ETM-15769](https://erpintegration.atlassian.net/browse/ETM-15769) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-012 | [Move SKU ke Colli Lain](./TC-ADJADD-012.md) | draft | [ETM-15770](https://erpintegration.atlassian.net/browse/ETM-15770) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-013 | [Edit In Qty pada Baris Ber-Colli](./TC-ADJADD-013.md) | draft | [ETM-15771](https://erpintegration.atlassian.net/browse/ETM-15771) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-014 | [Validasi Qty ≤ 0 pada Baris Ber-Colli](./TC-ADJADD-014.md) | draft | [ETM-15772](https://erpintegration.atlassian.net/browse/ETM-15772) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-015 | [Import Excel: Nomor Urut Colli Sama vs Beda](./TC-ADJADD-015.md) | draft | [ETM-15773](https://erpintegration.atlassian.net/browse/ETM-15773) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-016 | [Import Excel: Kode Existing & Baris Kosong (NULL)](./TC-ADJADD-016.md) | draft | [ETM-15774](https://erpintegration.atlassian.net/browse/ETM-15774) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-017 | [Validasi Import: Qty Minus/0 & Error Log](./TC-ADJADD-017.md) | draft | [ETM-15775](https://erpintegration.atlassian.net/browse/ETM-15775) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-018 | [Validasi Import: Kode Existing Beda WH / Fiktif](./TC-ADJADD-018.md) | draft | [ETM-15776](https://erpintegration.atlassian.net/browse/ETM-15776) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-019 | [Master Colli Type: Inactive Filter & Preselect Default](./TC-ADJADD-019.md) | draft | [ETM-15777](https://erpintegration.atlassian.net/browse/ETM-15777) | OlshopERP | ❌ | 2026-09-03 |
| TC-ADJADD-020 | [Approval via Stock Addition Approval & Visibilitas Stock Monitoring](./TC-ADJADD-020.md) | draft | [ETM-15778](https://erpintegration.atlassian.net/browse/ETM-15778) | Jeiniffer | ❌ | 2026-09-03 |
| TC-ADJADD-021 | [Pembersihan Orphan Colli saat Hapus Detail/Draft](./TC-ADJADD-021.md) | draft | [ETM-15779](https://erpintegration.atlassian.net/browse/ETM-15779) | OlshopERP | ❌ | 2026-09-03 |
