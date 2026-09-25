# Skip Wave Process — Dokumentasi QA

Menu **Skip Wave Process** (SupplyChain / OmniChannel).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | draft |

**SoT:** `skip-wave-process-sot.md` v1.0 (20 Jul 2026)  
**User-guide:** v1.2 · `source_version` 1.2  
**Version (3 layer):** technical **1.3** · requirement/KB 1.2 · **Last updated:** 2026-09-25  
**Horizon jobs (kanonik):** [../horizon-jobs/pipelines/skip-wave-process.md](../horizon-jobs/pipelines/skip-wave-process.md)  
**Implementer brief:** `~/Downloads/processing-order-date-unassign-skip-wave-implementer-brief.md`

## Changelog

| Version | Date | Changes |
|---------|------|---------|
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
| Unassign Wave | [../omni-unassign-wave/](../omni-unassign-wave/) — reuse `SOApproveToWave` + Send Wave Logs; **shared Processing Order Date** |
| Skip Processing | [../omni-skip-processing/](../omni-skip-processing/) — reuse jobs + logs sampai Shipped |
| Order Process | [../omni-process-summary/](../omni-process-summary/) — pantau/PL/resi (bukan upload skip wave) |

**Maintenance owner:** QA — Yemima
