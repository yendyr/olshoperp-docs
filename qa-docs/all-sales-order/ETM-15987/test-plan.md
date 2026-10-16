# Test Plan: ETM-15987 — Advanced Filter DO/OB/SI Code dan Date terpisah (gap-only)

- **Origin Card:** [ETM-15987](https://erpintegration.atlassian.net/browse/ETM-15987) — `[All Sales Order] - Advanced Filter Code dan Date DO/OB/SI masih digabung`
- **Jira Test Case:** [ETM-16055](https://erpintegration.atlassian.net/browse/ETM-16055) — `SC-ASO-15987-01`
- **Tipe:** Error / Gap-only (GREEN TC)
- **Menu:** All Sales Order (`all-sales-order` / `/businessdevelopment/all-sales-order`)
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — jangan duplikasi multi-condition suite `TC-ASO-15969-*`

## Tujuan

Memastikan Advanced Filter menyediakan **enam opsi terpisah**: DO Code, DO Date, Outbound Code, Outbound Date, SI Code, SI Date — filter date-only dan code-only independen (bukan "Code & Date" digabung).

## Anti-dupe

| Existing | Coverage | Gap ini |
|---|---|---|
| `TC-ASO-15969-01..05` | Multi-condition Date (happy; asumsi field sudah terpisah) | **UI option list** 6 opsi terpisah + code-only/date-only independen |
| Clone siblings ETM-15997/98/16000/16001 | Related Path 2 | Bukan assert split option list |

## Matriks (1 NEW)

| Kode | Type | Fokus | Jira TC |
|---|---|---|---|
| SC-ASO-15987-01 | happy | Enam opsi Code/Date terpisah + filter independen | [ETM-16055](https://erpintegration.atlassian.net/browse/ETM-16055) |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-ASO-15987-01 | `test-cases/TC-ASO-15987-01.md` | TC-ASO-15987-01 |

**Checklist:** 1 skenario → 1 TC. Jangan ulangi suite multi-condition ETM-15969.
