# Horizon Jobs — Dokumentasi QA (cross-menu)

Konsep **pipeline queue / Horizon** OlshopERP: job primer per menu vs job turunan (observer, stok, audit). Bukan satu menu UI — dipakai saat investigasi antrean, batch macet, atau beban worker.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Ops, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | pending |

## Pipelines terdokumentasi

| Pipeline | Menu terkait | File |
|----------|--------------|------|
| Skip Wave Process | [omni-skip-wave-process](../omni-skip-wave-process/) | [pipelines/skip-wave-process.md](./pipelines/skip-wave-process.md) |

**Version (3 layer):** 1.1 · **Last updated:** 2026-09-20  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-09-20 21:39 | Rapikan requirement ke struktur standar; HJ-05…08; PROP-HJ-01; sync Skip Wave UG `source_version` 1.2 |
| 1.0 | 2026-09-20 21:13 | Initial: pola primary vs derived jobs; pipeline Skip Wave (validasi artifact Claude + kode) |

## Cara menambah pipeline menu lain

1. Buat `pipelines/{menu-slug}.md` (AS-IS dari kode; metrik Horizon = Observasi berlabel tanggal).
2. Tambah baris di tabel Pipelines di atas.
3. Link dari `technical.md` menu terkait (link-out, jangan duplikasi panjang).
4. Update `manifest.yaml` `code_globs` / aliases bila perlu + `generate-lookup.py`.
