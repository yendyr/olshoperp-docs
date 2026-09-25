# Skip Processing — Dokumentasi QA

Menu **Skip Processing** (SupplyChain / OmniChannel).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | draft |

**SoT:** `omni-skip-processing-sot.md` v1.0 (19 Jul 2026)  
**User-guide:** v1.0 · `source_version` 1.0 · generate atas permintaan (3 layer sumber masih draft — exception disetujui user)  
**Version:** technical **1.1** · **Last updated:** 2026-09-25

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-09-25 12:59 | Technical: optimized skip flow + DO idempotency/deadlock (ETM-16006, 15988, 15999, 16037) |
| 1.0 | 2026-07-20 | Initial 5-file dari SoT v1.0 + verifikasi ProcessingService/jobs/locks/gaps SP-01…03 |
| ug-1.0 | 2026-07-20 | Tambah `user-guide.md` v1.0 |

## Related menus

| Menu | Link |
|------|------|
| Unassign Wave | [../omni-unassign-wave/](../omni-unassign-wave/) — prasyarat Default Wave |
| Skip Wave Process | [../omni-skip-wave-process/](../omni-skip-wave-process/) — entry alternatif, pipeline sama |
| Order Process | [../omni-process-summary/](../omni-process-summary/) — pantau + PL + resi (bukan skip) |
| Waves Management | [../omni-waves-management/](../omni-waves-management/) — distribusi wave |

**Maintenance owner:** QA — Yemima
