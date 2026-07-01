---
doc_type: technical
menu: kb-store-monitor
menu_name: "KB Store Monitor"
version: 1.0
last_updated: 2026-06-20
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../ai-kb-assistant/technical.md
---

# KB Store Monitor — Technical Documentation

## 1. Architecture Overview

```
[Vue Index.vue] ──► GET/POST /api/v1/ai/kb-store-monitor/*
                              │
                    KbStoreMonitorPolicy (MainPolicy)
                              │
         KbStoreMonitorService / KbCorpusIndexTriggerService
                              │
         Queue: default ──► UploadKbCorpusChunkJob (per chunk)
                              │
         Gemini File Search API + ai_kb_assistant_settings (store ID)
```

## 2. Frontend File Map

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/AI/KbStoreMonitor/Index.vue` | Halaman monitor (minimal) |
| `olshoperp-frontend/src/lib/kbAssistantApi.ts` | `fetchKbStoreMonitorSnapshot`, `triggerKbCorpusIndexing` |
| `olshoperp-frontend/src/router/index.ts` | Route `/ai/kb-store-monitor`, name `ai_kb_store_monitor_index` |
| `olshoperp-frontend/src/layouts/project/SideMenu/side-menu.ts` | `linkTo` fallback `path` dari sidebar API |

**Sidebar navigation:** `menu_route` `ai.kb_store_monitor.index` → `pageName` `ai_kb_store_monitor_index`; API juga kirim `path: /ai/kb-store-monitor`

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/AI/app/Http/Controllers/Api/V1/KbStoreMonitorController.php` | show, selectStore, triggerIndexing |
| `Modules/AI/app/Services/KbStoreMonitorService.php` | Snapshot + coverage |
| `Modules/AI/app/Services/KbCorpusIndexTriggerService.php` | Dispatch indexing, 409 guard |
| `Modules/AI/app/Services/KbCorpusIndexer.php` | Chunk + queue jobs |
| `Modules/AI/app/Policies/KbStoreMonitorPolicy.php` | view, triggerIndexing, selectStore |
| `Modules/AI/app/Entities/KbStoreMonitor.php` | Marker entity |
| `Modules/AI/app/Jobs/UploadKbCorpusChunkJob.php` | Upload chunk ke Gemini |
| `Modules/AI/app/Jobs/DispatchKbCorpusIndexJob.php` | Orchestrator job |
| `Modules/AI/app/Console/Commands/IndexKbCorpusCommand.php` | `ai:index-kb` |
| `Modules/AI/app/Support/KbCorpusPaths.php` | Glob corpus OlshopERP |
| `Modules/AI/app/Support/KbCorpusIndexProgress.php` | Progress + `queuePendingCount()` |
| `Modules/AI/app/Models/KbAssistantSetting.php` | Persist vector_store_id |
| `Modules/Gate/Database/Seeders/ModuleMenu/AIMenuSeeder.php` | Register menus |
| `Modules/AI/database/migrations/2026_06_20_100000_seed_ai_module_menus.php` | Migration menu rows |

## 4. API Routes

Prefix: `/api/v1/ai/kb-store-monitor`

| Method | Path | Policy | Description |
|--------|------|--------|-------------|
| GET | `/` | view | Snapshot store + coverage |
| POST | `/store` | selectStore | Pilih store ID manual |
| POST | `/index` | triggerIndexing | Queue gap indexing |

## 5. Database Schema

**`ai_kb_assistant_settings`**

| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| vector_store_id | varchar(191) nullable | Gemini store ID aktif |
| status | tinyint | |
| timestamps, soft deletes | | |

Migration: `2026_06_17_120000_create_ai_kb_assistant_settings_table.php`

**Gate menus** (seed):

| menu_text | menu_link | menu_class | parent |
|-----------|-----------|------------|--------|
| AI Assistant | `#` | `KbAssistant` | — |
| KB Store Monitor | `ai/kb-store-monitor` | `KbStoreMonitor` | AI Assistant |

## 6. Corpus Configuration

File: `Modules/AI/config/kb-corpus.php`

| Tier | Globs |
|------|-------|
| Primary | `docs/qa-docs/**/*.md`, `docs/api/**/*.md`, `Modules/*/docs/**/*.md`, `AGENTS.md` |
| Secondary | `.cursor/rules/*.mdc`, `docs/db-schema/**/*.md` |
| Exclude | `_legacy`, `_meta`, `draft.md`, README root |

Index command: `php artisan ai:index-kb` (~742 files setelah `config:clear`)

## 7. Queue & Workers

| Setting | Value |
|---------|-------|
| `AI_KB_QUEUE` env | default: `REDIS_QUEUE` (`olshoperp_{environment}`) |
| `KbAssistantConfig::queue()` | Single source untuk jobs + pending count |
| Jobs | `UploadKbCorpusChunkJob`, `DispatchKbCorpusIndexJob` |

**Staging note:** Versi awal memakai queue `ai` tanpa worker → job nyangkut → 409 "already in progress". Clear: `php artisan queue:clear redis --queue=ai`

## 8. Environment & Deploy Checklist

```bash
# Enable module + deps
composer require laravel/ai:^0.8
php artisan migrate
php artisan db:seed --class="Modules\Gate\Database\Seeders\ModuleMenu\AIMenuSeeder"
php artisan db:seed --class="Modules\AI\Database\Seeders\AIDatabaseSeeder"

# .env
GEMINI_API_KEY=...
AI_KB_PROVIDER=gemini

php artisan config:clear && php artisan cache:clear && php artisan queue:restart
php artisan ai:index-kb   # or --sync

# FE
cd olshoperp-frontend && npm run build
```

**Verifikasi config:**

```bash
php artisan tinker --execute 'dump(config("ai.providers.gemini.key")); dump(config("ai.kb_assistant.queue"));'
```

Keduanya harus non-null / `default`.

## 9. Roles (AIDatabaseSeeder)

| role_name | Purpose |
|-----------|---------|
| KB Assistant User | Fallback chat access |
| KB Admin | Fallback monitor access |

Primary access path: **Role Privilege** pada menu Gate (bukan hanya role name).

## 10. Integrasi Session (issues & fixes)

| Issue | Fix |
|-------|-----|
| Module tidak di sidebar | AIMenuSeeder + migration; enable module |
| Login 500 TypeError User | `Gate\Entities\User` type hints |
| `config('ai.providers.gemini.key')` null | `config:clear`; ensure laravel/ai loaded |
| Vue router error menu | FE route `ai_kb_store_monitor_index` + rebuild |
| FAB tidak muncul | Menu privilege AI Assistant + re-login |
| FAB overlap theme | `bottom-18` positioning |
| Sidebar kosong | Cache `gate-view-any` per role_id |
| SQL column `view` | Removed invalid `gate_role_menus.view` filter |
| Send message TypeError | RateLimit/TokenBudget User type fix |
| Queue `default`/`ai` stuck | Default queue = `REDIS_QUEUE`; clear queue lama |

## 11. Related docs

- [docs/db-schema/gate/gate_menus.md](../../db-schema/gate/gate_menus.md)
- [Modules/AI/docs/kb-assistant.md](../../../Modules/AI/docs/kb-assistant.md) (legacy dev reference)
