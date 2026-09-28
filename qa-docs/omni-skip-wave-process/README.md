# Skip Wave Process — Dokumentasi QA

Menu **Skip Wave Process** (SupplyChain / OmniChannel).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator (Lingo index) | review |
| Capability Lingo | [capabilities/](./capabilities/) | Operator (modal cards) | review |

**SoT:** `skip-wave-process-sot.md` v1.0 (20 Jul 2026)  
**User-guide:** v1.3 · `source_version` 1.4  
**Version (3 layer):** **1.4** · **Last updated:** 2026-09-28  
**Feature Map / Lingo:** v1.0 (2026-09-28)  
**Horizon jobs (kanonik):** [../horizon-jobs/pipelines/skip-wave-process.md](../horizon-jobs/pipelines/skip-wave-process.md)  
**Help Center overview:** [overview.id.md](../_meta/docs-hub/menus/omni-skip-wave-process/overview.id.md) · [overview.en.md](../_meta/docs-hub/menus/omni-skip-wave-process/overview.en.md) (`authored` dari Gemini brief Part 2)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| fm-1.0 | 2026-09-28 16:20 | Feature Map + 6 kartu Lingo (Upload, Processing Date, All-or-nothing, Progress, Redispatch, Log Data) |
| hc-1.0 | 2026-09-28 14:21 | Help Center overview ID + EN: upload massal, all-or-nothing, antrean global, Processing Date snapshot & gagal belakangan di Wave, Redispatch |
| 1.4 | 2026-09-28 11:00 | Processing Date AS-IS: arti proses batch, default kosong = waktu sekarang, order lebih baru gagal di Wave (bukan Import); kolom Export; ukuran file mengikuti limit server; promote 4 layer ke review |
| 1.3 | 2026-09-25 12:59 | Technical: perf datalist + reliability Sep 2026 (ETM-15972…16037) — defer/cache agg, redispatch, DO guards, optimized skip flow |
| ug-1.2 | 2026-09-20 21:39 | Sync user-guide: Redispatch, completed vs pekerjaan latar, link Horizon Jobs |
| 1.2 | 2026-09-20 21:13 | Dokumentasi pergerakan Horizon jobs (primary + derived); link ke horizon-jobs pipeline |
| 1.1 | 2026-07-28 | TO-BE Processing Order Date per company (shared Unassign Wave); GAP-SW-05 superseded |
| 1.0 | 2026-07-20 | Initial 5-file dari SoT v1.0 + verifikasi ImportJob/cron/gaps SW-01…05 |
| ug-1.1 | 2026-07-28 | Sync user-guide ke sumber 1.1 |
| ug-1.0 | 2026-07-20 | Tambah `user-guide.md` v1.0 |

## Related menus

| Menu | Link |
|------|------|
| Horizon Jobs | [../horizon-jobs/](../horizon-jobs/) — pipeline queue / job turunan (lintas menu) |
| Unassign Wave | [../omni-unassign-wave/](../omni-unassign-wave/) — reuse `SOApproveToWave` + Send Wave Logs; **shared Processing Date** |
| Skip Processing | [../omni-skip-processing/](../omni-skip-processing/) — reuse jobs + logs sampai Shipped |
| Order Process | [../omni-process-summary/](../omni-process-summary/) — pantau/PL/resi (bukan upload skip wave) |

**Maintenance owner:** QA — Yemima
