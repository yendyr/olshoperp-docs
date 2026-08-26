# ETM-15495 — Expand variant group pada produk yang sudah punya stok

| Field | Nilai |
|-------|--------|
| Jira | [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495) |
| Status kartu | QA Review |
| Menu | System Product |
| Modul | Supply Chain |
| Company uji | FAT (112) — ubah jika data staging beda |
| Docs | `qa-docs/system-product/requirement.md` §6.3.2 (`GAP-SP-18`) |

- Kartu: [card.md](./card.md)
- TC: [test-cases/](./test-cases/)
- Hasil: [results/](./results/)
- Dedup vs ETM-15512: [../MATRIKS-DEDUPLIKASI-ETM-15495-15512.md](../MATRIKS-DEDUPLIKASI-ETM-15495-15512.md)

## Cakupan TC

| TC | Fokus |
|----|--------|
| TC-01 | Expand + stok → tidak hard-block, leftover + SKU baru |
| TC-02 | Confirm popup leftover (Cancel vs Confirm) |
| TC-03 | Stok tetap di leftover; SKU baru stok 0; tidak auto-rename |
| TC-04 | Naming kombinasi mengikuti `{parent}-{opt}` existing |
| TC-05 | Max 3 variant types tetap berlaku setelah expand |
| TC-06 | Zero relation → soft delete + regenerate |
| TC-07 | Stok saja tanpa relasi dokumen → soft delete |
| TC-08 | Regresi hard-block lama tidak muncul |

**Overview + matriks AC:** [test-cases/testcase-etm-15495-default-variant-expand.md](./test-cases/testcase-etm-15495-default-variant-expand.md)

Katalog menu (`TC-SYSPROD-001`–`003`) hanya create variant baru — **tidak** cover expand + stok. Jangan reuse sebagai wajib run kartu ini.
