# Test Cases — Instant Settlement

Prefix folder: `SETU`.

### Cards Terkait:
- [ETM-11494](https://erpintegration.atlassian.net/browse/ETM-11494) — tinggi/lebar field filtering vs Global Search dan Choose Store.
- [ETM-15701](https://erpintegration.atlassian.net/browse/ETM-15701) — validasi approval instant settlement transaksi tanggal SI harus sama semua.

| TC Code | Title | Status | Jira | Automated | Last Updated |
|---------|-------|--------|------|-----------|-------------|
| TC-SETU-001 | [DATALIST — tinggi field filtering = Global Search; lebar = Choose Store (Platform Product)](./TC-SETU-001.md) | **failed** | [ETM-11494](https://erpintegration.atlassian.net/browse/ETM-11494) | ❌ | 2026-08-15 |
| TC-SETU-002 | [Approve ditolak jika Sales Invoice dalam 1 batch memiliki tanggal kalender berbeda](./TC-SETU-002.md) | draft | [ETM-15703](https://erpintegration.atlassian.net/browse/ETM-15703) | ❌ | 2026-09-01 |
| TC-SETU-003 | [Approve berhasil jika Sales Invoice memiliki tanggal kalender sama walau jam berbeda](./TC-SETU-003.md) | draft | [ETM-15704](https://erpintegration.atlassian.net/browse/ETM-15704) | ❌ | 2026-09-01 |
| TC-SETU-004 | [Approve batch dengan 1 Sales Invoice (Single Invoice)](./TC-SETU-004.md) | draft | [ETM-15705](https://erpintegration.atlassian.net/browse/ETM-15705) | ❌ | 2026-09-01 |
| TC-SETU-005 | [Validasi penolakan Approve pada boundary jam pergantian hari (23:59 vs 00:01)](./TC-SETU-005.md) | **passed** | [ETM-15706](https://erpintegration.atlassian.net/browse/ETM-15706) | ✅ | 2026-09-03 |
| TC-SETU-006 | [Bulk Approve kombinasi batch settlement valid dan invalid tanggal SI](./TC-SETU-006.md) | draft | [ETM-15707](https://erpintegration.atlassian.net/browse/ETM-15707) | ❌ | 2026-09-01 |
| TC-SETU-007 | [Urutan guard validasi Approval terhadap Fiscal Period Closed dan Cash/Bank Reconcile Lock](./TC-SETU-007.md) | draft | [ETM-15708](https://erpintegration.atlassian.net/browse/ETM-15708) | ❌ | 2026-09-01 |

`TC-SETU-001` — **FAILED**. Tinggi hampir semua 38px; **Pricelist Category 42px**. Lebar tidak sama Choose Store 539px kecuali baseline Platform Product. Error: [ETM-15550](https://erpintegration.atlassian.net/browse/ETM-15550). ETM-11494 **RE-OPEN**.
