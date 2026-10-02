# Random SKU — Dokumentasi

Konsep **Random SKU** — virtual SKU (non-stockable) untuk auto-pick sibling variant saat fulfillment.

> **Cross-menu concept** — dipakai di Variant, System Product, Bundle, BOM, Sales Platform Binding, Waves.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Dev | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Version:** 1.1 · **Last updated:** 2026-10-02  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-10-02 | Retail Price untuk breakdown bundle (bukan Benchmark); before/after processing — ETM-16216 / ETM-16212 |
| 1.0 | 2026-07-09 | Initial from legacy |

## Legacy source

- [_legacy/old_random-sku-requirement.md](../_legacy/old_random-sku-requirement.md) — merged ke KB + requirement

## Used in (ringkas)

| Menu | Behavior |
|------|----------|
| Master Variant | Opsi `random` per variant type — **TO-BE:** skip inject jika create + Default ON + 1 opsi ([supplychain-variant](../supplychain-variant/)) |
| System Product (Variant) | SKU `-random` auto-generated; isi **Retail Price** |
| Bundle Product | Random di detail → pick stock tertinggi; pecah harga pakai **retail** random |
| BOM | ❌ Tidak diperbolehkan |
| Sales Platform Binding | ✅ Bisa di-bind |
| Send to Default Waves | Trigger utama auto-pick → ganti ke SKU asli |
