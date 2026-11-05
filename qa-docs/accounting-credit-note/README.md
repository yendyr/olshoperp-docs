# Credit Note — Dokumentasi QA

Menu **Credit Note** (Accounting / Account Receivable).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | draft |
| Test Cases | [test-cases/](./test-cases/) | QA | draft (9 DRAFT, ETM-15442; 1 E2E **failed**) |

**UI route:** `/accounting/credit-note`  
**Help Center overview:** [`_meta/docs-hub/menus/accounting-credit-note/`](../_meta/docs-hub/menus/accounting-credit-note/)  
**SoT:** `accounting-credit-note-source-of-truth.md` v1.0 (17 Jul 2026)  
**3 layer version:** 1.6 · **User-guide:** v1.4 · `source_version` 1.6 · **Feature Map:** 1.0 · **Last updated:** 2026-11-05  
**Related Jira:** [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764) · [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064) · [ETM-17070](https://erpintegration.atlassian.net/browse/ETM-17070) · [ETM-17108](https://erpintegration.atlassian.net/browse/ETM-17108) · [ETM-17111](https://erpintegration.atlassian.net/browse/ETM-17111)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.6 | 2026-11-05 17:00 | Gap baru dari uji Staging: halaman edit CN kosong saat customer tidak terbaca (ETM-17108), dan CN dari Sales Return tanpa Description/Reference Doc (ETM-17111); penjelasan awam di KB + user-guide |
| 1.5 | 2026-11-05 13:23 | Di daftar Credit Note, referensi transaksi dari retur yang sudah ditagih menampilkan nomor Sales Return dan bisa diklik ke dokumen retur itu (selaras Debit Note); ETM-17070 |
| 1.4 | 2026-11-04 | CN dari SR billed = ada SI (bukan AR/payment); ETM-17064 |
| 1.2 | 2026-10-22 | TO-BE ETM-16764: CN dari Sales Return → Deposit of Sales Return; consume AR ikut COA asal |
| 1.1 | 2026-08-05 | TO-BE Receiving Destination free COA (GAP-CN-05); SF-DET-01 dual path; Help Center overview sync |
| 1.0 | 2026-07-17 | Docs awal dari SoT v1.0: konsep CN/Payment, import all-or-nothing, auto Sales Return billed, AR deposit, gaps CN-01–04; user-guide v1.0 |
| 1.0b | 2026-07-29 | Feature Map + 5 capability cards; UG v1.1 (SF tags, status review); Help Center overview en/id |

## Related menus

| Menu | Link |
|------|------|
| Sales Invoice | [../accounting-customer-invoice/](../accounting-customer-invoice/) — penentu billed |
| Sales Return Approval | [../accounting-sales-return/](../accounting-sales-return/) — auto-generate CN billed; Trx Ref CN baru = nomor SR |
| Sales Return (SC) | [../supplychain-sales-returns/](../supplychain-sales-returns/) — qty/nilai retur |
| Account Receive | [../accounting-customer-payment/](../accounting-customer-payment/) — pakai CN sebagai deposit |
| Debit Note (mirror AP) | [../accounting-debit-note/](../accounting-debit-note/) — klaim supplier; dipakai di Account Payment |
| Journal | [../journal/](../journal/) — auto journal approve |
| Store Binding | [../omni-store-binding/](../omni-store-binding/) — Deposit COA Platform |
| Cash/Bank Account | [../accounting-company-detail-bank/](../accounting-company-detail-bank/) — Receiving Cash/Bank; COA bound exclude free picker |

**Maintenance owner:** QA — Yemima
