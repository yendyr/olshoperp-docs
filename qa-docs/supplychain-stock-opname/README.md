# Stock Opname — QA Documentation

| Layer | File | Status | Version |
|-------|------|--------|---------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | draft | 1.1 |
| Requirement | [requirement.md](./requirement.md) | draft | 1.2 |
| Technical | [technical.md](./technical.md) | draft | 1.1 |
| User Guide | — | pending | — |

**Menu:** Stock Opname · **Route:** `supplychain/stock-opname` · **Module:** SupplyChain  
**Related:** [Stock Opname Approval](../accounting-stock-opname-approval/) · [Opening Stock](../accounting-opening-stock/) (engine shared)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-09-18 09:45 | GAP-SOPNAME-01: unit price desimal TO-BE (selaras Purchase Order); qty manual tetap bilangan bulat; cross-ref Opening Stock |
| 1.1 | 2026-07-09 | Relasi Benchmark COGS · Stock Remapping |
| 1.0 | 2026-06-19 | Draft awal dari codebase |

## Test cases (automated)

| TC | File | Status |
|----|------|--------|
| TC-SOPNAME-001 | [test-cases/TC-SOPNAME-001.md](./test-cases/TC-SOPNAME-001.md) | passed |
| TC-SOPNAME-002 | [test-cases/TC-SOPNAME-002.md](./test-cases/TC-SOPNAME-002.md) | passed |
| TC-SOPNAME-003 | [test-cases/TC-SOPNAME-003.md](./test-cases/TC-SOPNAME-003.md) | passed |
| TC-SOPNAME-004 | [test-cases/TC-SOPNAME-004.md](./test-cases/TC-SOPNAME-004.md) | passed |

Spec: `tests/specs/stock-opname/`  
Company: `lumicharmsid` (153)

**Maintenance owner:** QA — Yemima
