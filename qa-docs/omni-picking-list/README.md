---
doc_type: README
menu: omni-picking-list
menu_name: "Picking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
---

# Picking List (Omni / SCM Processing)

Menu operasional **picking list** gudang: datalist PL + halaman process (start → pick/unpick → complete).

| | |
|--|--|
| **UI** | `/omni/picking-list` · edit `/omni/picking-list/edit/:id` |
| **Sidebar** | Supply Chain › Processing › Picking List |
| **Modul** | SupplyChain / OmniChannel |
| **SoT** | [`_meta/sot/omni-picking-list-source-of-truth.md`](../_meta/sot/omni-picking-list-source-of-truth.md) v1.0 |
| **Improvement** | [ETM-16131](https://erpintegration.atlassian.net/browse/ETM-16131) (UI/UX process) |

## Bukan menu ini

| Menu | Route | Catatan |
|------|-------|---------|
| Manual Picking List | `/supplychain/manual-picking-list` | Create manual; `process_type` berbeda |
| Picking Process (Omni) | `/omni/picking-process` | Entry scan → redirect ke process PL yang sama (TO-BE) |

## Layer docs

| Layer | File | Status | Audience |
|-------|------|--------|----------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | draft | Operator / support |
| Requirement | [requirement.md](./requirement.md) | draft | PM / QA |
| Technical | [technical.md](./technical.md) | draft | Developer |
| User Guide | [user-guide.md](./user-guide.md) | draft | End user |
| Feature Map | [feature-map.md](./feature-map.md) | draft | Lingo / Help Center |
| Test Cases | [test-cases/README.md](./test-cases/README.md) | draft | QA |

## Related

- [Manual Picking List](../supplychain-manual-picking-list/README.md)
- [Skip Wave Process](../omni-skip-wave-process/README.md) · [Skip Processing](../omni-skip-processing/README.md)
- [Horizon Jobs](../horizon-jobs/README.md) (pipeline fulfillment)
