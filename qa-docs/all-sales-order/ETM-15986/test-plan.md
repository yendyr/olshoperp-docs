# Test Plan: ETM-15986 — Advanced Filter multi-condition (REUSE ADVF)

- **Origin Card:** [ETM-15986](https://erpintegration.atlassian.net/browse/ETM-15986) — RE-OPEN [All Sales Order] - Advanced Filter multi-condition tidak berfungsi
- **Cloners / origin bug:** [ETM-15951](https://erpintegration.atlassian.net/browse/ETM-15951)
- **Tipe:** Error (QA Review · Approved Test Plan Yemima)
- **Menu:** All Sales Order (`all-sales-order` / `/businessdevelopment/all-sales-order`)
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `extend` — **5 REUSE / 0 NEW**
- **Approval:** Ops msg 49221 · IV https://telegra.ph/Test-Plan-09-21-4

## Tujuan

Memastikan Advanced Filter multi-kondisi All Sales Order bekerja (AND) **tanpa Global Search**, dengan suite **TC-ASO-ADVF-001…005** PASS (AC ETM-15986).

## Anti-duplikat

- Jira QA Test Case links sebelum create: 0
- Suite katalog sudah ada (draft, `origin_jira: null`):
  - `qa-docs/all-sales-order/test-cases/TC-ASO-ADVF-DRAFT-20260916131101.md` … `05.md`
- **Tidak** menulis file TC katalog baru untuk card ini.

## Matriks REUSE

| Kode suite | Type | File katalog | Expected core |
|---|---|---|---|
| TC-ASO-ADVF-001 | positive | TC-ASO-ADVF-DRAFT-20260916131101.md | Uninvoiced Delivered — 4 kondisi AND |
| TC-ASO-ADVF-002 | negative | …02.md | CANCEL + Outbound + SR empty |
| TC-ASO-ADVF-003 | positive | …03.md | COD + Net Sales > 500k + PROCESSED |
| TC-ASO-ADVF-004 | positive | …04.md | GENERAL + Amount >1jt + VAT=0 |
| TC-ASO-ADVF-005 | negative | …05.md | Store + Below Benchmark COGS + SI empty |

## Checklist §5C

5 skenario AC = 5 REUSE suite (0 NEW). Jira Test Case dibuat sebagai **retest wrappers** ter-link QA Test Case ke ETM-15986; eksekusi mengikuti file ADVF di atas.

## Catatan

- Jangan timpa isi expected suite ADVF.
- Saat run: boleh set `last_execution.jira: ETM-15986` pada file ADVF; `origin_jira` katalog tetap sesuai keputusan QA lead (saat ini null).
