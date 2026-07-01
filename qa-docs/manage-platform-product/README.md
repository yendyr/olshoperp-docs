# Manage Platform Product — Dokumentasi

Menu **Manage Platform Product** (OmniChannel) — sync, binding, dan push stock produk marketplace.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, ops | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Support, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Maintenance owner:** QA — Yemima

## Legacy sources (reference only)

Konten sudah di-merge sebagian ke doc canonical di atas. File asli:

- [_legacy/old_platform-product-binding-glossary.md](../_legacy/old_platform-product-binding-glossary.md) — merged ke [requirement.md](./requirement.md) §12
- [_legacy/old_platform-product-sync-newrequirement.md](../_legacy/old_platform-product-sync-newrequirement.md) — merged ke [technical.md](./technical.md) §8.2
- [_legacy/old_bulk-binding-requirement.md](../_legacy/old_bulk-binding-requirement.md) — merged ke [requirement.md](./requirement.md) §13

## Route & code

- FE: `/omni/platform-product` → `src/pages/Omni/ProductPlatform/`
- BE: `Modules/OmniChannel/Http/Controllers/ProductController.php`

## Planned

- In-app Help modal (KB) di `DataList.vue`
- Kolom **Product Onboarding Status** di Store DataList (lihat [omni-store-binding](../omni-store-binding/README.md))
