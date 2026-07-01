---
doc_type: requirement
menu: ai-kb-assistant
menu_name: "AI Assistant"
version: 1.0
last_updated: 2026-06-20
owner: QA - Yemima
status: draft
---

# AI Assistant — Requirement Documentation

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-20 | QA - Yemima | Initial AS-IS setelah integrasi Modules/AI ke OlshopERP |

## 1. Ringkasan Eksekutif

FAB chat dokumentasi terintegrasi dengan Gate menu privilege, Sanctum auth, dan Gemini File Search. Akses FAB dikontrol via Role Privilege menu **AI Assistant** + flag login `can_use_kb_assistant`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan privilege View pada menu AI Assistant melihat FAB | Login → FAB visible | FAB |
| A-02 | User tanpa privilege tidak melihat FAB | `can_use_kb_assistant === false` | FAB |
| A-03 | Master user selalu bisa pakai assistant | `is_master_user = 1` | Auth |
| A-04 | Kirim pesan memuat jawaban dari indexed docs | POST message → 200 + assistant content | Chat |
| A-05 | Rate limit 1 pesan/menit (default) | POST kedua < 60s → 429 | Rate limit |
| A-06 | Clear conversation menghapus thread user | POST clear → cleared true | Chat |
| A-07 | FAB tidak overlap theme picker | Visual QA pojok kanan bawah | UI |

## 3. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | `message` required, max 4000 | POST `/kb-assistant/messages` | 422 validation |
| V-02 | User harus `can('use', KbAssistant)` | Semua endpoint assistant | 403 |
| V-03 | Message rate limit per user | POST message | 429 + `message_rate` |
| V-04 | Token budget per menit | POST message (middleware) | 429 token limit message |
| V-05 | Provider gemini wajib `GEMINI_API_KEY` | Indexing / prompt | 500/422 config message |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | FAB open panel | Klik FAB | Panel chat terbuka, load conversation |
| F-02 | Send message | Send / Enter | User bubble + assistant reply |
| F-03 | Clear | Tombol Clear | Messages kosong |
| F-04 | Login flag | POST login sukses | `user.can_use_kb_assistant` boolean |
| F-05 | Retention | Background prune | Conversation > 7 hari dihapus |

## 5. Permission & Dependencies

| Item | Nilai |
|------|-------|
| Gate group | `Documentation Assistant` |
| Menu text | `AI Assistant` |
| `menu_class` | `Modules\AI\Entities\KbAssistant` |
| Policy | `KbAssistantPolicy` extends `MainPolicy`; `use()` → `view()` |
| FAB visibility (FE) | `localStorage.auth.user.can_use_kb_assistant` |
| Fallback role names | `AI_KB_ASSISTANT_ROLE_NAMES` (env, comma-separated) |
| Provider | `laravel/ai` + Gemini |
| Corpus | Harus sudah di-index (lihat KB Store Monitor) |

## 6. QA Test Notes

1. Set Role Privilege View pada AI Assistant untuk role test → logout/login → FAB muncul
2. Hapus privilege → re-login → FAB hilang
3. Kirim pertanyaan tentang menu yang ada di `docs/qa-docs/` → jawaban grounded
4. Kirim 2 pesan cepat → pesan kedua 429
5. Cek network: `GET /api/v1/ai/kb-assistant/conversation` → 200 untuk user berhak

## 7. Known Gaps / Open Questions

- UI monitor lengkap (dari SmartAircraft) belum di-port ke FE; hanya halaman minimal + FAB
- Role name fallback (`KB Assistant User`, dll.) masih ada selain menu privilege — bisa disederhanakan ke menu-only di masa depan

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| KB Store Monitor | [../kb-store-monitor/requirement.md](../kb-store-monitor/requirement.md) |
