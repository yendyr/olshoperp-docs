---
doc_type: capability-template
version: 0.2
last_updated: 2026-07-27
status: draft
---

# Template — Capability Lingo card

Copy ke `_meta/shared-capabilities/{slug}.md` atau `{menu}/capabilities/sf-….md`. Isi frontmatter + section; hapus baris panduan.

```yaml
---
doc_type: shared-capability   # atau menu-capability
id: SF-XX-00
also: []                      # sibling ID di file yang sama, opsional
title: Label UI
aliases: [sinonim, label lain]
scope: global                 # global | menu
menu: accounting-…            # wajib jika menu-capability
summary: >-
  Satu–dua kalimat definisi untuk API / katalog.
version: 0.1
last_updated: YYYY-MM-DD
status: draft
---
```

# {Title}

## Apa ini

Definisi singkat (1–3 kalimat). Bahasa operator. Label UI **tebal**.

## Kapan dipakai

- Use case 1
- Use case 2

atau tabel keputusan singkat.

## Cara pakai

1. Langkah dengan **Label UI**.
2. …
3. …

## Catatan

- Batasan penting (maks 5 bullet / tabel kecil).
- Dilarang: path class/API, field DB, kode GAP, rumus panjang.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| … | … | … |

*(Opsional. Pertimbangkan wajib jika qty, angka, partial, selisih, lifecycle.)*

## Lihat juga

- Sibling: `[Label](#sf-lingo:SF-XX-00)`
- Requirement / Feature Map (link relatif)
