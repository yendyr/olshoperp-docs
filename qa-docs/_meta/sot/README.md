# SOT drafts (pra-split)

Folder draft **Source of Truth** per menu — digenerate Cursor dari raw requirement + verifikasi codebase (rule `.cursor/rules/13-sot-generator.mdc`).

## Naming

`{menu-slug}-source-of-truth.md`

Contoh: `accounting-credit-note-source-of-truth.md`

Menu dengan beberapa SOT (Sales Platform): `{slug}-{part}-source-of-truth.md`.

## Alur

1. Yemima kasih raw requirement di chat Cursor
2. Agent generate SOT ke folder ini (**wajib** — jangan hanya Downloads)
3. Review / edit di sini (versi masuk repo `olshoperp` → multi-device via git)
4. Setelah siap: **split** ke `docs/qa-docs/{menu-slug}/` (5 file QA canonical)

## Bukan canonical

Canonical menu docs tetap `docs/qa-docs/{menu-slug}/` (README + KB + requirement + technical + user-guide). File di `_meta/sot/` hanya bahan pra-split — jangan treat sebagai layer QA / Help Center / MenuDoc.

## Inventory (2026-08-12)

Disalin dari `~/Downloads` (file chat lama yang belum masuk repo). Fiscal Period sudah ada sebelumnya.

| File SOT | Slug menu | Docs 5-file (manifest) |
|----------|-----------|------------------------|
| `accounting-fiscal-period-source-of-truth.md` | accounting-fiscal-period | 4/4 review |
| `accounting-company-detail-bank-source-of-truth.md` | accounting-company-detail-bank | 4/4 review |
| `accounting-default-vat-source-of-truth.md` | accounting-default-vat | 4/4 review |
| `accounting-product-coa-group-source-of-truth.md` | accounting-product-coa-group | 4/4 review |
| `accounting-tax-source-of-truth.md` | accounting-tax | 4/4 review |
| `accounting-chart-of-account-source-of-truth.md` | accounting-chart-of-account | 4/4 review |
| `accounting-stock-remapping-source-of-truth.md` | accounting-stock-remapping | 4/4 review |
| `accounting-credit-note-source-of-truth.md` | accounting-credit-note | 4/4 review |
| `omni-shipping-service-source-of-truth.md` | omni-shipping-service | 4/4 review |
| `omni-shipping-service-platform-source-of-truth.md` | omni-shipping-service-platform | 4/4 review |
| `sales-order-general-source-of-truth.md` | sales-order-general | 4/4 review |
| `accounting-supplier-invoice-source-of-truth.md` | accounting-supplier-invoice | 4 file **draft** (golden ref, isi lengkap) |
| `gate-user-source-of-truth.md` | gate-user | 3 review, UG menyusul |
| `omni-sales-platform-*-source-of-truth.md` (6 part) | omni-sales-platform | 3 review, UG menyusul |
| `journal-source-of-truth.md` | journal | draft |
| `omni-unassign-wave-source-of-truth.md` | omni-unassign-wave | 4 file draft |
| `omni-waves-management-source-of-truth.md` | omni-waves-management | 4 file draft |
| `omni-process-summary-source-of-truth.md` | omni-process-summary | 4 file draft |
| `accounting-profit-loss-v1-source-of-truth.md` | accounting-profit-loss-v1 | 4 file draft |
| `supplychain-product-mutation-stock-source-of-truth.md` | supplychain-product-mutation-stock | draft, UG pending |

**Belum ada SOT di folder ini** untuk menu lain di manifest (termasuk Instant Settlement, Assembly, Unit, Role, Failed Ship, Debit Note, P/L, dll.).
