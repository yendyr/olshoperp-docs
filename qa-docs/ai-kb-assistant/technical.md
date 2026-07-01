---
doc_type: technical
menu: ai-kb-assistant
menu_name: "AI Assistant"
version: 1.0
last_updated: 2026-06-20
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../kb-store-monitor/technical.md
---

# AI Assistant — Technical Documentation

## 1. Architecture Overview

```
[Vue FAB] ──Bearer──► /api/v1/ai/kb-assistant/*
                              │
                    auth:sanctum + auth_verified
                              │
              KbAssistantPolicy::use() (MainPolicy → gate_role_menus)
                              │
              KbAssistantAgent (laravel/ai) + Gemini File Search store
                              │
              Indexed corpus (docs/qa-docs, docs/api, …)
```

- **Tidak ada halaman Vue route** — FAB global di layout SideMenu
- **Auth user type:** `Modules\Gate\Entities\User` (bukan `App\Models\User`)
- **Login flag:** `AuthController` set `can_use_kb_assistant` via `KbAssistantAccess::canUse()`

## 2. Frontend File Map

| File | Role |
|------|------|
| `olshoperp-frontend/src/components/project/KbAssistant/KbAssistantWidget.vue` | FAB + chat panel |
| `olshoperp-frontend/src/composables/useKbAssistant.ts` | State chat, rate limit UI |
| `olshoperp-frontend/src/lib/kbAssistantApi.ts` | API client |
| `olshoperp-frontend/src/layouts/project/SideMenu/SideMenu.vue` | Mount widget |

**FAB positioning:** `bottom-18 right-5` (di atas MainColorSwitcher theme bar)

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/AI/app/Http/Controllers/Api/V1/KbAssistantController.php` | conversation, messages, clear |
| `Modules/AI/app/Http/Requests/KbAssistantMessageRequest.php` | Validasi message + authorize |
| `Modules/AI/app/Http/Middleware/EnforceKbAssistantMessageRateLimit.php` | 1 msg/min default |
| `Modules/AI/app/Http/Middleware/EnforceKbAssistantTokenBudget.php` | Token budget |
| `Modules/AI/app/Policies/KbAssistantPolicy.php` | `use()` → `view()` |
| `Modules/AI/app/Entities/KbAssistant.php` | Marker entity untuk menu_class / policy |
| `Modules/AI/app/Support/KbAssistantAccess.php` | `canUse()` — menu privilege + role fallback |
| `Modules/AI/app/Ai/Agents/KbAssistantAgent.php` | Laravel AI agent |
| `Modules/AI/app/Services/KbAssistantConversationService.php` | Persist conversation |
| `Modules/AI/app/Services/KbAssistantMessageRateLimit.php` | Rate limit cache |
| `Modules/AI/app/Services/KbAssistantTokenBudget.php` | Token budget cache |
| `app/Http/Controllers/Auth/AuthController.php` | Set `can_use_kb_assistant` on login |

## 4. API Routes

Prefix: `/api/v1/ai/kb-assistant` (middleware: `auth:sanctum`, `auth_verified`)

| Method | Path | Action |
|--------|------|--------|
| GET | `conversation` | Load thread + message_rate |
| POST | `messages` | Send message (+ rate/token middleware) |
| POST | `conversation/clear` | Clear user thread |

## 5. Auth & Permission Flow

1. **Menu seed:** `AIMenuSeeder` — parent `AI Assistant` dengan `menu_class = KbAssistant::class`
2. **Role Privilege:** `gate_role_menus` row untuk menu tersebut → `MainPolicy::viewAny/view` true
3. **Login:** `KbAssistantAccess::canUse($user, $role_id)`:
   - master user → true
   - `hasMenuPermission(KbAssistant::class)` → cek `gate_role_menus` + `gate_menus.menu_class`
   - fallback `allowed_role_names` dari env
4. **API:** `$this->authorize('use', KbAssistant::class)` → policy `use()` → `view()`
5. **Frontend:** `Boolean(auth.user.can_use_kb_assistant)` dari localStorage

## 6. Environment

| Variable | Default | Notes |
|----------|---------|-------|
| `GEMINI_API_KEY` | — | Wajib; dibaca `config('ai.providers.gemini.key')` via laravel/ai |
| `AI_KB_PROVIDER` | `gemini` | |
| `AI_KB_ASSISTANT_ROLE_NAMES` | `KB Assistant User,KB Admin,Super Admin` | Fallback jika tanpa menu privilege |
| `AI_KB_TOKEN_BUDGET_MESSAGES_PER_MINUTE` | `1` | Rate limit |

## 7. Jobs / Commands

| Command | Purpose |
|---------|---------|
| `php artisan ai:prune-kb-conversations` | Hapus conversation > retention_days |

Indexing: lihat [kb-store-monitor/technical.md](../kb-store-monitor/technical.md)

## 8. Integrasi Session (changelog implementasi)

| Tahap | Perubahan |
|-------|-----------|
| Module enable | `modules_statuses.json`, `AIServiceProvider`, routes |
| User type fix | `Gate\Entities\User` di Access, RateLimit, TokenBudget, Policy |
| Menu Gate | `AIMenuSeeder` + migration; group `Documentation Assistant` |
| Permission-based FAB | `KbAssistant` entity + `menu_class` pada parent menu |
| FE | Widget, API client, `can_use_kb_assistant` check |
| Sidebar cache | `gate-view-any` cache key scoped per `role_id` |

## 9. Related db-schema docs

- `docs/db-schema/gate/gate_menus.md`
- `docs/db-schema/gate/gate_role_menus.md`
- Tabel `ai_kb_assistant_settings` (vector store ID)
