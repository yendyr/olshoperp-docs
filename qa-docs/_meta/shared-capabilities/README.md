---
doc_type: shared-capabilities-index
version: 0.2
last_updated: 2026-07-27
status: draft
owner: QA - Yemima
---

# Shared Capabilities (SF Entry — global)

Baseline penjelasan sub-feature **lintas menu**. Menu merujuk ID yang sama lewat Feature Map; jangan copy-paste body ke tiap `requirement.md`.

## Struktur & tone kartu (Pentaho-style)

Setiap file capability memakai section tetap:

| Section | Isi |
|---------|-----|
| **Apa ini** | Definisi 1–3 kalimat (bahasa operator) |
| **Kapan dipakai** | Use case / tabel keputusan singkat |
| **Cara pakai** | Langkah bernomor; label UI **tebal** |
| **Catatan** | 1–5 batasan penting (bukan rumus/API) |
| **Contoh** | Opsional — wajib dipertimbangkan jika qty/angka/lifecycle |
| **Lihat juga** | Sibling SF + link requirement/Feature Map |

Tone: seperti user guide singkat, **bukan** acceptance criteria. Detail QA tetap di `requirement.md`.

Frontmatter: sertakan `summary:` (1–2 kalimat) untuk API/katalog.

| ID | File | Label UI |
|----|------|----------|
| SF-DL-01 / SF-DL-02 | [datalist-search-filter.md](./datalist-search-filter.md) | Global Search, Advanced Filter |
| SF-DL-03 | [show-deleted.md](./show-deleted.md) | Show Deleted |
| SF-DL-04 | [column-show-hide.md](./column-show-hide.md) | Column Show/Hide |
| SF-DL-05 | [export-with-without-detail.md](./export-with-without-detail.md) | Export (with/without detail) |
| SF-PRICE-01 | [dpp-vat-breakdown-display.md](./dpp-vat-breakdown-display.md) | DPP & VAT di detail |
| SF-LOG-01 / SF-LOG-02 | [approval-audit-log.md](./approval-audit-log.md) | Approval Log, Audit Log |

**Pilot:** [Purchase Invoice](../../accounting-supplier-invoice/) Feature Map.  
**Proposal:** [../proposals/feature-map-and-capability-lingo.md](../proposals/feature-map-and-capability-lingo.md)  
**Standar:** `.cursor/rules/qa-docs-standard.mdc` § Capability Lingo

Override per menu: tulis singkat di Feature Map kolom Detail, atau di `capabilities/` folder menu — jangan fork file shared kecuali perilaku benar-benar beda.
