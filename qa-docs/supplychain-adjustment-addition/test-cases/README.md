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
| PENDING-20260903141601 | [New Colli: Multi-SKU (≥2 SKU) via Bulk Assign](./TC-ADJADD-DRAFT-20260903141601.md) | draft | [ETM-15762](https://erpintegration.atlassian.net/browse/ETM-15762) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141602 | [New Colli: Single SKU](./TC-ADJADD-DRAFT-20260903141602.md) | draft | [ETM-15763](https://erpintegration.atlassian.net/browse/ETM-15763) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141603 | [Assign ke Existing Colli (Same WH Destination)](./TC-ADJADD-DRAFT-20260903141603.md) | draft | [ETM-15764](https://erpintegration.atlassian.net/browse/ETM-15764) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141604 | [Pencarian Kode Colli pada Dropdown Existing Colli](./TC-ADJADD-DRAFT-20260903141604.md) | draft | [ETM-15765](https://erpintegration.atlassian.net/browse/ETM-15765) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141605 | [Validasi Mismatch Warehouse pada Existing Colli](./TC-ADJADD-DRAFT-20260903141605.md) | draft | [ETM-15766](https://erpintegration.atlassian.net/browse/ETM-15766) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141606 | [Kombinasi Baris Ber-Colli dan Tanpa Colli (NULL OK)](./TC-ADJADD-DRAFT-20260903141606.md) | draft | [ETM-15767](https://erpintegration.atlassian.net/browse/ETM-15767) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141607 | [Aturan Integritas 1 Baris Maksimal 1 Colli](./TC-ADJADD-DRAFT-20260903141607.md) | draft | [ETM-15768](https://erpintegration.atlassian.net/browse/ETM-15768) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141608 | [Remove SKU dari Colli (Pelepasan ke NULL)](./TC-ADJADD-DRAFT-20260903141608.md) | draft | [ETM-15769](https://erpintegration.atlassian.net/browse/ETM-15769) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141609 | [Move SKU ke Colli Lain](./TC-ADJADD-DRAFT-20260903141609.md) | draft | [ETM-15770](https://erpintegration.atlassian.net/browse/ETM-15770) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141610 | [Edit In Qty pada Baris Ber-Colli](./TC-ADJADD-DRAFT-20260903141610.md) | draft | [ETM-15771](https://erpintegration.atlassian.net/browse/ETM-15771) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141611 | [Validasi Qty ≤ 0 pada Baris Ber-Colli](./TC-ADJADD-DRAFT-20260903141611.md) | draft | [ETM-15772](https://erpintegration.atlassian.net/browse/ETM-15772) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141612 | [Import Excel: Nomor Urut Colli Sama vs Beda](./TC-ADJADD-DRAFT-20260903141612.md) | draft | [ETM-15773](https://erpintegration.atlassian.net/browse/ETM-15773) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141613 | [Import Excel: Kode Existing & Baris Kosong (NULL)](./TC-ADJADD-DRAFT-20260903141613.md) | draft | [ETM-15774](https://erpintegration.atlassian.net/browse/ETM-15774) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141614 | [Validasi Import: Qty Minus/0 & Error Log](./TC-ADJADD-DRAFT-20260903141614.md) | draft | [ETM-15775](https://erpintegration.atlassian.net/browse/ETM-15775) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141615 | [Validasi Import: Kode Existing Beda WH / Fiktif](./TC-ADJADD-DRAFT-20260903141615.md) | draft | [ETM-15776](https://erpintegration.atlassian.net/browse/ETM-15776) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141616 | [Master Colli Type: Inactive Filter & Preselect Default](./TC-ADJADD-DRAFT-20260903141616.md) | draft | [ETM-15777](https://erpintegration.atlassian.net/browse/ETM-15777) | OlshopERP | ❌ | 2026-09-03 |
| PENDING-20260903141617 | [Approval via Stock Addition Approval & Visibilitas Stock Monitoring](./TC-ADJADD-DRAFT-20260903141617.md) | draft | [ETM-15778](https://erpintegration.atlassian.net/browse/ETM-15778) | Jeiniffer | ❌ | 2026-09-03 |
| PENDING-20260903141618 | [Pembersihan Orphan Colli saat Hapus Detail/Draft](./TC-ADJADD-DRAFT-20260903141618.md) | draft | [ETM-15779](https://erpintegration.atlassian.net/browse/ETM-15779) | OlshopERP | ❌ | 2026-09-03 |
