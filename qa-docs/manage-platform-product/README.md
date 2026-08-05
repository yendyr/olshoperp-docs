# Manage Platform Product — Dokumentasi

Menu **Manage Platform Product** (OmniChannel) — sync, binding, dan push stock produk marketplace.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, ops | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Support, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Feature Map | [feature-map.md](./feature-map.md) | Ops, QA, Docs Page | review |
| Capability Lingo | [capabilities/](./capabilities/) | Modal in-app / Docs Page | review (7 cards) |

**PM source / 3 layer version:** requirement & technical 1.2 · knowledge-base 1.1 · **User-guide:** 1.0 (`source_version` 1.2) · **Feature Map:** 1.0  
**Maintenance owner:** QA — Yemima

**UI route:** `/omni/platform-product`

**Help Center overview:** [ID](../_meta/docs-hub/menus/manage-platform-product/overview.id.md) · [EN](../_meta/docs-hub/menus/manage-platform-product/overview.en.md) (authored v1.0)

## Legacy sources (reference only)

Konten sudah di-merge sebagian ke doc canonical di atas. File asli:

- [_legacy/old_platform-product-binding-glossary.md](../_legacy/old_platform-product-binding-glossary.md) — merged ke [requirement.md](./requirement.md) §12
- [_legacy/old_platform-product-sync-newrequirement.md](../_legacy/old_platform-product-sync-newrequirement.md) — merged ke [technical.md](./technical.md) §8.2
- [_legacy/old_bulk-binding-requirement.md](../_legacy/old_bulk-binding-requirement.md) — merged ke [requirement.md](./requirement.md) §13

## Route & code

- FE: `/omni/platform-product` → `src/pages/Omni/ProductPlatform/`
- BE: `Modules/OmniChannel/Http/Controllers/ProductController.php`

## Related menus

- [System Product](../system-product/README.md) — master SKU internal & ATS
- [Store Binding](../omni-store-binding/README.md) — authorize toko; Product Onboarding Status

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| FM 1.0 | 2026-07-31 | Feature Map + 7 Capability Lingo cards (Filter Store, Pull, Push, Manual/Auto/Bulk Binding, Stock Management) |
| UG 1.0 | 2026-07-31 | User-guide baru (8 seksi) dari 3 layer `review`; README + manifest sync |
| HC 1.0 | 2026-07-31 | Help Center overview ID + EN dari file authored user |
| 1.2 | 2026-06-22 | Onboarding sequencing sync produk; update entry point store bind |
