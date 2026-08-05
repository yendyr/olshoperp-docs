# Platform Shipping Service — Dokumentasi

Menu **Platform Shipping Service** (Omni Channel) — katalog jasa kirim marketplace hasil Bulk Sync; binding ke Master Shipping Service sebelum Sales Order platform diproses.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Omni | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**PM source:** Platform Shipping Service Source of Truth **v2.0** (3 Agustus 2026)  
**3 layer version:** 2.0 · **User-guide:** 1.0 (`source_version` 2.0)  
**Maintenance owner:** QA — Yemima

**UI route:** `/omni/shipping-service-platform`

**Help Center overview:** [ID](../_meta/docs-hub/menus/omni-shipping-service-platform/overview.id.md) · [EN](../_meta/docs-hub/menus/omni-shipping-service-platform/overview.en.md) (authored v1.0)

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | Omni Channel |
| UI | `/omni/shipping-service-platform` |
| API | `omnichannel/shipping-service-platform` |
| Sync aktif | Shopee, TikTok Shop |

## Related menus

- [Master Shipping Service](../omni-shipping-service/README.md) — target binding  
- [Store Binding](../omni-store-binding/README.md) — otorisasi store / owned_by  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-03 | 2.0 | Docs 5-file dari SoT v2.0 + verifikasi codebase; Gap `GAP-PSP-01..07`; sync Shopee/TikTok only |
| 2026-08-04 | HC 1.0 | Help Center overview ID + EN dari file authored user (Platform Shipping Service) |
