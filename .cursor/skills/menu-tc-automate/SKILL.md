---
name: menu-tc-automate
description: >-
  Inventory fitur menu OlshopERP, buat TC di Jira (skill authoring), buat helper/spec
  Playwright, jalankan di staging (lumicharmsid). Pakai saat user sebut nama
  menu saja (mis. "Asset Category", "Asset List"), atau minta buat TC / automate
  menu master/transaksi QA.
---

# Menu → TC → Automate (OlshopERP QA)

## Prompt pendek (user)

```
{Nama Menu}
```

atau:

```
menu: {Nama Menu}
```

Artinya: **inventory fitur → buat TC di Jira → automate → run → laporkan PASS/FAIL di Jira**. Jangan minta ulang perintah panjang.

## Defaults

| Item | Nilai |
|------|--------|
| Company | `lumicharmsid` (153) |
| Login | `playwright@gmail.com` / `12345678` |
| Description field | `automation playwright` |
| Staging | `https://staging.olshoperp.com` |
| Repo kerja | `olshoperp-docs` |
| FE sumber UI | `olshoperp-frontend` |
| BE sumber validasi | `olshoperp` |

## Workflow (wajib berurutan)

1. **Resolve menu** dari `qa-docs/_meta/manifest.yaml` (slug, route, modul).
2. **Inventory fitur** dari FE (`Datalist.vue` + `Form.vue`) + BE (Controller/Request/Entity):
   - Datalist: Create, search/filter, kolom, bulk delete, show deleted, row edit
   - Form: field wajib/opsional, dropdown, switch, Save All / Save & Next, Audit Log, status flow
3. **Buat TC di Jira** — skill `olshoperp-testcase-authoring` (bukan file `TC-*.md`). Satu card = satu aksi utama (VIEW / CREATE / UPDATE / SEARCH / DELETE / …) + `test_type` sesuai skill. Jangan update `test-cases/README.md` / `knowledge-base.md` untuk TC baru.
4. **Mapping step → POM** (tabel) sebelum coding — rules `14-playwright-e2e.mdc`.
5. **Automate**:
   - `tests/pom-registry/{menu}.yaml`
   - `tests/helpers/{menu}.ts` (POM)
   - `tests/specs/{menu}/{menu}-crud.spec.ts` (serial; tag `@ETM-xxxxx` atau `@TC-…` selaras key/kode di Jira)
6. **Preflight sekali** lalu **run scoped** (bukan full suite):
   ```powershell
   npx playwright test tests/specs/{menu}/{menu}-crud.spec.ts
   ```
7. **Lapor** PASS/FAIL di **Jira**: card TC → Actual Result + Test Result → Done (skill `olshoperp-card-testing`). Jangan tulis `test_result` / `last_execution` ke file TC arsip.
8. **Jangan commit** kecuali user minta.

## Cakupan TC (default master CRUD)

Minimal yang ada di UI:

| TC | Fokus |
|----|--------|
| `…-001` | VIEW datalist shell + Create |
| `…-002` | CREATE field wajib + description automation |
| `…-003` | UPDATE field inti + Save All |
| `…-004` | SEARCH di datalist |
| `…-005+` | Fitur ekstra menu (soft delete, show deleted, audit log, approve, import, …) |

Jangan invent fitur yang tidak ada di FE/BE.

## Pola kode

- Session: `prepareSession(page, { companyCode: 'lumicharmsid', targetPath })`
- Create button mode: cek FE (`link` vs `button`)
- Accordion: `expandAccordion` nama section dari FE
- Description: selalu `automation playwright`
- Retry: maks 2× per masalah; lalu STOP + blocker

## Contoh

User: `Asset Category` → kerjakan penuh untuk menu itu.  
User: `Asset List` → ulangi workflow yang sama untuk Asset List (jangan ulang tanya cakupan).
