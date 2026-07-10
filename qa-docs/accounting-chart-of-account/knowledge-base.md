---
doc_type: knowledge-base
menu: accounting-chart-of-account
menu_name: "COA"
version: 1.1
last_updated: 2026-07-10
owner: QA - Yemima
status: draft
audience: operator
---

# COA — Knowledge Base

**Audience:** Operator, Finance, Support  
**Route:** `/accounting/chart-of-account`

> Requirement & Technical layer masih **pending**. Ringkasan di bawah fokus pada peran COA sebagai sumber opsi di transaksi terkait.

## Ringkasan

Menu **COA (Chart of Account)** adalah master akun buku besar di modul **Accounting**. Data COA dipakai di banyak transaksi sebagai akun Debit/Credit jurnal.

## Istilah singkat

| Istilah | Arti |
|---------|------|
| Leaf / child COA | Akun paling bawah (tidak punya sub-akun) — biasanya yang boleh dipilih di transaksi |
| Parent COA | Akun induk — tidak boleh dipilih di kebanyakan picker transaksi |
| Active | `status = 1` — muncul di dropdown |
| COA Class | Kelompok akun (Expense, Revenue, Assets, dll.) |

## Konsumen terkait — Purchase Invoice Additional Cost/Discount

Sejak PI v2.1, kolom **COA** di section Additional Cost & Additional Discount **editable** per baris sebelum approve.

| Aspek | Perilaku |
|-------|----------|
| Endpoint picker | `GET accounting/chart-of-account/select2/child` |
| Filter class | **Tidak ada** — seluruh class boleh |
| Filter lain | **Active** + **leaf only** + company scope |
| Default | COA dari Master Other Cost / Other Discount (atau warisan PO) |
| Override | Tidak mengubah master COA / master Other Cost/Disc |

Detail: [Purchase Invoice requirement §8.3–§8.5](../accounting-supplier-invoice/requirement.md#83-coa-editable-per-baris-change-req-2026-07).

## Status dokumentasi

| Layer | Status |
|-------|--------|
| Knowledge Base | draft (ringkas — konsumen PI) |
| Requirement | pending |
| Technical | pending |

## Related Documents

| Doc | Path |
|-----|------|
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) |
| Master Other Cost | [../omni-other-cost/](../omni-other-cost/) |
| Master Other Discount | [../omni-other-discount/](../omni-other-discount/) |
