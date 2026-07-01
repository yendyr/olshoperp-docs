# KB Store Monitor — Dokumentasi

Menu **KB Store Monitor** di grup **Documentation Assistant** — pantau status vector store Gemini, cakupan corpus, dan trigger indexing dokumentasi.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, DevOps | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- **FE:** `/ai/kb-store-monitor` (`ai_kb_store_monitor_index`)
- **BE API:** `GET/POST /api/v1/ai/kb-store-monitor/*`
- **Menu Gate:** `ai/kb-store-monitor` (`menu_class`: `KbStoreMonitor`)

## Menu terkait

- [AI Assistant](../ai-kb-assistant/README.md) — chat FAB untuk end user
