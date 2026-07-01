# AI Assistant (Documentation Chat) — Dokumentasi

Menu **AI Assistant** di grup **Documentation Assistant** — chat floating (FAB) untuk menjawab pertanyaan dari dokumentasi QA/API yang sudah di-index.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- **UI:** FAB global (bukan halaman menu terpisah); panel chat via `KbAssistantWidget`
- **FE route:** tidak ada (FAB di semua halaman layout SideMenu)
- **BE API:** `GET/POST /api/v1/ai/kb-assistant/*`
- **Menu Gate:** grup `Documentation Assistant` → `AI Assistant` (`menu_class`: `KbAssistant`)

## Menu terkait

- [KB Store Monitor](../kb-store-monitor/README.md) — monitoring & indexing corpus

## Legacy / suplemen

- [Modules/AI/docs/kb-assistant.md](../../../Modules/AI/docs/kb-assistant.md) — referensi developer (SmartAircraft port notes)
