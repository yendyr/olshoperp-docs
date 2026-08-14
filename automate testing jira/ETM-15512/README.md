# ETM-15512 — Default Variant create/import + expand leftover

| Field | Nilai |
|-------|--------|
| Jira | [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512) |
| Status kartu | QA Review |
| Menu | System Product (+ prasyarat Master Variant) |
| Modul | Supply Chain |
| Company uji | FAT (112) — ubah jika data staging beda |
| Docs | `qa-docs/system-product/requirement.md` §6.3.1–§6.3.2 |

- Kartu: [card.md](./card.md)
- TC: [test-cases/](./test-cases/)
- Hasil: [results/](./results/)

## Cakupan TC

| TC | Fokus | Gap |
|----|--------|-----|
| TC-01 | Create + Default ON → parent `-(PARENT)` + child | GAP-SP-17 |
| TC-02 | OFF Enable Variations → confirm → Single | GAP-SP-17 |
| TC-03 | Import Single-eligible + Default ON | GAP-SP-17 |
| TC-04 | Import skip (explicit variant / parent-used) | GAP-SP-17 |
| TC-05 | Expand zero-relation → soft delete + regenerate | GAP-SP-18 |
| TC-06 | Expand dengan relasi → leftover + confirm + SKU baru | GAP-SP-18 |
| TC-07 | Naming omit Default segment + kolom Default hidden | GAP-SP-17/18 |
