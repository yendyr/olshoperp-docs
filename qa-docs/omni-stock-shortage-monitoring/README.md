# Stock Shortage Monitoring — Dokumentasi QA

Menu **Stock Shortage Monitoring** (Omni Channel → Report Omni) — report agregat kebutuhan stok per SKU dari order yang masih di Unassign Wave.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v1.1) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v1.1) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v1.1) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v1.0) | Publish | review |

**UI route:** `/omni/stock-shortage-monitoring`  
**Origin:** [ETM-16168](https://erpintegration.atlassian.net/browse/ETM-16168) (Improvement, RE-OPEN)  
**Fix Done (wajib di docs):** [ETM-16583](https://erpintegration.atlassian.net/browse/ETM-16583) bundle qty 2× · [ETM-16593](https://erpintegration.atlassian.net/browse/ETM-16593) toggle shortage + pagination  
**Mockup:** https://claude.ai/artifact/Gm58SRuYh4eqR5KVx8gzxo  
**3 layer:** 1.1 · **Last updated:** 2026-10-30

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-10-30 | Initial 5-file dari ETM-16168 + AS-IS kode + fix 16583/16593; gap RE-OPEN export/Avail dicatat |
| 1.1 | 2026-10-30 | requirement §8 + A-15: teks tooltip & label QTY SHORT (TO-BE ETM-16958). KB/technical hanya version lockstep; user-guide tidak diubah (tooltip belum live) |

## Related

- [Unassign Wave](../omni-unassign-wave/README.md) — populasi order
- [Real Time Stock](../supplychain-real-stock/README.md) — cross-check Avail
- [Sales Order General](../businessdevelopment-sales-order-general/README.md) / Sales Platform — sumber SO

**Maintenance owner:** QA — Yemima

## Test Cases

- [TC-SSM-DATA-001](test-cases/TC-SSM-DATA-001.md) — validasi data vs SO/BoM/Real Time Stock (ETM-16583)
