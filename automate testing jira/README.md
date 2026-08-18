# Automate Testing Jira

Folder di **luar** `qa-docs/`. Tempat kerja QA untuk kartu Jira: dari test case sampai hasil testing.

`qa-docs/{menu}/test-cases/` tetap untuk TC menu (CRUD/regresi menu). Folder ini khusus **kartu Jira** (bug / improvement / change requirement) yang sedang diuji.

## Struktur

```
automate testing jira/
  README.md
  {JIRA-KEY}/
    README.md          ← ringkasan kartu + indeks TC & hasil
    card.md            ← Requirement Before / After dari kartu
    test-cases/        ← TC DRAFT untuk kartu ini
    results/           ← hasil run (PASS/FAIL, log, blocker)
```

Satu kartu Jira = satu folder `{JIRA-KEY}` (contoh: `ETM-8618`).

## Alur

1. Buat folder `{JIRA-KEY}/` + `card.md` dari isi kartu.
2. Tulis TC di `{JIRA-KEY}/test-cases/`.
3. Jalankan tes (manual atau Playwright).
4. Isi `test_result` di file TC **dan** tulis ringkasan di `{JIRA-KEY}/results/`.

## Kartu saat ini

| Key | Menu | Judul | Status TC |
|-----|------|--------|-----------|
| [ETM-8618](./ETM-8618/) | Warehouse Structure | Prefix Warehouse Bisa Berbeda di Setiap Level | 4 TC, automation `@TC-ETM-8618` |
| [ETM-15512](./ETM-15512/) | System Product | Default variant create/import + expand leftover | 7 TC, draft `@TC-ETM-15512` |
| [ETM-15525](./ETM-15525/) | Assembly | Max Assembly Qty & QTY vs unit BOX | 3 TC, automation `@TC-ETM-15525` |
| [ETM-15526](./ETM-15526/) | Stock Remapping | Remapped To duplicate / Origin Stock ID / Unit Class — retest TC-13..15 | 3 TC FAILED retest `@TC-13` `@TC-14` `@TC-15` |
