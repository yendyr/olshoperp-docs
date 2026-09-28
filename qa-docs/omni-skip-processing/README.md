# Skip Processing — Dokumentasi QA

Menu **Skip Processing** (SupplyChain / OmniChannel).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator (Lingo index) | review |
| Capability Lingo | [capabilities/](./capabilities/) | Operator (modal cards) | review |

**SoT:** `omni-skip-processing-sot.md` v1.0 (19 Jul 2026)  
**User-guide:** v1.1 · `source_version` 1.2  
**Version (3 layer):** **1.2** · **Last updated:** 2026-09-28  
**Feature Map / Lingo:** v1.0 (2026-09-28)  
**Help Center overview:** belum (user akan tambah terpisah / Skip Wave dulu)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| fm-1.0 | 2026-09-28 16:20 | Feature Map + 4 kartu Lingo (aksi Skip, Progress, Log+Retry, Processing Date readonly) |
| 1.2 | 2026-09-28 11:08 | Promote 4 layer ke **review**; Processing Date / `now()` untuk trx skip; readonly UI; supersede SO+10m |
| 1.1 | 2026-09-25 12:59 | Technical: optimized skip flow + DO idempotency/deadlock (ETM-16006, 15988, 15999, 16037) |
| 1.0 | 2026-07-20 | Initial 5-file dari SoT v1.0 + verifikasi ProcessingService/jobs/locks/gaps SP-01…03 |
| ug-1.1 | 2026-09-28 | Sync user-guide ke sumber 1.2 |
| ug-1.0 | 2026-07-20 | Tambah `user-guide.md` v1.0 |

## Related menus

| Menu | Link |
|------|------|
| Unassign Wave | [../omni-unassign-wave/](../omni-unassign-wave/) — prasyarat Default Wave; **shared Processing Date** |
| Skip Wave Process | [../omni-skip-wave-process/](../omni-skip-wave-process/) — entry alternatif, pipeline sama |
| Order Process | [../omni-process-summary/](../omni-process-summary/) — pantau + PL + resi (bukan skip) |
| Waves Management | [../omni-waves-management/](../omni-waves-management/) — distribusi wave |

**Maintenance owner:** QA — Yemima
