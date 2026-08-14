# Test Cases — Dev - Sales Platform (Log Data)

Card terkait: [ETM-15409](https://erpintegration.atlassian.net/browse/ETM-15409) — kolom Total Order / Platform Total + log lookback job sync.

Prefix folder: `SPLG` (Sales Platform Log).

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-SPLG-001 | LOG DATA — kolom Total Order (platform ALL count) tampil di Sync Log | **fail** (label) | ❌ | 2026-08-13 |
| TC-SPLG-002 | LOG DATA — jenis log lookback Job Auto Sync Order (action Sync Order) | **pass** | ❌ | 2026-08-13 |

**Ringkas ETM-15409:** kolom count job sudah ada di UI sebagai **Total Order** (bukan label **Platform Total** per card). Log lookback system ada: Action `Sync Order`, Description `Job Auto Sync Order from {date} to {date}`.
