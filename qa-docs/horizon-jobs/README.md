# Horizon Jobs — Dokumentasi QA (cross-menu)

Konsep **pipeline queue / Horizon** OlshopERP: job primer per menu vs job turunan (observer, stok, audit). Bukan satu menu UI — dipakai saat investigasi antrean, batch macet, atau beban worker.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Ops, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

## Dua lapisan docs (jangan campur peran)

| Lapisan | Path | Peran |
|---------|------|-------|
| **Hub QA (aturan + pipeline kanonik)** | folder ini (`horizon-jobs/`) | HJ-01…08, primary vs derived, pipeline Skip Wave detail, ops troubleshooting |
| **Job-flow per menu (visual / share)** | [`../_meta/horizon-jobs/`](../_meta/horizon-jobs/) | Alur job end-to-end + HTML/Artifact per menu (Settlement Upload, Sales Order, …) |

Keduanya **melengkapi** `qa-docs/{menu-slug}/` (requirement bisnis tetap di rumah menu).

## Pipelines terdokumentasi

| Pipeline | Menu terkait | Docs | Status |
|----------|--------------|------|--------|
| Skip Wave Process | [omni-skip-wave-process](../omni-skip-wave-process/) | [pipelines/skip-wave-process.md](./pipelines/skip-wave-process.md) (kanonik) · [peta/artifact di `_meta`](../_meta/horizon-jobs/README.md) | review |
| Settlement Upload | [accounting-settlement-upload](../accounting-settlement-upload/) | [`_meta/…/settlement-upload.md`](../_meta/horizon-jobs/settlement-upload.md) (+ HTML/Artifact) | documented (`_meta`) |
| Sales Order | [all-sales-order](../all-sales-order/) | [`_meta/…/sales-order.md`](../_meta/horizon-jobs/sales-order.md) (+ HTML/Artifact) | documented (`_meta`) |

**Peta zoom-out (banyak menu):** [`_meta/horizon-jobs/index.html`](../_meta/horizon-jobs/index.html)

**Version (3 layer):** **1.3** · pipeline Skip Wave **1.1** · **Last updated:** 2026-09-28  
**User-guide:** v1.0 · `source_version` 1.3  
**Help Center overview:** belum  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.3 | 2026-09-28 14:13 | Link silang hub ↔ `_meta/horizon-jobs`; indeks Settlement Upload + Sales Order; klarifikasi dua lapisan docs |
| 1.2 | 2026-09-28 12:42 | Promote KB/requirement/technical/UG + pipeline Skip Wave ke **review**; PROP-HJ-01 tetap proposal; pipeline menu lain masih TBD |
| pipeline-1.1 | 2026-09-25 12:59 | Skip Wave pipeline: §8b reliability implemented (ETM-15972…16037) + file map *ListLogic / EB jobs |
| 1.1 | 2026-09-20 21:39 | Rapikan requirement ke struktur standar; HJ-05…08; PROP-HJ-01; sync Skip Wave UG `source_version` 1.2 |
| 1.0 | 2026-09-20 21:13 | Initial: pola primary vs derived jobs; pipeline Skip Wave (validasi artifact Claude + kode) |

## Cara menambah pipeline menu lain

1. **Detail QA / fan-out / observasi Horizon** → `pipelines/{menu-slug}.md` di folder ini (pola Skip Wave) + baris di tabel di atas.
2. **Job-flow visual + Artifact/HTML** → `{menu-slug}.md` (+ `.html`) di [`_meta/horizon-jobs/`](../_meta/horizon-jobs/) per README folder itu.
3. Link dari `technical.md` menu terkait (link-out, jangan duplikasi panjang).
4. Update `manifest.yaml` `code_globs` / aliases bila perlu + `generate-lookup.py`.
5. Selalu tautkan kedua lapisan bila keduanya ada (hindari dua SoT tanpa saling rujuk).
