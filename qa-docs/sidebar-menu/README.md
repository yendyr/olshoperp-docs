# Sidebar Menu (Gate) — QA Documentation

Entry point untuk dokumentasi sidebar navigation OlshopERP.

| Layer | File | Status |
|-------|------|--------|
| Knowledge base | [knowledge-base.md](./knowledge-base.md) | pending |
| Requirement | [requirement.md](./requirement.md) | pending |
| **Technical (agents)** | [technical.md](./technical.md) | **final** |

## Ringkas

Sidebar Vue memuat tree menu dari `GET /api/sidebar-menu`. Bug recurring: API sukses tetapi sidebar kosong karena payload hanya `{ transaction_limit: null }` — lihat **technical.md** sebelum mengubah Gate cache, policy, atau FE parser.

## Agent checklist (WAJIB)

Sebelum PR yang menyentuh file di `manifest.yaml` → `sidebar-menu` → `code_globs`:

1. Baca [technical.md](./technical.md) bagian **Regression guardrails**
2. Jangan cache array kosong + `transaction_limit` sebagai satu payload menu
3. Jangan cache `viewAny = false` tanpa invalidation
4. FE wajib pakai `parseSidebarMenuResponse()` — jangan simpan `data.data` mentah ke `localStorage.sidebar`
5. Setelah ubah privilege role: panggil `SidebarMenuCache::invalidateForRole()`
