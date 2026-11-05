---
doc_type: README
menu: omni-checking-list
menu_name: "Checking List"
version: 1.1
last_updated: 2026-11-05
owner: QA - Yemima
status: review
---

# Checking List (Omni / SCM Processing)

Menu **checking / QC** setelah picking: set location → check items → optional Replace defective → Complete.

| | |
|--|--|
| **UI** | `/omni/checking-list` · edit `/omni/checking-list/edit/:id` · set-location `/omni/checking-list/set-location/:id` |
| **Sidebar** | Omni / Supply Chain › Processing › Checking List |
| **Modul** | SupplyChain / OmniChannel |
| **SoT** | [`_meta/sot/omni-checking-list-source-of-truth.md`](../_meta/sot/omni-checking-list-source-of-truth.md) v1.0 |
| **Improvement** | [ETM-16138](https://erpintegration.atlassian.net/browse/ETM-16138) (UI/UX process + scrap/replace) · [ETM-17110](https://erpintegration.atlassian.net/browse/ETM-17110) (void di Wave melepas reserved) |

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-11-05 16:55 | Saat Void di Checking List dan order masih di Wave, stok yang ditahan kembali bisa dijual, sama seperti void Sales Order (ETM-17110) |
| 1.0 | 2026-09-29 | Initial Checking List: check, replace, Complete, Continue vs Void (ETM-16138) |
| **Wireframe** | https://claude.ai/artifact/WokXLb4E1JMVEvNAKgKjKk |

## Layer docs

| Layer | File | Status | Audience |
|-------|------|--------|----------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review | Operator / support |
| Requirement | [requirement.md](./requirement.md) | review | PM / QA |
| Technical | [technical.md](./technical.md) | review | Developer |
| User Guide | [user-guide.md](./user-guide.md) | review | End user |
| Feature Map | [feature-map.md](./feature-map.md) | review | Lingo / Help Center |

## Related

- [Picking List](../omni-picking-list/README.md) · [Packing List](../omni-packing-list/README.md)
- [Skip Wave](../omni-skip-wave-process/README.md) · [Skip Processing](../omni-skip-processing/README.md)
- Instant Settlement — CL belum selesai → order belum Shipped
