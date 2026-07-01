---
doc_type: requirement
menu: kb-store-monitor
menu_name: "KB Store Monitor"
version: 1.0
last_updated: 2026-06-20
owner: QA - Yemima
status: draft
---

# KB Store Monitor — Requirement Documentation

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-20 | QA - Yemima | Initial AS-IS integrasi OlshopERP |

## 1. Ringkasan Eksekutif

Halaman admin untuk snapshot vector store Gemini, coverage corpus, dan trigger indexing background. Terdaftar sebagai child menu di grup Documentation Assistant.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Menu muncul di sidebar dengan privilege View | Sidebar API + Role Privilege | Menu |
| A-02 | Halaman `/ai/kb-store-monitor` load tanpa router error | Klik menu → page render | Routing |
| A-03 | Snapshot menampilkan store ID, status, corpus/indexed counts | GET monitor API | Monitor |
| A-04 | Re-index queue job pada queue `REDIS_QUEUE` | POST index → jobs > 0; worker olshoperp_* | Indexing |
| A-05 | Store ID tersimpan di DB setelah index pertama | `ai_kb_assistant_settings.vector_store_id` | Persistence |
| A-06 | 409 jika indexing sedang berjalan | POST index saat queue pending | Guard |

## 3. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | `view` policy via MainPolicy | GET monitor | 403 |
| V-02 | `triggerIndexing` policy | POST index | 403 |
| V-03 | GEMINI_API_KEY wajib saat provider gemini | Index trigger / artisan | Config error message |
| V-04 | Tidak index jika tidak ada gap | POST index, corpus sudah lengkap | 422 |
| V-05 | Tidak double-trigger saat queue pending | POST index | 409 already in progress |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Refresh snapshot | Tombol Refresh | Reload GET monitor |
| F-02 | Re-index corpus | Tombol Re-index | POST index, queue chunk jobs |
| F-03 | Initial indexing | Store belum ada | Buat store + queue jobs |
| F-04 | Store replace | Store inaccessible | Store baru + re-index |

## 5. Permission & Dependencies

| Item | Nilai |
|------|-------|
| Gate group | `Documentation Assistant` |
| Menu link | `ai/kb-store-monitor` |
| `menu_route` | `ai.kb_store_monitor.index` → FE `ai_kb_store_monitor_index` |
| `menu_class` | `Modules\AI\Entities\KbStoreMonitor` |
| Policy | `KbStoreMonitorPolicy` extends `MainPolicy` |
| Queue | `REDIS_QUEUE` (`olshoperp_staging` / `olshoperp_production`; override `AI_KB_QUEUE`) |
| Module | `Modules/AI` enabled di `modules_statuses.json` |
| Package | `laravel/ai` |

## 6. QA Test Notes

1. Seed menu + roles → assign privilege → menu sidebar muncul
2. Set `GEMINI_API_KEY` → `config:clear` → re-index → indexed count naik
3. Klik menu → tidak error vue-router (name `ai_kb_store_monitor_index`)
4. Saat job pending di queue default → re-index return 409
5. Setelah deploy, clear queue `ai` lama jika ada job nyangkut dari versi sebelumnya

## 7. Known Gaps / Open Questions

- FE monitor masih versi minimal (belum port UI lengkap dari `Modules/AI/resources/js`)
- Pesan sukses trigger masih menyebut "AI queue" di beberapa response backend (copy lama)

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| AI Assistant | [../ai-kb-assistant/requirement.md](../ai-kb-assistant/requirement.md) |
