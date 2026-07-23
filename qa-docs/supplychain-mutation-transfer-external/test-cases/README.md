# Test Cases — External Transfer

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-MTEX-001 | Create External Transfer header (TFE*) | draft | ✅ | 2026-07-15 |
| TC-MTEX-002 | Update header + tambah detail Select Product | draft | ✅ | 2026-07-15 |

## Cross-menu

**Transfer Inbound** (`supplychain-transfer-inbound`) memakai dokumen External Transfer yang sudah **Approve ship** (in transit) sebagai fixture receive.

Fixture aktif: **`TFE-5TU41QH5`** — lihat `qa-docs/supplychain-transfer-inbound/test-cases/TC-TIB-001.md`.

Description (standing rule): `automation playwright`.

Skenario TI e2e: Origin DropOFF Gayungsari → Destination DropOFF Tunjungan Plaza; SKU `AUTO-SKU001` / `AUTO-SKU002`; Description TE = `automation playwright`.
