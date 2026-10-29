# Referensi — olshoperp-qa-menu-ask

Dipakai bersama [SKILL.md](SKILL.md). Jangan diload sendirian.

## A. Resolve slug (urut)

1. `qa-docs/_meta/alias-index.yaml` — alias nama menu → slug  
2. `qa-docs/_meta/lookup.tsv` — keyword → slug (bila ada)  
3. Baru jika perlu: cuplikan `manifest.yaml` untuk **satu** slug (bukan file utuh)

Staging UI: `https://staging.olshoperp.com` + `menu_links` di entry manifest slug itu.

## B. Path per menu

```
qa-docs/{slug}/
  README.md
  knowledge-base.md
  requirement.md
  technical.md
  feature-map.md          # kadang ada; Expected/AC tambahan
  test-cases/             # ARSIP — bukan SoT TC baru (Jira)
```

## C. Kalau slug tidak ketemu

1. Coba keyword lain / modul (SupplyChain, Accounting, Omni, Gate, GS).  
2. Jawab: menu tidak terdaftar di docs / alias.  
3. Jangan mengarang nama menu.

## D. Rule requestable (hanya jika skill kurang)

| Butuh | Rule |
|-------|------|
| Matriks triage penuh (Playwright/Jira/DB/…) | `08-question-triage.mdc` |
| Struktur 121 menu / schema manifest | `04-qa-docs-index.mdc` |
| Format jawaban panjang / audience Dev | `06-answer-format.mdc` |
| Protokol menu + larangan legacy panjang | `09-menu-documentation.mdc` |
| Lintas modul E2E konsep | `11-cross-menu-navigation.mdc` |

Default Q&A menu: **cukup skill ini**.
