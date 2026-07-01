# Random SKU — Dokumentasi

Konsep **Random SKU** — virtual SKU (non-stockable) untuk auto-pick sibling variant saat fulfillment.

> **Cross-menu concept** — dipakai di Variant, System Product, Bundle, BOM, Sales Platform Binding, Waves.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Dev | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Legacy source

- [_legacy/old_random-sku-requirement.md](../_legacy/old_random-sku-requirement.md) — merged ke KB + requirement

## Used in (ringkas)

| Menu | Behavior |
|------|----------|
| Master Variant | Opsi `random` per variant type |
| System Product (Variant) | SKU `-random` auto-generated |
| Bundle Product | Random di detail → pick stock tertinggi |
| BOM | ❌ Tidak diperbolehkan |
| Sales Platform Binding | ✅ Bisa di-bind |
| Send to Default Waves | Trigger utama auto-pick |
