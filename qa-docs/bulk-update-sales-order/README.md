# Bulk Update Sales Order — Dokumentasi QA

Menu **Bulk Update Sales Order** — dokumen massal untuk mengubah detail Sales Order (ganti System SKU, qty, unit price, tambah SKU) tanpa edit order satu per satu.  
Route (TO-BE): `/businessdevelopment/bulk-update-sales-order`  
Sidebar: **Business Development** → di bawah **All Sales Order**

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | pending |

**Version (3 layer):** 1.0 · **Last updated:** 2026-11-27 16:28  
**Jira:** [ETM-17847](https://erpintegration.atlassian.net/browse/ETM-17847) (menu) · [ETM-17854](https://erpintegration.atlassian.net/browse/ETM-17854) (audit log) · [ETM-17855](https://erpintegration.atlassian.net/browse/ETM-17855) (Import Detail Lines)  
**Prototype (info only):** [Claude artifact](https://claude.ai/artifact/KeyhPfGdij3vRYa7Xzxcxx) — visual UI bukan acuan; ikut standar komponen OlshopERP.

## Related menus

| Menu | Alasan |
|------|--------|
| [All Sales Order](../all-sales-order/) | Hasil akhir perubahan order terlihat & diuji di sini |
| [Dev - Sales Order](../sales-order-general/) | Order tipe general (Draft / Rejected / Unapprove → Draft) |
| [Dev - Sales Platform](../omni-sales-platform/) | Order tipe platform; replace SKU tetap linked product platform |
| [Store](../omni-store-binding/) | Auto Add VAT (Platform Orders) |
| [System Product](../master-system-product/) | SKU pengganti / Add SKU; Sales VAT |

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-11-27 16:28 | Initial TO-BE: menu BUSO (Opsi 1), Stop Auto Approve satu arah, Process Bulk, Audit Log BS+SO, Import Detail Lines lengkap (ETM-17847 / 17854 / 17855). Tanpa Warehouse Process di Import SO General |

**Maintenance owner:** QA — Yemima
