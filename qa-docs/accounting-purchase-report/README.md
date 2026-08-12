# Purchase Report — Dokumentasi QA

Menu **Purchase Report** (Accounting → Report) — laporan pembelian per SKU per supplier, POV **Purchase Order** atau **Purchase Invoice**.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | End-user | pending (placeholder) |

**3 layer:** v1.0 · **Route (proposed):** `/accounting/purchase-report`  
**Source:** Template Report Pembelian SKU per Supplier (user) · **Last updated:** 2026-08-12  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-12 | Initial TO-BE docs + Jira/brief; Accounting Report; Excel Total Tagihan group |

## Key notes

- Blank sampai **Type Transaction** dipilih; Date default **30 hari**
- PO & PI **tidak** dicampur; **tidak** relasi AP; **tidak** link PO↔PI di report
- Semua status; PO With + Without PR; currency as-is
- Total Price tanpa Other Cost/Disc

## Related menus

| Menu | Peran |
|------|--------|
| [Purchase Order](../supplychain-purchase-order/) | Sumber POV PO |
| [Purchase Invoice](../accounting-supplier-invoice/) | Sumber POV PI |
| Account Payable Report | **Tidak** terkait |

## Deliverables (Downloads)

- Brief: `~/Downloads/improvement-accounting-purchase-report.md`
- Jira PO POV: `~/Downloads/jira-accounting-purchase-report-purchase-order.md`
- Jira PI POV: `~/Downloads/jira-accounting-purchase-report-purchase-invoice.md`

Implementasi dataset dipecah 2 card (PO / PI); shell UI menu tetap satu.
