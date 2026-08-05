# Omni Channel Settings — Dokumentasi

Menu **Omni Channel Settings** (Omni Channel) — konfigurasi default warehouse proses/stock, Order Sync Start Date, dan durasi auto approve per company (delay auto approve bersifat global di AS-IS).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator / Admin | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**PM source:** Omni Channel Settings Source of Truth **v1.0** (31 Juli 2026)  
**3 layer + UG:** v1.0 · `source_version` 1.0  
**Maintenance owner:** QA — Yemima

**UI route:** `/omni/global-settings`

**Help Center overview:** [ID](../_meta/docs-hub/menus/omni-global-settings/overview.id.md) · [EN](../_meta/docs-hub/menus/omni-global-settings/overview.en.md) (authored v1.0)

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | Omni Channel |
| UI | `/omni/global-settings` |
| API | `omnichannel/default-warehouse`, `omnichannel/settings`, `omnichannel/order-automation-setting` |

## Related menus

- [Store Binding](../omni-store-binding/README.md) — konsumen default building process/stock  
- Sales Order Platform / General — sync window & auto approve  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-31 | 1.0 | Docs lengkap 5-file dari SoT v1.0 + verifikasi codebase; Gap Registry `GAP-OCS-01..06`; koreksi filter select2 & side-effect wave (tanpa ATS di store settings) |
| 2026-07-31 | HC 1.0 | Help Center overview ID + EN dari file authored user (Omni Channel Settings) |
