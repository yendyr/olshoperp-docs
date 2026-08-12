# Gemini content-structure briefs

Draft brief Part 0/1/2 per menu — digenerate Cursor dari `docs/qa-docs/{menu-slug}/` untuk di-paste ke Gemini (rule `.cursor/rules/14-gemini-brief-help-center.mdc`).

## Naming

`{menu-slug}-content-structure-gemini-brief.md`

Contoh: `gate-role-content-structure-gemini-brief.md`

## Alur

1. Yemima minta **brief gemini** / **buat docs untuk brief gemini** (satu menu)
2. Agent generate brief ke folder ini (baca qa-docs; jangan ubah folder menu / overview)
3. Paste brief ke Gemini → dapat dokumen Help Center final
4. Sesi lain: keyword **update help center** + file final → overview `authored` (`11-docs-page-help-center.mdc`)

## Bukan

- Bukan layer QA canonical (`docs/qa-docs/{menu-slug}/`)
- Bukan overview Help Center (`_meta/docs-hub/menus/`)
- Bukan SOT (`_meta/sot/`)
