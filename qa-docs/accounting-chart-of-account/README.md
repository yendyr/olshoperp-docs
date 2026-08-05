# Chart of Account (Master COA) — Dokumentasi

Menu **Chart of Account** (Finance & Accounting, alias **Master COA / COA**) — master akun buku besar per company. Tersusun sebagai tree parent-child; hanya **leaf Active** yang boleh dipakai di Journal & auto-journal transaksi.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator (Finance) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/README.md](./test-cases/README.md) | QA | review (TC-COA-001…004) |

**PM source:** Chart of Account (Master COA) Source of Truth **v1.0** (30 Juli 2026)
**3 layer version:** requirement 1.0 · technical 1.0 · knowledge-base 2.0 · **User-guide:** 1.0 (`source_version` 1.0)
**Maintenance owner:** QA — Yemima

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | **Finance & Accounting** (`Modules/Accounting`) |
| Sidebar | Accounting → **Chart of Account** |
| Route UI | `/accounting/chart-of-account` |
| API base | `accounting/chart-of-account` |
| Scope | Per company (`owned_by`), `is_all_company = 0` |

---

## File utama

- FE datalist: `olshoperp-frontend/src/pages/Accounting/master/COA/DataList.vue`
- FE form: `olshoperp-frontend/src/pages/Accounting/master/COA/Form.vue`
- BE controller: `Modules/Accounting/Http/Controllers/ChartOfAccountController.php`
- BE import: `Modules/Accounting/Import/CoaImport.php`

---

## Ringkasan v1.0

- 7 COA Class (Assets, Liabilities, Equity, Revenue, Expense, Cost of Goods Sold, Other Revenue & Expenses) → Position Activa/Passiva.
- Struktur tree (`CoaTree`); parent = group (tak dipakai transaksi), leaf = dipakai transaksi.
- Cascade status & Class ke seluruh descendant; view-only (locked) saat COA sudah punya relasi.
- Import 5 kolom (Class via ID numerik), all-or-nothing, create-only, hasil Active; Import History (download ≤24 jam) + View Error Logs (import terakhir).
- Gap Registry `GAP-COA-01..04` (parent picker hanya exclude Journal; anti-circular tidak dipanggil; activate-child pakai `parent_id`; export mode mapping).

---

## Related menus

- [Journal](../journal/README.md) — baris debit/credit ke leaf COA Active
- [Product COA Group](../accounting-product-coa-group/README.md) — COA per produk
- [Cash/Bank Account](../accounting-company-detail-bank/README.md) — leaf COA Cash/Bank
- [Purchase Invoice](../accounting-supplier-invoice/README.md) — COA editable Additional Cost/Discount

---

## Changelog

| Tanggal | Perubahan |
|---------|-----------|
| 2026-07-30 | Docs lengkap 5-file selaras SoT v1.0 + verifikasi codebase AS-IS: requirement/technical/user-guide baru; KB v2.0 (tone operator + class ID map); Gap Registry `GAP-COA-01..04`; status 3 layer → review |
| 2026-07-10 | Catatan konsumen Purchase Invoice (COA override Additional Cost/Discount) |
