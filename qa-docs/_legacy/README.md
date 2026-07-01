# Legacy QA Documentation (Reference Only)

File di folder ini adalah **generasi lama** dokumentasi QA sebelum refactor ke struktur folder per-menu.

## Aturan

- **Jangan jadikan canonical source** — gunakan doc di `../{menu-slug}/`
- Konten relevan sudah (sebagian) di-merge ke `requirement.md` / `technical.md` / `knowledge-base.md`
- Tetap disimpan untuk audit history dan referensi detail yang belum di-merge

## Mapping file → menu

| File legacy | Menu canonical |
|-------------|----------------|
| `old_platform-product-binding-glossary.md` | [manage-platform-product](../manage-platform-product/) — merged requirement §12 |
| `old_platform-product-sync-newrequirement.md` | [manage-platform-product](../manage-platform-product/) — merged technical §8.2 |
| `old_bulk-binding-requirement.md` | [manage-platform-product](../manage-platform-product/) — merged requirement §13 |
| `old_general-ledger-requirement.md` | [general-ledger](../general-ledger/) |
| `old_Journal-Requirement.md` | [journal](../journal/) |
| `old_sales-order-general-requirement.md` | [sales-order-general](../sales-order-general/) |
| `old_sales-order-import-bulk-improvement.md` | [sales-order-general](../sales-order-general/) |
| `old_system-product-requirement.md` | [system-product](../system-product/) |
| `old_bill-of-material.md` | [bill-of-material](../bill-of-material/) — merged KB + requirement |
| `old_random-sku-requirement.md` | [random-sku](../random-sku/) — merged KB + requirement |

Index lengkap: [`_meta/manifest.yaml`](../_meta/manifest.yaml)
